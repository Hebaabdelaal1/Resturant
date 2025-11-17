

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


  const handleCheckout = () => {
    if (!currentUser) {
      navigate("/signin");
    } else {
      navigate("/checkout");
    }
  };

    if (items.length === 0)
    return (
      <div
        className="min-h-screen bg-black flex flex-col items-center justify-center text-white p-6"
        style={{
          backgroundImage: "url('/public/Imgs/emptycart.png')",
          backgroundSize: "200px",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center 30%",
        }}
      >
        <h2 className="text-2xl font-bold mt-60">Add Items to your cart now</h2>
        <button className="bg-transparent border border-orange-500 text-orange-500 hover:bg-orange-600 hover:text-black font-semibold px-6 py-2 rounded-full transition my-4"
        onClick={ () =>
              {navigate('/menu');}
            }
        >
          Menu
        </button> 
       </div>
    );



  

  

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

              {item.size && (
             <p className="text-sm text-gray-400">Size: {item.size}</p>
              )}


              <p className="text-orange-500 font-bold">${item.price}</p>
            </div>
            <div className="flex items-center space-x-3">


             

              <button
  onClick={() => dispatch(decreaseQty({ id: item.id, size: item.size }))}
  className="bg-gray-700 px-3 py-1 rounded-lg"
>
  -
</button>


              <span>{item.quantity}</span>



              
<button
  onClick={() => dispatch(increaseQty({ id: item.id, size: item.size }))}
  className="bg-gray-700 px-3 py-1 rounded-lg"
>
  +
</button>

<button
  onClick={() => dispatch(removeFromCart({ id: item.id, size: item.size }))}
  className="ml-3 bg-orange-600 px-3 py-1 rounded-lg"
>
  Remove
</button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-10 text-center">
        <p className="text-xl font-bold">Total:  {total} EGP</p>
        <button className="mt-4 bg-orange-600 text-black py-2 px-8 rounded-lg hover:bg-orange-500"
          onClick={handleCheckout}>
          Checkout
        </button>
      </div>
    </div>
  );
};

export default Cart;


