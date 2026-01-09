import { useState, useMemo } from 'react';
import { useMotionValue, useSpring, type MotionValue } from 'framer-motion';
import { calculateDragBounds } from '../utils/timeScale';

interface UseTimelineDragConfig {
  minDate: Date;
  maxDate: Date;
  today: Date;
  pxPerDay: number;
  containerWidth: number;
}

interface UseTimelineDragResult {
  viewportOffsetX: MotionValue<number>;
  isDragging: boolean;
  setIsDragging: (dragging: boolean) => void;
  bounds: { left: number; right: number };
}

export function useTimelineDrag(config: UseTimelineDragConfig): UseTimelineDragResult {
  const { minDate, maxDate, today, pxPerDay, containerWidth } = config;
  const [isDragging, setIsDragging] = useState(false);

  // Raw motion value for drag offset
  const rawX = useMotionValue(0);

  // Spring-smoothed value
  const viewportOffsetX = useSpring(rawX, {
    damping: 30,
    stiffness: 200,
  });

  // Calculate bounds
  const bounds = useMemo(
    () => calculateDragBounds(minDate, maxDate, today, pxPerDay, containerWidth, 300),
    [minDate, maxDate, today, pxPerDay, containerWidth]
  );

  return {
    viewportOffsetX,
    isDragging,
    setIsDragging,
    bounds,
  };
}
