import Navbar from '../components/Navbar'
import { Outlet } from 'react-router'

const LayoutForUser = () => {
  return (
    <div className=' min-h-screen'>
        <Navbar/>
        <Outlet/>
    </div>
  )
}

export default LayoutForUser