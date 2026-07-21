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
      'SPA interactiva con ecosistema 3D para la divulgación científica. Implementación de glassmorphism y renderizado de alto rendimiento con React Three Fiber.',
    techStack: [
      { name: 'React 19',    detail: 'Arquitectura de componentes con Concurrent Mode y Suspense para carga diferida de la escena 3D.' },
      { name: 'Three.js',    detail: 'Motor de renderizado WebGL. Gestión de geometrías, materiales y el loop de animación a 60 fps.' },
      { name: 'Tailwind v4', detail: 'Sistema de diseño utilitario con tokens CSS personalizados para el glassmorphism y paleta técnica.' },
      { name: 'Zustand',     detail: 'Store global minimalista para el estado de intercepción 3D→2D sin re-renders innecesarios.' },
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
      'Sintetizador de bajo digital mediante modelado físico implementado en FPGA. Procesamiento DSP en hardware dedicado para ultra-baja latencia y respuesta en tiempo real.',
    techStack: [
      { name: 'Verilog',  detail: 'Descripción HDL del core DSP: osciladores digitales, filtros IIR y modulación de envolvente.' },
      { name: 'FPGA',     detail: 'Implementación en hardware Tang Nano 20k. Ejecución paralela de pipelines de audio a nivel de gates.' },
      { name: 'DSP',      detail: 'Algoritmos de modelado físico de cuerdas (Karplus-Strong) con tablas de onda pre-calculadas.' },
      { name: 'Tang20k',  detail: 'SoC FPGA Gowin GW2A-18. 20k LUTs, PLL integrado a 27MHz y DAC de audio I²S de 24-bit.' },
    ],
    githubUrl: 'https://github.com/DystopicSoftware/dsp-bass-synth',
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
    description: 'Sistema multi-agente 100% offline para la automatización y control de inventario de un restaurante. Impulsado por modelos locales (Llama 3.1 vía Ollama) integrados en una interfaz de Streamlit y bases de datos relacionales SQLite.\n\nEl núcleo arquitectónico destaca por la implementación de Tool Calling nativo con tipado estricto mediante Pydantic. Esto supera las limitaciones de parsing de strings crudos y elimina las alucinaciones dentro del bucle de ejecución del AgentExecutor.',
    techStack: [
      { name: 'Python',    detail: 'Backend principal. Orquestación del pipeline de inferencia, visión y lógica de negocio.' },
      { name: 'Ollama',    detail: 'Framework local para la ejecución de LLMs sin necesidad de conexión a internet o APIs externas.' },
      { name: 'Llama 3.1', detail: 'Modelo principal configurado para tareas de Tool Calling y parseo JSON nativo.' },
      { name: 'LangChain', detail: 'Framework de composición de agentes. Uso de create_tool_calling_agent y StructuredTool.' },
      { name: 'SQLite',    detail: 'Persistencia de datos. Bases relacionales para Inventario, Ventas y Recetas.' },
      { name: 'Streamlit', detail: 'Frontend reactivo para el POS y dashboard administrativo.' },
    ],
    githubUrl: 'https://github.com/DystopicSoftware/RestauranteIA',
    liveUrl: null,
    videoSrc: '/assets/projects/restaurante-preview.mp4',
    telemetry: [
      { label: 'MODEL',    value: 'Llama 3.1' },
      { label: 'ACCURACY', value: '100%'      },
      { label: 'LATENCY',  value: '<800ms'    },
      { label: 'BACKEND',  value: 'OFFLINE'   },
    ],
  },
};
