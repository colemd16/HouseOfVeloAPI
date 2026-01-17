import {
    Role,
    Handedness,
    Sport,
    DayOfWeek,
    PricingType,
    BookingStatus,
    PaymentStatus,
    PaymentMethod,
    SubscriptionStatus,
} from './enums.ts';

// ============================================
// AUTH
// ============================================

export interface AuthResponse {
    token: string;
    email: string;
    name: string;
    role: Role;
    userId: number;
}

// ============================================
// PLAYERS
// ============================================

export interface PlayerResponse {
    id: number;
    name: string;
    age: number | null;
    position: string | null;
    sport: string | null;
    bats: Handedness | null;
    throwingHand: Handedness | null;
    imageUrl: string | null;
    createdAt: string;
    updatedAt: string;
    independent: boolean;
}

// ============================================
// TRAINERS
// ============================================

export interface TrainerResponse {
    id: number;
    userId: number;
    name: string;
    bio: string | null;
    sports: Sport[];
    isActive: boolean;
    imageUrl: string | null;
    createdAt: string;
    updatedAt: string;
}

// ============================================
// AVAILABILITY
// ============================================

export interface AvailabilityResponse {
    id: number;
    trainerId: number;
    dayOfWeek: DayOfWeek;
    startTime: string;
    endTime: string;
    isAvailable: boolean;
    createdAt: string;
    updatedAt: string;
}

// ============================================
// SESSION TYPES
// ============================================

export interface SessionTypeResponse {
    id: number;
    name: string;
    description: string | null;
    durationMinutes: number;
    isActive: boolean;
    options: SessionTypeOptionResponse[] | null;
    createdAt: string;
    updatedAt: string;
}

export interface SessionTypeOptionResponse {
    id: number;
    sessionTypeId: number;
    sessionTypeName: string;
    name: string;
    description: string | null;
    price: number;
    pricingType: PricingType;
    billingPeriodDays: number | null;
    sessionsPerWeek: number | null;
    autoRenew: boolean | null;
    maxParticipants: number;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

// ============================================
// BOOKINGS
// ============================================

export interface BookingResponse {
    id: number;
    userId: number;
    userName: string;
    playerName: string | null;
    sessionTypeOptionId: number;
    sessionTypeName: string;
    sessionTypeOptionName: string;
    trainerId: number;
    trainerName: string;
    scheduledAt: string;
    durationMinutes: number;
    status: BookingStatus;
    pricePaid: number;
    notes: string | null;
    createdAt: string;
    updatedAt: string;
    cancellationReason: string | null;
}

// ============================================
// PAYMENTS
// ============================================

export interface PaymentResponse {
    id: number;
    userId: number;
    bookingId: number | null;
    squarePaymentId: string | null;
    squareRefundId?: string | null;
    status: PaymentStatus;
    method: PaymentMethod;
    amount: number;
    currency: string;
    paidAt: string | null;
    refundedAt?: string | null;
    refundReason?: string | null;
    createdAt: string;
}

// ============================================
// SUBSCRIPTIONS
// ============================================

export interface SubscriptionResponse {
    id: number;
    userId: number;
    playerId: number;
    playerName: string;
    sessionTypeOptionId: number;
    sessionTypeName: string | null;
    sessionTypeOptionName: string | null;
    status: SubscriptionStatus;
    currentPeriodStart: string;
    currentPeriodEnd: string;
    tokensPerPeriod: number;
    tokensRemaining: number;
    autoRenew: boolean;
    createdAt: string;
}

// ============================================
// ERRORS
// ============================================

export interface ApiError {
    status: number;
    message: string;
    timestamp: string;
}

export interface ValidationErrors {
    [field: string]: string;
}