import { useMemo } from 'react';
import { generateTicks, dateToX, logicalToScreenX, type TimeScale } from '../../utils/timeScale';
import type { TimelineAxisProps } from '../../types';
import { TimelineAxisLine, TicksContainer, TickMark, TickLine, TickLabel } from './styles';

const axisVariants = {
  hidden: { scaleX: 0 },
  visible: {
    scaleX: 1,
    transition: { duration: 0.8, ease: 'easeOut', delay: 0.2 },
  },
};

interface Props extends TimelineAxisProps {
  timeScale: TimeScale | null;
}

export function TimelineAxis({
  minDate,
  maxDate,
  today,
  pxPerDay,
  viewportWidth,
  timeScale,
}: Props) {
  const ticks = useMemo(
    () => generateTicks(minDate, maxDate, today, pxPerDay, 'month', timeScale ?? undefined),
    [minDate, maxDate, today, pxPerDay, timeScale]
  );

  // Calculate the start and end positions of the timeline
  const margin = 200; // Extra margin beyond the first/last feature
  const getX = timeScale
    ? (date: Date) => timeScale.dateToX(date)
    : (date: Date) => dateToX(date, today, pxPerDay);

  const minX = getX(minDate) - margin;
  const maxX = getX(maxDate) + margin;
  const totalWidth = maxX - minX;

  // Convert to screen coordinates (relative to viewport center)
  const startScreenX = logicalToScreenX(minX, 0, viewportWidth);

  return (
    <>
      <TimelineAxisLine
        variants={axisVariants}
        initial="hidden"
        animate="visible"
        style={{
          originX: 0.5,
          left: startScreenX,
          width: totalWidth,
        }}
      />
      <TicksContainer>
        {ticks.map((tick) => {
          const screenX = logicalToScreenX(tick.x, 0, viewportWidth);
          return (
            <TickMark key={tick.label} $x={screenX}>
              <TickLine />
              <TickLabel>{tick.label}</TickLabel>
            </TickMark>
          );
        })}
      </TicksContainer>
    </>
  );
}
