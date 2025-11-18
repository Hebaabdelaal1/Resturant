import { useEffect, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { Menu, X, Search } from "lucide-react";
import { FaShoppingCart, FaRegUser } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux"; 
import { clearCart } from "../features/cartSlice";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth, db } from "../Firebase/config";
import { doc, getDoc } from "firebase/firestore";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [userName, setUserName] = useState("");
  const [search , setSearch] =useState("");
  const navigate =useNavigate();

  const dispatch = useDispatch();

  const toggleMenu = () => setIsOpen(!isOpen);
  const toggleSearch = () => setIsSearchOpen(!isSearchOpen);

  const cartCount = useSelector((state) =>
    state.cart.items.reduce((sum, item) => sum + item.quantity, 0)
  );



useEffect(() => {
  const unsub = onAuthStateChanged(auth, async (currentUser) => {
    if (currentUser) {
      setUser(currentUser);

      const userDocRef = doc(db, "users", currentUser.uid);
      const userSnap = await getDoc(userDocRef);

      if (userSnap.exists()) {
        setUserName(userSnap.data().name);
      } else {
        setUserName(currentUser.email); 
      }
    } else {
      setUser(null);
      setUserName("");
    }
  });

  return () => unsub();
}, []);

const handleSearch = () => {
  if (!search.trim()) return;
  navigate(`/search?query=${encodeURIComponent(search)}`);
};


  const handleLogout = async () => {
    await signOut(auth); 
    dispatch(clearCart()); 
  };

  const navLinks = [
    { to: "/", label: "Home" },
    { to: "/menu", label: "Menu" },
    { to: "/offer", label: "Offers" },
    { 
      to: "/cart", 
      label: (
        <div className="relative">
          <FaShoppingCart size={18} />
          {cartCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-orange-600 text-black text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
              {cartCount}
            </span>
          )}
        </div>
      ) 
    },
  ];

  return (
    <nav className="bg-black text-white px-6 py-6 shadow-md relative">
      <div className="container mx-auto flex items-center justify-between">
        {/* Logo */}
       <Link
  to="/"
  className="text-3xl font-extrabold tracking-wide text-orange-500 font-serif hover:text-orange-600 transition-colors"
>
  Slice & Bite
</Link>


        {/* Search Bar Desktop */}
        <div className="hidden md:flex items-center bg-white rounded-full px-3 py-1 w-1/3">
          <input
            type="text"
            placeholder="Search..."
            value={search}
            className="flex-grow px-2 text-black text-sm focus:outline-none"
            onChange={(e) => setSearch(e.target.value)}
         onKeyDown={(e) => {
  if (e.key === "Enter") handleSearch();
}}

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
                `transition-colors duration-200 ${isActive ? "text-orange-600" : "hover:text-orange-600"}`
              }
            >
              {label}
            </NavLink>
          ))}

          {/* Auth Section */}
          {user ? (
            <div className="flex items-center space-x-3">
           <p className="text-orange-600 text-lg">Hi, {userName}</p>
              <button
                onClick={handleLogout}
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

        {/* Mobile Buttons */}
        <div className="md:hidden flex items-center space-x-3">
          <button onClick={toggleSearch} className="text-white focus:outline-none hover:text-orange-600">
            <Search size={22} />
          </button>

          {user && (
                 <p className="text-orange-600 text-m">Hi, {userName}</p>
           
          )}

          <NavLink to="/cart" className="relative">
            <FaShoppingCart size={22} />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-orange-600 text-black text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </NavLink>

          <button onClick={toggleMenu} className="focus:outline-none text-white">
            {isOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile Search */}
      <div className={`md:hidden absolute left-0 right-0 top-full bg-black px-4 py-2 transition-all duration-300 overflow-hidden ${isSearchOpen ? "max-h-20 opacity-100" : "max-h-0 opacity-0"}`}>
        <div className="flex items-center bg-white rounded-full px-3 py-1">
          <input
            type="text"
            placeholder="Search..."
                      value={search}
            className="flex-grow px-2 text-black text-sm focus:outline-none z-10"
            onChange={(e) => setSearch(e.target.value)}
         onKeyDown={(e) => {
  if (e.key === "Enter") handleSearch();
}}
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
                `block transition-colors duration-200 ${isActive ? "text-orange-600" : "hover:text-orange-600"}`
              }
            >
              {label}
            </NavLink>
          ))}

          {user ? (
            <div className="flex flex-col items-center space-y-2 mt-3">
              <button
                onClick={() => {
                  handleLogout();
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
