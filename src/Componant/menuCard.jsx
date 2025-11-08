import React from "react";
import { FiHeart, FiShoppingCart } from "react-icons/fi";

const MenuItemCard = ({
  id,
  name,
  price,
  img,
  rating,
  description,
  isFavorite,
  onAddToCart,
  onToggleFavorite,
}) => {
  return (
    <div
      key={id}
      className="bg-gray-900/70 border border-gray-800 rounded-xl p-4 w-[200px] flex flex-col items-center text-center shadow-md hover:shadow-lg transition-transform duration-300 hover:-translate-y-1"
    >
      <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-gray-800 mb-3">
        <img
          src={img}
          alt={name}
          className="w-full h-full object-cover"
          loading="lazy"
        />
      </div>


      <h3 className="text-white text-base font-semibold mb-1">{name}</h3>


      <div className="flex items-center justify-center gap-2 text-sm text-gray-400 mb-3">
        <h5 className="text-orange-400 font-bold"> {price} EGP</h5>
        <h6>⭐ {rating}</h6>
      </div>
      <p className="text-white text-base  mb-1">{description}</p>

      <div className="flex items-center justify-center gap-3 mt-auto">
        <button
          onClick={() => onAddToCart({ id, name, price, img })}
          aria-label={`Add ${name} to cart`}
          className="p-2 rounded-lg bg-orange-600 hover:bg-orange-500 text-white transition-all duration-150"
        >
          <FiShoppingCart className="text-lg" />
        </button>

        <button
          onClick={() => onToggleFavorite(id)}
          aria-label={isFavorite ? "Remove from wishlist" : "Add to wishlist"}
          className={`p-2 rounded-lg border border-gray-700 transition-all duration-150 ${
            isFavorite
              ? "bg-red-600/90 text-white"
              : "bg-transparent text-gray-300 hover:bg-gray-800"
          }`}
        >
          <FiHeart className={`text-lg ${isFavorite ? "text-white" : ""}`} />
        </button>
      </div>
    </div>
  );
};

export default MenuItemCard;
