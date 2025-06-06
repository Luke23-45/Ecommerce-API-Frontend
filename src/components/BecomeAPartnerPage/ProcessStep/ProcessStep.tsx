// src/components/BecomeAPartnerPage/ProcessComicPanel/ProcessComicPanel.tsx
import React from 'react';

import {
  ComicPanelWrapper,
  PanelVisualContainer,
  PanelCaptionBox,
  PanelSpeechBubble,
} from './ProcessStep.styles'; // Styles should be named consistently

interface ProcessComicPanelProps {
  visual: React.ReactNode;  // The main icon or SVG for the panel's visual
  captionTitle: string;   // Text for the caption box (e.g., "Step 1: Choose")
  description: string;      // Text for the speech bubble
  animationDelay?: string;
  hasNextStepInRow?: boolean; // To control arrow visibility
}

const ProcessComicPanel: React.FC<ProcessComicPanelProps> = ({
  visual, // This is your <img src="..." alt="..."/> or <FaIcon />
  captionTitle,
  description,
  animationDelay,
  hasNextStepInRow,
}) => {
  return (
    <ComicPanelWrapper $animationDelay={animationDelay} $hasNextStepInRow={hasNextStepInRow}>
      <PanelCaptionBox>
        {captionTitle}
      </PanelCaptionBox>
      <PanelVisualContainer>
        {/* If visual is an img tag, add the class for hover zoom targeting */}
        {React.isValidElement(visual) && visual.type === 'img' 
          ? React.cloneElement(visual as React.ReactElement<any>, { className: 'panel-visual-image' }) 
          : visual}
      </PanelVisualContainer>
      <PanelSpeechBubble>
        {description}
      </PanelSpeechBubble>
    </ComicPanelWrapper>
  );
};

export default ProcessComicPanel;