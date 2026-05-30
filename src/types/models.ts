export const PRACTICE_FOCUS_OPTIONS = [
  'skating',
  'passing',
  'shooting',
  'battle drills',
  'breakout',
  'forecheck',
  'defensive zone',
  'small area games',
  'goalie work',
  'conditioning',
] as const;

export const DRILL_CATEGORY_OPTIONS = [
  'Warmup',
  'Skating',
  'Passing',
  'Shooting',
  'Small Area Games',
  'Battle Drills',
  'Breakout',
  'Forecheck',
  'Defensive Zone',
  'Power Play / Penalty Kill',
  'Goalie',
  'Conditioning',
  'Cooldown',
] as const;

export const DRILL_DIFFICULTY_OPTIONS = [
  'beginner',
  'intermediate',
  'advanced',
] as const;

export const PRACTICE_SECTION_OPTIONS = [
  'Warmup',
  'Skill Development',
  'Team Concepts',
  'Competition / Small Area Game',
  'Conditioning',
  'Cooldown',
] as const;

export const AGE_GROUP_OPTIONS = [
  '10U',
  '12U',
  '14U',
  '14U AA',
  '16U',
  '18U',
  'Junior',
  'Adult Rec',
] as const;

export type PracticeFocus = (typeof PRACTICE_FOCUS_OPTIONS)[number];
export type DrillCategory = (typeof DRILL_CATEGORY_OPTIONS)[number];
export type DrillDifficulty = (typeof DRILL_DIFFICULTY_OPTIONS)[number];
export type PracticeSection = (typeof PRACTICE_SECTION_OPTIONS)[number];
export type AgeGroup = (typeof AGE_GROUP_OPTIONS)[number];

export interface Drill {
  id: string;
  name: string;
  category: DrillCategory;
  skillFocus: PracticeFocus;
  difficulty: DrillDifficulty;
  recommendedDuration: number;
  equipment: string[];
  playerCount: number;
  setup: string;
  instructions: string[];
  coachingPoints: string[];
  commonMistakes: string[];
  variations: string[];
  tags: string[];
}

export interface PracticePlanDrill {
  id: string;
  drillId: string;
  customDuration: number;
  order: number;
  section: PracticeSection;
  customNotes: string;
}

export interface PracticePlan {
  id: string;
  title: string;
  date: string;
  team: string;
  ageGroup: AgeGroup;
  duration: number;
  focus: PracticeFocus;
  notes: string;
  drills: PracticePlanDrill[];
  createdAt: string;
  updatedAt: string;
}

export interface PracticePlanInput {
  title: string;
  date: string;
  team: string;
  ageGroup: AgeGroup;
  duration: number;
  focus: PracticeFocus;
  notes: string;
  drills?: PracticePlanDrill[];
}

export interface SmartPracticeRequest {
  ageGroup: AgeGroup;
  duration: number;
  focus: PracticeFocus;
  teamWeakness: string;
  intensity: 'low' | 'medium' | 'high';
  includeGoalies: boolean;
}

export interface SmartPracticeSuggestionSegment {
  section: PracticeSection;
  drillId: string;
  duration: number;
  reason: string;
}

export interface SmartPracticeSuggestion {
  title: string;
  summary: string;
  segments: SmartPracticeSuggestionSegment[];
}
