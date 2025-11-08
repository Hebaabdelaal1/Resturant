import React from 'react'
import Navbar from '../Componant/navbar.jsx'
import { Outlet } from 'react-router-dom'
import Footer from '../Componant/footer.jsx'


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