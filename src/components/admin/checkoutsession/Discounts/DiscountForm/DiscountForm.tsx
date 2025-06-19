// src/components/Admin/Discounts/DiscountForm.tsx
import React, { useState, useEffect, useCallback, type FormEvent } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useTheme, type DefaultTheme } from "styled-components";
import { useSelector } from "react-redux";
import { produce } from "immer";
import Select, { type MultiValue } from "react-select"; // Using the superior react-select

import {
  FaArrowLeft,
  FaCheckCircle,
  FaBan,
  FaExclamationTriangle,
  FaSpinner,
  FaPlus,
  FaTrashAlt,
  FaPercent,
  FaGift,
  FaUsers,
  FaCalendarAlt,
  FaToggleOn,
  FaToggleOff,
  FaInfoCircle,
  FaTags,
} from "react-icons/fa";

import AdminTextArea from "@/components/admin/common/AdminTextArea/AdminTextArea";

import {
  DiscountFormContainer,
  FormHeader,
  FormTitle,
  ActualForm,
  RuleItem,
  RuleHeader,
  FormStickyActionBar,
  FormAlert,
  FieldHelperText,
  type ReactSelectOption, // Import option type for react-select
} from "./DiscountForm.styles";
import { ReactSelectStyles } from "../../Tax/TaxDetail/TaxRateForm.styles";

// Common Components
import {
  AdminInput,
  AdminButton,
} from "@/components/admin/Dashboard/Common/Common.styles";
import AdminSelectNative from "@/components/admin/common/AdminSelect/AdminSelect"; // For simple selects
import FormSectionWrapper, {
  FieldGroup,
  FormLabel,
  MultiFieldRow,
} from "@/components/admin/common/FormSectionWrapper/FormSectionWrapper";

import LoadingSpinner from "@/components/common/LoadingSpinner/LoadingSpinner";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

// Hooks and Types
import {
  useGetDiscountById,
  useCreateDiscount,
  useUpdateDiscount,
} from "@/hooks/admin/checkoutsession/useDiscount";
import { useGetPaginatedCategories } from "@/hooks/admin/product/useCategory";
import { useGetPaginatedProducts } from "@/hooks/admin/product/product/useProduct";
import {
  type IDiscountFormState,
  type IDiscountCreatePayload,
  type IDiscountUpdatePayload,
  type IDiscountRuleForm,
  DiscountType,
  DiscountApplicability,
} from "@/types/discount.interfaces";
import { type ICategoryResponse } from "@/types/category";
import { useNotification } from "@/contexts/NotificationContext";
import { type RootState } from "@/store";

// Helper functions
const getNumericValue = (v: any, d = 0) => {
  const n = Number(String(v).replace(",", "."));
  return isNaN(n) ? d : n;
};
const getStringValue = (v: any, d = "") =>
  v === undefined || v === null ? d : String(v);
const parseNumericString = (s: any, d?: number) => {
  if (typeof s == "number") return s;
  if (s === null || s === undefined || String(s).trim() === "") return d;
  const p = Number(s);
  return Number.isFinite(p) ? p : d;
};

// Initial state using IDs for selections, which is cleaner
const initialDiscountFormState: IDiscountFormState = {
  code: "",
  name: "",
  description: "",
  type: DiscountType.PERCENTAGE,
  value: "",
  applicability: DiscountApplicability.ALL_PRODUCTS,
  applicableProductIds: [],
  applicableCategoryIds: [],
  minimumOrderAmount: "",
  maximumDiscountAmount: "",
  usageLimit: "",
  usageLimitPerCustomer: "",
  startDate: new Date().toISOString().split("T")[0],
  endDate: null,
  isActive: true,
  targetUserIds: [],
  rules: [],
};

const DiscountForm: React.FC = () => {
  const navigate = useNavigate();
  const { discountId } = useParams<{ discountId?: string }>();
  const isEditMode = !!discountId;

  const theme = useTheme() as DefaultTheme;
  const { showNotification } = useNotification();
  const { user } = useSelector((state: RootState) => state.auth);

  const [formData, setFormData] = useState<IDiscountFormState>(
    initialDiscountFormState
  );
  const [serverError, setServerError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  // Options state for react-select
  const [productOptions, setProductOptions] = useState<ReactSelectOption[]>([]);
  const [categoryOptions, setCategoryOptions] = useState<ReactSelectOption[]>(
    []
  );

  // --- DATA FETCHING ---
  const {
    data: existingDiscount,
    isLoading: isLoadingDiscount,
    isError: isFetchError,
    error: fetchErrorData,
  } = useGetDiscountById(discountId, undefined, undefined, {
    enabled: isEditMode && !!discountId,
  });

  const { data: productsData, isLoading: isLoadingProducts } =
    useGetPaginatedProducts(
      { limit: 1000, projection: "id name", sort: JSON.stringify({ name: 1 }) },
      { staleTime: 5 * 60 * 1000 }
    );

  const { data: categoriesData, isLoading: isLoadingCategories } =
    useGetPaginatedCategories(
      {
        limit: 1000,
        projection: "id name level parentId sortOrder",
        sort: JSON.stringify({ name: 1 }),
      },
      { staleTime: 5 * 60 * 1000 }
    );

  // --- MUTATIONS ---
  const createDiscountMutation = useCreateDiscount({
    onSuccess: (response) => {
      showNotification(
        `Discount "${response.data.code}" created successfully!`,
        "success"
      );
      navigate("/admin/checkoutsession/discount/list");
    },
    onError: (error: any) => {
      setServerError(error.message);
      if (error.data?.errors) setFieldErrors(error.data.errors);
    },
  });
  const updateDiscountMutation = useUpdateDiscount({
    onSuccess: (response) => {
      showNotification(`Discount "${response.data.code}" updated.`, "success");
      navigate("/admin/checkoutsession/discount/list");
    },
    onError: (error: any) => {
      setServerError(error.message);
      if (error.data?.errors) setFieldErrors(error.data.errors);
    },
  });

  // --- EFFECTS ---
  // Populate react-select options
  useEffect(() => {
    if (productsData?.data) {
      setProductOptions(
        productsData.data.map((p) => ({ value: p.id, label: p.name }))
      );
    }
  }, [productsData]);

  useEffect(() => {
    if (categoriesData?.data) {
      const buildHierarchicalOptions = (
        cats: ICategoryResponse[],
        parentId: string | null = null,
        depth = 0
      ): ReactSelectOption[] => {
        return cats
          .filter((c) => c.parentId === parentId)
          .sort(
            (a, b) =>
              (a.sortOrder || 0) - (b.sortOrder || 0) ||
              a.name.localeCompare(b.name)
          )
          .reduce((acc, category) => {
            const id = category.id || ((category as any)._id as string);
            if (!id) return acc;
            acc.push({
              value: id,
              label: `${"— ".repeat(depth)}${category.name}`,
            });
            acc.push(...buildHierarchicalOptions(cats, id, depth + 1));
            return acc;
          }, [] as ReactSelectOption[]);
      };
      setCategoryOptions(
        buildHierarchicalOptions(
          categoriesData.data.map((c) => ({ ...c, id: c.id || (c as any)._id }))
        )
      );
    }
  }, [categoriesData]);

  // Populate form in edit mode
  useEffect(() => {
    if (isEditMode && existingDiscount) {
      setFormData({
        id: existingDiscount.id,
        code: existingDiscount.code,
        name: existingDiscount.name,
        description: existingDiscount.description || "",
        type: existingDiscount.type,
        value: getStringValue(existingDiscount.value),
        applicability: existingDiscount.applicability,
        applicableProductIds: existingDiscount.applicableProductIds || [],
        applicableCategoryIds: existingDiscount.applicableCategoryIds || [],
        minimumOrderAmount: getStringValue(existingDiscount.minimumOrderAmount),
        maximumDiscountAmount: getStringValue(
          existingDiscount.maximumDiscountAmount
        ),
        usageLimit: getStringValue(existingDiscount.usageLimit),
        usageLimitPerCustomer: getStringValue(
          existingDiscount.usageLimitPerCustomer
        ),
        startDate: existingDiscount.startDate
          ? new Date(existingDiscount.startDate).toISOString().split("T")[0]
          : "",
        endDate: existingDiscount.endDate
          ? new Date(existingDiscount.endDate).toISOString().split("T")[0]
          : null,
        isActive: existingDiscount.isActive,
        targetUserIds: existingDiscount.usersFor || [],
        rules: (existingDiscount.rules || []).map((rule) => ({
          buyQuantity: getStringValue(rule.buyQuantity),
          getQuantity: getStringValue(rule.getQuantity),
          getProductIds: rule.getProductIds || [],
          getCategoryIds: rule.getCategoryIds || [],
          discountAmount: getStringValue(rule.discountAmount),
          discountPercentage: getStringValue(rule.discountPercentage),
        })),
      });
    } else if (!isEditMode) {
      setFormData(initialDiscountFormState);
    }
  }, [isEditMode, existingDiscount]);

  // --- HANDLERS ---
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
        setFieldErrors((prev) => ({ ...prev, [name]: "" }));
      setServerError(null);
    },
    [fieldErrors]
  );

  const handleDateChange = (
    date: Date | null,
    fieldName: "startDate" | "endDate"
  ) => {
    setFormData((prev) => ({
      ...prev,
      [fieldName]: date ? date.toISOString().split("T")[0] : null,
    }));
  };

  const handleReactSelectChange = useCallback(
    (
      fieldName: keyof IDiscountFormState,
      selectedOptions: MultiValue<ReactSelectOption>
    ) => {
      const values = selectedOptions
        ? selectedOptions.map((opt) => opt.value)
        : [];
      setFormData((prev) => ({ ...prev, [fieldName]: values }));
    },
    []
  );

  const handleAddRule = () => {
    if (formData.type === DiscountType.BUY_X_GET_Y) {
      setFormData((prev) => ({
        ...prev,
        rules: [...prev.rules, { buyQuantity: "1", getQuantity: "1" }],
      }));
    }
  };

  const handleRuleChange = (
    index: number,
    field: keyof IDiscountRuleForm,
    value: any
  ) => {
    setFormData(
      produce((draft) => {
        (draft.rules[index] as any)[field] = value;
      })
    );
  };

  const handleRemoveRule = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      rules: prev.rules.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setServerError(null);
    setFieldErrors({});

    // Basic validation
    if (!formData.code.trim()) {
      setFieldErrors((prev) => ({
        ...prev,
        code: "Discount code is required.",
      }));
      return;
    }
    if (!formData.name.trim()) {
      setFieldErrors((prev) => ({
        ...prev,
        name: "Internal name is required.",
      }));
      return;
    }

    const payloadBase = {
      ...formData,
      value: getNumericValue(formData.value, 0),
      applicableProductIds:
        formData.applicability === DiscountApplicability.SPECIFIC_PRODUCTS
          ? formData.applicableProductIds
          : undefined,
      applicableCategoryIds:
        formData.applicability === DiscountApplicability.SPECIFIC_CATEGORIES
          ? formData.applicableCategoryIds
          : undefined,
      minimumOrderAmount: parseNumericString(
        formData.minimumOrderAmount,
        undefined
      ),
      maximumDiscountAmount: parseNumericString(
        formData.maximumDiscountAmount,
        undefined
      ),
      usageLimit: parseNumericString(formData.usageLimit, undefined),
      usageLimitPerCustomer: parseNumericString(
        formData.usageLimitPerCustomer,
        undefined
      ),
      usersFor: formData.targetUserIds,
      rules:
        formData.type === DiscountType.BUY_X_GET_Y
          ? formData.rules.map((r) => ({
              buyQuantity: getNumericValue(r.buyQuantity, 1),
              getQuantity: getNumericValue(r.getQuantity, 1),
              getProductIds: r.getProductIds,
              getCategoryIds: r.getCategoryIds,
              discountAmount: parseNumericString(r.discountAmount, undefined),
              discountPercentage: parseNumericString(
                r.discountPercentage,
                undefined
              ),
            }))
          : undefined,
    };

    // Clean up payload
    Object.keys(payloadBase).forEach(
      (key) =>
        (payloadBase as any)[key] === undefined &&
        delete (payloadBase as any)[key]
    );

    if (isEditMode && discountId) {
      updateDiscountMutation.mutate({
        discountId,
        payload: payloadBase as IDiscountUpdatePayload,
      });
    } else {
      createDiscountMutation.mutate(payloadBase as IDiscountCreatePayload);
    }
  };

  const onCancel = () =>
    navigate("/admin/checkoutsession/discount/list", { replace: true });

  const isMutating =
    createDiscountMutation.isPending || updateDiscountMutation.isPending;
  const isLoadingPageData = isEditMode && isLoadingDiscount;
  const customReactSelectStyles = ReactSelectStyles(theme);

  if (isLoadingPageData) {
    return (
      <div
        style={{ display: "flex", justifyContent: "center", padding: "50px" }}
      >
        <LoadingSpinner message="Loading discount details..." />
      </div>
    );
  }
  if (isFetchError && isEditMode) {
    return (
      <DiscountFormContainer>
        <FormAlert $type="error">
          <FaExclamationTriangle /> Error: {(fetchErrorData as any)?.message}
        </FormAlert>
      </DiscountFormContainer>
    );
  }

  const renderRuleForm = (rule: IDiscountRuleForm, index: number) => (
    <RuleItem key={index}>
      <RuleHeader>
        <h5>Buy X Get Y Rule Details</h5>
        <AdminButton
          type="button"
          $variant="dangerGhost"
          onClick={() => handleRemoveRule(index)}
          size="small"
        >
          <FaTrashAlt /> Remove Rule
        </AdminButton>
      </RuleHeader>
      <MultiFieldRow>
        <FieldGroup>
          <FormLabel htmlFor={`rule_buyq_${index}`}>Buy Quantity</FormLabel>
          <AdminInput
            type="number"
            id={`rule_buyq_${index}`}
            value={getStringValue(rule.buyQuantity)}
            onChange={(e) =>
              handleRuleChange(index, "buyQuantity", e.target.value)
            }
            min="1"
          />
        </FieldGroup>
        <FieldGroup>
          <FormLabel htmlFor={`rule_getq_${index}`}>
            Get Quantity (Free/Discounted)
          </FormLabel>
          <AdminInput
            type="number"
            id={`rule_getq_${index}`}
            value={getStringValue(rule.getQuantity)}
            onChange={(e) =>
              handleRuleChange(index, "getQuantity", e.target.value)
            }
            min="1"
          />
        </FieldGroup>
      </MultiFieldRow>
      <FieldGroup>
        <FormLabel>Discount Type for "Get" Items</FormLabel>
        <AdminSelectNative
          value={
            rule.discountAmount
              ? "amount"
              : rule.discountPercentage
              ? "percentage"
              : "free"
          }
          onChange={(e) => {
            const t = e.target.value;
            handleRuleChange(
              index,
              "discountAmount",
              t === "amount" ? "0" : ""
            );
            handleRuleChange(
              index,
              "discountPercentage",
              t === "percentage" ? "0" : ""
            );
          }}
          options={[
            { value: "free", label: "Get Items Free" },
            { value: "percentage", label: "Percentage Off" },
            { value: "amount", label: "Fixed Amount Off" },
          ]}
        />
      </FieldGroup>
      {rule.discountPercentage && (
        <FieldGroup>
          <FormLabel>Discount (%)</FormLabel>
          <AdminInput
            type="number"
            value={getStringValue(rule.discountPercentage)}
            onChange={(e) =>
              handleRuleChange(index, "discountPercentage", e.target.value)
            }
            min="0"
            max="100"
          />
        </FieldGroup>
      )}
      {rule.discountAmount && (
        <FieldGroup>
          <FormLabel>Discount Amount</FormLabel>
          <AdminInput
            type="number"
            value={getStringValue(rule.discountAmount)}
            onChange={(e) =>
              handleRuleChange(index, "discountAmount", e.target.value)
            }
            min="0"
          />
        </FieldGroup>
      )}
      <FieldGroup>
        <FormLabel>Specific "Get" Products (Optional)</FormLabel>
        <Select<ReactSelectOption, true>
          isMulti
          options={productOptions}
          value={productOptions.filter((opt) =>
            (rule.getProductIds || []).includes(opt.value)
          )}
          onChange={(opts) =>
            handleRuleChange(
              index,
              "getProductIds",
              opts.map((o) => o.value)
            )
          }
          styles={customReactSelectStyles}
          isDisabled={isMutating || isLoadingProducts}
          isLoading={isLoadingProducts}
          closeMenuOnSelect={false}
        />
      </FieldGroup>
      <FieldGroup>
        <FormLabel>Specific "Get" Categories (Optional)</FormLabel>
        <Select<ReactSelectOption, true>
          isMulti
          options={categoryOptions}
          value={categoryOptions.filter((opt) =>
            (rule.getCategoryIds || []).includes(opt.value)
          )}
          onChange={(opts) =>
            handleRuleChange(
              index,
              "getCategoryIds",
              opts.map((o) => o.value)
            )
          }
          styles={customReactSelectStyles}
          isDisabled={isMutating || isLoadingCategories}
          isLoading={isLoadingCategories}
          closeMenuOnSelect={false}
        />
      </FieldGroup>
    </RuleItem>
  );

  return (
    <DiscountFormContainer>
      <FormHeader>
        <FormTitle>
          {isEditMode
            ? `Edit Discount: ${formData.name || ""}`
            : "Create New Discount"}
        </FormTitle>
        <AdminButton
          $variant="secondary"
          onClick={onCancel}
          disabled={isMutating}
        >
          <FaArrowLeft style={{ marginRight: theme.spacing(1.5) }} /> Back to
          Discounts
        </AdminButton>
      </FormHeader>

      {serverError && (
        <FormAlert $type="error">
          <FaExclamationTriangle /> {serverError}
        </FormAlert>
      )}

      <ActualForm onSubmit={handleSubmit}>
        <FormSectionWrapper title="Basic Information" icon={<FaInfoCircle />}>
          <FieldGroup>
            <FormLabel htmlFor="code">Discount Code*</FormLabel>
            <AdminInput
              type="text"
              id="code"
              name="code"
              value={formData.code}
              onChange={handleChange}
              required
              disabled={isMutating}
              placeholder="e.g., SUMMER20, FREESHIP"
            />
            {fieldErrors.code && (
              <FieldHelperText $error>{fieldErrors.code}</FieldHelperText>
            )}
          </FieldGroup>
          <FieldGroup>
            <FormLabel htmlFor="name">Internal Name / Campaign*</FormLabel>
            <AdminInput
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              disabled={isMutating}
              placeholder="e.g., Summer Sale 2024"
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
              rows={3}
              placeholder="Internal notes or customer-facing details..."
              disabled={isMutating}
            />
          </FieldGroup>
        </FormSectionWrapper>

        <FormSectionWrapper title="Discount Type & Value" icon={<FaPercent />}>
          <FieldGroup>
            <FormLabel htmlFor="type">Discount Type*</FormLabel>
            <AdminSelectNative
              id="type"
              name="type"
              value={formData.type}
              onChange={handleChange}
              required
              disabled={isMutating}
              options={Object.values(DiscountType).map((dt) => ({
                value: dt,
                label: dt
                  .replace(/_/g, " ")
                  .replace(/\b\w/g, (l) => l.toUpperCase()),
              }))}
            />
          </FieldGroup>
          {formData.type !== DiscountType.FREE_SHIPPING &&
            formData.type !== DiscountType.BUY_X_GET_Y && (
              <FieldGroup>
                <FormLabel htmlFor="value">
                  {formData.type === DiscountType.PERCENTAGE
                    ? "Percentage (%)*"
                    : "Fixed Amount*"}
                </FormLabel>
                <AdminInput
                  type="text"
                  id="value"
                  name="value"
                  value={formData.value}
                  onChange={handleChange}
                  required
                  pattern="^\d*([.,]\d{0,2})?$"
                  placeholder="e.g., 20 or 10.50"
                  disabled={isMutating}
                />
                {fieldErrors.value && (
                  <FieldHelperText $error>{fieldErrors.value}</FieldHelperText>
                )}
              </FieldGroup>
            )}
          {formData.type === DiscountType.PERCENTAGE && (
            <FieldGroup>
              <FormLabel htmlFor="maximumDiscountAmount">
                Maximum Discount (Optional)
              </FormLabel>
              <AdminInput
                type="text"
                id="maximumDiscountAmount"
                name="maximumDiscountAmount"
                value={formData.maximumDiscountAmount || ""}
                onChange={handleChange}
                pattern="^\d*([.,]\d{0,2})?$"
                placeholder="e.g., 50"
                disabled={isMutating}
              />
              <FieldHelperText>
                Sets a cap on the discount amount.
              </FieldHelperText>
            </FieldGroup>
          )}
        </FormSectionWrapper>

        {formData.type !== DiscountType.FREE_SHIPPING && (
          <FormSectionWrapper title="Applicability" icon={<FaTags />}>
            <FieldGroup>
              <FormLabel htmlFor="applicability">Applies To*</FormLabel>
              <AdminSelectNative
                id="applicability"
                name="applicability"
                value={formData.applicability}
                onChange={handleChange}
                required
                disabled={isMutating}
                options={Object.values(DiscountApplicability).map((da) => ({
                  value: da,
                  label: da
                    .replace(/_/g, " ")
                    .replace(/\b\w/g, (l) => l.toUpperCase()),
                }))}
              />
            </FieldGroup>
            {formData.applicability ===
              DiscountApplicability.SPECIFIC_PRODUCTS && (
              <FieldGroup>
                <FormLabel>Applicable Products</FormLabel>
                <Select<ReactSelectOption, true>
                  isMulti
                  id="applicableProductIds"
                  name="applicableProductIds"
                  styles={customReactSelectStyles}
                  options={productOptions}
                  value={productOptions.filter((opt) =>
                    formData.applicableProductIds.includes(opt.value)
                  )}
                  onChange={(opts) =>
                    handleReactSelectChange("applicableProductIds", opts)
                  }
                  placeholder="Search and select products..."
                  isDisabled={isMutating || isLoadingProducts}
                  isLoading={isLoadingProducts}
                  closeMenuOnSelect={false}
                />
              </FieldGroup>
            )}
            {formData.applicability ===
              DiscountApplicability.SPECIFIC_CATEGORIES && (
              <FieldGroup>
                <FormLabel>Applicable Categories</FormLabel>
                <Select<ReactSelectOption, true>
                  isMulti
                  id="applicableCategoryIds"
                  name="applicableCategoryIds"
                  styles={customReactSelectStyles}
                  options={categoryOptions}
                  value={categoryOptions.filter((opt) =>
                    formData.applicableCategoryIds.includes(opt.value)
                  )}
                  onChange={(opts) =>
                    handleReactSelectChange("applicableCategoryIds", opts)
                  }
                  placeholder="Search and select categories..."
                  isDisabled={isMutating || isLoadingCategories}
                  isLoading={isLoadingCategories}
                  closeMenuOnSelect={false}
                />
              </FieldGroup>
            )}
          </FormSectionWrapper>
        )}

        {formData.type === DiscountType.BUY_X_GET_Y && (
          <FormSectionWrapper title="Discount Rules" icon={<FaGift />}>
            {formData.rules.length === 0 && (
              <AdminButton
                type="button"
                onClick={handleAddRule}
                $variant="secondaryOutline"
                disabled={isMutating}
              >
                <FaPlus /> Add "Buy X Get Y" Rule
              </AdminButton>
            )}
            {formData.rules.map((rule, index) => renderRuleForm(rule, index))}
            {formData.rules.length > 0 && (
              <AdminButton
                type="button"
                onClick={handleAddRule}
                $variant="secondaryOutline"
                disabled={isMutating}
                style={{ marginTop: "1rem" }}
              >
                <FaPlus /> Add Another Rule
              </AdminButton>
            )}
          </FormSectionWrapper>
        )}

        <FormSectionWrapper title="Conditions & Usage Limits">
          <FieldGroup>
            <FormLabel htmlFor="minimumOrderAmount">
              Minimum Order Amount (Optional)
            </FormLabel>
            <AdminInput
              type="text"
              id="minimumOrderAmount"
              name="minimumOrderAmount"
              value={formData.minimumOrderAmount || ""}
              onChange={handleChange}
              pattern="^\d*([.,]\d{0,2})?$"
              placeholder="e.g., 100"
              disabled={isMutating}
            />
            <FieldHelperText>
              Discount applies only if cart subtotal meets this amount.
            </FieldHelperText>
          </FieldGroup>
          <MultiFieldRow>
            <FieldGroup>
              <FormLabel htmlFor="usageLimit">
                Total Usage Limit (Optional)
              </FormLabel>
              <AdminInput
                type="text"
                id="usageLimit"
                name="usageLimit"
                value={formData.usageLimit || ""}
                onChange={handleChange}
                pattern="^\d*$"
                placeholder="e.g., 500"
                disabled={isMutating}
              />
              <FieldHelperText>
                Max times this code can be used in total.
              </FieldHelperText>
            </FieldGroup>
            <FieldGroup>
              <FormLabel htmlFor="usageLimitPerCustomer">
                Limit Per Customer (Optional)
              </FormLabel>
              <AdminInput
                type="text"
                id="usageLimitPerCustomer"
                name="usageLimitPerCustomer"
                value={formData.usageLimitPerCustomer || ""}
                onChange={handleChange}
                pattern="^\d*$"
                placeholder="e.g., 1"
                disabled={isMutating}
              />
              <FieldHelperText>
                Max times one customer can use this code.
              </FieldHelperText>
            </FieldGroup>
          </MultiFieldRow>
        </FormSectionWrapper>

        <FormSectionWrapper title="Schedule & Status" icon={<FaCalendarAlt />}>
          <MultiFieldRow>
            <FieldGroup>
              <FormLabel>Start Date*</FormLabel>
              <DatePicker
                selected={
                  formData.startDate ? new Date(formData.startDate) : new Date()
                }
                onChange={(date) => handleDateChange(date, "startDate")}
                dateFormat="yyyy-MM-dd"
                customInput={<AdminInput />}
                required
                disabled={isMutating}
              />
            </FieldGroup>
            <FieldGroup>
              <FormLabel>End Date (Optional)</FormLabel>
              <DatePicker
                selected={formData.endDate ? new Date(formData.endDate) : null}
                onChange={(date) => handleDateChange(date, "endDate")}
                dateFormat="yyyy-MM-dd"
                customInput={<AdminInput />}
                isClearable
                placeholderText="No expiration date"
                minDate={
                  formData.startDate ? new Date(formData.startDate) : null
                }
                disabled={isMutating}
              />
              <FieldHelperText>Leave empty for no expiration.</FieldHelperText>
            </FieldGroup>
          </MultiFieldRow>
          <FieldGroup>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: theme.spacing(2),
              }}
            >
              <input
                type="checkbox"
                id="isActive"
                name="isActive"
                checked={formData.isActive}
                onChange={handleChange}
                disabled={isMutating}
                style={{ transform: "scale(1.3)" }}
              />
              <FormLabel
                htmlFor="isActive"
                style={{
                  textTransform: "none",
                  marginBottom: 0,
                  cursor: "pointer",
                }}
              >
                {formData.isActive ? (
                  <FaToggleOn
                    style={{
                      color: theme.colors.adminStatusSuccess,
                      marginRight: theme.spacing(1),
                    }}
                  />
                ) : (
                  <FaToggleOff style={{ marginRight: theme.spacing(1) }} />
                )}
                Discount is Active
              </FormLabel>
            </div>
          </FieldGroup>
        </FormSectionWrapper>

        <FormSectionWrapper
          title="Customer Targeting (Optional)"
          icon={<FaUsers />}
        >
          <FieldGroup>
            <FormLabel>Specific Customers (Optional)</FormLabel>
            <AdminInput
              type="text"
              placeholder="User selection component not yet implemented. Enter IDs manually."
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  targetUserIds: e.target.value
                    .split(",")
                    .map((s) => s.trim())
                    .filter(Boolean),
                }))
              }
              disabled={isMutating}
            />
            <FieldHelperText>
              Leave empty to allow any eligible customer to use this discount.
            </FieldHelperText>
          </FieldGroup>
        </FormSectionWrapper>

        <FormStickyActionBar>
          <AdminButton
            type="button"
            $variant="secondary"
            onClick={onCancel}
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
                style={{ marginRight: theme.spacing(1.5) }}
              />
            ) : (
              <FaCheckCircle style={{ marginRight: theme.spacing(1.5) }} />
            )}
            {isEditMode ? "Save Discount Changes" : "Create Discount"}
          </AdminButton>
        </FormStickyActionBar>
      </ActualForm>
    </DiscountFormContainer>
  );
};

export default DiscountForm;
