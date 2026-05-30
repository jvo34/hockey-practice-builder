import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { DrillCard } from '../components/DrillCard';
import { DrillFiltersBar } from '../components/DrillFiltersBar';
import { usePracticePlanner } from '../context/PracticePlannerContext';
import { applyDrillFilters, defaultDrillFilters, type DrillFilters } from '../utils/drillFilters';

export function DrillLibraryPage() {
  const { drills, plans, addDrillToPlan } = usePracticePlanner();
  const [filters, setFilters] = useState<DrillFilters>(defaultDrillFilters);
  const [selectedPlanId, setSelectedPlanId] = useState(plans[0]?.id ?? '');

  const filteredDrills = useMemo(() => {
    return applyDrillFilters(drills, filters);
  }, [drills, filters]);

  const selectedPlan = plans.find((plan) => plan.id === selectedPlanId);

  return (
    <section className="stack-lg">
      <section className="split-header">
        <div>
          <p className="eyebrow">Drill Library</p>
          <h2>Search and filter reusable hockey drills</h2>
          <p className="muted">
            Add drills directly into a practice plan or open full detail views for setup and coaching notes.
          </p>
        </div>
      </section>

      <section className="card inline-tools">
        <label>
          Add drills to plan
          <select
            value={selectedPlanId}
            onChange={(event) => setSelectedPlanId(event.target.value)}
          >
            <option value="">Select a plan</option>
            {plans.map((plan) => (
              <option key={plan.id} value={plan.id}>
                {plan.title}
              </option>
            ))}
          </select>
        </label>

        <Link to="/plans/new" className="button button--ghost">
          Create New Plan
        </Link>

        {selectedPlan ? (
          <Link to={`/plans/${selectedPlan.id}/edit`} className="button button--primary">
            Open Selected Plan
          </Link>
        ) : null}
      </section>

      <DrillFiltersBar filters={filters} onChange={setFilters} />

      <section className="drill-grid">
        {filteredDrills.map((drill) => (
          <DrillCard
            key={drill.id}
            drill={drill}
            footer={
              <button
                type="button"
                className="button button--primary"
                disabled={!selectedPlanId}
                onClick={() => addDrillToPlan(selectedPlanId, drill.id)}
              >
                {selectedPlanId ? 'Add to selected plan' : 'Select a plan first'}
              </button>
            }
          />
        ))}
      </section>

      {filteredDrills.length === 0 ? (
        <p className="muted">No drills matched your filters. Try broadening the search.</p>
      ) : null}
    </section>
  );
}
