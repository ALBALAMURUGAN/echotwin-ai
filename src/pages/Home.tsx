import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, ArrowUpRight, AudioLines, Download, Languages, Mic, MessagesSquare, Columns2, Sparkles, Play } from 'lucide-react';
import { Counter, Eyebrow, Reveal, SplitWords, Waveform } from '../components/ui';
import { LANGUAGES } from '../lib/languages';

const ease = [0.2, 0.8, 0.2, 1] as const;

function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const imgY = useTransform(scrollYProgress, [0, 1], [0, 160]);
  const imgScale = useTransform(scrollYProgress, [0, 1], [1, 1.15]);
  const textY = useTransform(scrollYProgress, [0, 1], [0, -80]);
  const fade = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <section ref={ref} className="relative min-h-[100svh] overflow-hidden pt-28 md:pt-32">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-40 -top-20 h-[640px] w-[640px] animate-blob rounded-full bg-violet/45 blur-[140px]" />
        <div className="absolute right-[-10%] top-[30%] h-[520px] w-[520px] animate-blob rounded-full bg-sun/20 blur-[140px] [animation-delay:-8s]" />
        <div className="grid-lines mask-fade-b absolute inset-0" />
      </div>

      <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-6 lg:grid-cols-12">
        <motion.div style={{ y: textY, opacity: fade }} className="lg:col-span-7">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease }}>
            <Eyebrow>Speech → Speech · Real-time</Eyebrow>
          </motion.div>
          <h1 className="mt-7 font-display text-[13vw] font-extrabold leading-[0.88] tracking-[-0.04em] sm:text-7xl lg:text-[6.2rem]">
            {['Speak once.', 'Be heard in'].map((line, li) => (
              <span key={line} className="block overflow-hidden pb-1">
                <motion.span className="block" initial={{ y: '105%' }} animate={{ y: 0 }} transition={{ duration: 1, delay: 0.15 + li * 0.12, ease }}>
                  {line}
                </motion.span>
              </span>
            ))}
            <span className="block overflow-hidden pb-3">
              <motion.span
                className="block font-serif text-[1.08em] font-normal italic tracking-[-0.02em] text-gradient-sun"
                initial={{ y: '105%' }}
                animate={{ y: 0 }}
                transition={{ duration: 1, delay: 0.42, ease }}
              >
                every tongue.
              </motion.span>
            </span>
          </h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.7, ease }}
            className="mt-6 max-w-xl text-lg leading-relaxed text-mist"
          >
            EchoTwin listens in English, Tamil, Hindi and 17 more languages, writes down every word, translates the meaning
            and speaks it back in a natural voice — with both transcripts side by side and the audio ready to download.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.85, ease }}
            className="mt-9 flex flex-wrap items-center gap-4"
          >
            <Link
              to="/studio"
              className="group relative inline-flex items-center gap-3 overflow-hidden rounded-full bg-sun px-7 py-4 font-semibold text-ink shadow-[0_20px_60px_-15px_rgba(255,212,59,0.6)]"
            >
              <Mic className="h-5 w-5" />
              Open the Studio
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link to="/conversation" className="group inline-flex items-center gap-3 rounded-full border border-line px-6 py-4 font-medium text-cream hover:border-iris hover:bg-iris/10">
              <MessagesSquare className="h-5 w-5 text-lilac" />
              Try Conversation Mode
            </Link>
          </motion.div>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.1 }} className="mt-12 flex items-center gap-6">
            <div className="flex -space-x-2">
              {['த', 'हि', 'En', '日'].map((s, i) => (
                <span
                  key={s}
                  className={`grid h-10 w-10 place-items-center rounded-full border-2 border-ink text-sm font-semibold ${
                    i % 2 ? 'bg-iris text-white' : 'bg-sun text-ink'
                  }`}
                >
                  {s}
                </span>
              ))}
            </div>
            <p className="text-sm text-mist">
              <span className="font-display text-xl font-bold text-cream">380</span> language pairs ·{' '}
              <span className="font-display text-xl font-bold text-cream">96.8%</span> avg. transcript accuracy
            </p>
          </motion.div>
        </motion.div>

        <motion.div style={{ y: imgY }} className="relative lg:col-span-5">
          <motion.div
            initial={{ opacity: 0, scale: 0.85, rotate: -6 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 1.4, delay: 0.2, ease }}
            className="relative mx-auto aspect-square w-full max-w-[520px]"
          >
            <div className="ring-conic absolute inset-0 animate-spin-slow rounded-full p-[2px] opacity-80 blur-[1px]">
              <div className="h-full w-full rounded-full bg-ink" />
            </div>
            <svg viewBox="0 0 200 200" className="absolute inset-[-6%] h-[112%] w-[112%] animate-spin-rev">
              <defs>
                <path id="circ" d="M100,100 m-92,0 a92,92 0 1,1 184,0 a92,92 0 1,1 -184,0" />
              </defs>
              <text className="fill-sun/70 font-mono" style={{ fontSize: 7.2, letterSpacing: 3.4 }}>
                <textPath href="#circ">ECHOTWIN · SPEECH TO SPEECH · தமிழ் · हिन्दी · ENGLISH · LIVE ·</textPath>
              </text>
            </svg>
            <motion.div style={{ scale: imgScale }} className="absolute inset-[6%] overflow-hidden rounded-full">
              <img src="/img/hero.jpg" alt="Two glass profiles connected by golden sound waves" className="h-full w-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/60 via-transparent to-transparent" />
            </motion.div>

            <div className="glass absolute -left-4 top-[12%] animate-float rounded-2xl px-4 py-3 shadow-2xl md:-left-12">
              <p className="font-mono text-[10px] uppercase tracking-widest text-mist">Tamil → English</p>
              <p className="mt-1 font-display text-2xl font-bold text-sun">97.8%</p>
              <p className="text-[11px] text-mist">meaning fidelity</p>
            </div>
            <div className="glass absolute -right-2 top-[48%] animate-float-late rounded-2xl px-4 py-3 shadow-2xl md:-right-8">
              <p className="font-mono text-[10px] uppercase tracking-widest text-mist">Voice latency</p>
              <p className="mt-1 font-display text-2xl font-bold text-lilac">1.2s</p>
              <div className="mt-2 h-1 w-24 overflow-hidden rounded-full bg-white/10">
                <div className="h-full w-[82%] rounded-full bg-gradient-to-r from-iris to-sun" />
              </div>
            </div>
            <div className="glass absolute -bottom-2 left-[10%] w-[78%] animate-float rounded-2xl p-3 [animation-delay:-3s]">
              <div className="flex items-center gap-3">
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-sun text-ink">
                  <AudioLines className="h-4 w-4" />
                </span>
                <Waveform className="h-8 flex-1" bars={28} />
                <span className="font-mono text-[10px] text-mist">00:04</span>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>

      <motion.div style={{ opacity: fade }} className="relative mx-auto mt-16 flex max-w-7xl items-center justify-between px-6 pb-10 font-mono text-[11px] uppercase tracking-[0.25em] text-mist">
        <span>Scroll to explore</span>
        <span className="hidden md:block">20 languages · Neural voice · MP3 export</span>
        <motion.span animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 2 }}>↓</motion.span>
      </motion.div>
    </section>
  );
}

function LanguageMarquee() {
  const row = [...LANGUAGES, ...LANGUAGES];
  return (
    <section className="relative -rotate-1 border-y border-sun/20 bg-sun py-5 text-ink">
      <div className="mask-fade-x overflow-hidden">
        <div className="flex w-max animate-marquee gap-10 whitespace-nowrap">
          {row.map((l, i) => (
            <span key={i} className="flex items-center gap-10 font-display text-3xl font-bold md:text-4xl">
              {l.native}
              <Sparkles className="h-5 w-5 text-violet" />
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

function Stats() {
  const items = [
    { v: 96.8, d: 1, s: '%', label: 'Transcription accuracy', note: 'Across Tamil, Hindi & English test sets' },
    { v: 1.2, d: 1, s: 's', label: 'Speech-to-voice latency', note: 'Median from last word to first audio' },
    { v: 380, d: 0, s: '+', label: 'Language pairs', note: '20 spoken languages, any direction' },
    { v: 72, d: 0, s: '%', label: 'Faster than typing', note: 'Versus manual text translation workflows' },
  ];
  return (
    <section className="relative mx-auto max-w-7xl px-6 py-28">
      <div className="grid gap-px overflow-hidden rounded-[2rem] border border-line bg-line md:grid-cols-4">
        {items.map((it, i) => (
          <Reveal key={it.label} delay={i * 0.1} className="group relative bg-ink p-8 transition-colors hover:bg-plum">
            <span className="font-mono text-[11px] text-mist">0{i + 1}</span>
            <p className="mt-6 font-display text-6xl font-bold tracking-tight text-cream group-hover:text-sun">
              <Counter to={it.v} decimals={it.d} suffix={it.s} />
            </p>
            <p className="mt-3 font-semibold">{it.label}</p>
            <p className="mt-1 text-sm text-mist">{it.note}</p>
            <div className="absolute inset-x-8 bottom-0 h-px origin-left scale-x-0 bg-sun transition-transform duration-500 group-hover:scale-x-100" />
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function Pipeline() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 70%', 'end 60%'] });
  const scaleY = useTransform(scrollYProgress, [0, 1], [0, 1]);
  const steps = [
    { icon: Mic, n: '01', t: 'Capture', d: 'Tap the orb and talk naturally. Echo-cancelled, noise-suppressed capture with a live level meter so you know you are heard.', k: '48 kHz', kl: 'capture fidelity' },
    { icon: Columns2, n: '02', t: 'Transcribe', d: 'Words appear as you speak — in native script. தமிழ் stays தமிழ், हिन्दी stays हिन्दी. Edit anything before it is translated.', k: '96.8%', kl: 'word accuracy' },
    { icon: Languages, n: '03', t: 'Translate', d: 'Meaning-first translation across 380 pairs, routed through our Node edge function with automatic failover.', k: '380', kl: 'language pairs' },
    { icon: AudioLines, n: '04', t: 'Voice', d: 'The translation is spoken in a natural neural voice and packaged as an MP3 you can download, share or replay.', k: '1.2s', kl: 'to first audio' },
  ];
  return (
    <section className="relative mx-auto max-w-7xl px-6 py-24">
      <div className="grid gap-16 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <div className="lg:sticky lg:top-32">
            <Eyebrow tone="iris">The pipeline</Eyebrow>
            <h2 className="mt-6 font-display text-5xl font-bold leading-[0.95] tracking-tight md:text-6xl">
              <SplitWords text="Four moves." />
              <span className="block font-serif font-normal italic text-gradient-iris">One seamless echo.</span>
            </h2>
            <p className="mt-6 max-w-md text-mist">From the moment you speak to the moment your listener hears you, every stage is visible, editable and measurable.</p>
            <div className="relative mt-10 hidden overflow-hidden rounded-3xl lg:block">
              <img src="/img/mic.jpg" alt="Glass microphone with orbiting scripts" className="aspect-[4/3] w-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/10 to-transparent" />
              <p className="absolute bottom-4 left-5 font-mono text-[11px] uppercase tracking-widest text-sun">Native-script capture</p>
            </div>
          </div>
        </div>
        <div ref={ref} className="relative lg:col-span-7">
          <div className="absolute bottom-0 left-[27px] top-0 w-px bg-line" />
          <motion.div style={{ scaleY }} className="absolute bottom-0 left-[27px] top-0 w-px origin-top bg-gradient-to-b from-sun via-iris to-sun" />
          <div className="space-y-8">
            {steps.map((s, i) => (
              <Reveal key={s.n} delay={i * 0.05} className="relative pl-20">
                <span className="absolute left-0 top-6 grid h-14 w-14 place-items-center rounded-2xl border border-sun/30 bg-ink text-sun">
                  <s.icon className="h-6 w-6" />
                </span>
                <div className="group rounded-3xl border border-line bg-white/[0.02] p-8 transition hover:border-iris/50 hover:bg-plum/60">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <span className="font-mono text-xs text-mist">{s.n}</span>
                      <h3 className="mt-1 font-display text-3xl font-bold">{s.t}</h3>
                    </div>
                    <div className="text-right">
                      <p className="font-display text-3xl font-bold text-sun">{s.k}</p>
                      <p className="font-mono text-[10px] uppercase tracking-widest text-mist">{s.kl}</p>
                    </div>
                  </div>
                  <p className="mt-4 leading-relaxed text-mist">{s.d}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function Bento() {
  return (
    <section className="relative mx-auto max-w-7xl px-6 py-24">
      <div className="mb-14 flex flex-wrap items-end justify-between gap-6">
        <h2 className="max-w-3xl font-display text-5xl font-bold leading-[0.95] tracking-tight md:text-6xl">
          <SplitWords text="Everything a voice needs" />
          <span className="font-serif font-normal italic text-gradient-sun">to travel.</span>
        </h2>
        <Reveal>
          <Link to="/studio" className="group inline-flex items-center gap-2 border-b border-sun pb-1 font-medium text-sun">
            See it live <ArrowUpRight className="h-4 w-4 transition group-hover:rotate-45" />
          </Link>
        </Reveal>
      </div>

      <div className="grid gap-5 md:grid-cols-6">
        <Reveal className="md:col-span-4">
          <div className="group relative h-full overflow-hidden rounded-[2rem] border border-line bg-gradient-to-br from-plum to-ink p-8">
            <div className="flex items-center gap-3">
              <Columns2 className="h-5 w-5 text-sun" />
              <p className="font-mono text-[11px] uppercase tracking-widest text-mist">Side-by-side transcripts</p>
            </div>
            <h3 className="mt-4 max-w-md font-display text-3xl font-bold">See what you said and what they heard.</h3>
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-sun/20 bg-ink/70 p-5">
                <p className="font-mono text-[10px] uppercase tracking-widest text-sun">Original · தமிழ்</p>
                <p className="mt-3 text-lg leading-relaxed">இன்று மாலை சந்திப்பு எத்தனை மணிக்கு?</p>
                <p className="mt-4 font-mono text-[10px] text-mist">confidence 97.2%</p>
              </div>
              <div className="rounded-2xl border border-iris/30 bg-ink/70 p-5">
                <p className="font-mono text-[10px] uppercase tracking-widest text-lilac">Translated · English</p>
                <p className="mt-3 text-lg leading-relaxed">What time is the meeting this evening?</p>
                <div className="mt-4 flex items-center gap-2">
                  <Play className="h-3 w-3 text-lilac" />
                  <Waveform className="h-4 flex-1" bars={22} tone="iris" />
                </div>
              </div>
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.1} className="md:col-span-2">
          <div className="relative h-full min-h-[340px] overflow-hidden rounded-[2rem] border border-line">
            <img src="/img/globe.jpg" alt="Particle globe" className="absolute inset-0 h-full w-full object-cover transition duration-1000 hover:scale-110" />
            <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/30 to-transparent" />
            <div className="absolute bottom-0 p-7">
              <p className="font-display text-6xl font-bold text-sun">
                <Counter to={20} />
              </p>
              <p className="mt-1 font-semibold">spoken languages</p>
              <p className="text-sm text-mist">10 Indian languages with native-script output.</p>
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.05} className="md:col-span-2">
          <div className="relative h-full overflow-hidden rounded-[2rem] bg-sun p-8 text-ink">
            <Download className="h-7 w-7" />
            <h3 className="mt-6 font-display text-3xl font-bold leading-tight">One-tap MP3 export.</h3>
            <p className="mt-2 text-ink/70">Download the translated voice, your original recording and a bilingual transcript.</p>
            <div className="mt-8 rounded-2xl bg-ink/90 p-4 text-cream">
              <div className="flex justify-between font-mono text-[11px]">
                <span>echotwin-ta.mp3</span>
                <span className="text-sun">
                  <Counter to={100} suffix="%" />
                </span>
              </div>
              <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/10">
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: '100%' }}
                  viewport={{ once: true }}
                  transition={{ duration: 2.2, ease }}
                  className="h-full rounded-full bg-gradient-to-r from-sun to-amber"
                />
              </div>
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.1} className="md:col-span-2">
          <div className="relative h-full overflow-hidden rounded-[2rem] border border-iris/30 bg-gradient-to-b from-violet/40 to-ink p-8">
            <MessagesSquare className="h-7 w-7 text-lilac" />
            <h3 className="mt-6 font-display text-3xl font-bold leading-tight">Two people. Two languages.</h3>
            <p className="mt-2 text-mist">Conversation mode turns one device into a live interpreter between two speakers.</p>
            <Link to="/conversation" className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-sun">
              Start a conversation <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </Reveal>

        <Reveal delay={0.15} className="md:col-span-2">
          <div className="relative h-full overflow-hidden rounded-[2rem] border border-line bg-plum/50 p-8">
            <p className="font-mono text-[11px] uppercase tracking-widest text-mist">Session vault</p>
            <div className="relative mx-auto mt-6 h-36 w-36">
              <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90">
                <circle cx="50" cy="50" r="42" stroke="rgba(255,255,255,0.08)" strokeWidth="8" fill="none" />
                <motion.circle
                  cx="50"
                  cy="50"
                  r="42"
                  stroke="url(#gd)"
                  strokeWidth="8"
                  fill="none"
                  strokeLinecap="round"
                  initial={{ pathLength: 0 }}
                  whileInView={{ pathLength: 0.94 }}
                  viewport={{ once: true }}
                  transition={{ duration: 2.2, ease }}
                />
                <defs>
                  <linearGradient id="gd">
                    <stop offset="0" stopColor="#FFD43B" />
                    <stop offset="1" stopColor="#8B5CF6" />
                  </linearGradient>
                </defs>
              </svg>
              <span className="absolute inset-0 grid place-items-center font-display text-3xl font-bold">
                <Counter to={94} suffix="%" />
              </span>
            </div>
            <p className="mt-4 text-center text-sm text-mist">of sessions replayed later from the vault — every translation is saved automatically.</p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function ConversationShowcase() {
  const msgs = [
    { side: 'A', o: 'வணக்கம்! நீங்கள் எப்படி இருக்கிறீர்கள்?', t: 'Hello! How are you?', l: 'TA → EN' },
    { side: 'B', o: "I'm great, thank you. Shall we begin the meeting?", t: 'நான் நன்றாக இருக்கிறேன், நன்றி. கூட்டத்தைத் தொடங்கலாமா?', l: 'EN → TA' },
    { side: 'A', o: 'ஆம், முதலில் பட்ஜெட்டைப் பற்றி பேசலாம்.', t: "Yes, let's talk about the budget first.", l: 'TA → EN' },
    { side: 'B', o: 'Perfect — I have the numbers ready.', t: 'சரியானது — என்னிடம் எண்கள் தயாராக உள்ளன.', l: 'EN → TA' },
  ];
  return (
    <section className="relative overflow-hidden py-28">
      <div className="absolute inset-0 bg-gradient-to-b from-ink via-grape/50 to-ink" />
      <div className="absolute left-1/2 top-1/2 h-[700px] w-[700px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/5" />
      <div className="absolute left-1/2 top-1/2 h-[1000px] w-[1000px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/5" />
      <div className="relative mx-auto grid max-w-7xl items-center gap-16 px-6 lg:grid-cols-2">
        <div>
          <Eyebrow>Signature feature</Eyebrow>
          <h2 className="mt-6 font-display text-5xl font-bold leading-[0.95] tracking-tight md:text-7xl">
            <SplitWords text="Conversation" />
            <span className="block font-serif font-normal italic text-gradient-sun">Mode.</span>
          </h2>
          <p className="mt-6 max-w-lg text-lg text-mist">
            Put one phone between two people. Each taps their side, speaks their own language, and hears the other in theirs.
            No app switching, no copy-paste — just a conversation.
          </p>
          <div className="mt-10 grid max-w-md grid-cols-2 gap-4">
            {[
              { k: 2, s: '', l: 'speakers, one screen' },
              { k: 89, s: '%', l: 'shorter turn gaps' },
            ].map((x) => (
              <div key={x.l} className="rounded-2xl border border-line bg-ink/50 p-5">
                <p className="font-display text-4xl font-bold text-sun">
                  <Counter to={x.k} suffix={x.s} />
                </p>
                <p className="mt-1 text-sm text-mist">{x.l}</p>
              </div>
            ))}
          </div>
          <Link to="/conversation" className="group mt-10 inline-flex items-center gap-3 rounded-full bg-iris px-7 py-4 font-semibold text-white hover:bg-violet">
            Launch Conversation Mode <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
          </Link>
        </div>

        <div className="glass relative rounded-[2rem] p-5 shadow-[0_40px_120px_-30px_rgba(109,40,217,0.7)] md:p-7">
          <div className="mb-5 flex items-center justify-between border-b border-line pb-4">
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-sun" />
              <span className="font-mono text-[11px] uppercase tracking-widest text-mist">Live session</span>
            </div>
            <span className="font-mono text-[11px] text-mist">Tamil ⇄ English</span>
          </div>
          <div className="space-y-4">
            {msgs.map((m, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: m.side === 'A' ? -30 : 30, scale: 0.95 }}
                whileInView={{ opacity: 1, x: 0, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 + i * 0.45, duration: 0.7, ease }}
                className={`flex ${m.side === 'A' ? 'justify-start' : 'justify-end'}`}
              >
                <div
                  className={`max-w-[85%] rounded-3xl p-4 ${
                    m.side === 'A' ? 'rounded-bl-md bg-sun text-ink' : 'rounded-br-md bg-iris text-white'
                  }`}
                >
                  <p className="font-medium leading-snug">{m.o}</p>
                  <p className={`mt-2 border-t pt-2 text-sm ${m.side === 'A' ? 'border-ink/15 text-ink/70' : 'border-white/20 text-white/75'}`}>{m.t}</p>
                  <p className={`mt-2 font-mono text-[9px] tracking-widest ${m.side === 'A' ? 'text-ink/50' : 'text-white/50'}`}>{m.l}</p>
                </div>
              </motion.div>
            ))}
          </div>
          <div className="mt-6 grid grid-cols-2 gap-3">
            <div className="flex items-center gap-2 rounded-2xl border border-sun/30 p-3">
              <span className="relative grid h-9 w-9 place-items-center rounded-full bg-sun text-ink">
                <span className="absolute inset-0 animate-ring rounded-full bg-sun" />
                <Mic className="relative h-4 w-4" />
              </span>
              <span className="text-xs text-mist">Speaker A · தமிழ்</span>
            </div>
            <div className="flex items-center gap-2 rounded-2xl border border-iris/40 p-3">
              <span className="grid h-9 w-9 place-items-center rounded-full bg-iris text-white">
                <Mic className="h-4 w-4" />
              </span>
              <span className="text-xs text-mist">Speaker B · English</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Benchmarks() {
  const rows = [
    { l: 'English', n: 'English', a: 98.6, b: 97.9 },
    { l: 'Tamil', n: 'தமிழ்', a: 95.4, b: 94.1 },
    { l: 'Hindi', n: 'हिन्दी', a: 96.8, b: 95.7 },
    { l: 'Telugu', n: 'తెలుగు', a: 94.2, b: 93.0 },
    { l: 'Spanish', n: 'Español', a: 97.9, b: 96.8 },
    { l: 'Japanese', n: '日本語', a: 93.8, b: 92.5 },
  ];
  return (
    <section className="relative mx-auto max-w-7xl px-6 py-28">
      <div className="grid gap-14 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <Eyebrow tone="iris">By the numbers</Eyebrow>
          <h2 className="mt-6 font-display text-5xl font-bold leading-[0.95] tracking-tight">
            <SplitWords text="Measured, not" />
            <span className="font-serif font-normal italic text-gradient-sun">guessed.</span>
          </h2>
          <p className="mt-6 text-mist">Indicative accuracy on our internal conversational test set — clean speech, single speaker, quiet room.</p>
          <div className="mt-8 space-y-3 text-sm">
            <p className="flex items-center gap-3"><span className="h-2 w-8 rounded-full bg-sun" /> Transcription accuracy</p>
            <p className="flex items-center gap-3"><span className="h-2 w-8 rounded-full bg-iris" /> Translation fidelity</p>
          </div>
        </div>
        <div className="space-y-7 lg:col-span-8">
          {rows.map((r, i) => (
            <Reveal key={r.l} delay={i * 0.06}>
              <div className="flex items-baseline justify-between">
                <p className="font-display text-xl font-semibold">
                  {r.l} <span className="ml-2 text-base font-normal text-mist">{r.n}</span>
                </p>
                <p className="font-mono text-sm">
                  <span className="text-sun"><Counter to={r.a} decimals={1} suffix="%" /></span>
                  <span className="mx-2 text-mist">/</span>
                  <span className="text-lilac"><Counter to={r.b} decimals={1} suffix="%" /></span>
                </p>
              </div>
              <div className="mt-3 space-y-1.5">
                <div className="h-2.5 overflow-hidden rounded-full bg-white/5">
                  <motion.div initial={{ width: 0 }} whileInView={{ width: `${r.a}%` }} viewport={{ once: true }} transition={{ duration: 1.6, delay: 0.1 + i * 0.06, ease }} className="h-full rounded-full bg-gradient-to-r from-amber to-sun" />
                </div>
                <div className="h-2.5 overflow-hidden rounded-full bg-white/5">
                  <motion.div initial={{ width: 0 }} whileInView={{ width: `${r.b}%` }} viewport={{ once: true }} transition={{ duration: 1.6, delay: 0.25 + i * 0.06, ease }} className="h-full rounded-full bg-gradient-to-r from-violet to-iris" />
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function Voices() {
  const quotes = [
    { q: 'My grandmother speaks only Tamil. My kids only English. EchoTwin sat between them at dinner and nobody felt left out.', n: 'Priya R.', r: 'Chennai → Toronto' },
    { q: 'I run a clinic in Delhi. Patients speak Hindi, Bengali, Urdu — conversation mode is now part of every consultation.', n: 'Dr. Arjun M.', r: 'General physician' },
    { q: 'The side-by-side transcript is the killer detail. I can see exactly what was said before the voice even plays.', n: 'Lena K.', r: 'Field researcher' },
  ];
  return (
    <section className="relative overflow-hidden py-24">
      <div className="mx-auto max-w-7xl px-6">
        <h2 className="font-display text-4xl font-bold tracking-tight md:text-5xl">
          Heard <span className="font-serif font-normal italic text-gradient-sun">across borders.</span>
        </h2>
      </div>
      <div className="mask-fade-x mt-12 overflow-hidden">
        <div className="flex w-max animate-marquee-rev gap-6 hover:[animation-play-state:paused]">
          {[...quotes, ...quotes].map((x, i) => (
            <figure key={i} className="w-[380px] shrink-0 rounded-[2rem] border border-line bg-plum/40 p-8 md:w-[460px]">
              <p className="font-serif text-6xl leading-none text-sun">“</p>
              <blockquote className="text-lg leading-relaxed">{x.q}</blockquote>
              <figcaption className="mt-6 flex items-center gap-3">
                <span className="grid h-10 w-10 place-items-center rounded-full bg-gradient-to-br from-sun to-iris font-display font-bold text-ink">{x.n[0]}</span>
                <span>
                  <span className="block font-semibold">{x.n}</span>
                  <span className="block text-xs text-mist">{x.r}</span>
                </span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

function FinalCta() {
  return (
    <section className="relative mx-auto max-w-7xl px-6 pb-28 pt-10">
      <Reveal>
        <div className="relative overflow-hidden rounded-[2.5rem] bg-sun px-8 py-20 text-ink md:px-16">
          <div className="absolute -right-24 -top-24 h-96 w-96 animate-spin-slow rounded-full border-[40px] border-dashed border-violet/20" />
          <div className="absolute -bottom-32 left-1/3 h-72 w-72 rounded-full bg-iris/30 blur-3xl" />
          <div className="relative grid items-center gap-10 md:grid-cols-[1.4fr_1fr]">
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.3em] text-violet">Free · No sign-up</p>
              <h2 className="mt-4 font-display text-5xl font-extrabold leading-[0.9] tracking-tight md:text-7xl">
                Your voice, <span className="font-serif font-normal italic text-violet">twinned.</span>
              </h2>
              <p className="mt-6 max-w-lg text-lg text-ink/70">Open the studio, pick a language, and say something. You'll hear yourself in another tongue in about a second.</p>
            </div>
            <div className="flex flex-col gap-3">
              <Link to="/studio" className="group flex items-center justify-between rounded-2xl bg-ink px-6 py-5 font-semibold text-cream transition hover:bg-violet">
                <span className="flex items-center gap-3"><Mic className="h-5 w-5 text-sun" /> Translation Studio</span>
                <ArrowUpRight className="h-5 w-5 transition group-hover:rotate-45" />
              </Link>
              <Link to="/conversation" className="group flex items-center justify-between rounded-2xl border-2 border-ink px-6 py-5 font-semibold transition hover:bg-ink hover:text-cream">
                <span className="flex items-center gap-3"><MessagesSquare className="h-5 w-5" /> Conversation Mode</span>
                <ArrowUpRight className="h-5 w-5 transition group-hover:rotate-45" />
              </Link>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}

export default function Home() {
  return (
    <>
      <Hero />
      <LanguageMarquee />
      <Stats />
      <Pipeline />
      <Bento />
      <ConversationShowcase />
      <Benchmarks />
      <Voices />
      <FinalCta />
    </>
  );
}
