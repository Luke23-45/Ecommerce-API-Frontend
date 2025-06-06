// src/components/BecomeAPartnerPage/FAQItem/FAQItem.styles.ts
import styled, { css, keyframes } from 'styled-components';
import { transparentize, lighten, darken } from 'polished';

const answerFadeInSlideDown = keyframes`
  from {
    opacity: 0;
    max-height: 0;
    transform: translateY(-10px);
    margin-top: 0;
    margin-bottom: 0;
    padding-top: 0;
    padding-bottom: 0;
  }
  to {
    opacity: 1;
    max-height: 500px; /* Adjust as needed, should be > max expected answer height */
    transform: translateY(0);
    margin-top: ${({ theme }) => theme.spacing(2)}; 
    margin-bottom: ${({ theme }) => theme.spacing(4)};
    padding-top: ${({ theme }) => theme.spacing(3)};
    padding-bottom: ${({ theme }) => theme.spacing(1)}; // Less bottom padding for answer block
  }
`;

const answerFadeOutSlideUp = keyframes`
  from {
    opacity: 1;
    max-height: 500px;
    transform: translateY(0);
    margin-top: ${({ theme }) => theme.spacing(2)};
    margin-bottom: ${({ theme }) => theme.spacing(4)};
    padding-top: ${({ theme }) => theme.spacing(3)};
    padding-bottom: ${({ theme }) => theme.spacing(1)};
  }
  to {
    opacity: 0;
    max-height: 0;
    transform: translateY(-10px);
    margin-top: 0;
    margin-bottom: 0;
    padding-top: 0;
    padding-bottom: 0;
  }
`;

export const FAQItemWrapper = styled.div<{ $isOpen: boolean }>`
  background-color: transparent; /* Items transparent, parent section has BG */
  border-bottom: 1px solid ${({ theme }) => theme.colors.lightGray};
  padding: ${({ theme }) => theme.spacing(3)} 0; /* Vertical padding, no horizontal */
  
  &:last-child {
    border-bottom: none;
  }
`;

export const QuestionButton = styled.button<{ $isOpen: boolean }>`
  background: none;
  border: none;
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${({ theme }) => theme.spacing(2)} 0; /* Only vertical padding for button itself */
  cursor: pointer;
  text-align: left;
  
  h4 { /* Question Text */
    font-family: ${({ theme }) => theme.typography.heading.fontFamily}; /* Playfair for question */
    font-size: ${({ theme }) => theme.typography.body.sizes.large}; /* Or a small heading size e.g., h5 */
    font-weight: ${({ theme }) => theme.typography.heading.weights.semiBold};
    color: ${({ theme, $isOpen }) => $isOpen ? theme.colors.accent1 : theme.colors.textDark};
    margin: 0;
    line-height: 1.4;
    transition: color 0.2s ease-out;
  }

  &:hover h4 {
    color: ${({ theme }) => theme.colors.accent1};
  }
   &:focus-visible {
    outline: none;
    /* Optional: Add a visible focus style, e.g., around the whole button or just the text/icon */
    h4 { text-decoration: underline; text-decoration-color: ${({theme}) => theme.colors.accent1}; }
   }
`;

export const FAQIcon = styled.div<{ $isOpen: boolean }>`
  font-size: 1.3rem;
  color: ${({ theme, $isOpen }) => $isOpen ? theme.colors.accent1 : theme.colors.textMedium};
  transition: transform 0.3s cubic-bezier(0.25, 0.8, 0.25, 1), color 0.2s ease-out;
  transform: rotate(${(props) => (props.$isOpen ? '45deg' : '0deg')}); /* Plus to cross, or chevron up/down */
  margin-left: ${({ theme }) => theme.spacing(3)};
  flex-shrink: 0; /* Prevent icon from shrinking */

  ${QuestionButton}:hover & { // Change icon color on button hover
     color: ${({ theme }) => theme.colors.accent1};
  }
`;

export const AnswerWrapper = styled.div<{ $isOpen: boolean; ref?: React.RefObject<HTMLDivElement> }>`
  overflow: hidden;
  text-align: left;
  opacity: 0;
  max-height: 0;
  /* No margins/paddings in initial state (when max-height is 0) */
  
  ${(props) => props.$isOpen && css`
    animation: ${answerFadeInSlideDown} 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
  `}

  ${(props) => !props.$isOpen && css`
    /* Apply fade-out only if it was previously open and now closing.
       This state would ideally be managed by a "isClosing" flag set before isOpen turns false.
       For simpler CSS, just rely on display:none effectively from max-height:0 if no direct fade-out animation needed.
       If smooth fade-out on close IS desired and we can't use a separate isClosing flag,
       the transition needs to be on the properties directly.
    */
    /* animation: ${answerFadeOutSlideUp} 0.3s ease-out forwards; */ // This will play on initial load too
    /* A simpler way is to just use transitions: */
    opacity: 0;
    max-height: 0;
    transform: translateY(-10px);
    margin-top: 0; margin-bottom: 0; padding-top:0; padding-bottom:0;
    transition: opacity 0.2s ease-out, 
                max-height 0.3s ease-out, 
                transform 0.2s ease-out,
                margin-top 0.3s ease-out, margin-bottom 0.3s ease-out,
                padding-top 0.3s ease-out, padding-bottom 0.3s ease-out;
  `}


  p, ul { /* Default styling for content within the answer */
    font-family: ${({ theme }) => theme.typography.body.fontFamily}; // Inter
    font-size: ${({ theme }) => theme.typography.body.sizes.base};
    color: ${({ theme }) => theme.colors.textMedium};
    line-height: 1.75; // Generous line height for readability
    margin-bottom: ${({ theme }) => theme.spacing(3)};
  }
  p:last-child, ul:last-child {
    margin-bottom: 0;
  }
  ul {
    padding-left: ${({ theme }) => theme.spacing(5)};
    li { margin-bottom: ${({ theme }) => theme.spacing(1)}; }
  }
`;

