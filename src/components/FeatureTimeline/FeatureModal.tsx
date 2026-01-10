import { useEffect, useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import type { FeatureModalProps } from '../../types';
import { formatReleaseDate } from '../../utils/timeScale';
import { useVotes } from '../../hooks/useVotes';
import {
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalTitle,
  CloseButton,
  ModalDescription,
  ModalMeta,
  StatusBadge,
  DateLabel,
  TagsContainer,
  Tag,
  MediaGallery,
  MediaMain,
  MediaThumbnails,
  MediaThumb,
  VideoThumbOverlay,
  VoteContainer,
  VoteButtonGroup,
  VoteButton,
  VoteCount,
} from './styles';

const overlayVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.2 } },
  exit: { opacity: 0, transition: { duration: 0.2 } },
};

const contentVariants = {
  hidden: { opacity: 0, scale: 0.95, y: 20 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.3, ease: 'easeOut' },
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    y: 20,
    transition: { duration: 0.2 },
  },
};

interface MediaItem {
  type: 'image' | 'video';
  url: string;
  thumbnail: string;
}

export function FeatureModal({ feature, isOpen, onClose }: FeatureModalProps) {
  const [activeMediaIndex, setActiveMediaIndex] = useState(0);
  const { votes, userVotes, vote } = useVotes();

  // Build media items array
  const mediaItems: MediaItem[] = [];
  if (feature) {
    feature.screenshots?.forEach((url) => {
      mediaItems.push({ type: 'image', url, thumbnail: url });
    });
    feature.videos?.forEach((url) => {
      // Use a placeholder for video thumbnail
      mediaItems.push({
        type: 'video',
        url,
        thumbnail: `https://picsum.photos/seed/${feature.id}-video/800/600`,
      });
    });
  }

  // Reset active index when modal opens
  useEffect(() => {
    if (isOpen) {
      setActiveMediaIndex(0);
    }
  }, [isOpen]);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const activeMedia = mediaItems[activeMediaIndex];

  return (
    <AnimatePresence>
      {isOpen && feature && (
        <ModalOverlay
          variants={overlayVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          onClick={onClose}
        >
          <ModalContent
            variants={contentVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={(e) => e.stopPropagation()}
          >
            <ModalHeader>
              <ModalTitle>{feature.title}</ModalTitle>
              <CloseButton onClick={onClose}>&times;</CloseButton>
            </ModalHeader>

            {mediaItems.length > 0 && (
              <MediaGallery>
                <MediaMain>
                  {activeMedia?.type === 'video' ? (
                    <video
                      src={activeMedia.url}
                      controls
                      autoPlay
                      playsInline
                    />
                  ) : (
                    <img src={activeMedia?.url} alt={feature.title} />
                  )}
                </MediaMain>

                {mediaItems.length > 1 && (
                  <MediaThumbnails>
                    {mediaItems.map((item, index) => (
                      <MediaThumb
                        key={index}
                        $active={index === activeMediaIndex}
                        onClick={() => setActiveMediaIndex(index)}
                      >
                        <img src={item.thumbnail} alt={`${feature.title} ${index + 1}`} />
                        {item.type === 'video' && <VideoThumbOverlay />}
                      </MediaThumb>
                    ))}
                  </MediaThumbnails>
                )}
              </MediaGallery>
            )}

            <ModalDescription>{feature.description}</ModalDescription>

            {feature.tags && feature.tags.length > 0 && (
              <TagsContainer>
                {feature.tags.map((tag) => (
                  <Tag key={tag}>{tag}</Tag>
                ))}
              </TagsContainer>
            )}

            <ModalMeta>
              <StatusBadge $status={feature.status}>
                {feature.status === 'released'
                  ? 'Released'
                  : feature.status === 'beta'
                  ? 'Beta'
                  : 'Planned'}
              </StatusBadge>
              <DateLabel>{formatReleaseDate(feature.releaseDate, feature.status)}</DateLabel>
              <VoteContainer>
                <VoteButtonGroup>
                  <VoteButton
                    $type="like"
                    $voted={userVotes[feature.id] === 'like'}
                    disabled={userVotes[feature.id] === 'like'}
                    onClick={() => vote(feature.id, 'like')}
                    title="Like this feature"
                  >
                    👍
                  </VoteButton>
                  <VoteCount>{votes[feature.id]?.likes || 0}</VoteCount>
                </VoteButtonGroup>
                <VoteButtonGroup>
                  <VoteButton
                    $type="dislike"
                    $voted={userVotes[feature.id] === 'dislike'}
                    disabled={userVotes[feature.id] === 'dislike'}
                    onClick={() => vote(feature.id, 'dislike')}
                    title="Dislike this feature"
                  >
                    👎
                  </VoteButton>
                  <VoteCount>{votes[feature.id]?.dislikes || 0}</VoteCount>
                </VoteButtonGroup>
              </VoteContainer>
            </ModalMeta>
          </ModalContent>
        </ModalOverlay>
      )}
    </AnimatePresence>
  );
}
