// ─────────────────────────────────────────────────────────────────────────────
// Tipos
// ─────────────────────────────────────────────────────────────────────────────
export interface TelemetryMetric {
  label: string;
  value: string;
}

export interface TechItem {
  name: string;
  detail: string;
}

export interface ProjectData {
  title: string;
  description: string;
  techStack: TechItem[];
  githubUrl: string;
  liveUrl: string | null;
  videoSrc?: string;
  telemetry: TelemetryMetric[];
}

// ─────────────────────────────────────────────────────────────────────────────
// Datos de Proyectos
// ─────────────────────────────────────────────────────────────────────────────
export const projectsData: Record<string, ProjectData> = {
  'edge-computing': {
    title: 'Antioquia Zana 3D',
    description:
      'Interactive 3D SPA built for scientific outreach. Implements real-time glassmorphism and high-performance GPU rendering with React Three Fiber, achieving 60 FPS with zero memory leaks across the entire scene lifecycle.',
    techStack: [
      { name: 'React 19',    detail: 'Component architecture using Concurrent Mode and Suspense for deferred loading of the 3D scene without blocking the main thread.' },
      { name: 'Three.js',    detail: 'WebGL rendering engine. Full ownership of geometry, materials, and the animation loop at a locked 60 FPS.' },
      { name: 'Tailwind v4', detail: 'Utility-first design system with custom CSS tokens for the glassmorphism aesthetic and technical color palette.' },
      { name: 'Zustand',     detail: 'Minimal global store managing the 3D→2D interception state without triggering unnecessary re-renders.' },
    ],
    githubUrl: 'https://github.com/DystopicSoftware/antioquia-zana-mis-pruebas',
    liveUrl:   'https://antioquia-zana-ur48.vercel.app/',
    videoSrc:  '/assets/projects/zana-preview.mp4',
    telemetry: [
      { label: 'RENDER',  value: 'GPU'   },
      { label: 'FPS',     value: '60'    },
      { label: 'BUNDLE',  value: '142KB' },
      { label: 'LCP',     value: '1.2s'  },
    ],
  },

  'hardware': {
    title: 'DSP Bass Synth',
    description:
      'Physical modeling digital bass synthesizer implemented entirely in hardware on an FPGA. The algorithm was first designed in Faust DSP, then manually translated to Q15 fixed-point arithmetic in pure Verilog — achieving 2.1ms latency with a 27MHz clock and a direct 24-bit I²S DAC output, with no OS or CPU overhead.',
    techStack: [
      { name: 'Verilog',  detail: 'HDL description of the full DSP core: Karplus-Strong waveguide delay line, IIR damping filter, and envelope modulation — all in Q15 signed fixed-point arithmetic.' },
      { name: 'FPGA',     detail: 'Deployed on Gowin Tang Nano 20K (GW2A-18). Parallel execution of audio pipelines at the gate level. Debugged with on-chip Logic Analyzer (GAO).' },
      { name: 'Faust',    detail: 'Algorithm originally prototyped in Faust DSP language. The physical model mathematics were then hand-translated to Verilog for FPGA implementation.' },
      { name: 'Tang20k',  detail: 'Gowin GW2A-18 SoC FPGA. 20K LUTs, integrated PLL at 27MHz, and a 24-bit I²S audio DAC driven directly from the fabric.' },
    ],
    githubUrl: 'https://github.com/DystopicSoftware/dsp-bass-synth-tang20k',
    liveUrl:   null,
    telemetry: [
      { label: 'LATENCY', value: '2.1ms'  },
      { label: 'POWER',   value: '1.2W'   },
      { label: 'CLK',     value: '27MHz'  },
      { label: 'LUTs',    value: '1,840'  },
    ],
  },

  'edge-ai': {
    title: 'RestauranteIA / Local Agents',
    description: '100% offline multi-agent system for restaurant inventory automation and control. Powered by local LLMs (Llama 3.1 via Ollama) integrated with a Streamlit interface and SQLite relational databases — zero cloud dependency, zero API costs.\n\nThe architectural core implements native Tool Calling with strict Pydantic type-checking. This eliminates raw string parsing limitations and suppresses hallucinations within the AgentExecutor execution loop.',
    techStack: [
      { name: 'Python',    detail: 'Primary backend. Orchestrates the full inference pipeline, business logic, and agent lifecycle management.' },
      { name: 'Ollama',    detail: 'Local LLM runtime. Enables model inference without any internet connection or external API calls.' },
      { name: 'Llama 3.1', detail: 'Primary model configured for native Tool Calling and structured JSON output parsing.' },
      { name: 'LangChain', detail: 'Agent composition framework. Uses create_tool_calling_agent and StructuredTool for reliable function dispatch.' },
      { name: 'SQLite',    detail: 'Data persistence layer. Relational databases for Inventory, Sales, and Recipes with full CRUD via agent tools.' },
      { name: 'Streamlit', detail: 'Reactive frontend for the POS terminal and administrative dashboard.' },
    ],
    githubUrl: 'https://github.com/DystopicSoftware/RestauranteIA',
    liveUrl: null,
    videoSrc: '/assets/projects/restaurante-preview.mp4',
    telemetry: [
      { label: 'MODEL',        value: 'Llama 3.1' },
      { label: 'TOOL_SUCCESS', value: '97.3%'     },
      { label: 'LATENCY',      value: '<800ms'    },
      { label: 'BACKEND',      value: 'OFFLINE'   },
    ],
  },
};
