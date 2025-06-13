import styled, { keyframes } from "styled-components";
import { transparentize, lighten, darken, rgba } from "polished";

const itemEntrance = keyframes`
  from { 
    opacity: 0; 
    transform: translateX(-25px); 
    border-color: transparent;
  }
  to { 
    opacity: 1; 
    transform: translateX(0);
    border-color: ${({ theme }) => theme.colors.lightGray};
  }
`;

export const MutationOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(255, 255, 255, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2;
  border-radius: ${(props) => props.theme.borderRadius.large}; // Match parent's border-radius
  transition: opacity 0.2s ease-in-out;
  
`;

export const CartItemWrapper = styled.div<{ $animationDelay?: string }>`
  display: flex;
  border-radius: 15px;
  align-items: flex-start;
  gap: ${({ theme }) => theme.spacing(5)};
  padding: ${({ theme }) => theme.spacing(6)} 0;

  border-bottom: 1px solid
    ${({ theme }) => transparentize(0.7, theme.colors.lightGray)};

  background-color: ${({ theme }) => theme.colors.backgroundLight};

  opacity: 0;
  animation: ${itemEntrance} 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
  animation-delay: ${({ $animationDelay }) => $animationDelay || "0s"};

  &:last-child {
    border-bottom: none;
    padding-bottom: ${({ theme }) => theme.spacing(4)};
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.mobileL}) {
    gap: ${({ theme }) => theme.spacing(3)};
    padding: ${({ theme }) => theme.spacing(4)} 0;
    flex-wrap: wrap;
  }

`;

export const ItemImageLink = styled.a`
  display: block;
  flex-shrink: 0;
  width: 130px;
  height: 150px;
  border-radius: ${({ theme }) => theme.borderRadius.large};
  overflow: hidden;
  background-color: ${({ theme }) =>
    lighten(0.04, theme.colors.primaryNeutral)};
  box-shadow: ${({ theme }) => theme.shadows.sm};
  transition: box-shadow 0.2s ease-out;
    margin-left: 30px;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  
  }

  &:hover {
    box-shadow: ${({ theme }) => theme.shadows.md};
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.mobileL}) {
    width: 100px;
    height: 120px;
  }
`;

export const ItemInfoAndControls = styled.div`
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-height: 150px;
  gap: ${({ theme }) => theme.spacing(2)};

  @media (max-width: ${({ theme }) => theme.breakpoints.mobileL}) {
    min-height: auto;
    width: calc(100% - 100px - ${({ theme }) => theme.spacing(3)});
  }
`;

export const ItemTextDetails = styled.div``;

export const ItemName = styled.a`
  font-family: ${({ theme }) => theme.typography.heading.fontFamily};
  font-size: clamp(1.1rem, 2.5vw, 1.3rem);
  font-weight: ${({ theme }) => theme.typography.heading.weights.regular};
  color: ${({ theme }) => theme.colors.textDark};
  text-decoration: none;
  line-height: 1.35;
  display: block;
  margin-bottom: ${({ theme }) => theme.spacing(1)};
  transition: color 0.2s ease-out;

  &:hover {
    color: ${({ theme }) => theme.colors.accent1};
  }
`;

export const ItemVariant = styled.p`
  font-family: ${({ theme }) => theme.typography.body.fontFamily};
  font-size: ${({ theme }) => theme.typography.body.sizes.small};
  color: ${({ theme }) => theme.colors.textMedium};
  margin: 0 0 ${({ theme }) => theme.spacing(2)} 0;
  line-height: 1.4;
`;

export const ItemUnitPrice = styled.p`
  font-family: ${({ theme }) => theme.typography.body.fontFamily};
  font-size: ${({ theme }) => theme.typography.body.sizes.base};
  color: ${({ theme }) => theme.colors.textMedium};
  margin: 0;
`;

export const ItemPricingActions = styled.div`
  text-align: right;
  display: flex;
    margin-right: 30px;
  flex-direction: column;
  align-items: flex-end;
  justify-content: space-between;
  min-width: 120px;
  flex-shrink: 0;
  min-height: 150px;

  @media (max-width: ${({ theme }) => theme.breakpoints.mobileL}) {
    min-height: auto;
    width: 100%;
    margin-top: ${({ theme }) => theme.spacing(3)};
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }
`;

export const ItemLineTotal = styled.p`
  font-family: ${({ theme }) => theme.typography.body.fontFamily};
  font-size: ${({ theme }) => theme.typography.body.sizes.large};
  font-weight: ${({ theme }) => theme.typography.body.weights.bold};
  color: ${({ theme }) => theme.colors.textDark};
  margin: 0;
  white-space: nowrap;
  line-height: 1.2;

  @media (max-width: ${({ theme }) => theme.breakpoints.mobileL}) {
    font-size: ${({ theme }) => theme.typography.body.sizes.medium};
    margin-bottom: 0;
  }
`;

export const RemoveItemButton = styled.button`
  background: none;
  border: none;
  color: ${({ theme }) => theme.colors.textMuted};
  font-family: ${({ theme }) => theme.typography.body.fontFamily};
  font-size: ${({ theme }) => theme.typography.body.sizes.xsmall};
  font-weight: ${({ theme }) => theme.typography.body.weights.medium};
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing(1)};
  padding: ${({ theme }) => theme.spacing(1.5)};
  border-radius: ${({ theme }) => theme.borderRadius.medium};
  margin-top: auto;

  svg {
    font-size: 1em;
  }

  transition: color 0.2s ease-out, background-color 0.2s ease-out;

  &:hover {
    color: ${({ theme }) =>
      theme.colors.error || theme.colors.adminStatusError};
    background-color: ${({ theme }) =>
      transparentize(0.9, theme.colors.error || theme.colors.adminStatusError)};
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.mobileL}) {
    margin-top: 0;
  }
`;
