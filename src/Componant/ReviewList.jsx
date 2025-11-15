import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import React, { useEffect, useMemo, useState } from "react";
import { db } from "../Firebase/config";
import FormAddReview from "./FormAddReview"; 

const ReviewList = () => {
  const [reviews, setReviews] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const reviewsPerPage = 6;

  useEffect(() => {
    const Q = query(
      collection(db, "reviews"),
      orderBy("createdAt", "desc")
    );

    const unsub = onSnapshot(Q, (snapshot) => {
      setReviews(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    });

    return () => unsub();
  }, []);

  const renderStars = (rating) => {
    return [1, 2, 3, 4, 5].map((star) => (
      <svg
        key={star}
        xmlns="http://www.w3.org/2000/svg"
        fill={star <= rating ? "orange" : "gray"}
        viewBox="0 0 24 24"
        strokeWidth="1.5"
        stroke="currentColor"
        className="w-5 h-5 inline-block"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M11.48 3.499a.562.562 0 011.04 0l2.125 4.305a.563.563 0 00.424.308l4.75.69a.563.563 0 01.312.96l-3.438 3.35a.563.563 0 00-.162.498l.812 4.73a.563.563 0 01-.817.592l-4.25-2.236a.563.563 0 00-.524 0l-4.25 2.236a.563.563 0 01-.817-.592l.812-4.73a.563.563 0 00-.162-.498L2.87 9.762a.563.563 0 01.312-.96l4.75-.69a.563.563 0 00.424-.308L11.48 3.5z"
        />
      </svg>
    ));
  };


  const totalPages = useMemo(() => Math.ceil(reviews.length / reviewsPerPage), [reviews]);
  const currentReviews = useMemo(() => {
    const indexOfLast = currentPage * reviewsPerPage;
    const indexOfFirst = indexOfLast - reviewsPerPage;
    return reviews.slice(indexOfFirst, indexOfLast);
  }, [reviews, currentPage]);

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 my-5">
      <div className="max-w-5xl mx-auto">
        <h3 className="text-3xl md:text-5xl font-bold text-orange-500 font-serif mb-5">
          Reviews of our customers
        </h3>

        <div className="text-center mb-6">
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-orange-600 text-white px-6 py-2 rounded-md hover:bg-orange-700 transition"
          >
            {showForm ? "Close" : "Add Review"}
          </button>
        </div>

        {showForm && <FormAddReview />}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          {currentReviews.map((rev) => (
             <div
      key={rev.id}
      className="p-6 rounded-lg shadow-lg border border-orange-600 flex flex-col items-start"
    >
      <h4 className="font-bold text-lg mb-1">{rev.userName}</h4>
      <p className="mt-3 flex-grow">{rev.comment}</p>
      <div className="flex items-center mt-1">{renderStars(rev.rating)}</div>
    </div>
          ))}
        </div>


        {totalPages > 1 && (
          <div className="flex justify-center mt-8 gap-2">
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i + 1}
                onClick={() => setCurrentPage(i + 1)}
                className={`px-4 py-2 rounded-md border ${
                  currentPage === i + 1
                    ? "bg-orange-600 text-white border-orange-600"
                    : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ReviewList;
