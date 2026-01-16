// src/types/enums.ts

export const Role = {
    PARENT: 'PARENT',
    PLAYER: 'PLAYER',
    ADMIN: 'ADMIN',
    TRAINER: 'TRAINER',
    SCOUT: 'SCOUT',
} as const;
export type Role = typeof Role[keyof typeof Role];

export const BookingStatus = {
    UNPAID: 'UNPAID',
    CONFIRMED: 'CONFIRMED',
    COMPLETED: 'COMPLETED',
    CANCELLED: 'CANCELLED',
    NO_SHOW: 'NO_SHOW',
} as const;
export type BookingStatus = typeof BookingStatus[keyof typeof BookingStatus];

export const PaymentStatus = {
    PENDING: 'PENDING',
    COMPLETED: 'COMPLETED',
    REFUNDED: 'REFUNDED',
    FAILED: 'FAILED',
} as const;
export type PaymentStatus = typeof PaymentStatus[keyof typeof PaymentStatus];

export const PaymentMethod = {
    CARD_ONLINE: 'CARD_ONLINE',
    CARD_IN_PERSON: 'CARD_IN_PERSON',
    CASH: 'CASH',
    TOKEN: 'TOKEN',
} as const;
export type PaymentMethod = typeof PaymentMethod[keyof typeof PaymentMethod];

export const PricingType = {
    ONE_TIME: 'ONE_TIME',
    SUBSCRIPTION: 'SUBSCRIPTION',
} as const;
export type PricingType = typeof PricingType[keyof typeof PricingType];

export const Sport = {
    BASEBALL: 'BASEBALL',
    SOFTBALL: 'SOFTBALL',
} as const;
export type Sport = typeof Sport[keyof typeof Sport];

export const Handedness = {
    L: 'L',
    R: 'R',
    S: 'S',
} as const;
export type Handedness = typeof Handedness[keyof typeof Handedness];

export const SubscriptionStatus = {
    ACTIVE: 'ACTIVE',
    CANCELLED: 'CANCELLED',
    PAUSED: 'PAUSED',
    EXPIRED: 'EXPIRED',
} as const;
export type SubscriptionStatus = typeof SubscriptionStatus[keyof typeof SubscriptionStatus];

export const TokenTransactionType = {
    GRANTED: 'GRANTED',
    USED: 'USED',
    RETURNED: 'RETURNED',
    EXPIRED: 'EXPIRED',
} as const;
export type TokenTransactionType = typeof TokenTransactionType[keyof typeof TokenTransactionType];

export const DayOfWeek = {
    MONDAY: 'MONDAY',
    TUESDAY: 'TUESDAY',
    WEDNESDAY: 'WEDNESDAY',
    THURSDAY: 'THURSDAY',
    FRIDAY: 'FRIDAY',
    SATURDAY: 'SATURDAY',
    SUNDAY: 'SUNDAY',
} as const;
export type DayOfWeek = typeof DayOfWeek[keyof typeof DayOfWeek];