import AdminSidebar from '../components/AdminSidebar'
import { Outlet } from 'react-router'

const LayoutForAdmin = () => {
  return (
    <div className="flex min-h-screen overflow-hidden app-shell text-[color:var(--text)]">
      <AdminSidebar />
      <main className="flex-1 overflow-y-auto p-6">
        <Outlet />
      </main>
    </div>
  )
}

export default LayoutForAdmin
