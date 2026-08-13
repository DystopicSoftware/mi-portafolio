# 🌐 Juan Esteban Villada Sierra — Portfolio Web

> **Electronic Engineer** | Edge AI · Embedded DSP · Full-Stack  
> Universidad Nacional de Colombia (UNAL) — Graduating Dec 2026  
> 🔗 [portafolioweb-lilac.vercel.app](https://portafolioweb-lilac.vercel.app) · [linkedin.com/in/juan-villada-sierra](https://linkedin.com/in/juan-villada-sierra)

A high-performance, cyberpunk-aesthetic portfolio SPA built with **React 18 + Vite + TypeScript**, featuring a live WebAssembly DSP synthesizer, Three.js background, and a fully bilingual i18n system — all compiled to a sub-150KB bundle with zero external i18n dependencies.

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 18 + Vite + TypeScript (strict) |
| Styling | TailwindCSS v4 — Cyberpunk / Deep Tech aesthetic |
| 3D / WebGL | React Three Fiber · Three.js · Bloom post-processing |
| Animations | Framer Motion — spring physics, `layoutId` transitions |
| State | Zustand 5 — with `persist` middleware (selective) |
| Audio DSP | Faust → WebAssembly → Web Audio API (`AudioWorklet`) |
| Deploy | Vercel (auto-deploy on push) |

---

## 🎛 Projects Showcased

- **DSP Bass Synth** — Karplus-Strong synthesizer implemented in Verilog (FPGA, Q15 fixed-point, 2.1ms latency) and cross-compiled to WebAssembly via Faust. Runs as a live 8-step melodic sequencer in the browser.
- **Antioquia Zana 3D** — Scientific outreach SPA with React Three Fiber, 60 FPS GPU rendering, and zero memory leaks.
- **RestauranteIA / Local Agents** — 100% offline multi-agent system using Llama 3.1 (Ollama), LangChain Tool Calling, Pydantic strict typing, and SQLite. Zero cloud dependency.
- **AI Terminal (this portfolio)** — Embedded chat assistant powered by a FastAPI backend running on Vercel Serverless Functions, calling `llama-3.3-70b-versatile` via the Groq Inference API. Responds in character as Juan's portfolio agent.

---

## ⚙️ Arquitectura y Optimizaciones Avanzadas (Frontend & DSP)

The following engineering decisions go beyond typical portfolio implementations. They were designed to guarantee stability, performance, and correctness across the full spectrum of production environments — from a flagship desktop browser to an aging mobile WebKit sandbox.

---

### 1 · Mobile Stabilization & GPU Gating

**Problem:** Mobile browsers (iOS Safari, Android Chrome) impose strict hardware and policy constraints that make naive deployments of WebGL + WebAudio crash silently or consume all available GPU memory.

**Solutions implemented:**

- **Feature Detection Gate (`SystemDiagnostic.tsx`)** — Before mounting the WASM DSP module or any WebGL surface, a runtime capability probe runs:
  ```ts
  const gl = canvas.getContext('webgl2') ?? canvas.getContext('webgl');
  const hasAudioWorklet = 'audioWorklet' in AudioContext.prototype;
  ```
  If either check fails, a Cyberpunk-themed hardware warning screen is rendered instead of a blank crash. Users can bypass it explicitly ("Degraded Mode"), preserving their agency.

- **GPU Memory Budget (`dpr` clamping)** — The Three.js `<Canvas>` is initialized with `dpr={[1, 1.5]}`. This caps the Device Pixel Ratio at 1.5× regardless of the physical screen (some flagship phones report `dpr=3`). Rendering at 3× resolution triples the VRAM demand and kills the browser tab. The `1.5` ceiling preserves visual quality while staying within mobile GPU budgets.

- **iOS Safari `AudioContext` Pre-warming** — Safari enforces that `AudioContext` must be **created and resumed within the synchronous callstack of a user gesture**. If deferred to after an `async import()` of the WASM module, the context enters `suspended` state and audio fails silently. The fix:
  ```ts
  // BassSynthNode.ts
  export function preWarmAudioContext(): void {
    audioContext = new AudioContext({ latencyHint: 'interactive' });
    if (audioContext.state === 'suspended') audioContext.resume();
    // ↑ Called synchronously inside onClick/onTouchStart —
    //   BEFORE the async WASM import() begins.
  }
  ```
  The button exposes both `onClick` and `onTouchStart` handlers, guaranteeing gesture attribution on all mobile engines.

---

### 2 · Virtual DOM Resilience Against Browser Translators

**Problem:** When users activate Google Translate or Safari AutoTranslate, the browser engine injects `<font>` wrapper elements around text nodes, mutating the live DOM without React's knowledge. When React or Framer Motion subsequently attempt to `removeChild()` a node that has been relocated inside a `<font>` wrapper, a fatal `NotFoundError` is thrown — the Virtual DOM and the real DOM are desynchronized.

**Solutions implemented:**

- **Strategic `translate="no"` isolation** — The `InteractiveSequencer` component and the fullscreen overlay `<motion.div>` both carry `translate="no"` and `className="notranslate"` on their root elements. This tells every browser translation engine to skip these subtrees entirely. The rationale: DSP parameter names (`BPM`, `Saturacion`, `Karplus-Strong`), note names (`C#`, `G`, `D#`), and WASM status strings (`RUNNING`, `SUSPENDED`) are **technical identifiers, not human prose** — translating them would break the audio engine, not help the user.

- **Bare Text Node elimination** — The canonical React crash pattern is a ternary that produces two different bare string branches:
  ```tsx
  // ❌ UNSAFE — creates a raw TextNode; translator wraps it in <font>
  {isPlaying ? 'RUNNING' : 'SUSPENDED'}

  // ✅ SAFE — React holds a ref to the <span> element, not the text node.
  //    If the translator wraps the inner text, the <span> anchor survives.
  {isPlaying ? <span>RUNNING</span> : <span>SUSPENDED</span>}
  ```
  Likewise, adjacent mixed expressions that produce two text nodes are split:
  ```tsx
  // ❌ Two adjacent TextNodes — double crash vector
  {noteName}{octave}

  // ✅ Each value in its own stable element
  <span>{noteName}</span><span>{octave}</span>
  ```
  This pattern was applied to every dynamic text branch in `InteractiveSequencer.tsx` and `ProjectHologram.tsx`.

---

### 3 · Native i18n — Zero External Dependencies

**Problem:** Standard i18n solutions (`react-i18next`, `react-intl`) add 30–80KB to the bundle and introduce complex provider trees. For a portfolio SPA with two languages, this overhead is unjustifiable. Relying on browser translation engines is equally fragile (see §2 above).

**Solution: a typed, store-backed, zero-dependency i18n system.**

**Type layer (`src/data/projects.ts`):**
```ts
export type Language = 'en' | 'es';
export type I18nString = Record<Language, string>;

// Single-line selector — replaces the entire i18n library surface area
export const t = (field: I18nString, lang: Language): string => field[lang];
```
All translatable fields (`title`, `description`, `TechItem.detail`) are typed as `I18nString`. Non-human-readable values (`telemetry` labels, tech names) remain plain `string` — the type system enforces the distinction at compile time.

**State layer (`src/store/usePortfolioStore.ts`):**
```ts
export const usePortfolioStore = create<PortfolioState>()(
  persist(
    (set, get) => ({
      language: 'en',
      toggleLanguage: () =>
        set({ language: get().language === 'en' ? 'es' : 'en' }),
    }),
    {
      name: 'portfolio-lang',
      // partialize: persist ONLY the language key.
      // Volatile UI state (activeCategory, showAbout) is never written
      // to localStorage — preventing stale state on reload.
      partialize: (state) => ({ language: state.language }),
    },
  ),
);
```

**UI layer (`LanguageToggle.tsx`):** A `fixed` HUD element at `z-[9999]` (above the Three.js canvas, below modals) with Framer Motion `layoutId` spring animation for the active-language indicator. Carries its own `translate="no"` to prevent the meta-paradox of the browser translating the language-selector itself.

**Consumption pattern (any component):**
```tsx
const { language } = usePortfolioStore();
const resolvedTitle = t(project.title, language); // I18nString → string
```

**Bundle impact: +0KB** from third-party i18n dependencies. The entire system — types, store slice, selector, and UI — is ~60 lines of application code.

---

### 4 · AI Terminal — Serverless Agent with Groq Inference

**Context:** The portfolio includes an embedded chat assistant (`AiTerminal.tsx`) — a floating terminal widget that answers questions about Juan's background, projects, and skills. The backend was originally prototyped locally using **Ollama** (self-hosted LLM inference). For production, the architecture was migrated to **Groq** to eliminate the cold-start and hardware constraint problems of self-hosted inference in a serverless environment.

**Architecture:**

```
Browser (React)
  └─ POST /api/chat  →  Vercel Serverless Function
                              └─ FastAPI (api/index.py)
                                    └─ Groq SDK  →  llama-3.3-70b-versatile
```

The backend is a **FastAPI** application deployed as a Vercel Serverless Function (Python runtime). Key decisions:

- **Global client instantiation — Warm-Start Optimization:**
  ```python
  # Instantiated at module level, outside the endpoint handler.
  # Vercel reuses warm execution contexts between requests —
  # the Groq client is initialized once, not per-call.
  client_instance = Groq(api_key=os.environ.get("GROQ_API_KEY"))
  ```

- **Cached System Prompt:** The agent's persona, Juan's background, and behavioral constraints are loaded from `reglas_ventas.txt` at cold-start and held in memory — zero filesystem I/O on subsequent requests.

- **Context Window Management:**
  ```python
  # Only the last 6 messages are forwarded to the LLM.
  # Bounds token cost and latency while keeping conversational coherence.
  for msg in request.messages[-6:]:
      ...
  ```

- **Model — `llama-3.3-70b-versatile`:** Groq's LPU (Language Processing Unit) hardware runs this 70B-parameter model at speeds competitive with GPT-3.5 on traditional GPU clusters — typically `<500ms` TTFT (Time to First Token).

- **Why Groq over Ollama in production:** Ollama requires a persistent process with dedicated GPU/CPU — incompatible with stateless Vercel Serverless Functions. Groq provides equivalent inference quality at low latency with zero infrastructure management, as a direct API replacement for the local Ollama prototype.

---

## 🚀 Local Development


```bash
npm install
npm run dev        # Vite dev server → http://localhost:5173
npm run build      # Production bundle
npx tsc --noEmit   # Type-check without emitting (CI gate)
```

> **Note on WebAssembly / AudioWorklet:** The Faust DSP module (`/public/assets/audio/create-node.js`) is intentionally excluded from Vite's bundler via `/* @vite-ignore */`. Vite's minifier breaks the `AudioWorkletProcessor` string serialization. The file is served as a static asset and loaded at runtime.

---

## 📁 Project Structure

```
src/
├── audio/
│   └── BassSynthNode.ts        # AudioContext lifecycle + WASM loader
├── components/
│   ├── 3d/                     # Three.js scene components
│   └── ui/
│       ├── InteractiveSequencer.tsx
│       ├── LanguageToggle.tsx  # HUD i18n toggle
│       ├── ProjectHologram.tsx # Project modal
│       └── SystemDiagnostic.tsx # Hardware feature gate
├── data/
│   └── projects.ts             # Bilingual project data + I18nString types
└── store/
    └── usePortfolioStore.ts    # Zustand store (language persisted)
```

---

*Built with precision. Documented with intent.*
