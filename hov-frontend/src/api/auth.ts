import apiClient from './client';
import type { LoginRequest, SignupRequest, AuthResponse } from "../types";

export const authApi = {
    login: async (data: LoginRequest): Promise<AuthResponse> => {
        const response = await apiClient.post<AuthResponse>('/auth/login', data);
        return response.data;
    },

    signup: async (data: SignupRequest): Promise<AuthResponse> => {
        const response = await apiClient.post<AuthResponse>('auth/signup', data);
        return response.data;
    },
};