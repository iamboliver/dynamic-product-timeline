import type { FeatureCardProps } from '../../types';
import { formatReleaseDate } from '../../utils/timeScale';
import { theme } from '../../utils/constants';
import { ConnectorStem } from './ConnectorStem';
import {
  CardWrapper,
  Card,
  CardTitle,
  CardDescription,
  CardFooter,
  StatusBadge,
  DateLabel,
} from './styles';

const cardVariants = {
  hidden: (custom: { isPast: boolean }) => ({
    opacity: 0,
    x: custom.isPast ? -30 : 30,
  }),
  visible: (custom: { isPast: boolean; targetX: number }) => ({
    opacity: 1,
    x: custom.targetX,
    transition: { duration: 0.4, ease: 'easeOut' },
  }),
};

const focusVariants = {
  unfocused: { scale: 1 },
  focused: {
    scale: 1.03,
    transition: { duration: 0.2, ease: 'easeOut' },
  },
};

export function FeatureCard({
  feature,
  isFocused,
  onClick,
  animationDelay = 0,
  screenX,
}: FeatureCardProps & { screenX: number }) {
  const stemHeight = Math.abs(feature.yOffset) - theme.spacing.cardPadding;

  // Center the card horizontally (card width is 260px)
  const centeredX = screenX - 130;

  return (
    <CardWrapper
      $isFocused={isFocused}
      $isPast={feature.isPast}
      onClick={onClick}
      style={{
        y: feature.yOffset,
        left: 0,
      }}
      custom={{ isPast: feature.isPast, targetX: centeredX }}
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      transition={{ delay: animationDelay }}
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
