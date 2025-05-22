// src/components/Admin/Settings/SettingsOverview.tsx
import React, { useState, useEffect, useCallback } from 'react';
import { FaArrowLeft } from 'react-icons/fa'; // Added for back button
import {
  SettingsOverviewContainer,
  SettingsHeader,
  HeaderTitle,
  SettingSectionContainer,
} from './SettingsOverview.styles';


import GeneralSettingsForm from './GeneralSettingsForm';
import UserManagementSection from './UserManagementSection';
import PaymentGatewaySettings from '../Sidebar/PaymentGatewaySettings';
import ShippingTaxSettings from '../Sidebar/ShippingTaxSettings';
import BrandingSettings from '../Sidebar/BrandingSettings';

import type { GeneralSettings, PlatformUser } from '../../../types/settings'; // Correct relative path


interface SettingsOverviewProps {
    generalSettingsData: GeneralSettings;
    platformUsersData: PlatformUser[];
    onSaveGeneralSettings: (settings: GeneralSettings) => void;
    onSavePlatformUser: (user: PlatformUser, isNew: boolean) => void;
    onDeletePlatformUser: (userId: string, userName: string) => void; // Passed down from AdminPage
    onNavigateToSection: (path: string) => void; // <--- NEW: To navigate to sub-sections (via AdminPage)
    currentPath:string;
}

// Define possible active sub-sections internally managed by SettingsOverview
type ActiveSettingSection = 'overview' | 'general' | 'users' | 'payment-gateways' | 'shipping-tax' | 'branding';


const SettingsOverview: React.FC<SettingsOverviewProps> = ({
    generalSettingsData,
    platformUsersData,
    onSaveGeneralSettings,
    onSavePlatformUser,
    onDeletePlatformUser,
    onNavigateToSection, 
    currentPath
}) => {
  // console.log("-------------", onNavigateToSection)
    // Internal state to manage which setting sub-section is currently active within SettingsOverview
    // Initialized to 'general' or 'users' based on general settings route if it exists.
    const [activeSettingSection, setActiveSettingSection] = useState<ActiveSettingSection>('general'); // Default to general as first visible

    // EFFECT: Set default section based on activePath (from AdminPage/Sidebar)
    // This allows sidebar clicks for general/users to work directly.
    console.log(currentPath,"__________")
    useEffect(() => {
        const path = currentPath; 
        if (path.startsWith('/admin/settings/general')) setActiveSettingSection('general');
        else if (path.startsWith('/admin/settings/users')) setActiveSettingSection('users');
        else if (path.startsWith('/admin/settings/payment-gateways')) setActiveSettingSection('payment-gateways');
        else if (path.startsWith('/admin/settings/shipping-tax')) setActiveSettingSection('shipping-tax');
        else if (path.startsWith('/admin/settings/branding')) setActiveSettingSection('branding');
        else setActiveSettingSection('general'); 
    }, [currentPath]); 

    // Handlers are passed down to respective sub-components
    const handleSaveGeneralSettingsCallback = useCallback((updatedSettings: GeneralSettings) => {
        onSaveGeneralSettings(updatedSettings); // Call parent handler from AdminPage
    }, [onSaveGeneralSettings]);

    const handleSaveUserCallback = useCallback((user: PlatformUser, isNew: boolean) => {
        onSavePlatformUser(user, isNew); // Call parent handler from AdminPage
    }, [onSavePlatformUser]);

    const handleDeleteUserCallback = useCallback((userId: string, userName: string) => {
        onDeletePlatformUser(userId, userName); // Call parent handler from AdminPage
    }, [onDeletePlatformUser]);


    // Handlers for navigating to sub-setting sections within SettingsOverview
    // These now use `onNavigateToSection` which sends the path up to AdminPage.
    const navigateToSettingSection = useCallback((sectionPath: ActiveSettingSection) => {
        // If 'general' or 'users', those components are embedded directly within this SettingsOverview.
        // So we only update internal state `activeSettingSection`.
        // If it's the specific placeholders, AdminPage manages the path.
        if (sectionPath === 'general' || sectionPath === 'users') {
             setActiveSettingSection(sectionPath);
        } else {
             // For payment-gateways, shipping-tax, branding:
             // These are actual page routes. Call AdminPage's `onNavigateToSection` to update URL/route.
             onNavigateToSection(`/admin/settings/${sectionPath}`);
        }
    }, [onNavigateToSection]);


    // Determine which section to render
    const renderActiveSectionContent = () => {
      console.log(activeSettingSection,"%%%%%%%%%")
        switch (activeSettingSection) {
            case 'general':
                return (
                    <GeneralSettingsForm
                        settingsData={generalSettingsData}
                        onSave={handleSaveGeneralSettingsCallback}
                    />
                );
            case 'users':
                return (
                    <UserManagementSection
                        usersData={platformUsersData}
                        onSaveUser={handleSaveUserCallback}
                        onDeleteUser={handleDeleteUserCallback}
                    />
                );

            case 'payment-gateways': return (
                <PaymentGatewaySettings
                    onManageSettings={() => console.log('Managing Payment Settings (Future)')}
                    onAddGateway={() => console.log('Adding New Payment Gateway (Future)')}
                />
            );
            case 'shipping-tax': return (
                <ShippingTaxSettings
                    onManageShipping={() => console.log('Managing Shipping Settings (Future)')}
                    onManageTaxes={() => console.log('Managing Tax Settings (Future)')}
                />
            );
            case 'branding': return (
                <BrandingSettings
                    onUploadLogo={() => console.log('Uploading Logo (Future)')}
                    onCustomizeColors={() => console.log('Customizing Colors (Future)')}
                />
            );
            default: // Fallback, e.g., if activeSettingSection somehow gets a bad value
                return (
                    <p style={{textAlign: 'center', color: '#999', padding: '50px'}}>Select a settings option from the sidebar.</p>
                );
        }
    };


    return (
        <SettingsOverviewContainer>
            <SettingsHeader>
                <HeaderTitle>
                    {activeSettingSection === 'general' ? 'General Settings' : // Default for /admin/settings/general
                     activeSettingSection === 'users' ? 'User Management' :    // Default for /admin/settings/users
                     activeSettingSection === 'payment-gateways' ? 'Payment Gateway' :
                     activeSettingSection === 'shipping-tax' ? 'Shipping & Tax' :
                     activeSettingSection === 'branding' ? 'Branding & Customization' :
                     'Platform Settings'} {/* Main title, e.g., if path is /admin/settings directly */}
                </HeaderTitle>

            </SettingsHeader>

            {/* This is the content area for SettingsOverview, showing the active section */}
            {renderActiveSectionContent()}
        </SettingsOverviewContainer>
    );
};

export default SettingsOverview;