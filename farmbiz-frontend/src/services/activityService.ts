import { apiService } from './apiService';
import { FarmingActivity, ActivityFormData, PaginatedResponse } from '../types';

export const activityService = {
  async getActivities(params?: {
    q?: string;
    farmer_id?: number;
    category?: string;
    page?: number;
  }): Promise<PaginatedResponse<FarmingActivity>> {
    const queryParams = new URLSearchParams();
    
    if (params?.q) queryParams.append('q', params.q);
    if (params?.farmer_id) queryParams.append('farmer_id', params.farmer_id.toString());
    if (params?.category) queryParams.append('category', params.category);
    if (params?.page) queryParams.append('page', params.page.toString());
    
    const url = `/activities/${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    const response = await apiService.get<PaginatedResponse<FarmingActivity>>(url);
    return response.data;
  },

  async getActivity(id: number): Promise<FarmingActivity> {
    const response = await apiService.get<FarmingActivity>(`/activities/${id}/`);
    return response.data;
  },

  async logActivity(activityData: ActivityFormData): Promise<FarmingActivity> {
    const formData = new FormData();
    
    formData.append('practice', activityData.practice);
    formData.append('category', activityData.category);
    formData.append('details', activityData.details);
    formData.append('input_quantity', activityData.input_quantity);
    formData.append('output_quantity', activityData.output_quantity);
    formData.append('weather_conditions', activityData.weather_conditions);
    
    if (activityData.image) {
      formData.append('image', activityData.image);
    }
    
    if (activityData.video) {
      formData.append('video', activityData.video);
    }
    
    const response = await apiService.uploadFile<FarmingActivity>('/log_activity/', formData);
    return response.data;
  },

  async updateActivity(id: number, activityData: Partial<ActivityFormData>): Promise<FarmingActivity> {
    const formData = new FormData();
    
    Object.entries(activityData).forEach(([key, value]) => {
      if (value !== undefined) {
        if ((key === 'image' || key === 'video') && value instanceof File) {
          formData.append(key, value);
        } else if (typeof value === 'string') {
          formData.append(key, value);
        }
      }
    });
    
    const response = await apiService.uploadFile<FarmingActivity>(`/activities/${id}/`, formData);
    return response.data;
  },

  async deleteActivity(id: number): Promise<void> {
    await apiService.delete(`/activities/${id}/`);
  }
};
