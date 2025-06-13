import styled, { css } from "styled-components";
import { lighten, darken, transparentize, rgba } from "polished";

export const SummaryCardWrapper = styled.aside`
  background-color: ${({ theme }) => theme.colors.primaryNeutral};
  border-radius: ${({ theme }) => theme.borderRadius.large};
  padding: ${({ theme }) => theme.spacing(6)};
  border: 1px solid ${({ theme }) => theme.colors.lightGray};
  box-shadow: ${({ theme }) => theme.shadows.sm};

  position: sticky;
  top: calc(
    ${({ theme }) => (theme.dimensions as any)?.headerHeight || "90px"} +
      ${({ theme }) => (theme.dimensions as any)?.secondaryNavHeight || "64px"} +
      ${({ theme }) => theme.spacing(6)}
  );
  max-height: calc(
    100vh - ${({ theme }) => (theme.dimensions as any)?.headerHeight || "90px"} -
      ${({ theme }) => (theme.dimensions as any)?.secondaryNavHeight || "64px"} -
      ${({ theme }) => theme.spacing(12)}
  );
  overflow-y: auto;

  &::-webkit-scrollbar {
    width: 6px;
  }
  &::-webkit-scrollbar-track {
    background: ${({ theme }) => transparentize(0.8, theme.colors.mediumGray)};
    border-radius: 3px;
  }
  &::-webkit-scrollbar-thumb {
    background: ${({ theme }) => theme.colors.mediumGray};
    border-radius: 3px;
  }
  &::-webkit-scrollbar-thumb:hover {
    background: ${({ theme }) => theme.colors.darkGray};
  }
  scrollbar-width: thin;
  scrollbar-color: ${({ theme }) => theme.colors.mediumGray} transparent;

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet || "768px"}) {
    position: static;
    max-height: none;
    overflow-y: visible;
    margin-top: ${({ theme }) => theme.spacing(6)};
  }
`;

export const Title = styled.h2`
  font-family: ${({ theme }) => theme.typography.heading.fontFamily};
  font-size: ${({ theme }) => theme.typography.heading.sizes.h4};
  font-weight: ${({ theme }) => theme.typography.heading.weights.bold};
  color: ${({ theme }) => theme.colors.textDark};
  margin: 0 0 ${({ theme }) => theme.spacing(4)} 0;
  padding-bottom: ${({ theme }) => theme.spacing(3)};
  border-bottom: 1px solid ${({ theme }) => theme.colors.lightGray};
`;

export const Row = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${({ theme }) => theme.spacing(2.5)} 0;
  font-family: ${({ theme }) => theme.typography.body.fontFamily};
  font-size: ${({ theme }) => theme.typography.body.sizes.base};
  color: ${({ theme }) => theme.colors.textMedium};

  &.total-row {
    padding-top: ${({ theme }) => theme.spacing(3.5)};
    margin-top: ${({ theme }) => theme.spacing(3)};
    border-top: 1.5px solid ${({ theme }) => theme.colors.mediumGray};
    font-size: ${({ theme }) => theme.typography.body.sizes.large};
    font-weight: ${({ theme }) => theme.typography.body.weights.bold};
    color: ${({ theme }) => theme.colors.textDark};
  }
`;

export const Label = styled.span``;

export const Value = styled.span`
  font-weight: ${({ theme }) => theme.typography.body.weights.medium};
  text-align: right;
`;

export const DiscountCodeWrapper = styled.div`
  margin: ${({ theme }) => theme.spacing(4)} 0;
  padding-bottom: ${({ theme }) => theme.spacing(4)};
  border-bottom: 1px dashed
    ${({ theme }) => transparentize(0.5, theme.colors.lightGray)};
  display: flex;
  gap: ${({ theme }) => theme.spacing(2)};

  input {
    flex-grow: 1;
    padding: ${({ theme }) => theme.spacing(2.5)}
      ${({ theme }) => theme.spacing(3)};
    border: 1px solid ${({ theme }) => theme.colors.mediumGray};
    border-radius: ${({ theme }) => theme.borderRadius.medium};
    font-family: ${({ theme }) => theme.typography.body.fontFamily};
    font-size: ${({ theme }) => theme.typography.body.sizes.small};
    background-color: ${({ theme }) => theme.colors.backgroundLight};
    &:focus {
      border-color: ${({ theme }) => theme.colors.accent1};
      box-shadow: 0 0 0 2px
        ${({ theme }) => transparentize(0.85, theme.colors.accent1)};
      outline: none;
    }
  }

  button {
    padding: 0 ${({ theme }) => theme.spacing(4)};
    background-color: ${({ theme }) => theme.colors.accent2};
    color: ${({ theme }) => theme.colors.textLight};
    border: none;
    border-radius: ${({ theme }) => theme.borderRadius.medium};
    font-family: ${({ theme }) => theme.typography.body.fontFamily};
    font-size: ${({ theme }) => theme.typography.body.sizes.small};
    font-weight: ${({ theme }) => theme.typography.body.weights.semiBold};
    cursor: pointer;
    transition: background-color 0.2s ease;
    flex-shrink: 0;
    &:hover:not(:disabled) {
      background-color: ${({ theme }) => darken(0.1, theme.colors.accent2)};
    }
    &:disabled {
      background-color: ${({ theme }) => theme.colors.mediumGray};
      cursor: not-allowed;
    }
  }
`;

export const DiscountMessage = styled.p<{ $type: "success" | "error" }>`
  font-size: ${({ theme }) => theme.typography.body.sizes.small};
  color: ${({ theme, $type }) =>
    $type === "success"
      ? theme.colors.adminStatusSuccess
      : theme.colors.adminStatusError};
  text-align: left;
  margin: ${({ theme }) => theme.spacing(1.5)} 0 0 0;
  padding-left: ${({ theme }) => theme.spacing(0.5)};
`;

export const CheckoutActionsWrapper = styled.div`
  margin-top: ${({ theme }) => theme.spacing(5)};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing(3)};
`;

export const ExpressCheckoutOptions = styled.div`
  display: flex;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing(3)};
  margin-top: ${({ theme }) => theme.spacing(2)};
`;

export const SecureInfo = styled.div`
  margin-top: ${({ theme }) => theme.spacing(4)};
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: ${({ theme }) => theme.spacing(1.5)};
  font-size: ${({ theme }) => theme.typography.body.sizes.xsmall};
  color: ${({ theme }) => theme.colors.textMuted};
  opacity: 0.9;

  svg {
    font-size: 1.1em;
  }
`;
