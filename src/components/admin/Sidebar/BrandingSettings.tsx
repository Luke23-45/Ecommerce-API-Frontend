// src/components/Admin/Settings/BrandingSettings.tsx
import React from 'react';
import { FaPaintBrush, FaGlobe, FaPalette as FaColorPalette } from 'react-icons/fa'; // Renamed FaPalette to FaColorPalette
import { AdminButton } from '../Dashboard/Common/Common.styles';

import {
  SettingsModuleContainer,
  SettingsModuleHeader,
  HeaderTitle,
  ContentBox,
  ActionsContainer,
} from './BrandingSettings.styles';


interface BrandingSettingsProps {
    onUploadLogo?: () => void;
    onCustomizeColors?: () => void;
}

const BrandingSettings: React.FC<BrandingSettingsProps> = ({ onUploadLogo, onCustomizeColors }) => {
  return (
    <SettingsModuleContainer>
      <SettingsModuleHeader>
        <HeaderTitle>
          <FaPaintBrush style={{ marginRight: '10px', verticalAlign: 'middle' }} /> Branding & Customization
        </HeaderTitle>
        <AdminButton $variant="primary" onClick={onUploadLogo}>
          <FaGlobe /> Upload Logo / Favicon
        </AdminButton>
      </SettingsModuleHeader>

      <ContentBox>
        <FaColorPalette />
        <p>
          Control the visual identity of your marketplace. Upload your brand logo, favicon, and define the primary color palette used across the platform to match your brand's unique style.
        </p>
        <ActionsContainer>
          <AdminButton $variant="secondary" onClick={onCustomizeColors}>
            Customize Colors
          </AdminButton>
        </ActionsContainer>
      </ContentBox>
    </SettingsModuleContainer>
  );
};

export default BrandingSettings;