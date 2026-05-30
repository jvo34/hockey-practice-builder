import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { EmptyState } from '../components/EmptyState';
import { PlanCard } from '../components/PlanCard';
import { usePracticePlanner } from '../context/PracticePlannerContext';
import { formatDate } from '../utils/date';
import { getDurationDelta, getPlannedMinutes } from '../utils/practice';

export function DashboardPage() {
  const navigate = useNavigate();
  const { plans, deletePlan, duplicatePlan } = usePracticePlanner();

  const stats = useMemo(() => {
    const totalTimelineMinutes = plans.reduce((sum, plan) => sum + getPlannedMinutes(plan), 0);
    const avgDuration = plans.length
      ? Math.round(plans.reduce((sum, plan) => sum + plan.duration, 0) / plans.length)
      : 0;

    const avgDrillsPerPlan = plans.length
      ? Number(
          (
            plans.reduce((sum, plan) => sum + plan.drills.length, 0) /
            plans.length
          ).toFixed(1),
        )
      : 0;

    const readyPlans = plans.filter((plan) => getDurationDelta(plan) === 0).length;
    const readinessPercent = plans.length ? Math.round((readyPlans / plans.length) * 100) : 0;

    const focusCounts = plans.reduce<Record<string, number>>((map, plan) => {
      map[plan.focus] = (map[plan.focus] ?? 0) + 1;
      return map;
    }, {});

    const topFocus = Object.entries(focusCounts).sort((a, b) => b[1] - a[1])[0] ?? null;

    const nextPractice = [...plans]
      .filter((plan) => !!plan.date)
      .sort((a, b) => a.date.localeCompare(b.date))[0] ?? null;

    return {
      totalPlans: plans.length,
      totalTimelineMinutes,
      avgDuration,
      avgDrillsPerPlan,
      readinessPercent,
      topFocus,
      nextPractice,
    };
  }, [plans]);

  return (
    <section className="stack-lg">
      <section className="split-header">
        <div>
          <p className="eyebrow">Practice Plan Dashboard</p>
          <h2>Saved practice plans</h2>
          <p className="muted">
            Organize your sessions by age group, focus area, and timeline readiness.
          </p>
        </div>

        <button
          type="button"
          className="button button--primary"
          onClick={() => navigate('/plans/new')}
        >
          Create Practice Plan
        </button>
      </section>

      <section className="stats-grid">
        <article className="card stat-card">
          <p>Saved plans</p>
          <strong>{stats.totalPlans}</strong>
        </article>
        <article className="card stat-card">
          <p>Avg target duration</p>
          <strong>{stats.avgDuration} min</strong>
        </article>
        <article className="card stat-card">
          <p>Total timeline minutes</p>
          <strong>{stats.totalTimelineMinutes} min</strong>
        </article>
      </section>

      <section className="card coach-intel">
        <h3>Coach Intel</h3>
        <div className="coach-intel__grid">
          <article>
            <p>Next scheduled skate</p>
            <strong>
              {stats.nextPractice
                ? `${formatDate(stats.nextPractice.date)} - ${stats.nextPractice.team}`
                : 'No date set yet'}
            </strong>
          </article>
          <article>
            <p>Most common focus</p>
            <strong>
              {stats.topFocus ? `${stats.topFocus[0]} (${stats.topFocus[1]})` : 'No trend yet'}
            </strong>
          </article>
          <article>
            <p>Average drills per plan</p>
            <strong>{stats.avgDrillsPerPlan}</strong>
          </article>
          <article>
            <p>Timeline readiness</p>
            <strong>{stats.readinessPercent}% on target</strong>
          </article>
        </div>
      </section>

      {plans.length === 0 ? (
        <EmptyState
          title="Build your first hockey practice"
          description="Create a session plan, stack drills into a timeline, and export a print-ready sheet for the bench."
          actionLabel="Start a new plan"
          onAction={() => navigate('/plans/new')}
        />
      ) : (
        <section className="plan-grid">
          {plans.map((plan) => (
            <PlanCard
              key={plan.id}
              plan={plan}
              onDelete={deletePlan}
              onDuplicate={duplicatePlan}
            />
          ))}
        </section>
      )}
    </section>
  );
}
