import type { FaustMonoAudioWorkletNode } from '@grame/faustwasm';

let audioContext: AudioContext | null = null;
let faustNode: FaustMonoAudioWorkletNode | null = null;

export async function initAudioEngine(): Promise<FaustMonoAudioWorkletNode> {
  if (faustNode) return faustNode;

  // 1. Initialize AudioContext
  const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
  audioContext = new AudioCtx({ latencyHint: 'interactive' });
  
  if (audioContext.state === 'suspended') {
    await audioContext.resume();
  }

  // 2. Load the unbundled create-node.js from public directory.
  // This bypasses Vite's minifier which breaks the AudioWorklet processor string ('UM is not defined')
  // @ts-ignore: This module is resolved by Vite at runtime from the public folder
  const faustModule = await import(/* @vite-ignore */ '/assets/audio/create-node.js');
  
  // 3. Create the node using the faust2wasm generated wrapper
  const result = await faustModule.createFaustNode(audioContext, "bass", 0);
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
