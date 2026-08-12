import { useState, useEffect } from 'react';
import { initAudioEngine, suspendAudioEngine, resumeAudioEngine, setFaustParam } from '../../audio/BassSynthNode';

interface InteractiveSequencerProps {
  onClose: () => void;
}

const NOTE_NAMES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

export const InteractiveSequencer = ({ onClose: _onClose }: InteractiveSequencerProps) => {
  const [isAudioReady, setIsAudioReady] = useState(false);
  const [isPlaying, setIsPlaying]       = useState(false);
  const [isLoading, setIsLoading]       = useState(false);

  // Global Controls
  const [bpm, setBpm]                     = useState(120);
  const [octave, setOctave]               = useState(0);
  const [slowMotion, setSlowMotion]       = useState(0);
  const [dynamicWeight, setDynamicWeight] = useState(0);
  const [saturation, setSaturation]       = useState(0);

  // 8-step sequencer — ALL steps start on C (note=0), user picks each note freely
  const [steps, setSteps] = useState(
    Array.from({ length: 8 }).map((_, i) => ({
      active: i === 0,
      note: 0, // All start on C — user chooses each one independently
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
      <div className="flex items-center bg-black/60 px-4 py-3 border-b border-cyan-500/20 gap-4">
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

      <div className="flex-1 overflow-y-auto p-4 space-y-6">

        {/* ── Global Controls ── */}
        <div>
          <h4 className="text-slate-400 uppercase tracking-widest mb-3 border-b border-slate-700 pb-2">Global Parameters</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { label: 'BPM',           val: bpm,           setter: setBpm,           param: 'BPM',          min: 40,  max: 240, step: 1,     fmt: (v: number) => v.toString() },
              { label: 'Octava Base',   val: octave,        setter: setOctave,        param: 'Octava_Base',  min: -2,  max: 2,   step: 1,     fmt: (v: number) => v.toString() },
              { label: 'Cámara Lenta',  val: slowMotion,    setter: setSlowMotion,    param: 'Camara_Lenta', min: 0,   max: 1,   step: 0.01,  fmt: (v: number) => v.toFixed(2) },
              { label: 'Peso Dinámico', val: dynamicWeight, setter: setDynamicWeight, param: 'Peso_Dinamico',min: 0,   max: 1,   step: 0.01,  fmt: (v: number) => v.toFixed(2) },
              { label: 'Saturación',    val: saturation,    setter: setSaturation,    param: 'Saturacion',   min: 0,   max: 1,   step: 0.001, fmt: (v: number) => v.toFixed(3) },
            ].map(({ label, val, setter, param, min, max, step, fmt }) => (
              <div key={param} className="flex flex-col gap-1">
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
          <h4 className="text-slate-400 uppercase tracking-widest mb-1 border-b border-slate-700 pb-2">8-Step Sequencer</h4>
          <p className="text-slate-600 text-[10px] mb-3">Activa el pad · selecciona la nota libremente en cada paso</p>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
            {steps.map((step, i) => {
              const activeName = NOTE_NAMES[step.note];

              return (
                <div
                  key={i}
                  className={`flex flex-col rounded-lg border transition-all duration-200 overflow-hidden
                    ${step.active
                      ? 'border-cyan-400/60 bg-slate-800/80'
                      : 'border-slate-700 bg-slate-900/60'}
                  `}
                >
                  {/* ── Top: step label + active toggle ── */}
                  <button
                    onClick={() => handleStepActiveToggle(i)}
                    className={`flex items-center justify-between px-2 py-1.5 w-full transition-colors
                      ${step.active
                        ? 'bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300'
                        : 'bg-slate-800 hover:bg-slate-700 text-slate-500'}
                    `}
                  >
                    <span className="text-[10px] tracking-wider">S{i + 1}</span>
                    <span className="text-sm font-bold">{activeName}</span>
                    <div className={`w-2 h-2 rounded-full flex-shrink-0 ${
                      step.active ? 'bg-cyan-400 shadow-[0_0_6px_theme(colors.cyan.400)]' : 'bg-slate-600'
                    }`} />
                  </button>

                  {/* ── Note picker: 12 note buttons ── */}
                  <div className="grid grid-cols-4 gap-px p-1 bg-black/40">
                    {NOTE_NAMES.map((name, noteIdx) => {
                      const isSelected = step.note === noteIdx;
                      const isSharp    = name.includes('#');
                      return (
                        <button
                          key={noteIdx}
                          onClick={() => handleStepNoteChange(i, noteIdx)}
                          title={name}
                          className={`
                            text-[9px] font-bold py-1 rounded transition-all leading-none
                            ${isSelected
                              ? isSharp
                                ? 'bg-cyan-400 text-black'
                                : 'bg-cyan-300 text-black'
                              : isSharp
                                ? 'bg-slate-700 text-slate-400 hover:bg-slate-600'
                                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                            }
                          `}
                        >
                          {name}
                        </button>
                      );
                    })}
                  </div>

                  {/* ── Bottom: octave display ── */}
                  <div className="text-center text-[9px] text-slate-600 py-1 bg-black/20">
                    {activeName}{4 + octave}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
};
