import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import type { Drill } from '../types/models';

interface DrillCardProps {
  drill: Drill;
  footer?: ReactNode;
}

export function DrillCard({ drill, footer }: DrillCardProps) {
  return (
    <article className="card drill-card">
      <header className="drill-card__header">
        <div>
          <p className="drill-card__category">{drill.category}</p>
          <h3>{drill.name}</h3>
        </div>
        <span className="pill">{drill.difficulty}</span>
      </header>

      <p className="drill-card__summary">{drill.setup}</p>

      <dl className="drill-card__meta">
        <div>
          <dt>Focus</dt>
          <dd>{drill.skillFocus}</dd>
        </div>
        <div>
          <dt>Duration</dt>
          <dd>{drill.recommendedDuration} min</dd>
        </div>
        <div>
          <dt>Players</dt>
          <dd>{drill.playerCount}</dd>
        </div>
        <div>
          <dt>Equipment</dt>
          <dd>{drill.equipment.join(', ')}</dd>
        </div>
      </dl>

      <div className="drill-card__insights">
        <p>
          <strong>Coach cue:</strong> {drill.coachingPoints[0]}
        </p>
        <p>
          <strong>Watch for:</strong> {drill.commonMistakes[0]}
        </p>
      </div>

      <div className="drill-card__equipment-list" aria-label="Required equipment">
        {drill.equipment.map((item) => (
          <span key={item} className="tag-chip">
            {item}
          </span>
        ))}
      </div>

      <p className="drill-card__tags">{drill.tags.join(' • ')}</p>

      <div className="drill-card__actions">
        <Link to={`/library/${drill.id}`} className="button button--ghost">
          View Details
        </Link>
        {footer}
      </div>
    </article>
  );
}
