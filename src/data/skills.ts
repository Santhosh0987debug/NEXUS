export type SkillCategory = 'Foundation' | 'Core' | 'Specialized' | 'Systems';

export interface SkillNode {
  id: string;
  name: string;
  category: SkillCategory;
  level: number;
  description: string;
  prereqs: string[];
  position: [number, number, number];
}

export interface SkillEdge {
  from: string;
  to: string;
  primary?: boolean;
}

export const CATEGORY_COLOR: Record<SkillCategory, string> = {
  Foundation: '#8b9fe8',
  Core: '#34d399',
  Specialized: '#f0abfc',
  Systems: '#67e8f9',
};

export const SKILLS: SkillNode[] = [
  {
    id: 'htmlcss',
    name: 'HTML & CSS',
    category: 'Foundation',
    level: 88,
    description: 'The skeleton and skin of every interface — semantic structure, layout systems and responsive craft.',
    prereqs: [],
    position: [-1.8, 2.3, -2.2],
  },
  {
    id: 'git',
    name: 'Git & GitHub',
    category: 'Foundation',
    level: 72,
    description: 'Version control and collaboration. Branch, commit, review, merge — the workflow every team lives in.',
    prereqs: [],
    position: [-2.6, 1.4, 0.2],
  },
  {
    id: 'javascript',
    name: 'JavaScript',
    category: 'Foundation',
    level: 80,
    description: 'The language of the web browser — events, the DOM, async flows and the mental model behind modern frontend frameworks.',
    prereqs: ['htmlcss', 'git'],
    position: [0, 0, 0],
  },
  {
    id: 'python',
    name: 'Python',
    category: 'Core',
    level: 60,
    description: 'The lingua franca of data, AI and automation. Clean, expressive and everywhere in modern ML tooling.',
    prereqs: [],
    position: [3.4, -3.1, -0.6],
  },
  {
    id: 'react',
    name: 'React',
    category: 'Core',
    level: 65,
    description: 'Component-driven UI built on declarative state. The engine behind most modern product interfaces.',
    prereqs: ['javascript'],
    position: [1.9, 0.7, 1.4],
  },
  {
    id: 'typescript',
    name: 'TypeScript',
    category: 'Core',
    level: 52,
    description: 'JavaScript with a safety net. Types that document intent, catch bugs and make refactors fearless.',
    prereqs: ['javascript'],
    position: [3.5, -0.2, 2.6],
  },
  {
    id: 'testing',
    name: 'Testing',
    category: 'Core',
    level: 34,
    description: 'Unit, integration and end-to-end coverage — proving your code behaves before users find out.',
    prereqs: ['react', 'javascript'],
    position: [4.2, 2.1, 0.9],
  },
  {
    id: 'nodejs',
    name: 'Node.js',
    category: 'Core',
    level: 46,
    description: 'Run JavaScript on the server. APIs, CLIs and the backend half of the full stack.',
    prereqs: ['typescript'],
    position: [2.4, -1.8, 4.2],
  },
  {
    id: 'apis',
    name: 'APIs & REST',
    category: 'Core',
    level: 40,
    description: 'Design contracts between systems — routing, auth, validation and clean response shapes.',
    prereqs: ['nodejs'],
    position: [0.4, -2.9, 5.6],
  },
  {
    id: 'databases',
    name: 'Databases',
    category: 'Core',
    level: 35,
    description: 'Model, query and index the durable layer — relational and document stores that survive restarts.',
    prereqs: ['apis'],
    position: [-2.3, -2.1, 6.8],
  },
  {
    id: 'ml',
    name: 'ML Fundamentals',
    category: 'Specialized',
    level: 22,
    description: 'Training, evaluation and bias — the scientific loop that turns data into predictions.',
    prereqs: ['python'],
    position: [0.7, -4.2, 3.4],
  },
  {
    id: 'uiux',
    name: 'UI/UX Principles',
    category: 'Specialized',
    level: 55,
    description: 'Hierarchy, affordance, motion and accessibility — the craft that makes interfaces feel inevitable.',
    prereqs: ['htmlcss'],
    position: [-0.9, 3.1, 0.1],
  },
  {
    id: 'ai-integration',
    name: 'AI Integration',
    category: 'Specialized',
    level: 16,
    description: 'Wire LLMs and models into products — prompting, tool calling, embeddings and guardrails.',
    prereqs: ['apis', 'ml'],
    position: [-3.4, -0.5, 6.4],
  },
  {
    id: 'system-design',
    name: 'System Design',
    category: 'Systems',
    level: 20,
    description: 'Think at system scale — trade-offs, caching, queues, scaling and failure tolerance.',
    prereqs: ['databases', 'nodejs'],
    position: [-4.6, 0.9, 5.2],
  },
  {
    id: 'docker',
    name: 'Docker & Cloud',
    category: 'Systems',
    level: 24,
    description: 'Package apps into containers and run them anywhere — the first step to real deployment.',
    prereqs: ['nodejs'],
    position: [-0.5, 1.1, 5.0],
  },
  {
    id: 'security',
    name: 'Security Basics',
    category: 'Systems',
    level: 20,
    description: 'Auth, validation, injection defense and secrets handling — vulnerability hygiene every engineer needs.',
    prereqs: ['apis'],
    position: [-4.2, -1.9, 3.4],
  },
];

export const SKILL_MAP: Record<string, SkillNode> = Object.fromEntries(
  SKILLS.map((s) => [s.id, s]),
);

export const SPINE_PATH = [
  'javascript',
  'react',
  'typescript',
  'nodejs',
  'apis',
  'databases',
  'system-design',
  'ai-integration',
];

export const EDGES: SkillEdge[] = [
  { from: 'htmlcss', to: 'javascript' },
  { from: 'htmlcss', to: 'uiux' },
  { from: 'git', to: 'javascript' },
  { from: 'git', to: 'react' },
  { from: 'javascript', to: 'react', primary: true },
  { from: 'react', to: 'typescript', primary: true },
  { from: 'react', to: 'testing' },
  { from: 'typescript', to: 'nodejs', primary: true },
  { from: 'nodejs', to: 'apis', primary: true },
  { from: 'nodejs', to: 'docker' },
  { from: 'apis', to: 'databases', primary: true },
  { from: 'apis', to: 'security' },
  { from: 'databases', to: 'system-design', primary: true },
  { from: 'system-design', to: 'ai-integration', primary: true },
  { from: 'python', to: 'ml' },
  { from: 'ml', to: 'ai-integration' },
];

export const LEVEL_TIERS: Array<[number, string]> = [
  [0, 'ORBIT AWAITED'],
  [2, 'NAVIGATOR'],
  [3, 'EXPLORER'],
  [5, 'ENGINEER'],
  [6, 'ARCHITECT'],
  [8, 'NEXUS MASTER'],
];

export function tierFor(knownCount: number): string {
  let tier = 'ORBIT AWAITED';
  for (const [count, name] of LEVEL_TIERS) {
    if (knownCount >= count) tier = name;
  }
  return tier;
}