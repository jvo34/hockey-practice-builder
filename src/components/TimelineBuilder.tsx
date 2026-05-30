import {
  PRACTICE_SECTION_OPTIONS,
  type Drill,
  type PracticePlan,
  type PracticePlanDrill,
} from '../types/models';

interface TimelineBuilderProps {
  plan: PracticePlan;
  drillLookup: Map<string, Drill>;
  onMove: (planDrillId: string, direction: 'up' | 'down') => void;
  onRemove: (planDrillId: string) => void;
  onUpdate: (
    planDrillId: string,
    updates: Partial<Pick<PracticePlanDrill, 'customDuration' | 'section' | 'customNotes'>>,
  ) => void;
}

function sectionToneClass(section: string): string {
  return section
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

export function TimelineBuilder({
  plan,
  drillLookup,
  onMove,
  onRemove,
  onUpdate,
}: TimelineBuilderProps) {
  const sortedTimeline = [...plan.drills].sort((first, second) => first.order - second.order);

  if (sortedTimeline.length === 0) {
    return (
      <section className="card">
        <h2>Practice timeline</h2>
        <p className="muted">
          Add drills from the library panel to start building your on-ice flow.
        </p>
      </section>
    );
  }

  return (
    <section className="card timeline-card">
      <h2>Practice timeline</h2>

      <div className="timeline-sections">
        {PRACTICE_SECTION_OPTIONS.map((section) => {
          const entries = sortedTimeline.filter((entry) => entry.section === section);

          if (entries.length === 0) {
            return null;
          }

          return (
            <section
              key={section}
              className={`timeline-section timeline-section--${sectionToneClass(section)}`}
            >
              <h3>{section}</h3>
              <ul className="timeline-list">
                {entries.map((entry) => {
                  const drill = drillLookup.get(entry.drillId);
                  if (!drill) {
                    return null;
                  }

                  const isFirst = entry.order === 0;
                  const isLast = entry.order === sortedTimeline.length - 1;
                  const sequence = entry.order + 1;

                  return (
                    <li key={entry.id} className="timeline-item">
                      <div className="timeline-item__top">
                        <div>
                          <p className="timeline-item__index">Rep {sequence}</p>
                          <p className="timeline-item__name">{drill.name}</p>
                          <p className="timeline-item__meta">
                            {drill.category} • {drill.difficulty} • {drill.skillFocus}
                          </p>
                        </div>
                        <div className="timeline-item__actions">
                          <button
                            type="button"
                            className="button button--ghost"
                            disabled={isFirst}
                            onClick={() => onMove(entry.id, 'up')}
                          >
                            Up
                          </button>
                          <button
                            type="button"
                            className="button button--ghost"
                            disabled={isLast}
                            onClick={() => onMove(entry.id, 'down')}
                          >
                            Down
                          </button>
                          <button
                            type="button"
                            className="button button--danger"
                            onClick={() => onRemove(entry.id)}
                          >
                            Remove
                          </button>
                        </div>
                      </div>

                      <div className="timeline-item__controls">
                        <label>
                          Duration (min)
                          <input
                            type="number"
                            min={1}
                            step={1}
                            value={entry.customDuration}
                            onChange={(event) => {
                              onUpdate(entry.id, {
                                customDuration: Number(event.target.value),
                              });
                            }}
                          />
                        </label>

                        <label>
                          Section
                          <select
                            value={entry.section}
                            onChange={(event) => {
                              onUpdate(entry.id, {
                                section: event.target.value as PracticePlanDrill['section'],
                              });
                            }}
                          >
                            {PRACTICE_SECTION_OPTIONS.map((option) => (
                              <option key={option} value={option}>
                                {option}
                              </option>
                            ))}
                          </select>
                        </label>
                      </div>

                      <label>
                        Custom coaching notes
                        <textarea
                          rows={2}
                          value={entry.customNotes}
                          onChange={(event) => {
                            onUpdate(entry.id, {
                              customNotes: event.target.value,
                            });
                          }}
                          placeholder="Optional coaching cue for this segment"
                        />
                      </label>
                    </li>
                  );
                })}
              </ul>
            </section>
          );
        })}
      </div>
    </section>
  );
}
