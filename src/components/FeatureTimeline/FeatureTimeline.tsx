import { useState, useRef, useEffect, useCallback } from 'react';
import { useMotionValue, useSpring, AnimatePresence, type PanInfo } from 'framer-motion';
import type { FeatureTimelineProps, PositionedFeature } from '../../types';
import { useFeatureData } from '../../hooks/useFeatureData';
import { useFocusedFeature } from '../../hooks/useFocusedFeature';
import { calculateDragBounds } from '../../utils/timeScale';
import { DEFAULT_PX_PER_DAY } from '../../utils/constants';
import { TimelineContainer, TimelineContent, DragArea, TodayButton } from './styles';
import { TimelineAxis } from './TimelineAxis';
import { TodayMarker } from './TodayMarker';
import { FeatureCardsLayer } from './FeatureCardsLayer';
import { FeatureModal } from './FeatureModal';
import { SearchBar } from './SearchBar';

export function FeatureTimeline({
  dataUrl,
  features: inlineFeatures,
  today = new Date(),
  pxPerDay = DEFAULT_PX_PER_DAY,
  className,
  dynamicMonthWidths = false,
  searchEnabled = false,
}: FeatureTimelineProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(0);
  const [modalFeature, setModalFeature] = useState<PositionedFeature | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  // Load and process feature data
  const { features, minDate, maxDate, timeScale, loading, error } = useFeatureData(
    dataUrl,
    inlineFeatures,
    today,
    pxPerDay,
    dynamicMonthWidths
  );

  // Drag state - use raw motion value for immediate updates
  const rawX = useMotionValue(0);
  const viewportOffsetX = useSpring(rawX, {
    damping: 40,
    stiffness: 300,
  });

  // Focus detection
  const focusedFeatureId = useFocusedFeature(features, viewportOffsetX, containerWidth);

  // Track if scrolled away from today (threshold of 100px)
  const [isAwayFromToday, setIsAwayFromToday] = useState(false);

  useEffect(() => {
    const unsubscribe = rawX.on('change', (value) => {
      setIsAwayFromToday(Math.abs(value) > 100);
    });
    return unsubscribe;
  }, [rawX]);

  // Reset to today handler
  const handleResetToToday = useCallback(() => {
    rawX.set(0);
  }, [rawX]);

  // Measure container
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const resizeObserver = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (entry) {
        setContainerWidth(entry.contentRect.width);
      }
    });

    resizeObserver.observe(container);
    return () => resizeObserver.disconnect();
  }, []);

  // Calculate drag bounds
  const bounds = containerWidth > 0 && features.length > 0
    ? calculateDragBounds(minDate, maxDate, today, pxPerDay, containerWidth, 400, timeScale ?? undefined)
    : { left: -2000, right: 2000 };

  // Clamp value within bounds
  const clamp = (value: number, min: number, max: number) =>
    Math.max(min, Math.min(max, value));

  // Handle drag
  const handleDrag = useCallback(
    (_event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
      const newX = clamp(rawX.get() + info.delta.x, bounds.left, bounds.right);
      rawX.set(newX);
    },
    [rawX, bounds]
  );

  const handleDragStart = useCallback(() => {
    setIsDragging(true);
  }, []);

  const handleDragEnd = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleCardClick = useCallback((feature: PositionedFeature) => {
    if (!isDragging) {
      setModalFeature(feature);
    }
  }, [isDragging]);

  const handleCloseModal = useCallback(() => {
    setModalFeature(null);
  }, []);

  // Navigate to a specific feature (from search)
  const handleNavigateToFeature = useCallback(
    (feature: PositionedFeature) => {
      // Calculate offset to center the feature
      const targetOffset = -feature.x;

      // Clamp within bounds
      const clampedOffset = Math.max(bounds.left, Math.min(bounds.right, targetOffset));

      // Animate to position
      rawX.set(clampedOffset);

      // Open modal after a short delay to let animation start
      setTimeout(() => {
        setModalFeature(feature);
      }, 300);
    },
    [rawX, bounds]
  );

  if (loading) {
    return (
      <TimelineContainer ref={containerRef} className={className}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#b3b3b3' }}>
          Loading...
        </div>
      </TimelineContainer>
    );
  }

  if (error) {
    return (
      <TimelineContainer ref={containerRef} className={className}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#db0011' }}>
          Error loading features: {error.message}
        </div>
      </TimelineContainer>
    );
  }

  return (
    <TimelineContainer ref={containerRef} className={className}>
      {searchEnabled && (
        <SearchBar features={features} onSelectResult={handleNavigateToFeature} />
      )}

      <DragArea
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0}
        dragMomentum={false}
        onDrag={handleDrag}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        style={{ x: 0 }}
      />

      <TimelineContent style={{ x: viewportOffsetX }}>
        {containerWidth > 0 && (
          <TimelineAxis
            minDate={minDate}
            maxDate={maxDate}
            today={today}
            pxPerDay={pxPerDay}
            viewportWidth={containerWidth}
            timeScale={timeScale}
          />
        )}
      </TimelineContent>

      <TodayMarker
        viewportOffsetX={viewportOffsetX}
        today={today}
        pxPerDay={pxPerDay}
        timeScale={timeScale}
      />

      {containerWidth > 0 && (
        <FeatureCardsLayer
          features={features}
          focusedFeatureId={focusedFeatureId}
          containerWidth={containerWidth}
          viewportOffsetX={viewportOffsetX}
          onCardClick={handleCardClick}
        />
      )}

      <FeatureModal
        feature={modalFeature}
        isOpen={modalFeature !== null}
        onClose={handleCloseModal}
      />

      <AnimatePresence>
        {isAwayFromToday && (
          <TodayButton
            onClick={handleResetToToday}
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ duration: 0.2 }}
          >
            <span>↩</span>
            <span>Back to Today</span>
          </TodayButton>
        )}
      </AnimatePresence>
    </TimelineContainer>
  );
}
