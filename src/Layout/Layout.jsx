import { Outlet } from 'react-router-dom'
import Navbar from '../Ui/Navbar.jsx';
import Footer from '../Ui/Footer.jsx';

export default function Layout() {

  return <>
    <Navbar />
    <div className="bg-gradient-to-r from-gray-800 to-gray-900  min-h-[100vh]">
            <Outlet>
      </Outlet>
    </div>
    <Footer />
  </>
}
