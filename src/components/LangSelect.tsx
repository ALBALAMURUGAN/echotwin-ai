import { ChevronDown } from 'lucide-react';
import { LANGUAGES, getLang } from '../lib/languages';

export default function LangSelect({ value, onChange, label, tone = 'sun' }: { value: string; onChange: (v: string) => void; label: string; tone?: 'sun' | 'iris' }) {
  const l = getLang(value);
  return (
    <label className="group relative block min-w-0 flex-1 cursor-pointer">
      <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-mist">{label}</span>
      <div
        className={`mt-1.5 flex items-center gap-3 rounded-2xl border bg-white/[0.03] px-4 py-3 transition group-hover:bg-white/[0.06] ${
          tone === 'sun' ? 'border-sun/25' : 'border-iris/35'
        }`}
      >
        <span
          className={`grid h-9 w-9 shrink-0 place-items-center rounded-xl font-mono text-xs font-semibold ${
            tone === 'sun' ? 'bg-sun text-ink' : 'bg-iris text-white'
          }`}
        >
          {l.tag}
        </span>
        <span className="min-w-0 flex-1">
          <span className="block truncate font-display text-base font-semibold">{l.name}</span>
          <span className="block truncate text-xs text-mist">{l.native}</span>
        </span>
        <ChevronDown className="h-4 w-4 text-mist" />
      </div>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="absolute inset-0 cursor-pointer opacity-0"
        aria-label={label}
      >
        {LANGUAGES.map((x) => (
          <option key={x.code} value={x.code}>
            {x.name} — {x.native}
          </option>
        ))}
      </select>
    </label>
  );
}
