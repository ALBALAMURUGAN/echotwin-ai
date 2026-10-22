import { useEffect, useRef, useState, type ReactNode } from 'react';
import { animate, motion, useInView } from 'framer-motion';

export function Reveal({ children, delay = 0, className = '', y = 40 }: { children: ReactNode; delay?: number; className?: string; y?: number }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y, filter: 'blur(8px)' }}
      whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.9, delay, ease: [0.2, 0.8, 0.2, 1] }}
    >
      {children}
    </motion.div>
  );
}

export function SplitWords({ text, className = '', delay = 0 }: { text: string; className?: string; delay?: number }) {
  return (
    <span className={className}>
      {text.split(' ').map((w, i) => (
        <span key={i} className="inline-block overflow-hidden pb-[0.08em] align-bottom">
          <motion.span
            className="inline-block"
            initial={{ y: '110%' }}
            whileInView={{ y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, delay: delay + i * 0.07, ease: [0.2, 0.8, 0.2, 1] }}
          >
            {w}&nbsp;
          </motion.span>
        </span>
      ))}
    </span>
  );
}

export function Counter({ to, decimals = 0, suffix = '', prefix = '' }: { to: number; decimals?: number; suffix?: string; prefix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!inView) return;
    const c = animate(0, to, { duration: 2.2, ease: [0.2, 0.8, 0.2, 1], onUpdate: setVal });
    return () => c.stop();
  }, [inView, to]);
  return (
    <span ref={ref}>
      {prefix}
      {val.toFixed(decimals)}
      {suffix}
    </span>
  );
}

export function Eyebrow({ children, tone = 'sun' }: { children: ReactNode; tone?: 'sun' | 'iris' }) {
  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 font-mono text-[11px] uppercase tracking-[0.22em] ${
        tone === 'sun' ? 'border-sun/30 bg-sun/10 text-sun' : 'border-iris/40 bg-iris/10 text-lilac'
      }`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${tone === 'sun' ? 'bg-sun' : 'bg-iris'}`} />
      {children}
    </span>
  );
}

export function Waveform({ level = 0, active = false, bars = 42, tone = 'sun', className = 'h-16' }: { level?: number; active?: boolean; bars?: number; tone?: 'sun' | 'iris'; className?: string }) {
  return (
    <div className={`flex items-center justify-center gap-[3px] ${className}`}>
      {Array.from({ length: bars }).map((_, i) => {
        const center = 1 - Math.abs(i - bars / 2) / (bars / 2);
        const h = active ? 0.12 + Math.min(1, level * (0.6 + Math.sin(i * 1.7 + level * 9) * 0.4 + center * 0.8)) * 0.88 : 0;
        return (
          <span
            key={i}
            className={`w-[3px] origin-center rounded-full ${tone === 'sun' ? 'bg-sun' : 'bg-iris'} ${active ? '' : 'animate-bar opacity-60'}`}
            style={
              active
                ? { height: `${Math.max(8, h * 100)}%`, transition: 'height 80ms linear' }
                : { height: `${30 + center * 60}%`, animationDelay: `${(i % 9) * 0.11}s`, animationDuration: `${1 + (i % 5) * 0.2}s` }
            }
          />
        );
      })}
    </div>
  );
}

export function PageHero({ eyebrow, title, accent, sub }: { eyebrow: string; title: string; accent: string; sub: string }) {
  return (
    <div className="relative mx-auto max-w-7xl px-6 pb-10 pt-36">
      <Reveal>
        <Eyebrow>{eyebrow}</Eyebrow>
      </Reveal>
      <h1 className="mt-6 font-display text-5xl font-bold leading-[0.95] tracking-tight md:text-7xl">
        <SplitWords text={title} />
        <span className="font-serif font-normal italic text-gradient-sun"> {accent}</span>
      </h1>
      <Reveal delay={0.3}>
        <p className="mt-6 max-w-2xl text-lg text-mist">{sub}</p>
      </Reveal>
    </div>
  );
}

export function Backdrop() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute -left-40 top-0 h-[520px] w-[520px] animate-blob rounded-full bg-violet/40 blur-[120px]" />
      <div className="absolute -right-32 top-40 h-[420px] w-[420px] animate-blob rounded-full bg-sun/15 blur-[120px] [animation-delay:-6s]" />
      <div className="grid-lines mask-fade-b absolute inset-0 opacity-60" />
    </div>
  );
}
