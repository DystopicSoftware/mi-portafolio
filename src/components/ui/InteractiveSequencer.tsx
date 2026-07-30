import { useState, useEffect } from 'react';
import { initAudioEngine, suspendAudioEngine, resumeAudioEngine, setFaustParam } from '../../audio/BassSynthNode';

interface InteractiveSequencerProps {
  onClose: () => void;
}

export const InteractiveSequencer = ({ onClose: _onClose }: InteractiveSequencerProps) => {
  const [isAudioReady, setIsAudioReady] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Global Controls
  const [bpm, setBpm] = useState(120);
  const [octave, setOctave] = useState(0);
  const [slowMotion, setSlowMotion] = useState(0);
  const [dynamicWeight, setDynamicWeight] = useState(0);
  const [saturation, setSaturation] = useState(0);

  // Sequencer Steps (8 steps)
  // Each step has { active: boolean, note: number }
  const [steps, setSteps] = useState(
    Array.from({ length: 8 }).map((_, i) => ({
      active: i === 0, // Enable the first step by default
      note: i % 12,
    }))
  );

  const startAudio = async () => {
    setIsLoading(true);
    try {
      await initAudioEngine();
      setIsAudioReady(true);
      setIsPlaying(true);
      
      // Initialize with default state
      setFaustParam('/bass/Control/BPM', 120);
      setFaustParam('/bass/Control/Octava_Base', 0);
      setFaustParam('/bass/Control/Camara_Lenta', 0);
      setFaustParam('/bass/Control/Peso_Dinamico', 0);
      setFaustParam('/bass/Control/Saturacion', 0);

      // Initialize default sequencer values
      steps.forEach((step, i) => {
        setFaustParam(`/bass/Secuenciador/Paso_${i + 1}/Activo`, step.active ? 1 : 0);
        setFaustParam(`/bass/Secuenciador/Paso_${i + 1}/Nota__0-11_`, step.note);
      });

    } catch (e) {
      console.error("Failed to start audio engine", e);
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
    const newSteps = [...steps];
    newSteps[index].active = !newSteps[index].active;
    setSteps(newSteps);
    setFaustParam(`/bass/Secuenciador/Paso_${index + 1}/Activo`, newSteps[index].active ? 1 : 0);
  };

  const handleStepNoteChange = (index: number, note: number) => {
    const newSteps = [...steps];
    newSteps[index].note = note;
    setSteps(newSteps);
    setFaustParam(`/bass/Secuenciador/Paso_${index + 1}/Nota__0-11_`, note);
  };

  useEffect(() => {
    // Cleanup: Suspend audio when the modal is closed
    return () => {
      suspendAudioEngine();
    };
  }, []);

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

  return (
    <div className="flex flex-col h-full w-full bg-slate-900/90 rounded-xl border border-cyan-500/30 overflow-hidden font-mono text-xs">
      {/* Header */}
      <div className="flex justify-between items-center bg-black/60 p-4 border-b border-cyan-500/20">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${isPlaying ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
            <span className="text-cyan-400 font-bold tracking-widest uppercase">WASM DSP ENGINE : {isPlaying ? 'RUNNING' : 'SUSPENDED'}</span>
          </div>
          <button 
            onClick={togglePlay}
            className="ml-4 px-3 py-1 bg-slate-800 hover:bg-slate-700 border border-slate-600 text-slate-300 rounded"
          >
            {isPlaying ? 'PAUSE' : 'PLAY'}
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-8">
        
        {/* Global Controls */}
        <div>
          <h4 className="text-slate-400 uppercase tracking-widest mb-4 border-b border-slate-700 pb-2">Global Parameters</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            <div className="flex flex-col gap-2">
              <label className="text-cyan-300 flex justify-between">
                <span>BPM</span>
                <span className="text-slate-400">{bpm}</span>
              </label>
              <input type="range" min="40" max="240" value={bpm} onChange={(e) => handleGlobalChange('BPM', parseInt(e.target.value), setBpm)} className="accent-cyan-500" />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-cyan-300 flex justify-between">
                <span>Octava Base</span>
                <span className="text-slate-400">{octave}</span>
              </label>
              <input type="range" min="-2" max="2" value={octave} onChange={(e) => handleGlobalChange('Octava_Base', parseInt(e.target.value), setOctave)} className="accent-cyan-500" />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-cyan-300 flex justify-between">
                <span>Cámara Lenta (SlowMo)</span>
                <span className="text-slate-400">{slowMotion.toFixed(2)}</span>
              </label>
              <input type="range" min="0" max="1" step="0.01" value={slowMotion} onChange={(e) => handleGlobalChange('Camara_Lenta', parseFloat(e.target.value), setSlowMotion)} className="accent-cyan-500" />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-cyan-300 flex justify-between">
                <span>Peso Dinámico (Damp)</span>
                <span className="text-slate-400">{dynamicWeight.toFixed(2)}</span>
              </label>
              <input type="range" min="0" max="1" step="0.01" value={dynamicWeight} onChange={(e) => handleGlobalChange('Peso_Dinamico', parseFloat(e.target.value), setDynamicWeight)} className="accent-cyan-500" />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-cyan-300 flex justify-between">
                <span>Saturación (Drive)</span>
                <span className="text-slate-400">{saturation.toFixed(3)}</span>
              </label>
              <input type="range" min="0" max="1" step="0.001" value={saturation} onChange={(e) => handleGlobalChange('Saturacion', parseFloat(e.target.value), setSaturation)} className="accent-cyan-500" />
            </div>

          </div>
        </div>

        {/* Sequencer */}
        <div>
          <h4 className="text-slate-400 uppercase tracking-widest mb-4 border-b border-slate-700 pb-2">8-Step Sequencer</h4>
          <div className="grid grid-cols-4 lg:grid-cols-8 gap-3">
            {steps.map((step, i) => (
              <div key={i} className={`flex flex-col items-center p-3 rounded border transition-all ${step.active ? 'border-cyan-400/50 bg-cyan-900/20' : 'border-slate-800 bg-slate-900'}`}>
                <div className="text-slate-500 mb-2">S{i + 1}</div>
                
                <button 
                  onClick={() => handleStepActiveToggle(i)}
                  className={`w-8 h-8 rounded-full mb-4 flex items-center justify-center transition-all ${step.active ? 'bg-cyan-500 shadow-[0_0_15px_rgba(6,182,212,0.5)]' : 'bg-slate-700'}`}
                />
                
                <div className="w-full text-center text-[10px] text-cyan-300 mb-1">
                  Note: {step.note}
                </div>
                <input 
                  type="range" 
                  min="0" max="11" 
                  value={step.note} 
                  onChange={(e) => handleStepNoteChange(i, parseInt(e.target.value))} 
                  className="w-full appearance-none h-1 bg-slate-700 accent-cyan-400"
                />
              </div>
            ))}
          </div>
        </div>
        
      </div>
    </div>
  );
};
