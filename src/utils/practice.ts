import type { Drill, DrillCategory, PracticePlan, PracticePlanDrill, PracticeSection } from '../types/models';

const CATEGORY_TO_SECTION: Record<DrillCategory, PracticeSection> = {
  Warmup: 'Warmup',
  Skating: 'Skill Development',
  Passing: 'Skill Development',
  Shooting: 'Skill Development',
  'Small Area Games': 'Competition / Small Area Game',
  'Battle Drills': 'Competition / Small Area Game',
  Breakout: 'Team Concepts',
  Forecheck: 'Team Concepts',
  'Defensive Zone': 'Team Concepts',
  'Power Play / Penalty Kill': 'Team Concepts',
  Goalie: 'Skill Development',
  Conditioning: 'Conditioning',
  Cooldown: 'Cooldown',
};

export function getDefaultSection(category: DrillCategory): PracticeSection {
  return CATEGORY_TO_SECTION[category];
}

export function getPlannedMinutes(plan: Pick<PracticePlan, 'drills'>): number {
  return plan.drills.reduce((total, drill) => total + drill.customDuration, 0);
}

export function getDurationDelta(plan: Pick<PracticePlan, 'drills' | 'duration'>): number {
  return getPlannedMinutes(plan) - plan.duration;
}

export function getDurationStatus(plan: Pick<PracticePlan, 'drills' | 'duration'>): {
  tone: 'good' | 'warn' | 'danger';
  message: string;
} {
  const delta = getDurationDelta(plan);

  if (delta === 0) {
    return {
      tone: 'good',
      message: 'Perfectly scheduled. Drill timeline matches target duration.',
    };
  }

  if (Math.abs(delta) <= 5) {
    return {
      tone: 'warn',
      message:
        delta > 0
          ? `${delta} minutes over target. Consider trimming one segment.`
          : `${Math.abs(delta)} minutes under target. Add a short support drill.`,
    };
  }

  return {
    tone: 'danger',
    message:
      delta > 0
        ? `${delta} minutes over target. Practice likely runs long without adjustments.`
        : `${Math.abs(delta)} minutes under target. Build more reps to hit your planned ice time.`,
  };
}

export function createPlanDrillEntry(
  drill: Drill,
  order: number,
  overrides?: Partial<Pick<PracticePlanDrill, 'customDuration' | 'section' | 'customNotes'>>,
): PracticePlanDrill {
  return {
    id: crypto.randomUUID(),
    drillId: drill.id,
    customDuration: overrides?.customDuration ?? drill.recommendedDuration,
    order,
    section: overrides?.section ?? getDefaultSection(drill.category),
    customNotes: overrides?.customNotes ?? '',
  };
}

export function sortPlanDrills(drills: PracticePlanDrill[]): PracticePlanDrill[] {
  return [...drills]
    .sort((first, second) => first.order - second.order)
    .map((drill, index) => ({
      ...drill,
      order: index,
    }));
}

export function getEquipmentList(planDrills: PracticePlanDrill[], drillLookup: Map<string, Drill>): string[] {
  const equipmentSet = new Set<string>();

  planDrills.forEach((entry) => {
    const drill = drillLookup.get(entry.drillId);
    if (!drill) {
      return;
    }

    drill.equipment.forEach((item) => equipmentSet.add(item));
  });

  return [...equipmentSet].sort((a, b) => a.localeCompare(b));
}

export function isSmallGroupCompatible(drill: Drill): boolean {
  return drill.playerCount <= 8 || drill.tags.includes('small-group');
}
