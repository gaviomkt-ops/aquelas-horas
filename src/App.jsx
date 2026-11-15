import { HashRouter, Routes, Route, Navigate, NavLink, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { useStore } from './lib/store.jsx';
import { isDemo } from './lib/backend/index.js';
import { Icon, Toast } from './components/ui.jsx';
import Auth from './screens/Auth.jsx';
import Onboarding from './screens/Onboarding.jsx';
import Home from './screens/Home.jsx';
import Explore from './screens/Explore.jsx';
import EventDetail from './screens/EventDetail.jsx';
import Vault from './screens/Vault.jsx';
import Agenda from './screens/Agenda.jsx';
import Profile from './screens/Profile.jsx';
import Report from './screens/Report.jsx';
import OrgHome from './screens/OrgHome.jsx';
import EventForm from './screens/EventForm.jsx';
import Admin from './screens/Admin.jsx';
import { Privacy, Terms } from './screens/Legal.jsx';
import Splash from './screens/Splash.jsx';
import NewPassword from './screens/NewPassword.jsx';
import Regras from './screens/Regras.jsx';
import RegrasFicha from './screens/RegrasFicha.jsx';
import Secretaria from './screens/Secretaria.jsx';

const STUDENT_TABS = [
  { to: '/', label: 'Início', icon: 'House', end: true },
  { to: '/explorar', label: 'Eventos', icon: 'Sparkles' },
  { to: '/cofre', label: 'Cofre', icon: 'ShieldCheck', main: true },
  { to: '/agenda', label: 'Agenda', icon: 'CalendarDays' },
  { to: '/perfil', label: 'Perfil', icon: 'UserRound' },
];
const ORG_TABS = [
  { to: '/', label: 'Meus eventos', icon: 'LayoutDashboard', end: true },
  { to: '/explorar', label: 'Vitrine', icon: 'Sparkles' },
  { to: '/evento/novo', label: 'Criar', icon: 'Plus', main: true },
  { to: '/perfil', label: 'Perfil', icon: 'UserRound' },
];
const ADMIN_TABS = [
  { to: '/', label: 'Painel', icon: 'Gauge', end: true },
  { to: '/explorar', label: 'Vitrine', icon: 'Sparkles' },
  { to: '/evento/novo', label: 'Criar', icon: 'Plus', main: true },
  { to: '/perfil', label: 'Perfil', icon: 'UserRound' },
];

const SECRETARIA_TABS = [
  { to: '/', label: 'Painel', icon: 'ListChecks', end: true },
  { to: '/regras', label: 'Regras', icon: 'ScrollText' },
  { to: '/perfil', label: 'Perfil', icon: 'UserRound' },
];

function ScrollTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function TabBar({ tabs }) {
  return (
    <nav className="tabbar" aria-label="Navegação principal">
      {tabs.map((t) => (
        <NavLink key={t.to} to={t.to} end={t.end} className={({ isActive }) => `tab ${isActive ? 'tab-on' : ''} ${t.main ? 'tab-main' : ''}`}>
          <span className="tab-ic">
            <Icon name={t.icon} size={t.main ? 24 : 22} />
          </span>
          <span className="tab-label">{t.label}</span>
        </NavLink>
      ))}
    </nav>
  );
}

function DemoBanner() {
  if (!isDemo) return null;
  return (
    <div className="demo-banner">
      <Icon name="FlaskConical" size={14} /> Modo demonstração: os dados ficam só neste navegador.
    </div>
  );
}

function Shell() {
  const { user, profile, loading, recovery } = useStore();
  if (loading || user === undefined) return <Splash />;
  if (user && recovery) return <NewPassword />;

  // páginas abertas a qualquer pessoa
  const publicRoutes = (
    <>
      <Route path="/privacidade" element={<Privacy />} />
      <Route path="/termos" element={<Terms />} />
      <Route path="/regras" element={<Regras />} />
      <Route path="/regras/:instId" element={<RegrasFicha />} />
    </>
  );

  if (!user) {
    return (
      <Routes>
        {publicRoutes}
        <Route path="/evento/:id" element={<EventDetail />} />
        <Route path="/explorar" element={<Explore guest />} />
        <Route path="*" element={<Auth />} />
      </Routes>
    );
  }

  if (!profile) return <Splash />;

  // primeira senha é a data de nascimento: só libera o app depois de criar uma senha nova
  if (profile.password_set === false) return <NewPassword firstAccess />;

  if (!profile.onboarded) {
    return (
      <Routes>
        {publicRoutes}
        <Route path="*" element={<Onboarding />} />
      </Routes>
    );
  }

  const role = profile.role;
  const tabs = role === 'admin' ? ADMIN_TABS : role === 'organizer' ? ORG_TABS : role === 'secretaria' ? SECRETARIA_TABS : STUDENT_TABS;

  return (
    <>
      <main className="app-main">
        <Routes>
          {publicRoutes}
          <Route path="/explorar" element={<Explore />} />
          <Route path="/evento/novo" element={role === 'student' || role === 'secretaria' ? <Navigate to="/" /> : <EventForm />} />
          <Route path="/evento/:id/editar" element={role === 'student' || role === 'secretaria' ? <Navigate to="/" /> : <EventForm />} />
          <Route path="/evento/:id" element={<EventDetail />} />
          <Route path="/perfil" element={<Profile />} />
          {role === 'student' && (
            <>
              <Route path="/" element={<Home />} />
              <Route path="/cofre" element={<Vault />} />
              <Route path="/agenda" element={<Agenda />} />
              <Route path="/relatorio" element={<Report />} />
            </>
          )}
          {role === 'organizer' && <Route path="/" element={<OrgHome />} />}
          {role === 'admin' && <Route path="/" element={<Admin />} />}
          {role === 'admin' && <Route path="/secretaria" element={<Secretaria />} />}
          {role === 'secretaria' && <Route path="/" element={<Secretaria />} />}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <TabBar tabs={tabs} />
    </>
  );
}

export default function App() {
  return (
    <HashRouter>
      <ScrollTop />
      <DemoBanner />
      <Shell />
      <Toast />
    </HashRouter>
  );
}
