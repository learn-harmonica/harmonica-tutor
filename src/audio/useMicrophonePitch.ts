import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { estimatePitch, frequencyToNote, rms } from './pitch';
import type { PitchFrame } from './types';

type MicrophoneStatus = 'idle' | 'requesting' | 'listening' | 'error';

type AudioContextConstructor = typeof AudioContext;

type GlobalAudioContext = {
  AudioContext?: AudioContextConstructor;
  webkitAudioContext?: AudioContextConstructor;
};

function getAudioContextConstructor() {
  const globalAudio = globalThis as unknown as GlobalAudioContext;
  return globalAudio.AudioContext ?? globalAudio.webkitAudioContext;
}

function getStabilityCents(frequencies: number[]) {
  if (frequencies.length < 2) {
    return null;
  }

  const meanLog = frequencies.reduce((sum, f) => sum + Math.log2(f), 0) / frequencies.length;
  const meanFrequency = Math.pow(2, meanLog);

  let variance = 0;
  for (const frequency of frequencies) {
    const cents = 1200 * Math.log2(frequency / meanFrequency);
    variance += cents * cents;
  }

  return Math.sqrt(variance / frequencies.length);
}

export function useMicrophonePitch() {
  const [status, setStatus] = useState<MicrophoneStatus>('idle');
  const [error, setError] = useState<string | null>(null);
  const [frequency, setFrequency] = useState<number | null>(null);
  const [noteName, setNoteName] = useState<string | null>(null);
  const [cents, setCents] = useState<number | null>(null);
  const [level, setLevel] = useState<number>(0);
  const [stabilityCents, setStabilityCents] = useState<number | null>(null);
  const [frame, setFrame] = useState<PitchFrame | null>(null);

  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const rafRef = useRef<number | null>(null);
  const lastUpdateRef = useRef<number>(0);
  const historyRef = useRef<number[]>([]);

  const supported = useMemo(() => {
    const hasMedia = typeof navigator !== 'undefined' && !!navigator.mediaDevices?.getUserMedia;
    const AudioContextCtor = getAudioContextConstructor();
    return hasMedia && !!AudioContextCtor;
  }, []);

  const stop = useCallback(() => {
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }

    historyRef.current = [];

    if (streamRef.current) {
      for (const track of streamRef.current.getTracks()) {
        track.stop();
      }
      streamRef.current = null;
    }

    sourceRef.current = null;
    analyserRef.current = null;

    if (audioContextRef.current) {
      void audioContextRef.current.close();
      audioContextRef.current = null;
    }

    setStatus('idle');
    setError(null);
    setFrequency(null);
    setNoteName(null);
    setCents(null);
    setLevel(0);
    setStabilityCents(null);
    setFrame(null);
  }, []);

  const start = useCallback(async () => {
    if (!supported) {
      setStatus('error');
      setError('Microphone pitch detection is not supported in this environment.');
      return;
    }

    if (status === 'requesting' || status === 'listening') {
      return;
    }

    setStatus('requesting');
    setError(null);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const AudioContextCtor = getAudioContextConstructor();
      if (!AudioContextCtor) {
        throw new Error('AudioContext is not available');
      }

      const audioContext = new AudioContextCtor();
      audioContextRef.current = audioContext;

      const source = audioContext.createMediaStreamSource(stream);
      sourceRef.current = source;

      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 2048;
      analyserRef.current = analyser;

      source.connect(analyser);

      const buffer = new Float32Array(analyser.fftSize);

      const tick = () => {
        const currentAnalyser = analyserRef.current;
        const currentContext = audioContextRef.current;

        if (!currentAnalyser || !currentContext) {
          return;
        }

        currentAnalyser.getFloatTimeDomainData(buffer);

        const now = performance.now();
        if (now - lastUpdateRef.current > 100) {
          lastUpdateRef.current = now;

          const currentLevel = rms(buffer);
          setLevel(currentLevel);

          const detectedFrequency = estimatePitch(buffer, currentContext.sampleRate);
          setFrame({ t: now, frequency: detectedFrequency, level: currentLevel });
          if (detectedFrequency) {
            const detectedNote = frequencyToNote(detectedFrequency);
            setFrequency(detectedFrequency);
            setNoteName(detectedNote.noteName);
            setCents(detectedNote.cents);

            historyRef.current = [...historyRef.current, detectedFrequency].slice(-25);
            setStabilityCents(getStabilityCents(historyRef.current));
          } else {
            setFrequency(null);
            setNoteName(null);
            setCents(null);
          }
        }

        rafRef.current = requestAnimationFrame(tick);
      };

      setStatus('listening');
      lastUpdateRef.current = 0;
      rafRef.current = requestAnimationFrame(tick);
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      stop();
      setStatus('error');
      setError(message);
    }
  }, [status, stop, supported]);

  useEffect(() => {
    return () => {
      stop();
    };
  }, [stop]);

  return {
    supported,
    status,
    error,
    frequency,
    noteName,
    cents,
    level,
    stabilityCents,
    frame,
    stream: streamRef.current,
    start,
    stop
  };
}
