// src/components/Admin/Dashboard/MetricCard/MetricCard.styles.ts
import styled, { type DefaultTheme, css } from 'styled-components';
import { rgba } from 'polished';

const getTheme = (props: { theme: DefaultTheme }) => props.theme;

export const MetricCardContainer = styled.div`
    background-color: ${(props) => getTheme(props).colors.adminSurface};
    border-radius: 12px;
    padding: ${(props) => getTheme(props).spacing(6)}; /* Generous padding */
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05); /* Soft shadow */
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    transition: transform 0.2s ease-out, box-shadow 0.2s ease-out;
    cursor: pointer;

    &:hover {
        transform: translateY(-3px);
        box-shadow: 0 6px 20px rgba(0, 0, 0, 0.08);
    }
`;

export const CardHeader = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: ${(props) => getTheme(props).spacing(4)};
`;

export const MetricTitle = styled.h3`
    font-family: ${(props) => getTheme(props).typography.admin.fontFamily};
    font-size: ${(props) => getTheme(props).typography.admin.sizes.label};
    font-weight: ${(props) => getTheme(props).typography.admin.weights.semiBold};
    color: ${(props) => getTheme(props).colors.adminTextSecondary};
    text-transform: uppercase;
    letter-spacing: 0.5px;
`;

export const MetricIcon = styled.div`
    font-size: ${(props) => getTheme(props).typography.admin.sizes.sectionTitle};
    color: ${(props) => getTheme(props).colors.darkGray}; /* Muted icon color */
    svg {
        display: block;
    }
`;

export const MetricValue = styled.p`
    font-family: ${(props) => getTheme(props).typography.heading.fontFamily}; /* Playfair for numbers */
    font-size: ${(props) => getTheme(props).typography.admin.sizes.moduleTitle}; /* Large for prominence */
    font-weight: ${(props) => getTheme(props).typography.heading.weights.bold};
    color: ${(props) => getTheme(props).colors.adminText};
    line-height: 1;
    margin-bottom: ${(props) => getTheme(props).spacing(3)}; /* Space below value */
`;

export const MetricFooter = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-family: ${(props) => getTheme(props).typography.admin.fontFamily};
    font-size: ${(props) => getTheme(props).typography.admin.sizes.small};
    color: ${(props) => getTheme(props).colors.adminTextSecondary};
`;

export const Trend = styled.span<{ $type?: 'positive' | 'negative' | 'neutral' }>`
    display: flex;
    align-items: center;
    gap: ${(props) => getTheme(props).spacing(1)};
    font-weight: ${(props) => getTheme(props).typography.admin.weights.semiBold};

    ${(props) => props.$type === 'positive' && css` color: ${getTheme(props).colors.adminStatusSuccess}; `}
    ${(props) => props.$type === 'negative' && css` color: ${getTheme(props).colors.adminStatusError}; `}
    ${(props) => props.$type === 'neutral' && css` color: ${getTheme(props).colors.adminTextSecondary}; `}

    svg {
        font-size: ${(props) => getTheme(props).typography.admin.sizes.small};
    }
`;