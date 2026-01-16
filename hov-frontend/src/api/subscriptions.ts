import apiClient from './client';
import type { SubscriptionResponse } from '../types';

export const subscriptionsApi = {
    getMy: async (): Promise<SubscriptionResponse[]> => {
        const response = await apiClient.get<SubscriptionResponse[]>('/subscriptions/me');
        return response.data;
    },

    getById: async (id: number): Promise<SubscriptionResponse> => {
        const response = await apiClient.get<SubscriptionResponse>(`/subscriptions/${id}`);
        return response.data;
    },
};