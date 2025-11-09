import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";
import { db } from "../Firebase/config";
import { collection, addDoc, doc, updateDoc, getDoc } from "firebase/firestore";
import { clearCart } from "../features/cartSlice";
import toast, { Toaster } from "react-hot-toast";

const Checkout = () => {
  const { items, total } = useSelector((state) => state.cart);
  const { currentUser } = useAuth();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);

  const [address, setAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      if (currentUser?.uid) {
        const userRef = doc(db, "users", currentUser.uid);
        const snap = await getDoc(userRef);
        if (snap.exists()) {
          setUserData(snap.data());
        }
      }
    };
    fetchUserData();
  }, [currentUser]);

  const handleSaveChanges = async () => {
    if (!userData?.name || !userData?.number) {
       toast.success("Please fill in your name and number", { duration: 2000, position: "top-center" });
        
      return;
    }

    try {
      const userRef = doc(db, "users", currentUser.uid);
      await updateDoc(userRef, {
        name: userData.name,
        number: userData.number,
      });
      toast.success("Profile updated successfully!", { duration: 2000, position: "top-center" });

      setIsEditing(false);
    } catch (err) {
      console.error(err);
      toast.error("Error updating profile!", { duration: 2000, position: "top-center" });

    }
  };

  const handleConfirmOrder = async () => {
    if (!address) {
    //   alert("Please enter your address");
      toast.error("Please enter your address!", { duration: 2000, position: "top-center" });

      return;
    }

    try {
      await addDoc(collection(db, "orders"), {
        userId: currentUser.uid,
        name: userData?.name || "No Name",
        email: userData?.email,
        phone: userData?.number || "Not provided",
        address,
        paymentMethod,
        status: "pending",
        total,
        items,
        createdAt: new Date().toISOString(),
      });

      // clear cart in Firestore
      const userCartRef = doc(db, "carts", currentUser.uid);
      await updateDoc(userCartRef, { items: [] });

      dispatch(clearCart());
      toast.success("Order placed successfully!", { duration: 2000, position: "top-center" });

      navigate("/");
    } catch (error) {
      console.error("Error saving order:", error);
    //   alert("Failed to place order, please try again.");
            toast.error("Failed to place order, please try again!", { duration: 2000, position: "top-center" });

    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-4 sm:p-8 flex flex-col items-center">
                <Toaster />
        
      <h1 className="text-2xl font-bold mb-6 text-orange-600">Checkout</h1>

      <div className="w-full max-w-2xl bg-gray-900 p-6 rounded-2xl shadow-lg">
        {/* User Info */}
        {userData ? (
          <div className="mb-4 space-y-2">
            <div>
              <label className="block text-sm text-gray-400">Name:</label>
              {isEditing ? (
                <input
                  type="text"
                  value={userData.name}
                  onChange={(e) =>
                    setUserData({ ...userData, name: e.target.value })
                  }
                  className="w-full p-2 rounded-lg bg-gray-800 border border-gray-700 text-white"
                />
              ) : (
                <p className="font-medium">{userData.name}</p>
              )}
            </div>

            <div>
              <label className="block text-sm text-gray-400">Phone:</label>
              {isEditing ? (
                <input
                  type="text"
                  value={userData.number}
                  onChange={(e) =>
                    setUserData({ ...userData, number: e.target.value })
                  }
                  className="w-full p-2 rounded-lg bg-gray-800 border border-gray-700 text-white"
                />
              ) : (
                <p className="font-medium">{userData.number}</p>
              )}
            </div>

            <div className="flex gap-3 mt-3">
              {isEditing ? (
                <>
                  <button
                    onClick={handleSaveChanges}
                    className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-md"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setIsEditing(false)}
                    className="bg-gray-700 hover:bg-gray-800 px-4 py-2 rounded-md"
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setIsEditing(true)}
                  className="bg-orange-600 hover:bg-orange-500 text-black px-4 py-2 rounded-md"
                >
                  Edit Info
                </button>
              )}
            </div>
          </div>
        ) : (
          <p>Loading user info...</p>
        )}

        {/* Address Input */}
        <div className="mb-6">
          <label className="block mb-2 font-semibold">Delivery Address</label>
          <input
            type="text"
            className="w-full p-2 rounded-lg bg-gray-800 border border-gray-700 text-white"
            placeholder="Enter your address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
        </div>

        {/* Payment Methods */}
        <div className="mb-6">
          <p className="font-semibold mb-2">Payment Method</p>
          <div className="flex flex-col gap-2">
            <label className="flex items-center">
              <input
                type="radio"
                value="cash"
                checked={paymentMethod === "cash"}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="mr-2"
              />
              Cash on Delivery
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                value="paypal"
                checked={paymentMethod === "paypal"}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="mr-2"
              />
              PayPal
            </label>
          </div>
        </div>

        {/* Order Summary */}
        <div className="mb-6">
          <h2 className="font-semibold mb-3">Order Summary</h2>
          {items.map((item) => (
            <div
              key={item.id}
              className="flex justify-between text-sm border-b border-gray-700 py-1"
            >
              <span>
                {item.name} × {item.quantity}
              </span>
              <span>${item.price * item.quantity}</span>
            </div>
          ))}
          <div className="flex justify-between font-bold mt-3">
            <span>Total</span>
            <span>${total}</span>
          </div>
        </div>

        {/* Confirm Button */}
        <button
          onClick={handleConfirmOrder}
          className="w-full bg-orange-600 text-black py-2 rounded-lg hover:bg-orange-500"
        >
          Confirm Order
        </button>
      </div>
    </div>
  );
};

export default Checkout;
