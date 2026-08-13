import type { FaustMonoAudioWorkletNode } from '@grame/faustwasm';

let audioContext: AudioContext | null = null;
let faustNode: FaustMonoAudioWorkletNode | null = null;

// ─────────────────────────────────────────────────────────────────────────────
// preWarmAudioContext
// Call this synchronously inside a user-gesture handler (onClick / onTouchStart).
// iOS Safari requires the AudioContext to be created AND resumed within the
// synchronous call stack of a user event — if we defer it to after an async
// import() the context gets auto-suspended again and audio silently fails.
// ─────────────────────────────────────────────────────────────────────────────
export function preWarmAudioContext(): void {
  if (audioContext) return; // already warmed

  const AudioCtx =
    window.AudioContext ??
    (window as unknown as Record<string, unknown>).webkitAudioContext as typeof AudioContext;

  audioContext = new AudioCtx({ latencyHint: 'interactive' });

  // Resume immediately while we are still inside the user-gesture callstack.
  // The Promise returned by resume() does not need to be awaited here — the
  // act of calling it while in-gesture is what unlocks Safari's audio sandbox.
  if (audioContext.state === 'suspended') {
    audioContext.resume().catch(() => {
      // Swallow: if this fails, initAudioEngine will retry.
    });
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// initAudioEngine
// Reuses a pre-warmed context if available, then loads the WASM DSP module.
// Always call preWarmAudioContext() inside the onClick/onTouchStart handler
// BEFORE awaiting this function.
// ─────────────────────────────────────────────────────────────────────────────
export async function initAudioEngine(): Promise<FaustMonoAudioWorkletNode> {
  if (faustNode) return faustNode;

  // 1. Reuse pre-warmed context, or create a fresh one as fallback
  if (!audioContext) {
    const AudioCtx =
      window.AudioContext ??
      (window as unknown as Record<string, unknown>).webkitAudioContext as typeof AudioContext;
    audioContext = new AudioCtx({ latencyHint: 'interactive' });
  }

  // Ensure the context is running before we load the worklet
  if (audioContext.state === 'suspended') {
    await audioContext.resume();
  }

  // 2. Load the unbundled create-node.js from public directory.
  // This bypasses Vite's minifier which breaks the AudioWorklet processor string.
  // @ts-ignore: This module is resolved by Vite at runtime from the public folder
  const faustModule = await import(/* @vite-ignore */ '/assets/audio/create-node.js');

  // 3. Create the Faust node using the faust2wasm generated wrapper
  const result = await faustModule.createFaustNode(audioContext, 'bass', 0);
  faustNode = result.faustNode as FaustMonoAudioWorkletNode;

  if (!faustNode) {
    throw new Error('Failed to create Faust Audio Node');
  }

  // 4. Connect to destination (speakers)
  faustNode.connect(audioContext.destination);

  return faustNode;
}

export function getFaustNode(): FaustMonoAudioWorkletNode | null {
  return faustNode;
}

export async function suspendAudioEngine() {
  if (audioContext && audioContext.state === 'running') {
    await audioContext.suspend();
  }
}

export async function resumeAudioEngine() {
  if (audioContext && audioContext.state === 'suspended') {
    await audioContext.resume();
  }
}

export function setFaustParam(path: string, value: number) {
  if (faustNode) {
    faustNode.setParamValue(path, value);
  }
}
