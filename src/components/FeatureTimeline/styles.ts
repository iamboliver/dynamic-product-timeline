import styled from 'styled-components';
import { motion } from 'framer-motion';

export const TimelineContainer = styled.div`
  position: relative;
  width: 100%;
  height: 100vh;
  overflow: hidden;
  background: ${({ theme }) => theme.colors.background};
`;

export const DragArea = styled(motion.div)`
  position: absolute;
  inset: 0;
  cursor: grab;
  z-index: 1;

  &:active {
    cursor: grabbing;
  }
`;

export const TimelineContent = styled(motion.div)`
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  height: 4px;
  margin-top: -2px;
  pointer-events: none;
`;

export const TimelineAxisLine = styled(motion.div)`
  position: absolute;
  top: 0;
  height: 4px;
  background: ${({ theme }) => theme.colors.primary};
  border-radius: 2px;
`;

export const TodayMarkerWrapper = styled(motion.div)`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  z-index: 10;
`;

export const TodayMarkerLine = styled.div`
  width: 3px;
  height: 60px;
  background: ${({ theme }) => theme.colors.todayMarker};
  border-radius: 2px;
  box-shadow: 0 0 20px ${({ theme }) => theme.colors.primaryGlow},
    0 0 40px ${({ theme }) => theme.colors.primaryGlow};
`;

export const TodayLabel = styled.div`
  margin-top: 8px;
  padding: 4px 12px;
  background: ${({ theme }) => theme.colors.backgroundElevated};
  border: 1px solid ${({ theme }) => theme.colors.primary};
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.primary};
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

export const TicksContainer = styled.div`
  position: absolute;
  top: 20px;
  left: 0;
  right: 0;
`;

export const TickMark = styled.div<{ $x: number }>`
  position: absolute;
  left: ${({ $x }) => $x}px;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const TickLine = styled.div`
  width: 1px;
  height: 12px;
  background: ${({ theme }) => theme.colors.greyMid};
`;

export const TickLabel = styled.div`
  margin-top: 4px;
  font-size: 11px;
  color: ${({ theme }) => theme.colors.textSecondary};
  white-space: nowrap;
`;

export const CardsLayer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
`;

export const CardWrapper = styled(motion.div)<{
  $isFocused: boolean;
  $isPast: boolean;
}>`
  position: absolute;
  top: 50%;
  pointer-events: auto;
  cursor: pointer;
  z-index: ${({ $isFocused }) => ($isFocused ? 5 : 1)};
`;

export const Card = styled(motion.div)<{ $isFocused: boolean; $isPast: boolean; $highlight?: boolean }>`
  width: 260px;
  padding: ${({ theme }) => theme.spacing.cardPadding}px;
  background: ${({ theme }) => theme.colors.backgroundElevated};
  border: 1px solid
    ${({ theme, $isFocused, $isPast, $highlight }) =>
      $highlight
        ? theme.colors.primary
        : $isFocused
        ? $isPast
          ? theme.colors.greyMid
          : theme.colors.primary
        : theme.colors.greyMid};
  border-radius: ${({ theme }) => theme.spacing.cardBorderRadius}px;
  box-shadow: ${({ $isFocused, theme }) =>
    $isFocused
      ? `0 0 20px ${theme.colors.primaryGlow}`
      : '0 2px 12px rgba(0, 0, 0, 0.1)'};
  transition: box-shadow 0.2s ease, border-color 0.2s ease, background-color 0.3s ease;
`;

export const CardTitle = styled.h3`
  margin: 0 0 8px;
  font-size: 16px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.textPrimary};
  line-height: 1.3;
`;

export const CardDescription = styled.p`
  margin: 0 0 12px;
  font-size: 13px;
  color: ${({ theme }) => theme.colors.textSecondary};
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

export const CardFooter = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
`;

export const StatusBadge = styled.span<{ $status: 'released' | 'beta' | 'planned' }>`
  padding: 4px 10px;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  border-radius: 10px;
  background: ${({ theme, $status }) => {
    switch ($status) {
      case 'released':
        return `${theme.colors.statusReleased}20`;
      case 'beta':
        return `${theme.colors.statusBeta}20`;
      case 'planned':
        return `${theme.colors.statusPlanned}20`;
    }
  }};
  color: ${({ theme, $status }) => {
    switch ($status) {
      case 'released':
        return theme.colors.statusReleased;
      case 'beta':
        return theme.colors.statusBeta;
      case 'planned':
        return theme.colors.statusPlanned;
    }
  }};
`;

export const DateLabel = styled.span`
  font-size: 11px;
  color: ${({ theme }) => theme.colors.textSecondary};
`;

export const ConnectorStemEl = styled.div<{ $height: number; $isPast: boolean }>`
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  width: 2px;
  height: ${({ $height }) => $height}px;
  background: linear-gradient(
    ${({ $isPast }) => ($isPast ? '0deg' : '180deg')},
    ${({ theme, $isPast }) => ($isPast ? theme.colors.greyMid : theme.colors.primary)},
    transparent
  );
  ${({ $isPast }) => ($isPast ? 'bottom: 100%;' : 'top: 100%;')}
`;

export const ModalOverlay = styled(motion.div)`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
  padding: 20px;
`;

export const ModalContent = styled(motion.div)`
  width: 100%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
  background: ${({ theme }) => theme.colors.backgroundElevated};
  border: 1px solid ${({ theme }) => theme.colors.greyDark};
  border-radius: ${({ theme }) => theme.spacing.cardBorderRadius}px;
  padding: 32px;
`;

export const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 20px;
`;

export const ModalTitle = styled.h2`
  margin: 0;
  font-size: 24px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.textPrimary};
`;

export const CloseButton = styled.button`
  background: none;
  border: none;
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: 24px;
  cursor: pointer;
  padding: 4px 8px;
  line-height: 1;
  border-radius: 4px;
  transition: color 0.2s, background 0.2s;

  &:hover {
    color: ${({ theme }) => theme.colors.textPrimary};
    background: ${({ theme }) => theme.colors.backgroundSurface};
  }
`;

export const ModalDescription = styled.p`
  margin: 0 0 24px;
  font-size: 15px;
  line-height: 1.6;
  color: ${({ theme }) => theme.colors.textSecondary};
`;

export const ModalMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  padding-top: 20px;
  border-top: 1px solid ${({ theme }) => theme.colors.greyDark};
`;

export const TagsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 16px;
`;

export const Tag = styled.span`
  padding: 4px 10px;
  font-size: 12px;
  background: ${({ theme }) => theme.colors.backgroundSurface};
  color: ${({ theme }) => theme.colors.textSecondary};
  border-radius: 8px;
`;

// Card Thumbnail
export const CardThumbnail = styled.div`
  width: 100%;
  height: 100px;
  margin-bottom: 12px;
  border-radius: 12px;
  overflow: hidden;
  background: ${({ theme }) => theme.colors.backgroundSurface};

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

export const VideoIndicator = styled.div`
  position: absolute;
  top: 8px;
  right: 8px;
  width: 28px;
  height: 28px;
  background: rgba(0, 0, 0, 0.7);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;

  &::after {
    content: '';
    width: 0;
    height: 0;
    border-left: 8px solid white;
    border-top: 5px solid transparent;
    border-bottom: 5px solid transparent;
    margin-left: 2px;
  }
`;

// Modal Media Gallery
export const MediaGallery = styled.div`
  margin-bottom: 20px;
`;

export const MediaMain = styled.div`
  width: 100%;
  aspect-ratio: 16 / 10;
  border-radius: 12px;
  overflow: hidden;
  background: ${({ theme }) => theme.colors.backgroundSurface};
  margin-bottom: 12px;

  img, video {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

export const MediaThumbnails = styled.div`
  display: flex;
  gap: 8px;
  overflow-x: auto;
  padding-bottom: 4px;

  &::-webkit-scrollbar {
    height: 4px;
  }

  &::-webkit-scrollbar-track {
    background: ${({ theme }) => theme.colors.backgroundSurface};
    border-radius: 2px;
  }

  &::-webkit-scrollbar-thumb {
    background: ${({ theme }) => theme.colors.greyMid};
    border-radius: 2px;
  }
`;

export const MediaThumb = styled.button<{ $active: boolean }>`
  flex-shrink: 0;
  width: 80px;
  height: 50px;
  border-radius: 8px;
  overflow: hidden;
  border: 2px solid ${({ theme, $active }) => $active ? theme.colors.primary : 'transparent'};
  padding: 0;
  cursor: pointer;
  background: ${({ theme }) => theme.colors.backgroundSurface};
  position: relative;
  transition: border-color 0.2s;

  &:hover {
    border-color: ${({ theme, $active }) => $active ? theme.colors.primary : theme.colors.greyMid};
  }

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

export const VideoThumbOverlay = styled.div`
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;

  &::after {
    content: '';
    width: 0;
    height: 0;
    border-left: 12px solid white;
    border-top: 7px solid transparent;
    border-bottom: 7px solid transparent;
  }
`;

// Vote UI Components
export const VoteContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-left: auto;
`;

export const VoteButtonGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`;

export const VoteButton = styled.button<{ $voted?: boolean; $type: 'like' | 'dislike' }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: 1px solid ${({ theme }) => theme.colors.greyMid};
  background: ${({ theme, $voted, $type }) =>
    $voted
      ? $type === 'like'
        ? theme.colors.statusReleased + '20'
        : theme.colors.statusBeta + '20'
      : 'transparent'};
  color: ${({ theme, $voted, $type }) =>
    $voted
      ? $type === 'like'
        ? theme.colors.statusReleased
        : theme.colors.statusBeta
      : theme.colors.textSecondary};
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 16px;

  &:hover:not(:disabled) {
    border-color: ${({ theme, $type }) =>
      $type === 'like' ? theme.colors.statusReleased : theme.colors.statusBeta};
    color: ${({ theme, $type }) =>
      $type === 'like' ? theme.colors.statusReleased : theme.colors.statusBeta};
    background: ${({ theme, $type }) =>
      $type === 'like'
        ? theme.colors.statusReleased + '10'
        : theme.colors.statusBeta + '10'};
  }

  &:disabled {
    cursor: default;
    opacity: ${({ $voted }) => ($voted ? 1 : 0.5)};
  }
`;

export const VoteCount = styled.span`
  font-size: 13px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.textSecondary};
  min-width: 20px;
`;

// Today Button
export const TodayButton = styled(motion.button)`
  position: fixed;
  bottom: 24px;
  right: 24px;
  z-index: 1000;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  background: ${({ theme }) => theme.colors.backgroundElevated};
  border: 1px solid ${({ theme }) => theme.colors.primary};
  border-radius: 24px;
  color: ${({ theme }) => theme.colors.primary};
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  transition: transform 0.2s ease, box-shadow 0.2s ease;

  &:hover {
    transform: scale(1.05);
    box-shadow: 0 6px 24px rgba(0, 0, 0, 0.4),
      0 0 20px ${({ theme }) => theme.colors.primaryGlow};
  }

  &:active {
    transform: scale(0.98);
  }
`;
