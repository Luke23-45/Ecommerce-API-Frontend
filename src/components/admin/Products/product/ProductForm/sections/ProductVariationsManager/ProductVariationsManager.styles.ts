// src/components/Admin/Products/ProductForm/ProductVariations/ProductVariationsManager.styles.ts

import styled, { type DefaultTheme, keyframes } from 'styled-components';
import { rgba, lighten } from 'polished';

const getTheme = (props: { theme: DefaultTheme }) => props.theme;

// --- Main Container ---
export const ManagerContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${(props) => getTheme(props).spacing(4)};
  width: 100%;
`;

// --- Area for Attribute & Option Selection ---
export const AttributeSelectionArea = styled.div`
  padding: ${(props) => getTheme(props).spacing(4)};
  border: 1px solid ${(props) => getTheme(props).colors.adminBorder || '#EEE'};
  border-radius: 12px;
  background-color: ${(props) => lighten(0.03, getTheme(props).colors.adminSecondaryBg || '#F8F9FA')};
`;

export const SectionTitle = styled.h4`
  font-family: ${(props) => getTheme(props).typography.admin?.fontFamily || 'sans-serif'};
  font-size: 1.1rem;
  font-weight: 600;
  color: ${(props) => getTheme(props).colors.adminText || '#333'};
  margin: 0;
  display: flex;
  align-items: center;
  gap: ${(props) => getTheme(props).spacing(2.5)};
`;

export const AttributePickerGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${(props) => getTheme(props).spacing(3)};
  margin-top: ${(props) => getTheme(props).spacing(3)};
`;

export const AttributeRow = styled.div`
  display: flex;
  align-items: flex-start;
  gap: ${(props) => getTheme(props).spacing(3)};
  @media (max-width: 768px) { flex-direction: column; }
`;

export const AttributeNameLabel = styled.span`
  font-weight: 500;
  color: ${(props) => getTheme(props).colors.adminTextSecondary || '#555'};
  min-width: 120px;
  padding-top: 10px;
`;

export const ValuesInputContainer = styled.div`
  flex-grow: 1;
`;

export const VariationActionsBar = styled.div`
  display: flex;
  justify-content: flex-start;
  gap: ${(props) => getTheme(props).spacing(3)};
  padding: ${(props) => getTheme(props).spacing(2)} 0;
`;

// --- Variations List and Table ---
export const VariationsListWrapper = styled.div`
  margin-top: ${(props) => getTheme(props).spacing(2)};
`;

export const VariationsTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: 0.875rem;

  thead th {
    text-align: left;
    padding: ${(props) => getTheme(props).spacing(2)} ${(props) => getTheme(props).spacing(2.5)};
    font-size: 0.75rem;
    font-weight: 700;
    color: ${(props) => getTheme(props).colors.adminTextMuted || '#6c757d'};
    text-transform: uppercase;
    letter-spacing: 0.5px;
    background-color: ${(props) => getTheme(props).colors.adminSecondaryBg || '#F8F9FA'};
    border-bottom: 2px solid ${(props) => getTheme(props).colors.adminBorder || '#E0E0E0'};
    white-space: nowrap;
  }

  tbody tr {
    border-bottom: 1px solid ${(props) => getTheme(props).colors.adminBorderLight || '#EEEEEE'};
  }
  
  tbody tr.details-row {
      border-bottom: none;
  }
  
  tbody tr.details-row + tr:not(.details-row) {
    border-top: 2px solid ${(props) => getTheme(props).colors.adminBorder || '#E0E0E0'};
  }

  tbody td {
    padding: ${(props) => getTheme(props).spacing(2)} ${(props) => getTheme(props).spacing(2.5)};
    vertical-align: middle;
  }
`;

// --- Styles for the Collapsible Details Row ---
export const VariationDetailRow = styled.tr.attrs({ className: 'details-row' })``;

export const DetailCell = styled.td`
  padding: ${(props) => getTheme(props).spacing(4)} !important;
  background-color: ${(props) => lighten(0.01, getTheme(props).colors.adminSecondaryBg || '#F9FAFB')};
`;

export const DetailsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: ${(props) => getTheme(props).spacing(4)};
  width: 100%;
`;

export const ExpandButton = styled.button<{ isExpanded: boolean }>`
    background: none;
    border: none;
    cursor: pointer;
    color: ${(props) => getTheme(props).colors.adminTextMuted};
    padding: 5px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    
    svg {
        transition: transform 0.2s ease-in-out;
        transform: rotate(${(props) => (props.isExpanded ? '180deg' : '0deg')});
    }
    
    &:hover {
        background-color: ${(props) => getTheme(props).colors.adminBorderLight};
        color: ${(props) => getTheme(props).colors.accent1};
    }
`;

// --- Other Cell Styles ---
export const VariationAttributeCell = styled.div`
  font-size: 0.9em;
  line-height: 1.5;
  white-space: nowrap;
  max-width: 200px;
`;

export const VariationImageColumn = styled.div`
  width: 250px;
`;

export const ActionCell = styled.td`
  text-align: center;
`;

export const DeleteVariationButton = styled.button`
  background: none;
  border: none;
  color: ${(props) => getTheme(props).colors.adminTextMuted || '#999'};
  cursor: pointer;
  font-size: 1.1em;
  padding: ${(props) => getTheme(props).spacing(1)};
  border-radius: 50%;
  transition: all 0.2s ease-out;
  
  &:hover {
    color: ${props => getTheme(props).colors.adminStatusError || '#dc3545'};
    background-color: ${props => rgba(getTheme(props).colors.adminStatusError || '#dc3545', 0.1)};
  }
`;

export const NoVariationsMessage = styled.div`
  color: ${(props) => getTheme(props).colors.adminTextSecondary || '#6c757d'};
  text-align: center;
  padding: ${(props) => getTheme(props).spacing(6)} ${(props) => getTheme(props).spacing(3)};
  border: 1px dashed ${(props) => getTheme(props).colors.adminBorderLight || '#EEE'};
  border-radius: 8px;
  background-color: ${(props) => getTheme(props).colors.adminSecondaryBg || '#F8F9FA'};
`;