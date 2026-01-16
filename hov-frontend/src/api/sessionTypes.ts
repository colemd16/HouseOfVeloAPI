import apiClient from './client';
import type {
    SessionTypeResponse,
    SessionTypeOptionResponse,
    CreateSessionTypeRequest,
    UpdateSessionTypeRequest,
    CreateSessionTypeOptionRequest,
    UpdateSessionTypeOptionRequest,
} from '../types';

export const sessionTypesApi = {
    // Public
    getAll: async (): Promise<SessionTypeResponse[]> => {
        const response = await apiClient.get<SessionTypeResponse[]>('/session-types');
        return response.data;
    },

    getById: async (id: number): Promise<SessionTypeResponse> => {
        const response = await apiClient.get<SessionTypeResponse>(`/session-types/${id}`);
        return response.data;
    },

    getOptions: async (sessionTypeId: number): Promise<SessionTypeOptionResponse[]> => {
        const response = await apiClient.get<SessionTypeOptionResponse[]>(
            `/session-types/${sessionTypeId}/options`
        );
        return response.data;
    },

    getOption: async (sessionTypeId: number, optionId: number): Promise<SessionTypeOptionResponse> => {
        const response = await apiClient.get<SessionTypeOptionResponse>(
            `/session-types/${sessionTypeId}/options/${optionId}`
        );
        return response.data;
    },

    // Admin
    admin: {
        getAll: async (): Promise<SessionTypeResponse[]> => {
            const response = await apiClient.get<SessionTypeResponse[]>('/admin/session-types');
            return response.data;
        },

        create: async (data: CreateSessionTypeRequest): Promise<SessionTypeResponse> => {
            const response = await apiClient.post<SessionTypeResponse>('/admin/session-types', data);
            return response.data;
        },

        update: async (id: number, data: UpdateSessionTypeRequest): Promise<SessionTypeResponse> => {
            const response = await apiClient.put<SessionTypeResponse>(`/admin/session-types/${id}`, data);
            return response.data;
        },

        delete: async (id: number): Promise<void> => {
            await apiClient.delete(`/admin/session-types/${id}`);
        },

        getOptions: async (sessionTypeId: number): Promise<SessionTypeOptionResponse[]> => {
            const response = await apiClient.get<SessionTypeOptionResponse[]>(
                `/admin/session-types/${sessionTypeId}/options`
            );
            return response.data;
        },

        createOption: async (
            sessionTypeId: number,
            data: CreateSessionTypeOptionRequest
        ): Promise<SessionTypeOptionResponse> => {
            const response = await apiClient.post<SessionTypeOptionResponse>(
                `/admin/session-types/${sessionTypeId}/options`,
                data
            );
            return response.data;
        },

        updateOption: async (
            sessionTypeId: number,
            optionId: number,
            data: UpdateSessionTypeOptionRequest
        ): Promise<SessionTypeOptionResponse> => {
            const response = await apiClient.put<SessionTypeOptionResponse>(
                `/admin/session-types/${sessionTypeId}/options/${optionId}`,
                data
            );
            return response.data;
        },

        deleteOption: async (sessionTypeId: number, optionId: number): Promise<void> => {
            await apiClient.delete(`/admin/session-types/${sessionTypeId}/options/${optionId}`);
        },
    },
};