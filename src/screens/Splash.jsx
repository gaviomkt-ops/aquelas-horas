import { Logo } from '../components/ui.jsx';

export default function Splash() {
  return (
    <div className="splash">
      <Logo height={120} />
      <span className="spinner spinner-dark" />
    </div>
  );
}
