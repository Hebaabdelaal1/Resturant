
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

  const [paypalReady, setPaypalReady] = useState(false);

  useEffect(() => {
    if (paymentMethod === "paypal" && window.paypal) {
      setPaypalReady(true);
    }
  }, [paymentMethod]);

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
      toast.error("Please fill in your name and number");
      return;
    }
    await updateDoc(doc(db, "users", currentUser.uid), {
      name: userData.name,
      number: userData.number,
    });
    toast.success("Profile updated!");
    setIsEditing(false);
  };

  const createOrderInFirestore = async (method) => {
    const cleanedItems = items.map((item) => {
      const clean = {};
      Object.keys(item).forEach((key) => {
        if (item[key] !== undefined) clean[key] = item[key];
      });
      return clean;
    });

    const orderRef = await addDoc(collection(db, "orders"), {
      userId: currentUser.uid,
      name: userData?.name || "No Name",
      email: userData?.email || currentUser?.email || "no-email",
      phone: userData?.number || "Not provided",
      address,
      paymentMethod: method,
      status: "pending",
      total,
      items: cleanedItems,
      createdAt: new Date().toISOString(),
    });

    await updateDoc(doc(db, "carts", currentUser.uid), { items: [] });
    dispatch(clearCart());
    navigate(`/order-success/${orderRef.id}`);
  };

  const handleConfirmOrder = async () => {
    if (!address) {
      toast.error("Please enter your address");
      return;
    }

    if (paymentMethod === "paypal") {
      toast.error("Complete PayPal payment below");
      return;
    }

    try {
      await createOrderInFirestore("cash");
      toast.success("Order placed successfully!");
    } catch (err) {
      toast.error("Failed to place order");
      console.log(err);
    }
  };

  // PAYPAL BUTTONS
  useEffect(() => {
    if (paypalReady) {
      window.paypal.Buttons({
        createOrder: (data, actions) => {
          return actions.order.create({
            purchase_units: [
              {
                amount: { value: total.toString() },
              },
            ],
          });
        },

        onApprove: async (data, actions) => {
          await actions.order.capture();
          toast.success("Payment successful!");
          await createOrderInFirestore("paypal");
        },

        onError: () => {
          toast.error("PayPal error occurred");
        },
      }).render("#paypal-button-container");
    }
  }, [paypalReady, total]);

  return (
    <div className="min-h-screen bg-black text-white p-4 sm:p-8 flex flex-col items-center">
      <Toaster />

      <h1 className="text-2xl font-bold mb-6 text-orange-600">Checkout</h1>

      <div className="w-full max-w-2xl bg-gray-900 p-6 rounded-2xl shadow-lg">
        {/* USER INFO */}
        {userData && (
          <div className="mb-4 space-y-2">
            <div>
              <label className="block text-sm text-gray-400">Name:</label>
              {isEditing ? (
                <input
                  type="text"
                  value={userData.name}
                  onChange={(e) => setUserData({ ...userData, name: e.target.value })}
                  className="w-full p-2 rounded-lg bg-gray-800 border border-gray-700"
                />
              ) : (
                <p>{userData.name}</p>
              )}
            </div>

            <div>
              <label className="block text-sm text-gray-400">Phone:</label>
              {isEditing ? (
                <input
                  type="text"
                  value={userData.number}
                  onChange={(e) => setUserData({ ...userData, number: e.target.value })}
                  className="w-full p-2 rounded-lg bg-gray-800 border border-gray-700"
                />
              ) : (
                <p>{userData.number}</p>
              )}
            </div>

            <div className="flex gap-3 mt-3">
              {isEditing ? (
                <>
                  <button
                    onClick={handleSaveChanges}
                    className="bg-green-600 px-4 py-2 rounded-md"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setIsEditing(false)}
                    className="bg-gray-700 px-4 py-2 rounded-md"
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setIsEditing(true)}
                  className="bg-orange-600 text-black px-4 py-2 rounded-md"
                >
                  Edit Info
                </button>
              )}
            </div>
          </div>
        )}

        {/* ADDRESS */}
        <div className="mb-6">
          <label className="block mb-2 font-semibold">Delivery Address</label>
          <input
            type="text"
            className="w-full p-2 rounded-lg bg-gray-800 border border-gray-700"
            placeholder="Enter your address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
        </div>

        {/* PAYMENT METHOD */}
        <div className="mb-6">
          <p className="font-semibold mb-2">Payment Method</p>

          <label className="flex items-center gap-2">
            <input
              type="radio"
              value="cash"
              checked={paymentMethod === "cash"}
              onChange={(e) => setPaymentMethod(e.target.value)}
            />
            Cash on Delivery
          </label>

          <label className="flex items-center gap-2">
            <input
              type="radio"
              value="paypal"
              checked={paymentMethod === "paypal"}
              onChange={(e) => setPaymentMethod(e.target.value)}
            />
            PayPal
          </label>
        </div>

        {/* ORDER SUMMARY */}
        <div className="mb-6">
          <h2 className="font-semibold mb-3">Order Summary</h2>

          {items.map((item) => (
            <div key={item.id} className="flex justify-between border-b border-gray-700 py-1">
              <span>{item.name} × {item.quantity}</span>
              <span>${item.price * item.quantity}</span>
            </div>
          ))}

          <div className="flex justify-between font-bold mt-3">
            <span>Total</span>
            <span>${total}</span>
          </div>
        </div>

        {/* PAYPAL BUTTONS */}
        {paymentMethod === "paypal" && (
          <div id="paypal-button-container" className="mb-4"></div>
        )}

        {/* CONFIRM BUTTON */}
        {paymentMethod === "cash" && (
          <button
            onClick={handleConfirmOrder}
            className="w-full bg-orange-600 text-black py-2 rounded-lg"
          >
            Confirm Order
          </button>
        )}
      </div>
    </div>
  );
};

export default Checkout;
