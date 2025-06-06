import styled, { type DefaultTheme, keyframes, css } from 'styled-components';
import { rgba, darken } from 'polished'; // Assuming you might need these for reused components or future styles

// Helper to get theme, assuming it's consistent across your styled files
const getTheme = (props: { theme: DefaultTheme }) => props.theme;

// FadeIn animation (can be from a common animations file too)
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
`;

// --- Main Container for the Option Form Page ---
export const OptionFormContainer = styled.div`
    display: flex;
    flex-direction: column;
    gap: ${(props) => getTheme(props).spacing(5)}; /* Space between header, context, and form sections */
    
    opacity: 0;
    animation: ${fadeIn} 0.5s ease-out forwards; /* Slightly quicker fade-in */
    animation-delay: 0.1s;
    padding-bottom: 120px; /* Ensure space for sticky bar at the bottom of the viewport if content is short */
`;

// --- Header for the Option Form Page ---
export const OptionFormHeader = styled.div`
    background-color: ${(props) => getTheme(props).colors.adminSurface || '#FFFFFF'};
    border-radius: 12px;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
    padding: ${(props) => getTheme(props).spacing(4)} ${(props) => getTheme(props).spacing(6)};
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: ${(props) => getTheme(props).spacing(2)}; /* Reduced margin if ParentAttributeContext follows */


    @media (max-width: ${(props) => getTheme(props).breakpoints.tablet || '768px'}) {
        padding: ${(props) => getTheme(props).spacing(3)} ${(props) => getTheme(props).spacing(4)};
        border-radius: 0;
        box-shadow: none;
        margin-bottom: ${(props) => getTheme(props).spacing(1)};
    }
`;

// --- Title for the Option Form Page ---
export const OptionFormTitle = styled.h2`
    font-family: ${(props) => getTheme(props).typography.admin?.fontFamily || 'sans-serif'};
    font-size: ${(props) => getTheme(props).typography.admin?.sizes?.sectionTitle || '1.75rem'};
    font-weight: ${(props) => getTheme(props).typography.admin?.weights?.bold || 700};
    color: ${(props) => getTheme(props).colors.adminText || '#333333'};
    margin: 0;
`;

// --- Context display for Parent Attribute ---
export const ParentAttributeContext = styled.p`
    font-family: ${(props) => getTheme(props).typography.admin?.fontFamily || 'sans-serif'};
    font-size: ${(props) => getTheme(props).typography.admin?.sizes?.bodyBase || '0.95rem'};
    color: ${(props) => getTheme(props).colors.adminTextSecondary || '#6c757d'};
    background-color: ${(props) => getTheme(props).colors.adminSecondaryBg || '#F8F9FA'};
    padding: ${(props) => getTheme(props).spacing(3)} ${(props) => getTheme(props).spacing(6)};
    border-radius: 8px;
    margin: -${(props) => getTheme(props).spacing(4)} ${(props) => getTheme(props).spacing(0)} ${(props) => getTheme(props).spacing(5)}; /* Negative top margin to pull up */
    border: 1px solid ${(props) => getTheme(props).colors.adminBorderLight || '#EEEEEE'};

    strong {
        font-weight: ${(props) => getTheme(props).typography.admin?.weights?.semiBold || 600};
        color: ${(props) => getTheme(props).colors.adminText || '#333333'};
    }

    @media (max-width: ${(props) => getTheme(props).breakpoints.tablet || '768px'}) {
        padding: ${(props) => getTheme(props).spacing(2.5)} ${(props) => getTheme(props).spacing(4)};
        margin-top: -${(props) => getTheme(props).spacing(2)};
        margin-bottom: ${(props) => getTheme(props).spacing(4)};
        border-radius: 0; // Full width context bar on mobile
        border-left: none;
        border-right: none;
    }
`;

// --- The Actual <form> Element ---
export const OptionActualForm = styled.form`
    display: flex;
    flex-direction: column;
    gap: ${(props) => getTheme(props).spacing(6)}; /* Space between form sections */
    
    /* The form content itself will be wrapped in FormSectionWrapper, which usually has its own card styling */
    /* If FormSectionWrapper isn't used, or you want an outer card for the whole form: */
    /*
    background-color: ${(props) => getTheme(props).colors.adminSurface || '#FFFFFF'};
    border-radius: 12px;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
    padding: ${(props) => getTheme(props).spacing(6)};
    */
`;



export const FieldHelperText = styled.small`
  display: block;
  font-family: ${(props) => getTheme(props).typography.admin?.fontFamily || 'sans-serif'};
  font-size: ${(props) => getTheme(props).typography.admin?.sizes?.xsmall || '0.75rem'};
  color: ${(props) => getTheme(props).colors.adminTextMuted || '#6c757d'};
  margin-top: ${(props) => getTheme(props).spacing(1)};
  line-height: 1.4;
`;