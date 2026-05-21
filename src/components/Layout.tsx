import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import Header from './Header'

export default function Layout() {
  return (
    <div style={{ display: 'flex', minHeight: '100svh', width: '100%' }}>
      <Sidebar />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, overflow: 'hidden' }}>
        <Header />
        <main style={{ flex: 1, padding: '24px 28px', overflowY: 'auto', background: 'var(--ink-5)' }}>
          <Outlet />
        </main>
      </div>
    </div>
  )
}
