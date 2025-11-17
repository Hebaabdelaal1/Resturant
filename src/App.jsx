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
import OrderSuccess from "./pages/OrderSuccess";

const App = () => {
  return (
  
    <Provider store={store}>
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/" element={<MainLayout />}>
              <Route index element={<Home />} />
              <Route path="menu" element={<Menu />} />
              <Route path="offer" element={<Offer />} />
              <Route path="userprofile" element={<UserProfile />} />
              <Route path="wishlist" element={<WishList />} />
              <Route path="/order-success/:id" element={<OrderSuccess />} />

			  <Route path="cart" element={<Cart/>} />
			  <Route path="checkout" element={<Checkout/>} />
           <Route path="signin" element={<SignIn />} />
            <Route path="signup" element={<SignUp />} />
            </Route>
         
          </Routes>
        </Router>
      </AuthProvider>
    </Provider>
  );
};

export default App;
