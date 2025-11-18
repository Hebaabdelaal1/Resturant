import React from 'react'
import { Link } from 'react-router-dom'

function Footer() {
  return (
   <footer className="bg-black text-gray-300 py-10 px-6 md:px-20">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10 text-center md:text-left">

        {/* ===== CONTACT INFO ===== */}
        <div>
          <h3 className="text-xl font-bold text-orange-500 mb-4">Contact Us</h3>
          <p className="text-gray-400">📍 123 Flavor Street, Cairo, Egypt</p>
          <p className="text-gray-400">📞 +20 123 456 789</p>
          <p className="text-gray-400">✉️ info@delicioushub.com</p>
        </div>

        {/* ===== QUICK LINKS ===== */}
        <div>
          <h3 className="text-xl font-bold text-orange-500 mb-4">Quick Links</h3>
          <ul className="space-y-2">
            <li>
              <Link
                to="/"
                className="hover:text-orange-500 transition duration-200"
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                to="/menu"
                className="hover:text-orange-500 transition duration-200"
              >
                Menu
              </Link>
            </li>
            <li>
              <Link
                to="/offer"
                className="hover:text-orange-500 transition duration-200"
              >
                Offer
              </Link>
            </li>
            
          </ul>
        </div>

        {/* ===== SOCIAL / BRAND INFO ===== */}
        <div>
          <h3 className="text-xl font-bold text-orange-500 mb-4">
            Delicious Hub
          </h3>
          <p className="text-gray-400 mb-4">
            Your favorite destination for freshly made pizzas 🍕 and juicy
            burgers 🍔.
          </p>
          <div className="flex justify-center md:justify-start gap-4">
            <a
              href="#"
              className="hover:text-orange-500 transition duration-200"
            >
              <i className="fab fa-facebook-f"></i>
            </a>
            <a
              href="#"
              className="hover:text-orange-500 transition duration-200"
            >
              <i className="fab fa-instagram"></i>
            </a>
            <a
              href="#"
              className="hover:text-orange-500 transition duration-200"
            >
              <i className="fab fa-twitter"></i>
            </a>
          </div>
        </div>
      </div>

      {/* ===== COPYRIGHT LINE ===== */}
      <div className="border-t border-gray-700 mt-10 pt-4 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} Delicious Hub. All rights reserved.
      </div>
    </footer>  )
}

export default Footer