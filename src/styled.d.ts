import 'styled-components';
import type { TimelineTheme } from './types';

declare module 'styled-components' {
  export interface DefaultTheme extends TimelineTheme {}
}
