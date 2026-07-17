export interface Project {
  id: string
  title: string
  subtitle: string
  description: string
  tags: string[]
  category: 'frontend-3d' | 'fpga-hardware' | 'edge-ai'
}

export const projects: Project[] = [
  {
    id: 'antioquia-zana',
    title: 'Antioquia Zana',
    subtitle: 'Experiencia Web 3D Interactiva',
    description:
      'Plataforma inmersiva que explora la riqueza cultural de Antioquia mediante escenas 3D interactivas, navegación fluida y visualización de datos geoespaciales en tiempo real.',
    tags: ['React', 'Three.js', 'R3F', 'TypeScript', 'WebGL'],
    category: 'frontend-3d',
  },
  {
    id: 'dsp-bass-synth-tang20k',
    title: 'DSP Bass Synth Tang20k',
    subtitle: 'Sintetizador de Bajo en FPGA',
    description:
      'Sintetizador de bajo digital implementado en Verilog sobre FPGA, con procesamiento DSP en tiempo real, generación de ondas y modulación de frecuencia para audio de baja latencia.',
    tags: ['Verilog', 'FPGA', 'DSP', 'VHDL', 'Audio'],
    category: 'fpga-hardware',
  },
  {
    id: 'restaurante-ia',
    title: 'RestauranteIA',
    subtitle: 'Asistente Inteligente para Restaurantes',
    description:
      'Sistema de IA conversacional para gestión de pedidos, reservas y atención al cliente en restaurantes, impulsado por LangChain y modelos de lenguaje con integración a bases de datos en tiempo real.',
    tags: ['Python', 'LangChain', 'LLM', 'FastAPI', 'Edge AI'],
    category: 'edge-ai',
  },
]
