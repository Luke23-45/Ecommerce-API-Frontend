
import React, { useState, useEffect, type FormEvent } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  FaArrowLeft,
  FaCheckCircle,
  FaBan,
  FaInfoCircle,
  FaExclamationTriangle,
} from "react-icons/fa";

import {
  AttributeFormContainer,
  FormHeader,
  FormTitle,
  AttributeActualForm,
  FormStickyActionBar,
  FormAlert,
} from "./AttributeForm.styles";

import { AdminInput, AdminButton } from "../../Dashboard/Common/Common.styles";

import AdminSelect from "../../common/AdminSelect/AdminSelect";


import FormSectionWrapper, {
  FieldGroup,
  FormLabel,
} from "../../common/FormSectionWrapper/FormSectionWrapper";
import { LoadingOverlay as LoadingSpinner } from "../../Application/SellerApplications/SellerApplicationList.styles";

import {
  useGetAttributeById,
  useCreateAttribute,
  useUpdateAttribute,
} from "@/hooks/admin/product/useAttribute";

import {
  type IAttributeCreatePayload,
  type IAttributeUpdatePayload,
  type IAttributeResponse,
  type IAttributeDisplayType,
} from "@/types/attribute"; 
import { useNotification } from "@/contexts/NotificationContext";

const initialAttributeState: IAttributeCreatePayload = {
  name: "",
  displayName: "",
  displayType: "dropdown",
  isFilterable: false,
  isRequiredForVariation: false,
};

interface AttributeListProps {
  onClickBackList: () => void;
  onSuccess: () => void;
  attributId: any;
}

const AttributeForm: React.FC<AttributeListProps> = () => {

  const test = useParams();
  const attributeId = test.attributeId;
  const isEditMode = Boolean(attributeId);
  const [attributeData, setAttributeData] = useState<
    IAttributeCreatePayload | IAttributeUpdatePayload
  >(initialAttributeState);
  const [formError, setFormError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  const { showNotification } = useNotification();

  const navigate = useNavigate();

  const {
    data: existingAttribute,
    isLoading: isLoadingAttribute,
    isError: isFetchError,
    error: fetchError,
  } = useGetAttributeById(attributeId, undefined, {
    enabled: isEditMode,
  });

  const onClickBackList = () =>{
    navigate(`/admin/products/attributes/list`)
  }

  const createAttributeMutation = useCreateAttribute({
    onSuccess: (response) => {
      showNotification(
        `Attribute "${response.data.name}" created successfully!`,
        "success"
      );
      onSuccess();
      onClickBackList();
    },
    onError: (error: any) => {
      setFormError(
        error.message || "Failed to create attribute. Please try again."
      );
      showNotification(
        `Error creating attribute: ${error.message || "Unknown error"}`,
        "error"
      );
    },
  });



  const updateAttributeMutation = useUpdateAttribute({
    onSuccess: (response) => {
      showNotification(
        `Attribute "${response.data.name}" updated successfully!`,
        "success"
      );
        onSuccess();
      onClickBackList();
      console.log("click back to list");
    },
    onError: (error: any) => {
      setFormError(
        error.message || "Failed to update attribute. Please try again."
      );
      if (error.errors && Array.isArray(error.errors))
        setValidationErrors(error.errors);
      showNotification(
        `Error updating attribute: ${error.message || "Unknown error"}`,
        "error"
      );
    },
  });

  const onSuccess = () => {
    navigate("/admin/products/attributes/list")
  }

  useEffect(() => {
    if (isEditMode && existingAttribute) {
      setAttributeData({
        name: existingAttribute.name,
        displayName: existingAttribute.displayName || "",
        displayType: existingAttribute.displayType,
        isFilterable: existingAttribute.isFilterable || false,
        isRequiredForVariation:
          existingAttribute.isRequiredForVariation || false,
        
      });
    } else if (!isEditMode) {
      setAttributeData(initialAttributeState); 
    }
  }, [isEditMode, existingAttribute]);

  
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;

    if (type === "checkbox") {
      const { checked } = e.target as HTMLInputElement;
      setAttributeData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setAttributeData((prev) => ({ ...prev, [name]: value }));
    }
  };


  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setValidationErrors([]);

    if (!attributeData.name.trim()) {
      setFormError("Attribute Name is required.");
      showNotification("Attribute Name is required.", "warning");
      return;
    }

    if (isEditMode && attributeId) {
      updateAttributeMutation.mutate({
        attributeId,
        payload: attributeData as IAttributeUpdatePayload,
      });
    } else {
      createAttributeMutation.mutate(attributeData as IAttributeCreatePayload);
    }
    setTimeout(() => {
      () => onClickBackList();
    }, 1000);
  };

  if (isLoadingAttribute)
    return <LoadingSpinner message="Loading attribute details..." />;
  if (isFetchError && isEditMode) {
    return (
      <AttributeFormContainer>
        <FormAlert $type="error">
          <FaExclamationTriangle style={{ marginRight: "10px" }} />
          Error loading attribute:{" "}
          {(fetchError as any)?.message || "Could not fetch attribute details."}
        </FormAlert>
        <AdminButton $variant="secondary" onClick={() => onClickBackList()}>
          <FaArrowLeft /> Back to List
        </AdminButton>
      </AttributeFormContainer>
    );
  }

  return (
    <AttributeFormContainer>
      <FormHeader>
        <FormTitle>
          {isEditMode
            ? `Edit Attribute: ${existingAttribute?.name || ""}`
            : "Create New Attribute"}
        </FormTitle>
        <AdminButton $variant="secondary" onClick={() => onClickBackList()}>
          <FaArrowLeft style={{ marginRight: "8px" }} /> Back to List
        </AdminButton>
      </FormHeader>

      {formError && (
        <FormAlert $type="error">
          <FaExclamationTriangle style={{ marginRight: "10px" }} />
          {formError}
        </FormAlert>
      )}
      {validationErrors.length > 0 && (
        <FormAlert $type="error">
          Please correct the following errors:
          <ul>
            {validationErrors.map((err, index) => (
              <li key={index}>{err}</li>
            ))}
          </ul>
        </FormAlert>
      )}

      <AttributeActualForm onSubmit={handleSubmit}>
        <FormSectionWrapper title="Attribute Details">
          <FieldGroup>
            <FormLabel htmlFor="name">Attribute Name*</FormLabel>
            <AdminInput
              type="text"
              id="name"
              name="name"
              value={attributeData.name}
              onChange={handleChange}
              placeholder="e.g., Color, Size, Material"
              required
              disabled={
                createAttributeMutation.isPending ||
                updateAttributeMutation.isPending
              }
            />
            <small>
              Unique name for the attribute (e.g., "Color"). Slug will be
              auto-generated.
            </small>
          </FieldGroup>

          <FieldGroup>
            <FormLabel htmlFor="displayName">Display Name</FormLabel>
            <AdminInput
              type="text"
              id="displayName"
              name="displayName"
              value={attributeData.displayName || ""}
              onChange={handleChange}
              placeholder="e.g., Product Color (Optional, defaults to Name)"
              disabled={
                createAttributeMutation.isPending ||
                updateAttributeMutation.isPending
              }
            />
            <small>How the attribute name is shown to users/customers.</small>
          </FieldGroup>

          <FieldGroup>
            <FormLabel htmlFor="displayType">Display Type*</FormLabel>
            <AdminSelect
              id="displayType"
              name="displayType"
              value={attributeData.displayType}
              onChange={handleChange}
              options={[
                { value: "dropdown", label: "Dropdown Select" },
                { value: "swatch", label: "Color/Image Swatch" },
                { value: "radio", label: "Radio Buttons" },
                { value: "text", label: "Text Input (for custom values)" },
              ]}
              disabled={
                createAttributeMutation.isPending ||
                updateAttributeMutation.isPending
              }
            />
            <small>
              How options for this attribute will be presented in the product
              form/page.
            </small>
          </FieldGroup>
        </FormSectionWrapper>

        <FormSectionWrapper title="Behavior & Configuration">
          <FieldGroup>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <input
                type="checkbox"
                id="isFilterable"
                name="isFilterable"
                checked={attributeData.isFilterable || false}
                onChange={handleChange}
                disabled={
                  createAttributeMutation.isPending ||
                  updateAttributeMutation.isPending
                }
                style={{ transform: "scale(1.3)", marginRight: "8px" }}
              />
              <FormLabel
                htmlFor="isFilterable"
                style={{
                  textTransform: "none",
                  marginBottom: "0",
                  cursor: "pointer",
                }}
              >
                Use in Product Filtering?
              </FormLabel>
            </div>
            <small>
              Can customers filter products by this attribute on the storefront?
            </small>
          </FieldGroup>

          <FieldGroup>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <input
                type="checkbox"
                id="isRequiredForVariation"
                name="isRequiredForVariation"
                checked={attributeData.isRequiredForVariation || false}
                onChange={handleChange}
                disabled={
                  createAttributeMutation.isPending ||
                  updateAttributeMutation.isPending
                }
                style={{ transform: "scale(1.3)", marginRight: "8px" }}
              />
              <FormLabel
                htmlFor="isRequiredForVariation"
                style={{
                  textTransform: "none",
                  marginBottom: "0",
                  cursor: "pointer",
                }}
              >
                Required for Product Variations?
              </FormLabel>
            </div>
            <small>
              Must this attribute be selected to define a distinct product
              variation?
            </small>
          </FieldGroup>
        </FormSectionWrapper>

        <FormStickyActionBar>
          <AdminButton
            type="button"
            $variant="secondary"
            onClick={onClickBackList}
            disabled={
              createAttributeMutation.isPending ||
              updateAttributeMutation.isPending
            }
          >
            <FaBan /> Cancel
          </AdminButton>
          <AdminButton
            type="submit"
            $variant="primary"
            disabled={
              createAttributeMutation.isPending ||
              updateAttributeMutation.isPending
            }
          >
            {createAttributeMutation.isPending ||
            updateAttributeMutation.isPending ? (
              <LoadingSpinner size="1em" />
            ) : (
              <FaCheckCircle />
            )}
            {isEditMode ? "Save Changes" : "Create Attribute"}
          </AdminButton>
        </FormStickyActionBar>
      </AttributeActualForm>
    </AttributeFormContainer>
  );
};

export default AttributeForm;
