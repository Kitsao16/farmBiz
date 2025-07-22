import { apiService } from './apiService';
import { LoginCredentials, RegisterData, AuthResponse } from '../types';

export const authService = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await apiService.post<AuthResponse>('/login/', credentials);
    
    // Store tokens in localStorage
    localStorage.setItem('accessToken', response.data.access);
    localStorage.setItem('refreshToken', response.data.refresh);
    
    return response.data;
  },

  async register(userData: RegisterData): Promise<{ message: string }> {
    const response = await apiService.post<{ message: string }>('/register/', userData);
    return response.data;
  },

  async logout(): Promise<void> {
    try {
      await apiService.post('/logout/');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear tokens regardless of API call success
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
    }
  },

  async getAuthStatus(): Promise<{ authenticated: boolean; user: string; user_type: string }> {
    const response = await apiService.get<{ authenticated: boolean; user: string; user_type: string }>('/auth/status/');
    return response.data;
  },

  isAuthenticated(): boolean {
    return !!localStorage.getItem('accessToken');
  },

  getAccessToken(): string | null {
    return localStorage.getItem('accessToken');
  },

  getRefreshToken(): string | null {
    return localStorage.getItem('refreshToken');
  }
};
