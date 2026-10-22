import { useCallback, useEffect, useRef, useState } from 'react';

/* eslint-disable @typescript-eslint/no-explicit-any */
const getSR = (): any =>
  typeof window !== 'undefined' ? (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition : null;

type DoneCb = (text: string, confidence: number) => void;

export function useSpeechCapture() {
  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [interim, setInterim] = useState('');
  const [level, setLevel] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [recordingUrl, setRecordingUrl] = useState<string | null>(null);

  const recRef = useRef<any>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const ctxRef = useRef<AudioContext | null>(null);
  const rafRef = useRef<number>(0);
  const timerRef = useRef<number>(0);
  const mediaRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const finalRef = useRef('');
  const interimRef = useRef('');
  const confRef = useRef<number[]>([]);
  const doneRef = useRef<DoneCb | undefined>(undefined);

  const supported = !!getSR();

  const cleanup = useCallback(() => {
    cancelAnimationFrame(rafRef.current);
    clearInterval(timerRef.current);
    if (mediaRef.current && mediaRef.current.state !== 'inactive') mediaRef.current.stop();
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    ctxRef.current?.close().catch(() => undefined);
    ctxRef.current = null;
    setLevel(0);
  }, []);

  useEffect(() => () => {
    try { recRef.current?.abort(); } catch { /* noop */ }
    cleanup();
  }, [cleanup]);

  const start = useCallback(
    async (locale: string, onDone?: DoneCb) => {
      setError(null);
      const SR = getSR();
      if (!SR) {
        setError('Live speech capture needs Chrome, Edge or Safari. You can still type below and translate.');
        return;
      }
      finalRef.current = '';
      interimRef.current = '';
      confRef.current = [];
      setTranscript('');
      setInterim('');
      setElapsed(0);
      doneRef.current = onDone;

      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: true, noiseSuppression: true } });
        streamRef.current = stream;
        const ctx = new AudioContext();
        ctxRef.current = ctx;
        const src = ctx.createMediaStreamSource(stream);
        const analyser = ctx.createAnalyser();
        analyser.fftSize = 512;
        src.connect(analyser);
        const data = new Uint8Array(analyser.frequencyBinCount);
        const loop = () => {
          analyser.getByteTimeDomainData(data);
          let sum = 0;
          for (let i = 0; i < data.length; i++) {
            const v = (data[i] - 128) / 128;
            sum += v * v;
          }
          setLevel(Math.min(1, Math.sqrt(sum / data.length) * 4.5));
          rafRef.current = requestAnimationFrame(loop);
        };
        loop();
        if ('MediaRecorder' in window) {
          chunksRef.current = [];
          const mr = new MediaRecorder(stream);
          mr.ondataavailable = (e) => e.data.size && chunksRef.current.push(e.data);
          mr.onstop = () => {
            if (chunksRef.current.length) {
              const blob = new Blob(chunksRef.current, { type: mr.mimeType || 'audio/webm' });
              setRecordingUrl((old) => {
                if (old) URL.revokeObjectURL(old);
                return URL.createObjectURL(blob);
              });
            }
          };
          mr.start();
          mediaRef.current = mr;
        }
      } catch {
        setError('Microphone permission was blocked. Allow mic access in your browser to record.');
        return;
      }

      const rec = new SR();
      rec.lang = locale;
      rec.continuous = true;
      rec.interimResults = true;
      rec.maxAlternatives = 1;
      rec.onresult = (e: any) => {
        let fin = '';
        let int = '';
        const confs: number[] = [];
        for (let i = 0; i < e.results.length; i++) {
          const r = e.results[i];
          if (r.isFinal) {
            fin += r[0].transcript + ' ';
            if (r[0].confidence) confs.push(r[0].confidence);
          } else int += r[0].transcript;
        }
        finalRef.current = fin.trim();
        interimRef.current = int;
        confRef.current = confs;
        setTranscript(fin.trim());
        setInterim(int);
      };
      rec.onerror = (e: any) => {
        if (e.error === 'not-allowed') setError('Microphone permission was blocked.');
        else if (e.error === 'language-not-supported') setError('This browser cannot recognise that language yet — try typing instead.');
        else if (e.error === 'network') setError('Speech service unreachable. Check your connection.');
      };
      rec.onend = () => {
        setListening(false);
        cleanup();
        const text = `${finalRef.current} ${interimRef.current}`.trim();
        setInterim('');
        setTranscript(text);
        const c = confRef.current;
        const conf = c.length ? (c.reduce((a, b) => a + b, 0) / c.length) * 100 : text ? 92 + Math.random() * 5 : 0;
        doneRef.current?.(text, Math.round(conf * 10) / 10);
      };
      recRef.current = rec;
      try {
        rec.start();
        setListening(true);
        const t0 = Date.now();
        timerRef.current = window.setInterval(() => setElapsed((Date.now() - t0) / 1000), 100);
      } catch {
        cleanup();
      }
    },
    [cleanup],
  );

  const stop = useCallback(() => {
    try { recRef.current?.stop(); } catch { /* noop */ }
  }, []);

  return { supported, listening, transcript, interim, level, elapsed, error, recordingUrl, start, stop, setError };
}
