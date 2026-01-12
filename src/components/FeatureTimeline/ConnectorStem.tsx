import type { ConnectorStemProps } from '../../types';
import { ConnectorStemEl } from './styles';

export function ConnectorStem({ side, height, isPast }: ConnectorStemProps) {
  const isBelow = side === 'below';
  return <ConnectorStemEl $height={height} $isBelow={isBelow} $isPast={isPast} />;
}
