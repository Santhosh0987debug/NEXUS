export interface Career {
  id: string;
  code: string;
  name: string;
  tagline: string;
  description: string;
  color: string;
  band: string;
  demand: number;
  coreSkills: string[];
  nextSkills: string[];
  typicalProjects: string[];
}

export const CAREERS: Career[] = [
  {
    id: 'fullstack',
    code: 'FS.01',
    name: 'Full Stack Development',
    tagline: 'Build the whole product — from pixel to database.',
    description:
      'Own the interface, the server and the glue between. Full stack engineers ship fast, debug deep, and turn ideas into working software end to end.',
    color: '#8b5cf6',
    band: 'MID-LEVEL ARC',
    demand: 92,
    coreSkills: ['JavaScript', 'React', 'TypeScript', 'Node.js', 'Databases', 'APIs & REST'],
    nextSkills: ['System Design', 'Docker & Cloud', 'Testing', 'AI Integration'],
    typicalProjects: [
      'E-commerce storefront + API',
      'Real-time chat application',
      'SaaS project tracker',
      'Immersive portfolio (like NEXUS)',
    ],
  },
  {
    id: 'ai-ml',
    code: 'AI.02',
    name: 'AI / Machine Learning',
    tagline: 'Teach machines to think alongside you.',
    description:
      'Design models that learn from data — from classic machine learning to modern LLM pipelines. The fastest-moving frontier in software.',
    color: '#22d3ee',
    band: 'EXPERT ARC',
    demand: 98,
    coreSkills: ['Python', 'Mathematics for ML', 'NumPy & Pandas', 'scikit-learn', 'Deep Learning'],
    nextSkills: ['Transformers & LLMs', 'MLOps', 'AI Integration', 'Computer Vision'],
    typicalProjects: [
      'Anomaly detection engine',
      'Image classifier API',
      'Sentiment analysis tool',
      'DataSphere AI',
    ],
  },
  {
    id: 'data-science',
    code: 'DS.03',
    name: 'Data Science',
    tagline: 'Find the stories hidden inside raw data.',
    description:
      'Translate messy datasets into decisions. Data scientists combine statistics, code and storytelling to reveal what the numbers mean.',
    color: '#34d399',
    band: 'GROWTH ARC',
    demand: 89,
    coreSkills: ['Python', 'SQL', 'Statistics', 'Pandas', 'Data Visualization'],
    nextSkills: ['ML Engineering', 'ETL & Pipelines', 'Generative AI Tools'],
    typicalProjects: [
      'Sales forecasting dashboard',
      'A/B test analysis engine',
      'Customer churn model',
      'DataSphere AI',
    ],
  },
  {
    id: 'cybersecurity',
    code: 'CY.04',
    name: 'Cybersecurity',
    tagline: 'Attack the problem before it attacks you.',
    description:
      'Harden systems, find vulnerabilities, and defend the digital frontier. A discipline built on curiosity and relentless precision.',
    color: '#f87171',
    band: 'DEFENSE ARC',
    demand: 85,
    coreSkills: ['Networking', 'Linux', 'Web Security OWASP', 'Cryptography Basics'],
    nextSkills: ['Penetration Testing', 'Threat Modeling', 'Cloud Security'],
    typicalProjects: [
      'Network traffic analyzer',
      'Vulnerability lab',
      'Secrets scanner CLI',
      'CodeResilience',
    ],
  },
  {
    id: 'cloud',
    code: 'CL.05',
    name: 'Cloud Engineering',
    tagline: 'Ship infrastructure that never sleeps.',
    description:
      'Design and operate the platforms under everything else — containers, CI/CD and scalable infrastructure that turns code into always-on services.',
    color: '#60a5fa',
    band: 'SCALE ARC',
    demand: 88,
    coreSkills: ['Linux', 'Docker', 'CI/CD Pipelines', 'AWS / Azure / GCP basics', 'Terraform'],
    nextSkills: ['Kubernetes', 'Serverless', 'SRE Practices'],
    typicalProjects: [
      'Deployed microservice app',
      'Auto-scaling web app',
      'Infrastructure as Code repo',
    ],
  },
  {
    id: 'uiux',
    code: 'UX.06',
    name: 'UI/UX Design',
    tagline: 'Design interfaces people can feel.',
    description:
      'Shape products from first sketch to final interaction. Blend psychology, motion and craft to build experiences users love to return to.',
    color: '#f472b6',
    band: 'CRAFT ARC',
    demand: 91,
    coreSkills: ['Figma', 'Design Systems', 'HTML & CSS', 'Prototyping', 'Micro-interactions'],
    nextSkills: ['Motion Design', 'UX Research', 'Design Engineering / React'],
    typicalProjects: [
      'App redesign case study',
      'Component library',
      'Sakhi companion app',
    ],
  },
];