import { Outlet, useLocation } from 'react-router-dom'
import Navbar from '../Ui/Navbar.jsx';
import Footer from '../Ui/Footer.jsx';
import { useEffect } from 'react';


const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};


export default function Layout() {

  return <>
    <ScrollToTop />
    <Navbar />
    <div className="bg-gradient-to-r from-gray-800 to-gray-900  min-h-[100vh]">
      <Outlet>
      </Outlet>
    </div>
    <Footer />
  </>
}
