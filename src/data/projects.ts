import type { Language } from '../store/usePortfolioStore';

// ─────────────────────────────────────────────────────────────────────────────
// Primitive i18n helper
// ─────────────────────────────────────────────────────────────────────────────

/** A value that exists in both supported languages. */
export type I18nString = Record<Language, string>;

/**
 * Selects the correct string for the active language.
 * Usage: t(project.description, language)
 */
export const t = (field: I18nString, lang: Language): string => field[lang];

// ─────────────────────────────────────────────────────────────────────────────
// Domain types
// ─────────────────────────────────────────────────────────────────────────────
export interface TelemetryMetric {
  label: string;   // technical label — never translated (e.g. 'LCP', 'CLK')
  value: string;   // numeric value  — never translated (e.g. '2.1ms', '60')
}

export interface TechItem {
  name:   string;      // tech name is always EN (proper noun — 'Verilog', 'React')
  detail: I18nString;  // explanation is bilingual
}

export interface ProjectData {
  title:       I18nString;
  description: I18nString;
  techStack:   TechItem[];
  githubUrl:   string;
  liveUrl:     string | null;
  videoSrc?:   string;
  telemetry:   TelemetryMetric[];
}

// ─────────────────────────────────────────────────────────────────────────────
// Datos de Proyectos
// ─────────────────────────────────────────────────────────────────────────────
export const projectsData: Record<string, ProjectData> = {

  'edge-computing': {
    title: {
      en: 'Antioquia Zana 3D',
      es: 'Antioquia Zana 3D',
    },
    description: {
      en: 'Interactive 3D SPA built for scientific outreach. Implements real-time glassmorphism and high-performance GPU rendering with React Three Fiber, achieving 60 FPS with zero memory leaks across the entire scene lifecycle.',
      es: 'SPA 3D interactiva construida para divulgación científica. Implementa glassmorfismo en tiempo real y renderizado GPU de alto rendimiento con React Three Fiber, logrando 60 FPS sin fugas de memoria en todo el ciclo de vida de la escena.',
    },
    techStack: [
      {
        name: 'React 19',
        detail: {
          en: 'Component architecture using Concurrent Mode and Suspense for deferred loading of the 3D scene without blocking the main thread.',
          es: 'Arquitectura de componentes usando Concurrent Mode y Suspense para carga diferida de la escena 3D sin bloquear el hilo principal.',
        },
      },
      {
        name: 'Three.js',
        detail: {
          en: 'WebGL rendering engine. Full ownership of geometry, materials, and the animation loop at a locked 60 FPS.',
          es: 'Motor de renderizado WebGL. Control total de geometría, materiales y el loop de animación a 60 FPS fijos.',
        },
      },
      {
        name: 'Tailwind v4',
        detail: {
          en: 'Utility-first design system with custom CSS tokens for the glassmorphism aesthetic and technical color palette.',
          es: 'Sistema de diseño utility-first con tokens CSS personalizados para la estética glassmorfismo y paleta de colores técnica.',
        },
      },
      {
        name: 'Zustand',
        detail: {
          en: 'Minimal global store managing the 3D→2D interception state without triggering unnecessary re-renders.',
          es: 'Store global minimalista que gestiona el estado de intercepción 3D→2D sin provocar re-renders innecesarios.',
        },
      },
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
    title: {
      en: 'DSP Bass Synth',
      es: 'Sintetizador de Bajo DSP',
    },
    description: {
      en: 'Physical modeling digital bass synthesizer implemented entirely in hardware on an FPGA. The algorithm was first designed in Faust DSP, then manually translated to Q15 fixed-point arithmetic in pure Verilog — achieving 2.1ms latency with a 27MHz clock and a direct 24-bit I²S DAC output, with no OS or CPU overhead.',
      es: 'Sintetizador de bajo digital por modelado físico implementado íntegramente en hardware sobre una FPGA. El algoritmo se diseñó primero en Faust DSP y luego se tradujo manualmente a aritmética Q15 de punto fijo en Verilog puro — logrando 2.1ms de latencia a 27MHz con salida DAC I²S de 24 bits, sin SO ni CPU.',
    },
    techStack: [
      {
        name: 'Verilog',
        detail: {
          en: 'HDL description of the full DSP core: Karplus-Strong waveguide delay line, IIR damping filter, and envelope modulation — all in Q15 signed fixed-point arithmetic.',
          es: 'Descripción HDL del núcleo DSP completo: línea de retardo de guía de onda Karplus-Strong, filtro IIR de amortiguación y modulación de envolvente — todo en aritmética Q15 de punto fijo con signo.',
        },
      },
      {
        name: 'FPGA',
        detail: {
          en: 'Deployed on Gowin Tang Nano 20K (GW2A-18). Parallel execution of audio pipelines at the gate level. Debugged with on-chip Logic Analyzer (GAO).',
          es: 'Desplegado en Gowin Tang Nano 20K (GW2A-18). Ejecución paralela de pipelines de audio a nivel de puerta lógica. Depurado con analizador lógico en chip (GAO).',
        },
      },
      {
        name: 'Faust',
        detail: {
          en: 'Algorithm originally prototyped in Faust DSP language. The physical model mathematics were then hand-translated to Verilog for FPGA implementation.',
          es: 'Algoritmo prototipado originalmente en lenguaje Faust DSP. Las matemáticas del modelo físico fueron traducidas manualmente a Verilog para implementación en FPGA.',
        },
      },
      {
        name: 'Tang20k',
        detail: {
          en: 'Gowin GW2A-18 SoC FPGA. 20K LUTs, integrated PLL at 27MHz, and a 24-bit I²S audio DAC driven directly from the fabric.',
          es: 'FPGA SoC Gowin GW2A-18. 20K LUTs, PLL integrado a 27MHz y DAC de audio I²S de 24 bits controlado directamente desde la lógica programable.',
        },
      },
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
    title: {
      en: 'RestauranteIA / Local Agents',
      es: 'RestauranteIA / Agentes Locales',
    },
    description: {
      en: '100% offline multi-agent system for restaurant inventory automation and control. Powered by local LLMs (Llama 3.1 via Ollama) integrated with a Streamlit interface and SQLite relational databases — zero cloud dependency, zero API costs.\n\nThe architectural core implements native Tool Calling with strict Pydantic type-checking. This eliminates raw string parsing limitations and suppresses hallucinations within the AgentExecutor execution loop.',
      es: 'Sistema multi-agente 100% offline para automatización y control del inventario de un restaurante. Impulsado por LLMs locales (Llama 3.1 vía Ollama) integrados con una interfaz Streamlit y bases de datos relacionales SQLite — cero dependencia de la nube, cero costo de API.\n\nEl núcleo arquitectónico implementa Tool Calling nativo con verificación de tipos estricta mediante Pydantic. Esto elimina las limitaciones del parseo de strings en crudo y suprime alucinaciones dentro del loop de ejecución del AgentExecutor.',
    },
    techStack: [
      {
        name: 'Python',
        detail: {
          en: 'Primary backend. Orchestrates the full inference pipeline, business logic, and agent lifecycle management.',
          es: 'Backend principal. Orquesta el pipeline de inferencia completo, la lógica de negocio y la gestión del ciclo de vida de los agentes.',
        },
      },
      {
        name: 'Ollama',
        detail: {
          en: 'Local LLM runtime. Enables model inference without any internet connection or external API calls.',
          es: 'Runtime de LLM local. Habilita la inferencia de modelos sin ninguna conexión a internet ni llamadas a APIs externas.',
        },
      },
      {
        name: 'Llama 3.1',
        detail: {
          en: 'Primary model configured for native Tool Calling and structured JSON output parsing.',
          es: 'Modelo principal configurado para Tool Calling nativo y parseo de salida JSON estructurada.',
        },
      },
      {
        name: 'LangChain',
        detail: {
          en: 'Agent composition framework. Uses create_tool_calling_agent and StructuredTool for reliable function dispatch.',
          es: 'Framework de composición de agentes. Usa create_tool_calling_agent y StructuredTool para despacho confiable de funciones.',
        },
      },
      {
        name: 'SQLite',
        detail: {
          en: 'Data persistence layer. Relational databases for Inventory, Sales, and Recipes with full CRUD via agent tools.',
          es: 'Capa de persistencia de datos. Bases de datos relacionales para Inventario, Ventas y Recetas con CRUD completo vía herramientas de agente.',
        },
      },
      {
        name: 'Streamlit',
        detail: {
          en: 'Reactive frontend for the POS terminal and administrative dashboard.',
          es: 'Frontend reactivo para el terminal de punto de venta y el panel administrativo.',
        },
      },
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
