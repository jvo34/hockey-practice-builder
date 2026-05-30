import { useMemo, useState, type FormEvent } from 'react';
import {
  AGE_GROUP_OPTIONS,
  PRACTICE_FOCUS_OPTIONS,
  type PracticePlanInput,
} from '../types/models';
import { todayIsoDate } from '../utils/date';

interface PracticePlanFormProps {
  initialValues?: PracticePlanInput;
  submitLabel: string;
  heading: string;
  onSubmit: (values: PracticePlanInput) => void;
}

const defaultValues: PracticePlanInput = {
  title: '',
  date: todayIsoDate(),
  team: '',
  ageGroup: '14U',
  duration: 60,
  focus: 'breakout',
  notes: '',
  drills: [],
};

export function PracticePlanForm({
  initialValues,
  submitLabel,
  heading,
  onSubmit,
}: PracticePlanFormProps) {
  const startValues = useMemo(() => {
    return {
      ...defaultValues,
      ...initialValues,
    };
  }, [initialValues]);

  const [values, setValues] = useState<PracticePlanInput>(startValues);

  function updateField<Key extends keyof PracticePlanInput>(
    key: Key,
    value: PracticePlanInput[Key],
  ) {
    setValues((previous) => ({
      ...previous,
      [key]: value,
    }));
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onSubmit({
      ...values,
      title: values.title.trim(),
      team: values.team.trim(),
      notes: values.notes.trim(),
      duration: Math.max(20, values.duration),
      drills: values.drills ?? [],
    });
  }

  return (
    <section className="card">
      <h2>{heading}</h2>
      <form className="plan-form" onSubmit={handleSubmit}>
        <label>
          Practice title
          <input
            required
            value={values.title}
            onChange={(event) => updateField('title', event.target.value)}
            placeholder="Tuesday breakouts and support"
          />
        </label>

        <div className="form-grid">
          <label>
            Date
            <input
              required
              type="date"
              value={values.date}
              onChange={(event) => updateField('date', event.target.value)}
            />
          </label>

          <label>
            Team / age group
            <input
              required
              value={values.team}
              onChange={(event) => updateField('team', event.target.value)}
              placeholder="River City Rangers"
            />
          </label>
        </div>

        <div className="form-grid form-grid--triple">
          <label>
            Age group
            <select
              value={values.ageGroup}
              onChange={(event) => {
                updateField('ageGroup', event.target.value as PracticePlanInput['ageGroup']);
              }}
            >
              {AGE_GROUP_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>

          <label>
            Duration (minutes)
            <input
              required
              type="number"
              min={20}
              step={5}
              value={values.duration}
              onChange={(event) => {
                updateField('duration', Number(event.target.value));
              }}
            />
          </label>

          <label>
            Focus
            <select
              value={values.focus}
              onChange={(event) => {
                updateField('focus', event.target.value as PracticePlanInput['focus']);
              }}
            >
              {PRACTICE_FOCUS_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>
        </div>

        <label>
          Session goals / notes
          <textarea
            rows={4}
            value={values.notes}
            onChange={(event) => updateField('notes', event.target.value)}
            placeholder="Ex: Improve breakout poise under pressure. Track clean exits and center support timing."
          />
        </label>

        <button type="submit" className="button button--primary">
          {submitLabel}
        </button>
      </form>
    </section>
  );
}
