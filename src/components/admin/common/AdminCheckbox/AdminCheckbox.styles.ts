// src/components/common/AdminCheckbox/AdminCheckbox.styles.ts

import styled, { type DefaultTheme } from 'styled-components';
import { rgba } from 'polished';

const getTheme = (props: { theme: DefaultTheme }) => props.theme;

// This is a classic CSS snippet to hide an element visually while keeping it
// accessible to screen readers and keyboard navigation.
export const HiddenCheckbox = styled.input.attrs({ type: 'checkbox' })`
  border: 0;
  clip: rect(0 0 0 0);
  height: 1px;
  margin: -1px;
  overflow: hidden;
  padding: 0;
  position: absolute;
  white-space: nowrap;
  width: 1px;
`;

// This is the beautiful, custom-styled box that the user sees.
export const StyledCheckbox = styled.div<{ checked: boolean; disabled?: boolean; }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  background: ${(props) => (props.checked ? getTheme(props).colors.accent1 : getTheme(props).colors.adminSurface)};
  border: 2px solid ${(props) => (props.checked ? getTheme(props).colors.accent1 : getTheme(props).colors.adminBorder)};
  border-radius: 5px;
  transition: all 150ms ease-out;

  // The checkmark icon's style
  svg {
    visibility: ${(props) => (props.checked ? 'visible' : 'hidden')};
    color: #fff;
    font-size: 0.8em;
    font-weight: bold;
  }
`;

// This is the main wrapper, which acts as the <label>.
// It's responsible for the layout and interaction states (hover, focus).
export const CheckboxContainer = styled.label<{ disabled?: boolean; }>`
  display: inline-flex;
  align-items: center;
  gap: ${(props) => getTheme(props).spacing(2.5)}; // Space between box and label text
  cursor: ${(props) => (props.disabled ? 'not-allowed' : 'pointer')};
  -webkit-tap-highlight-color: transparent; // Better mobile experience

  // Style the whole container when disabled
  opacity: ${(props) => (props.disabled ? 0.6 : 1)};
  
  // Handle focus state for accessibility
  // When the hidden input is focused (by keyboard), show a focus ring on our styled box.
  ${HiddenCheckbox}:focus-visible + & {
    ${StyledCheckbox} {
      box-shadow: 0 0 0 3px ${(props) => rgba(getTheme(props).colors.accent1 || '#3182ce', 0.3)};
    }
  }

  // Handle hover state
  &:hover {
    ${StyledCheckbox} {
      // Don't change hover state if disabled or checked
      border-color: ${(props) => (!props.checked && !props.disabled ? getTheme(props).colors.accent1 : 'inherit')};
    }
  }
`;

export const CheckboxLabelText = styled.span`
  font-family: ${(props) => getTheme(props).typography.admin?.fontFamily || 'Inter, sans-serif'};
  font-size: 0.9rem;
  color: ${(props) => getTheme(props).colors.adminText || '#2d3748'};
  user-select: none; // Prevent text selection when clicking label
`;