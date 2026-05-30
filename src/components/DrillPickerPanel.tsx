import { useMemo, useState } from 'react';
import type { Drill } from '../types/models';
import { applyDrillFilters, defaultDrillFilters, type DrillFilters } from '../utils/drillFilters';
import { DrillCard } from './DrillCard';
import { DrillFiltersBar } from './DrillFiltersBar';

interface DrillPickerPanelProps {
  drills: Drill[];
  onAdd: (drillId: string) => void;
}

export function DrillPickerPanel({ drills, onAdd }: DrillPickerPanelProps) {
  const [filters, setFilters] = useState<DrillFilters>(defaultDrillFilters);

  const filteredDrills = useMemo(() => {
    return applyDrillFilters(drills, filters);
  }, [drills, filters]);

  return (
    <section className="drill-picker">
      <h2>Drill library</h2>
      <p className="muted">Filter and add drills directly into the active timeline.</p>
      <DrillFiltersBar filters={filters} onChange={setFilters} />

      <div className="drill-grid drill-grid--compact">
        {filteredDrills.map((drill) => (
          <DrillCard
            key={drill.id}
            drill={drill}
            footer={
              <button
                type="button"
                className="button button--primary"
                onClick={() => onAdd(drill.id)}
              >
                Add to timeline
              </button>
            }
          />
        ))}
      </div>

      {filteredDrills.length === 0 ? (
        <p className="muted">No drills match your current filters.</p>
      ) : null}
    </section>
  );
}
