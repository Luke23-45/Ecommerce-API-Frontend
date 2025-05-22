// src/components/Admin/Settings/PaymentGatewaySettings.tsx
import React from 'react';
import { FaCreditCard, FaCog, FaPlus } from 'react-icons/fa';

import { AdminButton } from '../Dashboard/Common/Common.styles';
import {
  SettingsModuleContainer,
  SettingsModuleHeader,
  HeaderTitle,
  ContentBox,
  ActionsContainer,
} from './PaymentGatewaySettings.styles';

interface PaymentGatewaySettingsProps {
    onManageSettings?: () => void;
    onAddGateway?: () => void;
}

const PaymentGatewaySettings: React.FC<PaymentGatewaySettingsProps> = ({ onManageSettings, onAddGateway }) => {
  return (
    <SettingsModuleContainer>
      <SettingsModuleHeader>
        <HeaderTitle>
          <FaCreditCard style={{ marginRight: '10px', verticalAlign: 'middle' }} /> Payment Gateways
        </HeaderTitle>
        <AdminButton $variant="primary" onClick={onAddGateway}>
          <FaPlus /> Add New Gateway
        </AdminButton>
      </SettingsModuleHeader>

      <ContentBox>
        <FaCreditCard />
        <p>
          Manage your platform's payment gateway integrations here. Connect to providers like Stripe, PayPal, or other local payment processors. 
          Configure credentials, payment methods, and transaction settings.
        </p>
        <ActionsContainer>
          <AdminButton $variant="secondary" onClick={onManageSettings}>
            <FaCog /> Configure Gateways
          </AdminButton>
        </ActionsContainer>
      </ContentBox>
    </SettingsModuleContainer>
  );
};

export default PaymentGatewaySettings;