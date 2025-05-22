// src/components/Admin/Settings/ShippingTaxSettings.tsx
import React from 'react';
import { FaShippingFast, FaCalculator } from 'react-icons/fa';

import { AdminButton } from '../Dashboard/Common/Common.styles';
import {
  SettingsModuleContainer,
  SettingsModuleHeader,
  HeaderTitle,
  ContentBox,
  ActionsContainer,
} from './ShippingTaxSettings.styles';


interface ShippingTaxSettingsProps {
    onManageShipping?: () => void;
    onManageTaxes?: () => void;
}

const ShippingTaxSettings: React.FC<ShippingTaxSettingsProps> = ({ onManageShipping, onManageTaxes }) => {
  return (
    <SettingsModuleContainer>
      <SettingsModuleHeader>
        <HeaderTitle>
          <FaShippingFast style={{ marginRight: '10px', verticalAlign: 'middle' }} /> Shipping & Tax
        </HeaderTitle>
        <AdminButton $variant="primary" onClick={onManageShipping}>
          Manage Shipping
        </AdminButton>
      </SettingsModuleHeader>

      <ContentBox>
        <FaCalculator />
        <p>
          Configure shipping zones, rates, carriers, and rules for your products. Define global and regional tax rates, exemptions, and compliance settings for your marketplace.
        </p>
        <ActionsContainer>
          <AdminButton $variant="secondary" onClick={onManageTaxes}>
            Manage Tax Settings
          </AdminButton>
        </ActionsContainer>
      </ContentBox>
    </SettingsModuleContainer>
  );
};

export default ShippingTaxSettings;