// src/components/Admin/Orders/OrderDetail.styles.ts
import styled, { type DefaultTheme, css, keyframes } from 'styled-components';
import { rgba, darken } from 'polished';

const getTheme = (props: { theme: DefaultTheme }) => props.theme;

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
`;

export const OrderDetailContainer = styled.div`
    display: flex;
    flex-direction: column;
    padding: ${(props) => getTheme(props).spacing(0)}; /* Padding handled by internal sections */

    /* Animation for the whole detail page entry */
    opacity: 0;
    animation: ${fadeIn} 0.6s ease-out forwards;
    animation-delay: 0.2s;
`;

export const OrderDetailHeader = styled.div`
    background-color: ${(props) => getTheme(props).colors.adminSurface};
    border-radius: 12px;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
    padding: ${(props) => getTheme(props).spacing(6)};
    margin-bottom: ${(props) => getTheme(props).spacing(8)};

    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    flex-wrap: wrap; /* Allow wrapping on smaller screens */
    gap: ${(props) => getTheme(props).spacing(4)};

    @media (max-width: ${(props) => getTheme(props).breakpoints.tablet}) {
        flex-direction: column;
        padding: ${(props) => getTheme(props).spacing(4)};
        border-radius: 0;
        box-shadow: none;
    }
`;

export const OrderTitleGroup = styled.div`
    display: flex;
    flex-direction: column;
    gap: ${(props) => getTheme(props).spacing(1.5)};
    
    h2 {
        font-family: ${(props) => getTheme(props).typography.admin.fontFamily};
        font-size: ${(props) => getTheme(props).typography.admin.sizes.sectionTitle};
        font-weight: ${(props) => getTheme(props).typography.admin.weights.bold};
        color: ${(props) => getTheme(props).colors.adminText};
        margin-bottom: 0; /* Remove default margin */
    }

    span {
        font-family: ${(props) => getTheme(props).typography.admin.fontFamily};
        font-size: ${(props) => getTheme(props).typography.admin.sizes.small};
        color: ${(props) => getTheme(props).colors.adminTextSecondary};
    }
`;

export const OrderSummaryMetrics = styled.div`
    display: flex;
    gap: ${(props) => getTheme(props).spacing(6)};
    
    div {
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: ${(props) => getTheme(props).spacing(2)};
        border-right: 1px solid ${(props) => getTheme(props).colors.adminBorder};

        &:last-child {
            border-right: none;
        }

        span:first-child {
            font-family: ${(props) => getTheme(props).typography.admin.fontFamily};
            font-size: ${(props) => getTheme(props).typography.admin.sizes.dataCell};
            color: ${(props) => getTheme(props).colors.adminTextSecondary};
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        span:last-child {
            font-family: ${(props) => getTheme(props).typography.heading.fontFamily};
            font-size: ${(props) => getTheme(props).typography.admin.sizes.moduleTitle};
            font-weight: ${(props) => getTheme(props).typography.heading.weights.bold};
            color: ${(props) => getTheme(props).colors.adminText};
        }
    }
    @media (max-width: ${(props) => getTheme(props).breakpoints.tablet}) {
        width: 100%;
        justify-content: space-around;
        gap: 0;
        margin-top: ${(props) => getTheme(props).spacing(4)};
        div {
            border-right: none; /* No vertical lines on mobile */
            padding: 0;
        }
    }
`;

export const OrderDetailLayout = styled.div`
    display: grid;
    grid-template-columns: 2fr 1fr; /* Main content vs sidebar (customer/history) */
    gap: ${(props) => getTheme(props).spacing(8)};

    @media (max-width: ${(props) => getTheme(props).breakpoints.laptop}) {
        grid-template-columns: 1fr; /* Single column on laptop/tablet */
    }
`;

export const MainContentColumn = styled.div`
    display: flex;
    flex-direction: column;
    gap: ${(props) => getTheme(props).spacing(8)};
`;

export const SidebarContentColumn = styled.div`
    display: flex;
    flex-direction: column;
    gap: ${(props) => getTheme(props).spacing(8)};
`;

export const StickyActionBar = styled.div`
    position: sticky;
    bottom: 0;
    left: 0;
    width: 100%;
    background-color: ${(props) => rgba(getTheme(props).colors.adminPrimaryBg, 0.95)};
    backdrop-filter: blur(8px);
    border-top: 1px solid ${(props) => getTheme(props).colors.adminBorder};
    padding: ${(props) => getTheme(props).spacing(4)} ${(props) => getTheme(props).spacing(6)};
    box-shadow: 0 -4px 15px rgba(0, 0, 0, 0.03);
    z-index: 50;
    display: flex;
    justify-content: flex-end;
    gap: ${(props) => getTheme(props).spacing(3)};

    @media (max-width: ${(props) => getTheme(props).breakpoints.tablet}) {
        flex-direction: column;
        gap: ${(props) => getTheme(props).spacing(2)};
        padding: ${(props) => getTheme(props).spacing(3)};
    }
`;

export const InfoSectionTitle = styled.h4`
    font-family: ${(props) => getTheme(props).typography.admin.fontFamily};
    font-size: ${(props) => getTheme(props).typography.admin.sizes.bodyBase};
    font-weight: ${(props) => getTheme(props).typography.admin.weights.bold};
    color: ${(props) => getTheme(props).colors.adminText};
    margin-bottom: ${(props) => getTheme(props).spacing(3)};
`;

export const InfoGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
    gap: ${(props) => getTheme(props).spacing(3)} ${(props) => getTheme(props).spacing(5)};
    
    div {
        display: flex;
        flex-direction: column;
        gap: ${(props) => getTheme(props).spacing(0.5)};
    }

    span:first-child {
        font-family: ${(props) => getTheme(props).typography.admin.fontFamily};
        font-size: ${(props) => getTheme(props).typography.admin.sizes.xsmall};
        color: ${(props) => getTheme(props).colors.adminTextSecondary};
        text-transform: uppercase;
        letter-spacing: 0.3px;
    }
    span:last-child {
        font-family: ${(props) => getTheme(props).typography.admin.fontFamily};
        font-size: ${(props) => getTheme(props).typography.admin.sizes.dataCell};
        color: ${(props) => getTheme(props).colors.adminText};
        font-weight: ${(props) => getTheme(props).typography.admin.weights.medium};
    }
`;

export const ItemListTable = styled.table`
    width: 100%;
    border-collapse: collapse;
    margin-top: ${(props) => getTheme(props).spacing(3)};
    font-family: ${(props) => getTheme(props).typography.admin.fontFamily};

    thead th {
        text-align: left;
        padding: ${(props) => getTheme(props).spacing(2)};
        font-size: ${(props) => getTheme(props).typography.admin.sizes.small};
        font-weight: ${(props) => getTheme(props).typography.admin.weights.semiBold};
        color: ${(props) => getTheme(props).colors.adminTextSecondary};
        border-bottom: 1px solid ${(props) => getTheme(props).colors.adminBorder};
    }

    tbody td {
        padding: ${(props) => getTheme(props).spacing(2)};
        font-size: ${(props) => getTheme(props).typography.admin.sizes.dataCell};
        color: ${(props) => getTheme(props).colors.adminText};
        border-bottom: 1px dashed ${(props) => getTheme(props).colors.adminBorder};

        img {
            width: 40px;
            height: 40px;
            object-fit: cover;
            border-radius: 4px;
            margin-right: ${(props) => getTheme(props).spacing(2)};
            vertical-align: middle;
        }

        &:last-child {
            text-align: right; /* Align prices/totals to right */
        }
    }

    tfoot tr {
        font-weight: ${(props) => getTheme(props).typography.admin.weights.bold};
        td {
            padding-top: ${(props) => getTheme(props).spacing(3)};
            font-size: ${(props) => getTheme(props).typography.admin.sizes.bodyBase};
        }
        &:last-child {
            td { border-bottom: none; }
        }
    }
`;

export const ActivityLogList = styled.ul`
    list-style: none;
    padding: 0;
    margin: 0;
    font-family: ${(props) => getTheme(props).typography.admin.fontFamily};
    font-size: ${(props) => getTheme(props).typography.admin.sizes.dataCell};
    color: ${(props) => getTheme(props).colors.adminText};
`;

export const ActivityLogItem = styled.li`
    padding: ${(props) => getTheme(props).spacing(2)} 0;
    border-bottom: 1px dashed ${(props) => getTheme(props).colors.adminBorder};
    display: flex;
    flex-direction: column;
    gap: ${(props) => getTheme(props).spacing(0.5)};

    .message {
        font-weight: ${(props) => getTheme(props).typography.admin.weights.medium};
    }
    .timestamp {
        font-size: ${(props) => getTheme(props).typography.admin.sizes.small};
        color: ${(props) => getTheme(props).colors.adminTextSecondary};
    }
    .actor {
        font-weight: ${(props) => getTheme(props).typography.admin.weights.semiBold};
        color: ${(props) => getTheme(props).colors.accent1}; /* Actor name in accent color */
    }
    .notes {
        font-style: italic;
        color: ${(props) => getTheme(props).colors.darkGray};
        margin-top: ${(props) => getTheme(props).spacing(1)};
    }
`;

export const AdminTextAreaAdjustable = styled.textarea` /* Specific styling for note-taking */
    width: 100%;
    min-height: 100px;
    padding: ${(props) => getTheme(props).spacing(3)};
    border: 1px solid ${(props) => getTheme(props).colors.adminBorder};
    border-radius: 8px;
    font-family: ${(props) => getTheme(props).typography.admin.fontFamily};
    font-size: ${(props) => getTheme(props).typography.admin.sizes.bodyBase};
    color: ${(props) => getTheme(props).colors.adminText};
    background-color: ${props => props.theme.colors.adminSurface};
    transition: border-color 0.2s ease-out, box-shadow 0.2s ease-out;
    resize: vertical;

    &:focus {
        outline: none;
        border-color: ${props => props.theme.colors.accent1};
        box-shadow: 0 0 0 3px ${props => rgba(props.theme.colors.accent1, 0.2)};
    }

    &::placeholder {
        color: ${props => props.theme.colors.adminTextSecondary};
    }
`;

export const InfoBox = styled.div` /* Generic wrapper for any block of info */
    background-color: ${(props) => getTheme(props).colors.adminSurface};
    border-radius: 12px;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
    padding: ${(props) => getTheme(props).spacing(6)};
`;