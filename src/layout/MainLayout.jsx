import React from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from '../Component/Navbar.jsx'
 import Footer from '../Component/footer.jsx'



function MainLayout() {
  return (
    <>
    <Navbar/>
    <main style={{ minHeight: "80vh"}}>
    <Outlet  />
    </main>
    <Footer/>
    </>
  )
}

export default MainLayout