import { useState, useMemo, useRef } from 'react';
import { AnimatePresence } from 'framer-motion';
import type { PositionedFeature } from '../../types';
import {
  SearchContainer,
  SearchInput,
  SearchResults,
  SearchResultItem,
  SearchResultTitle,
  SearchResultMeta,
} from './styles';

interface SearchBarProps {
  features: PositionedFeature[];
  onSelectResult: (feature: PositionedFeature) => void;
}

export function SearchBar({ features, onSelectResult }: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Filter features by query
  const results = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return features
      .filter(
        (f) =>
          f.title.toLowerCase().includes(q) ||
          f.description.toLowerCase().includes(q) ||
          f.tags?.some((tag) => tag.toLowerCase().includes(q))
      )
      .slice(0, 5); // Limit to 5 results
  }, [features, query]);

  const handleSelect = (feature: PositionedFeature) => {
    onSelectResult(feature);
    setQuery('');
    setIsOpen(false);
    inputRef.current?.blur();
  };

  const handleBlur = () => {
    // Delay closing to allow click events on results
    setTimeout(() => setIsOpen(false), 200);
  };

  return (
    <SearchContainer>
      <SearchInput
        ref={inputRef}
        type="text"
        placeholder="Search features..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={() => setIsOpen(true)}
        onBlur={handleBlur}
      />
      <AnimatePresence>
        {isOpen && results.length > 0 && (
          <SearchResults
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.15 }}
          >
            {results.map((feature) => (
              <SearchResultItem
                key={feature.id}
                onClick={() => handleSelect(feature)}
              >
                <SearchResultTitle>{feature.title}</SearchResultTitle>
                <SearchResultMeta>
                  {feature.status} • {feature.releaseDate.toLocaleDateString()}
                </SearchResultMeta>
              </SearchResultItem>
            ))}
          </SearchResults>
        )}
      </AnimatePresence>
    </SearchContainer>
  );
}
