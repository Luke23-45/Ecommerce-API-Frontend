// src/components/Admin/Settings/Taxes/TaxRateForm.tsx
import React, { useState, useEffect,type FormEvent, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTheme, type DefaultTheme } from 'styled-components';
import Select, { type SingleValue, type MultiValue } from 'react-select'; // For Country/State/Category selects
import { Country, State, City, type ICountry, type IState, type ICity } from 'country-state-city';
import {
  FaArrowLeft,
  FaCheckCircle,
  FaBan,
  FaExclamationTriangle,
  FaSpinner,
  FaPercent,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaListAlt,
  FaToggleOn,
  FaInfoCircle,
} from 'react-icons/fa';

import {
  TaxRateFormContainer,
  FormHeader,
  FormTitle,
  ActualForm,
  FormStickyActionBar,
  FormAlert,
  FieldHelperText,
  ReactSelectStyles, // Custom styles for react-select
} from './TaxRateForm.styles';

// Common Components
import { AdminInput, AdminButton } from '../../../Dashboard/Common/Common.styles'; // Adjust path
import AdminTextArea from '../../../common/AdminTextArea/AdminTextArea'; // Adjust path
import AdminSelectNative, { type SelectOption as NativeSelectOption } from '../../../common/AdminSelect/AdminSelect'; // For simple selects
import FormSectionWrapper, {
  FieldGroup,
  FormLabel,
  MultiFieldRow,
} from '../../../common/FormSectionWrapper/FormSectionWrapper'; 

import LoadingSpinner from '@/components/common/LoadingSpinner/LoadingSpinner';

// Hooks and Types
import {
  useGetTaxRateById,
  useCreateTaxRate,
  useUpdateTaxRate,
} from '@/hooks/admin/checkoutsession/useTaxRate'; // Adjust path
import { useGetPaginatedCategories } from '@/hooks/admin/product/useCategory'; // For applicable categories

import {
  type ITaxRateFormState,
  type ITaxRateCreatePayload,
  type ITaxRateUpdatePayload,
  type ITaxRateResponse,
  TaxCalculationTypeFrontend,
  TaxApplicabilityFrontend,
} from '@/types/tax.types'; // Adjust path
import { type ICategoryResponse } from '@/types/category'; // Adjust path
import { useNotification } from '@/contexts/NotificationContext'; // Adjust path
import { type RootState } from '@/store'; // For createdBy/updatedBy from user
import { useSelector } from 'react-redux';
import { Types } from 'mongoose'; // For creating ObjectId for user if needed

// SelectOption type for react-select
interface ReactSelectOption {
  value: string;
  label: string;
}

const initialTaxRateFormState: Omit<ITaxRateFormState, 'id'> = {
  name: '',
  description: '',
  country: '', // Store country code
  state: '',   // Store state code
  city: '',
  zipCode: '',
  rate: '',    // Store as string
  calculationType: TaxCalculationTypeFrontend.PERCENTAGE,
  applicability: TaxApplicabilityFrontend.ALL_PRODUCTS,
  startDate: new Date().toISOString().split('T')[0], // Default to today
  endDate: '', // Optional
  applicableCategoryIds: [],
  isActive: true,
};

const TaxRateForm: React.FC = () => {
  const navigate = useNavigate();
  const { taxRateId } = useParams<{ taxRateId?: string }>();
  const isEditMode = !!taxRateId;

  const theme = useTheme() as DefaultTheme;
  const { showNotification } = useNotification();
  const { user } = useSelector((state: RootState) => state.auth);

  const [formData, setFormData] = useState<ITaxRateFormState>(initialTaxRateFormState);
  const [serverError, setServerError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  // Options for react-select
  const [countryOptions, setCountryOptions] = useState<ReactSelectOption[]>([]);
  const [stateOptions, setStateOptions] = useState<ReactSelectOption[]>([]);
  const [categoryOptionsForSelect, setCategoryOptionsForSelect] = useState<ReactSelectOption[]>([]);


  // --- DATA FETCHING ---
  const {
    data: existingTaxRate,
    isLoading: isLoadingTaxRate,
    isError: isFetchError,
    error: fetchErrorData,
  } = useGetTaxRateById(taxRateId, undefined, undefined, { enabled: isEditMode && !!taxRateId });

  const { data: categoriesData, isLoading: isLoadingCategories } = useGetPaginatedCategories(
    { limit: 1000, sort: JSON.stringify({ name: 1 }), projection: "id name _id" }, // Fetch IDs and names
    { staleTime: 5 * 60 * 1000 }
  );

  // --- MUTATIONS ---
  const createTaxRateMutation = useCreateTaxRate({
    onSuccess: (response) => {
      showNotification(`Tax Rate "${response.data.name}" created successfully!`, 'success');
      navigate('/admin/checkoutsession/tax/list'); // Adjust to your tax list route
    },
    onError: (error: any) => { /* ... (same error handling as ProductForm) ... */ setServerError(error.message); if(error.data?.errors) setFieldErrors(error.data.errors); },
  });
  const updateTaxRateMutation = useUpdateTaxRate({
    onSuccess: (response) => { /* ... (similar to create) ... */ showNotification(`Tax Rate "${response.data.name}" updated.`, 'success');   navigate('/admin/checkoutsession/tax/list'); },
    onError: (error: any) => { /* ... (similar to create) ... */ setServerError(error.message); if(error.data?.errors) setFieldErrors(error.data.errors); },
  });


  // --- EFFECTS ---
  // Populate Country dropdown
  useEffect(() => {
    const countries = Country.getAllCountries().map((country: ICountry) => ({
      value: country.isoCode,
      label: country.name,
    }));
    setCountryOptions(countries);
  }, []);

  // Populate State dropdown when country changes
  useEffect(() => {
    if (formData.country) {
      const states = State.getStatesOfCountry(formData.country).map((state: IState) => ({
        value: state.isoCode,
        label: state.name,
      }));
      setStateOptions(states);
      if (!isEditMode || (existingTaxRate && existingTaxRate.country !== formData.country)) {
        // If country changed or new form, reset state if it's no longer valid for the new country
        if (states.length > 0 && !states.find(s => s.value === formData.state)) {
            setFormData(prev => ({ ...prev, state: '' })); // Reset state if not in new list
        } else if (states.length === 0) {
            setFormData(prev => ({ ...prev, state: '' }));
        }
      }
    } else {
      setStateOptions([]);
      setFormData(prev => ({ ...prev, state: '' })); // Clear state if no country
    }
  }, [formData.country, isEditMode, existingTaxRate]); // Add existingTaxRate to deps for initial load check

  // Populate form data in edit mode
  useEffect(() => {
    if (isEditMode && existingTaxRate) {
      setFormData({
        id: existingTaxRate.id,
        name: existingTaxRate.name || '',
        description: existingTaxRate.description || '',
        country: existingTaxRate.country || '',
        state: existingTaxRate.state || '',
        city: existingTaxRate.city || '',
        zipCode: existingTaxRate.zipCode || '',
        rate: existingTaxRate.rate?.toString() || '',
        calculationType: existingTaxRate.calculationType || TaxCalculationTypeFrontend.PERCENTAGE,
        applicability: existingTaxRate.applicability || TaxApplicabilityFrontend.ALL_PRODUCTS,
        startDate: existingTaxRate.startDate ? new Date(existingTaxRate.startDate).toISOString().split('T')[0] : '',
        endDate: existingTaxRate.endDate ? new Date(existingTaxRate.endDate).toISOString().split('T')[0] : '',
        applicableCategoryIds: existingTaxRate.applicableCategoryIds || [],
        isActive: existingTaxRate.isActive === undefined ? true : existingTaxRate.isActive,
      });
    } else if (!isEditMode) {
      setFormData(initialTaxRateFormState);
    }
  }, [isEditMode, existingTaxRate]);

  // Populate category multiselect options
  useEffect(() => {
    if (categoriesData?.data) {
      const options = categoriesData.data.map(cat => ({
        value: cat.id || cat._id as string,
        label: cat.name, // Can add indentation here if categories are hierarchical
      }));
      setCategoryOptionsForSelect(options);
    }
  }, [categoriesData]);


  // --- HANDLERS ---
  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const isCheckbox = type === 'checkbox';
    const finalValue = isCheckbox ? (e.target as HTMLInputElement).checked : value;
    setFormData(prev => ({ ...prev, [name]: finalValue }));
    if (fieldErrors[name]) setFieldErrors(prev => ({ ...prev, [name]: '' }));
    setServerError(null);
  }, [fieldErrors]);

  const handleReactSelectChange = useCallback((name: keyof ITaxRateFormState, selectedOption: SingleValue<ReactSelectOption> | MultiValue<ReactSelectOption>) => {
    let valueToSet: string | string[] | null | undefined;
    if (Array.isArray(selectedOption)) { // Multi-select
      valueToSet = selectedOption.map(opt => opt.value);
    } else if (selectedOption) { // Single select
      valueToSet = selectedOption.value;
    } else { // Cleared single select
      valueToSet = ''; // or null depending on field's optionality
    }
    setFormData(prev => ({ ...prev, [name]: valueToSet }));
    if (fieldErrors[name]) setFieldErrors(prev => ({ ...prev, [name]: '' }));
    setServerError(null);
  }, [fieldErrors]);


  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setServerError(null);
    setFieldErrors({});
    let currentFieldErrorsLocal: Record<string, string> = {};

    if (!formData.name.trim()) currentFieldErrorsLocal.name = "Tax rate name is required.";
    if (!formData.country) currentFieldErrorsLocal.country = "Country is required.";
    const rateNum = parseFloat(formData.rate.replace(',', '.'));
    if (isNaN(rateNum) || rateNum < 0) currentFieldErrorsLocal.rate = "Rate must be a non-negative number.";
    if (!formData.startDate) currentFieldErrorsLocal.startDate = "Start date is required.";
    // Add more validations as per your backend validator

    if (Object.keys(currentFieldErrorsLocal).length > 0) {
        setFieldErrors(currentFieldErrorsLocal);
        showNotification("Please correct the form errors.", "warning");
        return;
    }

    if (!user?._id) {
      setServerError("Authentication error. Cannot save tax rate.");
      showNotification("Authentication error.", "error");
      return;
    }

    const payload: Partial<ITaxRateCreatePayload | ITaxRateUpdatePayload> = {
      ...formData,
      rate: parseFloat(formData.rate.replace(',', '.')), // Convert to number
      description: formData.description || null, // Send null if empty for backend
      state: formData.state || null,
      city: formData.city || null,
      zipCode: formData.zipCode || null,
      endDate: formData.endDate || null,
      applicableCategoryIds: formData.applicability === TaxApplicabilityFrontend.SPECIFIC_CATEGORIES && formData.applicableCategoryIds.length > 0
                             ? formData.applicableCategoryIds
                             : null, // Send null if not applicable or empty
    };

    if (isEditMode && taxRateId) {
      updateTaxRateMutation.mutate({ taxRateId, payload: payload as ITaxRateUpdatePayload });
    } else {
      createTaxRateMutation.mutate(payload as ITaxRateCreatePayload);
    }
  };

  const handleCancel = () => {
    navigate('/admin/checkoutsession/tax/list');
  };

  const isMutating = createTaxRateMutation.isPending || updateTaxRateMutation.isPending;
  const isLoadingPage = (isEditMode && isLoadingTaxRate) || isLoadingCategories;

  // --- RENDER LOGIC ---
  if (isLoadingPage && (!existingTaxRate && isEditMode)) {
    return <div style={{display:'flex', justifyContent:'center', padding: '50px'}}><LoadingSpinner message="Loading tax rate details..." /></div>;
  }
  if (isFetchError && isEditMode) {
    return (
      <TaxRateFormContainer>
        <FormAlert $type="error"><FaExclamationTriangle /> Error loading tax rate: {(fetchErrorData as any)?.message}</FormAlert>
        <AdminButton $variant="secondary" onClick={handleCancel}><FaArrowLeft /> Back to List</AdminButton>
      </TaxRateFormContainer>
    );
  }

  const customReactSelectStyles = ReactSelectStyles(theme);

  return (
    <TaxRateFormContainer>
      <FormHeader>
        <FormTitle>{isEditMode ? `Edit Tax Rate: ${formData.name || 'Loading...'}` : 'Create New Tax Rate'}</FormTitle>
        <AdminButton $variant="secondary" onClick={handleCancel} disabled={isMutating}>
            <FaArrowLeft style={{ marginRight: theme.spacing(1.5) }}/> Cancel & Back to List
        </AdminButton>
      </FormHeader>

      {serverError && <FormAlert $type="error"><FaExclamationTriangle /> {serverError}</FormAlert>}

      <ActualForm onSubmit={handleSubmit}>
        <FormSectionWrapper title="Basic Information" icon={<FaInfoCircle />}>
          <FieldGroup>
            <FormLabel htmlFor="name">Tax Rate Name*</FormLabel>
            <AdminInput type="text" id="name" name="name" value={formData.name} onChange={handleChange} required disabled={isMutating} />
            {fieldErrors.name && <FieldHelperText style={{color: theme.colors.adminStatusError}}>{fieldErrors.name}</FieldHelperText>}
          </FieldGroup>
          <FieldGroup>
            <FormLabel htmlFor="description">Description (Optional)</FormLabel>
            <AdminTextArea id="description" name="description" value={formData.description || ''} onChange={handleChange} rows={3} disabled={isMutating} />
          </FieldGroup>
        </FormSectionWrapper>

        <FormSectionWrapper title="Geographical Targeting" icon={<FaMapMarkerAlt />}>
          <MultiFieldRow>
            <FieldGroup style={{flex: 2}}>
              <FormLabel htmlFor="country">Country*</FormLabel>
              <Select<ReactSelectOption>
                id="country" name="country" styles={customReactSelectStyles}
                options={countryOptions}
                value={countryOptions.find(c => c.value === formData.country) || null}
                onChange={(option) => handleReactSelectChange('country', option)}
                placeholder="Select Country..." required isDisabled={isMutating}
              />
              {fieldErrors.country && <FieldHelperText style={{color: theme.colors.adminStatusError}}>{fieldErrors.country}</FieldHelperText>}
            </FieldGroup>
            <FieldGroup style={{flex: 2}}>
              <FormLabel htmlFor="state">State/Province (Optional)</FormLabel>
              <Select<ReactSelectOption>
                id="state" name="state" styles={customReactSelectStyles}
                options={stateOptions}
                value={stateOptions.find(s => s.value === formData.state) || null}
                onChange={(option) => handleReactSelectChange('state', option)}
                placeholder="Select State/Province..." isDisabled={isMutating || !formData.country || stateOptions.length === 0}
                noOptionsMessage={() => formData.country ? "No states for selected country" : "Select a country first"}
              />
            </FieldGroup>
          </MultiFieldRow>
          <MultiFieldRow>
            <FieldGroup>
              <FormLabel htmlFor="city">City (Optional)</FormLabel>
              <AdminInput type="text" id="city" name="city" value={formData.city || ''} onChange={handleChange} disabled={isMutating} />
            </FieldGroup>
            <FieldGroup>
              <FormLabel htmlFor="zipCode">Zip/Postal Code (Optional)</FormLabel>
              <AdminInput type="text" id="zipCode" name="zipCode" value={formData.zipCode || ''} onChange={handleChange} placeholder="e.g., 90210 or 9*" disabled={isMutating} />
              <FieldHelperText>Enter a specific code or a prefix with '*' (e.g., 90*).</FieldHelperText>
            </FieldGroup>
          </MultiFieldRow>
        </FormSectionWrapper>

        <FormSectionWrapper title="Rate & Calculation" icon={<FaPercent />}>
          <MultiFieldRow>
            <FieldGroup>
              <FormLabel htmlFor="rate">Rate*</FormLabel>
              <AdminInput type="text" id="rate" name="rate" value={formData.rate} onChange={handleChange} required pattern="^\d*([.,]\d{0,4})?$" placeholder="e.g., 7.25" disabled={isMutating} />
              {fieldErrors.rate && <FieldHelperText style={{color: theme.colors.adminStatusError}}>{fieldErrors.rate}</FieldHelperText>}
            </FieldGroup>
            <FieldGroup>
              <FormLabel htmlFor="calculationType">Calculation Type*</FormLabel>
              <AdminSelectNative id="calculationType" name="calculationType" value={formData.calculationType} onChange={handleChange} required disabled={isMutating}
                options={[
                  { value: TaxCalculationTypeFrontend.PERCENTAGE, label: 'Percentage (%)' },
                  { value: TaxCalculationTypeFrontend.FIXED_AMOUNT, label: 'Fixed Amount' },
                ]}
              />
            </FieldGroup>
          </MultiFieldRow>
           <FieldGroup>
              <FormLabel htmlFor="applicability">Applicability*</FormLabel>
              <AdminSelectNative id="applicability" name="applicability" value={formData.applicability} onChange={handleChange} required disabled={isMutating}
                options={[
                  { value: TaxApplicabilityFrontend.ALL_PRODUCTS, label: 'All Products / Order Total' },
                  { value: TaxApplicabilityFrontend.SPECIFIC_CATEGORIES, label: 'Specific Product Categories' },
                ]}
              />
            </FieldGroup>
            {formData.applicability === TaxApplicabilityFrontend.SPECIFIC_CATEGORIES && (
              <FieldGroup>
                <FormLabel htmlFor="applicableCategoryIds">Applicable Categories</FormLabel>
                 <Select<ReactSelectOption, true> // `true` for isMulti
                    isMulti
                    id="applicableCategoryIds" name="applicableCategoryIds" styles={customReactSelectStyles}
                    options={categoryOptionsForSelect}
                    value={categoryOptionsForSelect.filter(opt => formData.applicableCategoryIds.includes(opt.value))}
                    onChange={(options) => handleReactSelectChange('applicableCategoryIds', options)}
                    placeholder="Select categories..."
                    isDisabled={isMutating || isLoadingCategories}
                    isLoading={isLoadingCategories}
                    closeMenuOnSelect={false}
                />
                {fieldErrors.applicableCategoryIds && <FieldHelperText style={{color: theme.colors.adminStatusError}}>{fieldErrors.applicableCategoryIds}</FieldHelperText>}
              </FieldGroup>
            )}
        </FormSectionWrapper>

        <FormSectionWrapper title="Duration & Status" icon={<FaCalendarAlt />}>
            <MultiFieldRow>
                <FieldGroup>
                    <FormLabel htmlFor="startDate">Start Date*</FormLabel>
                    <AdminInput type="date" id="startDate" name="startDate" value={formData.startDate} onChange={handleChange} required disabled={isMutating} />
                    {fieldErrors.startDate && <FieldHelperText style={{color: theme.colors.adminStatusError}}>{fieldErrors.startDate}</FieldHelperText>}
                </FieldGroup>
                <FieldGroup>
                    <FormLabel htmlFor="endDate">End Date (Optional)</FormLabel>
                    <AdminInput type="date" id="endDate" name="endDate" value={formData.endDate || ''} onChange={handleChange} min={formData.startDate} disabled={isMutating} />
                    <FieldHelperText>Leave blank if the tax rate does not expire.</FieldHelperText>
                </FieldGroup>
            </MultiFieldRow>
            <FieldGroup>
                <div style={{ display: 'flex', alignItems: 'center', gap: theme.spacing(2)}}>
                    <input type="checkbox" id="isActive" name="isActive" checked={formData.isActive} onChange={handleChange} disabled={isMutating} style={{transform: 'scale(1.3)'}}/>
                    <FormLabel htmlFor="isActive" style={{ textTransform: 'none', marginBottom: '0', cursor: 'pointer' }}><FaToggleOn /> Active</FormLabel>
                </div>
                <FieldHelperText>Inactive tax rates will not be applied.</FieldHelperText>
            </FieldGroup>
        </FormSectionWrapper>

        <FormStickyActionBar>
            <AdminButton type="button" $variant="secondary" onClick={handleCancel} disabled={isMutating}>
                <FaBan /> Cancel
            </AdminButton>
            <AdminButton type="submit" $variant="primary" disabled={isMutating}>
                {isMutating ? <LoadingSpinner size="1em" color="#FFF" thickness="2px" inline={true}/> : <FaCheckCircle />}
                {isEditMode ? 'Save Changes' : 'Create Tax Rate'}
            </AdminButton>
        </FormStickyActionBar>
      </ActualForm>
    </TaxRateFormContainer>
  );
};

export default TaxRateForm;