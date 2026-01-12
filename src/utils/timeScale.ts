const MS_PER_DAY = 86400000;

/**
 * Simple string hash for consistent feature ordering
 */
function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return hash;
}

/**
 * Get month key for grouping (e.g., "2025-01")
 */
function getMonthKey(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
}

/**
 * Get the start of a month
 */
function getMonthStart(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

/**
 * Get the end of a month
 */
function getMonthEnd(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0, 23, 59, 59, 999);
}

/**
 * Get days in a month
 */
function getDaysInMonth(date: Date): number {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
}

export interface MonthScale {
  monthKey: string;
  startX: number;
  width: number;
  monthStart: Date;
  monthEnd: Date;
}

export interface TimeScale {
  months: MonthScale[];
  dateToX: (date: Date, featureId?: string) => number;
  xToDate: (x: number) => Date;
  getTotalWidth: () => number;
}

/**
 * Build a time scale with dynamic month widths based on feature density
 */
export function buildTimeScale(
  features: { releaseDate: Date }[],
  today: Date,
  pxPerDay: number,
  minCardSpacing: number = 200
): TimeScale {
  if (features.length === 0) {
    return {
      months: [],
      dateToX: () => 0,
      xToDate: () => today,
      getTotalWidth: () => 0,
    };
  }

  // Find date range
  const dates = features.map(f => f.releaseDate);
  const minDate = new Date(Math.min(...dates.map(d => d.getTime())));
  const maxDate = new Date(Math.max(...dates.map(d => d.getTime())));

  // Extend range by 1 month on each side
  const rangeStart = new Date(minDate.getFullYear(), minDate.getMonth() - 1, 1);
  const rangeEnd = new Date(maxDate.getFullYear(), maxDate.getMonth() + 2, 0);

  // Count features per month
  const featureCounts: Record<string, number> = {};
  for (const feature of features) {
    const key = getMonthKey(feature.releaseDate);
    featureCounts[key] = (featureCounts[key] || 0) + 1;
  }

  // Build month scale
  const months: MonthScale[] = [];
  const current = new Date(rangeStart);

  while (current <= rangeEnd) {
    const monthKey = getMonthKey(current);
    const daysInMonth = getDaysInMonth(current);
    const baseWidth = daysInMonth * pxPerDay;

    // Calculate width needed for cards
    // Each card needs minCardSpacing to avoid overlap
    const cardCount = featureCounts[monthKey] || 0;
    const cardWidth = cardCount * minCardSpacing;

    // Use the larger of base width or card width
    const width = Math.max(baseWidth, cardWidth);

    months.push({
      monthKey,
      startX: 0, // Will be calculated below
      width,
      monthStart: getMonthStart(current),
      monthEnd: getMonthEnd(current),
    });

    current.setMonth(current.getMonth() + 1);
  }

  // Find which month contains "today" and calculate x positions relative to it
  const todayKey = getMonthKey(today);
  const todayMonthIndex = months.findIndex(m => m.monthKey === todayKey);

  if (todayMonthIndex === -1) {
    // Today is outside the range, use linear scale as fallback
    return {
      months: [],
      dateToX: (date: Date) => {
        const daysDelta = (date.getTime() - today.getTime()) / MS_PER_DAY;
        return daysDelta * pxPerDay;
      },
      xToDate: (x: number) => {
        const days = x / pxPerDay;
        return new Date(today.getTime() + days * MS_PER_DAY);
      },
      getTotalWidth: () => 0,
    };
  }

  // Calculate today's position within its month
  const todayMonth = months[todayMonthIndex];
  const todayDayOfMonth = today.getDate();
  const todayDaysInMonth = getDaysInMonth(today);
  const todayFraction = (todayDayOfMonth - 1) / todayDaysInMonth;
  const todayOffsetInMonth = todayFraction * todayMonth.width;

  // Set startX for each month relative to today (today = 0)
  // First, set today's month
  todayMonth.startX = -todayOffsetInMonth;

  // Go backwards from today's month
  for (let i = todayMonthIndex - 1; i >= 0; i--) {
    months[i].startX = months[i + 1].startX - months[i].width;
  }

  // Go forwards from today's month
  for (let i = todayMonthIndex + 1; i < months.length; i++) {
    months[i].startX = months[i - 1].startX + months[i - 1].width;
  }

  // Build index for distributing cards within months
  const featureIndicesInMonth: Record<string, Map<number, number>> = {};
  for (const monthKey of Object.keys(featureCounts)) {
    featureIndicesInMonth[monthKey] = new Map();
  }

  // Track which index each feature gets within its month
  const featureIndexCounter: Record<string, number> = {};

  // Create the dateToX function - with optional feature ID for even distribution
  const dateToX = (date: Date, featureId?: string): number => {
    const dateKey = getMonthKey(date);
    const month = months.find(m => m.monthKey === dateKey);

    if (!month) {
      // Fallback to linear calculation for dates outside range
      const daysDelta = (date.getTime() - today.getTime()) / MS_PER_DAY;
      return daysDelta * pxPerDay;
    }

    const cardCount = featureCounts[dateKey] || 0;

    // If multiple cards in this month and we have a feature ID, distribute evenly
    if (cardCount > 1 && featureId) {
      // Get or assign an index for this feature
      if (!featureIndexCounter[dateKey]) {
        featureIndexCounter[dateKey] = 0;
      }

      let featureIndex: number;
      const indexMap = featureIndicesInMonth[dateKey];
      const featureIdNum = hashString(featureId);

      if (indexMap && indexMap.has(featureIdNum)) {
        featureIndex = indexMap.get(featureIdNum)!;
      } else {
        featureIndex = featureIndexCounter[dateKey]++;
        if (indexMap) {
          indexMap.set(featureIdNum, featureIndex);
        }
      }

      // Distribute evenly across the month with padding
      const padding = 50; // Padding from month edges
      const usableWidth = month.width - padding * 2;
      const spacing = cardCount > 1 ? usableWidth / (cardCount - 1) : 0;
      const offset = cardCount > 1 ? featureIndex * spacing : usableWidth / 2;

      return month.startX + padding + offset;
    }

    // Single card or no feature ID - use date-based position
    const dayOfMonth = date.getDate();
    const daysInMonth = getDaysInMonth(date);
    const fraction = (dayOfMonth - 1) / daysInMonth;

    return month.startX + fraction * month.width;
  };

  const getTotalWidth = (): number => {
    if (months.length === 0) return 0;
    const first = months[0];
    const last = months[months.length - 1];
    return (last.startX + last.width) - first.startX;
  };

  // Reverse lookup: convert x coordinate back to a date
  const xToDateFn = (x: number): Date => {
    // Find which month contains this x position
    const month = months.find(m => x >= m.startX && x < m.startX + m.width);

    if (!month) {
      // Fallback: use linear calculation
      const days = x / pxPerDay;
      return new Date(today.getTime() + days * MS_PER_DAY);
    }

    // Interpolate within the month
    const fraction = (x - month.startX) / month.width;
    const daysInMonth = getDaysInMonth(month.monthStart);
    const dayOfMonth = Math.floor(fraction * daysInMonth) + 1;

    return new Date(month.monthStart.getFullYear(), month.monthStart.getMonth(), dayOfMonth);
  };

  return { months, dateToX, xToDate: xToDateFn, getTotalWidth };
}

/**
 * Convert a date to logical x coordinate (today = 0) - simple linear version
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
  margin: number = 200,
  timeScale?: TimeScale
): { left: number; right: number } {
  const getX = timeScale
    ? (date: Date) => timeScale.dateToX(date)
    : (date: Date) => dateToX(date, today, pxPerDay);

  const minX = getX(minDate);
  const maxX = getX(maxDate);
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
  interval: TickInterval,
  timeScale?: TimeScale
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

  // Use dynamic scale if provided, otherwise fall back to linear
  const getX = timeScale
    ? (date: Date) => timeScale.dateToX(date)
    : (date: Date) => dateToX(date, today, pxPerDay);

  while (current <= maxDate) {
    const x = getX(current);
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
