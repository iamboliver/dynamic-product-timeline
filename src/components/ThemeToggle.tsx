import styled from 'styled-components';

interface ThemeToggleProps {
  isDark: boolean;
  onToggle: () => void;
}

const ToggleButton = styled.button`
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 1000;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  border: 2px solid ${({ theme }) => theme.colors.greyMid};
  background: ${({ theme }) => theme.colors.backgroundElevated};
  color: ${({ theme }) => theme.colors.textPrimary};
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  transition: all 0.3s ease;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);

  &:hover {
    transform: scale(1.1);
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

export function ThemeToggle({ isDark, onToggle }: ThemeToggleProps) {
  return (
    <ToggleButton onClick={onToggle} title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}>
      {isDark ? '☀️' : '🌙'}
    </ToggleButton>
  );
}
