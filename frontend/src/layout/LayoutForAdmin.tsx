import AdminSidebar from '../components/AdminSidebar'
import { Outlet } from 'react-router'

const LayoutForAdmin = () => {
  return (
    <div className='flex h-screen overflow-hidden'>
        <AdminSidebar/>
        <Outlet/>
    </div>
  )
}

export default LayoutForAdmin