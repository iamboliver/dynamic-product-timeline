import { useMemo } from 'react';
import { generateTicks, dateToX, logicalToScreenX } from '../../utils/timeScale';
import type { TimelineAxisProps } from '../../types';
import { TimelineAxisLine, TicksContainer, TickMark, TickLine, TickLabel } from './styles';

const axisVariants = {
  hidden: { scaleX: 0 },
  visible: {
    scaleX: 1,
    transition: { duration: 0.8, ease: 'easeOut', delay: 0.2 },
  },
};

export function TimelineAxis({
  minDate,
  maxDate,
  today,
  pxPerDay,
  viewportWidth,
}: TimelineAxisProps) {
  const ticks = useMemo(
    () => generateTicks(minDate, maxDate, today, pxPerDay, 'month'),
    [minDate, maxDate, today, pxPerDay]
  );

  // Calculate the start and end positions of the timeline
  const margin = 200; // Extra margin beyond the first/last feature
  const minX = dateToX(minDate, today, pxPerDay) - margin;
  const maxX = dateToX(maxDate, today, pxPerDay) + margin;
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
