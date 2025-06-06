// src/components/ProductPage/ReviewsPanel/WriteReviewForm.styles.ts
import styled, { type DefaultTheme } from 'styled-components';
import { lighten, rgba } from 'polished'; // For placeholder styles in FrontendForm, if customizing here

// Assuming FrontendForm, FrontendFormField, etc., are imported from a common location
// This file is primarily for styles *unique* to the WriteReviewForm if any, beyond the star rating.

export const StarRatingInputContainer = styled.div<{ theme: DefaultTheme }>`
  display: flex;
  align-items: center;
  justify-content: center; /* Center the stars */
  gap: ${({ theme }) => theme.spacing(1.5)}; /* Increased gap for larger stars */
  margin-bottom: ${({ theme }) => theme.spacing(2)};
  font-size: 2rem; /* Larger star icons for prominence */

  button { 
    background: none;
    border: none;
    padding: ${({ theme }) => theme.spacing(0.5)};
    margin: 0;
    cursor: pointer;
    color: ${({ theme }) => theme.colors.lightGray}; /* Default empty star color */
    transition: color 0.15s ease-in-out, transform 0.15s ease-in-out;
    line-height: 1;

    &:hover {
      transform: scale(1.15); /* More noticeable hover scale */
      color: ${({ theme }) => lighten(0.1, theme.colors.adminStatusWarning)}; 
    }

    &.selected, &.hovered {
      color: ${({ theme }) => theme.colors.adminStatusWarning}; /* Amber for selected/hovered */
    }
    
    &:focus-visible {
      outline: 2px solid ${({ theme }) => theme.colors.accent1};
      outline-offset: 3px; /* Ensure outline is visible around star */
      border-radius: 4px; /* Add radius to focus outline container if needed */
    }
    svg {
        filter: drop-shadow(0 1px 1px rgba(0,0,0,0.2)); /* Subtle shadow on stars */
    }
  }
`;

export const MinCharIndicator = styled.small<{theme: DefaultTheme; $isError?: boolean }>`
    display: block;
    text-align: right;
    font-family: ${({theme}) => theme.typography.body.fontFamily};
    font-size: ${({theme}) => theme.typography.body.sizes.xsmall};
    color: ${({theme, $isError}) => $isError ? theme.colors.adminStatusError : theme.colors.darkGray};
    margin-top: ${({theme}) => theme.spacing(1.5)};
    font-style: italic;
    opacity: 0.8;
`;



export const FrontendTextArea = styled.textarea<{ theme: DefaultTheme; hasError?: boolean }>`
  width: 100%;
  min-height: 120px; /* Default minimum height, can be overridden by rows prop */
  padding: ${({ theme }) => theme.spacing(2.5)} ${({ theme }) => theme.spacing(3.5)};
  border: 1px solid
    ${({ theme, hasError }) =>
      hasError ? theme.colors.adminStatusError : theme.colors.lightGray};
  border-radius: ${({ theme }) => theme.borderRadius.medium};
  background-color: ${({ theme }) => lighten(0.04, theme.colors.primaryNeutral)};
  color: ${({ theme }) => theme.colors.textDark};
  font-family: ${({ theme }) => theme.typography.body.fontFamily};
  font-size: ${({ theme }) => theme.typography.body.sizes.base};
  line-height:1.6;
  resize: vertical;
  transition: border-color 0.2s ease-in-out, box-shadow 0.2s ease-in-out, background-color 0.2s ease-in-out;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.accent1};
    background-color: ${({ theme }) => theme.colors.adminSurface};
    box-shadow: 0 0 0 3px ${({ theme }) => rgba(theme.colors.accent1, 0.15)};

  }

  &::placeholder {
    color: ${({ theme }) => theme.colors.darkGray};
    opacity: 0.7;
  }

  &:disabled {
    background-color: ${({ theme }) => lighten(0.06, theme.colors.primaryNeutral)};
    cursor: not-allowed;
    opacity: 0.6;
    resize: none;
  }
`;


