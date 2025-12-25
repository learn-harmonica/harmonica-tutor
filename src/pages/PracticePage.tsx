import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

import type { HarmonicaKey } from '../content/types';
import { useMicrophonePitch } from '../audio/useMicrophonePitch';
import HarmonicaLayout from '../harmonica/HarmonicaLayout';
import { getRichterNote } from '../harmonica/richter';
import type { PitchFrame } from '../audio/types';
import {
  computeTakeMetrics,
  createPracticeTake,
  getTakeFeedback,
  loadPracticeTakes,
  savePracticeTake,
  type PracticeTake
} from '../practice/takes';
import { convertMidiToTab, tabToMidi } from '../tab';
import { playTone } from '../audio/playTone';
import StaffNotation from '../components/StaffNotation';

type Breath = 'blow' | 'draw';

function formatNumber(value: number, digits: number) {
  return value.toLocaleString(undefined, {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits
  });
}

function centsBetween(frequency: number, targetFrequency: number) {
  return 1200 * Math.log2(frequency / targetFrequency);
}

function getSupportedAudioMimeType() {
  if (typeof MediaRecorder === 'undefined') {
    return null;
  }

  const candidates = [
    'audio/webm;codecs=opus',
    'audio/webm',
    'audio/ogg;codecs=opus',
    'audio/ogg',
    'audio/mp4'
  ];

  if (typeof MediaRecorder.isTypeSupported !== 'function') {
    return null;
  }

  for (const mimeType of candidates) {
    if (MediaRecorder.isTypeSupported(mimeType)) {
      return mimeType;
    }
  }

  return null;
}

function blobToDataUrl(blob: Blob) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.addEventListener('load', () => {
      resolve(String(reader.result));
    });
    reader.addEventListener('error', () => {
      reject(new Error('Failed to read recorded audio.'));
    });
    reader.readAsDataURL(blob);
  });
}

export default function PracticePage() {
  const [selectedKey, setSelectedKey] = useState<HarmonicaKey>('C');
  const [hole, setHole] = useState(4);
  const [breath, setBreath] = useState<Breath>('blow');
  const [takes, setTakes] = useState<PracticeTake[]>(() => loadPracticeTakes());
  const [recordingAudio, setRecordingAudio] = useState(false);
  const [recordingAudioError, setRecordingAudioError] = useState<string | null>(null);
  const [recordingTab, setRecordingTab] = useState(false);
  const [currentTab, setCurrentTab] = useState<string[]>([]);
  const [tabTimestamps, setTabTimestamps] = useState<number[]>([]);
  const startTimeRef = useRef<number>(0);
  const [notationMode, setNotationMode] = useState<'tab' | 'staff'>('tab');
  const [currentNoteIndex, setCurrentNoteIndex] = useState<number>(-1);
  const [searchParams] = useSearchParams();

  const {
    supported,
    status,
    error,
    frequency,
    noteName,
    cents,
    level,
    stabilityCents,
    frame,
    stream,
    audioContext,
    start,
    stop
  } = useMicrophonePitch();

  const frameHistoryRef = useRef<PitchFrame[]>([]);

  useEffect(() => {
    const keyParam = searchParams.get('key');
    const holeParam = searchParams.get('hole');
    const breathParam = searchParams.get('breath');

    if (keyParam === 'C' || keyParam === 'G' || keyParam === 'A') {
      setSelectedKey(keyParam);
    }

    if (holeParam) {
      const value = Number(holeParam);
      if (Number.isFinite(value)) {
        const next = Math.max(1, Math.min(10, Math.floor(value)));
        setHole(next);
      }
    }

    if (breathParam === 'blow' || breathParam === 'draw') {
      setBreath(breathParam);
    }
  }, [searchParams]);

  useEffect(() => {
    if (!frame) {
      return;
    }

    frameHistoryRef.current = [...frameHistoryRef.current, frame].slice(-40);

    if (recordingTab && frame.frequency !== null) {
      const midi = Math.round(69 + 12 * Math.log2(frame.frequency / 440));
      const tabSymbol = convertMidiToTab(midi);
      if (tabSymbol) {
        setCurrentTab(prev => [...prev, tabSymbol]);
        setTabTimestamps(prev => [...prev, frame.t - startTimeRef.current]);
      }
    }
  }, [frame, recordingTab]);

  useEffect(() => {
    if (status !== 'listening') {
      frameHistoryRef.current = [];
    }
  }, [status]);

  const audioRecordingSupported = useMemo(() => {
    return typeof MediaRecorder !== 'undefined';
  }, []);

  const target = useMemo(() => getRichterNote(selectedKey, hole, breath), [breath, hole, selectedKey]);

  const targetCents = useMemo(() => {
    if (!target || !frequency) {
      return null;
    }

    return centsBetween(frequency, target.frequency);
  }, [frequency, target]);

  const targetQuality = useMemo(() => {
    if (targetCents === null) {
      return null;
    }

    const abs = Math.abs(targetCents);
    if (abs <= 15) {
      return 'in tune';
    }

    if (targetCents > 0) {
      return 'sharp';
    }

    return 'flat';
  }, [targetCents]);

  const statusBadge = useMemo(() => {
    if (status === 'listening') {
      return 'listening';
    }
    if (status === 'requesting') {
      return 'requesting';
    }
    if (status === 'error') {
      return 'error';
    }
    return 'idle';
  }, [status]);

  const recordTake = useCallback(() => {
    if (!target) {
      return;
    }

    const frames = frameHistoryRef.current;
    const metrics = computeTakeMetrics(frames, target.frequency);
    const take = createPracticeTake(
      {
        key: selectedKey,
        hole,
        breath,
        noteName: target.noteName,
        frequency: target.frequency
      },
      metrics
    );

    const takeWithTab = { ...take, tab: currentTab, timestamps: tabTimestamps };
    setTakes(savePracticeTake(takeWithTab));
  }, [breath, hole, selectedKey, target, currentTab, tabTimestamps]);

  const recordAudioTake = useCallback(async () => {
    setRecordingAudioError(null);

    if (!target) {
      return;
    }

    if (!stream) {
      setRecordingAudioError('Microphone is not active. Start the microphone first.');
      return;
    }

    if (typeof MediaRecorder === 'undefined') {
      setRecordingAudioError('Audio recording is not supported in this environment.');
      return;
    }

    if (recordingAudio) {
      return;
    }

    const mimeType = getSupportedAudioMimeType();
    const startTime = performance.now();
    let stopTime = startTime;

    try {
      const recorder = mimeType ? new MediaRecorder(stream, { mimeType }) : new MediaRecorder(stream);
      const chunks: BlobPart[] = [];

      const stopped = new Promise<{ blob: Blob; durationMs: number; mimeType: string }>((resolve, reject) => {
        recorder.addEventListener('dataavailable', (event) => {
          if (event.data && event.data.size > 0) {
            chunks.push(event.data);
          }
        });

        recorder.addEventListener('error', () => {
          reject(new Error('Recording failed.'));
        });

        recorder.addEventListener('stop', () => {
          stopTime = performance.now();
          const blob = new Blob(chunks, { type: recorder.mimeType || mimeType || undefined });
          resolve({
            blob,
            durationMs: stopTime - startTime,
            mimeType: blob.type || recorder.mimeType || mimeType || 'audio/webm'
          });
        });
      });

      setRecordingAudio(true);
      recorder.start();

      await new Promise((resolve) => setTimeout(resolve, 3000));

      if (recorder.state !== 'inactive') {
        recorder.stop();
      }

      const { blob, durationMs, mimeType: recordedMimeType } = await stopped;
      const dataUrl = await blobToDataUrl(blob);

      const frames = frameHistoryRef.current.filter((frame) => frame.t >= startTime && frame.t <= stopTime);
      const metrics = computeTakeMetrics(frames, target.frequency);

      const take = createPracticeTake(
        {
          key: selectedKey,
          hole,
          breath,
          noteName: target.noteName,
          frequency: target.frequency
        },
        metrics
      );

      const withAudio: PracticeTake = {
        ...take,
        audio: {
          mimeType: recordedMimeType,
          dataUrl,
          sizeBytes: blob.size,
          durationMs: Math.round(durationMs)
        },
        tab: currentTab,
        timestamps: tabTimestamps
      };

      setTakes(savePracticeTake(withAudio));
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      setRecordingAudioError(message);
    } finally {
      setRecordingAudio(false);
    }
  }, [breath, hole, recordingAudio, selectedKey, stream, target]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-semibold">Practice Lab</h2>
          <p className="mt-1 max-w-2xl text-sm text-slate-300">
            This runs entirely in your browser. Audio stays local; the app only displays live metrics.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="rounded bg-slate-800 px-2 py-0.5 text-xs text-slate-200">{statusBadge}</span>
          {status === 'listening' ? (
            <button
              className="rounded border border-slate-700 px-3 py-2 text-sm font-semibold text-slate-100 hover:bg-slate-900"
              onClick={() => stop()}
              type="button"
            >
              Stop
            </button>
          ) : (
            <button
              className="rounded bg-indigo-600 px-3 py-2 text-sm font-semibold text-white disabled:opacity-50"
              disabled={!supported || status === 'requesting'}
              onClick={() => start()}
              type="button"
            >
              Start microphone
            </button>
          )}
        </div>
      </div>

      {!supported ? (
        <div className="rounded-lg border border-slate-800 bg-slate-900/30 p-4 text-sm text-slate-300">
          Microphone pitch detection is not supported in this environment.
        </div>
      ) : null}

      {error ? (
        <div className="rounded-lg border border-rose-900/60 bg-rose-950/30 p-4 text-sm text-rose-200">
          {error}
        </div>
      ) : null}

      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-lg border border-slate-800 bg-slate-900/30 p-4">
          <h3 className="text-lg font-semibold">Target note</h3>

          <div className="mt-3 grid gap-3 sm:grid-cols-3">
            <label className="space-y-1">
              <div className="text-xs font-semibold uppercase tracking-wide text-slate-400">Key</div>
              <select
                className="w-full rounded border border-slate-700 bg-slate-950 px-2 py-2 text-sm"
                value={selectedKey}
                onChange={(event) => setSelectedKey(event.target.value as HarmonicaKey)}
              >
                <option value="C">C</option>
                <option value="G">G</option>
                <option value="A">A</option>
              </select>
            </label>

            <label className="space-y-1">
              <div className="text-xs font-semibold uppercase tracking-wide text-slate-400">Hole</div>
              <input
                className="w-full rounded border border-slate-700 bg-slate-950 px-2 py-2 text-sm"
                type="number"
                min={1}
                max={10}
                value={hole}
                onChange={(event) => setHole(Math.max(1, Math.min(10, Number(event.target.value))))}
              />
            </label>

            <label className="space-y-1">
              <div className="text-xs font-semibold uppercase tracking-wide text-slate-400">Breath</div>
              <select
                className="w-full rounded border border-slate-700 bg-slate-950 px-2 py-2 text-sm"
                value={breath}
                onChange={(event) => setBreath(event.target.value as Breath)}
              >
                <option value="blow">blow</option>
                <option value="draw">draw</option>
              </select>
            </label>
          </div>

          <div className="mt-4 space-y-3">
            <div className="rounded border border-slate-800 bg-slate-950/40 p-3">
              {target ? (
                <div className="space-y-1">
                  <div className="text-sm text-slate-300">
                    Target: <span className="font-semibold text-slate-50">{target.noteName}</span>
                  </div>
                  <div className="text-xs text-slate-500">{formatNumber(target.frequency, 2)} Hz</div>
                </div>
              ) : (
                <div className="text-sm text-slate-300">Choose a hole (1–10) and breath (blow/draw).</div>
              )}
            </div>

            <HarmonicaLayout
              harmonicaKey={selectedKey}
              selectedHole={hole}
              selectedBreath={breath}
              onSelect={(nextHole, nextBreath) => {
                setHole(nextHole);
                setBreath(nextBreath);
              }}
            />

            <div className="flex flex-wrap items-center gap-2">
              <button
                className="rounded bg-indigo-600 px-3 py-2 text-sm font-semibold text-white disabled:opacity-50"
                disabled={status !== 'listening' || !target}
                onClick={recordTake}
                type="button"
              >
                Save take (last ~3s)
              </button>
              <button
                className="rounded border border-slate-700 px-3 py-2 text-sm font-semibold text-slate-100 disabled:opacity-50"
                disabled={status !== 'listening' || !target || !audioRecordingSupported || !stream || recordingAudio}
                onClick={() => void recordAudioTake()}
                type="button"
              >
                {recordingAudio ? 'Recording…' : 'Record audio (3s)'}
              </button>
              <button
                className="rounded border border-slate-700 px-3 py-2 text-sm font-semibold text-slate-100 disabled:opacity-50"
                disabled={status !== 'listening'}
                onClick={() => {
                  if (!recordingTab) {
                    setCurrentTab([]);
                    setTabTimestamps([]);
                    startTimeRef.current = performance.now();
                  }
                  setRecordingTab(!recordingTab);
                }}
                type="button"
              >
                {recordingTab ? 'Stop Tab Recording' : 'Record Tab'}
              </button>
              <button
                className="rounded border border-slate-700 px-3 py-2 text-sm font-semibold text-slate-100 disabled:opacity-50"
                disabled={!currentTab.length || !audioContext}
                onClick={() => {
                  if (!currentTab.length) return;
                  let currentTime = 0;
                  currentTab.forEach((tabSymbol, index) => {
                    const midi = tabToMidi(tabSymbol);
                    if (midi && audioContext) {
                      const frequency = 440 * Math.pow(2, (midi - 69) / 12);
                      const duration = index < tabTimestamps.length - 1 ? (tabTimestamps[index + 1] - tabTimestamps[index]) / 1000 : 0.5;
                      setTimeout(() => {
                        setCurrentNoteIndex(index);
                        playTone(audioContext, frequency, duration);
                        setTimeout(() => setCurrentNoteIndex(-1), duration * 1000);
                      }, currentTime * 1000);
                      currentTime += duration;
                    }
                  });
                }}
                type="button"
              >
                Play Tab
              </button>
              <div className="text-xs text-slate-500">
                Tip: long tones work best. Vibrato and bends will confuse detection.
              </div>
            </div>

            {recordingAudioError ? (
              <div className="mt-2 text-xs text-rose-200">{recordingAudioError}</div>
            ) : null}
            {currentTab.length > 0 && (
              <div className="mt-2 text-sm text-slate-300">
                <div className="flex items-center gap-2 mb-2">
                  <button onClick={() => setNotationMode('tab')} className={notationMode === 'tab' ? 'underline' : ''}>Tab</button>
                  <button onClick={() => setNotationMode('staff')} className={notationMode === 'staff' ? 'underline' : ''}>Staff</button>
                </div>
                {notationMode === 'tab' ? (
                  <div>Tab: {currentTab.map((t, i) => <span key={i} style={i === currentNoteIndex ? { color: 'red' } : {}}>{t} </span>)}</div>
                ) : (
                  <StaffNotation tab={currentTab} timestamps={tabTimestamps} currentNoteIndex={currentNoteIndex} />
                )}
              </div>
            )}
          </div>
        </div>

        <div className="rounded-lg border border-slate-800 bg-slate-900/30 p-4">
          <h3 className="text-lg font-semibold">Live detection</h3>

          <div className="mt-3 space-y-3">
            <div className="grid gap-2 sm:grid-cols-2">
              <div className="rounded border border-slate-800 bg-slate-950/40 p-3">
                <div className="text-xs font-semibold uppercase tracking-wide text-slate-400">Detected</div>
                {frequency && noteName ? (
                  <div className="mt-1">
                    <div className="text-lg font-semibold">{noteName}</div>
                    <div className="text-xs text-slate-500">{formatNumber(frequency, 1)} Hz</div>
                  </div>
                ) : (
                  <div className="mt-1 text-sm text-slate-300">—</div>
                )}
              </div>

              <div className="rounded border border-slate-800 bg-slate-950/40 p-3">
                <div className="text-xs font-semibold uppercase tracking-wide text-slate-400">Nearest semitone</div>
                {cents !== null && frequency ? (
                  <div className="mt-1 text-sm text-slate-200">
                    {cents > 0 ? '+' : ''}
                    {formatNumber(cents, 1)} cents
                  </div>
                ) : (
                  <div className="mt-1 text-sm text-slate-300">—</div>
                )}
              </div>
            </div>

            <div className="rounded border border-slate-800 bg-slate-950/40 p-3">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <div className="text-xs font-semibold uppercase tracking-wide text-slate-400">Relative to target</div>
                  {targetCents !== null && targetQuality ? (
                    <div className="mt-1 text-sm text-slate-200">
                      {targetCents > 0 ? '+' : ''}
                      {formatNumber(targetCents, 1)} cents ({targetQuality})
                    </div>
                  ) : (
                    <div className="mt-1 text-sm text-slate-300">—</div>
                  )}
                </div>

                <div className="text-right">
                  <div className="text-xs font-semibold uppercase tracking-wide text-slate-400">Stability</div>
                  {stabilityCents !== null ? (
                    <div className="mt-1 text-sm text-slate-200">±{formatNumber(stabilityCents, 1)} cents</div>
                  ) : (
                    <div className="mt-1 text-sm text-slate-300">—</div>
                  )}
                </div>
              </div>
            </div>

            <div className="rounded border border-slate-800 bg-slate-950/40 p-3">
              <div className="text-xs font-semibold uppercase tracking-wide text-slate-400">Input level</div>
              <div className="mt-2 h-2 w-full rounded bg-slate-800">
                <div
                  className="h-2 rounded bg-indigo-500"
                  style={{ width: `${Math.min(1, Math.max(0, level)) * 100}%` }}
                />
              </div>
              <div className="mt-1 text-xs text-slate-500">Try to play comfortably, not as loud as possible.</div>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <h3 className="text-lg font-semibold">Recent takes</h3>
        {takes.length === 0 ? (
          <div className="rounded-lg border border-slate-800 bg-slate-900/30 p-4 text-sm text-slate-300">
            No takes yet. Start the microphone, play a steady long tone, then click “Save take”.
          </div>
        ) : (
          <div className="grid gap-3">
            {takes.slice(0, 5).map((take) => {
              const feedback = getTakeFeedback(take);
              return (
                <div key={take.id} className="rounded-lg border border-slate-800 bg-slate-900/30 p-4">
                  <div className="flex flex-wrap items-baseline justify-between gap-3">
                    <div className="font-semibold">
                      {take.target.key} · hole {take.target.hole} {take.target.breath} → {take.target.noteName}
                    </div>
                    <div className="text-xs text-slate-500">
                      {new Date(take.createdAt).toLocaleString()}
                    </div>
                  </div>

                  <div className="mt-2 grid gap-2 text-sm text-slate-200 sm:grid-cols-3">
                    <div>
                      <div className="text-xs font-semibold uppercase tracking-wide text-slate-400">Mean</div>
                      <div>
                        {take.metrics.meanCents === null
                          ? '—'
                          : `${take.metrics.meanCents > 0 ? '+' : ''}${formatNumber(take.metrics.meanCents, 1)} cents`}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs font-semibold uppercase tracking-wide text-slate-400">Stability</div>
                      <div>
                        {take.metrics.stabilityCents === null ? '—' : `±${formatNumber(take.metrics.stabilityCents, 1)} cents`}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs font-semibold uppercase tracking-wide text-slate-400">Voiced</div>
                      <div>{Math.round(take.metrics.voicedPercent * 100)}%</div>
                    </div>
                  </div>

                  <div className="mt-3 space-y-1 text-sm text-slate-300">
                    {feedback.map((line) => (
                      <div key={line}>{line}</div>
                    ))}
                  </div>

                  {take.audio ? (
                    <audio className="mt-3 w-full" controls src={take.audio.dataUrl} />
                  ) : null}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
