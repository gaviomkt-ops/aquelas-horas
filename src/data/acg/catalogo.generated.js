// GERADO por scripts/montar-catalogo.mjs a partir dos JSON desta pasta. Não edite à mão.
export default [
 {
  "id": "ielusc",
  "nome": "Faculdade IELUSC",
  "sigla": "IELUSC",
  "tipo": "faculdade",
  "campus": "Joinville",
  "pasta_documentos": "Ielusc",
  "requisito_nome": "Atividades Complementares de Graduação (ACGs)",
  "resumo": "Norma mais completa e recente da cidade (Res. CES 53/2026). A carga mínima vem do PPC/matriz de cada curso; a Tabela de Equivalência 2026 fixa o teto de cada atividade por curso.",
  "normas": [
   {
    "id": "ces-53-2026",
    "numero": "Res. CES nº 53/2026",
    "data": "2026-04-01",
    "status": "vigente",
    "nota": "Revoga a Res. 35/2019. Exige no mínimo 3 modalidades distintas e no mínimo 10% das ACGs em atividades de cunho social organizadas pela IES, preferencialmente de extensão.",
    "url": "https://faculdade.ielusc.br/wp-content/uploads/2026/04/Resolucao_n%C2%BA_53.2026_ACGs_proposta_de_atualizacao_1_assinado.pdf",
    "pdf": "Ielusc/Ielusc_Resolucao_53-2026_ACGs.pdf"
   },
   {
    "id": "tabela-2026",
    "numero": "Tabela de Equivalência e de Procedimentos de Validação de ACGs",
    "data": "2026-04-01",
    "status": "vigente",
    "nota": "Teto de cada atividade por curso. Procedimento padrão: encaminhar à Secretaria Acadêmica, de forma digital, o Certificado/Declaração.",
    "url": "https://faculdade.ielusc.br/wp-content/uploads/2026/04/Tabela_de_Equivalencia_e_de_Procedimentos_de_Validacao_de_ACGs_assinado.pdf",
    "pdf": "Ielusc/Ielusc_Tabela_Equivalencia_Validacao_ACGs_2026.pdf"
   },
   {
    "id": "guia-extensao",
    "numero": "Guia de Extensão 2025 (atualizado em fev/2026)",
    "data": "2026-02",
    "status": "vigente",
    "nota": "Horas de bolsista ou voluntário em projeto de extensão podem ser validadas como ACG pelas tabelas do curso.",
    "url": "https://faculdade.ielusc.br/wp-content/uploads/2026/03/Guia-de-Extens%C3%A3o_2025_Atualizado-fev-2026.pdf",
    "pdf": "Ielusc/Ielusc_Guia_de_Extensao_2025_atualizado_fev2026.pdf"
   },
   {
    "id": "ces-43-2021",
    "numero": "Res. CES nº 43/2021",
    "data": "2021-07-01",
    "status": "revogada",
    "nota": "Também dizia revogar a Res. 35/2019. Substituída pela Res. 53/2026.",
    "url": "https://faculdade.ielusc.br/wp-content/uploads/2021/07/Resolu%C3%A7%C3%A3o-43_2021-ACGs.pdf",
    "pdf": "Ielusc/Ielusc_Resolucao_43-2021_ACGs.pdf"
   },
   {
    "id": "ces-35-2019",
    "numero": "Res. CES nº 35/2019 (versão atualizada em 30/06/2021)",
    "data": "2019",
    "status": "revogada",
    "nota": "É a norma que o cálculo atual do app ainda usa. Revogada pela 43/2021 e depois pela 53/2026.",
    "url": "https://faculdade.ielusc.br/wp-content/uploads/2021/07/Res.-35_2019-ACGs-Atualizada-em-07_2021.pdf",
    "pdf": "Ielusc/Ielusc_Resolucao_35-2019_ACGs_atualizada_2021-07.pdf"
   }
  ],
  "regras_gerais": [
   {
    "texto": "Mínimo de 3 modalidades de atividades distintas.",
    "fonte": "Res. CES 53/2026, art. 1º, § 2º"
   },
   {
    "texto": "No mínimo 10% da carga de ACGs do curso em atividades de cunho social organizadas pela IES, preferencialmente de extensão.",
    "fonte": "Res. CES 53/2026, art. 1º, § 4º"
   },
   {
    "texto": "Ação comunitária feita dentro de disciplina só vale se transcender a carga regular da disciplina ou ocorrer em horário extraclasse.",
    "fonte": "Res. CES 53/2026, art. 2º"
   },
   {
    "texto": "Trabalho eleitoral tem horas fixas, iguais em todos os cursos: mesário 10 h; apurador 4 h; delegado de prédio 13 h; auxiliar de secretaria 6 h; motorista 8 h; auxiliar de serviço eleitoral 8 h.",
    "fonte": "Res. CES 53/2026, art. 3º"
   },
   {
    "texto": "As tabelas não incluem pontuação específica para atividades de cunho social; o relatório em formulário anexo é obrigatório para elas.",
    "fonte": "Res. CES 53/2026, arts. 4º e 5º"
   }
  ],
  "como_enviar": {
   "sistema": "Envio digital à Secretaria Acadêmica (a resolução cita a Secretaria Geral de Ensino Superior)",
   "prazo": "Período definido anualmente no Calendário Acadêmico. Pedido de projeto de extensão deve ser feito antes do início da atividade.",
   "quem_aprova": "Coordenação do curso defere as atividades sociais e os projetos de extensão",
   "taxa": "Não informada",
   "fonte": "Res. CES 53/2026, art. 4º; Tabela ACG 2026"
  },
  "extensao": {
   "mesma_hora_conta_nas_duas": "a_confirmar",
   "regra": "A extensão curricularizada é componente separado da matriz. O Guia de Extensão permite validar horas de bolsista ou voluntário de projeto como ACG (atende aos 10% sociais). O formulário de extensão da Res. 53/2026 pergunta se a atividade envolveu a curricularização, mas as notas não dizem se a mesma hora pode valer nos dois componentes.",
   "fonte": "Guia de Extensão 2025; Res. CES 53/2026, anexos"
  },
  "sistemas_academicos": "Não identificado na pesquisa. Perguntar à Secretaria Acadêmica (relevante para a futura aba Secretaria).",
  "colunas_tetos": [
   "ADM",
   "DIR",
   "EDF",
   "ENF",
   "FONO",
   "JOR",
   "NUT",
   "PEDAG",
   "PSICO",
   "PP2017",
   "PP2026"
  ],
  "categorias": [
   {
    "id": "apresentacao",
    "nome": "Apresentação de trabalho científico",
    "limite_item": "30 h por trabalho",
    "tetos": [
     40,
     90,
     90,
     40,
     80,
     90,
     90,
     90,
     80,
     90,
     120
    ]
   },
   {
    "id": "cultural_ies",
    "nome": "Atividade cultural promovida pela IES",
    "tetos": [
     40,
     40,
     60,
     40,
     80,
     60,
     60,
     30,
     60,
     60,
     80
    ]
   },
   {
    "id": "cultural_ext",
    "nome": "Atividade cultural externa",
    "tetos": [
     40,
     40,
     60,
     40,
     80,
     60,
     60,
     30,
     60,
     60,
     80
    ]
   },
   {
    "id": "extensao",
    "nome": "Extensão",
    "tetos": [
     40,
     50,
     90,
     90,
     120,
     120,
     120,
     120,
     80,
     120,
     160
    ]
   },
   {
    "id": "iniciacao",
    "nome": "Iniciação científica",
    "tetos": [
     40,
     50,
     90,
     90,
     120,
     120,
     120,
     120,
     80,
     120,
     160
    ]
   },
   {
    "id": "idiomas",
    "nome": "Curso de idiomas (feito durante a graduação)",
    "tetos": [
     50,
     50,
     40,
     40,
     60,
     60,
     60,
     90,
     60,
     80,
     80
    ]
   },
   {
    "id": "capacitacao",
    "nome": "Capacitação",
    "limite_item": "mínimo de 10 h por curso",
    "tetos": [
     50,
     40,
     60,
     60,
     60,
     70,
     70,
     90,
     60,
     90,
     120
    ]
   },
   {
    "id": "atualizacao",
    "nome": "Atualização presencial",
    "limite_item": "mínimo de 3 h",
    "tetos": [
     50,
     40,
     60,
     60,
     60,
     70,
     60,
     60,
     60,
     90,
     120
    ]
   },
   {
    "id": "online",
    "nome": "Cursos online ou a distância",
    "tetos": [
     30,
     20,
     40,
     30,
     60,
     40,
     60,
     30,
     40,
     90,
     120
    ]
   },
   {
    "id": "eletivas",
    "nome": "Disciplinas eletivas",
    "comprovante": "Certificado ou histórico e a ementa",
    "tetos": [
     40,
     80,
     80,
     80,
     80,
     80,
     120,
     120,
     80,
     160,
     220
    ]
   },
   {
    "id": "estagio",
    "nome": "Estágio não obrigatório",
    "comprovante": "Nos cursos de saúde, com carimbo do supervisor",
    "tetos": [
     50,
     50,
     90,
     40,
     120,
     100,
     120,
     120,
     40,
     null,
     100
    ]
   },
   {
    "id": "grupo_estudos",
    "nome": "Grupo de estudos",
    "tetos": [
     30,
     50,
     30,
     60,
     60,
     30,
     60,
     90,
     60,
     60,
     100
    ]
   },
   {
    "id": "intercambio",
    "nome": "Intercâmbio",
    "comprovante": "Exige termo de convênio",
    "tetos": [
     60,
     40,
     120,
     90,
     120,
     120,
     120,
     40,
     120,
     150,
     220
    ]
   },
   {
    "id": "monitoria",
    "nome": "Monitoria",
    "tetos": [
     30,
     60,
     90,
     90,
     120,
     80,
     120,
     40,
     100,
     120,
     160
    ]
   },
   {
    "id": "org_eventos",
    "nome": "Organização de eventos",
    "tetos": [
     60,
     40,
     60,
     40,
     60,
     60,
     60,
     90,
     60,
     60,
     80
    ]
   },
   {
    "id": "concursos",
    "nome": "Concursos e prêmios",
    "limite_item": "5 h por trabalho, a critério da coordenação",
    "tetos": [
     40,
     10,
     10,
     20,
     40,
     10,
     20,
     30,
     40,
     60,
     80
    ]
   },
   {
    "id": "part_eventos",
    "nome": "Participação em eventos",
    "tetos": [
     50,
     40,
     60,
     80,
     100,
     60,
     100,
     30,
     60,
     120,
     160
    ]
   },
   {
    "id": "eventos_cient",
    "nome": "Eventos científicos e culturais",
    "tetos": [
     50,
     60,
     60,
     60,
     60,
     60,
     60,
     60,
     60,
     60,
     80
    ]
   },
   {
    "id": "esportivos",
    "nome": "Eventos esportivos e recreativos",
    "tetos": [
     50,
     20,
     60,
     60,
     60,
     60,
     60,
     60,
     60,
     60,
     80
    ]
   },
   {
    "id": "juri",
    "nome": "Júri popular",
    "tetos": [
     10,
     10,
     20,
     10,
     10,
     20,
     10,
     30,
     10,
     null,
     null
    ]
   },
   {
    "id": "colegiados",
    "nome": "Órgãos colegiados (CES, CPA, DCE, Colegiado)",
    "tetos": [
     40,
     40,
     40,
     40,
     60,
     40,
     40,
     40,
     20,
     60,
     80
    ]
   },
   {
    "id": "publicacao",
    "nome": "Publicação",
    "limite_item": "40 h por trabalho na íntegra; 20 h por resumo ou resenha",
    "tetos": [
     40,
     60,
     90,
     60,
     80,
     90,
     90,
     120,
     100,
     90,
     120
    ]
   },
   {
    "id": "visitas",
    "nome": "Visitas técnicas",
    "tetos": [
     40,
     20,
     20,
     20,
     20,
     40,
     30,
     40,
     20,
     20,
     40
    ]
   }
  ],
  "categorias_fixas": [
   {
    "nome": "Representante de turma",
    "regra": "40 h por semestre (representante) e 20 h por semestre (vice), até o máximo de 80 h",
    "fonte": "Tabela ACG 2026"
   },
   {
    "nome": "Trabalhos eleitorais",
    "regra": "Mesário 10 h; apurador 4 h; delegado de prédio 13 h; auxiliar de secretaria 6 h; motorista 8 h; auxiliar de serviço eleitoral 8 h",
    "fonte": "Res. CES 53/2026, art. 3º"
   }
  ],
  "alertas": [
   {
    "nivel": "alto",
    "texto": "O cálculo de horas do app para o IELUSC ainda usa a Res. CES 35/2019, revogada pela 43/2021 e depois pela 53/2026. Tetos por categoria e metas podem ter mudado. Confirme na Secretaria Acadêmica antes de planejar."
   },
   {
    "nivel": "alto",
    "texto": "Metas do app x matrizes 2025-2026: Administração 130 h (app) x 120 h/relógio; Fonoaudiologia 160 h x 140 (sem unidade); Nutrição 180 h x 252 h/a = 210 h/relógio; Publicidade e Propaganda 200 h x 300 h; Educação Física 200 h x total não informado na matriz. Sistemas de Informação não consta entre os cursos com matriz publicada."
   },
   {
    "nivel": "medio",
    "texto": "Publicidade e Propaganda tem duas colunas na tabela (currículo 2017 e 2026). O aluno precisa saber em qual currículo está."
   },
   {
    "nivel": "medio",
    "texto": "Educação Física: a matriz lista ACG em cada fase, mas não informa o total. Fonoaudiologia e Psicologia trazem a carga sem unidade (h ou h/a)."
   }
  ],
  "cursos": [
   {
    "id": "ADM",
    "nome": "Administração",
    "coluna": "ADM",
    "matriz": {
     "codigo": "Matriz 2026-06",
     "publicada_em": "2026-06"
    },
    "horas": {
     "valor": 120,
     "unidade": "h",
     "situacao": "verificado",
     "fonte": "https://faculdade.ielusc.br/wp-content/uploads/2026/06/Matriz-ADM-1.pdf"
    },
    "pdf": [
     "Ielusc/Ielusc_Matriz_Administracao_2026-06.pdf"
    ]
   },
   {
    "id": "DIR",
    "nome": "Direito",
    "coluna": "DIR",
    "matriz": {
     "codigo": "Matriz DIREITO (2023)",
     "publicada_em": "2026-06"
    },
    "horas": {
     "valor": 125,
     "unidade": "h",
     "equivalente": {
      "valor": 150,
      "unidade": "h/a"
     },
     "situacao": "verificado",
     "fonte": "https://faculdade.ielusc.br/wp-content/uploads/2026/06/Matriz-curricular-Direito-1.pdf"
    },
    "pdf": [
     "Ielusc/Ielusc_Matriz_Direito_2026-06.pdf"
    ]
   },
   {
    "id": "EDF",
    "nome": "Educação Física",
    "coluna": "EDF",
    "matriz": {
     "codigo": "Matriz 2026",
     "publicada_em": "2026-06"
    },
    "horas": {
     "valor": null,
     "unidade": null,
     "situacao": "a_confirmar",
     "fonte": "https://faculdade.ielusc.br/wp-content/uploads/2026/06/Matriz-EDF-1-1.pdf"
    },
    "a_confirmar": [
     "A matriz lista ACG em cada fase, mas não informa o total de horas."
    ],
    "pdf": [
     "Ielusc/Ielusc_Matriz_Educacao_Fisica_2026-06.pdf"
    ]
   },
   {
    "id": "ENF",
    "nome": "Enfermagem",
    "coluna": "ENF",
    "matriz": {
     "codigo": "Matriz 2026-07",
     "publicada_em": "2026-07"
    },
    "horas": {
     "valor": 130,
     "unidade": "h",
     "situacao": "verificado",
     "fonte": "https://faculdade.ielusc.br/wp-content/uploads/2026/07/Matriz-Curricular-enfermagem-1.pdf"
    },
    "pdf": [
     "Ielusc/Ielusc_Matriz_Enfermagem_2026-07.pdf"
    ]
   },
   {
    "id": "FONO",
    "nome": "Fonoaudiologia",
    "coluna": "FONO",
    "matriz": {
     "codigo": "Matriz 2026-06",
     "publicada_em": "2026-06"
    },
    "horas": {
     "valor": 140,
     "unidade": null,
     "situacao": "a_confirmar",
     "fonte": "https://faculdade.ielusc.br/wp-content/uploads/2026/06/MATRIZ-FONO-1-1.pdf"
    },
    "a_confirmar": [
     "A matriz traz 140 sem informar se é h ou h/a."
    ],
    "pdf": [
     "Ielusc/Ielusc_Matriz_Fonoaudiologia_2026-06.pdf"
    ]
   },
   {
    "id": "JOR",
    "nome": "Jornalismo",
    "coluna": "JOR",
    "matriz": {
     "codigo": "Matriz 2026-06",
     "publicada_em": "2026-06"
    },
    "horas": {
     "valor": 120,
     "unidade": "h/a",
     "situacao": "verificado",
     "fonte": "https://faculdade.ielusc.br/wp-content/uploads/2026/06/Matriz-JORNAL-1-1.pdf"
    },
    "pdf": [
     "Ielusc/Ielusc_Matriz_Jornalismo_2026-06.pdf"
    ]
   },
   {
    "id": "NUT",
    "nome": "Nutrição",
    "coluna": "NUT",
    "matriz": {
     "codigo": "Matriz Nutrição 2026",
     "publicada_em": "2026-05"
    },
    "horas": {
     "valor": 252,
     "unidade": "h/a",
     "equivalente": {
      "valor": 210,
      "unidade": "h"
     },
     "situacao": "verificado",
     "fonte": "https://faculdade.ielusc.br/wp-content/uploads/2026/05/Matriz-Curricular-NUTRI%C3%87%C3%83O-2026.pdf"
    },
    "pdf": [
     "Ielusc/Ielusc_Matriz_Nutricao_2026-05.pdf"
    ]
   },
   {
    "id": "PEDAG",
    "nome": "Pedagogia",
    "coluna": "PEDAG",
    "matriz": {
     "codigo": "Matriz 2026-04",
     "publicada_em": "2026-04"
    },
    "horas": {
     "valor": 240,
     "unidade": "h/a",
     "equivalente": {
      "valor": 200,
      "unidade": "h"
     },
     "situacao": "verificado",
     "fonte": "https://faculdade.ielusc.br/wp-content/uploads/2026/04/Matriz-Curricular-Pedagogia.pdf"
    },
    "pdf": [
     "Ielusc/Ielusc_Matriz_Pedagogia_2026-04.pdf"
    ]
   },
   {
    "id": "PSICO",
    "nome": "Psicologia",
    "coluna": "PSICO",
    "matriz": {
     "codigo": "Matriz 2025-12",
     "publicada_em": "2025-12"
    },
    "horas": {
     "valor": 120,
     "unidade": null,
     "situacao": "a_confirmar",
     "fonte": "https://faculdade.ielusc.br/wp-content/uploads/2025/12/Matriz-PSICO.pdf"
    },
    "a_confirmar": [
     "A matriz traz 120 sem informar se é h ou h/a."
    ],
    "pdf": [
     "Ielusc/Ielusc_Matriz_Psicologia_2025-12.pdf"
    ]
   },
   {
    "id": "PP",
    "nome": "Publicidade e Propaganda",
    "coluna": "PP2026",
    "coluna_alternativa": {
     "PP2017": "Currículo 2017"
    },
    "matriz": {
     "codigo": "Matriz 2026-06 (a tabela tem colunas PP 2017 e PP 2026)",
     "publicada_em": "2026-06"
    },
    "horas": {
     "valor": 300,
     "unidade": "h",
     "situacao": "verificado",
     "fonte": "https://faculdade.ielusc.br/wp-content/uploads/2026/06/Matriz-PP-1-1.pdf"
    },
    "a_confirmar": [
     "O total de 300 h é o da matriz publicada em 2026. O app não sabe a qual currículo (2017 ou 2026) o aluno pertence."
    ],
    "pdf": [
     "Ielusc/Ielusc_Matriz_Publicidade_Propaganda_2026-06.pdf"
    ]
   }
  ]
 },
 {
  "id": "univille",
  "nome": "Univille (Universidade da Região de Joinville)",
  "sigla": "Univille",
  "tipo": "universidade",
  "campus": "Joinville",
  "pasta_documentos": "Univille",
  "requisito_nome": "Atividades Complementares (licenciaturas antigas: AACC)",
  "resumo": "O regulamento mora no anexo de cada PPC. Os PPCs dizem que as AC são regidas pela \"Resolução vigente da Univille\", sem número. A carga vem da matriz de cada curso (h/a e h, com h = h/a × 5/6).",
  "normas": [
   {
    "id": "regimento",
    "numero": "Regimento Geral (atualizado em maio/2021), art. 104",
    "data": "2021-05",
    "status": "vigente",
    "nota": "Remete a avaliação das AC a regulamentos próprios do curso, aprovados pelo Conselho Universitário.",
    "url": "https://www.univille.edu.br/community/novoportal/VirtualDisk.html/downloadDirect/2698690/RegimentoUniville_atualizado_maio21.pdf",
    "pdf": "Univille/Univille - Regimento Geral (atualizado maio 2021).pdf"
   },
   {
    "id": "res-53-25-consun",
    "numero": "Res. 53/25 Consun",
    "data": "2025-12-11",
    "status": "vigente",
    "nota": "Atualizou quase todos os PPCs. Os PPCs nasceram da Inovação Curricular (Res. 19/20 Consun).",
    "url": "https://univille.edu.br/community/novoportal/VirtualDisk.html/downloadDirect/4028401/Guia_academico_geral2025_FINAL.pdf",
    "pdf": "Univille/Univille - Guia Academico Geral 2025.pdf"
   },
   {
    "id": "res-04-08-cepe",
    "numero": "Res. 04/08/Cepe",
    "data": "2008",
    "status": "nao_publicada",
    "nota": "Única resolução institucional de AC citada por número (no PPC de História). Não está publicada.",
    "url": "https://seja.univille.br/wp-content/uploads/2025/12/PPC-Historia-para-ingressantes-a-partir-de-2022.pdf",
    "pdf": ""
   }
  ],
  "regras_gerais": [
   {
    "texto": "Direito: quatro categorias (ensino, pesquisa, extensão, não acadêmicas), cada uma com teto de 50%, salvo as não acadêmicas (25%). Online pode cobrir 25% da carga exigida.",
    "fonte": "PPC Direito"
   },
   {
    "texto": "Psicologia: atividade em pelo menos dois eixos; até 150 horas online; entrega só em outubro.",
    "fonte": "PPC Psicologia"
   },
   {
    "texto": "Engenharias, SI (Engetec): entrega à medida que as atividades são feitas; só conta o que foi feito após o início do curso; estágio não obrigatório 40 h por ano, até 80 h.",
    "fonte": "PPC Engenharia Civil"
   },
   {
    "texto": "Publicidade: no mínimo três atividades distintas.",
    "fonte": "PPC Publicidade"
   }
  ],
  "como_enviar": {
   "sistema": "Coordenação ou secretaria do curso, com prazos próprios; lançamento pela CAA. Medicina lança no sistema Saturno. Direito: e-mail direito@univille.br.",
   "prazo": "Varia por curso. Direito: somente no 10º semestre, até 31/05 ou 31/10. Psicologia: outubro. Medicina: até dois meses antes do fim do 12º semestre. Engetec: à medida que as atividades são feitas.",
   "quem_aprova": "Coordenação do curso (a pesquisa não detalha o órgão para todos os cursos)",
   "taxa": "Não informada",
   "fonte": "PPCs de cada curso"
  },
  "extensao": {
   "mesma_hora_conta_nas_duas": "a_confirmar",
   "regra": "A extensão é feita por componentes da matriz e fica separada das AC (Eng. Civil: 360 h de Vivências de Extensão; Publicidade: 282 h de projetos experimentais). Direito e Engetec são explícitos: não contar a mesma hora nos dois. A Medicina é a exceção: suas AC entram na conta dos 10% de extensão. Nos demais cursos a pesquisa não localizou regra.",
   "fonte": "PPCs de Direito, Engenharia Civil, Publicidade e Medicina"
  },
  "sistemas_academicos": "CAA (lançamento) e Saturno (Medicina).",
  "alertas": [
   {
    "nivel": "alto",
    "texto": "Os PPCs citam \"Resolução vigente\" de AC sem número. Confirmar na Pró-Reitoria de Ensino qual resolução vale."
   },
   {
    "nivel": "medio",
    "texto": "Administração não tem regulamento de AC no PPC. Pedagogia e Educação Física (bacharelado) aparecem com AC = 0, o que precisa de confirmação. O regulamento de Design é de 2015."
   },
   {
    "nivel": "info",
    "texto": "Há PPCs cuja carga de AC não foi verificada (Artes Visuais, Ciências Econômicas, Ciências da Religião, Educação Escolar Quilombola, Educação Especial, Educação Física licenciatura, Enfermagem até 2022, Geografia, Letras e Odontologia)."
   }
  ],
  "cursos": [
   {
    "id": "ADM-2021",
    "nome": "Administração",
    "matriz": {
     "codigo": "Matriz 2021"
    },
    "horas": {
     "valor": 144,
     "unidade": "h/a",
     "equivalente": {
      "valor": 120,
      "unidade": "h"
     },
     "situacao": "verificado",
     "fonte": "linha \"Atividades Complementares\" da matriz do PPC"
    },
    "pdf": [
     "Univille/Univille - PPC-Administracao-Joinville-para-ingressantes-a-partir-de-2022.pdf"
    ],
    "a_confirmar": [
     "O PPC não traz regulamento de AC."
    ]
   },
   {
    "id": "ADM-2022",
    "nome": "Administração",
    "matriz": {
     "codigo": "Matriz 2022"
    },
    "horas": {
     "valor": 180,
     "unidade": "h/a",
     "equivalente": {
      "valor": 150,
      "unidade": "h"
     },
     "situacao": "verificado",
     "fonte": "linha \"Atividades Complementares\" da matriz do PPC"
    },
    "pdf": [
     "Univille/Univille - PPC-Administracao-Joinville-para-ingressantes-a-partir-de-2022.pdf"
    ],
    "a_confirmar": [
     "O PPC não traz regulamento de AC."
    ]
   },
   {
    "id": "ARQ",
    "nome": "Arquitetura e Urbanismo",
    "matriz": {
     "codigo": "Ingressantes a partir de 2021/1"
    },
    "horas": {
     "valor": 432,
     "unidade": "h/a",
     "equivalente": {
      "valor": 360,
      "unidade": "h"
     },
     "situacao": "verificado",
     "fonte": "linha \"Atividades Complementares\" da matriz do PPC"
    },
    "pdf": [
     "Univille/Univille - PPC-Arquitetura-e-Urbanismo-Joinville-para-ingressantes-a-partir-de-2021-1.pdf"
    ],
    "a_confirmar": [
     "Capa do regulamento com \"Parecer nº XXX\"."
    ]
   },
   {
    "id": "CBIO-B",
    "nome": "Ciências Biológicas (bacharelado)",
    "matriz": {
     "codigo": "Ingressantes a partir de 2022"
    },
    "horas": {
     "valor": 72,
     "unidade": "h/a",
     "equivalente": {
      "valor": 60,
      "unidade": "h"
     },
     "situacao": "verificado",
     "fonte": "linha \"Atividades Complementares\" da matriz do PPC"
    },
    "pdf": [
     "Univille/Univille - PPC-Bacharelado-Ciencias-Biologicas-para-ingressantes-a-partir-de-2022.pdf"
    ]
   },
   {
    "id": "CBIO-L",
    "nome": "Ciências Biológicas (licenciatura)",
    "matriz": {
     "codigo": "Ingressantes a partir de 2023"
    },
    "horas": {
     "valor": 102,
     "unidade": "h/a",
     "equivalente": {
      "valor": 85,
      "unidade": "h"
     },
     "situacao": "verificado",
     "fonte": "linha \"Atividades Complementares\" da matriz do PPC"
    },
    "pdf": [
     "Univille/Univille - PPC Licenciatura Ciencias Biologicas ingressantes a partir de 2023.pdf"
    ],
    "a_confirmar": [
     "Anexo do regulamento ausente ou em branco."
    ]
   },
   {
    "id": "CONT-2022",
    "nome": "Ciências Contábeis",
    "matriz": {
     "codigo": "Ingressantes 2022"
    },
    "horas": {
     "valor": 216,
     "unidade": "h/a",
     "equivalente": {
      "valor": 180,
      "unidade": "h"
     },
     "situacao": "verificado",
     "fonte": "linha \"Atividades Complementares\" da matriz do PPC"
    },
    "pdf": [
     "Univille/Univille - PPC-Ciencias-Contabeis-Joinville-Ingressantes-2022.pdf"
    ],
    "a_confirmar": [
     "O mesmo PPC tem duas matrizes."
    ]
   },
   {
    "id": "CONT-2024",
    "nome": "Ciências Contábeis",
    "matriz": {
     "codigo": "A partir de 2024/1"
    },
    "horas": {
     "valor": 252,
     "unidade": "h/a",
     "equivalente": {
      "valor": 210,
      "unidade": "h"
     },
     "situacao": "verificado",
     "fonte": "linha \"Atividades Complementares\" da matriz do PPC"
    },
    "pdf": [
     "Univille/Univille - PPC-Ciencias-Contabeis-Joinville-Ingressantes-2022.pdf"
    ],
    "a_confirmar": [
     "O mesmo PPC tem duas matrizes."
    ]
   },
   {
    "id": "CINE",
    "nome": "Cinema e Audiovisual",
    "matriz": {
     "codigo": "Ingressantes a partir de 2023/1"
    },
    "horas": {
     "valor": 150,
     "unidade": "h/a",
     "equivalente": {
      "valor": 125,
      "unidade": "h"
     },
     "situacao": "verificado",
     "fonte": "linha \"Atividades Complementares\" da matriz do PPC"
    },
    "pdf": [
     "Univille/Univille - PPC-Cinema-para-ingressantes-a-partir-de-2023-1.pdf"
    ]
   },
   {
    "id": "COMEX",
    "nome": "Comércio Exterior",
    "matriz": {
     "codigo": "Ingressantes a partir de 2024/2"
    },
    "horas": {
     "valor": null,
     "unidade": null,
     "situacao": "a_confirmar",
     "fonte": ""
    },
    "pdf": [
     "Univille/Univille - PPC-Comercio-Exterior-para-ingressantes-a-partir-de-2024-2.pdf"
    ],
    "a_confirmar": [
     "O PPC traz duas matrizes: 252 h/a (210 h) e 288 h/a (240 h). O relatório não diz qual vale para cada ingressante."
    ],
    "alertas": [
     {
      "nivel": "medio",
      "texto": "Duas cargas no mesmo PPC (252 h/a e 288 h/a). Confirmar com a coordenação."
     }
    ]
   },
   {
    "id": "DESIGN",
    "nome": "Design (todas as linhas)",
    "matriz": {
     "codigo": "Ingressantes a partir de 2021"
    },
    "horas": {
     "valor": 192,
     "unidade": "h/a",
     "equivalente": {
      "valor": 160,
      "unidade": "h"
     },
     "situacao": "verificado",
     "fonte": "linha \"Atividades Complementares\" da matriz do PPC"
    },
    "pdf": [
     "Univille/Univille - PPC-Design-para-ingressantes-a-partir-de-2021.pdf"
    ],
    "regulamento_ppc": "Regulamento de 10/12/2015: o aluno \"deverá cumprir até\" 10% em ensino, 5% em pesquisa e 85% em extensão.",
    "alertas": [
     {
      "nivel": "medio",
      "texto": "Regulamento de 2015. A redação \"deverá cumprir até\" deixa dúvida se os percentuais são mínimos ou máximos."
     }
    ]
   },
   {
    "id": "DIR",
    "nome": "Direito",
    "matriz": {
     "codigo": "Ingressantes a partir de 2021 (atualizações dez/2025)"
    },
    "horas": {
     "valor": 288,
     "unidade": "h/a",
     "equivalente": {
      "valor": 240,
      "unidade": "h"
     },
     "situacao": "verificado",
     "fonte": "linha \"Atividades Complementares\" da matriz do PPC",
     "alternativa": {
      "valor": 240,
      "unidade": "h/a",
      "origem": "regulamento (Anexo II) do PPC; a matriz traz 288 h/a = 240 h"
     }
    },
    "pdf": [
     "Univille/Univille - PPC-Direito-para-ingressantes-a-partir-de-2021-com-atualizacoes-em-dez.25-1.pdf"
    ],
    "regulamento_ppc": "Anexo II, Consun 17/03/2022. Quatro categorias (ensino, pesquisa, extensão e não acadêmicas), cada uma com teto de 50%; as não acadêmicas até 25%. Cursos online podem cobrir 25% da carga exigida. Envio por e-mail para direito@univille.br somente no 10º semestre, até 31 de maio ou 31 de outubro. Quem não cumprir fica impedido de colar grau.",
    "a_confirmar": [
     "Regulamento: 240 h/aula. Matriz: 288 h/a (= 240 h)."
    ],
    "alertas": [
     {
      "nivel": "alto",
      "texto": "O regulamento diz 240 horas/aula, mas a matriz traz 288 h/a = 240 h. Tudo indica erro de unidade no regulamento. Confirmar com a Coordenação de Direito."
     },
     {
      "nivel": "alto",
      "texto": "O arquivo publicado como \"PPC-2021.pdf\" do Direito é, na verdade, o PPC de 2015 (336 h/a e outro procedimento). Não usar."
     }
    ],
    "extensao": {
     "mesma_hora_conta_nas_duas": "nao",
     "regra": "Extensão só conta como AC se as horas não tiverem sido computadas como requisitos de outros componentes.",
     "fonte": "PPC do curso"
    }
   },
   {
    "id": "EDF-B",
    "nome": "Educação Física (bacharelado)",
    "matriz": {
     "codigo": "Ingressantes a partir de 2025/1"
    },
    "horas": {
     "valor": 0,
     "unidade": "h/a",
     "equivalente": {
      "valor": 0,
      "unidade": "h"
     },
     "situacao": "zero_a_confirmar",
     "fonte": "linha \"Atividades Complementares\" da matriz do PPC"
    },
    "pdf": [
     "Univille/Univille - PPC-Educacao-Fisica-Bacharelado-para-ingressantes-a-partir-de-2025-1.pdf"
    ],
    "a_confirmar": [
     "AC = 0 na matriz. Confirmar com a coordenação."
    ]
   },
   {
    "id": "ENF-2023",
    "nome": "Enfermagem",
    "matriz": {
     "codigo": "Ingressantes a partir de 2023"
    },
    "horas": {
     "valor": 150,
     "unidade": "h/a",
     "equivalente": {
      "valor": 125,
      "unidade": "h"
     },
     "situacao": "verificado",
     "fonte": "linha \"Atividades Complementares\" da matriz do PPC"
    },
    "pdf": [
     "Univille/Univille - 08.-PPC-Enfermagem-para-ingressantes-a-partir-de-2023.pdf"
    ]
   },
   {
    "id": "EAMB",
    "nome": "Engenharia Ambiental e Sanitária",
    "matriz": {
     "codigo": "Ingressantes a partir de 2021/1"
    },
    "horas": {
     "valor": 84,
     "unidade": "h/a",
     "equivalente": {
      "valor": 70,
      "unidade": "h"
     },
     "situacao": "verificado",
     "fonte": "linha \"Atividades Complementares\" da matriz do PPC"
    },
    "pdf": [
     "Univille/Univille - PPC-Engenharia-Ambiental-e-Sanitaria-para-ingressantes-a-partir-de-2021-1.pdf"
    ],
    "regulamento_ppc": "Regulamento Engetec (comum às engenharias e à SI): entrega na secretaria à medida que as atividades são feitas; só conta o que foi feito após o início do curso; estágio não obrigatório vale 40 h por ano, até 80 h.",
    "extensao": {
     "mesma_hora_conta_nas_duas": "nao",
     "regra": "O regulamento Engetec segue a regra de não contar a mesma atividade nos dois componentes (conforme o relatório).",
     "fonte": "PPC do curso"
    }
   },
   {
    "id": "ECIV",
    "nome": "Engenharia Civil",
    "matriz": {
     "codigo": "Ingressantes a partir de 2021"
    },
    "horas": {
     "valor": 348,
     "unidade": "h/a",
     "equivalente": {
      "valor": 290,
      "unidade": "h"
     },
     "situacao": "verificado",
     "fonte": "linha \"Atividades Complementares\" da matriz do PPC"
    },
    "pdf": [
     "Univille/Univille - PPC-Engenharia-Civil-para-ingressantes-a-partir-de-2021.pdf"
    ],
    "regulamento_ppc": "Regulamento Engetec (comum às engenharias e à SI): entrega na secretaria à medida que as atividades são feitas; só conta o que foi feito após o início do curso; estágio não obrigatório vale 40 h por ano, até 80 h.",
    "extensao": {
     "mesma_hora_conta_nas_duas": "nao",
     "regra": "O regulamento Engetec segue a regra de não contar a mesma atividade nos dois componentes (conforme o relatório).",
     "fonte": "PPC do curso"
    }
   },
   {
    "id": "EMEC",
    "nome": "Engenharia Mecânica",
    "matriz": {
     "codigo": "Ingressantes a partir de 2021"
    },
    "horas": {
     "valor": 312,
     "unidade": "h/a",
     "equivalente": {
      "valor": 260,
      "unidade": "h"
     },
     "situacao": "verificado",
     "fonte": "linha \"Atividades Complementares\" da matriz do PPC"
    },
    "pdf": [
     "Univille/Univille - PPC-Engenharia-Mecanica-Joinville-para-ingressantes-a-partir-de-2021.pdf"
    ],
    "regulamento_ppc": "Regulamento Engetec (comum às engenharias e à SI): entrega na secretaria à medida que as atividades são feitas; só conta o que foi feito após o início do curso; estágio não obrigatório vale 40 h por ano, até 80 h.",
    "extensao": {
     "mesma_hora_conta_nas_duas": "nao",
     "regra": "O regulamento Engetec segue a regra de não contar a mesma atividade nos dois componentes (conforme o relatório).",
     "fonte": "PPC do curso"
    }
   },
   {
    "id": "EPROD",
    "nome": "Engenharia de Produção",
    "matriz": {
     "codigo": "Ingressantes a partir de 2021"
    },
    "horas": {
     "valor": 312,
     "unidade": "h/a",
     "equivalente": {
      "valor": 260,
      "unidade": "h"
     },
     "situacao": "verificado",
     "fonte": "linha \"Atividades Complementares\" da matriz do PPC"
    },
    "pdf": [
     "Univille/Univille - PPC-Engenharia-Producao-Joinville-para-ingressantes-a-partir-de-2021.pdf"
    ],
    "regulamento_ppc": "Regulamento Engetec (comum às engenharias e à SI): entrega na secretaria à medida que as atividades são feitas; só conta o que foi feito após o início do curso; estágio não obrigatório vale 40 h por ano, até 80 h.",
    "extensao": {
     "mesma_hora_conta_nas_duas": "nao",
     "regra": "O regulamento Engetec segue a regra de não contar a mesma atividade nos dois componentes (conforme o relatório).",
     "fonte": "PPC do curso"
    }
   },
   {
    "id": "EQUI",
    "nome": "Engenharia Química",
    "matriz": {
     "codigo": "Ingressantes a partir de 2025/1"
    },
    "horas": {
     "valor": 78,
     "unidade": "h/a",
     "equivalente": {
      "valor": 65,
      "unidade": "h"
     },
     "situacao": "verificado",
     "fonte": "linha \"Atividades Complementares\" da matriz do PPC"
    },
    "pdf": [
     "Univille/Univille - PPC-Engenharia-Quimica-Joinville-para-ingressantes-a-partir-de-2025-1.pdf"
    ],
    "regulamento_ppc": "Regulamento Engetec (comum às engenharias e à SI): entrega na secretaria à medida que as atividades são feitas; só conta o que foi feito após o início do curso; estágio não obrigatório vale 40 h por ano, até 80 h.",
    "extensao": {
     "mesma_hora_conta_nas_duas": "nao",
     "regra": "O regulamento Engetec segue a regra de não contar a mesma atividade nos dois componentes (conforme o relatório).",
     "fonte": "PPC do curso"
    }
   },
   {
    "id": "ESOFT",
    "nome": "Engenharia de Software",
    "matriz": {
     "codigo": "Ingressantes a partir de 2021"
    },
    "horas": {
     "valor": 216,
     "unidade": "h/a",
     "equivalente": {
      "valor": 180,
      "unidade": "h"
     },
     "situacao": "verificado",
     "fonte": "linha \"Atividades Complementares\" da matriz do PPC"
    },
    "pdf": [
     "Univille/Univille - PPC-Engenharia-de-Software-Joinville-para-ingressantes-a-partir-de-2021.pdf"
    ],
    "regulamento_ppc": "Regulamento Engetec (comum às engenharias e à SI): entrega na secretaria à medida que as atividades são feitas; só conta o que foi feito após o início do curso; estágio não obrigatório vale 40 h por ano, até 80 h.",
    "extensao": {
     "mesma_hora_conta_nas_duas": "nao",
     "regra": "O regulamento Engetec segue a regra de não contar a mesma atividade nos dois componentes (conforme o relatório).",
     "fonte": "PPC do curso"
    }
   },
   {
    "id": "FARM",
    "nome": "Farmácia",
    "matriz": {
     "codigo": "Ingressantes a partir de 2022/2"
    },
    "horas": {
     "valor": 144,
     "unidade": "h/a",
     "equivalente": {
      "valor": 120,
      "unidade": "h"
     },
     "situacao": "verificado",
     "fonte": "linha \"Atividades Complementares\" da matriz do PPC"
    },
    "pdf": [
     "Univille/Univille - 05.-PPC-Farmacia-para-ingressantes-a-partir-de-2022-2.pdf"
    ]
   },
   {
    "id": "FISIO",
    "nome": "Fisioterapia",
    "matriz": {
     "codigo": "Ingressantes a partir de 2024"
    },
    "horas": {
     "valor": 162,
     "unidade": "h/a",
     "equivalente": {
      "valor": 135,
      "unidade": "h"
     },
     "situacao": "verificado",
     "fonte": "linha \"Atividades Complementares\" da matriz do PPC"
    },
    "pdf": [
     "Univille/Univille - PPC-Fisioterapia-para-ingressantes-a-partir-de-2024.pdf"
    ]
   },
   {
    "id": "GASTRO",
    "nome": "Gastronomia",
    "matriz": {
     "codigo": "Ingressantes a partir de 2022"
    },
    "horas": {
     "valor": 200,
     "unidade": "h/a",
     "equivalente": {
      "valor": 167,
      "unidade": "h"
     },
     "situacao": "verificado",
     "fonte": "linha \"Atividades Complementares\" da matriz do PPC"
    },
    "pdf": [
     "Univille/Univille - PPC-Gastronomia-para-ingressantes-a-partir-de-2022.pdf"
    ]
   },
   {
    "id": "HIST",
    "nome": "História (licenciatura)",
    "matriz": {
     "codigo": "Ingressantes a partir de 2022"
    },
    "horas": {
     "valor": null,
     "unidade": null,
     "situacao": "contraditorio",
     "fonte": ""
    },
    "pdf": [
     "Univille/Univille - PPC Historia ingressantes a partir de 2022.pdf"
    ],
    "a_confirmar": [
     "O PPC traz três números: 80 h/a (67 h) na matriz, 240 h/a e 200 h no texto. Anexo 6 em branco; cita a Res. 04/08/Cepe, não publicada."
    ],
    "alertas": [
     {
      "nivel": "alto",
      "texto": "Três cargas diferentes no mesmo PPC (80 h/a na matriz, 240 h/a e 200 h no texto). Confirmar com a Coordenação de História."
     }
    ]
   },
   {
    "id": "MED",
    "nome": "Medicina",
    "matriz": {
     "codigo": "Ingressantes a partir de 2022"
    },
    "horas": {
     "valor": 90,
     "unidade": "h/a",
     "equivalente": {
      "valor": 75,
      "unidade": "h"
     },
     "situacao": "verificado",
     "fonte": "linha \"Atividades Complementares\" da matriz do PPC"
    },
    "pdf": [
     "Univille/Univille - PPC-Medicina-para-ingressantes-a-partir-de-2022.pdf"
    ],
    "regulamento_ppc": "Anexo I, Consun 01/08/2019. Documentos entregues até dois meses antes do fim do 12º semestre; horas lançadas no sistema Saturno.",
    "extensao": {
     "mesma_hora_conta_nas_duas": "parcial",
     "regra": "O PPC da Medicina inclui as atividades complementares dentro da conta dos 10% de extensão.",
     "fonte": "PPC Medicina"
    }
   },
   {
    "id": "NUT",
    "nome": "Nutrição",
    "matriz": {
     "codigo": "Ingressantes a partir de 2023/1"
    },
    "horas": {
     "valor": 63,
     "unidade": "h/a",
     "equivalente": {
      "valor": 52,
      "unidade": "h"
     },
     "situacao": "verificado",
     "fonte": "linha \"Atividades Complementares\" da matriz do PPC"
    },
    "pdf": [
     "Univille/Univille - PPC-Nutricao-para-ingressantes-a-partir-de-2023-1.pdf"
    ]
   },
   {
    "id": "PED",
    "nome": "Pedagogia",
    "matriz": {
     "codigo": "Ingressantes a partir de 2021"
    },
    "horas": {
     "valor": 0,
     "unidade": "h/a",
     "equivalente": {
      "valor": 0,
      "unidade": "h"
     },
     "situacao": "zero_a_confirmar",
     "fonte": "linha \"Atividades Complementares\" da matriz do PPC"
    },
    "pdf": [
     "Univille/Univille - PPC-Pedagogia-para-ingressantes-a-partir-de-2021.pdf"
    ],
    "a_confirmar": [
     "AC = 0 na matriz. Confirmar com a coordenação."
    ]
   },
   {
    "id": "PSI",
    "nome": "Psicologia",
    "matriz": {
     "codigo": "Ingressantes a partir de 2022/1"
    },
    "horas": {
     "valor": 272,
     "unidade": "h/a",
     "equivalente": {
      "valor": 227,
      "unidade": "h"
     },
     "situacao": "verificado",
     "fonte": "linha \"Atividades Complementares\" da matriz do PPC"
    },
    "pdf": [
     "Univille/Univille - PPC-Psicologia-para-ingressantes-a-partir-de-2022-1.pdf"
    ],
    "regulamento_ppc": "Anexo II, Consun 16/04/2026 (o mais novo). Exige atividade em pelo menos dois eixos; aceita até 150 horas online; entrega apenas em outubro."
   },
   {
    "id": "PP",
    "nome": "Publicidade e Propaganda",
    "matriz": {
     "codigo": "Ingressantes a partir de 2022/1"
    },
    "horas": {
     "valor": 120,
     "unidade": "h/a",
     "equivalente": {
      "valor": 100,
      "unidade": "h"
     },
     "situacao": "verificado",
     "fonte": "linha \"Atividades Complementares\" da matriz do PPC"
    },
    "pdf": [
     "Univille/Univille - PPC-Publicidade-e-Propaganda-para-ingressantes-a-partir-de-2022-1.pdf"
    ],
    "regulamento_ppc": "Anexo II, Consun 20/05/2021. Exige no mínimo três atividades distintas."
   },
   {
    "id": "SI",
    "nome": "Sistemas de Informação",
    "matriz": {
     "codigo": "Ingressantes a partir de 2021/1"
    },
    "horas": {
     "valor": 48,
     "unidade": "h/a",
     "equivalente": {
      "valor": 40,
      "unidade": "h"
     },
     "situacao": "verificado",
     "fonte": "linha \"Atividades Complementares\" da matriz do PPC"
    },
    "pdf": [
     "Univille/Univille - PPC-Sistemas-Informacao-para-ingressantes-a-partir-de-2021-1.pdf"
    ],
    "regulamento_ppc": "Regulamento Engetec (comum às engenharias e à SI): entrega na secretaria à medida que as atividades são feitas; só conta o que foi feito após o início do curso; estágio não obrigatório vale 40 h por ano, até 80 h.",
    "extensao": {
     "mesma_hora_conta_nas_duas": "nao",
     "regra": "O regulamento Engetec segue a regra de não contar a mesma atividade nos dois componentes (conforme o relatório).",
     "fonte": "PPC do curso"
    }
   },
   {
    "id": "ARTV",
    "nome": "Artes Visuais (bacharelado)",
    "matriz": {
     "codigo": "Ingressantes a partir de 2021/1"
    },
    "horas": {
     "valor": null,
     "unidade": null,
     "situacao": "nao_verificado",
     "fonte": ""
    },
    "pdf": [
     "Univille/Univille - PPC-Artes-Visuais-Bacharelado-para-ingressantes-a-partir-de-2021-1.pdf"
    ],
    "a_confirmar": [
     "A carga de AC deste PPC não foi verificada na pesquisa."
    ]
   },
   {
    "id": "ECON",
    "nome": "Ciências Econômicas",
    "matriz": {
     "codigo": "Ingressantes a partir de 2022"
    },
    "horas": {
     "valor": null,
     "unidade": null,
     "situacao": "nao_verificado",
     "fonte": ""
    },
    "pdf": [
     "Univille/Univille - PPC-Ciencias-Economicas-para-ingressantes-a-partir-de-2022.pdf"
    ],
    "a_confirmar": [
     "A carga de AC deste PPC não foi verificada na pesquisa."
    ]
   },
   {
    "id": "RELIG",
    "nome": "Ciências da Religião",
    "matriz": {
     "codigo": "Ingressantes a partir de 2022/1"
    },
    "horas": {
     "valor": null,
     "unidade": null,
     "situacao": "nao_verificado",
     "fonte": ""
    },
    "pdf": [
     "Univille/Univille - PPC-Ciencias-da-Religiao-para-ingressantes-a-partir-de-2022-1.pdf"
    ],
    "a_confirmar": [
     "A carga de AC deste PPC não foi verificada na pesquisa."
    ]
   },
   {
    "id": "QUILOM",
    "nome": "Educação Escolar Quilombola",
    "matriz": {
     "codigo": "Ingressantes a partir de 2022"
    },
    "horas": {
     "valor": null,
     "unidade": null,
     "situacao": "nao_verificado",
     "fonte": ""
    },
    "pdf": [
     "Univille/Univille - PPC-Educacao-Escolar-Quilombola-para-ingressantes-a-partir-de-2022.pdf"
    ],
    "a_confirmar": [
     "A carga de AC deste PPC não foi verificada na pesquisa."
    ]
   },
   {
    "id": "ESPECIAL",
    "nome": "Educação Especial",
    "matriz": {
     "codigo": "PPC set/2026"
    },
    "horas": {
     "valor": null,
     "unidade": null,
     "situacao": "nao_verificado",
     "fonte": ""
    },
    "pdf": [
     "Univille/Univille - PPC-Educacao-Especial-set-2026.pdf"
    ],
    "a_confirmar": [
     "A carga de AC deste PPC não foi verificada na pesquisa."
    ]
   },
   {
    "id": "EDF-L",
    "nome": "Educação Física (licenciatura)",
    "matriz": {
     "codigo": "Ingressantes a partir de 2025/1"
    },
    "horas": {
     "valor": null,
     "unidade": null,
     "situacao": "nao_verificado",
     "fonte": ""
    },
    "pdf": [
     "Univille/Univille - PPC-Educacao-Fisica-Licenciatura-para-ingressantes-a-partir-2025-1.pdf"
    ],
    "a_confirmar": [
     "A carga de AC deste PPC não foi verificada na pesquisa."
    ]
   },
   {
    "id": "ENF-2022",
    "nome": "Enfermagem",
    "matriz": {
     "codigo": "Ingressantes até 2022"
    },
    "horas": {
     "valor": null,
     "unidade": null,
     "situacao": "nao_verificado",
     "fonte": ""
    },
    "pdf": [
     "Univille/Univille - 02.-PPC-Enfermagem-para-ingressantes-ate-2022.pdf"
    ],
    "a_confirmar": [
     "A carga de AC deste PPC não foi verificada na pesquisa."
    ]
   },
   {
    "id": "GEO",
    "nome": "Geografia",
    "matriz": {
     "codigo": "Ingressantes a partir de 2022"
    },
    "horas": {
     "valor": null,
     "unidade": null,
     "situacao": "nao_verificado",
     "fonte": ""
    },
    "pdf": [
     "Univille/Univille - PPC-Geografia-para-ingressantes-a-partir-de-2022.pdf"
    ],
    "a_confirmar": [
     "A carga de AC deste PPC não foi verificada na pesquisa."
    ]
   },
   {
    "id": "LET-B",
    "nome": "Letras (bacharelado)",
    "matriz": {
     "codigo": "Ingressantes a partir de 2021"
    },
    "horas": {
     "valor": null,
     "unidade": null,
     "situacao": "nao_verificado",
     "fonte": ""
    },
    "pdf": [
     "Univille/Univille - PPC-Letras-Bacharelado-para-ingressantes-a-partir-de-2021.pdf"
    ],
    "a_confirmar": [
     "A carga de AC deste PPC não foi verificada na pesquisa."
    ]
   },
   {
    "id": "LET-L",
    "nome": "Letras (licenciatura)",
    "matriz": {
     "codigo": "Ingressantes a partir de 2021/1"
    },
    "horas": {
     "valor": null,
     "unidade": null,
     "situacao": "nao_verificado",
     "fonte": ""
    },
    "pdf": [
     "Univille/Univille - PPC-Letras-Licenciatura-para-ingressantes-a-partir-de-2021-1.pdf"
    ],
    "a_confirmar": [
     "A carga de AC deste PPC não foi verificada na pesquisa."
    ]
   },
   {
    "id": "ODONTO",
    "nome": "Odontologia",
    "matriz": {
     "codigo": "Ingressantes a partir de 2022/1"
    },
    "horas": {
     "valor": null,
     "unidade": null,
     "situacao": "nao_verificado",
     "fonte": ""
    },
    "pdf": [
     "Univille/Univille - PPC-Odontologia-para-ingressantes-a-partir-de-2022-1.pdf"
    ],
    "a_confirmar": [
     "A carga de AC deste PPC não foi verificada na pesquisa."
    ]
   }
  ]
 },
 {
  "id": "udesc_cct",
  "nome": "UDESC CCT (Centro de Ciências Tecnológicas)",
  "sigla": "UDESC",
  "tipo": "universidade",
  "campus": "Joinville",
  "pasta_documentos": "UDESC CCT",
  "requisito_nome": "Atividades Complementares (AC / ACC)",
  "resumo": "Duas resoluções gerais vigentes ao mesmo tempo: a 008/2026-CEG para matrizes antigas e a 001/2022-CEG para matrizes reformadas. A carga de AC fica entre 2% e 6% da carga do curso e é pontuada em créditos (Anexo I).",
  "normas": [
   {
    "id": "008-2026-ceg",
    "numero": "Res. 008/2026-CEG",
    "data": "2026-04-14",
    "status": "vigente",
    "aplica_se": "Matrizes anteriores à reforma (segundo o DCC/CCT, grades anteriores a 2024/1)",
    "nota": "Revoga a Res. 026/2012-CONSEPE. Estágio não obrigatório: 30 h = 1 crédito, até 10. Monitoria: 5 créditos por semestre, máximo 10. Idiomas: 30 h = 1 crédito, máximo 6. Iniciação científica: 5 créditos por semestre, até 10. Permite validar o total de ACC já realizadas em transferência, reingresso ou retorno de diplomado (art. 4º).",
    "url": "https://secon.udesc.br/consuni/camaras/ceg/resol/2026/008-2026-ceg.pdf",
    "pdf": "UDESC CCT/UDESC_Resolucao_008-2026-CEG_Atividades_Complementares.pdf"
   },
   {
    "id": "001-2022-ceg",
    "numero": "Res. 001/2022-CEG (com a redação da Res. 3/2022-CEG)",
    "data": "2022-04-05",
    "status": "vigente",
    "aplica_se": "Matrizes reformadas (segundo o DCC/CCT, grades implantadas a partir de 2024/1)",
    "nota": "Estágio não obrigatório: 36 h = 1 crédito, até 8. Monitoria: 2 ou 4 créditos por semestre, máximo 4. Idiomas: 18 h = 1 crédito, máximo 6. Iniciação científica: 5 créditos por semestre, até 10. Prevê participação em ligas acadêmicas (ADM 05).",
    "url": "https://udesc.br/arquivos/cav/id_cpmenu/719/001_2022_ceg_17174337849866_719.pdf",
    "pdf": "UDESC CCT/UDESC_Resolucao_001-2022-CEG_Atividades_Complementares.pdf"
   },
   {
    "id": "026-2012-consepe",
    "numero": "Res. 026/2012-CONSEPE",
    "data": "2012",
    "status": "revogada",
    "nota": "Revogada em 14/04/2026 pela Res. 008/2026-CEG. As páginas da Eng. Mecânica e da Eng. Civil (matriz antiga) ainda mandam usar esta norma. AC de 8% a 10% da carga.",
    "url": "",
    "pdf": "UDESC CCT/UDESC_Resolucao_026-2012-CONSEPE_Atividades_Complementares_REVOGADA.pdf"
   },
   {
    "id": "006-2025-ceg",
    "numero": "Res. 006/2025-CEG (inserção da extensão)",
    "data": "2025",
    "status": "vigente",
    "nota": "Exige no mínimo 10% da carga em extensão. Substitui a Res. 007/2022-CEG.",
    "url": "https://secon.udesc.br/consuni/camaras/ceg/resol/2025/006-2025-ceg.pdf",
    "pdf": "UDESC CCT/UDESC_Resolucao_006-2025-CEG_Insercao_Extensao.pdf"
   },
   {
    "id": "003-2026-concecct",
    "numero": "Res. 003/2026-CONCECCT (extensão no CCT)",
    "data": "2026-06",
    "status": "vigente",
    "nota": "Repete a vedação de contagem simultânea para bolsistas e voluntários.",
    "url": "https://sistemas.joinville.udesc.br/sacc/download/index/09a0a2891031c803b472f00922774294",
    "pdf": "UDESC CCT/CCT_Resolucao_003-2026-CONCECCT_Insercao_Curricular_Extensao.pdf"
   }
  ],
  "regras_gerais": [
   {
    "texto": "AC entre 2% e 6% da carga do curso (as duas resoluções).",
    "fonte": "Res. 008/2026-CEG e 001/2022-CEG"
   },
   {
    "texto": "Cinco tipos de atividade, pontuados em créditos no Anexo I: ensino (ENS), extensão (EXT), pesquisa (PES), administração universitária (ADM) e mistas (ACM).",
    "fonte": "Res. 008/2026-CEG e 001/2022-CEG"
   },
   {
    "texto": "Comprovante em PDF ou JPEG com autenticação digital ou carimbo e assinatura do emitente. Estágio não obrigatório precisa de registro na Coordenação de Estágios do CCT.",
    "fonte": "Páginas DEM/CCT e DEC/CCT"
   }
  ],
  "como_enviar": {
   "sistema": "SIGA > Requerimentos, um requerimento por atividade, informando o código da tabela (Anexo I)",
   "prazo": "Resoluções: abre 10 dias após o início do período e fecha 20 dias antes do fim; parecer até 10 dias após o término do semestre. Páginas dos departamentos falam em no mínimo 30 dias antes.",
   "quem_aprova": "A confirmar (as notas não nomeiam o órgão que dá o parecer)",
   "taxa": "Não informada",
   "fonte": "Páginas DEM/CCT e DEC/CCT; Res. 008/2026-CEG e 001/2022-CEG"
  },
  "extensao": {
   "mesma_hora_conta_nas_duas": "nao",
   "regra": "A Res. 001/2022 obriga a escolher: cada atividade é validada ou como atividade complementar ou como creditação da extensão. A Res. 003/2026-CONCECCT veda a contagem simultânea para bolsistas e voluntários. A extensão é componente à parte (mínimo 10% da carga, Res. 006/2025-CEG).",
   "fonte": "Res. 001/2022-CEG; Res. 003/2026-CONCECCT; Res. 006/2025-CEG"
  },
  "sistemas_academicos": "SIGA (requerimentos).",
  "alertas": [
   {
    "nivel": "alto",
    "texto": "Duas resoluções gerais de AC vigentes ao mesmo tempo (008/2026-CEG e 001/2022-CEG). Nenhum texto oficial explica por que, nem como o teto de 2% a 6% da 008/2026 convive com matrizes antigas de 15 a 24 créditos de AC. Confirme com a Secretaria de Ensino de Graduação qual vale para a sua matriz."
   },
   {
    "nivel": "alto",
    "texto": "As páginas da Eng. Mecânica e da Eng. Civil (matriz antiga) ainda mandam usar a Res. 026/2012, revogada em 14/04/2026."
   },
   {
    "nivel": "medio",
    "texto": "O corte de 2024/1 citado pelo DCC não vale para todos os cursos: Produção mudou em 2024/2, Química em 2025/2 e Mecânica, Física e Matemática em 2026/1. A resolução de cada curso abaixo é inferida da matriz, exceto Ciência da Computação e TADS (explicitado pelas páginas dos departamentos)."
   },
   {
    "nivel": "medio",
    "texto": "Prazo de envio diverge: 20 dias antes do fim do semestre nas resoluções, 30 dias nas páginas dos departamentos."
   },
   {
    "nivel": "info",
    "texto": "Produção, Elétrica, Física, Matemática e Química não têm página própria de AC."
   }
  ],
  "categorias_parciais": [
   {
    "nome": "Estágio não obrigatório",
    "regra": "008/2026: 30 h = 1 crédito, até 10 créditos. 001/2022: 36 h = 1 crédito, até 8 créditos."
   },
   {
    "nome": "Monitoria",
    "regra": "008/2026: 5 créditos por semestre, máximo 10. 001/2022: 2 ou 4 créditos por semestre, máximo 4."
   },
   {
    "nome": "Idiomas",
    "regra": "008/2026: 30 h = 1 crédito, máximo 6. 001/2022: 18 h = 1 crédito, máximo 6."
   },
   {
    "nome": "Iniciação científica",
    "regra": "Ambas: 5 créditos por semestre, até 10."
   },
   {
    "nome": "Ligas acadêmicas (ADM 05)",
    "regra": "Só na 001/2022."
   }
  ],
  "cursos": [
   {
    "id": "CIVIL-N",
    "nome": "Engenharia Civil",
    "matriz": {
     "codigo": "a partir de 2024/1",
     "ingresso_de": "2024/1"
    },
    "norma_aplicavel": "001-2022-ceg",
    "norma_base": "inferido_da_matriz",
    "horas": {
     "valor": 108,
     "unidade": "h/a",
     "creditos": 6,
     "situacao": "verificado",
     "fonte": "Matriz_Eng_Civil_a_partir_2024-1.pdf (portal joinville.udesc.br)"
    },
    "pdf": [
     "UDESC CCT/Matrizes curriculares/Matriz_Eng_Civil_a_partir_2024-1.pdf",
     "UDESC CCT/CCT_DEC_Civil_copia_Res_001-2022-CEG_consolidada_atividades_complementares_NOVA.pdf"
    ]
   },
   {
    "id": "CIVIL-A",
    "nome": "Engenharia Civil",
    "matriz": {
     "codigo": "até 2023/2",
     "ingresso_ate": "2023/2"
    },
    "norma_aplicavel": "008-2026-ceg",
    "norma_base": "inferido_da_matriz",
    "horas": {
     "valor": 396,
     "unidade": "h/a",
     "creditos": 22,
     "situacao": "verificado",
     "fonte": "Matriz_Eng_Civil_ate_2023-2.pdf"
    },
    "alertas": [
     {
      "nivel": "alto",
      "texto": "A página do departamento ainda cita a Res. 026/2012, revogada."
     }
    ],
    "pdf": [
     "UDESC CCT/Matrizes curriculares/Matriz_Eng_Civil_ate_2023-2.pdf",
     "UDESC CCT/CCT_DEC_Eng_Civil_pagina_Atividade_Complementar.pdf"
    ]
   },
   {
    "id": "PROD-N",
    "nome": "Engenharia de Produção",
    "matriz": {
     "codigo": "a partir de 2024/2",
     "ingresso_de": "2024/2"
    },
    "norma_aplicavel": "001-2022-ceg",
    "norma_base": "inferido_da_matriz",
    "horas": {
     "valor": 144,
     "unidade": "h/a",
     "creditos": 8,
     "situacao": "verificado",
     "fonte": "Matriz_Eng_Producao_a_partir_2024-2.pdf (https://www.joinville.udesc.br/portal/ensino/graduacao/eng_producao/disciplinas_2024_2.php)"
    },
    "pdf": [
     "UDESC CCT/Matrizes curriculares/Matriz_Eng_Producao_a_partir_2024-2.pdf"
    ]
   },
   {
    "id": "PROD-A",
    "nome": "Engenharia de Produção",
    "matriz": {
     "codigo": "até 2024/1",
     "ingresso_ate": "2024/1"
    },
    "norma_aplicavel": "008-2026-ceg",
    "norma_base": "inferido_da_matriz",
    "horas": {
     "valor": 432,
     "unidade": "h/a",
     "creditos": 24,
     "situacao": "verificado",
     "fonte": "Matriz_Eng_Producao_ate_2024-1.pdf"
    },
    "pdf": [
     "UDESC CCT/Matrizes curriculares/Matriz_Eng_Producao_ate_2024-1.pdf"
    ]
   },
   {
    "id": "ELET-N",
    "nome": "Engenharia Elétrica",
    "matriz": {
     "codigo": "a partir de 2025/1",
     "ingresso_de": "2025/1"
    },
    "norma_aplicavel": "001-2022-ceg",
    "norma_base": "inferido_da_matriz",
    "horas": {
     "valor": 108,
     "unidade": "h/a",
     "creditos": 6,
     "situacao": "verificado",
     "fonte": "Matriz_Eng_Eletrica_a_partir_2025-1.pdf"
    },
    "pdf": [
     "UDESC CCT/Matrizes curriculares/Matriz_Eng_Eletrica_a_partir_2025-1.pdf"
    ]
   },
   {
    "id": "ELET-A",
    "nome": "Engenharia Elétrica",
    "matriz": {
     "codigo": "até 2024/2",
     "ingresso_ate": "2024/2"
    },
    "norma_aplicavel": "008-2026-ceg",
    "norma_base": "inferido_da_matriz",
    "horas": {
     "valor": 414,
     "unidade": "h/a",
     "creditos": 23,
     "situacao": "verificado",
     "fonte": "Matriz_Eng_Eletrica_ate_2024-2.pdf"
    },
    "pdf": [
     "UDESC CCT/Matrizes curriculares/Matriz_Eng_Eletrica_ate_2024-2.pdf"
    ]
   },
   {
    "id": "MEC-N",
    "nome": "Engenharia Mecânica",
    "matriz": {
     "codigo": "a partir de 2026/1",
     "ingresso_de": "2026/1"
    },
    "norma_aplicavel": "001-2022-ceg",
    "norma_base": "inferido_da_matriz",
    "horas": {
     "valor": 108,
     "unidade": "h/a",
     "creditos": 6,
     "situacao": "verificado",
     "fonte": "Matriz_Eng_Mecanica_a_partir_2026-1.pdf"
    },
    "pdf": [
     "UDESC CCT/Matrizes curriculares/Matriz_Eng_Mecanica_a_partir_2026-1.pdf"
    ]
   },
   {
    "id": "MEC-A",
    "nome": "Engenharia Mecânica",
    "matriz": {
     "codigo": "até 2025/2",
     "ingresso_ate": "2025/2"
    },
    "norma_aplicavel": "008-2026-ceg",
    "norma_base": "inferido_da_matriz",
    "horas": {
     "valor": 360,
     "unidade": "h/a",
     "creditos": 20,
     "situacao": "verificado",
     "fonte": "Matriz_Eng_Mecanica_ate_2025-2.pdf"
    },
    "alertas": [
     {
      "nivel": "alto",
      "texto": "A página do departamento ainda cita a Res. 026/2012, revogada."
     }
    ],
    "pdf": [
     "UDESC CCT/Matrizes curriculares/Matriz_Eng_Mecanica_ate_2025-2.pdf",
     "UDESC CCT/CCT_DEM_Eng_Mecanica_pagina_Atividades_Complementares.pdf"
    ]
   },
   {
    "id": "CC-N",
    "nome": "Ciência da Computação",
    "matriz": {
     "codigo": "a partir de 2025/1",
     "ingresso_de": "2025/1"
    },
    "norma_aplicavel": "001-2022-ceg",
    "norma_base": "pagina_departamento",
    "horas": {
     "valor": 108,
     "unidade": "h/a",
     "creditos": 6,
     "situacao": "verificado",
     "fonte": "Matriz_Ciencia_Computacao_a_partir_2025-1.pdf"
    },
    "pdf": [
     "UDESC CCT/Matrizes curriculares/Matriz_Ciencia_Computacao_a_partir_2025-1.pdf",
     "UDESC CCT/CCT_DCC_Ciencia_Computacao_pagina_Atividades_Complementares.pdf"
    ]
   },
   {
    "id": "CC-A",
    "nome": "Ciência da Computação",
    "matriz": {
     "codigo": "2019/2 a 2024/2",
     "ingresso_de": "2019/2",
     "ingresso_ate": "2024/2"
    },
    "norma_aplicavel": "008-2026-ceg",
    "norma_base": "pagina_departamento",
    "horas": {
     "valor": 324,
     "unidade": "h/a",
     "creditos": 18,
     "situacao": "verificado",
     "fonte": "Matriz_Ciencia_Computacao_2019-2_a_2024-2.pdf"
    },
    "a_confirmar": [
     "O DCC diz que a 001/2022 vale para grades implantadas a partir de 2024/1, mas a matriz de Ciência da Computação só mudou em 2025/1. Confirmar a norma de quem ingressou em 2024/1 e 2024/2."
    ],
    "pdf": [
     "UDESC CCT/Matrizes curriculares/Matriz_Ciencia_Computacao_2019-2_a_2024-2.pdf",
     "UDESC CCT/CCT_DCC_Ciencia_Computacao_pagina_Atividades_Complementares.pdf"
    ]
   },
   {
    "id": "TADS-N",
    "nome": "Tecnologia em Análise e Desenvolvimento de Sistemas (TADS)",
    "matriz": {
     "codigo": "a partir de 2025/1",
     "ingresso_de": "2025/1"
    },
    "norma_aplicavel": "001-2022-ceg",
    "norma_base": "pagina_departamento",
    "horas": {
     "valor": 54,
     "unidade": "h/a",
     "creditos": 3,
     "situacao": "verificado",
     "fonte": "Matriz_TADS_a_partir_2025-1.pdf"
    },
    "pdf": [
     "UDESC CCT/Matrizes curriculares/Matriz_TADS_a_partir_2025-1.pdf",
     "UDESC CCT/CCT_DCC_TADS_pagina_Atividades_Complementares.pdf"
    ]
   },
   {
    "id": "TADS-A",
    "nome": "Tecnologia em Análise e Desenvolvimento de Sistemas (TADS)",
    "matriz": {
     "codigo": "até 2024/2",
     "ingresso_ate": "2024/2"
    },
    "norma_aplicavel": "008-2026-ceg",
    "norma_base": "pagina_departamento",
    "horas": {
     "valor": 180,
     "unidade": "h/a",
     "creditos": 10,
     "situacao": "verificado",
     "fonte": "Matriz_TADS_ate_2024-2.pdf"
    },
    "a_confirmar": [
     "Mesma dúvida do corte 2024/1 do DCC."
    ],
    "pdf": [
     "UDESC CCT/Matrizes curriculares/Matriz_TADS_ate_2024-2.pdf",
     "UDESC CCT/CCT_DCC_TADS_pagina_Atividades_Complementares.pdf"
    ]
   },
   {
    "id": "FIS-N",
    "nome": "Licenciatura em Física",
    "matriz": {
     "codigo": "a partir de 2026/1",
     "ingresso_de": "2026/1"
    },
    "norma_aplicavel": "001-2022-ceg",
    "norma_base": "inferido_da_matriz",
    "horas": {
     "valor": 90,
     "unidade": "h/a",
     "creditos": 5,
     "situacao": "verificado",
     "fonte": "Matriz_Lic_Fisica_a_partir_2026-1.pdf"
    },
    "pdf": [
     "UDESC CCT/Matrizes curriculares/Matriz_Lic_Fisica_a_partir_2026-1.pdf"
    ]
   },
   {
    "id": "FIS-A",
    "nome": "Licenciatura em Física",
    "matriz": {
     "codigo": "até 2025/2",
     "ingresso_ate": "2025/2"
    },
    "norma_aplicavel": "008-2026-ceg",
    "norma_base": "inferido_da_matriz",
    "horas": {
     "valor": 270,
     "unidade": "h/a",
     "creditos": 15,
     "situacao": "verificado",
     "fonte": "Matriz_Lic_Fisica_ate_2025-2.pdf"
    },
    "pdf": [
     "UDESC CCT/Matrizes curriculares/Matriz_Lic_Fisica_ate_2025-2.pdf"
    ]
   },
   {
    "id": "MAT-N",
    "nome": "Licenciatura em Matemática",
    "matriz": {
     "codigo": "a partir de 2026/1",
     "ingresso_de": "2026/1"
    },
    "norma_aplicavel": "001-2022-ceg",
    "norma_base": "inferido_da_matriz",
    "horas": {
     "valor": 90,
     "unidade": "h/a",
     "creditos": 5,
     "situacao": "verificado",
     "fonte": "Matriz_Lic_Matematica_a_partir_2026-1.pdf"
    },
    "pdf": [
     "UDESC CCT/Matrizes curriculares/Matriz_Lic_Matematica_a_partir_2026-1.pdf"
    ]
   },
   {
    "id": "MAT-A",
    "nome": "Licenciatura em Matemática",
    "matriz": {
     "codigo": "até 2025/2",
     "ingresso_ate": "2025/2"
    },
    "norma_aplicavel": "008-2026-ceg",
    "norma_base": "inferido_da_matriz",
    "horas": {
     "valor": 270,
     "unidade": "h/a",
     "creditos": 15,
     "situacao": "verificado",
     "fonte": "Matriz_Lic_Matematica_ate_2025-2.pdf"
    },
    "pdf": [
     "UDESC CCT/Matrizes curriculares/Matriz_Lic_Matematica_ate_2025-2.pdf"
    ]
   },
   {
    "id": "QUI-N",
    "nome": "Licenciatura em Química",
    "matriz": {
     "codigo": "a partir de 2025/2",
     "ingresso_de": "2025/2"
    },
    "norma_aplicavel": "001-2022-ceg",
    "norma_base": "inferido_da_matriz",
    "horas": {
     "valor": 90,
     "unidade": "h/a",
     "creditos": 5,
     "situacao": "verificado",
     "fonte": "Matriz_Lic_Quimica_a_partir_2025-2.pdf"
    },
    "pdf": [
     "UDESC CCT/Matrizes curriculares/Matriz_Lic_Quimica_a_partir_2025-2.pdf"
    ]
   },
   {
    "id": "QUI-A",
    "nome": "Licenciatura em Química",
    "matriz": {
     "codigo": "até 2025/1",
     "ingresso_ate": "2025/1"
    },
    "norma_aplicavel": "008-2026-ceg",
    "norma_base": "inferido_da_matriz",
    "horas": {
     "valor": 270,
     "unidade": "h/a",
     "creditos": 15,
     "situacao": "verificado",
     "fonte": "Matriz_Lic_Quimica_ate_2025-1.pdf"
    },
    "pdf": [
     "UDESC CCT/Matrizes curriculares/Matriz_Lic_Quimica_ate_2025-1.pdf"
    ]
   }
  ]
 },
 {
  "id": "ufsc_joinville",
  "nome": "UFSC Joinville (Centro Tecnológico de Joinville, CTJ)",
  "sigla": "UFSC",
  "tipo": "universidade",
  "campus": "Joinville",
  "pasta_documentos": "UFSC Joinville",
  "requisito_nome": "Atividades Complementares (Engenharia Naval: Atividades Acadêmicas Complementares, AAC)",
  "resumo": "A UFSC não tem tabela geral. A RN 227/2026/CUn entregou a regra aos colegiados: a carga e os limites vêm do PPC ou do regulamento de cada curso e de cada grade.",
  "normas": [
   {
    "id": "rn-227-2026-cun",
    "numero": "Resolução Normativa 227/2026/CUn",
    "data": "2026-06-16",
    "status": "vigente",
    "nota": "Novo Regulamento dos Cursos de Graduação. Define a AC como componente regulamentado pelo curso (PPC ou documento próprio). Revogou a Res. 17/CUn/97. Horas acima do limite do PPC aparecem no histórico mas não contam. AC e extensão curricularizada devem ser integralmente cursadas na UFSC (art. 132). Membro do NDE ganha 1 hora semanal de AC.",
    "url": "https://coordlinguasestrangeiras.ufsc.br/files/2026/07/RESOLU%C3%87%C3%83O-NORMATIVA-227-2026-CUn.pdf",
    "pdf": "UFSC Joinville/UFSC_Resolucao_Normativa_227-2026-CUn_Regulamento_Cursos_Graduacao.pdf"
   },
   {
    "id": "rn-01-2020-cgrad-cex",
    "numero": "RN 01/2020/CGRAD/CEx (curricularização da extensão)",
    "data": "2020",
    "status": "vigente",
    "nota": "Extensão no mínimo 10% da carga total; a carga total inclui as atividades complementares.",
    "url": "https://curricularizacaodaextensao.ufsc.br/files/2020/03/RESOLU%C3%87%C3%83O-CURRICULARIZA%C3%87%C3%83O-DA-EXTENS%C3%83O-2-1.pdf",
    "pdf": "UFSC Joinville/UFSC_Resolucao_Normativa_01-2020-CGRAD-CEx_Curricularizacao_Extensao.pdf"
   }
  ],
  "regras_gerais": [
   {
    "texto": "Horas acima do limite do PPC aparecem no histórico, mas não contam.",
    "fonte": "RN 227/2026/CUn"
   },
   {
    "texto": "AC e extensão curricularizada devem ser integralmente cursadas na UFSC; ficam fora da validação de estudos externos.",
    "fonte": "RN 227/2026/CUn, art. 132"
   },
   {
    "texto": "O fluxo do CTJ é de uma vez só: ao completar as horas, o aluno envia à Secretaria Acadêmica o formulário de validação assinado no AssinaUFSC, a planilha do curso assinada e todos os comprovantes, por e-mail.",
    "fonte": "Secretaria Acadêmica CTJ"
   },
   {
    "texto": "Mecatrônica: não serão aceitos certificados paulatinamente.",
    "fonte": "Página da Mecatrônica"
   }
  ],
  "como_enviar": {
   "sistema": "E-mail à Secretaria Acadêmica do CTJ com formulário assinado no AssinaUFSC, planilha e comprovantes. BCT (CienTec): chamado no Portal de Atendimentos (PAI).",
   "prazo": "Sem prazo geral. Ferroviária: até a 8ª fase e 30 dias antes do término do semestre letivo. Naval: preferencialmente com antecedência mínima de um semestre.",
   "quem_aprova": "Secretaria Acadêmica do CTJ com a coordenação do curso (a pesquisa não detalha o órgão que decide)",
   "taxa": "Não informada",
   "fonte": "https://secretariaacademica.joinville.ufsc.br/atividades-complementares/"
  },
  "extensao": {
   "mesma_hora_conta_nas_duas": "a_confirmar",
   "regra": "A extensão curricularizada ocupa no mínimo 10% da carga total, que inclui as AC (RN 01/2020). A Engenharia Naval (PPC 2025-1) é explícita: só contam como AAC as atividades que não tenham sido computadas para atividades de extensão. Para os demais cursos a pesquisa não localizou regra equivalente.",
   "fonte": "RN 01/2020/CGRAD/CEx; Regimento AAC da Naval"
  },
  "sistemas_academicos": "AssinaUFSC (assinatura), PAI (chamados do BCT), e-mail da Secretaria Acadêmica.",
  "alertas": [
   {
    "nivel": "medio",
    "texto": "A cópia da RN 227/2026 foi baixada de um site de coordenação da UFSC, não do Boletim Oficial. Conferir no Boletim Oficial."
   },
   {
    "nivel": "medio",
    "texto": "Aeroespacial, Mecatrônica, Infraestrutura e Transportes e Logística só publicam regras das grades de 2016; a carga de AC dos PPCs 2025 desses cursos não foi localizada."
   },
   {
    "nivel": "medio",
    "texto": "Transportes e Logística diz '240 ou 288 h/a' sem explicar quando vale cada número."
   },
   {
    "nivel": "medio",
    "texto": "O regimento da Naval traz duas datas: o nome do arquivo diz Ata 156 de 2024-04-24 e o texto diz 'Aprovado em 24/abr./2026'."
   },
   {
    "nivel": "medio",
    "texto": "O documento que o BCT chama de 'Grade 2025' é uma resolução de setembro de 2021 (Res. 02/CIENTEC/2021)."
   },
   {
    "nivel": "info",
    "texto": "Planilhas e formulários editáveis (.xlsx, .docx, .zip) não foram baixados: pegue a versão atual no site do curso."
   }
  ],
  "cursos": [
   {
    "id": "BCT-2016",
    "nome": "Ciência e Tecnologia (BCT / CienTec)",
    "matriz": {
     "codigo": "Grade 2016"
    },
    "horas": {
     "valor": 360,
     "unidade": "h",
     "equivalente": {
      "valor": 432,
      "unidade": "h/a"
     },
     "situacao": "verificado",
     "fonte": "http://cientec.paginas.ufsc.br/files/2016/05/Tabela.pdf"
    },
    "limites_destaque": "Estágio até 400 h/a, IC até 200 h/a, eventos até 50 h/a, idiomas até 40 h/a por língua; só atividades após o ingresso.",
    "pdf": [
     "UFSC Joinville/CienTec_Tabela_Atividades_Complementares_Grade_2016.pdf",
     "UFSC Joinville/Pagina_CienTec_Atividades_Complementares.pdf"
    ]
   },
   {
    "id": "BCT-2025",
    "nome": "Ciência e Tecnologia (BCT / CienTec)",
    "matriz": {
     "codigo": "Grade 2025"
    },
    "horas": {
     "valor": 240,
     "unidade": "h",
     "equivalente": {
      "valor": 288,
      "unidade": "h/a"
     },
     "creditos": 16,
     "situacao": "verificado",
     "fonte": "https://drive.google.com/file/d/1AbBV4bqOV2kwJ93QLQw742YgI9ZQmXa3/view?usp=sharing"
    },
    "norma_texto": "Res. 02/CIENTEC/2021",
    "limites_destaque": "Estágio até 400 h/a, IC até 200 h/a, eventos até 50 h/a, idiomas até 40 h/a por língua; só atividades após o ingresso.",
    "alertas": [
     {
      "nivel": "medio",
      "texto": "O regulamento da 'Grade 2025' é de setembro de 2021."
     }
    ],
    "pdf": [
     "UFSC Joinville/CienTec_Regulamento_Atividades_Complementares_Grade_2025.pdf",
     "UFSC Joinville/Pagina_CienTec_Atividades_Complementares.pdf"
    ]
   },
   {
    "id": "AERO-2016",
    "nome": "Engenharia Aeroespacial",
    "matriz": {
     "codigo": "Tabela v2 (2020)"
    },
    "horas": {
     "valor": 150,
     "unidade": "h",
     "equivalente": {
      "valor": 180,
      "unidade": "h/a"
     },
     "situacao": "verificado",
     "fonte": "http://aeroespacialjoi.paginas.ufsc.br/files/2020/11/Tabela-de-Horas-Complementares-Tabela-de-Horas_v2.pdf"
    },
    "limites_destaque": "Sete grupos; atividades profissionais a 0,2 h/a por hora, até 90 h/a; esportivas e culturais até 50 h/a.",
    "a_confirmar": [
     "Carga de AC do PPC 2025 não localizada."
    ],
    "pdf": [
     "UFSC Joinville/Aeroespacial_Tabela_Horas_Complementares_v2_2020.pdf",
     "UFSC Joinville/Pagina_Aeroespacial_Atividades_Complementares.pdf"
    ]
   },
   {
    "id": "AUTO-2016",
    "nome": "Engenharia Automotiva",
    "matriz": {
     "codigo": "PPC 2016"
    },
    "horas": {
     "valor": 180,
     "unidade": "h",
     "equivalente": {
      "valor": 216,
      "unidade": "h/a"
     },
     "creditos": 12,
     "situacao": "verificado",
     "fonte": "https://automotiva.joinville.ufsc.br/atividades-complementares/"
    },
    "limites_destaque": "Formulário v2.4 (11/2020) para o PPC 2016.",
    "pdf": [
     "UFSC Joinville/Pagina_Automotiva_Atividades_Complementares.pdf"
    ]
   },
   {
    "id": "AUTO-2025",
    "nome": "Engenharia Automotiva",
    "matriz": {
     "codigo": "PPC 2025"
    },
    "horas": {
     "valor": 90,
     "unidade": "h",
     "equivalente": {
      "valor": 108,
      "unidade": "h/a"
     },
     "creditos": 6,
     "situacao": "verificado",
     "fonte": "https://automotiva.joinville.ufsc.br/atividades-complementares/"
    },
    "pdf": [
     "UFSC Joinville/Pagina_Automotiva_Atividades_Complementares.pdf"
    ]
   },
   {
    "id": "EFM-2016",
    "nome": "Engenharia Ferroviária e Metroviária",
    "matriz": {
     "codigo": "PPC 2016/1"
    },
    "horas": {
     "valor": 150,
     "unidade": "h",
     "equivalente": {
      "valor": 180,
      "unidade": "h/a"
     },
     "situacao": "verificado",
     "fonte": "http://ferroviaria.paginas.ufsc.br/files/2025/05/Atividades-Complementares-EFM-Regulamento-versão-2.pdf"
    },
    "limites_destaque": "Regulamento Rev. 01 (maio/2025): seis grupos; Pesquisa 140 h/a e Acadêmicas 160 h/a (PPC 2016).",
    "pdf": [
     "UFSC Joinville/EFM_Ferroviaria_Metroviaria_Regulamento_Atividades_Complementares_v2_2025.pdf",
     "UFSC Joinville/Ferroviaria_PPC_2016-1.pdf",
     "UFSC Joinville/Pagina_Ferroviaria_Atividades_Complementares.pdf"
    ]
   },
   {
    "id": "EFM-2025",
    "nome": "Engenharia Ferroviária e Metroviária",
    "matriz": {
     "codigo": "PPC 2025/1"
    },
    "horas": {
     "valor": 105,
     "unidade": "h",
     "equivalente": {
      "valor": 126,
      "unidade": "h/a"
     },
     "situacao": "verificado",
     "fonte": "http://ferroviaria.paginas.ufsc.br/files/2025/05/Atividades-Complementares-EFM-Regulamento-versão-2.pdf"
    },
    "limites_destaque": "Regulamento Rev. 01 (maio/2025): Pesquisa 90 h/a e Acadêmicas 100 h/a (PPC 2025). Envio até a 8ª fase e 30 dias antes do término do semestre letivo.",
    "pdf": [
     "UFSC Joinville/EFM_Ferroviaria_Metroviaria_Regulamento_Atividades_Complementares_v2_2025.pdf",
     "UFSC Joinville/Pagina_Ferroviaria_Atividades_Complementares.pdf"
    ]
   },
   {
    "id": "MECATR-2016",
    "nome": "Engenharia Mecatrônica",
    "matriz": {
     "codigo": "Grade 2016/1"
    },
    "horas": {
     "valor": 324,
     "unidade": "h/a",
     "creditos": 18,
     "situacao": "verificado",
     "fonte": "http://mecatronica.paginas.ufsc.br/files/2019/08/matriz-complementares.pdf"
    },
    "limites_destaque": "Cinco grupos com máximo de 200 h/a cada; estágio até 40 h/a por mês. Não aceita certificados paulatinamente.",
    "a_confirmar": [
     "Carga de AC do PPC 2025 não localizada."
    ],
    "pdf": [
     "UFSC Joinville/Mecatronica_Tabela_Atividades_Complementares_2019.pdf",
     "UFSC Joinville/Pagina_Mecatronica_Atividades_Complementares.pdf"
    ]
   },
   {
    "id": "NAVAL-2016",
    "nome": "Engenharia Naval (AAC)",
    "matriz": {
     "codigo": "Grade 2016-1"
    },
    "horas": {
     "valor": 240,
     "unidade": "pontos",
     "equivalente": {
      "valor": 288,
      "unidade": "h/a"
     },
     "creditos": 16,
     "situacao": "verificado",
     "fonte": "https://naval.ufsc.br/atividades-complementares/"
    },
    "limites_destaque": "Regimento de AAC (Ata 156): Profissionais até 180 pontos, Acadêmicas até 240, Idiomas até 60; até o limite máximo de 8 horas por dia.",
    "pdf": [
     "UFSC Joinville/Naval_Regimento_AAC_PPC2016-1_e_2025-1_Ata156_2024-04-24.pdf",
     "UFSC Joinville/Naval_Regimento_AAC_Apendice_A_Formulario_Validacao_2024.pdf",
     "UFSC Joinville/Pagina_Naval_Atividades_Complementares.pdf"
    ]
   },
   {
    "id": "NAVAL-2025",
    "nome": "Engenharia Naval (AAC)",
    "matriz": {
     "codigo": "Grade 2025-1"
    },
    "horas": {
     "valor": 150,
     "unidade": "pontos",
     "equivalente": {
      "valor": 180,
      "unidade": "h/a"
     },
     "creditos": 10,
     "situacao": "verificado",
     "fonte": "https://naval.ufsc.br/atividades-complementares/"
    },
    "limites_destaque": "Mesmo regimento de AAC (Ata 156). Envio preferencialmente com antecedência mínima de um semestre.",
    "extensao": {
     "mesma_hora_conta_nas_duas": "nao",
     "regra": "No PPC 2025-1, só contam como AAC as atividades que não tenham sido computadas para Atividades de Extensão (EXTs).",
     "fonte": "Regimento AAC da Naval"
    },
    "alertas": [
     {
      "nivel": "medio",
      "texto": "Data do regimento diverge: 2024 no nome do arquivo, 2026 no texto."
     }
    ],
    "pdf": [
     "UFSC Joinville/Naval_Regimento_AAC_PPC2016-1_e_2025-1_Ata156_2024-04-24.pdf",
     "UFSC Joinville/Naval_Regimento_AAC_Apendice_A_Formulario_Validacao_2024.pdf",
     "UFSC Joinville/Pagina_Naval_Atividades_Complementares.pdf"
    ]
   },
   {
    "id": "INFRA-2016",
    "nome": "Engenharia Civil de Infraestrutura",
    "matriz": {
     "codigo": "PPC 2016 (rev. mar/2020)"
    },
    "horas": {
     "valor": 150,
     "unidade": "h",
     "equivalente": {
      "valor": 180,
      "unidade": "h/a"
     },
     "creditos": 10,
     "situacao": "verificado",
     "fonte": "https://infraestrutura.joinville.ufsc.br/atividades-complementares/"
    },
    "limites_destaque": "5% da carga. Estágio a 1 h por 8 h, até 90 h; PET até 80 h; IC até 30 h.",
    "a_confirmar": [
     "Carga de AC do PPC 2025 não localizada."
    ],
    "pdf": [
     "UFSC Joinville/Infraestrutura_PPC_Eng_Civil_Infra_2016_rev_mar2020.pdf",
     "UFSC Joinville/Pagina_Infraestrutura_Atividades_Complementares.pdf"
    ]
   },
   {
    "id": "TL-2016",
    "nome": "Engenharia de Transportes e Logística",
    "matriz": {
     "codigo": "Grade 2016.1"
    },
    "horas": {
     "valor": null,
     "unidade": "h/a",
     "situacao": "a_confirmar",
     "fonte": "https://transporteslogistica.joinville.ufsc.br/atividades-complementares-grade-20161/"
    },
    "a_confirmar": [
     "A página diz '240 ou 288 h/a' sem explicar quando vale cada número.",
     "Carga de AC do PPC 2025 não localizada."
    ],
    "limites_destaque": "Três grupos (Pesquisa, Ensino, Extensão), máximo de 200 h/a cada.",
    "pdf": [
     "UFSC Joinville/Pagina_Transportes_Logistica_AC_grade_2016-1.pdf"
    ]
   }
  ]
 },
 {
  "id": "ifsc_joinville",
  "nome": "IFSC Joinville (Instituto Federal de Santa Catarina)",
  "sigla": "IFSC",
  "tipo": "instituto_federal",
  "campus": "Joinville",
  "pasta_documentos": "IFSC Joinville",
  "requisito_nome": "Atividades Complementares",
  "resumo": "A Res. CEPE 32/2019 define as categorias, mas não fixa horas: a carga vem do PPC e cada colegiado pode ter regulamento próprio. As cargas encontradas são antigas e a maioria está a confirmar.",
  "normas": [
   {
    "id": "cepe-32-2019",
    "numero": "Res. CEPE 32/2019",
    "data": "2019-05-23",
    "status": "vigente",
    "nota": "Regulamento das Atividades Complementares nos Cursos Superiores. Define 15 categorias, exclui atividades profissionais remuneradas e só aceita atividades posteriores ao ingresso. Dois anos para os cursos adequarem os PPCs. Para cursos sem obrigatoriedade pelo CNE, apenas recomenda incluir AC.",
    "url": "http://cs.ifsc.edu.br/portal/files/RESn32-CEPE-ATIV-COMPLEMENTARES-IFSC.pdf",
    "pdf": "IFSC Joinville/IFSC_Resolucao_CEPE_32-2019_Regulamento_AtivComplementares_Cursos_Superiores.pdf"
   },
   {
    "id": "rdp-2018",
    "numero": "RDP (Res. CONSUP 20/2018)",
    "data": "2018",
    "status": "vigente",
    "nota": "Trata as AC como componente 'quando houver'. Revisão anunciada.",
    "url": "https://ifsc.edu.br/documents/35989/1686355/RDP+2018/4b801ee9-8356-45c5-be50-6366d9f4e2c3",
    "pdf": "IFSC Joinville/IFSC_RDP_2018.pdf"
   },
   {
    "id": "consup-40-2016",
    "numero": "Res. CONSUP 40/2016 (curricularização da extensão)",
    "data": "2016",
    "status": "vigente",
    "nota": "Exige no mínimo 10% de extensão e não valida extensão que já faça parte de outro componente. Anterior a 2020.",
    "url": "http://cs.ifsc.edu.br/portal/files/consup_resolucao40_2016_curriculariza%C3%A7ao_extens%C3%A3o.pdf",
    "pdf": "IFSC Joinville/IFSC_Resolucao_CONSUP_40-2016_Curricularizacao_Extensao.pdf"
   },
   {
    "id": "cepe-50-2026",
    "numero": "Res. CEPE 50/2026",
    "data": "2026-08-03",
    "status": "vigente",
    "nota": "Em vigor desde 03/08/2026. As AC não são objeto, de forma regular, de aproveitamento de estudos nem de reconhecimento de saberes, salvo previsão do PPC.",
    "url": "https://www.ifsc.edu.br/documents/d/noticias/resol_cepe_ifsc_50_2026_aprova_aproveitamento_de_estudos-pdf",
    "pdf": "IFSC Joinville/IFSC_Resolucao_CEPE_50-2026_Aproveitamento_Estudos_Extensao_Saberes.pdf"
   }
  ],
  "regras_gerais": [
   {
    "texto": "15 categorias: projetos de pesquisa ou extensão, monitoria, eventos, estágio não obrigatório, defesas, intercâmbio, feiras, cursos FIC, atividades científicas, culturais e desportivas, voluntariado, representação estudantil e acadêmica, empresa júnior ou PET, e iniciação à docência (só nas licenciaturas).",
    "fonte": "Res. CEPE 32/2019"
   },
   {
    "texto": "Excluídas as atividades profissionais remuneradas. Só contam atividades posteriores ao ingresso.",
    "fonte": "Res. CEPE 32/2019"
   }
  ],
  "como_enviar": {
   "sistema": "Requerimento de Validação na Secretaria Acadêmica, com registro no SIGAA",
   "prazo": "Eng. Mecânica: o coordenador tem 45 dias para avaliar. Prazo de entrega: a confirmar com a coordenação.",
   "quem_aprova": "Coordenação do curso (Eng. Mecânica: coordenador, em 45 dias)",
   "taxa": "Não informada",
   "fonte": "Res. CEPE 32/2019; Ata 02/2022 da Eng. Mecânica"
  },
  "extensao": {
   "mesma_hora_conta_nas_duas": "nao",
   "regra": "A Res. CONSUP 40/2016 exige no mínimo 10% de extensão e não valida extensão que já faça parte de outro componente. No PPC da Eng. Elétrica (2015), a AC é de 40 h por semestre 'inclusive extensão'.",
   "fonte": "Res. CONSUP 40/2016; PPC Eng. Elétrica 2015"
  },
  "sistemas_academicos": "SIGAA (o SIGAA público pede CAPTCHA).",
  "alertas": [
   {
    "nivel": "alto",
    "texto": "As 400 h da Engenharia Elétrica (PPC 2015) e as 48 h da Gestão Hospitalar (Res. 03/2016) são anteriores à Res. CEPE 32/2019 e devem ser tratadas como históricas até a coordenação confirmar."
   },
   {
    "nivel": "alto",
    "texto": "Nenhuma matriz vigente foi lida: o SIGAA público pede CAPTCHA e o antigo repositório do câmpus está fora do ar. Para Enfermagem e Administração não foi encontrado nenhum número."
   },
   {
    "nivel": "medio",
    "texto": "A norma institucional define categorias, mas não fixa horas. Cada colegiado pode ter regulamento próprio."
   }
  ],
  "cursos": [
   {
    "id": "EMEC",
    "nome": "Engenharia Mecânica",
    "matriz": {
     "codigo": "Regulamento de 22/04/2022 (matriz não lida)"
    },
    "norma_texto": "Regulamento aprovado na Ata 02/2022 do Colegiado (22/04/2022)",
    "horas": {
     "valor": null,
     "unidade": null,
     "situacao": "nao_publicado",
     "fonte": "https://liferay-balanceador.ifsc.edu.br/documents/35957/9989633/Ata+02/04614ed6-e674-4d4f-84ec-02c06aa23822"
    },
    "a_confirmar": [
     "O regulamento remete o total à matriz, que não pôde ser lida.",
     "Itens 1 a 8 do Anexo A só existem em imagem."
    ],
    "limites_destaque": "23 modalidades com teto por modalidade, por exemplo palestras e congressos até 1 h por evento, limitado a 10 eventos; iniciação científica até 10 h por projeto, limitado a 1 projeto; estágio não obrigatório até 10 h por semestre, limitado a 1 semestre. Cada certificado pontua em uma única modalidade. Requerimento no Anexo C. O cumprimento é condição para colar grau.",
    "pdf": [
     "IFSC Joinville/IFSC_Joinville_EngMecanica_Colegiado_Ata02_2022_com_Regulamento_AtivComplementares.pdf",
     "IFSC Joinville/IFSC_Joinville_EngMecanica_PPC_AO905.pdf"
    ]
   },
   {
    "id": "EELE",
    "nome": "Engenharia Elétrica",
    "matriz": {
     "codigo": "PPC de julho/2015 (vigência não confirmada)"
    },
    "horas": {
     "valor": 400,
     "unidade": "h",
     "situacao": "historico",
     "fonte": "http://cs.ifsc.edu.br/portal/files/JOINVILLE_ENG_ELETRICA_AO_PPC_906.pdf"
    },
    "a_confirmar": [
     "PPC antigo (2015), anterior à Res. CEPE 32/2019. 40 h por semestre, inclusive extensão. A Res. 16/2016 não pôde ser baixada."
    ],
    "alertas": [
     {
      "nivel": "alto",
      "texto": "Carga histórica: confirmar com a coordenação antes de usar."
     }
    ],
    "pdf": [
     "IFSC Joinville/IFSC_Joinville_EngEletrica_PPC_AO906.pdf"
    ]
   },
   {
    "id": "GHOSP",
    "nome": "CST em Gestão Hospitalar",
    "matriz": {
     "codigo": "Res. 03/2016 (trecho lido só no buscador)"
    },
    "horas": {
     "valor": 48,
     "unidade": "h",
     "situacao": "lido_so_no_buscador",
     "fonte": "https://sites.joinville.ifsc.edu.br/arquivos_unidade/COLEGIADO%20DO%20CAMPUS/COLEGIADO%202016/RESOLUCAO/RESOLUCAO%2003%20-%20ANEXO%20-%20Regulamento%20Atividades%20Complementares%20CSTGH.pdf"
    },
    "a_confirmar": [
     "'Carga global mínima de 48 horas' lida apenas pelo trecho do buscador; o documento não pôde ser baixado.",
     "Anterior à Res. CEPE 32/2019."
    ],
    "alertas": [
     {
      "nivel": "alto",
      "texto": "Número lido só no buscador e histórico (2016): confirmar com a coordenação."
     }
    ],
    "pdf": []
   },
   {
    "id": "ENF",
    "nome": "Enfermagem",
    "matriz": {
     "codigo": "Não localizada"
    },
    "horas": {
     "valor": null,
     "unidade": null,
     "situacao": "nao_publicado",
     "fonte": ""
    },
    "a_confirmar": [
     "Nenhum número encontrado. Currículo no SIGAA atrás de CAPTCHA."
    ],
    "pdf": []
   },
   {
    "id": "ADM",
    "nome": "Administração",
    "matriz": {
     "codigo": "Não localizada"
    },
    "horas": {
     "valor": null,
     "unidade": null,
     "situacao": "nao_publicado",
     "fonte": ""
    },
    "a_confirmar": [
     "Nenhum número encontrado."
    ],
    "pdf": []
   }
  ]
 },
 {
  "id": "catolica_sc",
  "nome": "Católica SC (Centro Universitário Católica de Santa Catarina em Joinville)",
  "sigla": "Católica",
  "tipo": "centro_universitario",
  "campus": "Joinville",
  "pasta_documentos": "Catolica SC",
  "requisito_nome": "Atividades Acadêmicas Complementares (AAC)",
  "resumo": "Cargas publicadas nas matrizes, mas os regulamentos de AAC de todos os cursos não estão publicados. As matrizes dizem que as AAC são validadas conforme \"Regulamento próprio do Curso\" e podem ser feitas a partir da 1ª fase.",
  "normas": [
   {
    "id": "reg-proprio",
    "numero": "Regulamento próprio do Curso",
    "data": "",
    "status": "nao_publicada",
    "nota": "Citado em todas as matrizes. O Regimento Geral (2011, alterado até 2021) não trata de AAC.",
    "url": "https://www.catolicasc.org.br/wp-content/uploads/2023/11/Regimento-Geral-do-Centro-Universitario-Catolica-Joinville.pdf",
    "pdf": "Catolica SC/CatolicaSC_Joinville_Regimento_Geral_2011_atualizado.pdf"
   }
  ],
  "regras_gerais": [
   {
    "texto": "AAC validadas conforme Regulamento próprio do Curso; podem ser realizadas a partir da 1ª fase.",
    "fonte": "Matriz Direito JOI"
   }
  ],
  "como_enviar": {
   "sistema": "Não publicado",
   "prazo": "Não publicado",
   "quem_aprova": "Não publicado",
   "taxa": "Não publicado",
   "fonte": "Relatório de pesquisa"
  },
  "extensao": {
   "mesma_hora_conta_nas_duas": "a_confirmar",
   "regra": "A extensão é curricularizada pelos Projetos de Aprendizagem Colaborativa Extensionista (PAC), com horas próprias na coluna Extensão (70 h por semestre no Direito). Uma resolução de 2016 da Católica de Jaraguá do Sul diz que as horas do Projeto Comunitário não são computadas como AC; não há regra equivalente publicada para Joinville.",
   "fonte": "Matriz Direito JOI; Res. 26/16 (Jaraguá do Sul)"
  },
  "sistemas_academicos": "Não identificado na pesquisa.",
  "alertas": [
   {
    "nivel": "alto",
    "texto": "Regulamentos de AAC de todos os cursos não estão publicados. Categorias, tetos e procedimento de envio são desconhecidos publicamente: peça à coordenação o regulamento do seu curso, com número e data, antes de acumular horas."
   },
   {
    "nivel": "medio",
    "texto": "Não foi possível confirmar se Administração, Contábeis, Design e as engenharias têm turma presencial em Joinville com matriz diferente da de Jaraguá do Sul."
   }
  ],
  "cursos": [
   {
    "id": "DIR",
    "nome": "Direito",
    "matriz": {
     "codigo": "Matriz 2023/1"
    },
    "horas": {
     "valor": 150,
     "unidade": "h",
     "situacao": "verificado",
     "fonte": "http://app.catolicasc.org.br/apps/integra_site/matrizes/pdf/ac328fb2c2c027caf522bb213320ca16_Pres_Bac_d28802ace04b02b853438434420d7120_Matutino.pdf",
     "carga_total_curso": 3880
    },
    "pdf": [
     "Catolica SC/CatolicaSC_Joinville_Matriz_Direito_20231.pdf"
    ],
    "norma_aplicavel": "reg-proprio",
    "a_confirmar": [
     "O regulamento de AAC do curso não está publicado: categorias, tetos e envio são desconhecidos. Pedir à coordenação, com número e data."
    ]
   },
   {
    "id": "ARQ",
    "nome": "Arquitetura e Urbanismo",
    "matriz": {
     "codigo": "Matriz 2023/1"
    },
    "horas": {
     "valor": 150,
     "unidade": "h",
     "situacao": "verificado",
     "fonte": "https://www.catolicasc.org.br/cursos/graduacao/",
     "carga_total_curso": 3640
    },
    "pdf": [
     "Catolica SC/CatolicaSC_Joinville_Matriz_Arquitetura_e_Urbanismo_20231.pdf"
    ],
    "norma_aplicavel": "reg-proprio",
    "a_confirmar": [
     "O regulamento de AAC do curso não está publicado: categorias, tetos e envio são desconhecidos. Pedir à coordenação, com número e data."
    ]
   },
   {
    "id": "NUT",
    "nome": "Nutrição",
    "matriz": {
     "codigo": "Matriz 2023/1"
    },
    "horas": {
     "valor": 95,
     "unidade": "h",
     "situacao": "verificado",
     "fonte": "https://www.catolicasc.org.br/cursos/graduacao/",
     "carga_total_curso": 3210
    },
    "pdf": [
     "Catolica SC/CatolicaSC_Joinville_Matriz_Nutricao_20231.pdf"
    ],
    "norma_aplicavel": "reg-proprio",
    "a_confirmar": [
     "O regulamento de AAC do curso não está publicado: categorias, tetos e envio são desconhecidos. Pedir à coordenação, com número e data."
    ]
   },
   {
    "id": "BIOM",
    "nome": "Biomedicina",
    "matriz": {
     "codigo": "Matriz 2023/1"
    },
    "horas": {
     "valor": 70,
     "unidade": "h",
     "situacao": "verificado",
     "fonte": "https://www.catolicasc.org.br/cursos/graduacao/",
     "carga_total_curso": 3200
    },
    "pdf": [
     "Catolica SC/CatolicaSC_Joinville_Matriz_Biomedicina_20231.pdf"
    ],
    "norma_aplicavel": "reg-proprio",
    "a_confirmar": [
     "O regulamento de AAC do curso não está publicado: categorias, tetos e envio são desconhecidos. Pedir à coordenação, com número e data."
    ]
   },
   {
    "id": "ENF",
    "nome": "Enfermagem",
    "matriz": {
     "codigo": "Matriz 2024/1"
    },
    "horas": {
     "valor": 70,
     "unidade": "h",
     "situacao": "verificado",
     "fonte": "https://www.catolicasc.org.br/cursos/graduacao/enfermagem/",
     "carga_total_curso": 4050
    },
    "pdf": [
     "Catolica SC/CatolicaSC_Joinville_Matriz_Enfermagem_20241.pdf"
    ],
    "norma_aplicavel": "reg-proprio",
    "a_confirmar": [
     "O regulamento de AAC do curso não está publicado: categorias, tetos e envio são desconhecidos. Pedir à coordenação, com número e data."
    ]
   },
   {
    "id": "ESOFT",
    "nome": "Engenharia de Software",
    "matriz": {
     "codigo": "Matriz 2023/1"
    },
    "horas": {
     "valor": 60,
     "unidade": "h",
     "situacao": "verificado",
     "fonte": "https://www.catolicasc.org.br/cursos/graduacao/",
     "carga_total_curso": 3200
    },
    "pdf": [
     "Catolica SC/CatolicaSC_Joinville_Matriz_Engenharia_de_Software_20231.pdf"
    ],
    "norma_aplicavel": "reg-proprio",
    "a_confirmar": [
     "O regulamento de AAC do curso não está publicado: categorias, tetos e envio são desconhecidos. Pedir à coordenação, com número e data."
    ]
   },
   {
    "id": "PSI",
    "nome": "Psicologia",
    "matriz": {
     "codigo": "Matriz 2024/1"
    },
    "horas": {
     "valor": null,
     "unidade": null,
     "situacao": "zero_a_confirmar",
     "fonte": "https://www.catolicasc.org.br/cursos/graduacao/",
     "nota": "Sem linha de AAC na matriz."
    },
    "pdf": [
     "Catolica SC/CatolicaSC_Joinville_Matriz_Psicologia_20241.pdf"
    ],
    "norma_aplicavel": "reg-proprio",
    "a_confirmar": [
     "O regulamento de AAC do curso não está publicado: categorias, tetos e envio são desconhecidos. Pedir à coordenação, com número e data."
    ]
   },
   {
    "id": "ADM-JGS",
    "nome": "Administração (referência: Jaraguá do Sul)",
    "matriz": {
     "codigo": "Matriz Jaraguá do Sul 2026/1"
    },
    "horas": {
     "valor": 60,
     "unidade": "h",
     "situacao": "referencia_outra_unidade",
     "fonte": "http://app.catolicasc.org.br/apps/integra_site/matrizes/pdf/c7925d5a8f32cc1695cef6df8f502098_Pres_Bac_c99747914037495b72ceff0eb2523e36_Noturno.pdf"
    },
    "pdf": [
     "Catolica SC/CatolicaSC_JARAGUA_Matriz_Administracao_20261.pdf"
    ],
    "referencia_outra_unidade": true,
    "alertas": [
     {
      "nivel": "alto",
      "texto": "Matriz de OUTRA unidade (não é de Joinville): serve só de referência. Não use este número como se fosse o do seu curso."
     }
    ]
   },
   {
    "id": "CONT-JGS",
    "nome": "Ciências Contábeis (referência: Jaraguá do Sul)",
    "matriz": {
     "codigo": "Matriz Jaraguá do Sul 2026/1"
    },
    "horas": {
     "valor": 100,
     "unidade": "h",
     "situacao": "referencia_outra_unidade",
     "fonte": "catolicasc.org.br (matrizes Jaraguá do Sul)"
    },
    "pdf": [
     "Catolica SC/CatolicaSC_JARAGUA_Matriz_Ciencias_Contabeis_20261.pdf"
    ],
    "referencia_outra_unidade": true,
    "alertas": [
     {
      "nivel": "alto",
      "texto": "Matriz de OUTRA unidade (não é de Joinville): serve só de referência. Não use este número como se fosse o do seu curso."
     }
    ]
   },
   {
    "id": "DES-JGS",
    "nome": "Design (referência: Jaraguá do Sul)",
    "matriz": {
     "codigo": "Matriz Jaraguá do Sul 2023/1"
    },
    "horas": {
     "valor": 60,
     "unidade": "h",
     "situacao": "referencia_outra_unidade",
     "fonte": "catolicasc.org.br (matrizes Jaraguá do Sul)"
    },
    "pdf": [
     "Catolica SC/CatolicaSC_JARAGUA_Matriz_Design_20231.pdf"
    ],
    "referencia_outra_unidade": true,
    "alertas": [
     {
      "nivel": "alto",
      "texto": "Matriz de OUTRA unidade (não é de Joinville): serve só de referência. Não use este número como se fosse o do seu curso."
     }
    ]
   },
   {
    "id": "ECIV-JGS",
    "nome": "Engenharia Civil (referência: Jaraguá do Sul)",
    "matriz": {
     "codigo": "Matriz Jaraguá do Sul 2023/1"
    },
    "horas": {
     "valor": 35,
     "unidade": "h",
     "situacao": "referencia_outra_unidade",
     "fonte": "http://app.catolicasc.org.br/apps/integra_site/matrizes/pdf/9cc089d66600febf8b6ef08253ec5103_Pres_Bac_c99747914037495b72ceff0eb2523e36_Noturno.pdf"
    },
    "pdf": [
     "Catolica SC/CatolicaSC_JARAGUA_Matriz_Engenharia_Civil_20231.pdf"
    ],
    "referencia_outra_unidade": true,
    "alertas": [
     {
      "nivel": "alto",
      "texto": "Matriz de OUTRA unidade (não é de Joinville): serve só de referência. Não use este número como se fosse o do seu curso."
     }
    ]
   },
   {
    "id": "EELE-JGS",
    "nome": "Engenharia Elétrica (referência: Jaraguá do Sul)",
    "matriz": {
     "codigo": "Matriz Jaraguá do Sul 2023/1"
    },
    "horas": {
     "valor": 35,
     "unidade": "h",
     "situacao": "referencia_outra_unidade",
     "fonte": "catolicasc.org.br (matrizes Jaraguá do Sul)"
    },
    "pdf": [
     "Catolica SC/CatolicaSC_JARAGUA_Matriz_Engenharia_Eletrica_20231.pdf"
    ],
    "referencia_outra_unidade": true,
    "alertas": [
     {
      "nivel": "alto",
      "texto": "Matriz de OUTRA unidade (não é de Joinville): serve só de referência. Não use este número como se fosse o do seu curso."
     }
    ]
   },
   {
    "id": "EMEC-JGS",
    "nome": "Engenharia Mecânica (referência: Jaraguá do Sul)",
    "matriz": {
     "codigo": "Matriz Jaraguá do Sul 2023/1"
    },
    "horas": {
     "valor": 35,
     "unidade": "h",
     "situacao": "referencia_outra_unidade",
     "fonte": "catolicasc.org.br (matrizes Jaraguá do Sul)"
    },
    "pdf": [
     "Catolica SC/CatolicaSC_JARAGUA_Matriz_Engenharia_Mecanica_20231.pdf"
    ],
    "referencia_outra_unidade": true,
    "alertas": [
     {
      "nivel": "alto",
      "texto": "Matriz de OUTRA unidade (não é de Joinville): serve só de referência. Não use este número como se fosse o do seu curso."
     }
    ]
   },
   {
    "id": "EPROD-JGS",
    "nome": "Engenharia de Produção (referência: Jaraguá do Sul)",
    "matriz": {
     "codigo": "Matriz Jaraguá do Sul 2025/1"
    },
    "horas": {
     "valor": 35,
     "unidade": "h",
     "situacao": "referencia_outra_unidade",
     "fonte": "catolicasc.org.br (matrizes Jaraguá do Sul)"
    },
    "pdf": [
     "Catolica SC/CatolicaSC_JARAGUA_Matriz_Engenharia_de_Producao_20251.pdf"
    ],
    "referencia_outra_unidade": true,
    "alertas": [
     {
      "nivel": "alto",
      "texto": "Matriz de OUTRA unidade (não é de Joinville): serve só de referência. Não use este número como se fosse o do seu curso."
     }
    ]
   }
  ]
 },
 {
  "id": "unisociesc",
  "nome": "Centro Universitário Sociesc (Unisociesc, grupo Ânima)",
  "sigla": "Unisociesc",
  "tipo": "centro_universitario",
  "campus": "Joinville (sede)",
  "pasta_documentos": "Unisociesc",
  "requisito_nome": "Atividades Complementares de Graduação (ACG)",
  "resumo": "A regra está no Manual do Aluno da modalidade (versões de 2026) e no PPC de cada curso; não foi encontrada resolução específica de ACG. Teto de 45% da carga em uma única categoria e mínimo de três categorias.",
  "normas": [
   {
    "id": "manual-e2a",
    "numero": "Manual do Aluno Presencial E2A (2026-08)",
    "data": "2026-08",
    "status": "vigente",
    "nota": "\"O aluno não poderá utilizar mais de 45% da carga horária total em uma única categoria, sendo obrigatória a realização de atividades em, no mínimo, três categorias diferentes.\" Comprovante com nome, carga horária, local, data, título, assinatura e QR Code ou código de validação.",
    "url": "https://estaticos.animaeducacao.com.br/medias/20260828100141/Manual_Presencial_E2A_UniSociesc.pdf",
    "pdf": "Unisociesc/Unisociesc_Manual_do_Aluno_Presencial_E2A_2026-08.pdf"
   },
   {
    "id": "manual-ead",
    "numero": "Manual do Aluno EaD (2026-08)",
    "data": "2026-08",
    "status": "vigente",
    "nota": "Outra lógica: ACG Institucionais (60%) e Específicas do Curso (40%), em ensino, pesquisa e extensão; protocolo no Portal do Estudante/SIGA.",
    "url": "https://estaticos.animaeducacao.com.br/medias/20260828110658/Manual_do_Aluno-EAD.pdf",
    "pdf": "Unisociesc/Unisociesc_Manual_do_Aluno_EAD_2026-08.pdf"
   },
   {
    "id": "manual-semi",
    "numero": "Manual do Aluno Semipresencial (2026-08)",
    "data": "2026-08",
    "status": "vigente",
    "nota": "Seis categorias, como o presencial.",
    "url": "",
    "pdf": "Unisociesc/Unisociesc_Manual_do_Aluno_Semipresencial_2026-08.pdf"
   },
   {
    "id": "manual-radial",
    "numero": "Manual do Aluno Radial (2026-08)",
    "data": "2026-08",
    "status": "vigente",
    "nota": "",
    "url": "",
    "pdf": "Unisociesc/Unisociesc_Manual_do_Aluno_Radial_2026-08.pdf"
   },
   {
    "id": "manual-legado",
    "numero": "Manual do Aluno Currículo Legado (2026-04)",
    "data": "2026-04",
    "status": "vigente",
    "nota": "",
    "url": "",
    "pdf": "Unisociesc/Unisociesc_Manual_do_Aluno_Curriculo_Legado_2026-04.pdf"
   },
   {
    "id": "orientador-externas",
    "numero": "Documento Orientador de Validação de Atividades Externas de Extensão (Ânima)",
    "data": "",
    "status": "desatualizada",
    "nota": "Superado: previa validar extensão externa, o que deixou de valer em 2025/2.",
    "url": "",
    "pdf": "Unisociesc/Anima_Doc_Orientador_Validacao_Atividades_Externas_Extensao.pdf"
   }
  ],
  "regras_gerais": [
   {
    "texto": "Seis categorias nos manuais presenciais: ensino e aprendizagem; pesquisa, produção científica e inovação tecnológica; culturais e esportivas; administrativas e de representação estudantil; internacionais; mundo do trabalho.",
    "fonte": "Manual Presencial E2A"
   },
   {
    "texto": "Máximo de 45% da carga em uma única categoria e no mínimo três categorias diferentes.",
    "fonte": "Manual Presencial E2A"
   },
   {
    "texto": "Colação de grau exige 100% da carga, inclusive ACG; ACG feitas depois do prazo de integralização podem ser cobradas.",
    "fonte": "Manual Presencial E2A"
   }
  ],
  "como_enviar": {
   "sistema": "Protocolo no Ulife (EaD: Portal do Estudante/SIGA): abrir o protocolo, pagar a taxa de serviço e anexar os comprovantes",
   "prazo": "Não informado",
   "quem_aprova": "A confirmar (as horas validadas vão integralmente para o histórico; o componente aparece como \"Cumpriu\")",
   "taxa": "Existe taxa de serviço, valor não encontrado",
   "fonte": "Manual Presencial E2A (Ulife)"
  },
  "extensao": {
   "mesma_hora_conta_nas_duas": "a_confirmar",
   "regra": "A extensão é componente separado de 10% desde 2020/2. Desde 2025/2, extensão feita fora do ecossistema Ânima não é aceita, mas as ACG continuam aceitando atividades dentro ou fora da IES: um curso externo só vale como ACG. Nenhum documento diz se a mesma hora conta nas duas.",
   "fonte": "Manual Presencial E2A; PPC Ciências Contábeis JOI"
  },
  "sistemas_academicos": "Ulife; Portal do Estudante (SIGA) no EaD.",
  "alertas": [
   {
    "nivel": "medio",
    "texto": "Os PPCs listam sete categorias (inovação tecnológica separada), os manuais presenciais seis e o manual EaD outra divisão. Vale o manual da sua modalidade."
   },
   {
    "nivel": "medio",
    "texto": "Taxa do protocolo no Ulife não informada. Nenhum documento público traz horas por tipo de certificado, só o teto de 45% e o mínimo de três categorias."
   },
   {
    "nivel": "medio",
    "texto": "Não há PPC publicado com cabeçalho de Joinville para Direito, Psicologia, Arquitetura, Enfermagem, SI, Administração ou Engenharia de Software, e não se confirmou quais funcionam no campus."
   }
  ],
  "cursos": [
   {
    "id": "ECIV",
    "nome": "Engenharia Civil",
    "matriz": {
     "codigo": "PPC 2026 (Presencial)"
    },
    "horas": {
     "valor": 40,
     "unidade": "h",
     "situacao": "verificado",
     "fonte": "https://www.unisociesc.com.br/sobre/documentos-institucionais/"
    },
    "pdf": [
     "Unisociesc/Unisociesc_Joinville_PPC_Engenharia_Civil_Presencial_2026.pdf"
    ],
    "modalidade": "Presencial"
   },
   {
    "id": "EELE",
    "nome": "Engenharia Elétrica",
    "matriz": {
     "codigo": "PPC 2026 (Semipresencial)"
    },
    "horas": {
     "valor": 40,
     "unidade": "h",
     "situacao": "verificado",
     "fonte": "https://www.unisociesc.com.br/sobre/documentos-institucionais/"
    },
    "pdf": [
     "Unisociesc/Unisociesc_Joinville_PPC_Engenharia_Eletrica_Semipresencial_2026.pdf"
    ],
    "modalidade": "Semipresencial"
   },
   {
    "id": "EMEC",
    "nome": "Engenharia Mecânica",
    "matriz": {
     "codigo": "PPC 2026 (Semipresencial)"
    },
    "horas": {
     "valor": 40,
     "unidade": "h",
     "situacao": "verificado",
     "fonte": "https://www.unisociesc.com.br/sobre/documentos-institucionais/"
    },
    "pdf": [
     "Unisociesc/Unisociesc_Joinville_PPC_Engenharia_Mecanica_Semipresencial_2026.pdf"
    ],
    "modalidade": "Semipresencial"
   },
   {
    "id": "EPROD",
    "nome": "Engenharia de Produção",
    "matriz": {
     "codigo": "PPC 2026 (Semipresencial)"
    },
    "horas": {
     "valor": 40,
     "unidade": "h",
     "situacao": "verificado",
     "fonte": "https://www.unisociesc.com.br/sobre/documentos-institucionais/"
    },
    "pdf": [
     "Unisociesc/Unisociesc_Joinville_PPC_Engenharia_de_Producao_Semipresencial_2026.pdf"
    ],
    "modalidade": "Semipresencial"
   },
   {
    "id": "NUT",
    "nome": "Nutrição",
    "matriz": {
     "codigo": "PPC 2026 (Semipresencial)"
    },
    "horas": {
     "valor": 40,
     "unidade": "h",
     "situacao": "verificado",
     "fonte": "https://www.unisociesc.com.br/sobre/documentos-institucionais/"
    },
    "pdf": [
     "Unisociesc/Unisociesc_Joinville_PPC_Nutricao_Semipresencial_2026.pdf"
    ],
    "modalidade": "Semipresencial"
   },
   {
    "id": "CONT",
    "nome": "Ciências Contábeis",
    "matriz": {
     "codigo": "PPC 2026 (Semipresencial)"
    },
    "horas": {
     "valor": 80,
     "unidade": "h",
     "situacao": "verificado",
     "fonte": "https://www.unisociesc.com.br/sobre/documentos-institucionais/"
    },
    "pdf": [
     "Unisociesc/Unisociesc_Joinville_PPC_Ciencias_Contabeis_Semipresencial_2026.pdf"
    ],
    "modalidade": "Semipresencial"
   },
   {
    "id": "CST-DI",
    "nome": "CST Design de Interiores",
    "matriz": {
     "codigo": "PPC 2026 (EaD)"
    },
    "horas": {
     "valor": 120,
     "unidade": "h",
     "situacao": "verificado",
     "fonte": "https://www.unisociesc.com.br/sobre/documentos-institucionais/"
    },
    "pdf": [
     "Unisociesc/Unisociesc_Joinville_PPC_CST_Design_de_Interiores_EAD_2026.pdf"
    ],
    "modalidade": "EaD"
   },
   {
    "id": "CST-PG",
    "nome": "CST Processos Gerenciais",
    "matriz": {
     "codigo": "PPC 2026 (Semipresencial)"
    },
    "horas": {
     "valor": null,
     "unidade": null,
     "situacao": "zero_a_confirmar",
     "fonte": "https://www.unisociesc.com.br/sobre/documentos-institucionais/",
     "nota": "Sem carga obrigatória de ACG no PPC."
    },
    "pdf": [
     "Unisociesc/Unisociesc_Joinville_PPC_CST_Processos_Gerenciais_Semipresencial_2026.pdf"
    ],
    "modalidade": "Semipresencial",
    "a_confirmar": [
     "Sem carga obrigatória de ACG no PPC: confirmar na coordenação."
    ]
   },
   {
    "id": "DIR-BNU",
    "nome": "Direito (referência: Blumenau)",
    "matriz": {
     "codigo": "PPC Blumenau"
    },
    "horas": {
     "valor": 130,
     "unidade": "h",
     "situacao": "referencia_outra_unidade",
     "fonte": "estaticos.animaeducacao.com.br (PPC Blumenau)"
    },
    "pdf": [
     "Unisociesc/Unisociesc_BLUMENAU_PPC_Direito_2025.pdf"
    ],
    "referencia_outra_unidade": true,
    "alertas": [
     {
      "nivel": "alto",
      "texto": "Matriz de OUTRA unidade (não é de Joinville): serve só de referência. Não use este número como se fosse o do seu curso."
     }
    ]
   },
   {
    "id": "ENF-BNU",
    "nome": "Enfermagem (referência: Blumenau)",
    "matriz": {
     "codigo": "PPC Blumenau"
    },
    "horas": {
     "valor": 210,
     "unidade": "h",
     "situacao": "referencia_outra_unidade",
     "fonte": "estaticos.animaeducacao.com.br (PPC Blumenau)"
    },
    "pdf": [
     "Unisociesc/Unisociesc_BLUMENAU_PPC_Enfermagem_2026.pdf"
    ],
    "referencia_outra_unidade": true,
    "alertas": [
     {
      "nivel": "alto",
      "texto": "Matriz de OUTRA unidade (não é de Joinville): serve só de referência. Não use este número como se fosse o do seu curso."
     }
    ]
   },
   {
    "id": "SI-BNU",
    "nome": "Sistemas de Informação (referência: Blumenau)",
    "matriz": {
     "codigo": "PPC Blumenau"
    },
    "horas": {
     "valor": 100,
     "unidade": "h",
     "situacao": "referencia_outra_unidade",
     "fonte": "estaticos.animaeducacao.com.br (PPC Blumenau)"
    },
    "pdf": [
     "Unisociesc/Unisociesc_BLUMENAU_PPC_Sistemas_de_Informacao_2026.pdf"
    ],
    "referencia_outra_unidade": true,
    "alertas": [
     {
      "nivel": "alto",
      "texto": "Matriz de OUTRA unidade (não é de Joinville): serve só de referência. Não use este número como se fosse o do seu curso."
     }
    ]
   },
   {
    "id": "ARQ-BNU",
    "nome": "Arquitetura e Urbanismo (referência: Blumenau)",
    "matriz": {
     "codigo": "PPC Blumenau"
    },
    "horas": {
     "valor": 40,
     "unidade": "h",
     "situacao": "referencia_outra_unidade",
     "fonte": "estaticos.animaeducacao.com.br (PPC Blumenau)"
    },
    "pdf": [
     "Unisociesc/Unisociesc_BLUMENAU_PPC_Arquitetura_e_Urbanismo_2026.pdf"
    ],
    "referencia_outra_unidade": true,
    "alertas": [
     {
      "nivel": "alto",
      "texto": "Matriz de OUTRA unidade (não é de Joinville): serve só de referência. Não use este número como se fosse o do seu curso."
     }
    ]
   },
   {
    "id": "ESOFT-BNU",
    "nome": "Engenharia de Software (referência: Blumenau)",
    "matriz": {
     "codigo": "PPC Blumenau"
    },
    "horas": {
     "valor": 40,
     "unidade": "h",
     "situacao": "referencia_outra_unidade",
     "fonte": "estaticos.animaeducacao.com.br (PPC Blumenau)"
    },
    "pdf": [
     "Unisociesc/Unisociesc_BLUMENAU_PPC_Engenharia_de_Software_2026.pdf"
    ],
    "referencia_outra_unidade": true,
    "alertas": [
     {
      "nivel": "alto",
      "texto": "Matriz de OUTRA unidade (não é de Joinville): serve só de referência. Não use este número como se fosse o do seu curso."
     }
    ]
   },
   {
    "id": "PSI-BNU",
    "nome": "Psicologia (referência: Blumenau)",
    "matriz": {
     "codigo": "PPC Blumenau"
    },
    "horas": {
     "valor": null,
     "unidade": null,
     "situacao": "referencia_outra_unidade",
     "fonte": "",
     "nota": "Sem ACG no PPC de Blumenau."
    },
    "pdf": [
     "Unisociesc/Unisociesc_BLUMENAU_PPC_Psicologia_2026.pdf"
    ],
    "referencia_outra_unidade": true,
    "alertas": [
     {
      "nivel": "alto",
      "texto": "Matriz de OUTRA unidade (não é de Joinville): serve só de referência. Não use este número como se fosse o do seu curso."
     }
    ]
   }
  ]
 },
 {
  "id": "fgg",
  "nome": "Faculdade Guilherme Guimbala (ACE)",
  "sigla": "FGG",
  "tipo": "faculdade",
  "campus": "Joinville",
  "pasta_documentos": "Guilherme Guimbala",
  "requisito_nome": "Atividades Complementares (AC), geridas pelo NAC (Núcleo de Atividades Complementares)",
  "resumo": "Um regulamento por curso, e matrizes de 2025-2026 que contradizem os regulamentos em Direito, Terapia Ocupacional e Fisioterapia.",
  "normas": [
   {
    "id": "nac-01-2026",
    "numero": "Res. NAC nº 01/2026 (Direito)",
    "data": "2026-04-17",
    "status": "vigente",
    "nota": "Aprovada em 17/04/2026, assinada em 22/04/2026, publicada em 27/04/2026. 270 h na matriz anual e 360 h na semestral. Cinco grupos: docência e pesquisa, eventos, produção acadêmica, vivência profissional, extensão. Não pode concentrar tudo em um grupo.",
    "url": "https://ace.br/wp-content/uploads/2024/02/Regulamento-NAC-publicado-27.04.26.pdf",
    "pdf": "Guilherme Guimbala/FGG_Regulamento_NAC_publicado_2026-04-27.pdf"
   },
   {
    "id": "nac-01-2018",
    "numero": "Res. NAC nº 01/2018 (Direito)",
    "data": "2018-02-05",
    "status": "desatualizada",
    "nota": "Previa 180 h para quem entrou até 2015 e 270 h a partir de 2017. Anterior a 2020; o texto de 2026 não diz expressamente que a revoga.",
    "url": "https://ace.br/wp-content/uploads/2024/06/1-NAC-Regulamento_e_Anexos-Nucleo_Atividades_Complementares-2019.pdf",
    "pdf": "Guilherme Guimbala/FGG_NAC_Regulamento_e_Anexos_2019.pdf"
   },
   {
    "id": "to-1-2021",
    "numero": "Resolução nº 1/2021 (Terapia Ocupacional)",
    "data": "2021-07-14",
    "status": "vigente",
    "nota": "36 h em quatro categorias (ensino, pesquisa, extensão e social). Entrega na última semana de julho e de outubro; validação na primeira quinzena do mês seguinte.",
    "url": "https://ace.br/wp-content/uploads/2024/06/Resolucao-horas-complementares-atual-1.pdf",
    "pdf": "Guilherme Guimbala/FGG_Resolucao_horas_complementares_atual.pdf"
   },
   {
    "id": "fisio-sem-data",
    "numero": "Normas de Atividades Complementares (Fisioterapia, sem data)",
    "data": "",
    "status": "desatualizada",
    "nota": "Exige 18 horas anuais; matrícula bloqueada no ano seguinte para quem não cumprir. Documento sem data.",
    "url": "https://ace.br/wp-content/uploads/2024/06/normas_da_atividades_complementares.pdf",
    "pdf": "Guilherme Guimbala/FGG_normas_atividades_complementares.pdf"
   }
  ],
  "regras_gerais": [
   {
    "texto": "Direito (Anexo I, tetos): monitoria 30 h por semestre, máximo 90 h; pesquisa ou IC 60 h por projeto por semestre, máximo 120 h; estágio não obrigatório máximo 130 h; congressos e palestras máximo 180 h; eletivas, oficinas e EaD máximo 180 h; audiências 5 h cada, máximo 80 h; visitas técnicas 10 h, máximo 80 h; idiomas máximo 90 h; projetos sociais 20 h, máximo 80 h; livro ou capítulo 80 h, máximo 160 h; assistir a TCC ou defesas 5 h, máximo 45 h.",
    "fonte": "Res. NAC 01/2026, Anexo I"
   },
   {
    "texto": "Direito: atividades já computadas como estágio supervisionado ou componentes obrigatórios não contam. Recomendado integralizar 50% até a metade do curso.",
    "fonte": "Res. NAC 01/2026, arts. 1º e 2º"
   }
  ],
  "como_enviar": {
   "sistema": "E-mail ao NAC. Direito: nac.atividades@ace.br. Terapia Ocupacional: nacto@fgg.edu.br.",
   "prazo": "Direito: no final de cada semestre ou ano. T.O.: última semana de julho e de outubro.",
   "quem_aprova": "NAC / coordenação (pode indeferir, pedir mais documentos ou deferir em parte)",
   "taxa": "Não informada",
   "fonte": "Res. NAC 01/2026, art. 5º; Res. 1/2021"
  },
  "extensao": {
   "mesma_hora_conta_nas_duas": "a_confirmar",
   "regra": "Terapia Ocupacional: extensão só conta como AC quando não compõe a curricularização. No Direito, a extensão é um dos cinco grupos de AC; a pesquisa não localizou regra sobre dupla contagem com a extensão curricularizada.",
   "fonte": "Res. 1/2021 (T.O.); Res. NAC 01/2026"
  },
  "sistemas_academicos": "Não identificado; o envio é por e-mail.",
  "alertas": [
   {
    "nivel": "alto",
    "texto": "Direito semestral: regulamento diz 360 h, a matriz soma 340 h (dez componentes de 34 h)."
   },
   {
    "nivel": "alto",
    "texto": "Terapia Ocupacional: a resolução diz 36 h, mas a matriz semestral traz 96 h."
   },
   {
    "nivel": "alto",
    "texto": "Fisioterapia: normas dizem 18 h anuais, mas as matrizes somam 96 h."
   },
   {
    "nivel": "medio",
    "texto": "Psicologia, Pedagogia e Fonoaudiologia não têm regulamento publicado; os números vêm só das matrizes."
   },
   {
    "nivel": "medio",
    "texto": "A Res. NAC 01/2018 não foi revogada expressamente pela de 2026."
   }
  ],
  "cursos": [
   {
    "id": "DIR-A",
    "nome": "Direito (matriz anual)",
    "matriz": {
     "codigo": "A partir de 2017"
    },
    "horas": {
     "valor": 270,
     "unidade": "h",
     "situacao": "verificado",
     "fonte": "https://ace.br/wp-content/uploads/2026/01/Direito-anual.pdf"
    },
    "pdf": [
     "Guilherme Guimbala/FGG_Matriz_Direito-anual_2026-01.pdf",
     "Guilherme Guimbala/FGG_Regulamento_NAC_publicado_2026-04-27.pdf"
    ],
    "norma_aplicavel": "nac-01-2026"
   },
   {
    "id": "DIR-S",
    "nome": "Direito (matriz semestral)",
    "matriz": {
     "codigo": "A partir de 03/2025"
    },
    "horas": {
     "valor": 360,
     "unidade": "h",
     "situacao": "contraditorio",
     "fonte": "https://ace.br/wp-content/uploads/2026/01/Direito-semestral.pdf",
     "alternativa": {
      "valor": 340,
      "unidade": "h",
      "origem": "soma dos componentes da matriz"
     }
    },
    "pdf": [
     "Guilherme Guimbala/FGG_Matriz_Direito-semestral_2026-01.pdf",
     "Guilherme Guimbala/FGG_Regulamento_NAC_publicado_2026-04-27.pdf"
    ],
    "norma_aplicavel": "nac-01-2026",
    "a_confirmar": [
     "Regulamento: 360 h. Matriz: 340 h."
    ],
    "alertas": [
     {
      "nivel": "alto",
      "texto": "Regulamento 360 h x matriz 340 h. Confirmar com o NAC."
     }
    ]
   },
   {
    "id": "TO-A",
    "nome": "Terapia Ocupacional (matriz anual)",
    "matriz": {
     "codigo": "Resolução 1/2021"
    },
    "horas": {
     "valor": 36,
     "unidade": "h",
     "situacao": "a_confirmar",
     "fonte": "https://ace.br/wp-content/uploads/2024/06/Resolucao-horas-complementares-atual-1.pdf"
    },
    "pdf": [
     "Guilherme Guimbala/FGG_Matriz_T.O-anual_2026-01.pdf",
     "Guilherme Guimbala/FGG_Resolucao_horas_complementares_atual.pdf",
     "Guilherme Guimbala/FGG_Categorias_horas_complementares.pdf"
    ],
    "norma_aplicavel": "to-1-2021",
    "extensao": {
     "mesma_hora_conta_nas_duas": "nao",
     "regra": "Extensão só conta quando não compõe a curricularização.",
     "fonte": "Res. 1/2021"
    },
    "a_confirmar": [
     "A pesquisa citou a matriz semestral (96 h); a soma da matriz anual não foi relatada."
    ]
   },
   {
    "id": "TO-S",
    "nome": "Terapia Ocupacional (matriz semestral)",
    "matriz": {
     "codigo": "Matriz 2026-01"
    },
    "horas": {
     "valor": 36,
     "unidade": "h",
     "situacao": "contraditorio",
     "fonte": "https://ace.br/wp-content/uploads/2026/01/T.O-semestral.pdf",
     "alternativa": {
      "valor": 96,
      "unidade": "h",
      "origem": "matriz semestral"
     }
    },
    "pdf": [
     "Guilherme Guimbala/FGG_Matriz_T.O-semestral_2026-01.pdf",
     "Guilherme Guimbala/FGG_Resolucao_horas_complementares_atual.pdf"
    ],
    "norma_aplicavel": "to-1-2021",
    "extensao": {
     "mesma_hora_conta_nas_duas": "nao",
     "regra": "Extensão só conta quando não compõe a curricularização.",
     "fonte": "Res. 1/2021"
    },
    "a_confirmar": [
     "Resolução: 36 h. Matriz semestral: 96 h."
    ],
    "alertas": [
     {
      "nivel": "alto",
      "texto": "Resolução 36 h x matriz 96 h. Confirmar com o NAC."
     }
    ]
   },
   {
    "id": "FISIO-A",
    "nome": "Fisioterapia (matriz anual)",
    "matriz": {
     "codigo": "Matriz 2026-01"
    },
    "horas": {
     "valor": 18,
     "unidade": "h",
     "situacao": "contraditorio",
     "fonte": "https://ace.br/wp-content/uploads/2024/06/normas_da_atividades_complementares.pdf",
     "nota": "18 h por ano (normas sem data)",
     "alternativa": {
      "valor": 96,
      "unidade": "h",
      "origem": "soma das matrizes"
     }
    },
    "pdf": [
     "Guilherme Guimbala/FGG_Matriz_Fisioterapia-anual_2026-01.pdf",
     "Guilherme Guimbala/FGG_normas_atividades_complementares.pdf"
    ],
    "norma_aplicavel": "fisio-sem-data",
    "a_confirmar": [
     "Normas: 18 h por ano. Matrizes: 96 h."
    ],
    "alertas": [
     {
      "nivel": "alto",
      "texto": "18 h por ano nas normas x 96 h nas matrizes. Confirmar com o NAC."
     }
    ]
   },
   {
    "id": "FISIO-S",
    "nome": "Fisioterapia (matriz semestral)",
    "matriz": {
     "codigo": "Matriz 2026-01"
    },
    "horas": {
     "valor": 96,
     "unidade": "h",
     "situacao": "a_confirmar",
     "fonte": "https://ace.br/wp-content/uploads/2026/01/Fisioterapia-anual.pdf"
    },
    "pdf": [
     "Guilherme Guimbala/FGG_Matriz_Fisioterapia-semestral_2026-01.pdf",
     "Guilherme Guimbala/FGG_normas_atividades_complementares.pdf"
    ],
    "norma_aplicavel": "fisio-sem-data",
    "a_confirmar": [
     "A pesquisa relata 96 h somando \"as matrizes\"; confirmar o valor da matriz semestral com o NAC."
    ]
   },
   {
    "id": "PSI-A",
    "nome": "Psicologia (matriz anual)",
    "matriz": {
     "codigo": "Matriz 2026-01"
    },
    "horas": {
     "valor": 198,
     "unidade": "h",
     "situacao": "a_confirmar",
     "fonte": "https://ace.br/wp-content/uploads/2026/01/Psicologia-anual.pdf",
     "nota": "Só da matriz; regulamento não publicado."
    },
    "pdf": [
     "Guilherme Guimbala/FGG_Matriz_Psicologia-anual_2026-01.pdf"
    ],
    "a_confirmar": [
     "Regulamento de AC não publicado."
    ]
   },
   {
    "id": "PSI-S",
    "nome": "Psicologia (matriz semestral)",
    "matriz": {
     "codigo": "Matriz 2026-01"
    },
    "horas": {
     "valor": 196,
     "unidade": "h",
     "situacao": "a_confirmar",
     "fonte": "https://ace.br/wp-content/uploads/2026/01/Psicologia-anual.pdf",
     "nota": "Só da matriz; regulamento não publicado."
    },
    "pdf": [
     "Guilherme Guimbala/FGG_Matriz_Psicologia-semestral_2026-01.pdf"
    ],
    "a_confirmar": [
     "Regulamento de AC não publicado."
    ]
   },
   {
    "id": "PED-A",
    "nome": "Pedagogia (matriz anual)",
    "matriz": {
     "codigo": "Matriz 2026-01"
    },
    "horas": {
     "valor": 180,
     "unidade": "h",
     "situacao": "a_confirmar",
     "fonte": "FGG_Matriz_Pedagogia-anual_2026-01.pdf",
     "nota": "Só da matriz; regulamento não publicado."
    },
    "pdf": [
     "Guilherme Guimbala/FGG_Matriz_Pedagogia-anual_2026-01.pdf"
    ],
    "a_confirmar": [
     "Regulamento de AC não publicado."
    ]
   },
   {
    "id": "PED-S",
    "nome": "Pedagogia (matriz semestral)",
    "matriz": {
     "codigo": "Matriz 2026-01"
    },
    "horas": {
     "valor": null,
     "unidade": null,
     "situacao": "zero_a_confirmar",
     "fonte": "",
     "nota": "A matriz semestral não lista AC."
    },
    "pdf": [
     "Guilherme Guimbala/FGG_Matriz_Pedagogia-semestral_2026-01.pdf"
    ],
    "a_confirmar": [
     "A matriz não lista AC: confirmar com a coordenação."
    ]
   },
   {
    "id": "FONO-S",
    "nome": "Fonoaudiologia (matriz semestral)",
    "matriz": {
     "codigo": "Matriz 2026/2"
    },
    "horas": {
     "valor": 100,
     "unidade": "h",
     "situacao": "a_confirmar",
     "fonte": "https://ace.br/wp-content/uploads/2025/12/Matriz-Semestral-Fonoaudiologia-2026_2.pdf",
     "nota": "Extensão curricularizada à parte: 310 h."
    },
    "pdf": [
     "Guilherme Guimbala/FGG_Matriz_Fonoaudiologia_semestral_2026-2.pdf"
    ],
    "a_confirmar": [
     "Regulamento de AC não publicado."
    ]
   }
  ]
 },
 {
  "id": "cnec_joinville",
  "nome": "Faculdade CNEC Joinville",
  "sigla": "CNEC",
  "tipo": "faculdade",
  "campus": "Joinville",
  "pasta_documentos": "CNEC Joinville",
  "requisito_nome": "Atividades Complementares (NAC)",
  "resumo": "A única norma pública é o regulamento de 17/03/2017 da antiga Faculdade Cenecista de Joinville. A matriz atual do Direito contradiz o regulamento.",
  "normas": [
   {
    "id": "fcj-2017",
    "numero": "Regulamento das Atividades Complementares (Faculdade Cenecista de Joinville)",
    "data": "2017-03-17",
    "status": "desatualizada",
    "nota": "Anterior a 2020. Para matrizes a partir de 2016/1: 300 h para Administração, Ciências Contábeis e Direito; 80 h para cursos de tecnologia. Exige pelo menos dois dos três eixos (ensino, pesquisa, extensão), no máximo 50% em cada. Provavelmente existe regulamento mais novo, não publicado.",
    "url": "https://educacaosuperior.cnec.br/documentos/18f1e97f806eb182f961d2cc99df9bcb",
    "pdf": "CNEC Joinville/FCJ_Regulamento_Atividades_Complementares_2017-03-17.pdf"
   }
  ],
  "regras_gerais": [
   {
    "texto": "Tetos do regulamento de 2017: monitoria 30 h por semestre, até 60 h; estágio extracurricular até 90 h; iniciação científica até 60 h; voluntariado até 30 h.",
    "fonte": "Regulamento FCJ 2017"
   },
   {
    "texto": "Nivelamento, TCC e Estágio de Prática Jurídica não contam.",
    "fonte": "Regulamento FCJ 2017"
   }
  ],
  "como_enviar": {
   "sistema": "Cópias entregues ao NAC, com protocolo em duas vias",
   "prazo": "Concluintes entregam até 10 de maio ou 10 de outubro",
   "quem_aprova": "NAC",
   "taxa": "Não informada",
   "fonte": "Regulamento FCJ 2017"
  },
  "extensao": {
   "mesma_hora_conta_nas_duas": "a_confirmar",
   "regra": "A matriz atual do Direito traz 380 h de Experiência Extensionista, componente separado das Atividades Complementares. A pesquisa não localizou regra sobre contar a mesma hora nos dois.",
   "fonte": "Página do curso Direito (CNEC)"
  },
  "sistemas_academicos": "Não identificado.",
  "alertas": [
   {
    "nivel": "alto",
    "texto": "Direito: 180 h na matriz atual (Atividades Complementares I a X, de 18 h) x 300 h no regulamento de 2017. Confirmar com o NAC ou a Secretaria."
   },
   {
    "nivel": "medio",
    "texto": "O regulamento público é de 2017 e provavelmente há um mais novo, não publicado."
   },
   {
    "nivel": "info",
    "texto": "A Censupeg e a CNEC Joinville funcionam no mesmo endereço (Av. Getúlio Vargas, 1266); nenhum documento explica a relação."
   }
  ],
  "cursos": [
   {
    "id": "DIR",
    "nome": "Direito (presencial)",
    "matriz": {
     "codigo": "Matriz atual (página do curso, 15/11/2026)"
    },
    "horas": {
     "valor": 180,
     "unidade": "h",
     "situacao": "contraditorio",
     "fonte": "https://educacaosuperior.cnec.br/joinville/cursos/graduacao/bacharelado/114/info",
     "alternativa": {
      "valor": 300,
      "unidade": "h",
      "origem": "regulamento de 2017"
     }
    },
    "pdf": [
     "CNEC Joinville/CNEC_Joinville_pagina_curso_Direito_matriz_2026-11-15.pdf",
     "CNEC Joinville/FCJ_Regulamento_Atividades_Complementares_2017-03-17.pdf"
    ],
    "norma_aplicavel": "fcj-2017",
    "a_confirmar": [
     "Matriz atual: 180 h. Regulamento de 2017: 300 h.",
     "A matriz fica num bloco oculto da página e não aparece no PDF; os números vieram do HTML."
    ],
    "alertas": [
     {
      "nivel": "alto",
      "texto": "Matriz 180 h x regulamento 300 h. Confirmar com o NAC."
     }
    ]
   }
  ]
 },
 {
  "id": "censupeg",
  "nome": "Faculdade Censupeg",
  "sigla": "Censupeg",
  "tipo": "faculdade",
  "campus": "Joinville",
  "pasta_documentos": "Censupeg",
  "requisito_nome": "Atividades Complementares",
  "resumo": "Regulamento institucional de maio/2020 com tabela de mínimos e máximos por semestre. O total por curso vem do PPC, que não está publicado para os cursos presenciais.",
  "normas": [
   {
    "id": "reg-2020",
    "numero": "Regulamento de Atividades Complementares",
    "data": "2020-05",
    "status": "vigente",
    "nota": "Publicado numa pasta do Moodle chamada \"2021\". Não contam atividades anteriores ao ingresso nem estágio obrigatório; quem não completar a carga não entra na lista de formandos.",
    "url": "https://censupegead.com.br/pluginfile.php/90/mod_folder/intro/Regulamento%20de%20Atividades%20Complementares%202021.pdf",
    "pdf": "Censupeg/Censupeg_Regulamento_Atividades_Complementares_maio2020_(pasta2021).pdf"
   }
  ],
  "regras_gerais": [
   {
    "texto": "Mínimos e máximos por semestre: estágio não curricular 20 a 40 h; eventos internos 4 a 25 h; organização de eventos 8 a 50 h; projeto de pesquisa 8 a 50 h; representação discente 10 h.",
    "fonte": "Regulamento maio/2020"
   }
  ],
  "como_enviar": {
   "sistema": "Portal Acadêmico",
   "prazo": "Dentro do semestre letivo",
   "quem_aprova": "A confirmar",
   "taxa": "Não informada",
   "fonte": "Regulamento maio/2020"
  },
  "extensao": {
   "mesma_hora_conta_nas_duas": "a_confirmar",
   "regra": "A pesquisa não localizou regra sobre extensão curricularizada.",
   "fonte": ""
  },
  "sistemas_academicos": "Portal Acadêmico.",
  "alertas": [
   {
    "nivel": "alto",
    "texto": "Total de horas por curso não publicado (o PPC dos cursos presenciais de Enfermagem, Odontologia, Direito e Psicologia não está publicado). Consulte a coordenação."
   },
   {
    "nivel": "medio",
    "texto": "O regulamento é de 2020, publicado numa pasta do Moodle chamada \"2021\"."
   }
  ],
  "cursos": [
   {
    "id": "GERAL",
    "nome": "Todos os cursos presenciais",
    "matriz": {
     "codigo": "Regulamento maio/2020"
    },
    "horas": {
     "valor": null,
     "unidade": null,
     "situacao": "nao_publicado",
     "fonte": "https://www.censupeg.com.br/files/DOCUMENTO-edital-campanha-de-vestibular-graduacao-presencial-2026-2.pdf"
    },
    "pdf": [
     "Censupeg/Censupeg_Regulamento_Atividades_Complementares_maio2020_(pasta2021).pdf",
     "Censupeg/Censupeg_Edital_Vestibular_Graduacao_Presencial_2026-2.pdf"
    ],
    "norma_aplicavel": "reg-2020",
    "a_confirmar": [
     "Total de horas fica no PPC de cada curso, não publicado."
    ]
   }
  ]
 },
 {
  "id": "unisenai",
  "nome": "UniSENAI (Centro Universitário SENAI/SC, campus Joinville)",
  "sigla": "UniSENAI",
  "tipo": "centro_universitario",
  "campus": "Joinville",
  "pasta_documentos": "SENAI",
  "requisito_nome": "Atividades Acadêmicas Complementares (AAC)",
  "resumo": "O único documento com carga é o PDI 2018-2022 da antiga Faculdade SENAI Joinville, vencido. O regulamento detalhado fica no Espaço do Estudante, que não é público.",
  "normas": [
   {
    "id": "pdi-2018-2022",
    "numero": "PDI 2018-2022 da Faculdade SENAI Joinville",
    "data": "2018",
    "status": "desatualizada",
    "nota": "Vencido. As AAC \"estão contempladas na matriz curricular do curso com carga horária total de 60 horas\", nos eixos ensino, pesquisa e extensão.",
    "url": "https://sc.senai.br/sites/default/files/inline-files/PDI_2018-2022%20-%20Faculdade%20SENAI%20Joinville.pdf",
    "pdf": "SENAI/SENAI_Faculdade_Tecnologia_SENAI_Joinville_PDI_2018-2022.pdf"
   },
   {
    "id": "regimento-unisenai",
    "numero": "Regimento do UniSENAI",
    "data": "",
    "status": "nao_publicada",
    "nota": "Lido só no buscador (o site respondeu HTTP 503): as atividades complementares são \"requisito obrigatório para a colação de grau\".",
    "url": "https://unisenaisc.com.br/wp-content/uploads/sites/12/2022/01/Regime-interno.pdf",
    "pdf": ""
   }
  ],
  "regras_gerais": [],
  "como_enviar": {
   "sistema": "Regulamento no \"Espaço do Estudante\" (não público)",
   "prazo": "Não publicado",
   "quem_aprova": "Não publicado",
   "taxa": "Não publicado",
   "fonte": "PDI 2018-2022"
  },
  "extensao": {
   "mesma_hora_conta_nas_duas": "a_confirmar",
   "regra": "O PDI tratava a extensão como eixo dentro das AAC. Não se sabe se o UniSENAI já as separou.",
   "fonte": "PDI 2018-2022"
  },
  "sistemas_academicos": "Espaço do Estudante (não público).",
  "alertas": [
   {
    "nivel": "alto",
    "texto": "Só existe o PDI 2018-2022 (vencido), com 60 h. O regimento do UniSENAI e o regulamento interno não estão acessíveis. Confirmar com a Secretaria."
   }
  ],
  "cursos": [
   {
    "id": "ECA",
    "nome": "Engenharia de Controle e Automação",
    "matriz": {
     "codigo": "Processo seletivo 2026-1 (3.890 h de carga total)"
    },
    "horas": {
     "valor": 60,
     "unidade": "h",
     "situacao": "historico",
     "fonte": "https://sc.senai.br/sites/default/files/inline-files/PDI_2018-2022%20-%20Faculdade%20SENAI%20Joinville.pdf",
     "nota": "O PDI fala em 60 h para a antiga Faculdade SENAI Joinville. O edital de 2026-1 não menciona horas complementares."
    },
    "pdf": [
     "SENAI/SENAI_Faculdade_Tecnologia_SENAI_Joinville_PDI_2018-2022.pdf",
     "SENAI/UniSENAI_SC_Edital33_Graduacoes_diferenciadas_2025.pdf"
    ],
    "a_confirmar": [
     "A carga de 60 h vem de PDI vencido e da antiga Faculdade SENAI Joinville."
    ]
   }
  ]
 },
 {
  "id": "senac",
  "nome": "Senac Joinville (unidade vinculada à Faculdade de Tecnologia Senac Blumenau)",
  "sigla": "Senac",
  "tipo": "faculdade",
  "campus": "Joinville",
  "pasta_documentos": "Senac",
  "requisito_nome": "Não aparece como componente",
  "resumo": "Não existe Faculdade Senac Joinville credenciada: a unidade é vinculada à Faculdade de Tecnologia Senac Blumenau. O Manual do Aluno de Graduação 2023 não traz atividades complementares.",
  "normas": [
   {
    "id": "manual-2023",
    "numero": "Manual do Aluno de Graduação Senac/SC (2023)",
    "data": "2023",
    "status": "vigente",
    "nota": "Não traz atividades complementares entre os componentes. Traz extensão curricularizada (no mínimo 10%), projeto integrador e certificações intermediárias. Um manual mais antigo, visto só em cópia não oficial, dizia que as AC eram obrigatórias em todos os cursos.",
    "url": "https://portal.sc.senac.br/doc/area-do-estudante/Manual-Aluno-Graduacao.pdf",
    "pdf": "Senac/Senac_SC_Manual_do_Aluno_Graduacao.pdf"
   }
  ],
  "regras_gerais": [],
  "como_enviar": {
   "sistema": "Não se aplica pelo manual de 2023",
   "prazo": "Não se aplica",
   "quem_aprova": "Não se aplica",
   "taxa": "Não se aplica",
   "fonte": "Manual 2023"
  },
  "extensao": {
   "mesma_hora_conta_nas_duas": "nao_se_aplica",
   "regra": "Sem AC no manual vigente; a extensão curricularizada é de no mínimo 10%.",
   "fonte": "Manual 2023"
  },
  "sistemas_academicos": "Não identificado.",
  "alertas": [
   {
    "nivel": "medio",
    "texto": "Conclusão provável: os CSTs atuais não exigem AC, mas isso só se confirma no PPC de cada curso."
   }
  ],
  "cursos": [
   {
    "id": "ADS",
    "nome": "CST em Análise e Desenvolvimento de Sistemas",
    "matriz": {
     "codigo": "Edital 01/2025 (vestibular 2025/1)"
    },
    "horas": {
     "valor": null,
     "unidade": null,
     "situacao": "nao_publicado",
     "fonte": "https://vestibular.sc.senac.br/doc/edital8.pdf",
     "nota": "Nenhuma carga publicada."
    },
    "pdf": [
     "Senac/Senac_SC_Manual_do_Aluno_Graduacao.pdf",
     "Senac/Senac_SC_Edital_01-2025_Vestibular_2025-1_CST.pdf"
    ],
    "a_confirmar": [
     "Confirmar no PPC se há AC."
    ]
   },
   {
    "id": "PG",
    "nome": "CST em Processos Gerenciais",
    "matriz": {
     "codigo": "Edital 01/2025 (vestibular 2025/1)"
    },
    "horas": {
     "valor": null,
     "unidade": null,
     "situacao": "nao_publicado",
     "fonte": "https://vestibular.sc.senac.br/doc/edital8.pdf",
     "nota": "Nenhuma carga publicada."
    },
    "pdf": [
     "Senac/Senac_SC_Manual_do_Aluno_Graduacao.pdf",
     "Senac/Senac_SC_Edital_01-2025_Vestibular_2025-1_CST.pdf"
    ],
    "a_confirmar": [
     "Confirmar no PPC se há AC."
    ]
   }
  ]
 },
 {
  "id": "ead_polos",
  "nome": "EaD com polo em Joinville",
  "sigla": "EaD",
  "tipo": "ead",
  "campus": "Polos em Joinville",
  "pasta_documentos": "EaD polos Joinville",
  "requisito_nome": "AC, ACO (Cogna), AAC (Estácio)",
  "resumo": "O aluno de polo segue o regulamento da instituição credenciadora, não do polo, quase sempre no AVA. A presença dos polos em Joinville foi levantada em agregadores e numa notícia da UNINTER, sem confirmação no e-MEC.",
  "normas": [
   {
    "id": "unicesumar-rac",
    "numero": "Regulamento de Atividades Complementares (RAC) da UniCesumar",
    "data": "2024-04-19",
    "status": "vigente",
    "nota": "Presencial e EaD. Exige pelo menos 30% da carga em cada uma de três categorias. Tabela: evento científico 30 h; curso de extensão 20 h; palestra nacional 10 h; monitoria 20 h; estágio não obrigatório 40 h; livro publicado 40 h; ação social, comunitária ou extensionista 20 h. Resultado: CUMPRIDO ou NÃO CUMPRIDO.",
    "url": "https://aluno.unicesumar.edu.br/lyceump/aonline/ti/docs/RAC_Mga.pdf",
    "pdf": "EaD polos Joinville/UNICESUMAR_Regulamento_Atividades_Complementares_RAC_Mga.pdf"
   },
   {
    "id": "cogna-aco",
    "numero": "Regras Gerais das ACO (Cogna: Anhanguera, Unopar, Ampli)",
    "data": "2026-06-10",
    "status": "vigente",
    "nota": "Um certificado por solicitação; no máximo 40 h por certificado; mesário 8 h por turno. Recusa certificados de pessoa física, de estágio obrigatório e de atividades anteriores ao ingresso.",
    "url": "https://ampli.zendesk.com/hc/pt-br/articles/4427267966228--Gradua%C3%A7%C3%A3o-Regras-Gerais-das-Atividades-complementares-ACO",
    "pdf": "EaD polos Joinville/COGNA-AMPLI_Regras_Gerais_Atividades_Complementares_ACO_Zendesk_2026-06.pdf"
   },
   {
    "id": "estacio-manual",
    "numero": "Manual do Aluno de Graduação Estácio 2022.1 (AAC)",
    "data": "2022",
    "status": "desatualizada",
    "nota": "AAC recebidas no SIA. Lançamento: SIA > Atendimento > Requerimento > \"Lançar horas de atividades\".",
    "url": "https://sia.estacio.br/alu/doc/manual_graduacao_ESTACIO.pdf",
    "pdf": "EaD polos Joinville/ESTACIO_Manual_do_Aluno_Graduacao_2022-1.pdf"
   }
  ],
  "regras_gerais": [],
  "como_enviar": {
   "sistema": "AVA de cada grupo: Studeo (UniCesumar), AVA/Leo App (UNIASSELVI), AVA Cogna, SIA (Estácio)",
   "prazo": "UniCesumar EaD: documentação até o fim do curso",
   "quem_aprova": "IES credenciadora",
   "taxa": "Não informada",
   "fonte": "Regulamentos de cada credenciadora"
  },
  "extensao": {
   "mesma_hora_conta_nas_duas": "a_confirmar",
   "regra": "UniCesumar: a tabela traz \"ação social, comunitária ou extensionista – 20 h\", mas o blog oficial diz que atividades de extensão não podem ser protocoladas como horas complementares; a leitura provável é que a proibição vale para a extensão curricularizada.",
   "fonte": "RAC UniCesumar; blog UniCesumar"
  },
  "sistemas_academicos": "Studeo, AVA UNIASSELVI/Leo App, AVA Cogna, SIA (Estácio).",
  "alertas": [
   {
    "nivel": "alto",
    "texto": "Polos em Joinville não confirmados no e-MEC. O regulamento que vale é o da credenciadora do seu curso, no AVA."
   },
   {
    "nivel": "medio",
    "texto": "Estácio: o teto de 50% de horas externas aparece com e sem exceção para EaD. UNINTER só tem manual de 2015. Cruzeiro do Sul (bloqueado, erro 403) e UNIP (sem documento oficial acessível) não foram lidas."
   }
  ],
  "cursos": [
   {
    "id": "UNICESUMAR",
    "nome": "UniCesumar (EaD e presencial)",
    "matriz": {
     "codigo": "RAC de 19/04/2024"
    },
    "horas": {
     "valor": null,
     "unidade": null,
     "situacao": "nao_publicado",
     "fonte": "https://aluno.unicesumar.edu.br/lyceump/aonline/ti/docs/RAC_Mga.pdf",
     "nota": "Total por matriz. Tabela de 10 a 40 h por atividade; mínimo de 30% em cada uma de três categorias."
    },
    "pdf": [
     "EaD polos Joinville/UNICESUMAR_Regulamento_Atividades_Complementares_RAC_Mga.pdf",
     "EaD polos Joinville/UNICESUMAR_Conexao_2020_envio_atividades_complementares.pdf",
     "EaD polos Joinville/UNICESUMAR_Guia_Academico_2021.pdf"
    ],
    "norma_aplicavel": "unicesumar-rac",
    "a_confirmar": [
     "O total de horas depende da matriz de cada curso."
    ],
    "como_enviar_curso": "Studeo > Serviços > Envio de atividade complementar (desde set/2020)."
   },
   {
    "id": "COGNA",
    "nome": "Cogna (Anhanguera, Unopar, Ampli)",
    "matriz": {
     "codigo": "ACO, regras de 10/06/2026"
    },
    "horas": {
     "valor": null,
     "unidade": null,
     "situacao": "nao_publicado",
     "fonte": "https://ampli.zendesk.com/hc/pt-br/articles/4427267966228--Gradua%C3%A7%C3%A3o-Regras-Gerais-das-Atividades-complementares-ACO",
     "nota": "Total por matriz. Teto de 40 h por certificado."
    },
    "pdf": [
     "EaD polos Joinville/COGNA-AMPLI_Regras_Gerais_Atividades_Complementares_ACO_Zendesk_2026-06.pdf"
    ],
    "norma_aplicavel": "cogna-aco",
    "a_confirmar": [
     "As regras da Ampli valem igualmente para alunos Unopar/Anhanguera do AVA Colaborar? É provável, por serem do mesmo grupo, mas não foi confirmado."
    ]
   },
   {
    "id": "UNIASSELVI",
    "nome": "UNIASSELVI",
    "matriz": {
     "codigo": "Guia do Estudante 2026 e Manual Indaial 2025.1"
    },
    "horas": {
     "valor": null,
     "unidade": null,
     "situacao": "nao_publicado",
     "fonte": "https://www.uniasselvi.com.br/extranet/o-2.0/download/arqu_download.php?link=301258",
     "nota": "A tabela de horas só existe dentro do AVA."
    },
    "pdf": [
     "EaD polos Joinville/UNIASSELVI_Guia_do_Estudante_Graduacao_Presencial_2026.pdf",
     "EaD polos Joinville/UNIASSELVI_Manual_do_Academico_Indaial_2025-1.pdf"
    ],
    "a_confirmar": [
     "Envio: AVA ou Leo App (Semestres > Atividades Complementares > Incluir). Tabela de horas só no AVA."
    ]
   },
   {
    "id": "ESTACIO",
    "nome": "Estácio (AAC)",
    "matriz": {
     "codigo": "Manual 2022.1"
    },
    "horas": {
     "valor": null,
     "unidade": null,
     "situacao": "nao_publicado",
     "fonte": "https://sia.estacio.br/alu/doc/manual_graduacao_ESTACIO.pdf"
    },
    "pdf": [
     "EaD polos Joinville/ESTACIO_Manual_do_Aluno_Graduacao_2022-1.pdf",
     "EaD polos Joinville/ESTACIO-WYDEN_FACI_Regimento_Regulamento_AAC_2025.pdf",
     "EaD polos Joinville/ESTACIO_Regulamento_AAC_2008.pdf"
    ],
    "norma_aplicavel": "estacio-manual",
    "alertas": [
     {
      "nivel": "medio",
      "texto": "Teto de 50% de horas externas com e sem exceção para EaD (modelo YDUQS visto na Faculdade Ideal Wyden). O Regulamento AAC de 2008 é obsoleto."
     }
    ]
   },
   {
    "id": "UNINTER",
    "nome": "UNINTER",
    "matriz": {
     "codigo": "Manual do 1º semestre de 2015"
    },
    "horas": {
     "valor": null,
     "unidade": null,
     "situacao": "nao_publicado",
     "fonte": "https://portal.uninter.com/wp-content/uploads/2015/03/MANUAL-DO-ALUNO-1%C2%B0-SEMESTRE-2015.pdf",
     "nota": "Segundo o manual de 2015, as AC são opcionais nos cursos de tecnologia."
    },
    "pdf": [
     "EaD polos Joinville/UNINTER_Manual_do_Aluno_1sem_2015.pdf"
    ],
    "a_confirmar": [
     "Só existe o manual de 2015, e um texto de blog de 2026 que remete a carga ao projeto pedagógico."
    ],
    "alertas": [
     {
      "nivel": "medio",
      "texto": "Documento antigo (2015)."
     }
    ]
   },
   {
    "id": "CRUZEIRO",
    "nome": "Cruzeiro do Sul",
    "matriz": {
     "codigo": "Não lida"
    },
    "horas": {
     "valor": null,
     "unidade": null,
     "situacao": "nao_verificado",
     "fonte": "",
     "nota": "Documentos bloqueados (erro 403)."
    },
    "pdf": [],
    "a_confirmar": [
     "Documentos bloqueados na pesquisa."
    ]
   },
   {
    "id": "UNIP",
    "nome": "UNIP",
    "matriz": {
     "codigo": "Não localizada"
    },
    "horas": {
     "valor": null,
     "unidade": null,
     "situacao": "nao_publicado",
     "fonte": "",
     "nota": "Sem documento oficial acessível."
    },
    "pdf": [],
    "a_confirmar": [
     "Sem documento oficial acessível."
    ]
   }
  ]
 },
 {
  "id": "sem_norma_publica",
  "nome": "Life Unic e Anhanguera Joinville (presencial)",
  "sigla": "Sem norma",
  "tipo": "faculdade",
  "campus": "Joinville",
  "pasta_documentos": "",
  "requisito_nome": "Não localizado",
  "resumo": "A Faculdade Life Unic Education oferece Medicina (Portaria SERES 742/2024, 54 vagas anuais). A situação presencial da Faculdade Anhanguera de Joinville não foi confirmada no e-MEC. Nenhuma das duas publica regulamento de atividades complementares.",
  "normas": [],
  "regras_gerais": [],
  "como_enviar": {
   "sistema": "Não localizado",
   "prazo": "Não localizado",
   "quem_aprova": "Não localizado",
   "taxa": "Não localizado",
   "fonte": "Relatório de pesquisa"
  },
  "extensao": {
   "mesma_hora_conta_nas_duas": "a_confirmar",
   "regra": "Não localizado.",
   "fonte": ""
  },
  "sistemas_academicos": "Não localizado.",
  "alertas": [
   {
    "nivel": "alto",
    "texto": "Nenhuma norma pública de atividades complementares. Pergunte à secretaria da sua faculdade."
   }
  ],
  "cursos": [
   {
    "id": "LIFE-MED",
    "nome": "Life Unic Education: Medicina",
    "matriz": {
     "codigo": "Não localizada"
    },
    "horas": {
     "valor": null,
     "unidade": null,
     "situacao": "nao_publicado",
     "fonte": "https://www.gov.br/mec/pt-br/cne/2025/novembro-2025/pces659_25.pdf"
    },
    "pdf": [],
    "a_confirmar": [
     "Nenhum arquivo baixado."
    ]
   },
   {
    "id": "ANH",
    "nome": "Faculdade Anhanguera de Joinville (presencial)",
    "matriz": {
     "codigo": "Não localizada"
    },
    "horas": {
     "valor": null,
     "unidade": null,
     "situacao": "nao_publicado",
     "fonte": "https://www.gov.br/mec/pt-br/cne/pdf/pareceres-do-cne/ces/2017/pces570_17.pdf"
    },
    "pdf": [],
    "a_confirmar": [
     "Nenhum arquivo baixado."
    ]
   }
  ]
 }
];
