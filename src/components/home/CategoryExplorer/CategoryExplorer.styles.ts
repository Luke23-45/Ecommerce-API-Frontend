// src/components/CategoryExplorer/CategoryExplorer.styles.ts
import styled, { type DefaultTheme } from 'styled-components';

const getTheme = (props: { theme: DefaultTheme }) => props.theme;

export const CategoryExplorerSection = styled.section`
    background-color: ${(props) => getTheme(props).colors.primaryNeutral};
    padding: ${(props) => getTheme(props).spacing(10)} 0;
    position: relative; /* Keep this if you have other positioned children for styling purposes */
    // Ensure the outer section does not have an overflow that clips sticky content
    // REMOVE explicit overflow: hidden; if present here or elsewhere in its parents unless absolutely necessary.
    overflow: visible; // Explicitly visible
`;

export const ExplorerHeadline = styled.h2`
    font-family: ${(props) => getTheme(props).typography.heading.fontFamily};
    font-size: clamp(2.5rem, 6vw, ${(props) => getTheme(props).typography.heading.sizes.h2});
    font-weight: ${(props) => getTheme(props).typography.heading.weights.bold};
    color: ${(props) => getTheme(props).colors.textDark};
    text-align: center;
    line-height: 1.1;
    letter-spacing: -0.8px;
    margin-bottom: ${(props) => getTheme(props).spacing(10)};
    padding: 0 ${(props) => getTheme(props).containerPadding};

    @media (max-width: ${(props) => getTheme(props).breakpoints.tablet}) {
        font-size: clamp(2rem, 8vw, ${(props) => getTheme(props).typography.heading.sizes.h3});
        margin-bottom: ${(props) => getTheme(props).spacing(6)};
    }
`;

export const MainContentArea = styled.div`
    display: flex;
    max-width: ${(props) => getTheme(props).maxWidth};
    margin: 0 auto;
    padding: 0 ${(props) => getTheme(props).containerPadding};
    
    // IMPORTANT: Remove position: relative if you want sticky to ignore this parent's height.
    // However, if other positioned children *within* this flex container rely on it, you might need it.
    // For pure viewport stickiness of CategoryNavigator, removing it is key.
    // We can re-evaluate if inner children break later, but let's try removing it for now.
    // position: relative; 

    z-index: 1; /* For stacking context. Crucial if other elements like headers are position: fixed */

    // VERY IMPORTANT: Ensure flex-start (or default stretch if it works) and visible overflow
    align-items: flex-start; // Keeps navigator at the top, allowing it to "exit" the flex flow via sticky
    overflow: visible; // This is the crucial part: tells flex container NOT to clip sticky children

    @media (max-width: ${(props) => getTheme(props).breakpoints.laptop}) {
        flex-direction: column;
        padding: 0;
        align-items: stretch; /* On mobile, stack and let content stretch full width */
        // Re-introduce overflow: hidden for mobile *if* the horizontal icon scroll needs clipping.
        // If not, visible is generally safer for sticky.
        overflow-x: auto; // This allows horizontal scroll on navigator for mobile, but it's *x*, not y.
    }
`;

export const ScrollableContent = styled.div`
    flex-grow: 1; /* Take all available space for content sections */
    position: relative; /* If needed for absolute children, etc. */
    overflow-y: hidden; /* Only needed if this section itself should clip its content for some reason */
    height: auto;
    background-color: transparent; 
    
    display: flex;
    flex-direction: column;
    gap: ${(props) => getTheme(props).spacing(8)}; /* Vertical gap between sections */
    
    margin-left: ${(props) => getTheme(props).spacing(8)}; /* Space from the separator */
    
    @media (max-width: ${(props) => getTheme(props).breakpoints.laptop}) {
        gap: 0; 
        margin-top: ${(props) => getTheme(props).spacing(6)};
        margin-left: 0; /* No left margin when stacked */
    }
`;

export const ThinSeparator = styled.div`
    width: 1px;
    background-color: ${(props) => getTheme(props).colors.lightGray};
    margin: ${(props) => getTheme(props).spacing(4)} 0;
    align-self: stretch;
    flex-shrink: 0;
    margin-right: ${(props) => getTheme(props).spacing(8)}; /* Space between nav and content */

    @media (max-width: ${(props) => getTheme(props).breakpoints.laptop}) {
        display: none;
    }
`;