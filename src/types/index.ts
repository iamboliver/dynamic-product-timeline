// === Data Types ===
export type FeatureStatus = 'released' | 'beta' | 'planned';

export interface Feature {
  id: string;
  title: string;
  description: string;
  releaseDate: string; // ISO 8601
  status: FeatureStatus;
  screenshots?: string[];
  videos?: string[];
  tags?: string[];
  highlight?: boolean;
}

export interface ParsedFeature extends Omit<Feature, 'releaseDate'> {
  releaseDate: Date;
  x: number; // Logical x coordinate (today = 0)
  isPast: boolean;
}

export interface PositionedFeature extends ParsedFeature {
  side: 'above' | 'below';
  slot: number;
  yOffset: number;
}

// === Theme Types ===
export interface TimelineTheme {
  colors: {
    background: string;
    backgroundElevated: string;
    backgroundSurface: string;
    primary: string;
    primaryGlow: string;
    textPrimary: string;
    textSecondary: string;
    greyLight: string;
    greyMid: string;
    greyDark: string;
    statusReleased: string;
    statusBeta: string;
    statusPlanned: string;
    todayMarker: string;
  };
  spacing: {
    cardBorderRadius: number;
    cardPadding: number;
    stemLength: number;
    baseYOffset: number;
    slotHeight: number;
    minCardSpacing: number;
  };
  animation: {
    dragMomentum: boolean;
    dragElastic: number;
    focusTransitionDuration: number;
    entranceStaggerDelay: number;
  };
}

// === Component Props ===
export interface FeatureTimelineProps {
  dataUrl?: string;
  features?: Feature[];
  today?: Date;
  pxPerDay?: number;
  className?: string;
}

export interface TimelineAxisProps {
  minDate: Date;
  maxDate: Date;
  today: Date;
  pxPerDay: number;
  viewportWidth: number;
}

export interface TodayMarkerProps {
  x: number;
}

export interface FeatureCardsLayerProps {
  features: PositionedFeature[];
  focusedFeatureId: string | null;
  containerWidth: number;
  onCardClick: (feature: PositionedFeature) => void;
}

export interface FeatureCardProps {
  feature: PositionedFeature;
  isFocused: boolean;
  onClick: () => void;
  animationDelay?: number;
}

export interface FeatureModalProps {
  feature: PositionedFeature | null;
  isOpen: boolean;
  onClose: () => void;
}

export interface ConnectorStemProps {
  side: 'above' | 'below';
  height: number;
  isPast: boolean;
}
