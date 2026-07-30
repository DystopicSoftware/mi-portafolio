import { FaustMonoDspGenerator, FaustMonoAudioWorkletNode } from '@grame/faustwasm';

let audioContext: AudioContext | null = null;
let faustNode: FaustMonoAudioWorkletNode | null = null;
let generator: FaustMonoDspGenerator | null = null;

export async function initAudioEngine(): Promise<FaustMonoAudioWorkletNode> {
  if (faustNode) return faustNode;

  // 1. Initialize AudioContext
  const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
  audioContext = new AudioCtx({ latencyHint: 'interactive' });
  
  if (audioContext.state === 'suspended') {
    await audioContext.resume();
  }

  // 2. Fetch DSP Meta and Wasm Module
  // Using absolute paths to the public directory
  const dspMetaRes = await fetch('/assets/audio/dsp-meta.json');
  const dspMeta = await dspMetaRes.json();
  
  // We use ArrayBuffer fallback for safety in PWAs and Vite static serving
  const wasmRes = await fetch('/assets/audio/dsp-module.wasm');
  const wasmBuffer = await wasmRes.arrayBuffer();
  const dspModule = await WebAssembly.compile(wasmBuffer);

  // 3. Create Generator and Node
  generator = new FaustMonoDspGenerator();
  
  faustNode = await generator.createNode(
    audioContext,
    'bass', // DSP Name
    {
      module: dspModule,
      json: JSON.stringify(dspMeta),
      soundfiles: {}
    },
    false // useScriptProcessor = false (use AudioWorklet)
  ) as FaustMonoAudioWorkletNode;

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
