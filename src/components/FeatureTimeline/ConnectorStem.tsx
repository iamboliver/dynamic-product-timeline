import type { ConnectorStemProps } from '../../types';
import { ConnectorStemEl } from './styles';

export function ConnectorStem({ height, isPast }: ConnectorStemProps) {
  return <ConnectorStemEl $height={height} $isPast={isPast} />;
}
