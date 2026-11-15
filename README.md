# Àquelas Horas · Web App

Hub de eficiência acadêmico: cofre de certificados, progresso das horas complementares pela tabela do curso e vitrine de eventos que valem horas (no estilo do app Joyn, mas para o público universitário).

## O que o app faz

**Universitário**
- Cria conta com e-mail e senha, aceita os termos e escolhe instituição, curso e semestre.
- **Cofre digital:** guarda foto ou PDF do certificado, com tipo de atividade, carga horária, data, emissor e situação (guardado, entregue, validado ou recusado).
- **Progresso automático:** aplica a tabela do curso. Respeita o teto de cada categoria, o limite por item (ex.: 30h por trabalho apresentado) e a meta total. Mostra quanto falta, o que já foi validado e quantas horas ficaram fora do limite.
- **Leitura automática:** ao enviar o PDF ou a foto, o app lê o certificado no próprio aparelho (texto do PDF ou OCR em português) e preenche nome, tipo de atividade, carga horária, data e emissor. Os campos preenchidos ficam destacados para o aluno conferir. Regras em `src/lib/certParse.js`, com testes.
- **Requisitos para validação:** depois da leitura, um checklist mostra se o certificado tem o que a coordenação exige (modelo: certificado do 8º Comunicathon): nome do participante, nome da atividade, tipo de participação, data ou período, instituição, carga horária e assinatura com nome e cargo; o código de verificação é recomendado. O que faltar fica marcado no cofre ("Falta no certificado: …").
- Antes de salvar, avisa quanto aquele certificado vai somar.
- **Vitrine de eventos:** carrossel "Em alta" (eventos impulsionados), categorias, busca, calendário e filtros "Gratuitos" e "Contam pro meu curso". Cada evento mostra quantas horas vale *para aquele aluno*, já descontado o teto da categoria.
- "Vou", "Salvar", compartilhar, link de inscrição e "Já participei: guardar certificado" (o formulário já vem preenchido).
- Agenda com os eventos marcados, os salvos e os que já passaram.
- **Relatório acadêmico** pronto para imprimir ou salvar em PDF.
- Excluir a própria conta (LGPD).

**Organizador de eventos**
- Cadastro que passa por aprovação da equipe.
- Cria e edita eventos com capa, categoria, horas, datas, local, preço, vagas, pré-requisitos, link e cursos indicados.
- Seção **Certificado** obrigatória: instituição responsável, quem assina (com titulação) e cargo, tipo de participação e forma de entrega, com checklist e **prévia do certificado** no padrão do Comunicathon. A prévia também aparece para o aluno na página do evento, já com o nome dele.
- Painel com visualizações, cliques na inscrição, "vou" e salvos.
- Botão **Impulsionar**, que envia um pedido de destaque. O pagamento é combinado por fora, porque o app não cobra.

**Admin (equipe)**
- Números para a banca: universitários, cadastros do dia, certificados, horas guardadas, organizadores, eventos e marcações "vou".
- Aprova ou recusa organizadores e eventos (com motivo), tira evento do ar e liga ou desliga destaque por N dias.

## Regras de horas incluídas
- **Faculdade IELUSC:** tabela de equivalência de ACGs (complemento da Resolução CES nº 35/2019) com os 10 cursos: ADM 130h, DIR 150h, EDF 200h, ENF 130h, FONO 160h, NUT 180h, JOR 120h, PSICO 120h, PP 200h e SIST 180h. Inclui os limites por item (30h por apresentação, 5h por concurso, 40h por publicação, 10h ou 20h por semestre como representante) e as regras próprias de Direito.
- **Mackenzie, Jornalismo:** anexo do regulamento (300h, com códigos 51 a 76).
- **Outra instituição:** o aluno informa a meta e usa categorias genéricas, sem teto.

Os dados ficam em `src/lib/rules.js`. Para adicionar um curso ou uma faculdade, basta copiar o formato. Os testes ficam em `src/lib/progress.test.js` e rodam com `npm test`.

> Confira com a coordenação se a tabela CES 35/2019 é a versão vigente na IELUSC. O app avisa ao aluno que a validação oficial é da faculdade.

---

## 1. Rodar no computador (modo demonstração)

```bash
cd ~/Developer/aquelas-horas
npm install
npm run dev
```

Abra http://localhost:5180. Sem configurar nada, o app roda em **modo demonstração**: tudo fica salvo só no navegador e a vitrine mostra os eventos reais de `src/lib/seed.js`. Há três contas de teste na tela de login: aluno, organizador e admin, todas com a senha `demo123`.

## 2. Ligar o servidor de verdade (Supabase, grátis)

Sem servidor, quem escanear o QR Code no campus fica com os dados presos no próprio celular e vocês não enxergam os números. Para ter cadastros reais:

1. Crie uma conta em https://supabase.com e um projeto novo (plano Free, região São Paulo).
2. No projeto, abra **SQL Editor > New query**, cole o conteúdo de `supabase/schema.sql` e clique em **Run**.
3. Em **Authentication > Sign In / Providers > Email**, desligue **Confirm email** para a ação do campus: assim o aluno entra direto, sem precisar abrir o e-mail. Pode religar depois.
4. Em **Project Settings > API**, copie a *Project URL* e a chave *anon public*.
5. Na pasta do projeto, copie `.env.example` para `.env.local` e preencha:
   ```
   VITE_SUPABASE_URL=https://xxxx.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJ...
   ```
6. Rode `npm run dev` de novo. A faixa "Modo demonstração" some.
7. Crie sua conta pelo app e, no SQL Editor, rode (com o seu e-mail):
   ```sql
   update public.profiles set role = 'admin', onboarded = true where email = 'seu-email@exemplo.com';
   ```
   Saia e entre de novo: você verá o **Painel** do admin.
8. Ainda no SQL Editor, rode `supabase/eventos-iniciais.sql` para publicar os eventos reais da vitrine (Bancas de TCC de PP 16, 17 e 18/11, oficina da APP Brasil e Picture 10 anos). Se mudar a lista em `src/lib/seed.js`, gere o arquivo de novo com `node scripts/gerar-sql-eventos.mjs`.

A segurança está no próprio banco (Row Level Security): cada aluno só vê os próprios certificados, o organizador só edita os próprios eventos e só o admin aprova. A chave *anon* pode ficar no site, porque foi feita para isso.

## 3. Publicar na internet

```bash
npm run build
```

A pasta `dist/` é o site pronto. O jeito mais rápido é o **Netlify Drop**: acesse https://app.netlify.com/drop e arraste a pasta `dist`. Ele devolve um link `https://….netlify.app`, que pode virar o QR Code. Vercel e GitHub Pages também funcionam (o app usa rotas com `#`, então não precisa de configuração extra).

Depois de publicar, em **Supabase > Authentication > URL Configuration**, coloque o link do site em *Site URL* (é o que faz o link de "esqueci a senha" funcionar).

No celular, o aluno pode usar **Adicionar à tela de início**: o app abre como aplicativo, com ícone próprio.

## 4. Lançamento para 200 pessoas: checklist

**No painel do Supabase (antes do dia 19/11)**
- [ ] Rodar `schema.sql` (versão atual, com os limites de segurança) e depois `eventos-iniciais.sql`.
- [ ] **Authentication > Rate Limits:** aumentar o limite de cadastro e login por endereço de IP. No campus, todo mundo sai pelo mesmo Wi-Fi e cai no mesmo limite; com o padrão, os cadastros travam no meio da ação.
- [ ] **Authentication > Sign In / Providers > Email:** desligar "Confirm email" só durante a ação; religar depois.
- [ ] **Authentication > Policies / Password:** senha mínima de 8 caracteres (o app já exige; o painel garante no servidor).
- [ ] **Authentication > URL Configuration:** Site URL = link publicado; incluir o mesmo link em Redirect URLs (para "esqueci a senha").
- [ ] **Authentication > Emails > SMTP:** o envio padrão do Supabase manda poucos e-mails por hora. Para "esqueci a senha" funcionar com 200 pessoas, configurar um SMTP próprio (ex.: Resend, plano grátis).
- [ ] **Storage:** conferir os buckets `certificates` (privado, 10 MB, imagens e PDF) e `event-images` (público, 5 MB, imagens).
- [ ] **Database > Advisors (Security Advisor):** rodar e zerar os avisos.
- [ ] Opcional: **Authentication > Attack Protection > CAPTCHA (Cloudflare Turnstile)** contra cadastro em massa por robô (exige uma pequena mudança no código).

**No app**
- [ ] Sua conta promovida a admin.
- [ ] Organizadores só aprovados depois de confirmar a identidade por fora (e-mail oficial ou Instagram): sem confirmação de e-mail, alguém pode se cadastrar com o e-mail de outra pessoa.
- [ ] Site publicado e QR Code apontando para ele (teste com 2 ou 3 celulares diferentes, iPhone incluso).
- [ ] Um certificado de teste guardado, para a demonstração ao vivo.
- [ ] Na hora da banca: Painel > Números para mostrar os cadastros do dia e o espaço usado.

**Capacidade (plano grátis do Supabase):** até 50 mil usuários ativos por mês, 500 MB de banco e 1 GB de arquivos. Para 200 pessoas o gargalo é o espaço de arquivos: as fotos são reduzidas para cerca de 300 KB antes do envio, e o painel do admin avisa quando passar de 75% do espaço. O projeto grátis pausa depois de 7 dias sem uso e não tem backup automático: exporte os dados (Database > Backups ou `pg_dump`) depois da ação.

## 5. Segurança

O código do site é público por natureza (todo site entrega o código ao navegador). Os dados ficam protegidos no banco: cada consulta passa pelas regras de Row Level Security de `supabase/schema.sql`. Revisão feita em 15/11/2026 (banca de revisão + revisor "hacker" independente):

- **Corrigido:** link de inscrição `javascript:` que rodaria código no app (bloqueado no app e no banco); PDF malicioso explorando o pdf.js (CVE-2024-4367, fechado com `isEvalSupported: false`); visualizações e cliques infláveis por robô (agora só usuário logado, uma vez por dia); upload em massa para lotar o armazenamento (só arquivo de certificado existente, até 300 por pessoa); capa de evento apontando para site externo; organizador trocando o nome da organização sem nova análise; data de aceite dos termos reescrevível; textos gigantes (limites de tamanho em todas as tabelas); funções privilegiadas sem `revoke`; senha fraca; tela de "nova senha" que faltava.
- **Política de segurança de conteúdo (CSP)** no site publicado: o navegador só carrega script e só conversa com o próprio site, o Supabase e o jsDelivr (OCR).
- **Verificado e seguro:** ninguém vira admin nem se aprova como organizador; ninguém lê certificado, arquivo ou e-mail de outra pessoa; organizador não aprova nem impulsiona o próprio evento; nenhum segredo no código.
- **Pendências conhecidas:** `npm audit` ainda aponta o pdf.js 3.11 (mitigado como acima; a versão 4 travou ao desenhar páginas nos testes) e um aviso moderado do react-router sobre redirecionamento por `<Link>` com endereço vindo do usuário, que o app não usa.
- **Segunda opinião recomendada:** plugin Claude Security (`/plugin install claude-security@claude-plugins-official` e depois `/claude-security`).

## Limitações conhecidas (MVP)
- O app não cobra o "Impulsionar": o pedido chega no painel e o pagamento é combinado por fora.
- Ainda não há notificações push nem login com Google.
- A leitura automática acerta bem em certificados digitais; foto torta, escura ou com letra cursiva pode vir incompleta (o aluno completa à mão). Na primeira leitura por foto, o app baixa cerca de 10 MB (modelo de português do OCR).
- A coordenação ainda não valida dentro do app: o aluno marca a situação manualmente.
- O modo demonstração guarda tudo só no navegador daquele aparelho.

## Estrutura
```
src/
  lib/rules.js         tabelas de horas por instituição e curso
  lib/progress.js      cálculo de tetos, limites e meta (com testes)
  lib/backend/         local.js (demo) e supabase.js (online), mesma interface
  screens/             telas (Auth, Onboarding, Home, Explore, EventDetail, Vault, …)
  components/          UI, cards de evento, carrossel, ícones
supabase/schema.sql    banco, regras de segurança, storage e funções
```

## Catálogo de regulamentos de horas complementares (Joinville-SC)

Base de dados com as regras de ACG/AC de 14 grupos de instituições de Joinville (IELUSC, Univille, UDESC CCT, UFSC, IFSC, Católica SC, Unisociesc, FGG, CNEC, Censupeg, UniSENAI, Senac, EaD com polo e "sem norma pública"). Pesquisa de 15/11/2026 em fontes oficiais; o e-MEC bloqueou a consulta automática, então a lista pode estar incompleta.

- **Dados:** `src/data/acg/*.json` (um por instituição; IELUSC, UDESC e UFSC à mão; Univille por `scripts/gerar-univille.mjs`; as demais por `scripts/gerar-privadas.mjs`). Um registro por curso e matriz, com horas + unidade + fonte, norma e status, como enviar, relação com a extensão, alertas e `a_confirmar`. Os caminhos dos PDFs apontam para `documentos/` da pasta da pesquisa (`~/Documents/Horas complementares Joinville/aquelas horas/`); o app abre o PDF pela URL de origem, os 318 MB não vão para o repositório público.
- **Depois de editar:** `node scripts/validar-catalogo.mjs && node scripts/montar-catalogo.mjs` (valida o esquema e se cada PDF existe; gera `catalogo.generated.js`, que o app importa).
- **Regra de qualidade:** nenhum número sem fonte. Incerteza vira `situacao` (a_confirmar, contraditorio, historico, lido_so_no_buscador, nao_publicado…), `a_confirmar` ou `alertas`, e aparece na tela. A meta de horas só vira automática quando é número confiável em horas; senão o aluno digita.
- **Telas:** `/regras` (busca por instituição, curso e ano de ingresso) e `/regras/:instituicao?curso=ID` (ficha com alertas, normas, como enviar, extensão e botão do PDF oficial). O cadastro (e o Perfil) pedem o **ano de ingresso** e listam as matrizes que podem valer.
- **Banco:** rodar `supabase/migracao-2026-11-15-ano-ingresso.sql` (coluna `profiles.entry_year`) antes de publicar. Sem ela o app não trava: salva o resto do perfil.
- **IELUSC:** o cálculo de tetos do app ainda usa a Res. CES 35/2019 (revogada). A Res. CES 53/2026 e a Tabela 2026 estão no catálogo (ficha mostra os tetos por curso); trocar o cálculo é uma decisão pendente.

## Aba Secretaria (piloto IELUSC)

- **O que faz:** a secretaria acadêmica vê os alunos da própria faculdade que autorizaram o compartilhamento, filtra por curso, ano de ingresso, turma e situação, abre o arquivo do certificado, valida ou recusa (com motivo que o aluno vê) e baixa duas planilhas CSV com o filtro aplicado: certificados (uma linha por certificado) e resumo por aluno (meta, horas que contam, validadas, pendentes). Status "validado/recusado" marcados pelo próprio aluno aparecem como "(informado pelo aluno)".
- **Privacidade (no banco, via RLS):** só alunos da mesma instituição com `secretaria_consent_at` preenchido; só certificados com status diferente de `guardado` e seus arquivos; a secretaria só altera status e observação; se o aluno mexer num certificado já avaliado, ele volta para "Aguardando análise"; trocar de instituição revoga a autorização. O aluno autoriza e revoga no Perfil (com matrícula e turma opcionais).
- **Ligar no Supabase:** rodar `supabase/migracao-2026-11-15-ano-ingresso.sql` e depois `supabase/migracao-2026-11-15-secretaria.sql`. Criar a conta: a pessoa se cadastra no app e um admin roda `update public.profiles set role = 'secretaria', institution_id = 'ielusc', onboarded = true where email = '...';`.
- **Outras faculdades:** acrescentar o id em `SECRETARIA_PILOTO` (`src/lib/secretaria.js`) depois de combinar com a secretaria delas.
- **Demo:** botão "Secretaria" nas contas de teste (`secretaria@demo.com`).
