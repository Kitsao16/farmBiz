// Auth types
export interface User {
  id: number;
  username: string;
  email: string;
  user_type: 'farmer' | 'business_owner';
}

export interface AuthState {
  isLoggedIn: boolean;
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  loading: boolean;
  error: string | null;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
  password_confirm: string;
  user_type: 'farmer' | 'business_owner';
}

export interface AuthResponse {
  access: string;
  refresh: string;
  user: string;
  user_type: string;
}

// Farmer types
export interface Tier {
  id: number;
  name: string;
  description: string;
  benefits: string;
  requirements: string;
}

export interface Farmer {
  id: number;
  name: string;
  location: string;
  contact_details: string;
  experience_level: 'beginner' | 'intermediate' | 'advanced';
  specialization: string;
  farm_size: number;
  farm_type: 'arable' | 'pasture' | 'mixed';
  equipment: string;
  certifications: string;
  tier: Tier | null;
}

// Business types
export interface Review {
  id: number;
  user: string;
  rating: number;
  comment: string;
  date: string;
}

export interface Business {
  id: number;
  name: string;
  description: string;
  contact_info: string;
  category: 'farm_produce' | 'agritourism' | 'farm_supplies' | 'services';
  products_services: string;
  image: string | null;
  farmer: Farmer;
  reviews: Review[];
  average_rating: number | null;
}

// Farming Activity types
export interface FarmingActivity {
  id: number;
  farmer: Farmer;
  practice: string;
  category: 'planting' | 'harvesting' | 'livestock_management' | 'soil_preparation';
  details: string;
  input_quantity: string;
  output_quantity: string;
  weather_conditions: string;
  image: string | null;
  video: string | null;
  date: string;
  block_hash: string;
}

// API Response types
export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export interface ApiError {
  message: string;
  errors?: Record<string, string[]>;
}

// Form types
export interface BusinessFormData {
  name: string;
  description: string;
  contact_info: string;
  category: Business['category'];
  products_services: string;
  image?: File;
}

export interface ActivityFormData {
  practice: string;
  category: FarmingActivity['category'];
  details: string;
  input_quantity: string;
  output_quantity: string;
  weather_conditions: string;
  image?: File;
  video?: File;
}

export interface ReviewFormData {
  business_id: number;
  rating: number;
  comment: string;
}
