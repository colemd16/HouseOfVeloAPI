import apiClient from './client';
import type {
    CreateTrainerRequest,
    UpdateTrainerRequest,
    TrainerResponse,
    AvailabilityResponse,
    CreateAvailabilityRequest,
    UpdateAvailabilityRequest,
} from '../types';

export const trainersApi = {
    // Public
    getAll: async (): Promise<TrainerResponse[]> => {
        const response = await apiClient.get<TrainerResponse[]>('/trainers');
        return response.data;
    },

    getById: async (id: number): Promise<TrainerResponse> => {
        const response = await apiClient.get<TrainerResponse>(`/trainers/${id}`);
        return response.data;
    },

    getAvailability: async (trainerId: number): Promise<AvailabilityResponse[]> => {
        const response = await apiClient.get<AvailabilityResponse[]>(
            `/trainers/${trainerId}/availability`
        );
        return response.data;
    },

    // Authenticated (Trainer)
    getMe: async (): Promise<TrainerResponse> => {
        const response = await apiClient.get<TrainerResponse>('/trainers/me');
        return response.data;
    },

    updateMe: async (data: UpdateTrainerRequest): Promise<TrainerResponse> => {
        const response = await apiClient.put<TrainerResponse>('/trainers/me', data);
        return response.data;
    },

    create: async (data: CreateTrainerRequest): Promise<TrainerResponse> => {
        const response = await apiClient.post<TrainerResponse>('/trainers', data);
        return response.data;
    },

    // Availability management
    getMyAvailability: async (): Promise<AvailabilityResponse[]> => {
        const response = await apiClient.get<AvailabilityResponse[]>('/trainers/me/availability');
        return response.data;
    },

    createAvailability: async (data: CreateAvailabilityRequest): Promise<AvailabilityResponse> => {
        const response = await apiClient.post<AvailabilityResponse>(
            '/trainers/me/availability',
            data
        );
        return response.data;
    },

    updateAvailability: async (
        id: number,
        data: UpdateAvailabilityRequest
    ): Promise<AvailabilityResponse> => {
        const response = await apiClient.put<AvailabilityResponse>(
            `/trainers/me/availability/${id}`,
            data
        );
        return response.data;
    },

    deleteAvailability: async (id: number): Promise<void> => {
        await apiClient.delete(`/trainers/me/availability/${id}`);
    },
};