import { useNavigate } from 'react-router-dom';
import { PracticePlanForm } from '../components/PracticePlanForm';
import { usePracticePlanner } from '../context/PracticePlannerContext';
import type { PracticePlanInput } from '../types/models';

export function PlanCreatePage() {
  const navigate = useNavigate();
  const { createPlan } = usePracticePlanner();

  function handleCreate(values: PracticePlanInput) {
    const created = createPlan({
      ...values,
      drills: [],
    });

    navigate(`/plans/${created.id}/edit`);
  }

  return (
    <section className="stack-lg">
      <p className="eyebrow">Create Practice Plan</p>
      <PracticePlanForm
        heading="Create a new ice session"
        submitLabel="Create Plan and Build Timeline"
        onSubmit={handleCreate}
      />
    </section>
  );
}
