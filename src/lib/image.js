// Reduz fotos antes de enviar (certificado fotografado no celular costuma ter 4–8 MB).
// PDFs e arquivos que o navegador não consegue abrir seguem como estão.
// 1600 px / 0,78 deixa a foto legível e perto de 300 KB (o plano grátis do Supabase tem 1 GB de arquivos).
export async function compressImage(file, maxSide = 1600, quality = 0.78) {
  if (!file || !file.type?.startsWith('image/') || file.type === 'image/gif') return file;
  try {
    const bitmap = await loadBitmap(file);
    const scale = Math.min(1, maxSide / Math.max(bitmap.width, bitmap.height));
    if (scale === 1 && file.size < 900 * 1024) return file;
    const canvas = document.createElement('canvas');
    canvas.width = Math.round(bitmap.width * scale);
    canvas.height = Math.round(bitmap.height * scale);
    canvas.getContext('2d').drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    const blob = await new Promise((res) => canvas.toBlob(res, 'image/jpeg', quality));
    if (!blob) return file;
    const name = (file.name || 'imagem').replace(/\.[^.]+$/, '') + '.jpg';
    return new File([blob], name, { type: 'image/jpeg' });
  } catch {
    return file;
  }
}

function loadBitmap(file) {
  if ('createImageBitmap' in window) return createImageBitmap(file);
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = URL.createObjectURL(file);
  });
}

export const MAX_FILE_MB = 10;
