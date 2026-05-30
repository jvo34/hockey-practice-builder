import { Link, useParams } from 'react-router-dom';
import { usePracticePlanner } from '../context/PracticePlannerContext';
import { formatDate } from '../utils/date';
import { getEquipmentList, getPlannedMinutes } from '../utils/practice';

function formatOffset(minutes: number): string {
  const wholeHours = Math.floor(minutes / 60);
  const remainder = minutes % 60;
  return `${String(wholeHours).padStart(2, '0')}:${String(remainder).padStart(2, '0')}`;
}

export function PrintPlanPage() {
  const { planId = '' } = useParams();
  const { getPlanById, getDrillById, drills } = usePracticePlanner();

  const plan = getPlanById(planId);

  if (!plan) {
    return (
      <section className="card">
        <h2>Practice plan not found</h2>
        <Link className="button button--primary" to="/">
          Return to dashboard
        </Link>
      </section>
    );
  }

  const drillLookup = new Map(drills.map((drill) => [drill.id, drill]));
  const equipment = getEquipmentList(plan.drills, drillLookup);

  const timelineRows = [...plan.drills]
    .sort((first, second) => first.order - second.order)
    .reduce<
      Array<{
        id: string;
        start: number;
        drill: NonNullable<ReturnType<typeof getDrillById>>;
        entry: (typeof plan.drills)[number];
      }>
    >((rows, entry) => {
      const drill = getDrillById(entry.drillId);
      if (!drill) {
        return rows;
      }

      const start = rows.length
        ? rows[rows.length - 1].start + rows[rows.length - 1].entry.customDuration
        : 0;

      return [
        ...rows,
        {
          id: entry.id,
          start,
          drill,
          entry,
        },
      ];
    }, []);

  const plannedMinutes = getPlannedMinutes(plan);

  return (
    <section className="print-page">
      <div className="no-print print-actions">
        <Link to={`/plans/${plan.id}/edit`} className="button button--ghost">
          Back to builder
        </Link>
        <button type="button" className="button button--primary" onClick={() => window.print()}>
          Print Practice Sheet
        </button>
      </div>

      <article className="print-sheet">
        <header className="print-sheet__header">
          <div>
            <p className="eyebrow">Coach Print View</p>
            <h1>{plan.title}</h1>
            <p>{formatDate(plan.date)}</p>
          </div>

          <dl className="print-meta">
            <div>
              <dt>Team</dt>
              <dd>{plan.team}</dd>
            </div>
            <div>
              <dt>Age group</dt>
              <dd>{plan.ageGroup}</dd>
            </div>
            <div>
              <dt>Main focus</dt>
              <dd>{plan.focus}</dd>
            </div>
            <div>
              <dt>Target / planned</dt>
              <dd>
                {plan.duration} / {plannedMinutes} min
              </dd>
            </div>
          </dl>
        </header>

        <section className="print-section">
          <h2>Practice timeline</h2>
          <table className="timeline-table">
            <thead>
              <tr>
                <th>Start</th>
                <th>Section</th>
                <th>Drill</th>
                <th>Duration</th>
                <th>Coaching notes</th>
              </tr>
            </thead>
            <tbody>
              {timelineRows.map((row) => (
                <tr key={row.id}>
                  <td>{formatOffset(row.start)}</td>
                  <td>{row.entry.section}</td>
                  <td>
                    <strong>{row.drill.name}</strong>
                    <p>{row.drill.setup}</p>
                  </td>
                  <td>{row.entry.customDuration} min</td>
                  <td>{row.entry.customNotes || '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        <section className="print-section print-section--two-column">
          <div>
            <h2>Session notes</h2>
            <p>{plan.notes || 'No additional session notes added.'}</p>
          </div>
          <div>
            <h2>Equipment checklist</h2>
            <ul>
              {equipment.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </section>
      </article>
    </section>
  );
}
