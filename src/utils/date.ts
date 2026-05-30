export function formatDate(value: string): string {
  if (!value) {
    return 'Unscheduled';
  }

  const date = new Date(`${value}T12:00:00`);
  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleDateString(undefined, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export function todayIsoDate(): string {
  return new Date().toISOString().slice(0, 10);
}
