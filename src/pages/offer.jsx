import React, { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchOffers } from "../features/offersSlice";
import { Link } from "react-router-dom";

function Offer() {
  const dispatch = useDispatch();
  const { items: offers, loading, error } = useSelector((state) => state.offers);

  useEffect(() => {
    dispatch(fetchOffers());
  }, [dispatch]);


  const validOffers = useMemo(() => {
    return offers
      .filter((o) => new Date(o.validUntil) > new Date())
      .sort((a, b) => new Date(a.validUntil) - new Date(b.validUntil))
      .map((offer) => {
        const daysLeft = Math.max(
          Math.ceil((new Date(offer.validUntil) - new Date()) / (1000 * 60 * 60 * 24)),
          0
        );
        return { ...offer, daysLeft };
      });
  }, [offers]);

  if  (loading)
  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <p className="text-white text-lg">Loading offers...</p>
    </div>
  );

  if (error) return <p className="text-center text-red-500 mt-10">Error: {error}</p>;

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black text-white p-8">


      <div
        className="relative w-full h-[300px] flex flex-col items-center justify-center text-center mb-10 bg-black"
        style={{
          backgroundImage: "url('/Imgs/photo.avif')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-black/60"></div>
        <div className="relative z-10 flex flex-col items-center gap-4">
          <h1 className="text-6xl font-extrabold text-orange-500 drop-shadow-lg">
            Special Offers
          </h1>
          <p className="text-gray-200 text-lg max-w-xl mx-auto drop-shadow-md">
            Exclusive deals crafted just for you, don’t miss out!
          </p>
          <Link
           to="/menu"
            className="mt-2 bg-orange-600 hover:bg-orange-500 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-200"
          >
            Explore Menu
          </Link>
        </div>
      </div>


      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {validOffers.length === 0 ? (
          <div className="col-span-full text-center text-gray-400">
            No offers available right now.
          </div>
        ) : (
          validOffers.map((offer) => (
            <div
              key={offer.id}
              className="relative bg-gray-800 rounded-2xl shadow-lg overflow-hidden border border-gray-700 hover:scale-[1.03] hover:border-orange-500 transition-transform duration-300 group"
            >

              {offer.image && (
                <img
                  src={offer.image}
                  alt={offer.title}
                  loading="lazy"
                  className="w-full h-40 object-cover rounded-t-2xl"
                />
              )}

              <div className="p-6 flex flex-col justify-between h-full">
                <h3 className="text-2xl font-bold text-orange-400 mb-2 group-hover:text-orange-300 transition">
                  {offer.title}
                </h3>

                <p className="text-gray-300 text-sm mb-4">{offer.description}</p>

                <div className="mb-2">
                  <p className="text-lg font-semibold text-red-500">
                    {offer.discountType === "percentage"
                      ? `${offer.discountValue}% OFF`
                      : `Save $${offer.discountValue}`}
                  </p>
                </div>

                <p className="text-sm text-red-500 font-medium mb-2">
                  Ends in: {offer.daysLeft} day{offer.daysLeft !== 1 ? "s" : ""}
                </p>

                <p className="text-xs text-gray-400 mt-auto">
                  Valid until:{" "}
                  <span className="text-gray-200 font-medium">
                    {new Date(offer.validUntil).toLocaleDateString()}
                  </span>
                </p>
              </div>


              <div
                className={`absolute top-3 right-3 text-xs font-semibold px-3 py-1 rounded-full shadow-md ${
                  offer.daysLeft <= 2 ? "bg-red-600" : "bg-orange-600"
                }`}
              >
                Limited Time
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Offer;
