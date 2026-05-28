export enum Currency { EUR = 0, USD = 1, CAD = 2 }
export enum KycStatus { NotSubmitted = 0, Pending = 1, Approved = 2, Rejected = 3 }
export enum UserRole { User = 0, Agent = 1, Admin = 2 }
export enum RequestType { Send = 0, Receive = 1 }
export enum RequestStatus { Pending = 0, Matched = 1, Expired = 2, Cancelled = 3 }
export enum RateType { Market = 0, Instant = 1, Custom = 2 }
export enum PaymentMethod { Revolut = 0, Zelle = 1, PayPal = 2, SEPA = 3, Wire = 4 }
export enum TransactionStatus { Pending = 0, ScreenshotUploaded = 1, Confirmed = 2, Settled = 3, Disputed = 4 }
export enum MatchStatus { Active = 0, Completed = 1, Cancelled = 2 }

export const CurrencyLabel: Record<Currency, string> = {
  [Currency.EUR]: 'EUR', [Currency.USD]: 'USD', [Currency.CAD]: 'CAD',
}
export const KycStatusLabel: Record<KycStatus, string> = {
  [KycStatus.NotSubmitted]: 'Not Submitted',
  [KycStatus.Pending]: 'Pending',
  [KycStatus.Approved]: 'Approved',
  [KycStatus.Rejected]: 'Rejected',
}
export const UserRoleLabel: Record<UserRole, string> = {
  [UserRole.User]: 'User', [UserRole.Agent]: 'Agent', [UserRole.Admin]: 'Admin',
}
export const RequestStatusLabel: Record<RequestStatus, string> = {
  [RequestStatus.Pending]: 'Pending', [RequestStatus.Matched]: 'Matched',
  [RequestStatus.Expired]: 'Expired', [RequestStatus.Cancelled]: 'Cancelled',
}
export const TransactionStatusLabel: Record<TransactionStatus, string> = {
  [TransactionStatus.Pending]: 'Pending',
  [TransactionStatus.ScreenshotUploaded]: 'Screenshot Uploaded',
  [TransactionStatus.Confirmed]: 'Confirmed',
  [TransactionStatus.Settled]: 'Settled',
  [TransactionStatus.Disputed]: 'Disputed',
}

export interface User {
  id: string
  telegramId: number
  telegramUsername: string | null
  firstName: string | null
  lastName: string | null
  kycStatus: KycStatus
  role: UserRole
  isTrusted: boolean
  tierName: string
  createdAt: string
  selfieImageUrl: string | null
  documentImageUrl: string | null
}

export interface UserDetail extends User {
  tierOrder: number
  completedTransactionsCount: number
  phoneVerified: boolean
  selfieImageUrl: string | null
  documentImageUrl: string | null
}

export interface PendingKycUser {
  id: string
  telegramId: number
  telegramUsername: string | null
  firstName: string | null
  lastName: string | null
  dateOfBirth: string | null
  phoneNumber: string | null
  selfieImageUrl: string
  documentImageUrl: string
  kycSubmittedAt: string
}

export interface ExchangeRate {
  currency: Currency
  marketRate: number
  instantRate: number
  updatedAt: string | null
}

export interface Tier {
  id: string
  name: string
  order: number
  maxActiveRequests: number
  maxAmountPerRequest: number
  requiredCompletedTransactions: number
}

export interface RequestItem {
  id: string
  type: RequestType
  currency: Currency
  amount: number
  rateValue: number
  paymentMethods: string[]
  status: RequestStatus
  expiresAt: string
  createdAt: string
  ownerAvatarInitials: string
  ownerProfilePhotoUrl: string | null
  ownerDisplayName: string
  ownerIsTrusted: boolean
  ownerTierName: string
  ownerTierOrder: number
}

export interface RequestSearchResult {
  requestId: string
  userInitials: string
  userDisplayName: string
  userLevel: number
  userLevelTitle: string
  isTrusted: boolean
  amount: number
  rateValue: number
  paymentMethods: string[]
  createdAt: string
}

export interface AdminRequestItem {
  id: string
  type: RequestType
  currency: Currency
  amount: number
  rateValue: number
  paymentMethods: string[]
  expiresAt: string
  createdAt: string
  userDisplayName: string
  userInitials: string
  userTierOrder: number
  userTierName: string
  userIsTrusted: boolean
}

export interface Transaction {
  id: string
  matchId: string
  status: TransactionStatus
  referenceCode: string | null
  myRole: RequestType
  currency: Currency
  amount: number
  rateValue: number
  paymentMethod: string | null
  counterpartDisplayName: string
  counterpartLevel: number
  counterpartLevelTitle: string
  counterpartIsTrusted: boolean
  screenshotUrl: string | null
  paidAt: string | null
  settledAt: string | null
  createdAt: string
}

export interface LoginResponse {
  token: string
  isNewUser: boolean
  kycStatus: KycStatus
}

export interface ApiError {
  type?: string
  title?: string
  status?: number
  detail?: string
  errors?: Record<string, string[]>
}
