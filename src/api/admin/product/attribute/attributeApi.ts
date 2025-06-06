import api from "@/api";
import {
  type IAttributeCreatePayload,
  type IAttributeUpdatePayload,
  type IAttributeResponse,
  type IAttributeOptionCreatePayload,
  type IAttributeOptionUpdatePayload,
  type IAttributeOptionResponse,
  type ApiResponse,
  type IPaginatedData,
} from "@/types/attribute";
const attributeApiEndpoints = {
  CREATE_ATTRIBUTE: "/attribute/attributes",
  GET_PAGINATED_ATTRIBUTES: "/attribute/attributes",
  GET_ATTRIBUTE_BY_ID: (attributeId: string) =>
    `/attribute/attributes/${attributeId}`,
  GET_ATTRIBUTE_BY_SLUG: (slug: string) =>
    `/attribute/getAttributeBySlug/${slug}`,
  UPDATE_ATTRIBUTE: (attributeId: string) =>
    `/attribute/attributes/${attributeId}`,
  DELETE_ATTRIBUTE: (attributeId: string) =>
    `/attribute/attributes/${attributeId}`,

  CREATE_ATTRIBUTE_OPTION: "/attribute/attributesoptions",
  GET_OPTIONS_FOR_ATTRIBUTE: (attributeId: string) =>
    `/attribute/attributesoptionsbyattributeId/${attributeId}`,
  GET_PAGINATED_ATTRIBUTE_OPTIONS: "/attribute/attributesoptions",
  GET_ATTRIBUTE_OPTION_BY_ID: (optionId: string) =>
    `/attribute/attributesoptions/${optionId}`,
  UPDATE_ATTRIBUTE_OPTION: (optionId: string) =>
    `/attribute/attributesoptions/${optionId}`,
  DELETE_ATTRIBUTE_OPTION: (optionId: string) =>
    `/attribute/attributesoptions/${optionId}`,
};

export async function createAttribute(
  payload: IAttributeCreatePayload
): Promise<ApiResponse<IAttributeResponse>> {
  try {
    const response = await api.post<ApiResponse<IAttributeResponse>>(
      attributeApiEndpoints.CREATE_ATTRIBUTE,
      payload
    );
    return response.data;
  } catch (error: any) {
    console.error(
      "Error creating attribute:",
      error.response?.data || error.message
    );
    throw error.response?.data || error;
  }
}

export async function getPaginatedAttributes(params?: {
  page?: number;
  limit?: number;
  filter?: string;
  sort?: string;
  projection?: string;
  lean?: boolean;
}): Promise<IPaginatedData<IAttributeResponse>> {
  try {
    console.log("API CALL: getPaginatedAttributes with params:", params);

    const response = await api.get<IPaginatedData<IAttributeResponse>>(
      attributeApiEndpoints.GET_PAGINATED_ATTRIBUTES,
      { params: params }
    );
    return response.data;
  } catch (error: any) {
    console.error(
      "Error fetching paginated attributes:",
      error.response?.data || error.message
    );

    throw error.response?.data || error;
  }
}

export async function getAttributeById(
  attributeId: string,
  projection?: string
): Promise<ApiResponse<IAttributeResponse>> {
  try {
    console.log("this is from 2222222222222222222222222222222222222222")
    const response = await api.get<ApiResponse<IAttributeResponse>>(
      attributeApiEndpoints.GET_ATTRIBUTE_BY_ID(attributeId),
      { params: { fields: projection } }
    );
    return response.data;
  } catch (error: any) {
    console.error(
      `Error fetching attribute by ID ${attributeId}:`,
      error.response?.data || error.message
    );
    throw error.response?.data || error;
  }
}

export async function getAttributeBySlug(
  slug: string,
  projection?: string
): Promise<ApiResponse<IAttributeResponse>> {
  try {
    const response = await api.get<ApiResponse<IAttributeResponse>>(
      attributeApiEndpoints.GET_ATTRIBUTE_BY_SLUG(slug),
      { params: { fields: projection } }
    );
    return response.data;
  } catch (error: any) {
    console.error(
      `Error fetching attribute by slug ${slug}:`,
      error.response?.data || error.message
    );
    throw error.response?.data || error;
  }
}

export async function updateAttribute(
  attributeId: string,
  payload: IAttributeUpdatePayload
): Promise<ApiResponse<IAttributeResponse>> {
  try {
    const response = await api.put<ApiResponse<IAttributeResponse>>(
      attributeApiEndpoints.UPDATE_ATTRIBUTE(attributeId),
      payload
    );
    return response.data;
  } catch (error: any) {
    console.error(
      `Error updating attribute ${attributeId}:`,
      error.response?.data || error.message
    );
    throw error.response?.data || error;
  }
}

export async function deleteAttribute(
  attributeId: string
): Promise<ApiResponse<null>> {
  try {
    const response = await api.delete<ApiResponse<null>>(
      attributeApiEndpoints.DELETE_ATTRIBUTE(attributeId)
    );
    return response.data;
  } catch (error: any) {
    console.error(
      `Error deleting attribute ${attributeId}:`,
      error.response?.data || error.message
    );
    throw error.response?.data || error;
  }
}

export async function createAttributeOption(
  payload: IAttributeOptionCreatePayload
): Promise<ApiResponse<IAttributeOptionResponse>> {
  try {
    const response = await api.post<ApiResponse<IAttributeOptionResponse>>(
      attributeApiEndpoints.CREATE_ATTRIBUTE_OPTION,
      payload
    );
    return response.data;
  } catch (error: any) {
    console.error(
      "Error creating attribute option:",
      error.response?.data || error.message
    );
    throw error.response?.data || error;
  }
}

export async function getOptionsForAttribute(
  attributeId: string,
  params?: {
    sort?: Record<string, 1 | -1> | string;
    projection?: string;
    lean?: boolean;
  }
): Promise<ApiResponse<IAttributeOptionResponse[]>> {
  try {
    const response = await api.get<ApiResponse<IAttributeOptionResponse[]>>(
      attributeApiEndpoints.GET_OPTIONS_FOR_ATTRIBUTE(attributeId),
      { params }
    );
    return response.data;
  } catch (error: any) {
    console.error(
      `Error fetching options for attribute ${attributeId}:`,
      error.response?.data || error.message
    );
    throw error.response?.data || error;
  }
}

export async function getPaginatedAttributeOptions(params?: {
  page?: number;
  limit?: number;
  filter?: Record<string, any>; // <<<< EXPECTS 'filter' to be an object (or stringified JSON if controller parses it)
  sort?: Record<string, 1 | -1> | string; // <<<< EXPECTS 'sort' to be an object or string
  projection?: string;
  lean?: boolean;
  attributeId?: string; // This is used to help construct queryParams.filter
}): Promise<IPaginatedData<IAttributeOptionResponse>> {
  try {
    const queryParams: any = { ...params }; // Copies page, limit, filter (as object), sort (as object/string)
    
    // This logic correctly puts attributeId INTO queryParams.filter (if filter wasn't already set)
    if (params?.attributeId && !queryParams.filter) {
      queryParams.filter = { attributeId: params.attributeId };
    } else if (params?.attributeId && queryParams.filter && typeof queryParams.filter === 'object') { // Ensure filter is object
      queryParams.filter.attributeId = params.attributeId;
    }
    delete queryParams.attributeId; // Clean up the top-level temporary attributeId

    // At this point, if params.filter was { someKey: 'someValue' } and params.attributeId was 'attr123',
    // queryParams.filter would be { someKey: 'someValue', attributeId: 'attr123' }
    // This is an OBJECT.

    const response = await api.get<IPaginatedData<IAttributeOptionResponse>>(
      attributeApiEndpoints.GET_PAGINATED_ATTRIBUTE_OPTIONS,
      { params: queryParams } // Axios will serialize this
    );
    return response.data;
  } catch (error: any) {
    // ... error handling ...
    throw error.response?.data || error;
  }
}

export async function getAttributeOptionById(
  optionId: string,
  projection?: string
): Promise<ApiResponse<IAttributeOptionResponse>> {
  try {
    const response = await api.get<ApiResponse<IAttributeOptionResponse>>(
      attributeApiEndpoints.GET_ATTRIBUTE_OPTION_BY_ID(optionId),
      { params: { fields: projection } }
    );
    return response.data;
  } catch (error: any) {
    console.error(
      `Error fetching attribute option by ID ${optionId}:`,
      error.response?.data || error.message
    );
    throw error.response?.data || error;
  }
}

export async function updateAttributeOption(
  optionId: string,
  payload: IAttributeOptionUpdatePayload
): Promise<ApiResponse<IAttributeOptionResponse>> {
  try {
    const response = await api.put<ApiResponse<IAttributeOptionResponse>>(
      attributeApiEndpoints.UPDATE_ATTRIBUTE_OPTION(optionId),
      payload
    );
    return response.data;
  } catch (error: any) {
    console.error(
      `Error updating attribute option ${optionId}:`,
      error.response?.data || error.message
    );
    throw error.response?.data || error;
  }
}

export async function deleteAttributeOption(
  optionId: string
): Promise<ApiResponse<null>> {
  try {
    const response = await api.delete<ApiResponse<null>>(
      attributeApiEndpoints.DELETE_ATTRIBUTE_OPTION(optionId)
    );
    return response.data;
  } catch (error: any) {
    console.error(
      `Error deleting attribute option ${optionId}:`,
      error.response?.data || error.message
    );
    throw error.response?.data || error;
  }
}
