import API from './api';
import { Account } from '../types/Account';
import { User } from '../types/User';

export interface LoginRequest {
  username: string;
  password: string;
  platform: string;
}

export interface LoginResponse {
  account: Account;
  user: User;
  // Note: accessToken and refreshToken will be set in httpOnly cookies
  // not returned in the response body for web
}

export interface RefreshTokenRequest {
  platform: string;
}

export interface RefreshTokenResponse {
    // No token in the response because it is set in httpOnly cookies
  message: string;
}

class AuthService {
  /**
   * Login user with username and password
   */
  async login(loginData: LoginRequest): Promise<LoginResponse> {
    try {
      const response = await API.post('/auth/login', loginData);
      return response.data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  /**
   * Refresh access token using httpOnly cookies
   */
  async refreshToken(refreshData: RefreshTokenRequest): Promise<RefreshTokenResponse> {
    try {
      const response = await API.post('/auth/refresh-token', refreshData);
      return response.data;
    } catch (error) {
      console.error('Refresh token error:', error);
      throw error;
    }
  }
  /**
   * Logout user - clears httpOnly cookies
   */
  async logout(): Promise<void> {
    try {
      await API.post('/auth/logout', { platform: 'web' });
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  }
}

export default new AuthService();
