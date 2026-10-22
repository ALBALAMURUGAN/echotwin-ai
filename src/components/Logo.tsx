export function LogoMark({ className = 'h-9 w-9' }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden>
      <defs>
        <linearGradient id="lg-s" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#FFE58A" />
          <stop offset="1" stopColor="#FFB703" />
        </linearGradient>
        <linearGradient id="lg-v" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#C9B8FF" />
          <stop offset="1" stopColor="#6D28D9" />
        </linearGradient>
      </defs>
      <circle cx="18" cy="24" r="13" fill="url(#lg-v)" />
      <circle cx="30" cy="24" r="13" fill="url(#lg-s)" style={{ mixBlendMode: 'screen' }} opacity="0.92" />
      <path d="M19 24h2M23 19v10M27 21v6M31 23v2" stroke="#09050f" strokeWidth="2.4" strokeLinecap="round" />
    </svg>
  );
}

export function Logo() {
  return (
    <span className="flex items-center gap-2.5">
      <LogoMark />
      <span className="font-display text-lg font-bold tracking-tight">
        EchoTwin<span className="text-sun">.</span>
        <span className="ml-1 font-mono text-[10px] font-medium tracking-[0.2em] text-mist align-top">AI</span>
      </span>
    </span>
  );
}
