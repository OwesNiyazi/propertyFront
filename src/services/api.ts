const BASE_URL = 'https://propbackend.onrender.com/api';

export interface User {
  _id: string;
  username: string;
  email: string;
}

export interface ImageCard {
  _id: string;
  title: string;
  description?: string;
  price?: number;
  type?: string;
  location?: string;
  imageUrl: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  token: string;
  user: User;
  message?: string;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
}

export interface LoginData {
  email: string;
  password: string;
}

class ApiService {
  private token: string | null = null;

  constructor() {
    this.token = localStorage.getItem('token');
  }

  setToken(token: string) {
    this.token = token;
    localStorage.setItem('token', token);
  }

  removeToken() {
    this.token = null;
    localStorage.removeItem('token');
  }

  private getHeaders() {
    const headers: Record<string, string> = {};
    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`;
    }
    return headers;
  }

  async register(data: RegisterData): Promise<AuthResponse> {
    const response = await fetch(`${BASE_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Registration failed');
    }

    return response.json();
  }

  async login(data: LoginData): Promise<AuthResponse> {
    const response = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Login failed');
    }

    const result = await response.json();
    this.setToken(result.token);
    return result;
  }

  async uploadImage(title: string, imageFile: File, description?: string, price?: string, type?: string, location?: string): Promise<ImageCard> {
    const formData = new FormData();
    formData.append('title', title);
    formData.append('image', imageFile);
    if (description) formData.append('description', description);
    if (price) formData.append('price', price);
    if (type) formData.append('type', type);
    if (location) formData.append('location', location);

    const response = await fetch(`${BASE_URL}/images/upload`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Upload failed');
    }

    return response.json();
  }

  async getImages(): Promise<ImageCard[]> {
    const response = await fetch(`${BASE_URL}/images`, {
      headers: {
        ...this.getHeaders(),
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to fetch images');
    }

    return response.json();
  }

  async updateImage(id: string, title: string, description?: string, price?: string, type?: string, location?: string, imageFile?: File): Promise<ImageCard> {
    const formData = new FormData();
    formData.append('title', title);
    if (description !== undefined) formData.append('description', description);
    if (price !== undefined) formData.append('price', price);
    if (type !== undefined) formData.append('type', type);
    if (location !== undefined) formData.append('location', location);
    if (imageFile) formData.append('image', imageFile);

    const response = await fetch(`${BASE_URL}/images/${id}`, {
      method: 'PUT',
      headers: this.getHeaders(),
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Update failed');
    }

    return response.json();
  }

  async deleteImage(id: string): Promise<void> {
    const response = await fetch(`${BASE_URL}/images/${id}`, {
      method: 'DELETE',
      headers: this.getHeaders(),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Delete failed');
    }
  }
}

export const apiService = new ApiService();