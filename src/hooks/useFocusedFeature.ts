import { useState, useEffect, useCallback } from 'react';
import { type MotionValue } from 'framer-motion';
import type { PositionedFeature } from '../types';

export function useFocusedFeature(
  features: PositionedFeature[],
  viewportOffsetX: MotionValue<number>,
  containerWidth: number
): string | null {
  const [focusedId, setFocusedId] = useState<string | null>(null);

  const updateFocused = useCallback(
    (offset: number) => {
      if (features.length === 0 || containerWidth === 0) {
        setFocusedId(null);
        return;
      }

      const containerCenter = containerWidth / 2;
      let closestId: string | null = null;
      let minDistance = Infinity;

      for (const feature of features) {
        const screenX = containerCenter + feature.x + offset;
        const distance = Math.abs(screenX - containerCenter);

        if (distance < minDistance) {
          minDistance = distance;
          closestId = feature.id;
        }
      }

      setFocusedId(closestId);
    },
    [features, containerWidth]
  );

  useEffect(() => {
    // Initial calculation
    updateFocused(viewportOffsetX.get());

    // Subscribe to changes
    const unsubscribe = viewportOffsetX.on('change', updateFocused);
    return unsubscribe;
  }, [viewportOffsetX, updateFocused]);

  return focusedId;
}
