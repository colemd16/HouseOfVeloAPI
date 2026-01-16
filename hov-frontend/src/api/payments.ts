import apiClient from './client';
import type {
    PaymentResponse,
    ProcessPaymentRequest,
    ReceivePaymentRequest,
    RefundRequest,
} from '../types';

export const paymentsApi = {
    // User payments
    process: async (data: ProcessPaymentRequest): Promise<PaymentResponse> => {
        const response = await apiClient.post<PaymentResponse>('/payments', data);
        return response.data;
    },

    getMyPayments: async (): Promise<PaymentResponse[]> => {
        const response = await apiClient.get<PaymentResponse[]>('/payments');
        return response.data;
    },

    getByBookingId: async (bookingId: number): Promise<PaymentResponse> => {
        const response = await apiClient.get<PaymentResponse>(`/payments/booking/${bookingId}`);
        return response.data;
    },

    // Trainer/Admin - receive in-person payment
    receive: async (paymentId: number, data: ReceivePaymentRequest): Promise<PaymentResponse> => {
        const response = await apiClient.put<PaymentResponse>(`/payments/${paymentId}/receive`, data);
        return response.data;
    },

    // Trainer/Admin - refund
    refund: async (paymentId: number, data: RefundRequest): Promise<PaymentResponse> => {
        const response = await apiClient.post<PaymentResponse>(`/payments/${paymentId}/refund`, data);
        return response.data;
    },
};