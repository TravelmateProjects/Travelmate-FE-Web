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

  /**
   * Gửi email quên mật khẩu
   */
  async forgotPassword(data: { email: string }): Promise<void> {
    try {
      await API.post('/auth/forgot-password', data);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Xác thực OTP quên mật khẩu
   */
  async verifyForgotOtp(data: { email: string; otp: string }): Promise<void> {
    try {
      await API.post('/auth/verify-forgot-otp', data);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Đặt lại mật khẩu mới
   */
  async resetPassword(data: { email: string; otp: string; newPassword: string }): Promise<void> {
    try {
      await API.post('/auth/reset-password', data);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Tạo partner mới (admin)
   */
  async createPartner(data: { fullName: string; email: string; phone: string; username: string }): Promise<void> {
    try {
      await API.post('/auth/create-partner', data);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Đổi mật khẩu khi đã đăng nhập
   */
  async changePassword(data: { oldPassword: string; newPassword: string; confirmPassword: string }): Promise<void> {
    try {
      await API.post('/auth/change-password', data, { withCredentials: true });
    } catch (error) {
      throw error;
    }
  }
}

export default new AuthService();
