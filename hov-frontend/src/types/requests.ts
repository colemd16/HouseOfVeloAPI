import { Role, Handedness, Sport, DayOfWeek, PricingType } from './enums.ts';

// ============================================
// AUTH
// ============================================

export interface LoginRequest {
    email: string;
    password: string;
}

export interface SignupRequest {
    email: string;
    password: string;
    name: string;
    phone?: string;
    role: Role;
    // PLAYER-specific fields
    age?: number;
    position?: string;
    sport?: string;
    bats?: Handedness;
    throwingHand?: Handedness;
    imageUrl?: string;
    // TRAINER-specific fields
    bio?: string;
    sports?: Sport[];
}

// ============================================
// PLAYERS
// ============================================

export interface CreatePlayerRequest {
    name: string;
    age?: number;
    position?: string;
    sport?: string;
    bats?: Handedness;
    throwingHand?: Handedness;
    imageUrl?: string;
}

export interface UpdatePlayerRequest {
    name?: string;
    age?: number;
    position?: string;
    sport?: string;
    bats?: Handedness;
    throwingHand?: Handedness;
    imageUrl?: string;
}

// ============================================
// TRAINERS
// ============================================

export interface CreateTrainerRequest {
    bio?: string;
    sports: Sport[];
    isActive?: boolean;
}

export interface UpdateTrainerRequest {
    bio?: string;
    sports?: Sport[];
    imageUrl?: string;
    isActive?: boolean;
}

// ============================================
// AVAILABILITY
// ============================================

export interface CreateAvailabilityRequest {
    dayOfWeek: DayOfWeek;
    startTime: string; // "HH:mm" format
    endTime: string;   // "HH:mm" format
}

export interface UpdateAvailabilityRequest {
    dayOfWeek?: DayOfWeek;
    startTime?: string;
    endTime?: string;
    isAvailable?: boolean;
}

// ============================================
// SESSION TYPES (Admin)
// ============================================

export interface CreateSessionTypeRequest {
    name: string;
    description?: string;
    durationMinutes: number;
}

export interface UpdateSessionTypeRequest {
    name?: string;
    description?: string;
    durationMinutes?: number;
    isActive?: boolean;
}

// ============================================
// SESSION TYPE OPTIONS (Admin)
// ============================================

export interface CreateSessionTypeOptionRequest {
    name: string;
    description?: string;
    price: number;
    pricingType: PricingType;
    billingPeriodDays?: number;
    sessionsPerWeek?: number;
    autoRenew?: boolean;
    maxParticipants: number;
}

export interface UpdateSessionTypeOptionRequest {
    name?: string;
    description?: string;
    price?: number;
    pricingType?: PricingType;
    billingPeriodDays?: number;
    sessionsPerWeek?: number;
    autoRenew?: boolean;
    maxParticipants?: number;
    isActive?: boolean;
}

// ============================================
// BOOKINGS
// ============================================

export interface CreateBookingRequest {
    sessionTypeOptionId: number;
    trainerId: number;
    scheduledAt: string; // ISO datetime
    playerId?: number;
    notes?: string;
}

export interface CancelBookingRequest {
    reason?: string;
}

// ============================================
// PAYMENTS
// ============================================

export interface ProcessPaymentRequest {
    bookingId: number;
    sourceId?: string;     // Square nonce for CARD_ONLINE
    payInPerson?: boolean; // true = pay at location
    useToken?: boolean;    // true = use subscription token
}

export interface ReceivePaymentRequest {
    method: 'CASH' | 'CARD_IN_PERSON';
}

export interface RefundRequest {
    reason: string;
}

// ============================================
// SUBSCRIPTIONS
// ============================================

export interface CreateSubscriptionRequest {
    sessionTypeOptionId: number;
    playerId: number; // Required - the player this subscription is for
    tokensPerPeriod: number;
    autoRenew?: boolean;
}