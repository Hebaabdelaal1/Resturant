

import { useDispatch, useSelector } from "react-redux";
import {
  removeFromCart,
  increaseQty,
  decreaseQty,
  calculateTotal,
} from "../features/cartSlice";
import { useEffect } from "react";
import { useAuth } from "../Context/AuthContext";
import { useNavigate } from "react-router-dom";

const Cart = () => {
  const { items, total } = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  useEffect(() => {
    dispatch(calculateTotal());
  }, [items, dispatch]);

  if (items.length === 0)
    return <p className="text-center text-white mt-10">Your cart is empty.</p>;


  const handleCheckout = () => {
    if (!currentUser) {
      navigate("/signin");
    } else {
      navigate("/checkout");
    }
  };

  

  return (
    <div className="min-h-screen bg-black text-white p-4 sm:p-8">
      <h1 className="text-2xl font-bold mb-6 text-center">Your Cart</h1>
      <div className="space-y-6">
        {items.map((item) => (
          <div
            key={item.id}
            className="flex flex-col sm:flex-row sm:items-center bg-gray-900 rounded-xl p-4 shadow-md"
          >
            <img
              src={item.image}
              alt={item.name}
              className="w-24 h-24 object-cover rounded-lg"
            />
            <div className="flex-1 sm:ml-4 mt-3 sm:mt-0">
              <h2 className="font-semibold text-lg">{item.name}</h2>
              <p className="text-yellow-400 font-bold">${item.price}</p>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => dispatch(decreaseQty(item.id))}
                className="bg-gray-700 px-3 py-1 rounded-lg"
              >
                -
              </button>
              <span>{item.quantity}</span>
              <button
                onClick={() => dispatch(increaseQty(item.id))}
                className="bg-gray-700 px-3 py-1 rounded-lg"
              >
                +
              </button>
              <button
                onClick={() => dispatch(removeFromCart(item.id))}
                className="ml-3 bg-red-600 px-3 py-1 rounded-lg"
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-10 text-center">
        <p className="text-xl font-bold">Total: ${total}</p>
        <button className="mt-4 bg-yellow-500 text-black py-2 px-8 rounded-lg hover:bg-yellow-400"
          onClick={handleCheckout}>
          Checkout
        </button>
      </div>
    </div>
  );
};

export default Cart;
