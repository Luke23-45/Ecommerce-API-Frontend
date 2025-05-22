// src/components/Admin/Customers/CustomerDetail.styles.ts
import styled, {type DefaultTheme, css, keyframes } from 'styled-components';
import { rgba, darken } from 'polished';

const getTheme = (props: { theme: DefaultTheme }) => props.theme;

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
`;

export const CustomerDetailContainer = styled.div`
    display: flex;
    flex-direction: column;
    /* Animation for the whole detail page entry */
    opacity: 0;
    animation: ${fadeIn} 0.6s ease-out forwards;
    animation-delay: 0.2s;
`;

export const CustomerDetailHeader = styled.div`
    background-color: ${(props) => props.theme.colors.adminSurface};
    border-radius: 12px;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
    padding: ${(props) => props.theme.spacing(6)};
    margin-bottom: ${(props) => props.theme.spacing(8)};

    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    flex-wrap: wrap;
    gap: ${(props) => props.theme.spacing(4)};

    @media (max-width: ${(props) => props.theme.breakpoints.tablet}) {
        flex-direction: column;
        padding: ${(props) => props.theme.spacing(4)};
        border-radius: 0;
        box-shadow: none;
    }
`;

export const CustomerInfoGroup = styled.div`
    display: flex;
    align-items: center;
    gap: ${(props) => props.theme.spacing(4)};

    img {
        width: 80px;
        height: 80px;
        border-radius: 50%;
        object-fit: cover;
        border: 2px solid ${(props) => props.theme.colors.adminBorder};
    }

    div { /* For name and status */
        display: flex;
        flex-direction: column;
        gap: ${(props) => props.theme.spacing(1)};
    }

    h2 {
        font-family: ${(props) => props.theme.typography.admin.fontFamily};
        font-size: ${(props) => props.theme.typography.admin.sizes.sectionTitle};
        font-weight: ${(props) => props.theme.typography.admin.weights.bold};
        color: ${(props) => props.theme.colors.adminText};
        margin-bottom: 0;
    }

    span {
        font-family: ${(props) => props.theme.typography.admin.fontFamily};
        font-size: ${(props) => props.theme.typography.admin.sizes.small};
        color: ${(props) => props.theme.colors.adminTextSecondary};
    }
`;

export const CustomerMetrics = styled.div`
    display: flex;
    gap: ${(props) => props.theme.spacing(6)};
    
    div {
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: ${(props) => props.theme.spacing(2)};
        border-right: 1px solid ${(props) => props.theme.colors.adminBorder};

        &:last-child {
            border-right: none;
        }

        span:first-child {
            font-family: ${(props) => props.theme.typography.admin.fontFamily};
            font-size: ${(props) => props.theme.typography.admin.sizes.dataCell};
            color: ${(props) => props.theme.colors.adminTextSecondary};
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        span:last-child {
            font-family: ${(props) => props.theme.typography.heading.fontFamily};
            font-size: ${(props) => props.theme.typography.admin.sizes.moduleTitle};
            font-weight: ${(props) => props.theme.typography.heading.weights.bold};
            color: ${(props) => props.theme.colors.adminText};
        }
    }
    @media (max-width: ${(props) => props.theme.breakpoints.tablet}) {
        width: 100%;
        justify-content: space-around;
        gap: 0;
        margin-top: ${(props) => props.theme.spacing(4)};
        div {
            border-right: none;
            padding: 0;
        }
    }
`;

export const CustomerDetailLayout = styled.div`
    display: grid;
    grid-template-columns: 2fr 1fr; /* Main content vs sidebar (order history/notes) */
    gap: ${(props) => props.theme.spacing(8)};

    @media (max-width: ${(props) => props.theme.breakpoints.laptop}) {
        grid-template-columns: 1fr; /* Single column on laptop/tablet */
    }
`;

export const MainContentColumn = styled.div`
    display: flex;
    flex-direction: column;
    gap: ${(props) => props.theme.spacing(8)};
`;

export const SidebarContentColumn = styled.div`
    display: flex;
    flex-direction: column;
    gap: ${(props) => props.theme.spacing(8)};
`;

export const StickyActionBar = styled.div`
    position: sticky;
    bottom: 0;
    left: 0;
    width: 100%;
    background-color: ${(props) => rgba(props.theme.colors.adminPrimaryBg, 0.95)};
    backdrop-filter: blur(8px);
    border-top: 1px solid ${(props) => props.theme.colors.adminBorder};
    padding: ${(props) => props.theme.spacing(4)} ${(props) => props.theme.spacing(6)};
    box-shadow: 0 -4px 15px rgba(0, 0, 0, 0.03);
    z-index: 50;
    display: flex;
    justify-content: flex-end;
    gap: ${(props) => props.theme.spacing(3)};

    @media (max-width: ${(props) => props.theme.breakpoints.tablet}) {
        flex-direction: column;
        gap: ${(props) => props.theme.spacing(2)};
        padding: ${(props) => props.theme.spacing(3)};
    }
`;

export const InfoSectionTitle = styled.h4`
    font-family: ${(props) => props.theme.typography.admin.fontFamily};
    font-size: ${(props) => props.theme.typography.admin.sizes.bodyBase};
    font-weight: ${(props) => props.theme.typography.admin.weights.bold};
    color: ${(props) => props.theme.colors.adminText};
    margin-bottom: ${(props) => props.theme.spacing(3)};
`;

export const InfoGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
    gap: ${(props) => props.theme.spacing(3)} ${(props) => props.theme.spacing(5)};
    
    div {
        display: flex;
        flex-direction: column;
        gap: ${(props) => props.theme.spacing(0.5)};
    }

    span:first-child {
        font-family: ${(props) => props.theme.typography.admin.fontFamily};
        font-size: ${(props) => props.theme.typography.admin.sizes.xsmall};
        color: ${(props) => props.theme.colors.adminTextSecondary};
        text-transform: uppercase;
        letter-spacing: 0.3px;
    }
    span:last-child {
        font-family: ${(props) => props.theme.typography.admin.fontFamily};
        font-size: ${(props) => props.theme.typography.admin.sizes.dataCell};
        color: ${(props) => props.theme.colors.adminText};
        font-weight: ${(props) => props.theme.typography.admin.weights.medium};
    }
`;

// Specific styles for Address Cards within the detail view
export const AddressCard = styled.div`
    background-color: ${(props) => props.theme.colors.adminSecondaryBg};
    border-radius: 8px;
    padding: ${(props) => props.theme.spacing(4)};
    display: flex;
    flex-direction: column;
    gap: ${(props) => props.theme.spacing(1.5)};
    position: relative; /* For action buttons overlay */

    h5 {
        font-family: ${(props) => props.theme.typography.admin.fontFamily};
        font-size: ${(props) => props.theme.typography.admin.sizes.dataCell};
        font-weight: ${(props) => props.theme.typography.admin.weights.semiBold};
        color: ${(props) => props.theme.colors.adminText};
        margin-bottom: ${(props) => props.theme.spacing(1)};
    }
    p {
        font-family: ${(props) => props.theme.typography.admin.fontFamily};
        font-size: ${(props) => props.theme.typography.admin.sizes.small};
        color: ${(props) => props.theme.colors.adminTextSecondary};
        line-height: 1.4;
    }
    span.address-type-badge {
        position: absolute;
        top: ${(props) => props.theme.spacing(2)};
        right: ${(props) => props.theme.spacing(2)};
        background-color: ${props => rgba(props.theme.colors.accent2, 0.15)};
        color: ${props => props.theme.colors.accent2};
        padding: 4px 8px;
        border-radius: 4px;
        font-size: ${(props) => props.theme.typography.admin.sizes.xsmall};
        text-transform: uppercase;
    }
`;

export const AddressActions = styled.div`
    display: flex;
    gap: ${(props) => props.theme.spacing(2)};
    margin-top: ${(props) => props.theme.spacing(2)};
    justify-content: flex-end; /* Align actions to right */
    
    button { /* Individual button in address card */
        background: none;
        border: none;
        color: ${(props) => props.theme.colors.adminTextSecondary};
        cursor: pointer;
        font-size: ${(props) => props.theme.typography.admin.sizes.small};
        transition: color 0.2s ease-out;
        &:hover {
            color: ${(props) => props.theme.colors.accent1};
        }
    }
`;

export const OrderHistoryTable = styled.table` /* Reusable for embedded table */
    width: 100%;
    border-collapse: collapse;
    font-family: ${(props) => props.theme.typography.admin.fontFamily};

    thead th {
        text-align: left;
        padding: ${(props) => props.theme.spacing(2)};
        font-size: ${(props) => props.theme.typography.admin.sizes.small};
        font-weight: ${(props) => props.theme.typography.admin.weights.semiBold};
        color: ${(props) => props.theme.colors.adminTextSecondary};
        border-bottom: 1px solid ${(props) => props.theme.colors.adminBorder};
    }

    tbody td {
        padding: ${(props) => props.theme.spacing(2)};
        font-size: ${(props) => props.theme.typography.admin.sizes.dataCell};
        color: ${(props) => props.theme.colors.adminText};
        border-bottom: 1px dashed ${(props) => props.theme.colors.adminBorder};
    }
    tbody tr:last-child td { border-bottom: none; } /* No border on last row */
`;

export const AdminTextAreaAdjustable = styled.textarea` /* Reusable for notes */
    width: 100%;
    min-height: 100px;
    padding: ${(props) => props.theme.spacing(3)};
    border: 1px solid ${(props) => props.theme.colors.adminBorder};
    border-radius: 8px;
    font-family: ${(props) => props.theme.typography.admin.fontFamily};
    font-size: ${(props) => props.theme.typography.admin.sizes.bodyBase};
    color: ${(props) => props.theme.colors.adminText};
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