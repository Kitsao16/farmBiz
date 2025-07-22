import { apiService } from './apiService';
import { Business, BusinessFormData, PaginatedResponse } from '../types';

export const businessService = {
  async getBusinesses(params?: {
    q?: string;
    category?: string;
    page?: number;
  }): Promise<PaginatedResponse<Business>> {
    const queryParams = new URLSearchParams();
    
    if (params?.q) queryParams.append('q', params.q);
    if (params?.category) queryParams.append('category', params.category);
    if (params?.page) queryParams.append('page', params.page.toString());
    
    const url = `/list-businesses/${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    const response = await apiService.get<PaginatedResponse<Business>>(url);
    return response.data;
  },

  async getBusiness(id: number): Promise<Business> {
    const response = await apiService.get<Business>(`/businesses/${id}/`);
    return response.data;
  },

  async createBusiness(businessData: BusinessFormData): Promise<Business> {
    const formData = new FormData();
    
    formData.append('name', businessData.name);
    formData.append('description', businessData.description);
    formData.append('contact_info', businessData.contact_info);
    formData.append('category', businessData.category);
    formData.append('products_services', businessData.products_services);
    
    if (businessData.image) {
      formData.append('image', businessData.image);
    }
    
    const response = await apiService.uploadFile<Business>('/create-business/', formData);
    return response.data;
  },

  async updateBusiness(id: number, businessData: Partial<BusinessFormData>): Promise<Business> {
    const formData = new FormData();
    
    Object.entries(businessData).forEach(([key, value]) => {
      if (value !== undefined) {
        if (key === 'image' && value instanceof File) {
          formData.append(key, value);
        } else if (typeof value === 'string') {
          formData.append(key, value);
        }
      }
    });
    
    const response = await apiService.uploadFile<Business>(`/businesses/${id}/`, formData);
    return response.data;
  },

  async deleteBusiness(id: number): Promise<void> {
    await apiService.delete(`/businesses/${id}/`);
  }
};
