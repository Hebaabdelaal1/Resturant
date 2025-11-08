import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { Menu, X, Search } from "lucide-react";
import { FaShoppingCart, FaRegUser } from "react-icons/fa";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(true);

  const toggleMenu = () => setIsOpen(!isOpen);
  const toggleSearch = () => setIsSearchOpen(!isSearchOpen);

  const navLinks = [
    { to: "/", label: "Home" },
    { to: "/menu", label: "Menu" },
    { to: "/offer", label: "Offers" },
    { to: "/wishlist", label: "Wishlist" },
    { to: "/cart", label: <FaShoppingCart size={18} /> },
  ];

  return (
    <nav className="bg-black text-white px-6 py-6 shadow-md relative">
      <div className="container mx-auto flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="text-xl font-bold tracking-wide">
          MyRestaurant
        </Link>

        {/* Search Bar (Desktop Center) */}
        <div className="hidden md:flex items-center bg-white rounded-full px-3 py-1 w-1/3">
          <input
            type="text"
            placeholder="Search..."
            className="flex-grow px-2 text-black text-sm focus:outline-none"
          />
          <Search className="text-orange-600" size={18} />
        </div>

        {/* Desktop Links */}
        <div className="hidden md:flex space-x-6 text-sm font-medium items-center font-bold">
          {navLinks.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `transition-colors duration-200 ${
                  isActive ? "text-orange-600" : "hover:text-orange-600"
                }`
              }
            >
              {label}
            </NavLink>
          ))}

          {/* Auth Section */}
          {isLoggedIn ? (
            <div className="flex items-center space-x-3">
              <NavLink
                to="/userprofile"
                className="hover:text-orange-600 transition-colors"
              >
                <FaRegUser size={20} />
              </NavLink>
              <button
                onClick={() => setIsLoggedIn(false)}
                className="border border-orange-600 hover:bg-orange-600 hover:text-black px-3 py-1 rounded-md font-semibold"
              >
                Logout
              </button>
            </div>
          ) : (
            <Link
              to="/signin"
              className="bg-orange-600 hover:bg-orange-700 text-black px-4 py-1 rounded-md font-semibold"
            >
              Sign In
            </Link>
          )}
        </div>

        {/* Mobile Buttons (Menu + Search + Profile) */}
        <div className="md:hidden flex items-center space-x-3">
          {/* Search Icon */}
          <button
            onClick={toggleSearch}
            className="text-white focus:outline-none hover:text-orange-600"
          >
            <Search size={22} />
          </button>

          {/* Profile Icon */}
          {isLoggedIn && (
            <NavLink
              to="/userprofile"
              className="hover:text-orange-600 transition-colors"
            >
              <FaRegUser size={20} />
            </NavLink>
          )}

          {/* Menu Toggle */}
          <button
            onClick={toggleMenu}
            className="focus:outline-none text-white"
          >
            {isOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile Search Bar (Animated) */}
      <div
        className={`md:hidden absolute left-0 right-0 top-full bg-black px-4 py-2 transition-all duration-300 overflow-hidden ${
          isSearchOpen ? "max-h-20 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="flex items-center bg-white rounded-full px-3 py-1">
          <input
            type="text"
            placeholder="Search..."
            className="flex-grow px-2 text-black text-sm focus:outline-none"
          />
          <Search className="text-orange-600" size={18} />
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-black mt-3 px-4 pb-4 space-y-3 text-sm font-medium">
          {navLinks.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              onClick={() => setIsOpen(false)}
              className={({ isActive }) =>
                `block transition-colors duration-200 ${
                  isActive ? "text-orange-600" : "hover:text-orange-600"
                }`
              }
            >
              {label}
            </NavLink>
          ))}

          {/* Auth Section */}
          {isLoggedIn ? (
            <div className="flex flex-col items-center space-y-2 mt-3">
              <button
                onClick={() => {
                  setIsLoggedIn(false);
                  setIsOpen(false);
                }}
                className="w-full border border-orange-600 hover:bg-orange-600 hover:text-black px-4 py-2 rounded-md font-semibold text-center"
              >
                Logout
              </button>
            </div>
          ) : (
            <Link
              to="/signin"
              onClick={() => setIsOpen(false)}
              className="bg-orange-600 hover:bg-orange-700 text-black px-4 py-2 rounded-md font-semibold text-center block"
            >
              Sign In
            </Link>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
