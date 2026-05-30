import type {
  Drill,
  PracticeFocus,
  PracticeSection,
  SmartPracticeRequest,
  SmartPracticeSuggestion,
} from '../types/models';

interface SectionTemplate {
  section: PracticeSection;
  preferredCategories: Drill['category'][];
  percentage: number;
}

const FOCUS_KEYWORDS: Record<PracticeFocus, string[]> = {
  skating: ['edge', 'stride', 'tempo', 'warmup'],
  passing: ['pass', 'support', 'regroup', 'breakout'],
  shooting: ['shot', 'release', 'net'],
  'battle drills': ['battle', 'compete', 'net-drive'],
  breakout: ['breakout', 'retrieval', 'pressure', 'regroup'],
  forecheck: ['forecheck', 'backcheck', 'pressure'],
  'defensive zone': ['coverage', 'defensive', 'slot', 'support'],
  'small area games': ['small', '2v2', '3v3', 'competition'],
  'goalie work': ['goalie', 'screen', 'tip'],
  conditioning: ['conditioning', 'relay', 'tempo'],
};

function templatesForIntensity(
  intensity: SmartPracticeRequest['intensity'],
): SectionTemplate[] {
  const conditioningPercentage = intensity === 'high' ? 0.14 : intensity === 'low' ? 0.07 : 0.1;

  return [
    {
      section: 'Warmup',
      preferredCategories: ['Warmup', 'Skating'],
      percentage: 0.16,
    },
    {
      section: 'Skill Development',
      preferredCategories: ['Skating', 'Passing', 'Shooting', 'Goalie'],
      percentage: 0.24,
    },
    {
      section: 'Team Concepts',
      preferredCategories: [
        'Breakout',
        'Forecheck',
        'Defensive Zone',
        'Power Play / Penalty Kill',
      ],
      percentage: 0.26,
    },
    {
      section: 'Competition / Small Area Game',
      preferredCategories: ['Small Area Games', 'Battle Drills'],
      percentage: 0.22,
    },
    {
      section: 'Conditioning',
      preferredCategories: ['Conditioning', 'Forecheck'],
      percentage: conditioningPercentage,
    },
    {
      section: 'Cooldown',
      preferredCategories: ['Cooldown'],
      percentage: 0.05,
    },
  ];
}

function normalizeText(value: string): string {
  return value.toLowerCase();
}

function includesAny(text: string, keywords: string[]): boolean {
  return keywords.some((keyword) => text.includes(keyword));
}

function drillScore(
  drill: Drill,
  focus: PracticeFocus,
  weaknessText: string,
  preferredCategories: Drill['category'][],
  ageGroup: string,
): number {
  let score = 0;

  if (drill.skillFocus === focus) {
    score += 5;
  }

  if (preferredCategories.includes(drill.category)) {
    score += 4;
  }

  const searchable = normalizeText(
    [drill.name, drill.setup, drill.tags.join(' ')].join(' '),
  );
  if (includesAny(searchable, FOCUS_KEYWORDS[focus])) {
    score += 2;
  }

  if (weaknessText && searchable.includes(weaknessText)) {
    score += 2;
  }

  if (weaknessText && weaknessText.includes('pressure') && searchable.includes('pressure')) {
    score += 2;
  }

  if (ageGroup.includes('10U') || ageGroup.includes('12U')) {
    if (drill.difficulty === 'beginner') {
      score += 1;
    }
  } else if (drill.difficulty !== 'beginner') {
    score += 1;
  }

  return score;
}

function durationByTemplate(duration: number, templates: SectionTemplate[]): number[] {
  const values = templates.map((template) => Math.max(4, Math.round(duration * template.percentage)));
  const currentTotal = values.reduce((sum, value) => sum + value, 0);
  const delta = duration - currentTotal;
  values[2] += delta;

  if (values[2] < 5) {
    const repair = 5 - values[2];
    values[2] = 5;
    values[3] = Math.max(5, values[3] - repair);
  }

  return values;
}

export function generateSmartPracticeSuggestion(
  request: SmartPracticeRequest,
  drills: Drill[],
): SmartPracticeSuggestion {
  const templates = templatesForIntensity(request.intensity);
  const durations = durationByTemplate(request.duration, templates);
  const usedDrillIds = new Set<string>();
  const weaknessText = normalizeText(request.teamWeakness.trim());

  const segments = templates.flatMap((template, index) => {
    const candidates = drills
      .filter((drill) => !usedDrillIds.has(drill.id))
      .filter((drill) => {
        if (!request.includeGoalies && drill.category === 'Goalie') {
          return false;
        }

        if (template.section === 'Cooldown') {
          return drill.category === 'Cooldown';
        }

        return true;
      })
      .sort((first, second) => {
        return (
          drillScore(
            second,
            request.focus,
            weaknessText,
            template.preferredCategories,
            request.ageGroup,
          ) -
          drillScore(
            first,
            request.focus,
            weaknessText,
            template.preferredCategories,
            request.ageGroup,
          )
        );
      });

    const selected = candidates[0] ?? drills[0];
    usedDrillIds.add(selected.id);

    const reasonParts = [
      selected.skillFocus === request.focus
        ? `Directly supports ${request.focus}.`
        : `Builds support habits around ${request.focus}.`,
    ];

    if (weaknessText) {
      reasonParts.push(`Targets weakness: ${request.teamWeakness.trim()}.`);
    }

    return [
      {
        section: template.section,
        drillId: selected.id,
        duration: durations[index],
        reason: reasonParts.join(' '),
      },
    ];
  });

  return {
    title: `${request.ageGroup} ${request.focus} practice builder`,
    summary:
      'AI-ready mock planning assistant created a balanced flow from warmup through cooldown using local drill intelligence.',
    segments,
  };
}
