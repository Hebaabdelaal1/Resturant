import React, { useState } from "react";
import toast from "react-hot-toast";
import { FiShoppingCart } from "react-icons/fi";
import { FiChevronDown } from "react-icons/fi";


const MenuItemCard = ({
  id,
  name,
  img,
  description,
  hasSizes,
  sizes = [],
  price,
  onAddToCart,
}) => {
  

  const [selectedSize, setSelectedSize] = useState(
  hasSizes ? sizes[0] : { size: "One Size", price }
);
const [open, setOpen] = useState(false);

  

  return (
    <div
      key={id}
      className="bg-gray-900/70 border border-gray-800 rounded-xl p-3 w-[250px] flex flex-col items-center text-center shadow-md hover:shadow-lg transition-transform duration-300 hover:-translate-y-1"
    >
      <div className="w-full h-28 mb-3">
        <img
          src={img}
          alt={name}
          className="w-full h-full object-cover rounded-lg"
          loading="lazy"
        />
      </div>

      <h3 className="text-white text-base font-bold mb-1">{name}</h3>

      <p className="text-gray-400 text-sm mb-2">{description}</p>


      <h5 className="text-orange-600 font-bold text-xl mb-3">
        {selectedSize.price} EGP
      </h5>


      <div className="w-full flex items-center justify-center gap-3 mt-3">

  <div className="relative w-auto">
    {hasSizes ? (
      <>

        <button
          onClick={() => setOpen(!open)}
          className="
            w-full bg-orange-600 px-3 py-2 rounded-lg 
            text-gray-200 flex justify-between items-center 
            border border-gray-700 hover:border-orange-500 
            transition-all duration-300
          "
        >
          <span className="px-2 font-extrabold"> {selectedSize?.size?.charAt(0).toUpperCase()}</span>
          <FiChevronDown
            className={`transition-transform duration-300 ${
              open ? "rotate-180" : "rotate-0"
            }`}
          />
        </button>

        {/* Dropdown List */}
        {open && (
  <div
    className="
      absolute left-0 right-0 
      bottom-full mb-2 
      bg-gray-900 border border-gray-700 
      rounded-lg shadow-xl z-20 
      animate-[dropdown_.25s_ease-out]
    "
  >
    {sizes.map((option) => (
      <div
        key={option.size}
        onClick={() => {
          setSelectedSize(option);
          setOpen(false);
        }}
        className="
          px-4 py-2 cursor-pointer hover:bg-gray-800 
          flex justify-between items-center text-gray-200 
          transition-all duration-150
        "
      >
       <span className="bg-orange-600 text-white px-2 py-1 rounded-md text-xs">
  {option.size?.charAt(0).toUpperCase()}
</span>
      </div>
    ))}
  </div>
)}
      </>
    ) : (
      <p className="text-orange-500 font-semibold text-sm">
        One Size
      </p>
    )}
  </div>

  {/* --- Add to Cart Button --- */}
 
<button
  onClick={() => {
    onAddToCart({
      id,
      name,
      price: hasSizes ? selectedSize.price : price,
      size: hasSizes ? selectedSize.size : "One Size",  // << تم إصلاح الحجم
      img,
      availableSizes: hasSizes ? sizes.map(s => s.size) : ["One Size"],  // << مهم جدا
    });
    toast.success(`${name} (${selectedSize.size}) added to cart`);
  }}
  className="
      flex items-center justify-center 
      bg-orange-600 hover:bg-orange-500 
      text-white p-2 h-10 w-12 rounded-lg 
      transition-all duration-150
    "
>
  <FiShoppingCart className="text-xl" />
</button>

</div>

    
    </div>
  );
};

export default MenuItemCard;


