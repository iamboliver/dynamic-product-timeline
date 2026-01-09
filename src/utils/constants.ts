import type { TimelineTheme } from '../types';

export const theme: TimelineTheme = {
  colors: {
    background: '#0a0a0a',
    backgroundElevated: '#141414',
    backgroundSurface: '#1a1a1a',
    primary: '#db0011',
    primaryGlow: 'rgba(219, 0, 17, 0.4)',
    textPrimary: '#ffffff',
    textSecondary: '#b3b3b3',
    greyLight: '#b3b3b3',
    greyMid: '#666666',
    greyDark: '#333333',
    statusReleased: '#22c55e',
    statusBeta: '#f59e0b',
    statusPlanned: '#db0011',
    todayMarker: '#db0011',
  },
  spacing: {
    cardBorderRadius: 20,
    cardPadding: 16,
    stemLength: 40,
    baseYOffset: 100,
    slotHeight: 120,
    minCardSpacing: 200,
  },
  animation: {
    dragMomentum: true,
    dragElastic: 0.1,
    focusTransitionDuration: 200,
    entranceStaggerDelay: 100,
  },
};

export const DEFAULT_PX_PER_DAY = 12;
