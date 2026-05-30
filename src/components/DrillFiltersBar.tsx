import {
  DRILL_CATEGORY_OPTIONS,
  DRILL_DIFFICULTY_OPTIONS,
  PRACTICE_FOCUS_OPTIONS,
} from '../types/models';
import type { DrillFilters } from '../utils/drillFilters';

interface DrillFiltersBarProps {
  filters: DrillFilters;
  onChange: (next: DrillFilters) => void;
}

export function DrillFiltersBar({ filters, onChange }: DrillFiltersBarProps) {
  function update<Key extends keyof DrillFilters>(key: Key, value: DrillFilters[Key]) {
    onChange({
      ...filters,
      [key]: value,
    });
  }

  return (
    <section className="card filters-card">
      <div className="filters-grid">
        <label>
          Search drills
          <input
            value={filters.search}
            placeholder="Name, tag, setup, instruction"
            onChange={(event) => update('search', event.target.value)}
          />
        </label>

        <label>
          Category
          <select
            value={filters.category}
            onChange={(event) =>
              update('category', event.target.value as DrillFilters['category'])
            }
          >
            <option value="all">All categories</option>
            {DRILL_CATEGORY_OPTIONS.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </label>

        <label>
          Difficulty
          <select
            value={filters.difficulty}
            onChange={(event) =>
              update('difficulty', event.target.value as DrillFilters['difficulty'])
            }
          >
            <option value="all">All difficulty levels</option>
            {DRILL_DIFFICULTY_OPTIONS.map((difficulty) => (
              <option key={difficulty} value={difficulty}>
                {difficulty}
              </option>
            ))}
          </select>
        </label>

        <label>
          Skill focus
          <select
            value={filters.focus}
            onChange={(event) => update('focus', event.target.value as DrillFilters['focus'])}
          >
            <option value="all">All focus areas</option>
            {PRACTICE_FOCUS_OPTIONS.map((focus) => (
              <option key={focus} value={focus}>
                {focus}
              </option>
            ))}
          </select>
        </label>

        <label>
          Max players
          <input
            type="number"
            min={2}
            step={1}
            value={filters.maxPlayers ?? ''}
            placeholder="No limit"
            onChange={(event) => {
              const value = event.target.value;
              update('maxPlayers', value ? Number(value) : null);
            }}
          />
        </label>

        <label className="checkbox-label">
          <input
            type="checkbox"
            checked={filters.smallGroupOnly}
            onChange={(event) => update('smallGroupOnly', event.target.checked)}
          />
          Small-group compatible only
        </label>
      </div>
    </section>
  );
}
