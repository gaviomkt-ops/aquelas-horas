// Extrai o texto de um certificado no próprio navegador:
// - PDF com texto: lido direto (pdf.js);
// - PDF escaneado ou foto: OCR em português (tesseract.js).
// As bibliotecas só carregam quando o aluno envia um arquivo, para o app abrir rápido.
// O modelo de português do OCR (~10 MB) é baixado uma vez e fica em cache no aparelho.

let pdfjsPromise = null;
async function getPdfjs() {
  if (!pdfjsPromise) {
    // pdf.js 3.11 (o 4.x travou ao desenhar a página nos testes). A falha CVE-2024-4367 fica fechada
    // com isEvalSupported: false, que é a mitigação indicada no próprio alerta de segurança.
    pdfjsPromise = Promise.all([import('pdfjs-dist'), import('pdfjs-dist/build/pdf.worker.min.js?url')]).then(([lib, worker]) => {
      const pdfjs = lib.default?.getDocument ? lib.default : lib;
      pdfjs.GlobalWorkerOptions.workerSrc = worker.default;
      return pdfjs;
    });
  }
  return pdfjsPromise;
}

async function readPdf(file, onProgress) {
  const pdfjs = await getPdfjs();
  const data = new Uint8Array(await file.arrayBuffer());
  // isEvalSupported: false impede que um PDF com fonte adulterada execute código (CVE-2024-4367)
  const doc = await pdfjs.getDocument({ data, isEvalSupported: false }).promise;
  let text = '';
  const pages = Math.min(doc.numPages, 2);
  for (let i = 1; i <= pages; i++) {
    const page = await doc.getPage(i);
    const content = await page.getTextContent();
    let lastY = null;
    for (const item of content.items) {
      const y = item.transform?.[5];
      if (lastY !== null && Math.abs(y - lastY) > 4) text += '\n';
      text += item.str + (item.hasEOL ? '\n' : ' ');
      lastY = y;
    }
    text += '\n';
  }
  // pouco texto = PDF que é só imagem (escaneado, exportado do Canva como imagem…): faz OCR da 1ª página
  if (text.replace(/\s/g, '').length >= 60) return { text, source: 'pdf' };
  onProgress?.(0.1, 'Lendo a imagem do PDF');
  const page = await doc.getPage(1);
  const base = page.getViewport({ scale: 1 });
  const scale = Math.min(3, 2200 / Math.max(base.width, base.height));
  const viewport = page.getViewport({ scale });
  const canvas = document.createElement('canvas');
  canvas.width = Math.round(viewport.width);
  canvas.height = Math.round(viewport.height);
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#fff';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  await page.render({ canvasContext: ctx, viewport }).promise;
  const ocr = await ocrCanvas(prepare(canvas), onProgress);
  return { text: `${text}\n${ocr}`, source: 'ocr' };
}

async function readImage(file, onProgress) {
  const bitmap = await loadImage(file);
  const longSide = Math.max(bitmap.width, bitmap.height);
  const scale = Math.min(2.5, Math.max(1, 2000 / longSide));
  const canvas = document.createElement('canvas');
  canvas.width = Math.round(bitmap.width * scale);
  canvas.height = Math.round(bitmap.height * scale);
  canvas.getContext('2d').drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  const text = await ocrCanvas(prepare(canvas), onProgress);
  return { text, source: 'ocr' };
}

function loadImage(file) {
  if ('createImageBitmap' in window) return createImageBitmap(file);
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = URL.createObjectURL(file);
  });
}

// Tons de cinza + contraste; certificados de fundo escuro (texto claro) são invertidos para o OCR.
function prepare(canvas) {
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  const img = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const d = img.data;
  let sum = 0;
  for (let i = 0; i < d.length; i += 4) {
    const g = 0.299 * d[i] + 0.587 * d[i + 1] + 0.114 * d[i + 2];
    d[i] = d[i + 1] = d[i + 2] = g;
    sum += g;
  }
  const mean = sum / (d.length / 4);
  const invert = mean < 110;
  for (let i = 0; i < d.length; i += 4) {
    let g = d[i];
    if (invert) g = 255 - g;
    g = Math.max(0, Math.min(255, (g - 128) * 1.35 + 128));
    d[i] = d[i + 1] = d[i + 2] = g;
  }
  ctx.putImageData(img, 0, 0);
  return canvas;
}

async function ocrCanvas(canvas, onProgress) {
  const { createWorker } = await import('tesseract.js');
  onProgress?.(0.15, 'Preparando a leitura');
  const worker = await createWorker('por', 1, {
    logger: (m) => {
      if (m.status === 'recognizing text') onProgress?.(0.3 + m.progress * 0.7, 'Lendo o certificado');
      else if (/loading|initializ/i.test(m.status)) onProgress?.(0.15 + (m.progress || 0) * 0.15, 'Preparando a leitura');
    },
  });
  try {
    const { data } = await worker.recognize(canvas);
    return data.text || '';
  } finally {
    await worker.terminate();
  }
}

export async function readCertificateText(file, onProgress) {
  const isPdf = file.type === 'application/pdf' || /\.pdf$/i.test(file.name || '');
  if (isPdf) return readPdf(file, onProgress);
  if (file.type?.startsWith('image/')) return readImage(file, onProgress);
  throw new Error('Formato não suportado para leitura automática.');
}
