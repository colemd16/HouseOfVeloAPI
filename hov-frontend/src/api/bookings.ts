import apiClient from './client';
import type {
    BookingResponse,
    CreateBookingRequest,
    CancelBookingRequest,
    BookingStatus,
} from '../types';

export const bookingsApi = {
    // User bookings
    create: async (data: CreateBookingRequest): Promise<BookingResponse> => {
        const response = await apiClient.post<BookingResponse>('/bookings', data);
        return response.data;
    },

    getMyBookings: async (): Promise<BookingResponse[]> => {
        const response = await apiClient.get<BookingResponse[]>('/bookings/me');
        return response.data;
    },

    getMyUpcoming: async (): Promise<BookingResponse[]> => {
        const response = await apiClient.get<BookingResponse[]>('/bookings/me/upcoming');
        return response.data;
    },

    getById: async (id: number): Promise<BookingResponse> => {
        const response = await apiClient.get<BookingResponse>(`/bookings/${id}`);
        return response.data;
    },

    cancel: async (id: number, data?: CancelBookingRequest): Promise<BookingResponse> => {
        const response = await apiClient.put<BookingResponse>(`/bookings/${id}/cancel`, data || {});
        return response.data;
    },

    // Trainer bookings
    trainer: {
        getMyBookings: async (): Promise<BookingResponse[]> => {
            const response = await apiClient.get<BookingResponse[]>('/trainers/me/bookings');
            return response.data;
        },

        getMyUpcoming: async (): Promise<BookingResponse[]> => {
            const response = await apiClient.get<BookingResponse[]>('/trainers/me/bookings/upcoming');
            return response.data;
        },

        markNoShow: async (id: number): Promise<BookingResponse> => {
            const response = await apiClient.put<BookingResponse>(`/bookings/${id}/no-show`);
            return response.data;
        },
    },

    // Admin bookings
    admin: {
        getAll: async (status?: BookingStatus): Promise<BookingResponse[]> => {
            const params = status ? { status } : {};
            const response = await apiClient.get<BookingResponse[]>('/admin/bookings', { params });
            return response.data;
        },

        updateStatus: async (id: number, status: BookingStatus): Promise<BookingResponse> => {
            const response = await apiClient.put<BookingResponse>(
                `/admin/bookings/${id}/status`,
                null,
                { params: { status } }
            );
            return response.data;
        },

        delete: async (id: number): Promise<void> => {
            await apiClient.delete(`/admin/bookings/${id}`);
        },

        autoComplete: async (): Promise<string> => {
            const response = await apiClient.post<string>('/admin/bookings/auto-complete');
            return response.data;
        },
    },
};