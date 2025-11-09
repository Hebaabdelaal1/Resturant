import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchMenuData } from "../features/menuSlice";
import MenuItemCard from "../Componant/menuCard";
import { addToCart, calculateTotal } from "../features/cartSlice";

function Menu() {
  const dispatch = useDispatch();
  const { categories, menuItems } = useSelector((state) => state.menu);

  const [selectedCategory, setSelectedCategory] = useState("all");
  const [visibleCount, setVisibleCount] = useState(8);

  useEffect(() => {
    dispatch(fetchMenuData());
  }, [dispatch]);

  const filteredItems =
    selectedCategory === "all"
      ? menuItems
      : menuItems.filter((item) => item.categoryId === selectedCategory);

  const visibleItems = filteredItems.slice(0, visibleCount);

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + 8);
  };

  const handleAddToCart = (item) => {
    dispatch(
      addToCart({
        id: item.id,
        name: item.name,
        price: item.hasSizes ? item.sizes[0].price : item.price,
        image: item.image,
      })
    );
    dispatch(calculateTotal());
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* ---------- Hero Section ---------- */}
      <div
        className="relative w-full h-[400px] flex items-center justify-center text-center overflow-hidden mb-10"
        style={{
          backgroundImage: "url('/Imgs/unsplash.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-black/70"></div>
        <div className="relative z-10 text-white px-4">
          <h1 className="text-3xl sm:text-5xl font-bold mb-3">
            Discover Our Menu
          </h1>
          <p className="text-gray-300 text-sm sm:text-base max-w-lg mx-auto">
            From crispy appetizers to hearty main courses and delightful
            desserts, our menu offers something for every craving.
          </p>
        </div>
      </div>

      {/* ---------- Category Buttons ---------- */}
      <div className="flex justify-center gap-3 flex-wrap mb-10">
        <button
          onClick={() => {
            setSelectedCategory("all");
            setVisibleCount(8);
          }}
          className={`px-6 py-2 rounded-full font-semibold text-sm transition-all duration-300 ${
            selectedCategory === "all"
              ? "bg-orange-600 text-white shadow-md"
              : "bg-gray-800 text-gray-300 hover:bg-gray-700"
          }`}
        >
          All
        </button>

        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => {
              setSelectedCategory(category.id);
              setVisibleCount(8);
            }}
            className={`px-6 py-2 rounded-full font-semibold text-sm transition-all duration-300 ${
              selectedCategory === category.id
                ? "bg-orange-600 text-white shadow-md"
                : "bg-gray-800 text-gray-300 hover:bg-gray-700"
            }`}
          >
            {category.name}
          </button>
        ))}
      </div>

      {/* ---------- Menu Items ---------- */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {visibleItems.length === 0 ? (
          <div className="col-span-full text-center text-gray-400 text-lg py-20">
            No items found.
          </div>
        ) : (
          visibleItems.map((item) => (
            <MenuItemCard
              key={item.id}
              id={item.id}
              name={item.name}
              description={item.description}
              price={item.hasSizes ? item.sizes[0]?.price : item.price}
              img={`${item.image}?w=400&q=60`}
              rating={item.rating}
              isFavorite={false}
              onAddToCart={() => handleAddToCart(item)} // ✅ Fixed
              onToggleFavorite={() => console.log("Fav:", item.id)}
            />
          ))
        )}
      </div>

      {/* ---------- Load More ---------- */}
      {visibleCount < filteredItems.length && (
        <div className="text-center mt-10">
          <button
            onClick={handleLoadMore}
            className="px-6 py-3 bg-orange-600 hover:bg-orange-500 rounded-lg text-white font-semibold transition-all"
          >
            Load More
          </button>
        </div>
      )}
    </div>
  );
}

export default Menu;
