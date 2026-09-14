export type ProjectStatus = 'LIVE' | 'DEMO' | 'IN PROGRESS' | 'ARCHIVE';

export interface Project {
  id: string;
  title: string;
  tagline: string;
  description: string;
  tech: string[];
  skills: string[];
  status: ProjectStatus;
  color: string;
  orbit: number;
  speed: number;
  size: number;
  ring?: boolean;
  gh: string;
  demo: string;
}

export const PROJECTS: Project[] = [
  {
    id: 'datasphere',
    title: 'DataSphere AI',
    tagline: 'Anomaly detection that speaks plain English.',
    description:
      'A self-serve platform that ingests telemetry streams, trains an anomaly model per metric, and explains every alert in natural language with suggested next steps.',
    tech: ['Python', 'scikit-learn', 'FastAPI', 'React', 'OpenAI'],
    skills: ['Python', 'ML Fundamentals', 'APIs & REST', 'React', 'Databases', 'AI Integration'],
    status: 'DEMO',
    color: '#22d3ee',
    orbit: 2.1,
    speed: 0.55,
    size: 0.42,
    ring: true,
    gh: 'https://github.com/your-handle/datasphere-ai',
    demo: '#',
  },
  {
    id: 'coderesilience',
    title: 'CodeResilience',
    tagline: 'Hardened CI/CD that fails loudly, never silently.',
    description:
      'A pipeline-security CLI and dashboard that scans repositories for leaked secrets, insecure patterns and dependency drift before code ever ships.',
    tech: ['TypeScript', 'Docker', 'GitHub Actions', 'PostgreSQL'],
    skills: ['TypeScript', 'Security Basics', 'Docker & Cloud', 'APIs & REST', 'System Design'],
    status: 'IN PROGRESS',
    color: '#34d399',
    orbit: 3.1,
    speed: 0.4,
    size: 0.34,
    gh: 'https://github.com/your-handle/coderesilience',
    demo: '#',
  },
  {
    id: 'sakhi',
    title: 'Sakhi',
    tagline: 'A safety companion built around her voice.',
    description:
      'A mobile-first companion app with SOS journeys, trusted-circle alerts, location sharing and a calm, human design system — case study turned product.',
    tech: ['React Native', 'TypeScript', 'Figma', 'Firebase'],
    skills: ['UI/UX Principles', 'React', 'APIs & REST', 'Prototyping'],
    status: 'LIVE',
    color: '#f472b6',
    orbit: 4.1,
    speed: 0.3,
    size: 0.3,
    ring: true,
    gh: 'https://github.com/your-handle/sakhi',
    demo: '#',
  },
  {
    id: 'attendance',
    title: 'Smart Attendance',
    tagline: 'Face-reco attendance in under a second.',
    description:
      'A campus attendance system with face detection, tamper-proof logs and a live dashboard — deployed and stress-tested across real classroom flows.',
    tech: ['Python', 'OpenCV', 'TensorFlow', 'Flask', 'SQLite'],
    skills: ['Python', 'ML Fundamentals', 'Databases', 'APIs & REST'],
    status: 'DEMO',
    color: '#60a5fa',
    orbit: 5.1,
    speed: 0.24,
    size: 0.28,
    ring: true,
    gh: 'https://github.com/your-handle/smart-attendance',
    demo: '#',
  },
  {
    id: 'portfolio',
    title: 'Portfolio',
    tagline: 'The experience you are standing inside.',
    description:
      'NEXUS itself — a cinematic WebGL career universe with a skill constellation, project galaxy and a deterministic AI advisor. Built with React, Three.js and GSAP.',
    tech: ['React', 'TypeScript', 'Three.js', 'GSAP', 'Tailwind'],
    skills: ['React', 'JavaScript', 'TypeScript', 'UI/UX Principles', 'Testing'],
    status: 'LIVE',
    color: '#a78bfa',
    orbit: 6.1,
    speed: 0.18,
    size: 0.26,
    gh: 'https://github.com/your-handle/nexus',
    demo: '#',
  },
];