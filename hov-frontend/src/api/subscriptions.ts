import apiClient from './client';
import type { SubscriptionResponse, CreateSubscriptionRequest } from '../types';

export const subscriptionsApi = {
    create: async (data: CreateSubscriptionRequest): Promise<SubscriptionResponse> => {
        const response = await apiClient.post<SubscriptionResponse>('/subscriptions', data);
        return response.data;
    },

    getMy: async (): Promise<SubscriptionResponse[]> => {
        const response = await apiClient.get<SubscriptionResponse[]>('/subscriptions/me');
        return response.data;
    },

    getMyActive: async (): Promise<SubscriptionResponse> => {
        const response = await apiClient.get<SubscriptionResponse>('/subscriptions/me');
        return response.data;
    },

    getAll: async (): Promise<SubscriptionResponse[]> => {
        const response = await apiClient.get<SubscriptionResponse[]>('/subscriptions');
        return response.data;
    },

    getById: async (id: number): Promise<SubscriptionResponse> => {
        const response = await apiClient.get<SubscriptionResponse>(`/subscriptions/${id}`);
        return response.data;
    },
};