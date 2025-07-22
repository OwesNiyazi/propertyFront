const BASE_URL = 'https://propbackend.onrender.com/api';

export interface User {
  _id: string;
  username: string;
  email: string;
  isAdmin?: boolean;
}

export interface ImageCard {
  listing: string;
  _id: string;
  title: string;
  description?: string;
  price?: number;
  type?: string;
  propertyType: string;
  location?: string;
  imageUrls: string[];
  userId?: string;
  createdBy?: User | string;
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

  public getHeaders() {
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

  async updateImage(id: string, title: string, description?: string, price?: string, type?: string, location?: string, imageFile?: File, propertyType?: string): Promise<ImageCard> {
    const formData = new FormData();
    formData.append('title', title);
    if (description !== undefined) formData.append('description', description);
    if (price !== undefined) formData.append('price', price);
    if (type !== undefined) formData.append('type', type);
    if (location !== undefined) formData.append('location', location);
    if (propertyType !== undefined) formData.append('propertyType', propertyType);
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

  // Multi-image upload
  async uploadImages(data: {
    title: string;
    description: string;
    type: string;
    subtype: string;
    price: number;
    location: string;
    images: File[];
    propertyType: string;
  }): Promise<any> {
    const formData = new FormData();
    formData.append('title', data.title);
    formData.append('description', data.description);
    formData.append('type', data.type);
    formData.append('subtype', data.subtype);
    formData.append('price', String(data.price));
    formData.append('location', data.location);
    formData.append('propertyType', data.propertyType);
    data.images.forEach((file) => formData.append('image', file));

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

  // Admin: Get all images
  async getAllImages(): Promise<ImageCard[]> {
    const response = await fetch(`${BASE_URL}/images/all`, {
      headers: this.getHeaders(),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to fetch all images');
    }
    return response.json();
  }

  // Admin: Get all users
  async getAllUsers(): Promise<User[]> {
    const response = await fetch(`${BASE_URL}/auth/users`, {
      headers: this.getHeaders(),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to fetch users');
    }
    return response.json();
  }

  // Admin: Update user
  async updateUser(id: string, data: { username?: string; email?: string }): Promise<any> {
    const response = await fetch(`${BASE_URL}/auth/users/${id}`, {
      method: 'PUT',
      headers: {
        ...this.getHeaders(),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to update user');
    }
    return response.json();
  }

  // Admin: Delete user
  async deleteUser(id: string): Promise<void> {
    const response = await fetch(`${BASE_URL}/auth/users/${id}`, {
      method: 'DELETE',
      headers: this.getHeaders(),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to delete user');
    }
  }

  async adminCreateUser(data: { username: string; email: string; password: string; isAdmin: boolean }): Promise<User> {
    const response = await fetch(`${BASE_URL}/auth/users`, {
      method: 'POST',
      headers: {
        ...this.getHeaders(),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to create user');
    }
    return response.json();
  }

  async adminUpdateUser(id: string, data: { username?: string; email?: string; password?: string; isAdmin?: boolean }): Promise<User> {
    const response = await fetch(`${BASE_URL}/auth/users/${id}`, {
      method: 'PUT',
      headers: {
        ...this.getHeaders(),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to update user');
    }
    return response.json();
  }

  // Update image (support JSON or multipart)
  async updateImageFlexible(id: string, data: {
    title?: string;
    description?: string;
    type?: string;
    subtype?: string;
    price?: number;
    location?: string;
    image?: File;
  }): Promise<any> {
    let body: FormData | string;
    let headers = this.getHeaders();
    if (data.image) {
      // Use multipart
      const formData = new FormData();
      if (data.title) formData.append('title', data.title);
      if (data.description) formData.append('description', data.description);
      if (data.type) formData.append('type', data.type);
      if (data.subtype) formData.append('subtype', data.subtype);
      if (data.price !== undefined) formData.append('price', String(data.price));
      if (data.location) formData.append('location', data.location);
      formData.append('image', data.image);
      body = formData;
    } else {
      // Use JSON
      headers = { ...headers, 'Content-Type': 'application/json' };
      body = JSON.stringify(data);
    }
    const response = await fetch(`${BASE_URL}/images/${id}`, {
      method: 'PUT',
      headers,
      body,
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Update failed');
    }
    return response.json();
  }
}

export const apiService = new ApiService();