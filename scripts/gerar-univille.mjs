// Gera src/data/acg/univille.json a partir da tabela do relatório (Regulamentos ACG em Joinville.md, seção Univille).
// Rodar: node scripts/gerar-univille.mjs
import { writeFileSync } from 'node:fs';
const P = (f) => `Univille/Univille - ${f}`;
const SEJA = 'https://seja.univille.br/wp-content/uploads/2026/04/';
// [id, nome, matriz, h/a, h, arquivo, extras]
const v = (id, nome, matriz, ha, h, arq, extra = {}) => ({
  id, nome, matriz: { codigo: matriz },
  horas: ha == null
    ? { valor: null, unidade: null, situacao: extra.situacao || 'a_confirmar', fonte: extra.fonte || '' }
    : { valor: ha, unidade: 'h/a', equivalente: { valor: h, unidade: 'h' }, situacao: ha === 0 ? 'zero_a_confirmar' : 'verificado', fonte: extra.fonte || 'linha "Atividades Complementares" da matriz do PPC' },
  pdf: arq ? [P(arq)] : [],
  ...(extra.regulamento ? { regulamento_ppc: extra.regulamento } : {}),
  ...(extra.a_confirmar ? { a_confirmar: extra.a_confirmar } : {}),
  ...(extra.alertas ? { alertas: extra.alertas } : {}),
  ...(extra.extensao ? { extensao: extra.extensao } : {}),
});
const ENGETEC = 'Regulamento Engetec (comum às engenharias e à SI): entrega na secretaria à medida que as atividades são feitas; só conta o que foi feito após o início do curso; estágio não obrigatório vale 40 h por ano, até 80 h.';
const EXT_NAO = (f) => ({ mesma_hora_conta_nas_duas: 'nao', regra: f, fonte: 'PPC do curso' });

const comAlternativa = (c, alt) => { c.horas.alternativa = alt; return c; };
const cursos = [
  v('ADM-2021', 'Administração', 'Matriz 2021', 144, 120, 'PPC-Administracao-Joinville-para-ingressantes-a-partir-de-2022.pdf', { a_confirmar: ['O PPC não traz regulamento de AC.'] }),
  v('ADM-2022', 'Administração', 'Matriz 2022', 180, 150, 'PPC-Administracao-Joinville-para-ingressantes-a-partir-de-2022.pdf', { a_confirmar: ['O PPC não traz regulamento de AC.'] }),
  v('ARQ', 'Arquitetura e Urbanismo', 'Ingressantes a partir de 2021/1', 432, 360, 'PPC-Arquitetura-e-Urbanismo-Joinville-para-ingressantes-a-partir-de-2021-1.pdf', { a_confirmar: ['Capa do regulamento com "Parecer nº XXX".'] }),
  v('CBIO-B', 'Ciências Biológicas (bacharelado)', 'Ingressantes a partir de 2022', 72, 60, 'PPC-Bacharelado-Ciencias-Biologicas-para-ingressantes-a-partir-de-2022.pdf'),
  v('CBIO-L', 'Ciências Biológicas (licenciatura)', 'Ingressantes a partir de 2023', 102, 85, 'PPC Licenciatura Ciencias Biologicas ingressantes a partir de 2023.pdf', { a_confirmar: ['Anexo do regulamento ausente ou em branco.'] }),
  v('CONT-2022', 'Ciências Contábeis', 'Ingressantes 2022', 216, 180, 'PPC-Ciencias-Contabeis-Joinville-Ingressantes-2022.pdf', { a_confirmar: ['O mesmo PPC tem duas matrizes.'] }),
  v('CONT-2024', 'Ciências Contábeis', 'A partir de 2024/1', 252, 210, 'PPC-Ciencias-Contabeis-Joinville-Ingressantes-2022.pdf', { a_confirmar: ['O mesmo PPC tem duas matrizes.'] }),
  v('CINE', 'Cinema e Audiovisual', 'Ingressantes a partir de 2023/1', 150, 125, 'PPC-Cinema-para-ingressantes-a-partir-de-2023-1.pdf'),
  v('COMEX', 'Comércio Exterior', 'Ingressantes a partir de 2024/2', null, null, 'PPC-Comercio-Exterior-para-ingressantes-a-partir-de-2024-2.pdf', { a_confirmar: ['O PPC traz duas matrizes: 252 h/a (210 h) e 288 h/a (240 h). O relatório não diz qual vale para cada ingressante.'], alertas: [{ nivel: 'medio', texto: 'Duas cargas no mesmo PPC (252 h/a e 288 h/a). Confirmar com a coordenação.' }] }),
  v('DESIGN', 'Design (todas as linhas)', 'Ingressantes a partir de 2021', 192, 160, 'PPC-Design-para-ingressantes-a-partir-de-2021.pdf', { regulamento: 'Regulamento de 10/12/2015: o aluno "deverá cumprir até" 10% em ensino, 5% em pesquisa e 85% em extensão.', alertas: [{ nivel: 'medio', texto: 'Regulamento de 2015. A redação "deverá cumprir até" deixa dúvida se os percentuais são mínimos ou máximos.' }] }),
  comAlternativa(v('DIR', 'Direito', 'Ingressantes a partir de 2021 (atualizações dez/2025)', 288, 240, 'PPC-Direito-para-ingressantes-a-partir-de-2021-com-atualizacoes-em-dez.25-1.pdf', {
    regulamento: 'Anexo II, Consun 17/03/2022. Quatro categorias (ensino, pesquisa, extensão e não acadêmicas), cada uma com teto de 50%; as não acadêmicas até 25%. Cursos online podem cobrir 25% da carga exigida. Envio por e-mail para direito@univille.br somente no 10º semestre, até 31 de maio ou 31 de outubro. Quem não cumprir fica impedido de colar grau.',
    extensao: EXT_NAO('Extensão só conta como AC se as horas não tiverem sido computadas como requisitos de outros componentes.'),
    alertas: [
      { nivel: 'alto', texto: 'O regulamento diz 240 horas/aula, mas a matriz traz 288 h/a = 240 h. Tudo indica erro de unidade no regulamento. Confirmar com a Coordenação de Direito.' },
      { nivel: 'alto', texto: 'O arquivo publicado como "PPC-2021.pdf" do Direito é, na verdade, o PPC de 2015 (336 h/a e outro procedimento). Não usar.' }
    ],
    a_confirmar: ['Regulamento: 240 h/aula. Matriz: 288 h/a (= 240 h).']
  }), { valor: 240, unidade: 'h/a', origem: 'regulamento (Anexo II) do PPC; a matriz traz 288 h/a = 240 h' }),
  v('EDF-B', 'Educação Física (bacharelado)', 'Ingressantes a partir de 2025/1', 0, 0, 'PPC-Educacao-Fisica-Bacharelado-para-ingressantes-a-partir-de-2025-1.pdf', { a_confirmar: ['AC = 0 na matriz. Confirmar com a coordenação.'] }),
  v('ENF-2023', 'Enfermagem', 'Ingressantes a partir de 2023', 150, 125, '08.-PPC-Enfermagem-para-ingressantes-a-partir-de-2023.pdf'),
  v('EAMB', 'Engenharia Ambiental e Sanitária', 'Ingressantes a partir de 2021/1', 84, 70, 'PPC-Engenharia-Ambiental-e-Sanitaria-para-ingressantes-a-partir-de-2021-1.pdf', { regulamento: ENGETEC, extensao: EXT_NAO('O regulamento Engetec segue a regra de não contar a mesma atividade nos dois componentes (conforme o relatório).') }),
  v('ECIV', 'Engenharia Civil', 'Ingressantes a partir de 2021', 348, 290, 'PPC-Engenharia-Civil-para-ingressantes-a-partir-de-2021.pdf', { regulamento: ENGETEC, extensao: EXT_NAO('O regulamento Engetec segue a regra de não contar a mesma atividade nos dois componentes (conforme o relatório).') }),
  v('EMEC', 'Engenharia Mecânica', 'Ingressantes a partir de 2021', 312, 260, 'PPC-Engenharia-Mecanica-Joinville-para-ingressantes-a-partir-de-2021.pdf', { regulamento: ENGETEC, extensao: EXT_NAO('O regulamento Engetec segue a regra de não contar a mesma atividade nos dois componentes (conforme o relatório).') }),
  v('EPROD', 'Engenharia de Produção', 'Ingressantes a partir de 2021', 312, 260, 'PPC-Engenharia-Producao-Joinville-para-ingressantes-a-partir-de-2021.pdf', { regulamento: ENGETEC, extensao: EXT_NAO('O regulamento Engetec segue a regra de não contar a mesma atividade nos dois componentes (conforme o relatório).') }),
  v('EQUI', 'Engenharia Química', 'Ingressantes a partir de 2025/1', 78, 65, 'PPC-Engenharia-Quimica-Joinville-para-ingressantes-a-partir-de-2025-1.pdf', { regulamento: ENGETEC, extensao: EXT_NAO('O regulamento Engetec segue a regra de não contar a mesma atividade nos dois componentes (conforme o relatório).') }),
  v('ESOFT', 'Engenharia de Software', 'Ingressantes a partir de 2021', 216, 180, 'PPC-Engenharia-de-Software-Joinville-para-ingressantes-a-partir-de-2021.pdf', { regulamento: ENGETEC, extensao: EXT_NAO('O regulamento Engetec segue a regra de não contar a mesma atividade nos dois componentes (conforme o relatório).') }),
  v('FARM', 'Farmácia', 'Ingressantes a partir de 2022/2', 144, 120, '05.-PPC-Farmacia-para-ingressantes-a-partir-de-2022-2.pdf'),
  v('FISIO', 'Fisioterapia', 'Ingressantes a partir de 2024', 162, 135, 'PPC-Fisioterapia-para-ingressantes-a-partir-de-2024.pdf'),
  v('GASTRO', 'Gastronomia', 'Ingressantes a partir de 2022', 200, 167, 'PPC-Gastronomia-para-ingressantes-a-partir-de-2022.pdf'),
  v('HIST', 'História (licenciatura)', 'Ingressantes a partir de 2022', null, null, 'PPC Historia ingressantes a partir de 2022.pdf', {
    situacao: 'contraditorio',
    a_confirmar: ['O PPC traz três números: 80 h/a (67 h) na matriz, 240 h/a e 200 h no texto. Anexo 6 em branco; cita a Res. 04/08/Cepe, não publicada.'],
    alertas: [{ nivel: 'alto', texto: 'Três cargas diferentes no mesmo PPC (80 h/a na matriz, 240 h/a e 200 h no texto). Confirmar com a Coordenação de História.' }]
  }),
  v('MED', 'Medicina', 'Ingressantes a partir de 2022', 90, 75, 'PPC-Medicina-para-ingressantes-a-partir-de-2022.pdf', {
    regulamento: 'Anexo I, Consun 01/08/2019. Documentos entregues até dois meses antes do fim do 12º semestre; horas lançadas no sistema Saturno.',
    extensao: { mesma_hora_conta_nas_duas: 'parcial', regra: 'O PPC da Medicina inclui as atividades complementares dentro da conta dos 10% de extensão.', fonte: 'PPC Medicina' }
  }),
  v('NUT', 'Nutrição', 'Ingressantes a partir de 2023/1', 63, 52, 'PPC-Nutricao-para-ingressantes-a-partir-de-2023-1.pdf'),
  v('PED', 'Pedagogia', 'Ingressantes a partir de 2021', 0, 0, 'PPC-Pedagogia-para-ingressantes-a-partir-de-2021.pdf', { a_confirmar: ['AC = 0 na matriz. Confirmar com a coordenação.'] }),
  v('PSI', 'Psicologia', 'Ingressantes a partir de 2022/1', 272, 227, 'PPC-Psicologia-para-ingressantes-a-partir-de-2022-1.pdf', { regulamento: 'Anexo II, Consun 16/04/2026 (o mais novo). Exige atividade em pelo menos dois eixos; aceita até 150 horas online; entrega apenas em outubro.' }),
  v('PP', 'Publicidade e Propaganda', 'Ingressantes a partir de 2022/1', 120, 100, 'PPC-Publicidade-e-Propaganda-para-ingressantes-a-partir-de-2022-1.pdf', { regulamento: 'Anexo II, Consun 20/05/2021. Exige no mínimo três atividades distintas.' }),
  v('SI', 'Sistemas de Informação', 'Ingressantes a partir de 2021/1', 48, 40, 'PPC-Sistemas-Informacao-para-ingressantes-a-partir-de-2021-1.pdf', { regulamento: ENGETEC, extensao: EXT_NAO('O regulamento Engetec segue a regra de não contar a mesma atividade nos dois componentes (conforme o relatório).') }),
];
// PPCs cuja carga de AC não foi verificada
const nv = [
  ['ARTV', 'Artes Visuais (bacharelado)', 'Ingressantes a partir de 2021/1', 'PPC-Artes-Visuais-Bacharelado-para-ingressantes-a-partir-de-2021-1.pdf'],
  ['ECON', 'Ciências Econômicas', 'Ingressantes a partir de 2022', 'PPC-Ciencias-Economicas-para-ingressantes-a-partir-de-2022.pdf'],
  ['RELIG', 'Ciências da Religião', 'Ingressantes a partir de 2022/1', 'PPC-Ciencias-da-Religiao-para-ingressantes-a-partir-de-2022-1.pdf'],
  ['QUILOM', 'Educação Escolar Quilombola', 'Ingressantes a partir de 2022', 'PPC-Educacao-Escolar-Quilombola-para-ingressantes-a-partir-de-2022.pdf'],
  ['ESPECIAL', 'Educação Especial', 'PPC set/2026', 'PPC-Educacao-Especial-set-2026.pdf'],
  ['EDF-L', 'Educação Física (licenciatura)', 'Ingressantes a partir de 2025/1', 'PPC-Educacao-Fisica-Licenciatura-para-ingressantes-a-partir-2025-1.pdf'],
  ['ENF-2022', 'Enfermagem', 'Ingressantes até 2022', '02.-PPC-Enfermagem-para-ingressantes-ate-2022.pdf'],
  ['GEO', 'Geografia', 'Ingressantes a partir de 2022', 'PPC-Geografia-para-ingressantes-a-partir-de-2022.pdf'],
  ['LET-B', 'Letras (bacharelado)', 'Ingressantes a partir de 2021', 'PPC-Letras-Bacharelado-para-ingressantes-a-partir-de-2021.pdf'],
  ['LET-L', 'Letras (licenciatura)', 'Ingressantes a partir de 2021/1', 'PPC-Letras-Licenciatura-para-ingressantes-a-partir-de-2021-1.pdf'],
  ['ODONTO', 'Odontologia', 'Ingressantes a partir de 2022/1', 'PPC-Odontologia-para-ingressantes-a-partir-de-2022-1.pdf'],
].map(([id, nome, m, arq]) => v(id, nome, m, null, null, arq, { situacao: 'nao_verificado', a_confirmar: ['A carga de AC deste PPC não foi verificada na pesquisa.'] }));

const inst = {
  id: 'univille',
  nome: 'Univille (Universidade da Região de Joinville)',
  sigla: 'Univille',
  tipo: 'universidade',
  campus: 'Joinville',
  pasta_documentos: 'Univille',
  requisito_nome: 'Atividades Complementares (licenciaturas antigas: AACC)',
  resumo: 'O regulamento mora no anexo de cada PPC. Os PPCs dizem que as AC são regidas pela "Resolução vigente da Univille", sem número. A carga vem da matriz de cada curso (h/a e h, com h = h/a × 5/6).',
  normas: [
    { id: 'regimento', numero: 'Regimento Geral (atualizado em maio/2021), art. 104', data: '2021-05', status: 'vigente', nota: 'Remete a avaliação das AC a regulamentos próprios do curso, aprovados pelo Conselho Universitário.', url: 'https://www.univille.edu.br/community/novoportal/VirtualDisk.html/downloadDirect/2698690/RegimentoUniville_atualizado_maio21.pdf', pdf: 'Univille/Univille - Regimento Geral (atualizado maio 2021).pdf' },
    { id: 'res-53-25-consun', numero: 'Res. 53/25 Consun', data: '2025-12-11', status: 'vigente', nota: 'Atualizou quase todos os PPCs. Os PPCs nasceram da Inovação Curricular (Res. 19/20 Consun).', url: 'https://univille.edu.br/community/novoportal/VirtualDisk.html/downloadDirect/4028401/Guia_academico_geral2025_FINAL.pdf', pdf: 'Univille/Univille - Guia Academico Geral 2025.pdf' },
    { id: 'res-04-08-cepe', numero: 'Res. 04/08/Cepe', data: '2008', status: 'nao_publicada', nota: 'Única resolução institucional de AC citada por número (no PPC de História). Não está publicada.', url: 'https://seja.univille.br/wp-content/uploads/2025/12/PPC-Historia-para-ingressantes-a-partir-de-2022.pdf', pdf: '' }
  ],
  regras_gerais: [
    { texto: 'Direito: quatro categorias (ensino, pesquisa, extensão, não acadêmicas), cada uma com teto de 50%, salvo as não acadêmicas (25%). Online pode cobrir 25% da carga exigida.', fonte: 'PPC Direito' },
    { texto: 'Psicologia: atividade em pelo menos dois eixos; até 150 horas online; entrega só em outubro.', fonte: 'PPC Psicologia' },
    { texto: 'Engenharias, SI (Engetec): entrega à medida que as atividades são feitas; só conta o que foi feito após o início do curso; estágio não obrigatório 40 h por ano, até 80 h.', fonte: 'PPC Engenharia Civil' },
    { texto: 'Publicidade: no mínimo três atividades distintas.', fonte: 'PPC Publicidade' }
  ],
  como_enviar: {
    sistema: 'Coordenação ou secretaria do curso, com prazos próprios; lançamento pela CAA. Medicina lança no sistema Saturno. Direito: e-mail direito@univille.br.',
    prazo: 'Varia por curso. Direito: somente no 10º semestre, até 31/05 ou 31/10. Psicologia: outubro. Medicina: até dois meses antes do fim do 12º semestre. Engetec: à medida que as atividades são feitas.',
    quem_aprova: 'Coordenação do curso (a pesquisa não detalha o órgão para todos os cursos)',
    taxa: 'Não informada',
    fonte: 'PPCs de cada curso'
  },
  extensao: {
    mesma_hora_conta_nas_duas: 'a_confirmar',
    regra: 'A extensão é feita por componentes da matriz e fica separada das AC (Eng. Civil: 360 h de Vivências de Extensão; Publicidade: 282 h de projetos experimentais). Direito e Engetec são explícitos: não contar a mesma hora nos dois. A Medicina é a exceção: suas AC entram na conta dos 10% de extensão. Nos demais cursos a pesquisa não localizou regra.',
    fonte: 'PPCs de Direito, Engenharia Civil, Publicidade e Medicina'
  },
  sistemas_academicos: 'CAA (lançamento) e Saturno (Medicina).',
  alertas: [
    { nivel: 'alto', texto: 'Os PPCs citam "Resolução vigente" de AC sem número. Confirmar na Pró-Reitoria de Ensino qual resolução vale.' },
    { nivel: 'medio', texto: 'Administração não tem regulamento de AC no PPC. Pedagogia e Educação Física (bacharelado) aparecem com AC = 0, o que precisa de confirmação. O regulamento de Design é de 2015.' },
    { nivel: 'info', texto: 'Há PPCs cuja carga de AC não foi verificada (Artes Visuais, Ciências Econômicas, Ciências da Religião, Educação Escolar Quilombola, Educação Especial, Educação Física licenciatura, Enfermagem até 2022, Geografia, Letras e Odontologia).' }
  ],
  cursos: [...cursos, ...nv]
};
writeFileSync(new URL('../src/data/acg/univille.json', import.meta.url), JSON.stringify(inst, null, 2) + '\n');
console.log('univille.json:', inst.cursos.length, 'registros');
