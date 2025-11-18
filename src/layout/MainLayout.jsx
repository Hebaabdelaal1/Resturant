import React from 'react'
import { Outlet } from 'react-router-dom'
import Footer from '../Componant/footer.jsx'
import Navbar from '../Componant/Navbar.jsx'


function MainLayout() {
  return (
    <>
    <Navbar/>
    <main style={{ minHeight: "80vh"}}>
    <Outlet  />
    </main>
    <Footer />
    </>
  )
}

export default MainLayout