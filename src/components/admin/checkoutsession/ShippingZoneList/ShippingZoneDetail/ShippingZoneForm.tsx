// src/components/Admin/Settings/Shipping/ShippingZoneForm.tsx

import React, { useState, useEffect, type FormEvent, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useTheme, type DefaultTheme } from "styled-components";
import Select, { type MultiValue } from "react-select";
import { Country, State, type ICountry, type IState } from "country-state-city";
import {
  FaArrowLeft,
  FaCheckCircle,
  FaBan,
  FaExclamationTriangle,
  FaSpinner,
  FaGlobeAmericas,
  FaMapMarkedAlt,
  FaToggleOn,
  FaToggleOff,
} from "react-icons/fa";

import {
  ZoneFormContainer,
  FormHeader,
  FormTitle,
  ActualForm,
  FormStickyActionBar,
  FormAlert,
  FieldHelperText,
} from "./ShippingZoneForm.styles";
import { ReactSelectStyles } from "../../Tax/TaxDetail/TaxRateForm.styles";
import {
  AdminInput,
  AdminButton,
} from "../../../Dashboard/Common/Common.styles";
import AdminTextArea from "../../../common/AdminTextArea/AdminTextArea";
import FormSectionWrapper, {
  FieldGroup,
  FormLabel,
} from "../../../common/FormSectionWrapper/FormSectionWrapper";
import LoadingSpinner from "@/components/common/LoadingSpinner/LoadingSpinner";

import {
  useGetShippingZoneById,
  useCreateShippingZone,
  useUpdateShippingZone,
} from "@/hooks/admin/checkoutsession/useShipping";
import {
  type IShippingZoneCreatePayload,
  type IShippingZoneUpdatePayload,
  type ICountrySelectOption,
  type IStateSelectOption,
} from "@/types/shipping.types";
import { useNotification } from "@/contexts/NotificationContext";
import { type RootState } from "@/store";
import { useSelector } from "react-redux";

const initialZoneFormState: IShippingZoneCreatePayload = {
  name: "",
  description: "",
  countries: [],
  states: [],
  isActive: true,
};

const ShippingZoneForm: React.FC = () => {
  const navigate = useNavigate();
  const { zoneId } = useParams<{ zoneId?: string }>();
  const isEditMode = !!zoneId;

  const theme = useTheme() as DefaultTheme;
  const { showNotification } = useNotification();
  const { user } = useSelector((state: RootState) => state.auth);

  const [formData, setFormData] =
    useState<IShippingZoneCreatePayload>(initialZoneFormState);
  const [serverError, setServerError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const [allCountryOptions, setAllCountryOptions] = useState<
    ICountrySelectOption[]
  >([]);
  const [availableStateOptions, setAvailableStateOptions] = useState<
    IStateSelectOption[]
  >([]);

  // Custom styles for react-select, can be moved to styles file if needed
  const customReactSelectStyles = ReactSelectStyles(theme);

  // --- DATA FETCHING ---
  const {
    data: existingZone, // The API hook directly returns the zone object
    isLoading: isLoadingZone,
    isError: isFetchZoneError,
    error: fetchZoneError,
    refetch
  } = useGetShippingZoneById(zoneId, { enabled: isEditMode });

  // --- EFFECTS ---
  // 1. Load all countries for the selector on initial component mount.
  useEffect(() => {
    const countries = Country.getAllCountries().map((country: ICountry) => ({
      value: country.isoCode,
      label: country.name,
    }));
    setAllCountryOptions(countries);
  }, []);

  // 2. Populate the form with existing data when in edit mode.
  useEffect(() => {
    if (isEditMode && existingZone) {
      setFormData({
        name: existingZone.name || "",
        description: existingZone.description || "",
        countries: existingZone.countries || [],
        states: existingZone.states || [],
        isActive: existingZone.isActive,
      });
    }
  }, [isEditMode, existingZone]);

  // 3. Update the available state/province options whenever the selected countries change.
  useEffect(() => {
    if (formData.countries.length > 0) {
      let statesForSelectedCountries: IStateSelectOption[] = [];
      formData.countries.forEach((countryCode) => {
        const states = State.getStatesOfCountry(countryCode).map(
          (state: IState) => ({
            value: state.isoCode,
            label: `${state.name} (${state.countryCode})`, // Add country code for clarity
            countryCode: state.countryCode,
          })
        );
        statesForSelectedCountries.push(...states);
      });
      setAvailableStateOptions(
        statesForSelectedCountries.sort((a, b) =>
          a.label.localeCompare(b.label)
        )
      );
    } else {
      setAvailableStateOptions([]); // Clear if no countries are selected
    }
  }, [formData.countries]);

  // --- MUTATIONS ---
  const createZoneMutation = useCreateShippingZone({
    onSuccess: (response) => {
      showNotification(
        `Shipping Zone "${response.name}" created successfully!`,
        "success"
      );
      navigate("/admin/checkoutsession/shippingzones/list");
    },
    onError: (error: any) => {
      const message = error.message || "Failed to create shipping zone.";
      setServerError(message);
      if (error.data?.errors) setFieldErrors(error.data.errors);
    },
  });

  const updateZoneMutation = useUpdateShippingZone({
    onSuccess: (response) => {
      showNotification(
        `Shipping Zone "${response.name}" updated successfully!`,
        "success"
      );
      navigate("/admin/checkoutsession/shippingzones/list");
    },
    onError: (error: any) => {
      const message = error.message || "Failed to update shipping zone.";
      setServerError(message);
      if (error.data?.errors) setFieldErrors(error.data.errors);
    },
  });

  // --- HANDLERS ---
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value, type } = e.target;
      const finalValue =
        type === "checkbox" ? (e.target as HTMLInputElement).checked : value;

      setFormData((prev) => ({ ...prev, [name]: finalValue }));
      if (fieldErrors[name])
        setFieldErrors((prev) => ({ ...prev, [name]: "" }));
      setServerError(null);
    },
    [fieldErrors]
  );

  const handleCountryChange = useCallback(
    (selectedOptions: MultiValue<ICountrySelectOption>) => {
      const countryCodes = selectedOptions
        ? selectedOptions.map((option) => option.value)
        : [];
      // When countries change, reset the states as they may no longer be valid.
      setFormData((prev) => ({ ...prev, countries: countryCodes, states: [] }));
      if (fieldErrors.countries)
        setFieldErrors((prev) => ({ ...prev, countries: "" }));
      setServerError(null);
    },
    [fieldErrors]
  );

  const handleStateChange = useCallback(
    (selectedOptions: MultiValue<IStateSelectOption>) => {
      const stateValues = selectedOptions
        ? selectedOptions.map((option) => option.value)
        : [];
      setFormData((prev) => ({ ...prev, states: stateValues }));
    },
    []
  );

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setServerError(null);
    setFieldErrors({});

    if (!formData.name.trim()) {
      setFieldErrors({ name: "Zone Name is required." });
      return;
    }
    if (formData.countries.length === 0) {
      setFieldErrors({ countries: "At least one country must be selected." });
      return;
    }

    if (!user?._id) {
      setServerError("User authentication error. Cannot save zone.");
      return;
    }

    // The payload is already in the correct shape in `formData`
    if (isEditMode && zoneId) {
      updateZoneMutation.mutate({
        zoneId,
        payload: formData as IShippingZoneUpdatePayload,
      });
    } else {
      createZoneMutation.mutate(formData as IShippingZoneCreatePayload);
    }
  };

  const handleCancel = () => {
    navigate("/admin/checkoutsession/shippingzones/list");
  };

  const isMutating =
    createZoneMutation.isPending || updateZoneMutation.isPending;

  // --- RENDER LOGIC ---
  if (isLoadingZone && isEditMode) {
    return (
      <div
        style={{ display: "flex", justifyContent: "center", padding: "50px" }}
      >
        <LoadingSpinner message="Loading shipping zone..." />
      </div>
    );
  }
  if (isFetchZoneError && isEditMode) {
    return (
      <ZoneFormContainer>
        <FormAlert $type="error">
          <FaExclamationTriangle /> Error: {(fetchZoneError as any)?.message}
        </FormAlert>
        <AdminButton $variant="secondary" onClick={handleCancel}>
          <FaArrowLeft /> Back to List
        </AdminButton>
      </ZoneFormContainer>
    );
  }

  return (
    <ZoneFormContainer>
      <FormHeader>
        <FormTitle>
          {isEditMode
            ? `Edit Shipping Zone: ${existingZone?.name || ""}`
            : "Create New Shipping Zone"}
        </FormTitle>
        <AdminButton
          $variant="secondary"
          onClick={handleCancel}
          disabled={isMutating}
        >
          <FaArrowLeft style={{ marginRight: theme.spacing(1.5) }} /> Back to
          Zones
        </AdminButton>
      </FormHeader>

      {serverError && (
        <FormAlert $type="error">
          <FaExclamationTriangle /> {serverError}
        </FormAlert>
      )}

      <ActualForm onSubmit={handleSubmit}>
        <FormSectionWrapper title="Zone Details" icon={<FaMapMarkedAlt />}>
          <FieldGroup>
            <FormLabel htmlFor="name">Zone Name*</FormLabel>
            <AdminInput
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              disabled={isMutating}
            />
            {fieldErrors.name && (
              <FieldHelperText $error>{fieldErrors.name}</FieldHelperText>
            )}
            <FieldHelperText>
              A descriptive name (e.g., "Domestic US", "Europe Zone 1").
            </FieldHelperText>
          </FieldGroup>
          <FieldGroup>
            <FormLabel htmlFor="description">Description (Optional)</FormLabel>
            <AdminTextArea
              id="description"
              name="description"
              value={formData.description || ""}
              onChange={handleChange}
              rows={3}
              disabled={isMutating}
            />
            <FieldHelperText>Internal notes for this zone.</FieldHelperText>
          </FieldGroup>
          <FieldGroup>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: theme.spacing(2),
                marginTop: theme.spacing(2),
              }}
            >
              <input
                type="checkbox"
                id="isActive"
                name="isActive"
                checked={formData.isActive}
                onChange={handleChange}
                disabled={isMutating}
                style={{ transform: "scale(1.3)", cursor: "pointer" }}
              />
              <FormLabel
                htmlFor="isActive"
                style={{
                  textTransform: "none",
                  marginBottom: "0",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: theme.spacing(1),
                }}
              >
                {formData.isActive ? (
                  <FaToggleOn
                    style={{ color: theme.colors.adminStatusSuccess }}
                  />
                ) : (
                  <FaToggleOff />
                )}
                Zone is Active
              </FormLabel>
            </div>
            <FieldHelperText>
              Inactive zones and their rates will not be available at checkout.
            </FieldHelperText>
          </FieldGroup>
        </FormSectionWrapper>

        <div style={{ marginBottom: "10rem" }}>
          <FormSectionWrapper
            title="Geographical Coverage"
            icon={<FaGlobeAmericas />}
          >
            <FieldGroup>
              <FormLabel htmlFor="countries">Countries*</FormLabel>
              <Select<ICountrySelectOption, true>
                id="countries"
                name="countries"
                options={allCountryOptions}
                isMulti
                value={allCountryOptions.filter((opt) =>
                  formData.countries.includes(opt.value)
                )}
                onChange={handleCountryChange}
                placeholder="Select countries..."
                closeMenuOnSelect={false}
                isDisabled={isMutating}
                styles={customReactSelectStyles}
              />
              {fieldErrors.countries && (
                <FieldHelperText $error>
                  {fieldErrors.countries}
                </FieldHelperText>
              )}
            </FieldGroup>

            {formData.countries.length > 0 &&
              availableStateOptions.length > 0 && (
                <FieldGroup>
                  <FormLabel htmlFor="states">
                    Limit to States/Provinces (Optional)
                  </FormLabel>
                  <Select<IStateSelectOption, true>
                    id="states"
                    name="states"
                    options={availableStateOptions}
                    isMulti
                    value={availableStateOptions.filter((opt) =>
                      formData.states?.includes(opt.value)
                    )}
                    onChange={handleStateChange}
                    placeholder="Select states/provinces..."
                    closeMenuOnSelect={false}
                    isDisabled={isMutating}
                    styles={customReactSelectStyles}
                  />
                  <FieldHelperText>
                    If no states are selected, the zone applies to all areas in
                    the chosen countries.
                  </FieldHelperText>
                </FieldGroup>
              )}
          </FormSectionWrapper>
        </div>
        <FormStickyActionBar>
          <AdminButton
            type="button"
            $variant="secondary"
            onClick={handleCancel}
            disabled={isMutating}
          >
            <FaBan /> Cancel
          </AdminButton>
          <AdminButton type="submit" $variant="primary" disabled={isMutating}>
            {isMutating ? (
              <LoadingSpinner
                size="1em"
                color="#FFF"
                thickness="2px"
                inline={true}
                style={{ marginRight: "8px" }}
              />
            ) : (
              <FaCheckCircle style={{ marginRight: "8px" }} />
            )}
            {isEditMode ? "Save Changes" : "Create Zone"}
          </AdminButton>
        </FormStickyActionBar>
      </ActualForm>
    </ZoneFormContainer>
  );
};

export default ShippingZoneForm;
