import Navbar from '../components/Navbar'
import { Outlet } from 'react-router'

const LayoutForUser = () => {
  return (
    <div className="min-h-screen app-shell text-[color:var(--text)] relative overflow-hidden">
      <Navbar />
      <main className="relative z-10 pt-24 pb-16">
        <Outlet />
      </main>
    </div>
  )
}

export default LayoutForUser
