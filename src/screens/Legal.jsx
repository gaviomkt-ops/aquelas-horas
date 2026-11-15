import { useNavigate } from 'react-router-dom';
import { Icon } from '../components/ui.jsx';

// RASCUNHO: revisar com o professor orientador ou um advogado antes de divulgar em larga escala.
function Page({ title, children }) {
  const nav = useNavigate();
  return (
    <div className="page legal">
      <button className="back-link" onClick={() => (window.history.length > 1 ? nav(-1) : nav('/'))} type="button">
        <Icon name="ChevronLeft" size={18} /> Voltar
      </button>
      <h1 className="top-title">{title}</h1>
      {children}
    </div>
  );
}

export function Privacy() {
  return (
    <Page title="Política de privacidade">
      <p>O Àquelas Horas é um projeto acadêmico em fase de teste (MVP). Esta página explica, em linguagem simples, o que fazemos com os seus dados, conforme a Lei Geral de Proteção de Dados (Lei nº 13.709/2018).</p>
      <h2>O que coletamos</h2>
      <ul>
        <li>Nome, e-mail e senha (a senha fica criptografada e ninguém da equipe tem acesso a ela).</li>
        <li>Instituição, curso e semestre, para calcular suas horas pela tabela do curso.</li>
        <li>Os certificados que você decidir guardar: arquivo, nome, carga horária, data e situação.</li>
        <li>Eventos que você marca como “Vou” ou “Salvo”. Para os organizadores mostramos só o total, nunca quem marcou.</li>
        <li>Organizadores: nome da organização, Instagram e os eventos publicados.</li>
      </ul>
      <h2>Para que usamos</h2>
      <ul>
        <li>Mostrar seu progresso, guardar seus certificados e gerar o seu relatório.</li>
        <li>Mostrar eventos que podem valer horas para o seu curso.</li>
        <li>Contar números gerais de uso (quantidade de cadastros, certificados e eventos), sem identificar ninguém.</li>
      </ul>
      <h2>Leitura automática do certificado</h2>
      <p>Quando você envia um certificado, o app lê o texto dele no seu próprio aparelho para preencher nome, carga horária, data e emissor. O conteúdo do certificado não é enviado a nenhum serviço de leitura. Na primeira vez, o app baixa de um servidor público (jsDelivr) o modelo de leitura em português (OCR), que fica guardado no aparelho. As fontes de texto vêm do Google Fonts. Esses serviços recebem apenas o endereço de acesso do seu aparelho, como qualquer site, e nenhum dado do seu cadastro.</p>
      <h2>Quem vê seus certificados</h2>
      <p>Só você. A equipe e os organizadores não têm acesso aos seus certificados. Nós não vendemos seus dados.</p>
      <p>
        <b>Secretaria da sua faculdade (opcional).</b> Nas faculdades que participam do piloto (hoje, só a Faculdade IELUSC), você pode autorizar no seu Perfil que a Secretaria Acadêmica veja seu nome, e-mail, curso, ano de ingresso, turma, matrícula e os certificados que você marcar como entregues, com os arquivos. A secretaria pode validar, recusar e exportar esses dados em planilha para o trabalho dela. Certificados só guardados no cofre nunca aparecem para ela. Você pode revogar a autorização a qualquer momento no Perfil, e ela também cai se você trocar de instituição.
      </p>
      <h2>Onde ficam</h2>
      <p>Num banco de dados com acesso protegido por login (Supabase). No modo demonstração, tudo fica apenas no seu navegador.</p>
      <h2>Seus direitos</h2>
      <p>Você pode corrigir seus dados em Perfil a qualquer momento e apagar sua conta em Perfil &gt; Excluir minha conta. Isso apaga seu perfil, seus certificados e seus arquivos.</p>
    </Page>
  );
}

export function Terms() {
  return (
    <Page title="Termos de uso">
      <p>Ao usar o Àquelas Horas, você concorda com estes termos.</p>
      <h2>O que o app faz</h2>
      <p>O app organiza seus certificados e estima quanto falta para a sua meta de horas complementares, com base na tabela de regras do seu curso. A validação oficial das horas é sempre feita pela coordenação da sua instituição. O cálculo do app serve de orientação e não substitui a análise da faculdade.</p>
      <h2>Seus certificados</h2>
      <p>Guarde apenas documentos verdadeiros e seus. Você continua responsável por entregar os comprovantes originais quando a faculdade pedir.</p>
      <h2>Eventos</h2>
      <p>Os eventos são publicados por organizadores e revisados pela equipe. A carga horária, o preço e o certificado são de responsabilidade de quem organiza. Confira as informações no link de inscrição.</p>
      <h2>Fase de teste</h2>
      <p>Este é um MVP em teste. Podem acontecer erros e mudanças. Guarde também uma cópia dos certificados importantes.</p>
    </Page>
  );
}
