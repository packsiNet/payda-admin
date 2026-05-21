export const TOKEN_KEY = 'admin_token'
const API_BASE = (import.meta.env.VITE_API_BASE_URL as string | undefined) ?? 'http://localhost:5000/api'

export function getToken(): string | null { return localStorage.getItem(TOKEN_KEY) }
export function setToken(t: string): void { localStorage.setItem(TOKEN_KEY, t) }
export function removeToken(): void { localStorage.removeItem(TOKEN_KEY) }

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const token = getToken()
  const isForm = init.body instanceof FormData

  const headers: Record<string, string> = {
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(!isForm ? { 'Content-Type': 'application/json' } : {}),
    ...(init.headers as Record<string, string> ?? {}),
  }

  const res = await fetch(`${API_BASE}${path}`, { ...init, headers })

  if (res.status === 401) {
    removeToken()
    window.location.href = '/login'
    throw new Error('Unauthorized')
  }

  if (res.status === 204) return undefined as T

  if (!res.ok) {
    let err: Record<string, unknown> = {}
    try { err = await res.json() } catch { /* empty */ }
    throw { status: res.status, ...err }
  }

  return res.json() as Promise<T>
}

export const http = {
  get:    <T>(path: string)              => request<T>(path, { method: 'GET' }),
  post:   <T>(path: string, body?: unknown) => request<T>(path, {
    method: 'POST',
    body: body instanceof FormData ? body : JSON.stringify(body),
  }),
  put:    <T>(path: string, body?: unknown) => request<T>(path, { method: 'PUT', body: JSON.stringify(body) }),
  delete: <T>(path: string)              => request<T>(path, { method: 'DELETE' }),
}
