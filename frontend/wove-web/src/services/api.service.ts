import { User, AgeTier } from 'shared';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

interface LoginCredentials {
  email: string;
  password: string;
}

interface RegistrationData {
  email: string;
  password: string;
  username: string;
  ageTier: AgeTier;
  dateOfBirth?: string;
  parentEmail?: string;
}

interface Story {
  id: string;
  title: string;
  description?: string;
  coverImageUrl?: string;
  authorName: string;
  authorId: string;
  ageTier: string;
  tags?: string[];
  viewCount?: number;
  likeCount?: number;
  status: string;
  isPrivate: boolean;
  createdAt: string;
  updatedAt: string;
}

interface StorySegment {
  id: string;
  content: string;
  position: number;
  authorName?: string;
  storyId: string;
  createdAt: string;
}

interface CreateStoryData {
  title: string;
  description?: string;
  coverImageUrl?: string;
  ageTier: AgeTier;
  isPrivate: boolean;
  genreIds?: string[];
  premiseId?: string;
}

class ApiService {
  private token: string | null = null;

  constructor() {
    // Initialize token from localStorage if available
    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem('authToken');
    }
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`;
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({
          message: `HTTP ${response.status}: ${response.statusText}`,
        }));
        throw new Error(errorData.message || 'Request failed');
      }

      const data = await response.json();
      return {
        data,
        success: true,
      };
    } catch (error) {
      console.error(`API request failed for ${endpoint}:`, error);
      throw error;
    }
  }

  // Auth methods
  async login(credentials: LoginCredentials): Promise<{ user: User; token: string }> {
    const response = await this.request<{ user: User; token: string }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
    
    this.setToken(response.data.token);
    return response.data;
  }

  async register(registrationData: RegistrationData): Promise<{ user: User; token: string }> {
    const response = await this.request<{ user: User; token: string }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(registrationData),
    });
    
    this.setToken(response.data.token);
    return response.data;
  }

  async logout(): Promise<void> {
    await this.request('/auth/logout', {
      method: 'POST',
    });
    this.clearToken();
  }

  async getCurrentUser(): Promise<User> {
    const response = await this.request<User>('/auth/me');
    return response.data;
  }

  // Story methods
  async getStories(filters?: {
    status?: string;
    ageTier?: string;
    isPrivate?: boolean;
    query?: string;
    page?: number;
    limit?: number;
  }): Promise<{ stories: Story[]; total: number; page: number; limit: number }> {
    const queryParams = new URLSearchParams();
    
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, value.toString());
        }
      });
    }

    const endpoint = `/stories${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    const response = await this.request<{ stories: Story[]; total: number; page: number; limit: number }>(endpoint);
    return response.data;
  }

  async getPublicStories(filters?: {
    ageTier?: string;
    query?: string;
    genre?: string;
    sortBy?: string;
    page?: number;
    limit?: number;
  }): Promise<{ stories: Story[]; total: number; page: number; limit: number }> {
    const queryParams = new URLSearchParams();
    
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, value.toString());
        }
      });
    }

    const endpoint = `/stories/public${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    const response = await this.request<{ stories: Story[]; total: number; page: number; limit: number }>(endpoint);
    return response.data;
  }

  async getStory(storyId: string): Promise<Story> {
    const response = await this.request<Story>(`/stories/${storyId}`);
    return response.data;
  }

  async createStory(storyData: CreateStoryData): Promise<Story> {
    const response = await this.request<Story>('/stories', {
      method: 'POST',
      body: JSON.stringify(storyData),
    });
    return response.data;
  }

  async updateStory(storyId: string, updates: Partial<CreateStoryData>): Promise<Story> {
    const response = await this.request<Story>(`/stories/${storyId}`, {
      method: 'PATCH',
      body: JSON.stringify(updates),
    });
    return response.data;
  }

  async deleteStory(storyId: string): Promise<void> {
    await this.request(`/stories/${storyId}`, {
      method: 'DELETE',
    });
  }

  // Story segment methods
  async getStorySegments(storyId: string): Promise<StorySegment[]> {
    const response = await this.request<StorySegment[]>(`/stories/${storyId}/segments`);
    return response.data;
  }

  async addStorySegment(storyId: string, content: string): Promise<StorySegment> {
    const response = await this.request<StorySegment>(`/stories/${storyId}/segments`, {
      method: 'POST',
      body: JSON.stringify({ content }),
    });
    return response.data;
  }

  async updateStorySegment(storyId: string, segmentId: string, content: string): Promise<StorySegment> {
    const response = await this.request<StorySegment>(`/stories/${storyId}/segments/${segmentId}`, {
      method: 'PATCH',
      body: JSON.stringify({ content }),
    });
    return response.data;
  }

  async deleteStorySegment(storyId: string, segmentId: string): Promise<void> {
    await this.request(`/stories/${storyId}/segments/${segmentId}`, {
      method: 'DELETE',
    });
  }

  // Token management
  setToken(token: string): void {
    this.token = token;
    if (typeof window !== 'undefined') {
      localStorage.setItem('authToken', token);
    }
  }

  clearToken(): void {
    this.token = null;
    if (typeof window !== 'undefined') {
      localStorage.removeItem('authToken');
    }
  }

  getToken(): string | null {
    return this.token;
  }

  isAuthenticated(): boolean {
    return !!this.token;
  }
}

// Export singleton instance
export const apiService = new ApiService();
export default apiService;