import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../Firebase/config";
import { addDoc, collection, serverTimestamp, doc, getDoc } from "firebase/firestore";
import { Link } from "react-router-dom";

const FormAddReview = () => {
  const [rating, setRating] = useState(0);
  const [user, setUser] = useState(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsub();
  }, []);

  if (!user) {
    return (
      <p className="text-center text-gray-600 mt-4">
        Please{" "}
        <Link className="text-orange-500 " to="/signin">
          log in
        </Link>{" "}
        to add a review.
      </p>
    );
  }

  const onSubmit = async (data) => {
    try {

      const userDocRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userDocRef);
      const userName = userSnap.exists() ? userSnap.data().name : user.email;

      await addDoc(collection(db, "reviews"), {
        ...data,
        rating,
        userId: user.uid,
        userName,
        createdAt: serverTimestamp(),
      });

      reset();
      setRating(0);
    } catch (error) {
      console.error("Error adding review:", error);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="max-w-md mx-auto mt-10 p-6 rounded-xl shadow-lg border border-gray-200"
    >
      <h3 className="text-2xl font-semibold mb-6 text-center text-orange-600">
        Write a Review
      </h3>

      <textarea
        {...register("comment", { required: "Review cannot be empty" })}
        className="w-full border border-gray-300 rounded-lg p-4 h-32 focus:outline-none focus:ring-2 focus:ring-white-400 transition"
        placeholder="Write your review here..."
      ></textarea>

      {errors.comment && (
        <p className="text-red-500 text-sm mt-2">{errors.comment.message}</p>
      )}

      <div className="flex items-center justify-center gap-2 mt-5">
        {[1, 2, 3, 4, 5].map((star) => (
          <svg
            key={star}
            onClick={() => setRating(star)}
            xmlns="http://www.w3.org/2000/svg"
            fill={star <= rating ? "orange" : "gray"}
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="w-10 h-10 cursor-pointer transition transform hover:scale-110"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M11.48 3.499a.562.562 0 011.04 0l2.125 4.305a.563.563 0 00.424.308l4.75.69a.563.563 0 01.312.96l-3.438 3.35a.563.563 0 00-.162.498l.812 4.73a.563.563 0 01-.817.592l-4.25-2.236a.563.563 0 00-.524 0l-4.25 2.236a.563.563 0 01-.817-.592l.812-4.73a.563.563 0 00-.162-.498L2.87 9.762a.563.563 0 01.312-.96l4.75-.69a.563.563 0 00.424-.308L11.48 3.5z"
            />
          </svg>
        ))}
      </div>

      <button
        type="submit"
        className="w-full bg-orange-600 text-white mt-6 p-3 rounded-lg hover:bg-orange-700 transition shadow-md"
      >
        Submit Review
      </button>
    </form>
  );
};

export default FormAddReview;
