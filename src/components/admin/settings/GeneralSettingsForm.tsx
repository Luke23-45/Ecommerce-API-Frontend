// src/components/Admin/Settings/GeneralSettingsForm.tsx
import React, { useState, useCallback, useEffect } from 'react';
import { FaInfoCircle, FaEnvelope, FaPhone, FaDollarSign, FaClock, FaUserPlus, FaBox, FaSyncAlt,FaCheckCircle } from 'react-icons/fa';


import FormSectionWrapper from '../common/FormSectionWrapper/FormSectionWrapper';
import { AdminInput } from '../Dashboard/Common/Common.styles';
import AdminSelect from '../common/AdminSelect/AdminSelect';
import AdminTextArea from '../common/AdminTextArea/AdminTextArea';
import { AdminButton } from '../Dashboard/Common/Common.styles';
import { type GeneralSettings } from '@/types/settings';
import { FieldGroup } from '../common/FormSectionWrapper/FormSectionWrapper';
import { FormField } from '@/components/auth/AuthForms';
import { MultiFieldRow } from '../common/FormSectionWrapper/FormSectionWrapper';
import { FormLabel } from '../common/FormSectionWrapper/FormSectionWrapper';


const initialGeneralSettings: GeneralSettings = {
    platformName: 'Élan Homewares Marketplace',
    contactEmail: 'support@elanhomewares.com',
    contactPhone: '+1-800-ELAN-HOME',
    defaultCurrency: 'USD',
    defaultTimezone: 'America/New_York',
    allowCustomerRegistrations: true,
    requireProductApproval: true,
    lowStockThreshold: 10,
};

// Mock options for select fields
const currencyOptions = [
    { value: 'USD', label: 'USD - United States Dollar' },
    { value: 'EUR', label: 'EUR - Euro' },
    { value: 'GBP', label: 'GBP - British Pound' },
    { value: 'CAD', label: 'CAD - Canadian Dollar' },
];

const timezoneOptions = [
    { value: 'America/New_York', label: 'Eastern (UTC-05:00)' },
    { value: 'America/Chicago', label: 'Central (UTC-06:00)' },
    { value: 'America/Denver', label: 'Mountain (UTC-07:00)' },
    { value: 'America/Los_Angeles', label: 'Pacific (UTC-08:00)' },
];


interface GeneralSettingsFormProps {
    settingsData: GeneralSettings; // Current settings from parent (for a real app, fetched)
    onSave: (updatedSettings: GeneralSettings) => void;
}

const GeneralSettingsForm: React.FC<GeneralSettingsFormProps> = ({ settingsData, onSave }) => {
    const [settings, setSettings] = useState<GeneralSettings>(settingsData);

    // Sync internal state with prop if settingsData changes
    useEffect(() => {
        setSettings(settingsData);
    }, [settingsData]);

    const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type, checked } = e.target;
        setSettings(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : (type === 'number' ? parseInt(value) || 0 : value)
        }));
    }, []);

    const handleSubmit = useCallback((e: React.FormEvent) => {
        e.preventDefault();
        console.log("Saving General Settings:", settings);
        onSave(settings); 
        alert('General settings saved! (See console for mock API call)');
    }, [settings, onSave]);

    return (
        <FormSectionWrapper title="General Platform Settings">
            <form onSubmit={handleSubmit} style={{display: 'contents'}}> {/* Form acts as a wrapper */}
                <FieldGroup>
                    <FormLabel htmlFor="platformName">Platform Name</FormLabel>
                    <AdminInput type="text" id="platformName" name="platformName" value={settings.platformName} onChange={handleChange} required />
                </FieldGroup>
                <FieldGroup>
                    <FormLabel htmlFor="contactEmail">Contact Email <FaEnvelope /></FormLabel>
                    <AdminInput type="email" id="contactEmail" name="contactEmail" value={settings.contactEmail} onChange={handleChange} required />
                </FieldGroup>
                <FieldGroup>
                    <FormLabel htmlFor="contactPhone">Contact Phone <FaPhone /></FormLabel>
                    <AdminInput type="text" id="contactPhone" name="contactPhone" value={settings.contactPhone || ''} onChange={handleChange} placeholder="e.g., +1 (800) 123-4567" />
                </FieldGroup>

                <MultiFieldRow>
                    <FieldGroup>
                        <FormLabel htmlFor="defaultCurrency">Default Currency <FaDollarSign /></FormLabel>
                        <AdminSelect id="defaultCurrency" name="defaultCurrency" value={settings.defaultCurrency} onChange={handleChange} options={currencyOptions} />
                    </FieldGroup>
                    <FieldGroup>
                        <FormLabel htmlFor="defaultTimezone">Default Timezone <FaClock /></FormLabel>
                        <AdminSelect id="defaultTimezone" name="defaultTimezone" value={settings.defaultTimezone} onChange={handleChange} options={timezoneOptions} />
                    </FieldGroup>
                </MultiFieldRow>

                <MultiFieldRow>
                    <FieldGroup>
                        <FormLabel htmlFor="lowStockThreshold">Low Stock Threshold <FaBox /></FormLabel>
                        <AdminInput type="number" id="lowStockThreshold" name="lowStockThreshold" value={settings.lowStockThreshold} onChange={handleChange} min="0" />
                    </FieldGroup>
                </MultiFieldRow>

                <MultiFieldRow>
                    <FieldGroup>
                        <FormLabel htmlFor="allowCustomerRegistrations">Allow Customer Registrations <FaUserPlus /></FormLabel>
                        <input type="checkbox" id="allowCustomerRegistrations" name="allowCustomerRegistrations" checked={settings.allowCustomerRegistrations} onChange={handleChange} style={{transform: 'scale(1.2)', alignSelf: 'flex-start'}} />
                    </FieldGroup>
                    <FieldGroup>
                        <FormLabel htmlFor="requireProductApproval">Require Product Approval <FaCheckCircle /></FormLabel>
                        <input type="checkbox" id="requireProductApproval" name="requireProductApproval" checked={settings.requireProductApproval} onChange={handleChange} style={{transform: 'scale(1.2)', alignSelf: 'flex-start'}} />
                    </FieldGroup>
                </MultiFieldRow>

                <FieldGroup $fullWidth style={{marginTop: '20px'}}> {/* Push save button */}
                    <AdminButton type="submit" $variant="primary">
                        Save General Settings
                    </AdminButton>
                </FieldGroup>
            </form>
        </FormSectionWrapper>
    );
};

export default GeneralSettingsForm;