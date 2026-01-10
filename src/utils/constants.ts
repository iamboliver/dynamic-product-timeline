import type { TimelineTheme } from '../types';

export const darkTheme: TimelineTheme = {
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

export const lightTheme: TimelineTheme = {
  colors: {
    background: '#f5f5f5',
    backgroundElevated: '#ffffff',
    backgroundSurface: '#e8e8e8',
    primary: '#333333',
    primaryGlow: 'rgba(51, 51, 51, 0.2)',
    textPrimary: '#1a1a1a',
    textSecondary: '#666666',
    greyLight: '#999999',
    greyMid: '#cccccc',
    greyDark: '#e0e0e0',
    statusReleased: '#16a34a',
    statusBeta: '#d97706',
    statusPlanned: '#333333',
    todayMarker: '#333333',
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

// Default theme for backwards compatibility
export const theme = darkTheme;

export const DEFAULT_PX_PER_DAY = 12;
