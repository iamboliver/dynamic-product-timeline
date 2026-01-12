import { useState, useEffect, useMemo } from 'react';
import type { Feature, ParsedFeature, PositionedFeature } from '../types';
import { buildTimeScale, dateToX, type TimeScale } from '../utils/timeScale';
import { calculateCardPositions } from '../utils/collisionAvoidance';
import { theme } from '../utils/constants';

interface UseFeatureDataResult {
  features: PositionedFeature[];
  minDate: Date;
  maxDate: Date;
  timeScale: TimeScale | null;
  loading: boolean;
  error: Error | null;
}

export function useFeatureData(
  dataUrl: string | undefined,
  inlineFeatures: Feature[] | undefined,
  today: Date,
  pxPerDay: number,
  dynamicMonthWidths: boolean = false
): UseFeatureDataResult {
  const [rawFeatures, setRawFeatures] = useState<Feature[]>(inlineFeatures ?? []);
  const [loading, setLoading] = useState(!inlineFeatures);
  const [error, setError] = useState<Error | null>(null);

  // Fetch features from URL if provided
  useEffect(() => {
    if (!dataUrl || inlineFeatures) return;

    setLoading(true);
    fetch(dataUrl)
      .then((res) => {
        if (!res.ok) throw new Error(`Failed to fetch: ${res.status}`);
        return res.json();
      })
      .then((data: Feature[]) => {
        setRawFeatures(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err);
        setLoading(false);
      });
  }, [dataUrl, inlineFeatures]);

  // Parse and compute positions
  const result = useMemo(() => {
    if (rawFeatures.length === 0) {
      return {
        features: [],
        minDate: today,
        maxDate: today,
        timeScale: null,
      };
    }

    // First pass: parse dates
    const parsedDates = rawFeatures.map((f) => ({
      ...f,
      releaseDate: new Date(f.releaseDate),
    }));

    // Build dynamic time scale if enabled, otherwise use linear positioning
    const timeScale = dynamicMonthWidths
      ? buildTimeScale(parsedDates, today, pxPerDay, theme.spacing.minCardSpacing)
      : null;

    // Parse dates and compute x coordinates
    const parsed: ParsedFeature[] = parsedDates
      .map((f) => {
        const isPast = f.releaseDate <= today;
        const x = timeScale
          ? timeScale.dateToX(f.releaseDate, f.id)
          : dateToX(f.releaseDate, today, pxPerDay);
        return {
          ...f,
          x,
          isPast,
        };
      })
      .sort((a, b) => a.releaseDate.getTime() - b.releaseDate.getTime());

    // Calculate date range
    const minDate = parsed[0].releaseDate;
    const maxDate = parsed[parsed.length - 1].releaseDate;

    // Apply collision avoidance
    const positioned = calculateCardPositions(
      parsed,
      theme.spacing.minCardSpacing,
      theme.spacing.baseYOffset,
      theme.spacing.slotHeight
    );

    return { features: positioned, minDate, maxDate, timeScale };
  }, [rawFeatures, today, pxPerDay, dynamicMonthWidths]);

  return {
    ...result,
    loading,
    error,
  };
}
