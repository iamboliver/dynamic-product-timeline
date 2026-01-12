import { useTransform, motion, type MotionValue } from 'framer-motion';
import { xToDate, type TimeScale } from '../../utils/timeScale';
import { TodayMarkerWrapper, TodayMarkerLine, TodayLabel } from './styles';

interface TodayMarkerProps {
  viewportOffsetX: MotionValue<number>;
  today: Date;
  pxPerDay: number;
  timeScale?: TimeScale | null;
}

const markerVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5, ease: 'easeOut' },
  },
};

function formatCenterDate(date: Date, today: Date): string {
  const diffTime = date.getTime() - today.getTime();
  const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

  // If within a day of today, show "Today"
  if (Math.abs(diffDays) < 1) {
    return 'Today';
  }

  // Otherwise show month and year
  return date.toLocaleDateString('en-US', {
    month: 'short',
    year: 'numeric'
  });
}

export function TodayMarker({ viewportOffsetX, today, pxPerDay, timeScale }: TodayMarkerProps) {
  // Calculate the date at the center of the viewport
  // viewportOffsetX > 0 means we've dragged right (viewing the past)
  // viewportOffsetX < 0 means we've dragged left (viewing the future)
  const centerDate = useTransform(viewportOffsetX, (offset) => {
    // Negative offset because dragging right (positive offset) shows earlier dates
    if (timeScale) {
      return timeScale.xToDate(-offset);
    }
    return xToDate(-offset, today, pxPerDay);
  });

  return (
    <TodayMarkerWrapper variants={markerVariants} initial="hidden" animate="visible">
      <TodayMarkerLine />
      <motion.div>
        <TodayLabelDynamic centerDate={centerDate} today={today} />
      </motion.div>
    </TodayMarkerWrapper>
  );
}

// Separate component to handle the dynamic label
function TodayLabelDynamic({
  centerDate,
  today
}: {
  centerDate: MotionValue<Date>;
  today: Date;
}) {
  const label = useTransform(centerDate, (date) => formatCenterDate(date, today));

  return (
    <TodayLabel>
      <motion.span>{label}</motion.span>
    </TodayLabel>
  );
}
