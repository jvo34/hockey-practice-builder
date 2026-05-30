import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { usePracticePlanner } from '../context/PracticePlannerContext';
import {
  AGE_GROUP_OPTIONS,
  PRACTICE_FOCUS_OPTIONS,
  type SmartPracticeRequest,
} from '../types/models';
import { todayIsoDate } from '../utils/date';
import { createPlanDrillEntry } from '../utils/practice';
import { generateSmartPracticeSuggestion } from '../utils/smartSuggestion';

const defaultRequest: SmartPracticeRequest = {
  ageGroup: '14U AA',
  duration: 60,
  focus: 'breakout',
  teamWeakness: 'panic under pressure',
  intensity: 'medium',
  includeGoalies: true,
};

function getSectionTone(section: string): string {
  switch (section) {
    case 'Warmup':
      return 'warmup';
    case 'Skill Development':
      return 'skill';
    case 'Team Concepts':
      return 'team';
    case 'Competition / Small Area Game':
      return 'competition';
    case 'Conditioning':
      return 'conditioning';
    case 'Cooldown':
      return 'cooldown';
    default:
      return 'default';
  }
}

export function SmartGeneratorPage() {
  const { drills, getDrillById, createPlan } = usePracticePlanner();
  const [request, setRequest] = useState<SmartPracticeRequest>(defaultRequest);
  const [suggestion, setSuggestion] = useState(() =>
    generateSmartPracticeSuggestion(defaultRequest, drills),
  );
  const [createdPlanId, setCreatedPlanId] = useState('');

  const totalSuggestionMinutes = useMemo(() => {
    return suggestion.segments.reduce((sum, segment) => sum + segment.duration, 0);
  }, [suggestion]);

  function updateRequest<Key extends keyof SmartPracticeRequest>(
    key: Key,
    value: SmartPracticeRequest[Key],
  ) {
    setRequest((previous) => ({
      ...previous,
      [key]: value,
    }));
  }

  function handleGenerate() {
    setSuggestion(generateSmartPracticeSuggestion(request, drills));
    setCreatedPlanId('');
  }

  function handleCreatePlanFromSuggestion() {
    const planDrills = suggestion.segments
      .map((segment, index) => {
        const drill = getDrillById(segment.drillId);
        if (!drill) {
          return null;
        }

        return createPlanDrillEntry(drill, index, {
          customDuration: segment.duration,
          section: segment.section,
        });
      })
      .filter((entry): entry is NonNullable<typeof entry> => entry !== null);

    const created = createPlan({
      title: suggestion.title,
      date: todayIsoDate(),
      team: `${request.ageGroup} Team`,
      ageGroup: request.ageGroup,
      duration: request.duration,
      focus: request.focus,
      notes: `Smart planner input weakness: ${request.teamWeakness}. Intensity: ${request.intensity}.`,
      drills: planDrills,
    });

    setCreatedPlanId(created.id);
  }

  return (
    <section className="stack-lg">
      <section className="split-header">
        <div>
          <p className="eyebrow">AI-Ready Practice Assistant</p>
          <h2>Smart practice suggestions</h2>
          <p className="muted">
            Mock AI logic uses your team context and drill library metadata to generate a structured practice blueprint.
          </p>
        </div>
      </section>

      <section className="generator-layout">
        <article className="card">
          <h3>Input profile</h3>
          <div className="form-grid form-grid--triple">
            <label>
              Team age group
              <select
                value={request.ageGroup}
                onChange={(event) =>
                  updateRequest('ageGroup', event.target.value as SmartPracticeRequest['ageGroup'])
                }
              >
                {AGE_GROUP_OPTIONS.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </label>

            <label>
              Practice length
              <input
                type="number"
                min={30}
                step={5}
                value={request.duration}
                onChange={(event) => updateRequest('duration', Number(event.target.value))}
              />
            </label>

            <label>
              Main focus
              <select
                value={request.focus}
                onChange={(event) =>
                  updateRequest('focus', event.target.value as SmartPracticeRequest['focus'])
                }
              >
                {PRACTICE_FOCUS_OPTIONS.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="form-grid">
            <label>
              Team weakness
              <input
                value={request.teamWeakness}
                onChange={(event) => updateRequest('teamWeakness', event.target.value)}
                placeholder="Example: panic under pressure"
              />
            </label>

            <label>
              Intensity
              <select
                value={request.intensity}
                onChange={(event) =>
                  updateRequest('intensity', event.target.value as SmartPracticeRequest['intensity'])
                }
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </label>
          </div>

          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={request.includeGoalies}
              onChange={(event) => updateRequest('includeGoalies', event.target.checked)}
            />
            Include goalie-specific segment
          </label>

          <button type="button" className="button button--primary" onClick={handleGenerate}>
            Generate Suggestion
          </button>
        </article>

        <article className="card smart-output-card">
          <h3>{suggestion.title}</h3>
          <p className="muted smart-output-card__summary">{suggestion.summary}</p>
          <p className="muted smart-output-card__total">
            Total suggested time: {totalSuggestionMinutes} minutes
          </p>

          <ol className="smart-list">
            {suggestion.segments.map((segment, index) => {
              const drill = getDrillById(segment.drillId);
              if (!drill) {
                return null;
              }

              return (
                <li key={`${segment.drillId}-${index}`}>
                  <header className="smart-list__header">
                    <p className="smart-list__drill">
                      <span className="smart-list__duration">{segment.duration} min</span>
                      <span className="smart-list__dot" aria-hidden="true">
                        {' '}
                        ·{' '}
                      </span>
                      {drill.name}
                    </p>
                    <span
                      className={`smart-list__section smart-list__section--${getSectionTone(segment.section)}`}
                    >
                      {segment.section}
                    </span>
                  </header>
                  <p className="smart-list__description">{segment.reason}</p>
                </li>
              );
            })}
          </ol>

          <div className="split-actions">
            <button
              type="button"
              className="button button--primary"
              onClick={handleCreatePlanFromSuggestion}
            >
              Save as Practice Plan
            </button>
            {createdPlanId ? (
              <Link className="button button--ghost" to={`/plans/${createdPlanId}/edit`}>
                Open Created Plan
              </Link>
            ) : null}
          </div>
        </article>
      </section>
    </section>
  );
}
