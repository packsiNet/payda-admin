import { http } from './client'
import type {
  LoginResponse, User, UserDetail, PendingKycUser, ExchangeRate, Tier,
  RequestItem, RequestSearchResult, AdminRequestItem, Transaction,
} from './types'
import { Currency, CurrencyLabel, RequestType, TransactionStatus } from './types'

const REQUEST_TYPE_STR: Record<RequestType, string> = {
  [RequestType.Send]: 'Send',
  [RequestType.Receive]: 'Receive',
}

export const authApi = {
  adminLogin: (user: {
    id: string; authDate: string; hash: string
    firstName: string | null; lastName: string | null
    username: string | null; photoUrl: string | null
  }) => http.post<LoginResponse>('/auth/admin-login', user),
}

export const usersApi = {
  getAll:        (page = 1, pageSize = 20) => http.get<User[]>(`/users?page=${page}&pageSize=${pageSize}`),
  getMe:         ()         => http.get<UserDetail>('/users/me'),
  getById:       (id: string) => http.get<UserDetail>(`/users/${id}`),
  getPendingKyc: (page = 1, pageSize = 20) => http.get<PendingKycUser[]>(`/users/pending-kyc?page=${page}&pageSize=${pageSize}`),
  approveKyc:    (id: string) => http.post<void>(`/users/${id}/approve-kyc`),
  rejectKyc:     (id: string) => http.post<void>(`/users/${id}/reject-kyc`),
  setTrusted:    (id: string, isTrusted: boolean) => http.post<void>(`/users/${id}/trusted`, { isTrusted }),
  setRole:       (id: string, role: number)       => http.post<void>(`/users/${id}/role`, { role }),
}

export const ratesApi = {
  getAll:  ()                                                                    => http.get<ExchangeRate[]>('/exchangerates'),
  update:  (currency: Currency, marketRate: number, instantRate: number) =>
    http.put<void>('/exchangerates', { currency, marketRate, instantRate }),
}

export const tiersApi = {
  getAll: ()                         => http.get<Tier[]>('/tiers'),
  create: (data: Omit<Tier, 'id'>)   => http.post<{ id: string }>('/tiers', data),
  update: (id: string, data: Omit<Tier, 'id'>) => http.put<void>(`/tiers/${id}`, data),
}

export const requestsApi = {
  search: (type: RequestType, currency: Currency, amount?: number) => {
    const q = new URLSearchParams({ type: String(type), currency: String(currency) })
    if (amount) q.set('amount', String(amount))
    return http.get<RequestSearchResult[]>(`/requests/search?${q}`)
  },
  getAll: (type?: RequestType) =>
    http.get<RequestItem[]>(`/requests${type !== undefined ? `?type=${type}` : ''}`),
  adminGetAll: (type: RequestType, currency: Currency, amount?: number) => {
    const q = new URLSearchParams({ type: REQUEST_TYPE_STR[type], currency: CurrencyLabel[currency] })
    if (amount) q.set('amount', String(amount))
    return http.get<AdminRequestItem[]>(`/requests/admin?${q}`)
  },
}

export const matchesApi = {
  createAdmin: (senderRequestId: string, receiverRequestId: string, price: number, isAgentInvolved: boolean) =>
    http.post<{ id: string }>('/matches/admin', { senderRequestId, receiverRequestId, price, isAgentInvolved }),
}

export const settingsApi = {
  getMatchConfirmationHours: () => http.get<{ hours: number }>('/settings/match-confirmation-hours'),
  setMatchConfirmationHours: (hours: number) => http.put<void>('/settings/match-confirmation-hours', { hours }),
}

export const transactionsApi = {
  getAll: (params?: { type?: RequestType; status?: TransactionStatus; page?: number; pageSize?: number }) => {
    const q = new URLSearchParams()
    if (params?.type     !== undefined) q.set('type',     String(params.type))
    if (params?.status   !== undefined) q.set('status',   String(params.status))
    if (params?.page)                   q.set('page',     String(params.page))
    if (params?.pageSize)               q.set('pageSize', String(params.pageSize))
    return http.get<Transaction[]>(`/transactions?${q}`)
  },
}
