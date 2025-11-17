import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { db } from "../Firebase/config";
import { doc, getDoc } from "firebase/firestore";

const OrderSuccess = () => {
  const { id } = useParams(); // orderId
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    const getOrder = async () => {
      const snap = await getDoc(doc(db, "orders", id));
      if (snap.exists()) {
        setOrder(snap.data());
      }
    };
    getOrder();
  }, [id]);

  if (!order)
    return (
      <div className="min-h-screen flex justify-center items-center text-white">
        Loading order details...
      </div>
    );

  return (
    <div className="min-h-screen bg-black text-white p-6 flex flex-col items-center">
      <h1 className="text-3xl font-bold text-green-500 mb-4">
        🎉 Order Confirmed!
      </h1>

      <div className="bg-gray-900 p-6 rounded-2xl w-full max-w-xl shadow-lg space-y-4">
        <p className="text-gray-300">
          <span className="font-bold">Order ID:</span> {id}
        </p>

        <p>
          <span className="font-bold">Name:</span> {order.name}
        </p>

        <p>
          <span className="font-bold">Phone:</span> {order.phone}
        </p>

        <p>
          <span className="font-bold">Address:</span> {order.address}
        </p>

        <p>
          <span className="font-bold">Payment Method:</span>{" "}
          {order.paymentMethod}
        </p>

        <h2 className="text-xl font-semibold mt-4">Items</h2>

        <div className="space-y-2">
          {order.items.map((item, index) => (
            <div
              key={index}
              className="flex justify-between border-b border-gray-700 pb-2"
            >
              <div>
                <p>{item.name}</p>
                {item.size && (
                  <p className="text-gray-400 text-sm">Size: {item.size}</p>
                )}
                <p className="text-sm text-gray-400">
                  Qty: {item.quantity}
                </p>
              </div>
              <p>${item.price * item.quantity}</p>
            </div>
          ))}
        </div>

        <div className="flex justify-between font-bold text-lg mt-3">
          <span>Total</span>
          <span>${order.total}</span>
        </div>
      </div>

      <button
        onClick={() => navigate("/")}
        className="mt-6 bg-orange-600 text-black px-6 py-2 rounded-lg hover:bg-orange-500"
      >
        Back to Home
      </button>
    </div>
  );
};

export default OrderSuccess;
