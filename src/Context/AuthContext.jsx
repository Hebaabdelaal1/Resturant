
import { createContext, useContext, useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../Firebase/config";
import { useDispatch } from "react-redux";
import {
  mergeAndSyncCart,
  fetchUserCart,
  clearCart,
} from "../features/cartSlice";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      setLoading(false);

      if (user) {
        const localCart = localStorage.getItem("cart")
          ? JSON.parse(localStorage.getItem("cart"))
          : [];

        if (localCart.length > 0) {
          await dispatch(mergeAndSyncCart({ userId: user.uid, localCart }));
          localStorage.removeItem("cart");
        } else {
          await dispatch(fetchUserCart(user.uid));
        }
      } else {
        dispatch(clearCart());
      }
    });

    return () => unsubscribe();
  }, [dispatch]);

  return (
    <AuthContext.Provider value={{ currentUser }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
