import React from 'react'
import ProtectedRoute from './custom-hooks/Protect-Router/ProtectedRoute';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { CartProvider } from './context/CartContext';
import Home from './pages/Home';
import Login from './pages/Login';
import Layout from './Layout/Layout';
import Signup from './pages/Signup';
import Addrees from './pages/Address';
import Notfound from './pages/Notfound';
import Profile from './pages/Profile';
import Shop from './pages/Shop';
import About from './pages/About';
import Services from './pages/Services';
import Contact from './pages/Contact';
import ProductsDetails from './pages/ProductsDetails';
import Cart from './pages/Cart';

const App = () => {

  let routers = createBrowserRouter([
  {path: '' , element: <Layout />, children :[
    {index: true, element: <ProtectedRoute><Home /></ProtectedRoute> },
    {path:'profile', element:<ProtectedRoute><Profile /></ProtectedRoute>},
    {path: 'address', element: <ProtectedRoute><Addrees /></ProtectedRoute> },
    {path:'shop', element:<ProtectedRoute><Shop /></ProtectedRoute>},
    {path: 'about', element: <ProtectedRoute><About /></ProtectedRoute> },
    {path: 'services', element: <ProtectedRoute><Services /></ProtectedRoute> },
    { path: 'contact', element: <ProtectedRoute><Contact /></ProtectedRoute> },
    { path: 'product/:id', element: <ProtectedRoute><ProductsDetails /></ProtectedRoute> },
    {path:'cart', element:<ProtectedRoute><Cart /></ProtectedRoute>},
    
    {path:'login' , element:<Login />},
    {path:'signup' , element:<Signup />},
    {path:'*' , element:<Notfound/>},
  ]}
])

  return (
    <>
      <CartProvider>
      <Toaster />
      <RouterProvider router={routers}>
      </RouterProvider>
      </CartProvider>
    </>
  )
}

export default App