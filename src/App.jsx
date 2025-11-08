import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainLayout from "./layout/MainLayout";
import Home from "./pages/Home";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import UserProfile from "./pages/UserProfile";
import WishList from "./pages/WishList";
import Menu from "./pages/menu";
import Offer from "./pages/offer";

const App = () => {
  return (
    <Router>
      <Routes>
        {/* الراوتس اللي فيها Navbar/Footer */}
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path="menu" element={<Menu />} />
          <Route path="offer" element={<Offer />} />
          <Route path="userprofile" element={<UserProfile />} />
          <Route path="wishlist" element={<WishList />} />
        </Route>

        {/* صفحات بدون Navbar/Footer */}
        <Route path="signin" element={<SignIn />} />
        <Route path="signup" element={<SignUp />} />
      </Routes>
    </Router>
  );
};

export default App;
