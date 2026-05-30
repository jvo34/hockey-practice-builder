import { useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { DrillMiniRinkDiagram } from '../components/DrillMiniRinkDiagram';
import { usePracticePlanner } from '../context/PracticePlannerContext';
import { PRACTICE_SECTION_OPTIONS, type PracticeSection } from '../types/models';
import { getDefaultSection } from '../utils/practice';

export function DrillDetailPage() {
  const { drillId = '' } = useParams();
  const { getDrillById, plans, addDrillToPlan } = usePracticePlanner();

  const drill = getDrillById(drillId);
  const [selectedPlanId, setSelectedPlanId] = useState(plans[0]?.id ?? '');
  const [section, setSection] = useState<PracticeSection | ''>('');
  const [duration, setDuration] = useState<number | ''>('');
  const [customNotes, setCustomNotes] = useState('');
  const [feedback, setFeedback] = useState('');

  const defaultSection = useMemo(() => {
    if (!drill) {
      return 'Warmup';
    }

    return getDefaultSection(drill.category);
  }, [drill]);

  if (!drill) {
    return (
      <section className="card">
        <h2>Drill not found</h2>
        <p className="muted">This drill may have been removed from the current seed library.</p>
        <Link className="button button--primary" to="/library">
          Back to library
        </Link>
      </section>
    );
  }

  function handleAddToPlan() {
    if (!selectedPlanId || !drill) {
      return;
    }

    addDrillToPlan(selectedPlanId, drill.id, {
      section: section || defaultSection,
      customDuration: typeof duration === 'number' ? duration : drill.recommendedDuration,
      customNotes: customNotes.trim(),
    });

    setFeedback('Drill added to plan timeline.');
    window.setTimeout(() => setFeedback(''), 1800);
  }

  return (
    <section className="stack-lg">
      <section className="split-header">
        <div>
          <p className="eyebrow">Drill Detail</p>
          <h2>{drill.name}</h2>
          <p className="muted">{drill.setup}</p>
        </div>
        <span className="pill">{drill.category}</span>
      </section>

      <section className="card inline-tools inline-tools--wrap">
        <label>
          Add to plan
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

        <label>
          Section
          <select
            value={section || defaultSection}
            onChange={(event) => setSection(event.target.value as PracticeSection)}
          >
            {PRACTICE_SECTION_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>

        <label>
          Duration (minutes)
          <input
            type="number"
            min={1}
            value={duration || drill.recommendedDuration}
            onChange={(event) => setDuration(Number(event.target.value))}
          />
        </label>

        <label>
          Custom notes
          <input
            value={customNotes}
            onChange={(event) => setCustomNotes(event.target.value)}
            placeholder="Optional notes for this plan entry"
          />
        </label>

        <button
          type="button"
          className="button button--primary"
          disabled={!selectedPlanId}
          onClick={handleAddToPlan}
        >
          Add Drill
        </button>

        {feedback ? <p className="muted">{feedback}</p> : null}
      </section>

      <section className="card drill-detail-visual">
        <div>
          <p className="eyebrow">Tactical Board</p>
          <h3>Chalkboard route sketch</h3>
          <p className="muted">
            Use this quick visual in pre-drill huddles to align route timing and support responsibilities.
          </p>
          <div className="drill-detail-legend">
            <span className="drill-detail-legend__item drill-detail-legend__item--blue">
              Support route
            </span>
            <span className="drill-detail-legend__item drill-detail-legend__item--red">
              Pressure route
            </span>
            <span className="drill-detail-legend__item drill-detail-legend__item--white">
              Timing lane
            </span>
          </div>
        </div>
        <DrillMiniRinkDiagram drill={drill} />
      </section>

      <section className="card">
        <h3>Overview</h3>
        <dl className="drill-card__meta">
          <div>
            <dt>Skill focus</dt>
            <dd>{drill.skillFocus}</dd>
          </div>
          <div>
            <dt>Difficulty</dt>
            <dd>{drill.difficulty}</dd>
          </div>
          <div>
            <dt>Recommended duration</dt>
            <dd>{drill.recommendedDuration} minutes</dd>
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
      </section>

      <section className="card">
        <h3>Instructions</h3>
        <ol className="stack-sm">
          {drill.instructions.map((instruction) => (
            <li key={instruction}>{instruction}</li>
          ))}
        </ol>
      </section>

      <section className="card">
        <h3>Coaching points</h3>
        <ul className="stack-sm">
          {drill.coachingPoints.map((point) => (
            <li key={point}>{point}</li>
          ))}
        </ul>
      </section>

      <section className="card">
        <h3>Common mistakes</h3>
        <ul className="stack-sm">
          {drill.commonMistakes.map((mistake) => (
            <li key={mistake}>{mistake}</li>
          ))}
        </ul>
      </section>

      <section className="card">
        <h3>Variations / progressions</h3>
        <ul className="stack-sm">
          {drill.variations.map((variation) => (
            <li key={variation}>{variation}</li>
          ))}
        </ul>
      </section>
    </section>
  );
}
