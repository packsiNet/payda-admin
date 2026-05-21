import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'
import { getToken, setToken, removeToken } from '../api/client'
import { usersApi } from '../api'
import type { UserDetail } from '../api/types'

interface AuthContextValue {
  token: string | null
  user: UserDetail | null
  isLoading: boolean
  login: (token: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setTokenState] = useState<string | null>(getToken())
  const [user, setUser] = useState<UserDetail | null>(null)
  const [isLoading, setIsLoading] = useState(!!getToken())

  useEffect(() => {
    if (!token) { setIsLoading(false); return }
    setIsLoading(true)
    usersApi.getMe()
      .then(setUser)
      .catch(() => { removeToken(); setTokenState(null) })
      .finally(() => setIsLoading(false))
  }, [token])

  const login = async (newToken: string) => {
    setToken(newToken)
    setTokenState(newToken)
    const me = await usersApi.getMe()
    setUser(me)
  }

  const logout = () => {
    removeToken()
    setTokenState(null)
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ token, user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
