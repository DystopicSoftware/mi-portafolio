import { useState, useEffect } from 'react';
import { initAudioEngine, suspendAudioEngine, resumeAudioEngine, setFaustParam } from '../../audio/BassSynthNode';

interface InteractiveSequencerProps {
  onClose: () => void;
}

const NOTE_NAMES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

// Chromatic wheel color per note
const NOTE_COLORS: Record<number, string> = {
  0:  'text-cyan-300    border-cyan-400/60    bg-cyan-900/20',
  1:  'text-blue-300    border-blue-400/60    bg-blue-900/20',
  2:  'text-indigo-300  border-indigo-400/60  bg-indigo-900/20',
  3:  'text-violet-300  border-violet-400/60  bg-violet-900/20',
  4:  'text-purple-300  border-purple-400/60  bg-purple-900/20',
  5:  'text-fuchsia-300 border-fuchsia-400/60 bg-fuchsia-900/20',
  6:  'text-pink-300    border-pink-400/60    bg-pink-900/20',
  7:  'text-rose-300    border-rose-400/60    bg-rose-900/20',
  8:  'text-orange-300  border-orange-400/60  bg-orange-900/20',
  9:  'text-amber-300   border-amber-400/60   bg-amber-900/20',
  10: 'text-yellow-300  border-yellow-400/60  bg-yellow-900/20',
  11: 'text-lime-300    border-lime-400/60    bg-lime-900/20',
};

export const InteractiveSequencer = ({ onClose: _onClose }: InteractiveSequencerProps) => {
  const [isAudioReady, setIsAudioReady] = useState(false);
  const [isPlaying, setIsPlaying]       = useState(false);
  const [isLoading, setIsLoading]       = useState(false);

  // Global Controls
  const [bpm, setBpm]                   = useState(120);
  const [octave, setOctave]             = useState(0);
  const [slowMotion, setSlowMotion]     = useState(0);
  const [dynamicWeight, setDynamicWeight] = useState(0);
  const [saturation, setSaturation]     = useState(0);

  // 8-step sequencer — each step: { active, note (0-11) }
  const [steps, setSteps] = useState(
    Array.from({ length: 8 }).map((_, i) => ({
      active: i === 0,
      note: i % 12,
    }))
  );

  // ── Audio init ───────────────────────────────────────────────────────────────
  const startAudio = async () => {
    setIsLoading(true);
    try {
      await initAudioEngine();
      setIsAudioReady(true);
      setIsPlaying(true);

      setFaustParam('/bass/Control/BPM', 120);
      setFaustParam('/bass/Control/Octava_Base', 0);
      setFaustParam('/bass/Control/Camara_Lenta', 0);
      setFaustParam('/bass/Control/Peso_Dinamico', 0);
      setFaustParam('/bass/Control/Saturacion', 0);

      steps.forEach((step, i) => {
        setFaustParam(`/bass/Secuenciador/Paso_${i + 1}/Activo`, step.active ? 1 : 0);
        setFaustParam(`/bass/Secuenciador/Paso_${i + 1}/Nota__0-11_`, step.note);
      });
    } catch (e) {
      console.error('Failed to start audio engine', e);
    }
    setIsLoading(false);
  };

  const togglePlay = async () => {
    if (isPlaying) {
      await suspendAudioEngine();
      setIsPlaying(false);
    } else {
      await resumeAudioEngine();
      setIsPlaying(true);
    }
  };

  const handleGlobalChange = (param: string, val: number, setter: (v: number) => void) => {
    setter(val);
    setFaustParam(`/bass/Control/${param}`, val);
  };

  const handleStepActiveToggle = (index: number) => {
    const newSteps = steps.map((s, i) => (i === index ? { ...s, active: !s.active } : s));
    setSteps(newSteps);
    setFaustParam(`/bass/Secuenciador/Paso_${index + 1}/Activo`, newSteps[index].active ? 1 : 0);
  };

  const handleStepNoteChange = (index: number, note: number) => {
    const newSteps = steps.map((s, i) => (i === index ? { ...s, note } : s));
    setSteps(newSteps);
    setFaustParam(`/bass/Secuenciador/Paso_${index + 1}/Nota__0-11_`, note);
  };

  useEffect(() => {
    return () => { suspendAudioEngine(); };
  }, []);

  // ── INIT SCREEN ──────────────────────────────────────────────────────────────
  if (!isAudioReady) {
    return (
      <div className="flex flex-col items-center justify-center h-full w-full bg-black/80 rounded-xl border border-cyan-500/30 p-8 text-center">
        <h3 className="text-2xl font-bold text-cyan-400 mb-4 tracking-widest font-mono">DSP BASS SYNTH ENGINE</h3>
        <p className="text-slate-400 mb-8 max-w-md font-mono text-sm">
          Warning: This interactive demo compiles a Karplus-Strong physical model into WebAssembly and runs natively in your browser using the Web Audio API.
        </p>
        <button
          onClick={startAudio}
          disabled={isLoading}
          className="px-8 py-4 bg-cyan-500/10 hover:bg-cyan-500/30 border border-cyan-400 text-cyan-400 font-mono font-bold tracking-widest uppercase transition-all flex items-center gap-2 group"
        >
          {isLoading ? (
            <span className="animate-pulse">INITIALIZING COMPILER...</span>
          ) : (
            <>
              <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
              </svg>
              INITIATE AUDIO ENGINE
            </>
          )}
        </button>
      </div>
    );
  }

  // ── MAIN UI ──────────────────────────────────────────────────────────────────
  return (
    <div className="flex flex-col h-full w-full bg-slate-900/90 rounded-xl border border-cyan-500/30 overflow-hidden font-mono text-xs">

      {/* Header */}
      <div className="flex items-center bg-black/60 p-4 border-b border-cyan-500/20 gap-4">
        <div className={`w-2 h-2 rounded-full flex-shrink-0 ${isPlaying ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
        <span className="text-cyan-400 font-bold tracking-widest uppercase flex-1">
          WASM DSP ENGINE : {isPlaying ? 'RUNNING' : 'SUSPENDED'}
        </span>
        <button
          onClick={togglePlay}
          className="px-3 py-1 bg-slate-800 hover:bg-slate-700 border border-slate-600 text-slate-300 rounded transition-colors"
        >
          {isPlaying ? 'PAUSE' : 'PLAY'}
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-8">

        {/* ── Global Controls ── */}
        <div>
          <h4 className="text-slate-400 uppercase tracking-widest mb-4 border-b border-slate-700 pb-2">Global Parameters</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

            {[
              { label: 'BPM',           val: bpm,           setter: setBpm,           param: 'BPM',         min: 40,  max: 240,  step: 1,     fmt: (v: number) => v.toString() },
              { label: 'Octava Base',   val: octave,        setter: setOctave,        param: 'Octava_Base', min: -2,  max: 2,    step: 1,     fmt: (v: number) => v.toString() },
              { label: 'Cámara Lenta',  val: slowMotion,    setter: setSlowMotion,    param: 'Camara_Lenta',min: 0,   max: 1,    step: 0.01,  fmt: (v: number) => v.toFixed(2) },
              { label: 'Peso Dinámico', val: dynamicWeight, setter: setDynamicWeight, param: 'Peso_Dinamico',min: 0,  max: 1,    step: 0.01,  fmt: (v: number) => v.toFixed(2) },
              { label: 'Saturación',    val: saturation,    setter: setSaturation,    param: 'Saturacion',  min: 0,   max: 1,    step: 0.001, fmt: (v: number) => v.toFixed(3) },
            ].map(({ label, val, setter, param, min, max, step, fmt }) => (
              <div key={param} className="flex flex-col gap-2">
                <label className="text-cyan-300 flex justify-between">
                  <span>{label}</span>
                  <span className="text-slate-400">{fmt(val)}</span>
                </label>
                <input
                  type="range" min={min} max={max} step={step} value={val}
                  onChange={(e) => handleGlobalChange(param, parseFloat(e.target.value), setter as (v: number) => void)}
                  className="accent-cyan-500"
                />
              </div>
            ))}

          </div>
        </div>

        {/* ── 8-Step Sequencer ── */}
        <div>
          <h4 className="text-slate-400 uppercase tracking-widest mb-1 border-b border-slate-700 pb-2">
            8-Step Sequencer
          </h4>
          <p className="text-slate-600 text-[10px] mb-4">Click pad to toggle · Drag slider to change note</p>

          <div className="grid grid-cols-4 lg:grid-cols-8 gap-3">
            {steps.map((step, i) => {
              const noteName  = NOTE_NAMES[step.note];
              const isSharp   = noteName.includes('#');
              const noteColor = NOTE_COLORS[step.note];

              return (
                <div
                  key={i}
                  onClick={() => handleStepActiveToggle(i)}
                  className={`
                    flex flex-col items-center gap-2 p-3 rounded-lg border-2
                    transition-all duration-200 cursor-pointer select-none
                    ${step.active ? noteColor : 'border-slate-700 bg-slate-900/60 text-slate-600'}
                  `}
                >
                  {/* Step label */}
                  <span className="text-[10px] tracking-wider opacity-60">S{i + 1}</span>

                  {/* Note name — large & chromatic */}
                  <div className={`text-xl font-bold leading-none ${step.active ? '' : 'opacity-25'}`}>
                    {noteName[0]}
                    {isSharp && <span className="text-sm align-top leading-none">#</span>}
                  </div>

                  {/* LED indicator */}
                  <div className={`w-2.5 h-2.5 rounded-full transition-all flex-shrink-0 ${
                    step.active ? 'bg-current shadow-[0_0_10px_currentColor]' : 'bg-slate-700'
                  }`} />

                  {/* Note slider — stopPropagation prevents toggling while dragging */}
                  <input
                    type="range"
                    min="0" max="11"
                    value={step.note}
                    onClick={(e) => e.stopPropagation()}
                    onChange={(e) => {
                      e.stopPropagation();
                      handleStepNoteChange(i, parseInt(e.target.value));
                    }}
                    className="w-full h-1 accent-current appearance-none bg-slate-700 rounded cursor-pointer"
                    title={`Nota: ${noteName}`}
                  />

                  {/* Full note + octave label */}
                  <span className="text-[9px] opacity-40 leading-none">
                    {noteName}{4 + octave}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
};
