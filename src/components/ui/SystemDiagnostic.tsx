import { useState, useEffect } from 'react';
import { AlertTriangle, Cpu, Volume2, CheckCircle } from 'lucide-react';

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────
interface SystemRequirements {
  webgl: boolean;
  audioWorklet: boolean;
}

interface SystemDiagnosticProps {
  children: React.ReactNode;
}

// ─────────────────────────────────────────────────────────────────────────────
// SystemDiagnostic
// Wraps DSP-heavy children behind a hardware feature detection gate.
// If the device lacks WebGL or AudioWorklet support, shows a cyberpunk fallback
// screen instead of a blank crash.
// ─────────────────────────────────────────────────────────────────────────────
export function SystemDiagnostic({ children }: SystemDiagnosticProps) {
  const [specs, setSpecs] = useState<SystemRequirements | null>(null);
  const [override, setOverride] = useState(false);

  useEffect(() => {
    // ── 1. Detect WebGL / WebGL2 ──────────────────────────────────────────
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl2') ?? canvas.getContext('webgl');

    // ── 2. Detect AudioWorklet ────────────────────────────────────────────
    // We check the prototype of a constructed AudioContext — or webkitAudioContext
    // on older Safari — to confirm AudioWorklet exists before we ever try to use it.
    const AudioCtx: typeof AudioContext | undefined =
      window.AudioContext ?? (window as unknown as Record<string, unknown>).webkitAudioContext as typeof AudioContext | undefined;
    const hasAudioWorklet =
      AudioCtx !== undefined && 'audioWorklet' in AudioCtx.prototype;

    setSpecs({
      webgl: !!gl,
      audioWorklet: hasAudioWorklet,
    });
  }, []);

  // While detection is running, render nothing (avoids flash of wrong content)
  if (!specs) return null;

  const isHardwareSufficient = specs.webgl && specs.audioWorklet;

  // All checks pass, or user bypassed — render the actual content
  if (isHardwareSufficient || override) {
    return <>{children}</>;
  }

  // ── FALLBACK SCREEN ──────────────────────────────────────────────────────
  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-4 font-mono bg-black/80 rounded-xl">
      <div className="max-w-sm w-full border border-red-500/50 bg-red-950/20 p-5 rounded-lg shadow-[0_0_30px_rgba(239,68,68,0.12)] relative overflow-hidden">

        {/* Scanline overlay */}
        <div
          aria-hidden="true"
          className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(239,68,68,0.04)_1px,transparent_1px)] bg-[size:100%_4px]"
        />

        {/* Header */}
        <div className="flex items-center gap-3 mb-5 border-b border-red-500/30 pb-4 relative">
          <AlertTriangle className="w-6 h-6 text-red-500 animate-pulse flex-shrink-0" />
          <h2 className="text-base font-bold tracking-widest uppercase text-red-500">
            SYSTEM WARNING
          </h2>
        </div>

        <p className="text-red-400/80 text-xs mb-5 leading-relaxed relative">
          This device's environment is missing one or more APIs required to run
          the WASM DSP engine or hardware-accelerated graphics.
        </p>

        {/* Diagnostic rows */}
        <div className="space-y-3 mb-6 relative">
          {[
            {
              icon: <Cpu className="w-3.5 h-3.5" />,
              label: 'WEBGL ACCELERATION',
              pass: specs.webgl,
            },
            {
              icon: <Volume2 className="w-3.5 h-3.5" />,
              label: 'AUDIOWORKLET API',
              pass: specs.audioWorklet,
            },
          ].map(({ icon, label, pass }) => (
            <div
              key={label}
              className="flex items-center justify-between bg-black/40 px-3 py-2 border border-red-500/20 rounded"
            >
              <span className="text-[10px] text-red-400 flex items-center gap-2">
                {icon}
                {label}
              </span>
              {pass ? (
                <span className="text-green-400 flex items-center gap-1 text-[10px]">
                  <CheckCircle className="w-3 h-3" />
                  PASS
                </span>
              ) : (
                <span className="text-red-500 text-[10px] font-bold">FAIL</span>
              )}
            </div>
          ))}
        </div>

        {/* Override button */}
        <button
          id="system-diagnostic-bypass-btn"
          onClick={() => setOverride(true)}
          className="w-full py-3 border border-red-500 hover:bg-red-500/10 text-red-500 text-[10px] font-bold tracking-[0.2em] transition-all uppercase rounded relative"
        >
          BYPASS :: LOAD DEGRADED MODE
        </button>
      </div>
    </div>
  );
}
