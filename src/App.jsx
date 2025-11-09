import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainLayout from "./layout/MainLayout";
import Home from "./pages/Home";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import UserProfile from "./pages/UserProfile";
import WishList from "./pages/WishList";
import Menu from "./pages/menu";
import Offer from "./pages/offer";
import { Provider } from "react-redux";
import { AuthProvider } from "./Context/AuthContext";
import { store } from "./Store";
import Cart from "./pages/Cart";
import { Check } from "lucide-react";
import Checkout from "./pages/Checkout ";

const App = () => {
  return (
    // ✅ لازم Provider الخارجي يكون الأول
    <Provider store={store}>
      <AuthProvider>
        <Router>
          <Routes>
            {/* ✅ الراوتس اللي فيها Navbar/Footer */}
            <Route path="/" element={<MainLayout />}>
              <Route index element={<Home />} />
              <Route path="menu" element={<Menu />} />
              <Route path="offer" element={<Offer />} />
              <Route path="userprofile" element={<UserProfile />} />
              <Route path="wishlist" element={<WishList />} />
			  <Route path="cart" element={<Cart/>} />
			  <Route path="checkout" element={<Checkout/>} />
            </Route>

            {/* ✅ صفحات بدون Navbar/Footer */}
            <Route path="signin" element={<SignIn />} />
            <Route path="signup" element={<SignUp />} />
          </Routes>
        </Router>
      </AuthProvider>
    </Provider>
  );
};

export default App;
