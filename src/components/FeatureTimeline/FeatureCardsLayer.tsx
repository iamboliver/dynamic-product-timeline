import { useTransform, type MotionValue } from 'framer-motion';
import type { FeatureCardsLayerProps, PositionedFeature } from '../../types';
import { formatReleaseDate } from '../../utils/timeScale';
import { theme } from '../../utils/constants';
import { ConnectorStem } from './ConnectorStem';
import {
  CardsLayer,
  CardWrapper,
  Card,
  CardTitle,
  CardDescription,
  CardFooter,
  StatusBadge,
  DateLabel,
} from './styles';

interface Props extends FeatureCardsLayerProps {
  viewportOffsetX: MotionValue<number>;
}

const focusVariants = {
  unfocused: { scale: 1 },
  focused: {
    scale: 1.03,
    transition: { duration: 0.2, ease: 'easeOut' },
  },
};

export function FeatureCardsLayer({
  features,
  focusedFeatureId,
  containerWidth,
  viewportOffsetX,
  onCardClick,
}: Props) {
  const containerCenter = containerWidth / 2;

  return (
    <CardsLayer>
      {features.map((feature, index) => (
        <FeatureCardWithMotion
          key={feature.id}
          feature={feature}
          isFocused={feature.id === focusedFeatureId}
          containerCenter={containerCenter}
          viewportOffsetX={viewportOffsetX}
          onClick={() => onCardClick(feature)}
          animationDelay={0.3 + index * (theme.animation.entranceStaggerDelay / 1000)}
        />
      ))}
    </CardsLayer>
  );
}

// Estimated card height (title + description + footer + padding)
const CARD_HEIGHT = 140;

function FeatureCardWithMotion({
  feature,
  isFocused,
  containerCenter,
  viewportOffsetX,
  onClick,
  animationDelay,
}: {
  feature: PositionedFeature;
  isFocused: boolean;
  containerCenter: number;
  viewportOffsetX: MotionValue<number>;
  onClick: () => void;
  animationDelay: number;
}) {
  // Create a motion value for x that includes the viewport offset
  // Card width is 260px, so subtract 130 to center it
  const x = useTransform(
    viewportOffsetX,
    (offset) => containerCenter + feature.x + offset - 130
  );

  // For cards above the line, we need to offset by card height
  // so the bottom of the card aligns with the y position
  const adjustedY = feature.isPast
    ? feature.yOffset
    : feature.yOffset - CARD_HEIGHT;

  // Stem height: distance from card edge to timeline
  const stemHeight = Math.abs(feature.yOffset) - theme.spacing.cardPadding;

  return (
    <CardWrapper
      $isFocused={isFocused}
      $isPast={feature.isPast}
      onClick={onClick}
      style={{
        x,
        y: adjustedY,
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: animationDelay, duration: 0.4 }}
    >
      <Card
        $isFocused={isFocused}
        $isPast={feature.isPast}
        $highlight={feature.highlight}
        variants={focusVariants}
        animate={isFocused ? 'focused' : 'unfocused'}
      >
        <CardTitle>{feature.title}</CardTitle>
        <CardDescription>{feature.description}</CardDescription>
        <CardFooter>
          <StatusBadge $status={feature.status}>
            {feature.status === 'released'
              ? 'Released'
              : feature.status === 'beta'
              ? 'Beta'
              : 'Planned'}
          </StatusBadge>
          <DateLabel>{formatReleaseDate(feature.releaseDate, feature.status)}</DateLabel>
        </CardFooter>
      </Card>
      <ConnectorStem side={feature.side} height={stemHeight} isPast={feature.isPast} />
    </CardWrapper>
  );
}
