// src/components/checkout/CheckoutStepper/CheckoutStepper.tsx
import React from 'react';
import type { CheckoutAccordionStep } from '@/pages/CheckoutPage'; // Assuming this type is exported from CheckoutPage

import {
  StepperStyled,
  StepStyled,
  StepClickableArea,
  StepIconContainer,
  StepLabel,
  type StepStyleProps // Import this if needed for casting, though usually not for the component itself
} from './CheckoutStepper.styles';

export interface CheckoutStepItem {
  id: CheckoutAccordionStep;
  label: string;
  icon: React.ReactNode;
}

export interface CheckoutStepperProps {
  steps: CheckoutStepItem[];
  currentStepId: CheckoutAccordionStep;
  completedSteps: CheckoutAccordionStep[]; // Array of IDs of completed steps
  onStepClick?: (stepId: CheckoutAccordionStep) => void;
}

const CheckoutStepper: React.FC<CheckoutStepperProps> = ({
  steps,
  currentStepId,
  completedSteps,
  onStepClick,
}) => {
  return (
    <StepperStyled role="tablist" aria-label="Checkout Progress">
      {steps.map((step, index) => {
        const isActive = step.id === currentStepId;
        const isCompleted = completedSteps.includes(step.id);
        // A step is clickable if onStepClick is provided AND it's a completed step (but not the active one)
        // Or if you want to allow jumping ahead (generally not recommended for checkout)
        const isClickable = !!onStepClick && isCompleted && !isActive;

        const handleStepClick = () => {
          if (isClickable && onStepClick) {
            onStepClick(step.id);
          }
        };

        return (
          <StepStyled
            key={step.id}
            $isActive={isActive}
            $isCompleted={isCompleted}
            aria-selected={isActive}
            aria-controls={`checkout-panel-${step.id}`} // For accessibility, panel ID it controls
            role="tab"
            tabIndex={isActive || isClickable ? 0 : -1} // Keyboard navigation
          >
            <StepClickableArea
              $isClickable={isClickable}
              onClick={handleStepClick}
              onKeyPress={(e) => { // Allow activation with Enter/Space for accessibility
                if (isClickable && (e.key === 'Enter' || e.key === ' ')) {
                  e.preventDefault();
                  handleStepClick();
                }
              }}
            >
              <StepIconContainer
                $isActive={isActive}
                $isCompleted={isCompleted}
                aria-hidden="true" // Icon is decorative if label is present
              >
                {step.icon}
              </StepIconContainer>
              <StepLabel
                $isActive={isActive}
                $isCompleted={isCompleted}
                id={`checkout-step-label-${step.id}`} // For aria-labelledby if needed
              >
                {step.label}
              </StepLabel>
            </StepClickableArea>
          </StepStyled>
        );
      })}
    </StepperStyled>
  );
};

export default CheckoutStepper;