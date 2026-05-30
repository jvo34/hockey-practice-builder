import { useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { DrillPickerPanel } from '../components/DrillPickerPanel';
import { TimelineBuilder } from '../components/TimelineBuilder';
import { usePracticePlanner } from '../context/PracticePlannerContext';
import {
  AGE_GROUP_OPTIONS,
  PRACTICE_FOCUS_OPTIONS,
  type PracticePlan,
  type PracticePlanInput,
} from '../types/models';
import { getDurationStatus, getPlannedMinutes } from '../utils/practice';

interface PlanDraft {
  title: string;
  date: string;
  team: string;
  ageGroup: PracticePlanInput['ageGroup'];
  duration: number;
  focus: PracticePlanInput['focus'];
  notes: string;
}

interface PlanEditorContentProps {
  plan: PracticePlan;
  drills: ReturnType<typeof usePracticePlanner>['drills'];
  updatePlan: ReturnType<typeof usePracticePlanner>['updatePlan'];
  addDrillToPlan: ReturnType<typeof usePracticePlanner>['addDrillToPlan'];
  moveDrillInPlan: ReturnType<typeof usePracticePlanner>['moveDrillInPlan'];
  removeDrillFromPlan: ReturnType<typeof usePracticePlanner>['removeDrillFromPlan'];
  updatePlanDrill: ReturnType<typeof usePracticePlanner>['updatePlanDrill'];
}

export function PlanEditorPage() {
  const { planId = '' } = useParams();
  const {
    drills,
    getPlanById,
    updatePlan,
    addDrillToPlan,
    moveDrillInPlan,
    removeDrillFromPlan,
    updatePlanDrill,
  } = usePracticePlanner();

  const plan = getPlanById(planId);
  if (!plan) {
    return (
      <section className="card">
        <h2>Practice plan not found</h2>
        <p className="muted">The plan might have been deleted or the link is no longer valid.</p>
        <Link className="button button--primary" to="/">
          Return to dashboard
        </Link>
      </section>
    );
  }

  return (
    <PlanEditorContent
      key={plan.id}
      plan={plan}
      drills={drills}
      updatePlan={updatePlan}
      addDrillToPlan={addDrillToPlan}
      moveDrillInPlan={moveDrillInPlan}
      removeDrillFromPlan={removeDrillFromPlan}
      updatePlanDrill={updatePlanDrill}
    />
  );
}

function PlanEditorContent({
  plan,
  drills,
  updatePlan,
  addDrillToPlan,
  moveDrillInPlan,
  removeDrillFromPlan,
  updatePlanDrill,
}: PlanEditorContentProps) {
  const [draft, setDraft] = useState<PlanDraft>(() => ({
    title: plan.title,
    date: plan.date,
    team: plan.team,
    ageGroup: plan.ageGroup,
    duration: plan.duration,
    focus: plan.focus,
    notes: plan.notes,
  }));
  const [saveMessage, setSaveMessage] = useState('');

  const drillLookup = useMemo(() => {
    return new Map(drills.map((drill) => [drill.id, drill]));
  }, [drills]);

  const plannedMinutes = getPlannedMinutes(plan);
  const status = getDurationStatus(plan);

  function updateDraft<Key extends keyof PlanDraft>(key: Key, value: PlanDraft[Key]) {
    setDraft((previous) => {
      return {
        ...previous,
        [key]: value,
      };
    });
  }

  function handleSaveMetadata() {
    updatePlan(plan.id, {
      title: draft.title.trim(),
      date: draft.date,
      team: draft.team.trim(),
      ageGroup: draft.ageGroup,
      duration: Math.max(20, draft.duration),
      focus: draft.focus,
      notes: draft.notes.trim(),
    });

    setSaveMessage('Plan details saved.');
    window.setTimeout(() => setSaveMessage(''), 1500);
  }

  return (
    <section className="stack-lg">
      <section className="split-header split-header--top">
        <div>
          <p className="eyebrow">Practice Builder</p>
          <h2>{plan.title}</h2>
          <p className="muted">Adjust session details, build timeline order, and prep a print-ready sheet.</p>
        </div>
        <div className="split-actions">
          <Link className="button button--ghost" to={`/plans/${plan.id}/print`}>
            Open Print View
          </Link>
          <Link className="button button--ghost" to="/library">
            Browse Full Library
          </Link>
        </div>
      </section>

      <section className="editor-layout">
        <article className="card">
          <h3>Practice details</h3>
          <div className="form-grid">
            <label>
              Title
              <input
                value={draft.title}
                onChange={(event) => updateDraft('title', event.target.value)}
              />
            </label>
            <label>
              Date
              <input
                type="date"
                value={draft.date}
                onChange={(event) => updateDraft('date', event.target.value)}
              />
            </label>
          </div>

          <div className="form-grid">
            <label>
              Team
              <input
                value={draft.team}
                onChange={(event) => updateDraft('team', event.target.value)}
              />
            </label>
            <label>
              Age group
              <select
                value={draft.ageGroup}
                onChange={(event) =>
                  updateDraft('ageGroup', event.target.value as PlanDraft['ageGroup'])
                }
              >
                {AGE_GROUP_OPTIONS.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="form-grid form-grid--triple">
            <label>
              Target duration
              <input
                type="number"
                min={20}
                step={5}
                value={draft.duration}
                onChange={(event) => updateDraft('duration', Number(event.target.value))}
              />
            </label>
            <label>
              Focus
              <select
                value={draft.focus}
                onChange={(event) =>
                  updateDraft('focus', event.target.value as PlanDraft['focus'])
                }
              >
                {PRACTICE_FOCUS_OPTIONS.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Planned timeline
              <input value={`${plannedMinutes} min`} readOnly aria-label="Planned timeline" />
            </label>
          </div>

          <label>
            Session notes / goals
            <textarea
              rows={4}
              value={draft.notes}
              onChange={(event) => updateDraft('notes', event.target.value)}
            />
          </label>

          <div className="split-header">
            <button type="button" className="button button--primary" onClick={handleSaveMetadata}>
              Save Plan Details
            </button>
            {saveMessage ? <p className="muted">{saveMessage}</p> : null}
          </div>
        </article>

        <article className={`card duration-status duration-status--${status.tone}`}>
          <h3>Schedule check</h3>
          <p>
            Target: <strong>{plan.duration} min</strong>
          </p>
          <p>
            Planned: <strong>{plannedMinutes} min</strong>
          </p>
          <p>{status.message}</p>
        </article>
      </section>

      <TimelineBuilder
        plan={plan}
        drillLookup={drillLookup}
        onMove={(planDrillId, direction) => moveDrillInPlan(plan.id, planDrillId, direction)}
        onRemove={(planDrillId) => removeDrillFromPlan(plan.id, planDrillId)}
        onUpdate={(planDrillId, updates) => updatePlanDrill(plan.id, planDrillId, updates)}
      />

      <DrillPickerPanel
        drills={drills}
        onAdd={(drillId) => {
          addDrillToPlan(plan.id, drillId);
        }}
      />
    </section>
  );
}
