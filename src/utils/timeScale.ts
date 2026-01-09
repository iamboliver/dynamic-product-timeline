const MS_PER_DAY = 86400000;

/**
 * Convert a date to logical x coordinate (today = 0)
 */
export function dateToX(date: Date, today: Date, pxPerDay: number): number {
  const daysDelta = (date.getTime() - today.getTime()) / MS_PER_DAY;
  return daysDelta * pxPerDay;
}

/**
 * Convert x coordinate back to a date
 */
export function xToDate(x: number, today: Date, pxPerDay: number): Date {
  const days = x / pxPerDay;
  return new Date(today.getTime() + days * MS_PER_DAY);
}

/**
 * Convert logical x to screen position
 */
export function logicalToScreenX(
  logicalX: number,
  viewportOffsetX: number,
  containerWidth: number
): number {
  const containerCenter = containerWidth / 2;
  return containerCenter + logicalX + viewportOffsetX;
}

/**
 * Calculate drag bounds for clamping
 */
export function calculateDragBounds(
  minDate: Date,
  maxDate: Date,
  today: Date,
  pxPerDay: number,
  containerWidth: number,
  margin: number = 200
): { left: number; right: number } {
  const minX = dateToX(minDate, today, pxPerDay);
  const maxX = dateToX(maxDate, today, pxPerDay);
  const halfWidth = containerWidth / 2;

  return {
    left: -(maxX - halfWidth + margin),
    right: -(minX + halfWidth - margin),
  };
}

export type TickInterval = 'month' | 'quarter' | 'year';

export interface Tick {
  x: number;
  date: Date;
  label: string;
}

/**
 * Format tick label based on interval
 */
function formatTickLabel(date: Date, interval: TickInterval): string {
  if (interval === 'year') {
    return date.getFullYear().toString();
  } else if (interval === 'quarter') {
    const quarter = Math.floor(date.getMonth() / 3) + 1;
    return `Q${quarter} ${date.getFullYear()}`;
  } else {
    return date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
  }
}

/**
 * Generate tick marks for the timeline axis
 */
export function generateTicks(
  minDate: Date,
  maxDate: Date,
  today: Date,
  pxPerDay: number,
  interval: TickInterval
): Tick[] {
  const ticks: Tick[] = [];
  const current = new Date(minDate);

  // Align to interval start
  if (interval === 'month') {
    current.setDate(1);
  } else if (interval === 'quarter') {
    current.setMonth(Math.floor(current.getMonth() / 3) * 3);
    current.setDate(1);
  } else {
    current.setMonth(0);
    current.setDate(1);
  }

  while (current <= maxDate) {
    const x = dateToX(current, today, pxPerDay);
    const label = formatTickLabel(current, interval);
    ticks.push({ x, date: new Date(current), label });

    // Advance by interval
    if (interval === 'month') {
      current.setMonth(current.getMonth() + 1);
    } else if (interval === 'quarter') {
      current.setMonth(current.getMonth() + 3);
    } else {
      current.setFullYear(current.getFullYear() + 1);
    }
  }

  return ticks;
}

/**
 * Format release date for display
 */
export function formatReleaseDate(
  date: Date,
  status: 'released' | 'beta' | 'planned',
  today: Date = new Date()
): string {
  const options: Intl.DateTimeFormatOptions = {
    month: 'short',
    year: 'numeric',
  };
  const formatted = date.toLocaleDateString('en-US', options);

  if (status === 'released') {
    return `Shipped ${formatted}`;
  } else if (status === 'beta') {
    return `Beta ${formatted}`;
  } else {
    const monthsAway =
      (date.getFullYear() - today.getFullYear()) * 12 +
      date.getMonth() -
      today.getMonth();

    if (monthsAway > 6) {
      const quarter = Math.floor(date.getMonth() / 3) + 1;
      return `Planned Q${quarter} ${date.getFullYear()}`;
    }
    return `Coming ${formatted}`;
  }
}
