import { Link } from 'react-router-dom';
import { PRACTICE_SECTION_OPTIONS, type PracticePlan } from '../types/models';
import { formatDate } from '../utils/date';
import { getDurationDelta, getPlannedMinutes } from '../utils/practice';

interface PlanCardProps {
  plan: PracticePlan;
  onDuplicate: (planId: string) => void;
  onDelete: (planId: string) => void;
}

export function PlanCard({ plan, onDuplicate, onDelete }: PlanCardProps) {
  const plannedMinutes = getPlannedMinutes(plan);
  const delta = getDurationDelta(plan);
  const deltaLabel =
    delta === 0 ? 'On target' : delta > 0 ? `${delta} min over` : `${Math.abs(delta)} min under`;

  const sectionCounts = PRACTICE_SECTION_OPTIONS.map((section) => {
    return {
      section,
      count: plan.drills.filter((entry) => entry.section === section).length,
    };
  }).filter((entry) => entry.count > 0);

  const notePreview = plan.notes
    ? plan.notes.length > 110
      ? `${plan.notes.slice(0, 110)}...`
      : plan.notes
    : 'No session notes yet.';

  return (
    <article className="card plan-card">
      <header className="plan-card__header">
        <div>
          <h3>{plan.title}</h3>
          <p>{formatDate(plan.date)}</p>
        </div>
        <span className="pill">{plan.focus}</span>
      </header>

      <dl className="plan-card__meta">
        <div>
          <dt>Team</dt>
          <dd>{plan.team}</dd>
        </div>
        <div>
          <dt>Age group</dt>
          <dd>{plan.ageGroup}</dd>
        </div>
        <div>
          <dt>Target duration</dt>
          <dd>{plan.duration} min</dd>
        </div>
        <div>
          <dt>Planned timeline</dt>
          <dd>
            {plannedMinutes} min <span className="plan-card__delta">({deltaLabel})</span>
          </dd>
        </div>
      </dl>

      <div className="plan-card__sections" aria-label="Section breakdown">
        {sectionCounts.length > 0 ? (
          sectionCounts.map((entry) => (
            <span key={entry.section} className="plan-card__section-chip">
              {entry.section}: {entry.count}
            </span>
          ))
        ) : (
          <span className="plan-card__section-chip plan-card__section-chip--empty">
            No timeline sections yet
          </span>
        )}
      </div>

      <p className="plan-card__note">{notePreview}</p>

      <p className="plan-card__drill-count">{plan.drills.length} drills in timeline</p>

      <footer className="plan-card__actions">
        <Link to={`/plans/${plan.id}/edit`} className="button button--primary">
          Edit Plan
        </Link>
        <Link to={`/plans/${plan.id}/print`} className="button button--ghost">
          Print View
        </Link>
        <button type="button" className="button button--ghost" onClick={() => onDuplicate(plan.id)}>
          Duplicate
        </button>
        <button type="button" className="button button--danger" onClick={() => onDelete(plan.id)}>
          Delete
        </button>
      </footer>
    </article>
  );
}
