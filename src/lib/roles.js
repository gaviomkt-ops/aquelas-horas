// Papéis e o que cada um pode fazer no app.
// O banco (supabase/*.sql) é quem garante as permissões; aqui é só para montar as telas.

export const ROLE_LABEL = {
  student: 'Universitário',
  organizer: 'Organizador',
  admin: 'Administrador',
  secretaria: 'Secretaria',
  coordenador: 'Coordenação de curso',
};

// Admin que também é aluno (tem instituição no perfil) usa cofre, progresso e agenda normalmente.
export function isStudentLike(profile) {
  return !!profile && (profile.role === 'student' || (profile.role === 'admin' && !!profile.institution_id));
}

// Qualquer pessoa com cadastro completo pode sugerir eventos; eles entram em análise.
export function canSuggestEvents(profile) {
  return !!profile && !!profile.onboarded;
}

// Situação das duas aprovações de um evento (admin + coordenação do curso).
export function approvalSteps(ev) {
  return {
    admin: !!ev?.admin_approved_at,
    coord: !!ev?.coord_approved_at,
  };
}

// Coordenador correspondente: mesma instituição e curso dentro dos cursos do evento
// (evento sem curso marcado = todos; coordenador sem curso = todos da instituição). Igual à regra do banco.
export function coordinatesEvent(profile, ev) {
  if (!profile || profile.role !== 'coordenador' || !profile.institution_id) return false;
  if (profile.institution_id !== ev?.institution_id) return false;
  const courses = ev?.courses || [];
  return courses.length === 0 || !profile.course_id || courses.includes(profile.course_id);
}
