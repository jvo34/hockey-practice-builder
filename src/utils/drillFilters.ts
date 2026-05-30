import type {
  Drill,
  DrillCategory,
  DrillDifficulty,
  PracticeFocus,
} from '../types/models';
import { isSmallGroupCompatible } from './practice';

export interface DrillFilters {
  search: string;
  category: DrillCategory | 'all';
  difficulty: DrillDifficulty | 'all';
  focus: PracticeFocus | 'all';
  maxPlayers: number | null;
  smallGroupOnly: boolean;
}

export const defaultDrillFilters: DrillFilters = {
  search: '',
  category: 'all',
  difficulty: 'all',
  focus: 'all',
  maxPlayers: null,
  smallGroupOnly: false,
};

export function applyDrillFilters(drills: Drill[], filters: DrillFilters): Drill[] {
  const term = filters.search.trim().toLowerCase();

  return drills.filter((drill) => {
    if (filters.category !== 'all' && drill.category !== filters.category) {
      return false;
    }

    if (filters.difficulty !== 'all' && drill.difficulty !== filters.difficulty) {
      return false;
    }

    if (filters.focus !== 'all' && drill.skillFocus !== filters.focus) {
      return false;
    }

    if (typeof filters.maxPlayers === 'number' && drill.playerCount > filters.maxPlayers) {
      return false;
    }

    if (filters.smallGroupOnly && !isSmallGroupCompatible(drill)) {
      return false;
    }

    if (!term) {
      return true;
    }

    const searchable = [
      drill.name,
      drill.setup,
      drill.instructions.join(' '),
      drill.tags.join(' '),
      drill.skillFocus,
      drill.category,
    ]
      .join(' ')
      .toLowerCase();

    return searchable.includes(term);
  });
}
