import React, { useState, useEffect, FormEvent, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useTheme, type DefaultTheme } from "styled-components";
import { produce } from "immer";
import {
  FaArrowLeft,
  FaCheckCircle,
  FaBan,
  FaExclamationTriangle,
  FaSpinner,
  FaPlusCircle,
  FaTrashAlt,
  FaShippingFast,
  FaListOl,
  FaToggleOn,
  FaToggleOff,
} from "react-icons/fa";

import {
  RateFormContainer,
  FormHeader,
  FormTitle,
  ParentZoneContextDisplay,
  ActualForm,
  RulesSection,
  RuleRow,
  AddRuleButton,
  FormStickyActionBar,
  FormAlert,
  FieldHelperText,
} from "./ShippingRateForm.styles";

import {
  AdminInput,
  AdminButton,
} from "@/components/admin/Dashboard/Common/Common.styles";
import AdminTextArea from "@/components/admin/common/AdminTextArea/AdminTextArea";
import AdminSelect, {
  type SelectOption,
} from "@/components/admin/common/AdminSelect/AdminSelect";
import FormSectionWrapper, {
  FieldGroup,
  FormLabel,
  MultiFieldRow,
} from "@/components/admin/common/FormSectionWrapper/FormSectionWrapper";
import LoadingSpinner from "@/components/common/LoadingSpinner/LoadingSpinner";

import {
  useGetShippingZoneById,
  useGetShippingRateById,
  useCreateShippingRate,
  useUpdateShippingRate,
} from "@/hooks/admin/checkoutsession/useShipping";
import {
  type IShippingRateCreatePayload,
  type IShippingRateUpdatePayload,
  type IShippingRateRuleForm,
} from "@/types/shipping.types";
import { useNotification } from "@/contexts/NotificationContext";
import { type RootState } from "@/store";
import { useSelector } from "react-redux";

const getStringValue = (val: number | string | null | undefined): string =>
  val === null || val === undefined ? "" : String(val);
const parseNumericString = (val: string): number | undefined => {
  if (val.trim() === "") return undefined;
  const num = Number(val.replace(",", "."));
  return isNaN(num) ? undefined : num;
};

const initialRateFormState: Omit<IShippingRateRuleForm, "zoneId"> = {
  name: "",
  description: "",
  cost: "0",
  type: "flat",
  rules: [],
  minOrderTotal: "",
  maxOrderTotal: "",
  minWeight: "",
  maxWeight: "",
  minQuantity: "",
  maxQuantity: "",
  estimatedDeliveryTime: "",
  isActive: true,
};

type FieldErrorState = {
  [key: string]: string | undefined;
  rules?: { [index: number]: { [field: string]: string } };
};

const ShippingRateForm: React.FC = () => {
  const navigate = useNavigate();
  const { zoneId, rateId } = useParams<{ zoneId: string; rateId?: string }>();
  const isEditMode = !!rateId;

  const theme = useTheme() as DefaultTheme;
  const { showNotification } = useNotification();
  const { user } = useSelector((state: RootState) => state.auth);

  const [formData, setFormData] =
    useState<Omit<IShippingRateRuleForm, "zoneId">>(initialRateFormState);
  const [serverError, setServerError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<FieldErrorState>({});

  const {
    data: parentZone,
    isLoading: isLoadingParentZone,
    isError: isParentZoneError,
  } = useGetShippingZoneById(zoneId, { enabled: !!zoneId });
  const {
    data: existingRate,
    isLoading: isLoadingRate,
    isError: isRateError,
  } = useGetShippingRateById(rateId, undefined, { enabled: isEditMode });

  useEffect(() => {
    if (isEditMode && existingRate) {
      setFormData({
        name: existingRate.name || "",
        description: existingRate.description || "",
        cost: getStringValue(existingRate.cost),
        type: existingRate.type || "flat",
        rules: (existingRate.rules || []).map((rule, i) => ({
          tempId: `rule-${i}-${Date.now()}`,
          min: getStringValue(rule.min),
          max: getStringValue(rule.max),
          value: getStringValue(rule.value),
        })),
        minOrderTotal: getStringValue(existingRate.minOrderTotal),
        maxOrderTotal: getStringValue(existingRate.maxOrderTotal),
        minWeight: getStringValue(existingRate.minWeight),
        maxWeight: getStringValue(existingRate.maxWeight),
        minQuantity: getStringValue(existingRate.minQuantity),
        maxQuantity: getStringValue(existingRate.maxQuantity),
        estimatedDeliveryTime: existingRate.estimatedDeliveryTime || "",
        isActive: existingRate.isActive,
      });
    }
  }, [isEditMode, existingRate]);

  const createRateMutation = useCreateShippingRate({
    onSuccess: (response) => {
      showNotification(
        `Rate "${response.name}" created successfully!`,
        "success"
      );
      HandleListNavigate();
    },
    onError: (error: any) => {
      setServerError(error.message || "Failed to create rate.");
      if (error.data?.errors) setFieldErrors(error.data.errors);
    },
  });

  const HandleListNavigate = () => {
    const zoneName = parentZone.name;
    navigate(`/admin/checkoutsession/shippingzones/shippingrates/${zoneId}`, {
      state: { zoneName },
    });
  };

  const updateRateMutation = useUpdateShippingRate({
    onSuccess: (response) => {
      showNotification(
        `Rate "${response.name}" updated successfully!`,
        "success"
      );
      HandleListNavigate();
    },
    onError: (error: any) => {
      setServerError(error.message || "Failed to update rate.");
      if (error.data?.errors) setFieldErrors(error.data.errors);
    },
  });

  const handleChange = useCallback(
    (
      e: React.ChangeEvent<
        HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
      >
    ) => {
      const { name, value, type } = e.target;
      const finalValue =
        type === "checkbox" ? (e.target as HTMLInputElement).checked : value;
      setFormData((prev) => ({ ...prev, [name]: finalValue }));
      if (fieldErrors[name])
        setFieldErrors(
          produce((draft) => {
            delete draft[name];
          })
        );
    },
    [fieldErrors]
  );

  const handleRuleChange = useCallback(
    (
      index: number,
      field: keyof Omit<IShippingRateRuleForm, "tempId">,
      value: string
    ) => {
      setFormData(
        produce((draft) => {
          (draft.rules[index] as any)[field] = value;
        })
      );
      if (fieldErrors.rules?.[index]?.[field]) {
        setFieldErrors(
          produce((draft) => {
            delete draft.rules?.[index]?.[field];
          })
        );
      }
    },
    [fieldErrors]
  );

  const addRule = () => {
    setFormData(
      produce((draft) => {
        draft.rules.push({
          tempId: `new-${Date.now()}`,
          min: "",
          max: "",
          value: "",
        });
      })
    );
  };

  const removeRule = (indexToRemove: number) => {
    setFormData(
      produce((draft) => {
        draft.rules.splice(indexToRemove, 1);
      })
    );
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setServerError(null);
    setFieldErrors({});

    const errors: FieldErrorState = {};
    if (!formData.name.trim()) errors.name = "Rate Name is required.";
    const costNum = parseNumericString(formData.cost);
    if (costNum === undefined || costNum < 0)
      errors.cost = "Base Cost must be a valid non-negative number.";

    const typeRequiresRules = ["by_weight", "by_price", "by_quantity"].includes(
      formData.type
    );
    if (typeRequiresRules && formData.rules.length === 0) {
      errors.rules_general =
        "At least one rule is required for this rate type.";
    } else {
      const ruleErrors: { [index: number]: { [field: string]: string } } = {};
      formData.rules.forEach((rule, index) => {
        const currentRuleErrors: { [field: string]: string } = {};
        const minNum = parseNumericString(rule.min);
        const maxNum = parseNumericString(rule.max);
        const valueNum = parseNumericString(rule.value);

        if (minNum === undefined) currentRuleErrors.min = "Required.";
        if (valueNum === undefined) currentRuleErrors.value = "Required.";
        if (maxNum !== undefined && minNum !== undefined && maxNum <= minNum) {
          currentRuleErrors.max = "Must be > Min.";
        }
        if (Object.keys(currentRuleErrors).length > 0)
          ruleErrors[index] = currentRuleErrors;
      });
      if (Object.keys(ruleErrors).length > 0) errors.rules = ruleErrors;
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      showNotification("Please correct the form errors.", "warning");
      return;
    }

    if (!user?._id || !zoneId) {
      setServerError("Authentication or Zone ID error. Cannot save.");
      return;
    }

    const payload: Omit<IShippingRateCreatePayload, "createdBy"> = {
      zoneId,
      name: formData.name.trim(),
      description: formData.description?.trim() || undefined,
      cost: parseNumericString(formData.cost)!,
      type: formData.type,
      rules: formData.rules.map((rule) => ({
        min: parseNumericString(rule.min)!,
        max: parseNumericString(rule.max),
        value: parseNumericString(rule.value)!,
      })),
      minOrderTotal: parseNumericString(formData.minOrderTotal),
      maxOrderTotal: parseNumericString(formData.maxOrderTotal),
      minWeight: parseNumericString(formData.minWeight),
      maxWeight: parseNumericString(formData.maxWeight),
      minQuantity: parseNumericString(formData.minQuantity),
      maxQuantity: parseNumericString(formData.maxQuantity),
      estimatedDeliveryTime:
        formData.estimatedDeliveryTime?.trim() || undefined,
      isActive: formData.isActive,
    };

    if (isEditMode && rateId) {
      updateRateMutation.mutate({
        rateId,
        payload: payload as IShippingRateUpdatePayload,
      });
    } else {
      createRateMutation.mutate(payload as IShippingRateCreatePayload);
    }
  };

  const handleCancel = () =>
    HandleListNavigate();
  const isMutating =
    createRateMutation.isPending || updateRateMutation.isPending;
  const isLoading = isLoadingParentZone || (isEditMode && isLoadingRate);

  if (!zoneId)
    return (
      <FormAlert $type="error">
        Error: Shipping Zone ID is missing from URL.
      </FormAlert>
    );
  if (isLoading)
    return (
      <div
        style={{ display: "flex", justifyContent: "center", padding: "50px" }}
      >
        <LoadingSpinner message="Loading rate details..." />
      </div>
    );
  if (isParentZoneError || (isEditMode && isRateError) || !parentZone) {
    return (
      <RateFormContainer>
        <FormAlert $type="error">
          <FaExclamationTriangle /> Could not load required data. The zone or
          rate may not exist.
        </FormAlert>
        <AdminButton $variant="secondary" onClick={handleCancel}>
          <FaArrowLeft /> Back to Zones
        </AdminButton>
      </RateFormContainer>
    );
  }

  const rateTypeOptions: SelectOption[] = [
    { value: "flat", label: "Flat Rate" },
    { value: "by_price", label: "Tiered by Order Price" },
    { value: "by_weight", label: "Tiered by Order Weight" },
    { value: "by_quantity", label: "Tiered by Item Quantity" },
  ];
  const showRulesSection = ["by_weight", "by_price", "by_quantity"].includes(
    formData.type
  );

  return (
    <RateFormContainer>
      <FormHeader>
        <FormTitle>
          {isEditMode
            ? `Edit Rate: ${formData.name}`
            : "Create New Shipping Rate"}
        </FormTitle>
        <AdminButton
          $variant="secondary"
          onClick={handleCancel}
          disabled={isMutating}
        >
          <FaArrowLeft /> Back to Rates
        </AdminButton>
      </FormHeader>
      <ParentZoneContextDisplay>
        For Zone: <strong>{parentZone.name}</strong>
      </ParentZoneContextDisplay>

      {serverError && (
        <FormAlert $type="error">
          <FaExclamationTriangle /> {serverError}
        </FormAlert>
      )}
      {fieldErrors.rules_general && (
        <FormAlert $type="error">
          <FaExclamationTriangle /> {fieldErrors.rules_general}
        </FormAlert>
      )}

      <ActualForm onSubmit={handleSubmit}>
        <FormSectionWrapper title="Rate Details" icon={<FaShippingFast />}>
          <FieldGroup>
            <FormLabel htmlFor="name">Rate Name*</FormLabel>
            <AdminInput
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
          </FieldGroup>
          <FieldGroup>
            <FormLabel htmlFor="description">Description (Optional)</FormLabel>
            <AdminTextArea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={2}
              disabled={isMutating}
              placeholder="e.g., 5-7 business days"
            />
          </FieldGroup>
          <MultiFieldRow>
            <FieldGroup>
              <FormLabel htmlFor="type">Rate Type*</FormLabel>
              <AdminSelect
                id="type"
                name="type"
                value={formData.type}
                onChange={handleChange}
                options={rateTypeOptions}
                required
                disabled={isMutating}
              />
            </FieldGroup>
            <FieldGroup>
              <FormLabel htmlFor="cost">Base/Default Cost*</FormLabel>
              <AdminInput
                id="cost"
                name="cost"
                value={formData.cost}
                onChange={handleChange}
                required
                pattern="^\d*([.,]\d{0,2})?$"
                placeholder="0.00"
                disabled={isMutating}
              />
              {fieldErrors.cost && (
                <FieldHelperText $error>{fieldErrors.cost}</FieldHelperText>
              )}
            </FieldGroup>
          </MultiFieldRow>
          <FieldGroup>
            <FormLabel htmlFor="estimatedDeliveryTime">
              Estimated Delivery Time (Optional)
            </FormLabel>
            <AdminInput
              id="estimatedDeliveryTime"
              name="estimatedDeliveryTime"
              value={formData.estimatedDeliveryTime}
              onChange={handleChange}
              placeholder="e.g., 3-5 business days"
              disabled={isMutating}
            />
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
                  marginBottom: 0,
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
                Active Rate
              </FormLabel>
            </div>
          </FieldGroup>
        </FormSectionWrapper>

        {showRulesSection && (
          <FormSectionWrapper title="Rate Tiers" icon={<FaListOl />}>
            <FieldHelperText>
              Define ranges and their costs. For "and up", leave Max empty. The
              Base Cost above will be used if no tiers match.
            </FieldHelperText>
            {formData.rules.map((rule, index) => (
              <RuleRow key={rule.tempId}>
                <FieldGroup>
                  <FormLabel>Min</FormLabel>
                  <AdminInput
                    value={rule.min}
                    onChange={(e) =>
                      handleRuleChange(index, "min", e.target.value)
                    }
                    placeholder="0"
                  />
                  {fieldErrors.rules?.[index]?.min && (
                    <FieldHelperText $error>
                      {fieldErrors.rules[index].min}
                    </FieldHelperText>
                  )}
                </FieldGroup>
                <FieldGroup>
                  <FormLabel>Max</FormLabel>
                  <AdminInput
                    value={rule.max}
                    onChange={(e) =>
                      handleRuleChange(index, "max", e.target.value)
                    }
                    placeholder="50"
                  />
                  {fieldErrors.rules?.[index]?.max && (
                    <FieldHelperText $error>
                      {fieldErrors.rules[index].max}
                    </FieldHelperText>
                  )}
                </FieldGroup>
                <FieldGroup>
                  <FormLabel>Cost*</FormLabel>
                  <AdminInput
                    value={rule.value}
                    onChange={(e) =>
                      handleRuleChange(index, "value", e.target.value)
                    }
                    placeholder="9.99"
                  />
                  {fieldErrors.rules?.[index]?.value && (
                    <FieldHelperText $error>
                      {fieldErrors.rules[index].value}
                    </FieldHelperText>
                  )}
                </FieldGroup>
                <AdminButton
                  type="button"
                  $variant="dangerOutline"
                  onClick={() => removeRule(index)}
                  disabled={isMutating}
                >
                  <FaTrashAlt />
                </AdminButton>
              </RuleRow>
            ))}
            <AddRuleButton
              type="button"
              onClick={addRule}
              disabled={isMutating}
            >
              <FaPlusCircle /> Add Tier
            </AddRuleButton>
          </FormSectionWrapper>
        )}

        <FormSectionWrapper
          title="General Conditions (Optional)"
          icon={<FaExclamationTriangle />}
        >
          <FieldHelperText>
            Apply these conditions to the entire rate. If the order doesn't meet
            them, this rate won't be available.
          </FieldHelperText>
          <MultiFieldRow>
            <FieldGroup>
              <FormLabel>Min Order Total</FormLabel>
              <AdminInput
                name="minOrderTotal"
                value={formData.minOrderTotal}
                onChange={handleChange}
                placeholder="50.00"
              />
            </FieldGroup>
            <FieldGroup>
              <FormLabel>Max Order Total</FormLabel>
              <AdminInput
                name="maxOrderTotal"
                value={formData.maxOrderTotal}
                onChange={handleChange}
                placeholder="200.00"
              />
            </FieldGroup>
          </MultiFieldRow>
          {/* Add more conditions for weight/quantity here if needed, following the same pattern */}
        </FormSectionWrapper>

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
                inline
                style={{ marginRight: "8px" }}
              />
            ) : (
              <FaCheckCircle style={{ marginRight: "8px" }} />
            )}
            {isEditMode ? "Save Changes" : "Create Rate"}
          </AdminButton>
        </FormStickyActionBar>
      </ActualForm>
    </RateFormContainer>
  );
};

export default ShippingRateForm;
