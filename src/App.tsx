import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import type { ReactNode } from 'react'
import { AuthProvider, useAuth } from './context/AuthContext'
import { ToastProvider } from './context/ToastContext'
import Layout from './components/Layout'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Users from './pages/Users'
import ExchangeRates from './pages/ExchangeRates'
import Tiers from './pages/Tiers'
import AdminMatch from './pages/AdminMatch'
import Spinner from './components/Spinner'

function ProtectedRoute({ children }: { children: ReactNode }) {
  const { token, isLoading } = useAuth()
  if (isLoading) {
    return (
      <div style={{ minHeight: '100svh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--ink-5)' }}>
        <Spinner size={32} />
      </div>
    )
  }
  if (!token) return <Navigate to="/login" replace />
  return <>{children}</>
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route index           element={<Dashboard />} />
        <Route path="users"          element={<Users />} />
        <Route path="exchange-rates" element={<ExchangeRates />} />
        <Route path="tiers"          element={<Tiers />} />
        <Route path="admin-match"    element={<AdminMatch />} />
        <Route path="settings"       element={<PlaceholderPage title="Settings" />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

function PlaceholderPage({ title }: { title: string }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 400, gap: 12 }}>
      <div style={{ fontSize: 40 }}>🚧</div>
      <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--ink)' }}>{title}</div>
      <div style={{ fontSize: 13, color: 'var(--ink-40)' }}>This section is under construction.</div>
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ToastProvider>
          <AppRoutes />
        </ToastProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}
