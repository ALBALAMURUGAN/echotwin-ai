export type Entry = {
  id: string;
  mode: 'studio' | 'conversation';
  from: string;
  to: string;
  source: string;
  translated: string;
  confidence: number; // 0-100
  latency: number;
  speaker?: 'A' | 'B';
  createdAt: number;
};

const KEY = 'echotwin.vault.v1';

export function listEntries(): Entry[] {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as Entry[]) : [];
  } catch {
    return [];
  }
}

function save(items: Entry[]) {
  localStorage.setItem(KEY, JSON.stringify(items.slice(0, 500)));
}

export function addEntry(e: Omit<Entry, 'id' | 'createdAt'>): Entry {
  const entry: Entry = { ...e, id: crypto.randomUUID(), createdAt: Date.now() };
  save([entry, ...listEntries()]);
  // Mirror to the Python ledger (SQLite) — fire and forget.
  fetch('/api/history', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(entry),
  }).catch(() => undefined);
  return entry;
}

export function removeEntry(id: string) {
  save(listEntries().filter((e) => e.id !== id));
}

export function clearEntries() {
  localStorage.removeItem(KEY);
}

export async function cloudStatus(): Promise<{ ok: boolean; count: number; engine?: string }> {
  try {
    const r = await fetch('/api/history');
    const ct = r.headers.get('content-type') || '';
    if (!r.ok || !ct.includes('json')) throw new Error('no');
    const d = await r.json();
    return { ok: true, count: d.count ?? 0, engine: d.engine };
  } catch {
    return { ok: false, count: 0 };
  }
}
