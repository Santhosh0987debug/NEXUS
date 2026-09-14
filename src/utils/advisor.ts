import { CAREERS, type Career } from '../data/careers';
import { PROJECTS } from '../data/projects';
import { SKILLS } from '../data/skills';

export type LevelOption = 'Beginner' | 'Intermediate' | 'Advanced';

export interface AdvisorInputs {
  level: LevelOption;
  interest: string;
  existing: string[];
  hours: number;
}

export interface MissingSkill {
  name: string;
  priority: number;
  unlock: string;
}

export interface RoadmapPhase {
  phase: string;
  window: string;
  focus: string;
  tasks: string[];
}

export interface Recommendation {
  career: Career;
  match: number;
  missing: MissingSkill[];
  phases: RoadmapPhase[];
  projectTitle: string;
  projectTech: string[];
  aligned: Career[];
  pace: string;
}

const FOUNDATION = new Set(['JavaScript', 'HTML & CSS', 'Git & GitHub', 'Python']);

function buildPhases(career: Career, inputs: AdvisorInputs): RoadmapPhase[] {
  const foundationKnown = inputs.existing.some((s) => FOUNDATION.has(s));
  const core = career.coreSkills;
  const dayWindows = inputs.hours >= 20 ? 'Days 1–10' : inputs.hours >= 10 ? 'Days 1–14' : 'Days 1–18';

  const phase1Tasks = [
    foundationKnown
      ? `Audit ${core[0]} and ${core[1]} — close the obvious gaps first.`
      : `Lock in the foundations: JavaScript + Git + the first 2 ${core[0] || 'core'} topics.`,
    `Daily ${Math.max(1, Math.round(inputs.hours / 5))} focused hours — one concept, one exercise, zero distractions.`,
    inputs.level === 'Beginner'
      ? 'Ship 3 tiny practice builds to make each concept stick.'
      : 'Re-teach each concept by writing it as a short note to yourself.',
  ];

  const phase2Tasks = [
    `Build a working slice of ${career.typicalProjects[0] || 'your target project'} — ugly but real.`,
    `Master the stack: ${core.slice(0, 3).join(' · ')} across real features, not tutorials.`,
    'Write code you would let a senior review: naming, structure, git hygiene.',
  ];

  const phase3Tasks = [
    'Polish, document and deploy — README, live link, and a 30-second demo video.',
    'Record a walkthrough. Reflection is the part of learning everyone skips.',
    'Apply your version: portfolio, projects page, or internship pitch built around what you shipped.',
  ];

  return [
    {
      phase: 'Phase 01',
      window: dayWindows,
      focus: 'Foundation Loop',
      tasks: phase1Tasks,
    },
    {
      phase: 'Phase 02',
      window: inputs.hours >= 20 ? 'Days 11–20' : inputs.hours >= 10 ? 'Days 15–22' : 'Days 19–25',
      focus: 'Core Build',
      tasks: phase2Tasks,
    },
    {
      phase: 'Phase 03',
      window: inputs.hours >= 20 ? 'Days 21–30' : inputs.hours >= 10 ? 'Days 23–30' : 'Days 26–30',
      focus: 'Ship + Refine',
      tasks: phase3Tasks,
    },
  ];
}

export function SKILL_NAME_SET() {
  return SKILLS.map((s) => s.name);
}

export function recommend(inputs: AdvisorInputs): Recommendation {
  const selected = new Set(inputs.existing.map((s) => s.trim().toLowerCase()));
  const has = (name: string) => selected.has(name.trim().toLowerCase());

  const scored = CAREERS.map((career) => {
    let score = 0;
    career.coreSkills.forEach((s) => {
      if (has(s)) score += 3;
    });
    career.nextSkills.forEach((s) => {
      if (has(s)) score += 1;
    });
    career.coreSkills.slice(0, 2).forEach((s) => {
      if (has(s)) score += 2;
    });
    if (score > 0) score += Math.min(4, score);
    if (career.id === inputs.interest) score += 12;
    return { career, score };
  });

  const interestCareer = CAREERS.find((c) => c.id === inputs.interest);
  const best = scored.sort((a, b) => b.score - a.score)[0];
  const career = interestCareer ?? best.career;

  const needed = [...career.coreSkills, ...career.nextSkills];
  const known = needed.filter(has).length;
  const levelCredit = inputs.level === 'Beginner' ? 6 : inputs.level === 'Intermediate' ? 16 : 26;
  const hoursCredit = Math.min(1, inputs.hours / 40) * 10;
  const raw = (known / needed.length) * 64 + levelCredit * 0.6 + hoursCredit;
  const match = Math.max(12, Math.min(96, Math.round(raw)));

  const missing = needed
    .filter((s) => !has(s))
    .map((name, i) => ({
      name,
      priority: i + 1,
      unlock: career.id,
    }))
    .slice(0, 9);

  const phases = buildPhases(career, inputs);

  const related = PROJECTS.find((p) => p.skills.some((s) => career.coreSkills.includes(s)));
  const projectTitle = related?.title ?? career.typicalProjects[0];
  const projectTech = related?.tech ?? career.coreSkills.slice(0, 4);

  const pace =
    inputs.hours >= 20
      ? 'SURGE MODE'
      : inputs.hours >= 10
        ? 'STEADY BUILD'
        : 'MICRO PACE';

  return {
    career,
    match,
    missing,
    phases,
    projectTitle,
    projectTech,
    aligned: scored.slice(0, 3).map((s) => s.career),
    pace,
  };
}