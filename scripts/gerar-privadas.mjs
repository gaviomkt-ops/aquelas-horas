// Gera os arquivos JSON de Católica SC, Unisociesc, FGG, CNEC, Censupeg, SENAI, Senac, EaD e "sem norma pública".
// Fonte: relatório "Regulamentos ACG em Joinville.md" e notas de pesquisa (15/11/2026). Não inventa números:
// o que as fontes marcam como a confirmar, lido só no buscador ou não publicado fica com situacao própria.
import { writeFileSync } from 'node:fs';
const out = (nome, obj) => { writeFileSync(new URL(`../src/data/acg/${nome}.json`, import.meta.url), JSON.stringify(obj, null, 2) + '\n'); console.log(nome, obj.cursos.length); };
const h = (valor, unidade, situacao, fonte, extra = {}) => ({ valor, unidade, situacao, fonte, ...extra });
const c = (id, nome, matriz, horas, pdf, extra = {}) => ({ id, nome, matriz: typeof matriz === 'string' ? { codigo: matriz } : matriz, horas, pdf, ...extra });
const REF = { nivel: 'alto', texto: 'Matriz de OUTRA unidade (não é de Joinville): serve só de referência. Não use este número como se fosse o do seu curso.' };

/* ---------------- Católica SC ---------------- */
const CAT = 'Catolica SC/CatolicaSC_';
const catMat = (id, nome, ano, total, aac, arq, url) => c(id, nome, `Matriz ${ano}`, aac == null ? h(null, null, 'zero_a_confirmar', url, { nota: 'Sem linha de AAC na matriz.' }) : h(aac, 'h', 'verificado', url, { carga_total_curso: total }), [CAT + arq], { norma_aplicavel: 'reg-proprio', a_confirmar: ['O regulamento de AAC do curso não está publicado: categorias, tetos e envio são desconhecidos. Pedir à coordenação, com número e data.'] });
out('catolica', {
  id: 'catolica_sc', nome: 'Católica SC (Centro Universitário Católica de Santa Catarina em Joinville)', sigla: 'Católica', tipo: 'centro_universitario', campus: 'Joinville', pasta_documentos: 'Catolica SC',
  requisito_nome: 'Atividades Acadêmicas Complementares (AAC)',
  resumo: 'Cargas publicadas nas matrizes, mas os regulamentos de AAC de todos os cursos não estão publicados. As matrizes dizem que as AAC são validadas conforme "Regulamento próprio do Curso" e podem ser feitas a partir da 1ª fase.',
  normas: [
    { id: 'reg-proprio', numero: 'Regulamento próprio do Curso', data: '', status: 'nao_publicada', nota: 'Citado em todas as matrizes. O Regimento Geral (2011, alterado até 2021) não trata de AAC.', url: 'https://www.catolicasc.org.br/wp-content/uploads/2023/11/Regimento-Geral-do-Centro-Universitario-Catolica-Joinville.pdf', pdf: 'Catolica SC/CatolicaSC_Joinville_Regimento_Geral_2011_atualizado.pdf' }
  ],
  regras_gerais: [{ texto: 'AAC validadas conforme Regulamento próprio do Curso; podem ser realizadas a partir da 1ª fase.', fonte: 'Matriz Direito JOI' }],
  como_enviar: { sistema: 'Não publicado', prazo: 'Não publicado', quem_aprova: 'Não publicado', taxa: 'Não publicado', fonte: 'Relatório de pesquisa' },
  extensao: { mesma_hora_conta_nas_duas: 'a_confirmar', regra: 'A extensão é curricularizada pelos Projetos de Aprendizagem Colaborativa Extensionista (PAC), com horas próprias na coluna Extensão (70 h por semestre no Direito). Uma resolução de 2016 da Católica de Jaraguá do Sul diz que as horas do Projeto Comunitário não são computadas como AC; não há regra equivalente publicada para Joinville.', fonte: 'Matriz Direito JOI; Res. 26/16 (Jaraguá do Sul)' },
  sistemas_academicos: 'Não identificado na pesquisa.',
  alertas: [
    { nivel: 'alto', texto: 'Regulamentos de AAC de todos os cursos não estão publicados. Categorias, tetos e procedimento de envio são desconhecidos publicamente: peça à coordenação o regulamento do seu curso, com número e data, antes de acumular horas.' },
    { nivel: 'medio', texto: 'Não foi possível confirmar se Administração, Contábeis, Design e as engenharias têm turma presencial em Joinville com matriz diferente da de Jaraguá do Sul.' }
  ],
  cursos: [
    catMat('DIR', 'Direito', '2023/1', 3880, 150, 'Joinville_Matriz_Direito_20231.pdf', 'http://app.catolicasc.org.br/apps/integra_site/matrizes/pdf/ac328fb2c2c027caf522bb213320ca16_Pres_Bac_d28802ace04b02b853438434420d7120_Matutino.pdf'),
    catMat('ARQ', 'Arquitetura e Urbanismo', '2023/1', 3640, 150, 'Joinville_Matriz_Arquitetura_e_Urbanismo_20231.pdf', 'https://www.catolicasc.org.br/cursos/graduacao/'),
    catMat('NUT', 'Nutrição', '2023/1', 3210, 95, 'Joinville_Matriz_Nutricao_20231.pdf', 'https://www.catolicasc.org.br/cursos/graduacao/'),
    catMat('BIOM', 'Biomedicina', '2023/1', 3200, 70, 'Joinville_Matriz_Biomedicina_20231.pdf', 'https://www.catolicasc.org.br/cursos/graduacao/'),
    catMat('ENF', 'Enfermagem', '2024/1', 4050, 70, 'Joinville_Matriz_Enfermagem_20241.pdf', 'https://www.catolicasc.org.br/cursos/graduacao/enfermagem/'),
    catMat('ESOFT', 'Engenharia de Software', '2023/1', 3200, 60, 'Joinville_Matriz_Engenharia_de_Software_20231.pdf', 'https://www.catolicasc.org.br/cursos/graduacao/'),
    catMat('PSI', 'Psicologia', '2024/1', 4001, null, 'Joinville_Matriz_Psicologia_20241.pdf', 'https://www.catolicasc.org.br/cursos/graduacao/'),
    ...[
      ['ADM-JGS', 'Administração', '2026/1', 60, 'Administracao_20261', 'http://app.catolicasc.org.br/apps/integra_site/matrizes/pdf/c7925d5a8f32cc1695cef6df8f502098_Pres_Bac_c99747914037495b72ceff0eb2523e36_Noturno.pdf'],
      ['CONT-JGS', 'Ciências Contábeis', '2026/1', 100, 'Ciencias_Contabeis_20261', ''],
      ['DES-JGS', 'Design', '2023/1', 60, 'Design_20231', ''],
      ['ECIV-JGS', 'Engenharia Civil', '2023/1', 35, 'Engenharia_Civil_20231', 'http://app.catolicasc.org.br/apps/integra_site/matrizes/pdf/9cc089d66600febf8b6ef08253ec5103_Pres_Bac_c99747914037495b72ceff0eb2523e36_Noturno.pdf'],
      ['EELE-JGS', 'Engenharia Elétrica', '2023/1', 35, 'Engenharia_Eletrica_20231', ''],
      ['EMEC-JGS', 'Engenharia Mecânica', '2023/1', 35, 'Engenharia_Mecanica_20231', ''],
      ['EPROD-JGS', 'Engenharia de Produção', '2025/1', 35, 'Engenharia_de_Producao_20251', '']
    ].map(([id, nome, ano, aac, arq, url]) => c(id, `${nome} (referência: Jaraguá do Sul)`, `Matriz Jaraguá do Sul ${ano}`, h(aac, 'h', 'referencia_outra_unidade', url || 'catolicasc.org.br (matrizes Jaraguá do Sul)'), [`${CAT}JARAGUA_Matriz_${arq}.pdf`], { referencia_outra_unidade: true, alertas: [REF] }))
  ]
});

/* ---------------- Unisociesc ---------------- */
const U = 'Unisociesc/Unisociesc_';
const uni = (id, nome, mod, acg, arq, extra = {}) => c(id, nome, `PPC 2026 (${mod})`, acg === 0 ? h(null, null, 'zero_a_confirmar', 'https://www.unisociesc.com.br/sobre/documentos-institucionais/', { nota: 'Sem carga obrigatória de ACG no PPC.' }) : h(acg, 'h', 'verificado', 'https://www.unisociesc.com.br/sobre/documentos-institucionais/'), [U + arq], { modalidade: mod, ...extra });
out('unisociesc', {
  id: 'unisociesc', nome: 'Centro Universitário Sociesc (Unisociesc, grupo Ânima)', sigla: 'Unisociesc', tipo: 'centro_universitario', campus: 'Joinville (sede)', pasta_documentos: 'Unisociesc',
  requisito_nome: 'Atividades Complementares de Graduação (ACG)',
  resumo: 'A regra está no Manual do Aluno da modalidade (versões de 2026) e no PPC de cada curso; não foi encontrada resolução específica de ACG. Teto de 45% da carga em uma única categoria e mínimo de três categorias.',
  normas: [
    { id: 'manual-e2a', numero: 'Manual do Aluno Presencial E2A (2026-08)', data: '2026-08', status: 'vigente', nota: '"O aluno não poderá utilizar mais de 45% da carga horária total em uma única categoria, sendo obrigatória a realização de atividades em, no mínimo, três categorias diferentes." Comprovante com nome, carga horária, local, data, título, assinatura e QR Code ou código de validação.', url: 'https://estaticos.animaeducacao.com.br/medias/20260828100141/Manual_Presencial_E2A_UniSociesc.pdf', pdf: 'Unisociesc/Unisociesc_Manual_do_Aluno_Presencial_E2A_2026-08.pdf' },
    { id: 'manual-ead', numero: 'Manual do Aluno EaD (2026-08)', data: '2026-08', status: 'vigente', nota: 'Outra lógica: ACG Institucionais (60%) e Específicas do Curso (40%), em ensino, pesquisa e extensão; protocolo no Portal do Estudante/SIGA.', url: 'https://estaticos.animaeducacao.com.br/medias/20260828110658/Manual_do_Aluno-EAD.pdf', pdf: 'Unisociesc/Unisociesc_Manual_do_Aluno_EAD_2026-08.pdf' },
    { id: 'manual-semi', numero: 'Manual do Aluno Semipresencial (2026-08)', data: '2026-08', status: 'vigente', nota: 'Seis categorias, como o presencial.', url: '', pdf: 'Unisociesc/Unisociesc_Manual_do_Aluno_Semipresencial_2026-08.pdf' },
    { id: 'manual-radial', numero: 'Manual do Aluno Radial (2026-08)', data: '2026-08', status: 'vigente', nota: '', url: '', pdf: 'Unisociesc/Unisociesc_Manual_do_Aluno_Radial_2026-08.pdf' },
    { id: 'manual-legado', numero: 'Manual do Aluno Currículo Legado (2026-04)', data: '2026-04', status: 'vigente', nota: '', url: '', pdf: 'Unisociesc/Unisociesc_Manual_do_Aluno_Curriculo_Legado_2026-04.pdf' },
    { id: 'orientador-externas', numero: 'Documento Orientador de Validação de Atividades Externas de Extensão (Ânima)', data: '', status: 'desatualizada', nota: 'Superado: previa validar extensão externa, o que deixou de valer em 2025/2.', url: '', pdf: 'Unisociesc/Anima_Doc_Orientador_Validacao_Atividades_Externas_Extensao.pdf' }
  ],
  regras_gerais: [
    { texto: 'Seis categorias nos manuais presenciais: ensino e aprendizagem; pesquisa, produção científica e inovação tecnológica; culturais e esportivas; administrativas e de representação estudantil; internacionais; mundo do trabalho.', fonte: 'Manual Presencial E2A' },
    { texto: 'Máximo de 45% da carga em uma única categoria e no mínimo três categorias diferentes.', fonte: 'Manual Presencial E2A' },
    { texto: 'Colação de grau exige 100% da carga, inclusive ACG; ACG feitas depois do prazo de integralização podem ser cobradas.', fonte: 'Manual Presencial E2A' }
  ],
  como_enviar: { sistema: 'Protocolo no Ulife (EaD: Portal do Estudante/SIGA): abrir o protocolo, pagar a taxa de serviço e anexar os comprovantes', prazo: 'Não informado', quem_aprova: 'A confirmar (as horas validadas vão integralmente para o histórico; o componente aparece como "Cumpriu")', taxa: 'Existe taxa de serviço, valor não encontrado', fonte: 'Manual Presencial E2A (Ulife)' },
  extensao: { mesma_hora_conta_nas_duas: 'a_confirmar', regra: 'A extensão é componente separado de 10% desde 2020/2. Desde 2025/2, extensão feita fora do ecossistema Ânima não é aceita, mas as ACG continuam aceitando atividades dentro ou fora da IES: um curso externo só vale como ACG. Nenhum documento diz se a mesma hora conta nas duas.', fonte: 'Manual Presencial E2A; PPC Ciências Contábeis JOI' },
  sistemas_academicos: 'Ulife; Portal do Estudante (SIGA) no EaD.',
  alertas: [
    { nivel: 'medio', texto: 'Os PPCs listam sete categorias (inovação tecnológica separada), os manuais presenciais seis e o manual EaD outra divisão. Vale o manual da sua modalidade.' },
    { nivel: 'medio', texto: 'Taxa do protocolo no Ulife não informada. Nenhum documento público traz horas por tipo de certificado, só o teto de 45% e o mínimo de três categorias.' },
    { nivel: 'medio', texto: 'Não há PPC publicado com cabeçalho de Joinville para Direito, Psicologia, Arquitetura, Enfermagem, SI, Administração ou Engenharia de Software, e não se confirmou quais funcionam no campus.' }
  ],
  cursos: [
    uni('ECIV', 'Engenharia Civil', 'Presencial', 40, 'Joinville_PPC_Engenharia_Civil_Presencial_2026.pdf'),
    uni('EELE', 'Engenharia Elétrica', 'Semipresencial', 40, 'Joinville_PPC_Engenharia_Eletrica_Semipresencial_2026.pdf'),
    uni('EMEC', 'Engenharia Mecânica', 'Semipresencial', 40, 'Joinville_PPC_Engenharia_Mecanica_Semipresencial_2026.pdf'),
    uni('EPROD', 'Engenharia de Produção', 'Semipresencial', 40, 'Joinville_PPC_Engenharia_de_Producao_Semipresencial_2026.pdf'),
    uni('NUT', 'Nutrição', 'Semipresencial', 40, 'Joinville_PPC_Nutricao_Semipresencial_2026.pdf'),
    uni('CONT', 'Ciências Contábeis', 'Semipresencial', 80, 'Joinville_PPC_Ciencias_Contabeis_Semipresencial_2026.pdf'),
    uni('CST-DI', 'CST Design de Interiores', 'EaD', 120, 'Joinville_PPC_CST_Design_de_Interiores_EAD_2026.pdf'),
    uni('CST-PG', 'CST Processos Gerenciais', 'Semipresencial', 0, 'Joinville_PPC_CST_Processos_Gerenciais_Semipresencial_2026.pdf', { a_confirmar: ['Sem carga obrigatória de ACG no PPC: confirmar na coordenação.'] }),
    ...[
      ['DIR-BNU', 'Direito', 130, 'Direito_2025'], ['ENF-BNU', 'Enfermagem', 210, 'Enfermagem_2026'], ['SI-BNU', 'Sistemas de Informação', 100, 'Sistemas_de_Informacao_2026'],
      ['ARQ-BNU', 'Arquitetura e Urbanismo', 40, 'Arquitetura_e_Urbanismo_2026'], ['ESOFT-BNU', 'Engenharia de Software', 40, 'Engenharia_de_Software_2026'], ['PSI-BNU', 'Psicologia', 0, 'Psicologia_2026']
    ].map(([id, nome, acg, arq]) => c(id, `${nome} (referência: Blumenau)`, 'PPC Blumenau', acg === 0 ? h(null, null, 'referencia_outra_unidade', '', { nota: 'Sem ACG no PPC de Blumenau.' }) : h(acg, 'h', 'referencia_outra_unidade', 'estaticos.animaeducacao.com.br (PPC Blumenau)'), [`${U}BLUMENAU_PPC_${arq}.pdf`], { referencia_outra_unidade: true, alertas: [REF] }))
  ]
});

/* ---------------- FGG ---------------- */
const F = 'Guilherme Guimbala/FGG_';
out('fgg', {
  id: 'fgg', nome: 'Faculdade Guilherme Guimbala (ACE)', sigla: 'FGG', tipo: 'faculdade', campus: 'Joinville', pasta_documentos: 'Guilherme Guimbala',
  requisito_nome: 'Atividades Complementares (AC), geridas pelo NAC (Núcleo de Atividades Complementares)',
  resumo: 'Um regulamento por curso, e matrizes de 2025-2026 que contradizem os regulamentos em Direito, Terapia Ocupacional e Fisioterapia.',
  normas: [
    { id: 'nac-01-2026', numero: 'Res. NAC nº 01/2026 (Direito)', data: '2026-04-17', status: 'vigente', nota: 'Aprovada em 17/04/2026, assinada em 22/04/2026, publicada em 27/04/2026. 270 h na matriz anual e 360 h na semestral. Cinco grupos: docência e pesquisa, eventos, produção acadêmica, vivência profissional, extensão. Não pode concentrar tudo em um grupo.', url: 'https://ace.br/wp-content/uploads/2024/02/Regulamento-NAC-publicado-27.04.26.pdf', pdf: 'Guilherme Guimbala/FGG_Regulamento_NAC_publicado_2026-04-27.pdf' },
    { id: 'nac-01-2018', numero: 'Res. NAC nº 01/2018 (Direito)', data: '2018-02-05', status: 'desatualizada', nota: 'Previa 180 h para quem entrou até 2015 e 270 h a partir de 2017. Anterior a 2020; o texto de 2026 não diz expressamente que a revoga.', url: 'https://ace.br/wp-content/uploads/2024/06/1-NAC-Regulamento_e_Anexos-Nucleo_Atividades_Complementares-2019.pdf', pdf: 'Guilherme Guimbala/FGG_NAC_Regulamento_e_Anexos_2019.pdf' },
    { id: 'to-1-2021', numero: 'Resolução nº 1/2021 (Terapia Ocupacional)', data: '2021-07-14', status: 'vigente', nota: '36 h em quatro categorias (ensino, pesquisa, extensão e social). Entrega na última semana de julho e de outubro; validação na primeira quinzena do mês seguinte.', url: 'https://ace.br/wp-content/uploads/2024/06/Resolucao-horas-complementares-atual-1.pdf', pdf: 'Guilherme Guimbala/FGG_Resolucao_horas_complementares_atual.pdf' },
    { id: 'fisio-sem-data', numero: 'Normas de Atividades Complementares (Fisioterapia, sem data)', data: '', status: 'desatualizada', nota: 'Exige 18 horas anuais; matrícula bloqueada no ano seguinte para quem não cumprir. Documento sem data.', url: 'https://ace.br/wp-content/uploads/2024/06/normas_da_atividades_complementares.pdf', pdf: 'Guilherme Guimbala/FGG_normas_atividades_complementares.pdf' }
  ],
  regras_gerais: [
    { texto: 'Direito (Anexo I, tetos): monitoria 30 h por semestre, máximo 90 h; pesquisa ou IC 60 h por projeto por semestre, máximo 120 h; estágio não obrigatório máximo 130 h; congressos e palestras máximo 180 h; eletivas, oficinas e EaD máximo 180 h; audiências 5 h cada, máximo 80 h; visitas técnicas 10 h, máximo 80 h; idiomas máximo 90 h; projetos sociais 20 h, máximo 80 h; livro ou capítulo 80 h, máximo 160 h; assistir a TCC ou defesas 5 h, máximo 45 h.', fonte: 'Res. NAC 01/2026, Anexo I' },
    { texto: 'Direito: atividades já computadas como estágio supervisionado ou componentes obrigatórios não contam. Recomendado integralizar 50% até a metade do curso.', fonte: 'Res. NAC 01/2026, arts. 1º e 2º' }
  ],
  como_enviar: { sistema: 'E-mail ao NAC. Direito: nac.atividades@ace.br. Terapia Ocupacional: nacto@fgg.edu.br.', prazo: 'Direito: no final de cada semestre ou ano. T.O.: última semana de julho e de outubro.', quem_aprova: 'NAC / coordenação (pode indeferir, pedir mais documentos ou deferir em parte)', taxa: 'Não informada', fonte: 'Res. NAC 01/2026, art. 5º; Res. 1/2021' },
  extensao: { mesma_hora_conta_nas_duas: 'a_confirmar', regra: 'Terapia Ocupacional: extensão só conta como AC quando não compõe a curricularização. No Direito, a extensão é um dos cinco grupos de AC; a pesquisa não localizou regra sobre dupla contagem com a extensão curricularizada.', fonte: 'Res. 1/2021 (T.O.); Res. NAC 01/2026' },
  sistemas_academicos: 'Não identificado; o envio é por e-mail.',
  alertas: [
    { nivel: 'alto', texto: 'Direito semestral: regulamento diz 360 h, a matriz soma 340 h (dez componentes de 34 h).' },
    { nivel: 'alto', texto: 'Terapia Ocupacional: a resolução diz 36 h, mas a matriz semestral traz 96 h.' },
    { nivel: 'alto', texto: 'Fisioterapia: normas dizem 18 h anuais, mas as matrizes somam 96 h.' },
    { nivel: 'medio', texto: 'Psicologia, Pedagogia e Fonoaudiologia não têm regulamento publicado; os números vêm só das matrizes.' },
    { nivel: 'medio', texto: 'A Res. NAC 01/2018 não foi revogada expressamente pela de 2026.' }
  ],
  cursos: [
    c('DIR-A', 'Direito (matriz anual)', 'A partir de 2017', h(270, 'h', 'verificado', 'https://ace.br/wp-content/uploads/2026/01/Direito-anual.pdf'), [F + 'Matriz_Direito-anual_2026-01.pdf', F + 'Regulamento_NAC_publicado_2026-04-27.pdf'], { norma_aplicavel: 'nac-01-2026' }),
    c('DIR-S', 'Direito (matriz semestral)', 'A partir de 03/2025', h(360, 'h', 'contraditorio', 'https://ace.br/wp-content/uploads/2026/01/Direito-semestral.pdf', { alternativa: { valor: 340, unidade: 'h', origem: 'soma dos componentes da matriz' } }), [F + 'Matriz_Direito-semestral_2026-01.pdf', F + 'Regulamento_NAC_publicado_2026-04-27.pdf'], { norma_aplicavel: 'nac-01-2026', a_confirmar: ['Regulamento: 360 h. Matriz: 340 h.'], alertas: [{ nivel: 'alto', texto: 'Regulamento 360 h x matriz 340 h. Confirmar com o NAC.' }] }),
    c('TO-A', 'Terapia Ocupacional (matriz anual)', 'Resolução 1/2021', h(36, 'h', 'a_confirmar', 'https://ace.br/wp-content/uploads/2024/06/Resolucao-horas-complementares-atual-1.pdf'), [F + 'Matriz_T.O-anual_2026-01.pdf', F + 'Resolucao_horas_complementares_atual.pdf', F + 'Categorias_horas_complementares.pdf'], { norma_aplicavel: 'to-1-2021', extensao: { mesma_hora_conta_nas_duas: 'nao', regra: 'Extensão só conta quando não compõe a curricularização.', fonte: 'Res. 1/2021' }, a_confirmar: ['A pesquisa citou a matriz semestral (96 h); a soma da matriz anual não foi relatada.'] }),
    c('TO-S', 'Terapia Ocupacional (matriz semestral)', 'Matriz 2026-01', h(36, 'h', 'contraditorio', 'https://ace.br/wp-content/uploads/2026/01/T.O-semestral.pdf', { alternativa: { valor: 96, unidade: 'h', origem: 'matriz semestral' } }), [F + 'Matriz_T.O-semestral_2026-01.pdf', F + 'Resolucao_horas_complementares_atual.pdf'], { norma_aplicavel: 'to-1-2021', extensao: { mesma_hora_conta_nas_duas: 'nao', regra: 'Extensão só conta quando não compõe a curricularização.', fonte: 'Res. 1/2021' }, a_confirmar: ['Resolução: 36 h. Matriz semestral: 96 h.'], alertas: [{ nivel: 'alto', texto: 'Resolução 36 h x matriz 96 h. Confirmar com o NAC.' }] }),
    c('FISIO-A', 'Fisioterapia (matriz anual)', 'Matriz 2026-01', h(18, 'h', 'contraditorio', 'https://ace.br/wp-content/uploads/2024/06/normas_da_atividades_complementares.pdf', { nota: '18 h por ano (normas sem data)', alternativa: { valor: 96, unidade: 'h', origem: 'soma das matrizes' } }), [F + 'Matriz_Fisioterapia-anual_2026-01.pdf', F + 'normas_atividades_complementares.pdf'], { norma_aplicavel: 'fisio-sem-data', a_confirmar: ['Normas: 18 h por ano. Matrizes: 96 h.'], alertas: [{ nivel: 'alto', texto: '18 h por ano nas normas x 96 h nas matrizes. Confirmar com o NAC.' }] }),
    c('FISIO-S', 'Fisioterapia (matriz semestral)', 'Matriz 2026-01', h(96, 'h', 'a_confirmar', 'https://ace.br/wp-content/uploads/2026/01/Fisioterapia-anual.pdf'), [F + 'Matriz_Fisioterapia-semestral_2026-01.pdf', F + 'normas_atividades_complementares.pdf'], { norma_aplicavel: 'fisio-sem-data', a_confirmar: ['A pesquisa relata 96 h somando "as matrizes"; confirmar o valor da matriz semestral com o NAC.'] }),
    c('PSI-A', 'Psicologia (matriz anual)', 'Matriz 2026-01', h(198, 'h', 'a_confirmar', 'https://ace.br/wp-content/uploads/2026/01/Psicologia-anual.pdf', { nota: 'Só da matriz; regulamento não publicado.' }), [F + 'Matriz_Psicologia-anual_2026-01.pdf'], { a_confirmar: ['Regulamento de AC não publicado.'] }),
    c('PSI-S', 'Psicologia (matriz semestral)', 'Matriz 2026-01', h(196, 'h', 'a_confirmar', 'https://ace.br/wp-content/uploads/2026/01/Psicologia-anual.pdf', { nota: 'Só da matriz; regulamento não publicado.' }), [F + 'Matriz_Psicologia-semestral_2026-01.pdf'], { a_confirmar: ['Regulamento de AC não publicado.'] }),
    c('PED-A', 'Pedagogia (matriz anual)', 'Matriz 2026-01', h(180, 'h', 'a_confirmar', 'FGG_Matriz_Pedagogia-anual_2026-01.pdf', { nota: 'Só da matriz; regulamento não publicado.' }), [F + 'Matriz_Pedagogia-anual_2026-01.pdf'], { a_confirmar: ['Regulamento de AC não publicado.'] }),
    c('PED-S', 'Pedagogia (matriz semestral)', 'Matriz 2026-01', h(null, null, 'zero_a_confirmar', '', { nota: 'A matriz semestral não lista AC.' }), [F + 'Matriz_Pedagogia-semestral_2026-01.pdf'], { a_confirmar: ['A matriz não lista AC: confirmar com a coordenação.'] }),
    c('FONO-S', 'Fonoaudiologia (matriz semestral)', 'Matriz 2026/2', h(100, 'h', 'a_confirmar', 'https://ace.br/wp-content/uploads/2025/12/Matriz-Semestral-Fonoaudiologia-2026_2.pdf', { nota: 'Extensão curricularizada à parte: 310 h.' }), [F + 'Matriz_Fonoaudiologia_semestral_2026-2.pdf'], { a_confirmar: ['Regulamento de AC não publicado.'] })
  ]
});

/* ---------------- CNEC Joinville ---------------- */
out('cnec', {
  id: 'cnec_joinville', nome: 'Faculdade CNEC Joinville', sigla: 'CNEC', tipo: 'faculdade', campus: 'Joinville', pasta_documentos: 'CNEC Joinville',
  requisito_nome: 'Atividades Complementares (NAC)',
  resumo: 'A única norma pública é o regulamento de 17/03/2017 da antiga Faculdade Cenecista de Joinville. A matriz atual do Direito contradiz o regulamento.',
  normas: [
    { id: 'fcj-2017', numero: 'Regulamento das Atividades Complementares (Faculdade Cenecista de Joinville)', data: '2017-03-17', status: 'desatualizada', nota: 'Anterior a 2020. Para matrizes a partir de 2016/1: 300 h para Administração, Ciências Contábeis e Direito; 80 h para cursos de tecnologia. Exige pelo menos dois dos três eixos (ensino, pesquisa, extensão), no máximo 50% em cada. Provavelmente existe regulamento mais novo, não publicado.', url: 'https://educacaosuperior.cnec.br/documentos/18f1e97f806eb182f961d2cc99df9bcb', pdf: 'CNEC Joinville/FCJ_Regulamento_Atividades_Complementares_2017-03-17.pdf' }
  ],
  regras_gerais: [
    { texto: 'Tetos do regulamento de 2017: monitoria 30 h por semestre, até 60 h; estágio extracurricular até 90 h; iniciação científica até 60 h; voluntariado até 30 h.', fonte: 'Regulamento FCJ 2017' },
    { texto: 'Nivelamento, TCC e Estágio de Prática Jurídica não contam.', fonte: 'Regulamento FCJ 2017' }
  ],
  como_enviar: { sistema: 'Cópias entregues ao NAC, com protocolo em duas vias', prazo: 'Concluintes entregam até 10 de maio ou 10 de outubro', quem_aprova: 'NAC', taxa: 'Não informada', fonte: 'Regulamento FCJ 2017' },
  extensao: { mesma_hora_conta_nas_duas: 'a_confirmar', regra: 'A matriz atual do Direito traz 380 h de Experiência Extensionista, componente separado das Atividades Complementares. A pesquisa não localizou regra sobre contar a mesma hora nos dois.', fonte: 'Página do curso Direito (CNEC)' },
  sistemas_academicos: 'Não identificado.',
  alertas: [
    { nivel: 'alto', texto: 'Direito: 180 h na matriz atual (Atividades Complementares I a X, de 18 h) x 300 h no regulamento de 2017. Confirmar com o NAC ou a Secretaria.' },
    { nivel: 'medio', texto: 'O regulamento público é de 2017 e provavelmente há um mais novo, não publicado.' },
    { nivel: 'info', texto: 'A Censupeg e a CNEC Joinville funcionam no mesmo endereço (Av. Getúlio Vargas, 1266); nenhum documento explica a relação.' }
  ],
  cursos: [
    c('DIR', 'Direito (presencial)', 'Matriz atual (página do curso, 15/11/2026)', h(180, 'h', 'contraditorio', 'https://educacaosuperior.cnec.br/joinville/cursos/graduacao/bacharelado/114/info', { alternativa: { valor: 300, unidade: 'h', origem: 'regulamento de 2017' } }), ['CNEC Joinville/CNEC_Joinville_pagina_curso_Direito_matriz_2026-11-15.pdf', 'CNEC Joinville/FCJ_Regulamento_Atividades_Complementares_2017-03-17.pdf'], { norma_aplicavel: 'fcj-2017', a_confirmar: ['Matriz atual: 180 h. Regulamento de 2017: 300 h.', 'A matriz fica num bloco oculto da página e não aparece no PDF; os números vieram do HTML.'], alertas: [{ nivel: 'alto', texto: 'Matriz 180 h x regulamento 300 h. Confirmar com o NAC.' }] })
  ]
});

/* ---------------- Censupeg ---------------- */
out('censupeg', {
  id: 'censupeg', nome: 'Faculdade Censupeg', sigla: 'Censupeg', tipo: 'faculdade', campus: 'Joinville', pasta_documentos: 'Censupeg',
  requisito_nome: 'Atividades Complementares',
  resumo: 'Regulamento institucional de maio/2020 com tabela de mínimos e máximos por semestre. O total por curso vem do PPC, que não está publicado para os cursos presenciais.',
  normas: [
    { id: 'reg-2020', numero: 'Regulamento de Atividades Complementares', data: '2020-05', status: 'vigente', nota: 'Publicado numa pasta do Moodle chamada "2021". Não contam atividades anteriores ao ingresso nem estágio obrigatório; quem não completar a carga não entra na lista de formandos.', url: 'https://censupegead.com.br/pluginfile.php/90/mod_folder/intro/Regulamento%20de%20Atividades%20Complementares%202021.pdf', pdf: 'Censupeg/Censupeg_Regulamento_Atividades_Complementares_maio2020_(pasta2021).pdf' }
  ],
  regras_gerais: [
    { texto: 'Mínimos e máximos por semestre: estágio não curricular 20 a 40 h; eventos internos 4 a 25 h; organização de eventos 8 a 50 h; projeto de pesquisa 8 a 50 h; representação discente 10 h.', fonte: 'Regulamento maio/2020' }
  ],
  como_enviar: { sistema: 'Portal Acadêmico', prazo: 'Dentro do semestre letivo', quem_aprova: 'A confirmar', taxa: 'Não informada', fonte: 'Regulamento maio/2020' },
  extensao: { mesma_hora_conta_nas_duas: 'a_confirmar', regra: 'A pesquisa não localizou regra sobre extensão curricularizada.', fonte: '' },
  sistemas_academicos: 'Portal Acadêmico.',
  alertas: [
    { nivel: 'alto', texto: 'Total de horas por curso não publicado (o PPC dos cursos presenciais de Enfermagem, Odontologia, Direito e Psicologia não está publicado). Consulte a coordenação.' },
    { nivel: 'medio', texto: 'O regulamento é de 2020, publicado numa pasta do Moodle chamada "2021".' }
  ],
  cursos: [
    c('GERAL', 'Todos os cursos presenciais', 'Regulamento maio/2020', h(null, null, 'nao_publicado', 'https://www.censupeg.com.br/files/DOCUMENTO-edital-campanha-de-vestibular-graduacao-presencial-2026-2.pdf'), ['Censupeg/Censupeg_Regulamento_Atividades_Complementares_maio2020_(pasta2021).pdf', 'Censupeg/Censupeg_Edital_Vestibular_Graduacao_Presencial_2026-2.pdf'], { norma_aplicavel: 'reg-2020', a_confirmar: ['Total de horas fica no PPC de cada curso, não publicado.'] })
  ]
});

/* ---------------- SENAI ---------------- */
out('senai', {
  id: 'unisenai', nome: 'UniSENAI (Centro Universitário SENAI/SC, campus Joinville)', sigla: 'UniSENAI', tipo: 'centro_universitario', campus: 'Joinville', pasta_documentos: 'SENAI',
  requisito_nome: 'Atividades Acadêmicas Complementares (AAC)',
  resumo: 'O único documento com carga é o PDI 2018-2022 da antiga Faculdade SENAI Joinville, vencido. O regulamento detalhado fica no Espaço do Estudante, que não é público.',
  normas: [
    { id: 'pdi-2018-2022', numero: 'PDI 2018-2022 da Faculdade SENAI Joinville', data: '2018', status: 'desatualizada', nota: 'Vencido. As AAC "estão contempladas na matriz curricular do curso com carga horária total de 60 horas", nos eixos ensino, pesquisa e extensão.', url: 'https://sc.senai.br/sites/default/files/inline-files/PDI_2018-2022%20-%20Faculdade%20SENAI%20Joinville.pdf', pdf: 'SENAI/SENAI_Faculdade_Tecnologia_SENAI_Joinville_PDI_2018-2022.pdf' },
    { id: 'regimento-unisenai', numero: 'Regimento do UniSENAI', data: '', status: 'nao_publicada', nota: 'Lido só no buscador (o site respondeu HTTP 503): as atividades complementares são "requisito obrigatório para a colação de grau".', url: 'https://unisenaisc.com.br/wp-content/uploads/sites/12/2022/01/Regime-interno.pdf', pdf: '' }
  ],
  regras_gerais: [],
  como_enviar: { sistema: 'Regulamento no "Espaço do Estudante" (não público)', prazo: 'Não publicado', quem_aprova: 'Não publicado', taxa: 'Não publicado', fonte: 'PDI 2018-2022' },
  extensao: { mesma_hora_conta_nas_duas: 'a_confirmar', regra: 'O PDI tratava a extensão como eixo dentro das AAC. Não se sabe se o UniSENAI já as separou.', fonte: 'PDI 2018-2022' },
  sistemas_academicos: 'Espaço do Estudante (não público).',
  alertas: [
    { nivel: 'alto', texto: 'Só existe o PDI 2018-2022 (vencido), com 60 h. O regimento do UniSENAI e o regulamento interno não estão acessíveis. Confirmar com a Secretaria.' }
  ],
  cursos: [
    c('ECA', 'Engenharia de Controle e Automação', 'Processo seletivo 2026-1 (3.890 h de carga total)', h(60, 'h', 'historico', 'https://sc.senai.br/sites/default/files/inline-files/PDI_2018-2022%20-%20Faculdade%20SENAI%20Joinville.pdf', { nota: 'O PDI fala em 60 h para a antiga Faculdade SENAI Joinville. O edital de 2026-1 não menciona horas complementares.' }), ['SENAI/SENAI_Faculdade_Tecnologia_SENAI_Joinville_PDI_2018-2022.pdf', 'SENAI/UniSENAI_SC_Edital33_Graduacoes_diferenciadas_2025.pdf'], { a_confirmar: ['A carga de 60 h vem de PDI vencido e da antiga Faculdade SENAI Joinville.'] })
  ]
});

/* ---------------- Senac ---------------- */
out('senac', {
  id: 'senac', nome: 'Senac Joinville (unidade vinculada à Faculdade de Tecnologia Senac Blumenau)', sigla: 'Senac', tipo: 'faculdade', campus: 'Joinville', pasta_documentos: 'Senac',
  requisito_nome: 'Não aparece como componente',
  resumo: 'Não existe Faculdade Senac Joinville credenciada: a unidade é vinculada à Faculdade de Tecnologia Senac Blumenau. O Manual do Aluno de Graduação 2023 não traz atividades complementares.',
  normas: [
    { id: 'manual-2023', numero: 'Manual do Aluno de Graduação Senac/SC (2023)', data: '2023', status: 'vigente', nota: 'Não traz atividades complementares entre os componentes. Traz extensão curricularizada (no mínimo 10%), projeto integrador e certificações intermediárias. Um manual mais antigo, visto só em cópia não oficial, dizia que as AC eram obrigatórias em todos os cursos.', url: 'https://portal.sc.senac.br/doc/area-do-estudante/Manual-Aluno-Graduacao.pdf', pdf: 'Senac/Senac_SC_Manual_do_Aluno_Graduacao.pdf' }
  ],
  regras_gerais: [],
  como_enviar: { sistema: 'Não se aplica pelo manual de 2023', prazo: 'Não se aplica', quem_aprova: 'Não se aplica', taxa: 'Não se aplica', fonte: 'Manual 2023' },
  extensao: { mesma_hora_conta_nas_duas: 'nao_se_aplica', regra: 'Sem AC no manual vigente; a extensão curricularizada é de no mínimo 10%.', fonte: 'Manual 2023' },
  sistemas_academicos: 'Não identificado.',
  alertas: [{ nivel: 'medio', texto: 'Conclusão provável: os CSTs atuais não exigem AC, mas isso só se confirma no PPC de cada curso.' }],
  cursos: [
    c('ADS', 'CST em Análise e Desenvolvimento de Sistemas', 'Edital 01/2025 (vestibular 2025/1)', h(null, null, 'nao_publicado', 'https://vestibular.sc.senac.br/doc/edital8.pdf', { nota: 'Nenhuma carga publicada.' }), ['Senac/Senac_SC_Manual_do_Aluno_Graduacao.pdf', 'Senac/Senac_SC_Edital_01-2025_Vestibular_2025-1_CST.pdf'], { a_confirmar: ['Confirmar no PPC se há AC.'] }),
    c('PG', 'CST em Processos Gerenciais', 'Edital 01/2025 (vestibular 2025/1)', h(null, null, 'nao_publicado', 'https://vestibular.sc.senac.br/doc/edital8.pdf', { nota: 'Nenhuma carga publicada.' }), ['Senac/Senac_SC_Manual_do_Aluno_Graduacao.pdf', 'Senac/Senac_SC_Edital_01-2025_Vestibular_2025-1_CST.pdf'], { a_confirmar: ['Confirmar no PPC se há AC.'] })
  ]
});

/* ---------------- EaD com polo em Joinville ---------------- */
const E = 'EaD polos Joinville/';
const ead = (id, nome, matriz, horas, pdf, extra = {}) => c(id, nome, matriz, horas, pdf, extra);
out('ead', {
  id: 'ead_polos', nome: 'EaD com polo em Joinville', sigla: 'EaD', tipo: 'ead', campus: 'Polos em Joinville', pasta_documentos: 'EaD polos Joinville',
  requisito_nome: 'AC, ACO (Cogna), AAC (Estácio)',
  resumo: 'O aluno de polo segue o regulamento da instituição credenciadora, não do polo, quase sempre no AVA. A presença dos polos em Joinville foi levantada em agregadores e numa notícia da UNINTER, sem confirmação no e-MEC.',
  normas: [
    { id: 'unicesumar-rac', numero: 'Regulamento de Atividades Complementares (RAC) da UniCesumar', data: '2024-04-19', status: 'vigente', nota: 'Presencial e EaD. Exige pelo menos 30% da carga em cada uma de três categorias. Tabela: evento científico 30 h; curso de extensão 20 h; palestra nacional 10 h; monitoria 20 h; estágio não obrigatório 40 h; livro publicado 40 h; ação social, comunitária ou extensionista 20 h. Resultado: CUMPRIDO ou NÃO CUMPRIDO.', url: 'https://aluno.unicesumar.edu.br/lyceump/aonline/ti/docs/RAC_Mga.pdf', pdf: 'EaD polos Joinville/UNICESUMAR_Regulamento_Atividades_Complementares_RAC_Mga.pdf' },
    { id: 'cogna-aco', numero: 'Regras Gerais das ACO (Cogna: Anhanguera, Unopar, Ampli)', data: '2026-06-10', status: 'vigente', nota: 'Um certificado por solicitação; no máximo 40 h por certificado; mesário 8 h por turno. Recusa certificados de pessoa física, de estágio obrigatório e de atividades anteriores ao ingresso.', url: 'https://ampli.zendesk.com/hc/pt-br/articles/4427267966228--Gradua%C3%A7%C3%A3o-Regras-Gerais-das-Atividades-complementares-ACO', pdf: 'EaD polos Joinville/COGNA-AMPLI_Regras_Gerais_Atividades_Complementares_ACO_Zendesk_2026-06.pdf' },
    { id: 'estacio-manual', numero: 'Manual do Aluno de Graduação Estácio 2022.1 (AAC)', data: '2022', status: 'desatualizada', nota: 'AAC recebidas no SIA. Lançamento: SIA > Atendimento > Requerimento > "Lançar horas de atividades".', url: 'https://sia.estacio.br/alu/doc/manual_graduacao_ESTACIO.pdf', pdf: 'EaD polos Joinville/ESTACIO_Manual_do_Aluno_Graduacao_2022-1.pdf' }
  ],
  regras_gerais: [],
  como_enviar: { sistema: 'AVA de cada grupo: Studeo (UniCesumar), AVA/Leo App (UNIASSELVI), AVA Cogna, SIA (Estácio)', prazo: 'UniCesumar EaD: documentação até o fim do curso', quem_aprova: 'IES credenciadora', taxa: 'Não informada', fonte: 'Regulamentos de cada credenciadora' },
  extensao: { mesma_hora_conta_nas_duas: 'a_confirmar', regra: 'UniCesumar: a tabela traz "ação social, comunitária ou extensionista – 20 h", mas o blog oficial diz que atividades de extensão não podem ser protocoladas como horas complementares; a leitura provável é que a proibição vale para a extensão curricularizada.', fonte: 'RAC UniCesumar; blog UniCesumar' },
  sistemas_academicos: 'Studeo, AVA UNIASSELVI/Leo App, AVA Cogna, SIA (Estácio).',
  alertas: [
    { nivel: 'alto', texto: 'Polos em Joinville não confirmados no e-MEC. O regulamento que vale é o da credenciadora do seu curso, no AVA.' },
    { nivel: 'medio', texto: 'Estácio: o teto de 50% de horas externas aparece com e sem exceção para EaD. UNINTER só tem manual de 2015. Cruzeiro do Sul (bloqueado, erro 403) e UNIP (sem documento oficial acessível) não foram lidas.' }
  ],
  cursos: [
    ead('UNICESUMAR', 'UniCesumar (EaD e presencial)', 'RAC de 19/04/2024', h(null, null, 'nao_publicado', 'https://aluno.unicesumar.edu.br/lyceump/aonline/ti/docs/RAC_Mga.pdf', { nota: 'Total por matriz. Tabela de 10 a 40 h por atividade; mínimo de 30% em cada uma de três categorias.' }), [E + 'UNICESUMAR_Regulamento_Atividades_Complementares_RAC_Mga.pdf', E + 'UNICESUMAR_Conexao_2020_envio_atividades_complementares.pdf', E + 'UNICESUMAR_Guia_Academico_2021.pdf'], { norma_aplicavel: 'unicesumar-rac', a_confirmar: ['O total de horas depende da matriz de cada curso.'], como_enviar_curso: 'Studeo > Serviços > Envio de atividade complementar (desde set/2020).' }),
    ead('COGNA', 'Cogna (Anhanguera, Unopar, Ampli)', 'ACO, regras de 10/06/2026', h(null, null, 'nao_publicado', 'https://ampli.zendesk.com/hc/pt-br/articles/4427267966228--Gradua%C3%A7%C3%A3o-Regras-Gerais-das-Atividades-complementares-ACO', { nota: 'Total por matriz. Teto de 40 h por certificado.' }), [E + 'COGNA-AMPLI_Regras_Gerais_Atividades_Complementares_ACO_Zendesk_2026-06.pdf'], { norma_aplicavel: 'cogna-aco', a_confirmar: ['As regras da Ampli valem igualmente para alunos Unopar/Anhanguera do AVA Colaborar? É provável, por serem do mesmo grupo, mas não foi confirmado.'] }),
    ead('UNIASSELVI', 'UNIASSELVI', 'Guia do Estudante 2026 e Manual Indaial 2025.1', h(null, null, 'nao_publicado', 'https://www.uniasselvi.com.br/extranet/o-2.0/download/arqu_download.php?link=301258', { nota: 'A tabela de horas só existe dentro do AVA.' }), [E + 'UNIASSELVI_Guia_do_Estudante_Graduacao_Presencial_2026.pdf', E + 'UNIASSELVI_Manual_do_Academico_Indaial_2025-1.pdf'], { a_confirmar: ['Envio: AVA ou Leo App (Semestres > Atividades Complementares > Incluir). Tabela de horas só no AVA.'] }),
    ead('ESTACIO', 'Estácio (AAC)', 'Manual 2022.1', h(null, null, 'nao_publicado', 'https://sia.estacio.br/alu/doc/manual_graduacao_ESTACIO.pdf'), [E + 'ESTACIO_Manual_do_Aluno_Graduacao_2022-1.pdf', E + 'ESTACIO-WYDEN_FACI_Regimento_Regulamento_AAC_2025.pdf', E + 'ESTACIO_Regulamento_AAC_2008.pdf'], { norma_aplicavel: 'estacio-manual', alertas: [{ nivel: 'medio', texto: 'Teto de 50% de horas externas com e sem exceção para EaD (modelo YDUQS visto na Faculdade Ideal Wyden). O Regulamento AAC de 2008 é obsoleto.' }] }),
    ead('UNINTER', 'UNINTER', 'Manual do 1º semestre de 2015', h(null, null, 'nao_publicado', 'https://portal.uninter.com/wp-content/uploads/2015/03/MANUAL-DO-ALUNO-1%C2%B0-SEMESTRE-2015.pdf', { nota: 'Segundo o manual de 2015, as AC são opcionais nos cursos de tecnologia.' }), [E + 'UNINTER_Manual_do_Aluno_1sem_2015.pdf'], { a_confirmar: ['Só existe o manual de 2015, e um texto de blog de 2026 que remete a carga ao projeto pedagógico.'], alertas: [{ nivel: 'medio', texto: 'Documento antigo (2015).' }] }),
    ead('CRUZEIRO', 'Cruzeiro do Sul', 'Não lida', h(null, null, 'nao_verificado', '', { nota: 'Documentos bloqueados (erro 403).' }), [], { a_confirmar: ['Documentos bloqueados na pesquisa.'] }),
    ead('UNIP', 'UNIP', 'Não localizada', h(null, null, 'nao_publicado', '', { nota: 'Sem documento oficial acessível.' }), [], { a_confirmar: ['Sem documento oficial acessível.'] })
  ]
});

/* ---------------- Sem norma pública ---------------- */
out('sem_norma', {
  id: 'sem_norma_publica', nome: 'Life Unic e Anhanguera Joinville (presencial)', sigla: 'Sem norma', tipo: 'faculdade', campus: 'Joinville', pasta_documentos: '',
  requisito_nome: 'Não localizado',
  resumo: 'A Faculdade Life Unic Education oferece Medicina (Portaria SERES 742/2024, 54 vagas anuais). A situação presencial da Faculdade Anhanguera de Joinville não foi confirmada no e-MEC. Nenhuma das duas publica regulamento de atividades complementares.',
  normas: [], regras_gerais: [],
  como_enviar: { sistema: 'Não localizado', prazo: 'Não localizado', quem_aprova: 'Não localizado', taxa: 'Não localizado', fonte: 'Relatório de pesquisa' },
  extensao: { mesma_hora_conta_nas_duas: 'a_confirmar', regra: 'Não localizado.', fonte: '' },
  sistemas_academicos: 'Não localizado.',
  alertas: [{ nivel: 'alto', texto: 'Nenhuma norma pública de atividades complementares. Pergunte à secretaria da sua faculdade.' }],
  cursos: [
    c('LIFE-MED', 'Life Unic Education: Medicina', 'Não localizada', h(null, null, 'nao_publicado', 'https://www.gov.br/mec/pt-br/cne/2025/novembro-2025/pces659_25.pdf'), [], { a_confirmar: ['Nenhum arquivo baixado.'] }),
    c('ANH', 'Faculdade Anhanguera de Joinville (presencial)', 'Não localizada', h(null, null, 'nao_publicado', 'https://www.gov.br/mec/pt-br/cne/pdf/pareceres-do-cne/ces/2017/pces570_17.pdf'), [], { a_confirmar: ['Nenhum arquivo baixado.'] })
  ]
});
