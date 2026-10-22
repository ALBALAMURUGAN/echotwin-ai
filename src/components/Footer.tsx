import { Link } from 'react-router-dom';
import { Logo } from './Logo';

export default function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-line bg-night">
      <div className="mx-auto grid max-w-7xl gap-12 px-6 py-16 md:grid-cols-4">
        <div className="md:col-span-2">
          <Logo />
          <p className="mt-5 max-w-sm text-sm leading-relaxed text-mist">
            Speech-to-speech translation for people who refuse to be lost in translation. Built for Tamil, Hindi, English and
            seventeen more voices.
          </p>
        </div>
        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-sun">Product</p>
          <ul className="mt-4 space-y-2.5 text-sm text-cream/80">
            <li><Link className="hover:text-sun" to="/studio">Translation Studio</Link></li>
            <li><Link className="hover:text-sun" to="/conversation">Conversation Mode</Link></li>
            <li><Link className="hover:text-sun" to="/vault">Session Vault</Link></li>
          </ul>
        </div>
        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-sun">Stack</p>
          <ul className="mt-4 space-y-2.5 text-sm text-cream/80">
            <li>Node.js edge functions</li>
            <li>Python + SQLite ledger</li>
            <li>Web Speech capture</li>
          </ul>
        </div>
      </div>
      <div className="pointer-events-none select-none px-6 pb-4 text-center font-display text-[18vw] font-extrabold leading-none tracking-tighter text-white/[0.03]">
        ECHOTWIN
      </div>
      <div className="border-t border-line px-6 py-5 text-center font-mono text-[11px] tracking-widest text-mist">
        © {new Date().getFullYear()} ECHOTWIN AI · CRAFTED FOR EVERY TONGUE
      </div>
    </footer>
  );
}
