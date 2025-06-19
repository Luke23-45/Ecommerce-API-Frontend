


import apiClient from '@/api';
import {
  type PlaceOrderRequestDTO,
  type GetUserOrdersRequestParams,
  type OrderDocument,
  type PaginatedOrdersResult,
} from '@/types/order.types'; 


type ApiResponse<T> = {
  success: boolean;
  data: T; 
  order?: T; 
  message?: string;
  statusCode: number;
};

export const orderApi = {
  /**
   * Places a new order.
   * Corresponds to: POST /api/orders/placeorder
   */
  placeOrder: async (payload: PlaceOrderRequestDTO): Promise<OrderDocument> => {
    const response = await apiClient.post<ApiResponse<OrderDocument>>('/orders/placeorder', payload);
    
    if (response.data.order) {
      return response.data.order;
    }
    
    return response.data.data; 
  },

  /**
   * Fetches a paginated list of orders for the authenticated user.
   * Corresponds to: GET /api/orders/getorder
   */
  getUserOrders: async (params: GetUserOrdersRequestParams): Promise<PaginatedOrdersResult> => {
    
    const queryParams = new URLSearchParams();
    if (params.page) queryParams.append('page', params.page.toString());
    if (params.limit) queryParams.append('limit', params.limit.toString());
    if (params.status && params.status !== 'all') queryParams.append('status', params.status);
    if (params.sort) queryParams.append('sort', params.sort);
    

    const response = await apiClient.get<ApiResponse<PaginatedOrdersResult>>(
      `/orders/getorder?${queryParams.toString()}`
    );
    return response.data.data;
  },

  /**
   * Fetches the details of a single order by its ID.
   * Corresponds to: GET /api/orders/get/:orderId
   */
  getOrderById: async (orderId: string): Promise<OrderDocument> => {
    const response = await apiClient.get<ApiResponse<OrderDocument>>(`/orders/get/${orderId}`);
    
    if (response.data.order) {
        return response.data.order;
    }
    return response.data.data;
  },

  /**
   * Cancels an order.
   * Corresponds to: PATCH /api/orders/:orderId/cancel
   */
  cancelOrder: async (orderId: string): Promise<OrderDocument> => {
    const response = await apiClient.patch<ApiResponse<OrderDocument>>(
      `/orders/${orderId}/cancel`
    );
    
     if (response.data.order) {
        return response.data.order;
    }
    return response.data.data;
  },
};