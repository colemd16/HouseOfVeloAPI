import apiClient from './client';
import type { CreatePlayerRequest, UpdatePlayerRequest, PlayerResponse } from "../types";

export const playersApi = {
    getMyPlayers: async (): Promise<PlayerResponse[]> => {
        const response = await apiClient.get<PlayerResponse[]>('/players');
        return response.data;
    },

    getById: async (id: number): Promise<PlayerResponse> => {
        const response = await apiClient.get<PlayerResponse>(`/players/${id}`);
        return response.data;
    },

    create: async(data: CreatePlayerRequest): Promise<PlayerResponse> => {
        const response = await apiClient.post<PlayerResponse>('/players', data);
        return response.data;
    },

    update: async(id: number, data: UpdatePlayerRequest): Promise<PlayerResponse> => {
        const response = await apiClient.put<PlayerResponse>(`/players/${id}`, data);
        return response.data;
    },

    delete: async (id: number): Promise<void> => {
        await apiClient.delete(`/players/${id}`);
    },
};