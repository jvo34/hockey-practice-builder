/* eslint-disable react-refresh/only-export-components */

import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useMemo,
} from 'react';
import { seedDrills } from '../data/drills';
import { useLocalStorageState } from '../hooks/useLocalStorageState';
import type {
  Drill,
  PracticePlan,
  PracticePlanDrill,
  PracticePlanInput,
  PracticeSection,
} from '../types/models';
import { createPlanDrillEntry, sortPlanDrills } from '../utils/practice';

interface AddDrillOptions {
  customDuration?: number;
  section?: PracticeSection;
  customNotes?: string;
}

interface PracticePlannerContextValue {
  drills: Drill[];
  plans: PracticePlan[];
  createPlan: (input: PracticePlanInput) => PracticePlan;
  updatePlan: (planId: string, updates: Partial<PracticePlanInput>) => void;
  deletePlan: (planId: string) => void;
  duplicatePlan: (planId: string) => void;
  addDrillToPlan: (planId: string, drillId: string, options?: AddDrillOptions) => void;
  removeDrillFromPlan: (planId: string, planDrillId: string) => void;
  moveDrillInPlan: (planId: string, planDrillId: string, direction: 'up' | 'down') => void;
  updatePlanDrill: (
    planId: string,
    planDrillId: string,
    updates: Partial<Pick<PracticePlanDrill, 'customDuration' | 'section' | 'customNotes'>>,
  ) => void;
  getPlanById: (planId: string) => PracticePlan | undefined;
  getDrillById: (drillId: string) => Drill | undefined;
}

const STORAGE_KEY = 'hockey-practice-builder.plans.v1';

const PracticePlannerContext = createContext<PracticePlannerContextValue | undefined>(
  undefined,
);

function getSortedPlans(plans: PracticePlan[]): PracticePlan[] {
  return [...plans].sort((first, second) => {
    return new Date(second.updatedAt).getTime() - new Date(first.updatedAt).getTime();
  });
}

export function PracticePlannerProvider({ children }: { children: ReactNode }) {
  const [plans, setPlans] = useLocalStorageState<PracticePlan[]>(STORAGE_KEY, []);

  const drills = useMemo(() => seedDrills, []);
  const drillLookup = useMemo(() => {
    return new Map(drills.map((drill) => [drill.id, drill]));
  }, [drills]);

  const createPlan = useCallback(
    (input: PracticePlanInput): PracticePlan => {
      const timestamp = new Date().toISOString();
      const drillEntries = sortPlanDrills(input.drills ?? []);

      const nextPlan: PracticePlan = {
        id: crypto.randomUUID(),
        title: input.title,
        date: input.date,
        team: input.team,
        ageGroup: input.ageGroup,
        duration: input.duration,
        focus: input.focus,
        notes: input.notes,
        drills: drillEntries,
        createdAt: timestamp,
        updatedAt: timestamp,
      };

      setPlans((previous) => getSortedPlans([nextPlan, ...previous]));
      return nextPlan;
    },
    [setPlans],
  );

  const updatePlan = useCallback(
    (planId: string, updates: Partial<PracticePlanInput>) => {
      setPlans((previous) => {
        return getSortedPlans(
          previous.map((plan) => {
            if (plan.id !== planId) {
              return plan;
            }

            return {
              ...plan,
              ...updates,
              drills: updates.drills ? sortPlanDrills(updates.drills) : plan.drills,
              updatedAt: new Date().toISOString(),
            };
          }),
        );
      });
    },
    [setPlans],
  );

  const deletePlan = useCallback(
    (planId: string) => {
      setPlans((previous) => previous.filter((plan) => plan.id !== planId));
    },
    [setPlans],
  );

  const duplicatePlan = useCallback(
    (planId: string) => {
      setPlans((previous) => {
        const source = previous.find((plan) => plan.id === planId);
        if (!source) {
          return previous;
        }

        const timestamp = new Date().toISOString();
        const duplicate: PracticePlan = {
          ...source,
          id: crypto.randomUUID(),
          title: `${source.title} (Copy)`,
          drills: source.drills.map((entry, index) => ({
            ...entry,
            id: crypto.randomUUID(),
            order: index,
          })),
          createdAt: timestamp,
          updatedAt: timestamp,
        };

        return getSortedPlans([duplicate, ...previous]);
      });
    },
    [setPlans],
  );

  const addDrillToPlan = useCallback(
    (planId: string, drillId: string, options?: AddDrillOptions) => {
      const drill = drillLookup.get(drillId);
      if (!drill) {
        return;
      }

      setPlans((previous) => {
        return getSortedPlans(
          previous.map((plan) => {
            if (plan.id !== planId) {
              return plan;
            }

            const nextEntry = createPlanDrillEntry(drill, plan.drills.length, options);

            return {
              ...plan,
              drills: sortPlanDrills([...plan.drills, nextEntry]),
              updatedAt: new Date().toISOString(),
            };
          }),
        );
      });
    },
    [drillLookup, setPlans],
  );

  const removeDrillFromPlan = useCallback(
    (planId: string, planDrillId: string) => {
      setPlans((previous) => {
        return getSortedPlans(
          previous.map((plan) => {
            if (plan.id !== planId) {
              return plan;
            }

            return {
              ...plan,
              drills: sortPlanDrills(
                plan.drills.filter((entry) => entry.id !== planDrillId),
              ),
              updatedAt: new Date().toISOString(),
            };
          }),
        );
      });
    },
    [setPlans],
  );

  const moveDrillInPlan = useCallback(
    (planId: string, planDrillId: string, direction: 'up' | 'down') => {
      setPlans((previous) => {
        return getSortedPlans(
          previous.map((plan) => {
            if (plan.id !== planId) {
              return plan;
            }

            const sorted = sortPlanDrills(plan.drills);
            const currentIndex = sorted.findIndex((entry) => entry.id === planDrillId);
            if (currentIndex === -1) {
              return plan;
            }

            const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
            if (targetIndex < 0 || targetIndex >= sorted.length) {
              return plan;
            }

            const next = [...sorted];
            const [moved] = next.splice(currentIndex, 1);
            next.splice(targetIndex, 0, moved);

            return {
              ...plan,
              drills: sortPlanDrills(next),
              updatedAt: new Date().toISOString(),
            };
          }),
        );
      });
    },
    [setPlans],
  );

  const updatePlanDrill = useCallback(
    (
      planId: string,
      planDrillId: string,
      updates: Partial<Pick<PracticePlanDrill, 'customDuration' | 'section' | 'customNotes'>>,
    ) => {
      setPlans((previous) => {
        return getSortedPlans(
          previous.map((plan) => {
            if (plan.id !== planId) {
              return plan;
            }

            return {
              ...plan,
              drills: sortPlanDrills(
                plan.drills.map((entry) => {
                  if (entry.id !== planDrillId) {
                    return entry;
                  }

                  return {
                    ...entry,
                    ...updates,
                    customDuration: updates.customDuration
                      ? Math.max(1, updates.customDuration)
                      : entry.customDuration,
                  };
                }),
              ),
              updatedAt: new Date().toISOString(),
            };
          }),
        );
      });
    },
    [setPlans],
  );

  const getPlanById = useCallback(
    (planId: string) => {
      return plans.find((plan) => plan.id === planId);
    },
    [plans],
  );

  const getDrillById = useCallback(
    (drillId: string) => {
      return drillLookup.get(drillId);
    },
    [drillLookup],
  );

  const value = useMemo<PracticePlannerContextValue>(() => {
    return {
      drills,
      plans: getSortedPlans(plans),
      createPlan,
      updatePlan,
      deletePlan,
      duplicatePlan,
      addDrillToPlan,
      removeDrillFromPlan,
      moveDrillInPlan,
      updatePlanDrill,
      getPlanById,
      getDrillById,
    };
  }, [
    drills,
    plans,
    createPlan,
    updatePlan,
    deletePlan,
    duplicatePlan,
    addDrillToPlan,
    removeDrillFromPlan,
    moveDrillInPlan,
    updatePlanDrill,
    getPlanById,
    getDrillById,
  ]);

  return (
    <PracticePlannerContext.Provider value={value}>
      {children}
    </PracticePlannerContext.Provider>
  );
}

export function usePracticePlanner() {
  const context = useContext(PracticePlannerContext);

  if (!context) {
    throw new Error('usePracticePlanner must be used within PracticePlannerProvider');
  }

  return context;
}
