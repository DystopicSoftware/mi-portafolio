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
    title: 'Restaurante IA',
    description:
      'Sistema de asistencia autónoma local. NLP y visión artificial en el Edge para automatización completa de la toma de pedidos sin conectividad a la nube.',
    techStack: [
      { name: 'Python',    detail: 'Backend principal. Orquestación del pipeline de inferencia, visión y lógica de negocio.' },
      { name: 'LangChain', detail: 'Framework de composición de LLMs. Gestión de contexto conversacional y cadenas de razonamiento.' },
      { name: 'FastAPI',   detail: 'API REST asíncrona de ultra-bajo overhead para comunicación con el front de punto de venta.' },
      { name: 'Edge TPU',  detail: 'Google Coral Dev Board. Inferencia de modelos TFLite cuantizados a INT8 sin GPU en la nube.' },
    ],
    githubUrl: 'https://github.com/DystopicSoftware/restaurante-ia',
    liveUrl:   null,
    telemetry: [
      { label: 'MODEL',    value: 'Llama 3' },
      { label: 'ACCURACY', value: '98%'     },
      { label: 'INFER',    value: '38ms'    },
      { label: 'BACKEND',  value: 'LOCAL'   },
    ],
  },
};
