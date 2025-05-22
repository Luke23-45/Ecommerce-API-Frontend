// src/components/Admin/Dashboard/RecentActivity/RecentActivity.styles.ts
import styled, { type DefaultTheme, css } from 'styled-components';
import { rgba } from 'polished';

const getTheme = (props: { theme: DefaultTheme }) => props.theme;

export const RecentActivityContainer = styled.div`
    background-color: ${(props) => getTheme(props).colors.adminSurface};
    border-radius: 12px;
    padding: ${(props) => getTheme(props).spacing(6)};
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
    height: 100%;
    display: flex;
    flex-direction: column;
`;

export const ActivityHeader = styled.h3`
    font-family: ${(props) => getTheme(props).typography.admin.fontFamily};
    font-size: ${(props) => getTheme(props).typography.admin.sizes.sectionTitle};
    font-weight: ${(props) => getTheme(props).typography.admin.weights.bold};
    color: ${(props) => getTheme(props).colors.adminText};
    margin-bottom: ${(props) => getTheme(props).spacing(4)};
`;

export const ActivityList = styled.ul`
    list-style: none;
    padding: 0;
    margin: 0;
    flex-grow: 1; /* Allows list to take available space */
    overflow-y: auto; /* Scrollable if many items */
    scrollbar-width: thin;
    scrollbar-color: ${(props) => getTheme(props).colors.lightGray} transparent;

    &::-webkit-scrollbar {
        width: 6px;
    }
    &::-webkit-scrollbar-track {
        background: transparent;
    }
    &::-webkit-scrollbar-thumb {
        background-color: ${(props) => getTheme(props).colors.lightGray};
        border-radius: 10px;
    }
`;

export const ActivityItem = styled.li`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: ${(props) => getTheme(props).spacing(3)} 0;
    border-bottom: 1px dashed ${(props) => getTheme(props).colors.adminBorder};
    font-family: ${(props) => getTheme(props).typography.admin.fontFamily};
    font-size: ${(props) => getTheme(props).typography.admin.sizes.dataCell};
    color: ${(props) => getTheme(props).colors.adminText};

    &:last-child {
        border-bottom: none;
    }
`;

export const ActivityDetails = styled.div`
    flex-grow: 1; /* Name and type */
    display: flex;
    flex-direction: column;

    .name {
        font-weight: ${(props) => getTheme(props).typography.admin.weights.semiBold};
        color: ${(props) => getTheme(props).colors.adminText};
        margin-bottom: ${(props) => getTheme(props).spacing(0.5)};
    }
    .type {
        color: ${(props) => getTheme(props).colors.adminTextSecondary};
        font-size: ${(props) => getTheme(props).typography.admin.sizes.small};
    }
`;

export const ActivityMeta = styled.div`
    text-align: right;

    .date {
        color: ${(props) => getTheme(props).colors.adminTextSecondary};
        font-size: ${(props) => getTheme(props).typography.admin.sizes.small};
        display: block;
        margin-bottom: ${(props) => getTheme(props).spacing(0.5)};
    }
    .value {
        font-weight: ${(props) => getTheme(props).typography.admin.weights.bold};
        color: ${(props) => getTheme(props).colors.adminText};
    }
`;

export const ActivityStatusBadge = styled.span<{ $status: 'pending' | 'shipped' | 'returned' | 'paid' }>`
    padding: 4px 8px;
    border-radius: 6px;
    font-size: ${(props) => getTheme(props).typography.admin.sizes.xsmall};
    font-weight: ${(props) => getTheme(props).typography.admin.weights.semiBold};
    text-transform: uppercase;
    letter-spacing: 0.3px;

  ${(props) =>
  props.$status === 'paid' &&
  css`
    background-color: ${rgba(getTheme(props).colors.adminStatusSuccess, 0.1)};
    color: ${getTheme(props).colors.adminStatusSuccess};
  `}

${(props) =>
  props.$status === 'shipped' &&
  css`
    background-color: ${rgba(getTheme(props).colors.accent2, 0.1)};
    color: ${getTheme(props).colors.accent2};
  `}

${(props) =>
  props.$status === 'pending' &&
  css`
    background-color: ${rgba(getTheme(props).colors.adminStatusWarning, 0.1)};
    color: ${getTheme(props).colors.adminStatusWarning};
  `}

${(props) =>
  props.$status === 'returned' &&
  css`
    background-color: ${rgba(getTheme(props).colors.adminStatusError, 0.1)};
    color: ${getTheme(props).colors.adminStatusError};
  `}

`;