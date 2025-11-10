import React, { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import MenuItemCard from "../Componant/menuCard";
import { fetchCategories } from "../features/categorySlice";
import { fetchMenuItems } from "../features/menuSlice";
import { addToCart, calculateTotal } from "../features/cartSlice";
import { fetchOffers } from "../features/offersSlice";

function Menu() {
  const dispatch = useDispatch();

  const { items: menuItems, loading } = useSelector((state) => state.menu);
  const { items: categories } = useSelector((state) => state.categories);
  const { items: offers } = useSelector((state) => state.offers);

  const [selectedCategory, setSelectedCategory] = useState("all");
  const [visibleCount, setVisibleCount] = useState(8);

  useEffect(() => {
    dispatch(fetchCategories());
    dispatch(fetchMenuItems());
    dispatch(fetchOffers());
  }, [dispatch]);

 
  const discountedMenuItems = useMemo(() => {
    const now = new Date();

    return menuItems.map((item) => {
      let basePrice = item.hasSizes ? item.sizes[0].price : item.price;
      let bestDiscount = 0;
      let bestOffer = null;

      offers.forEach((offer) => {
        const expiry = new Date(offer.validUntil);
        if (expiry > now) {
          const offerText = (offer.title + " " + offer.description).toLowerCase();

     
          const appliesToBurger =
            offerText.includes("burger") &&
            item.categoryName?.toLowerCase().includes("burger");

          const appliesToPizza =
            offerText.includes("pizza") &&
            item.categoryName?.toLowerCase().includes("pizza");

          const appliesToDrink =
            offerText.includes("drink") &&
            item.categoryName?.toLowerCase().includes("drink");

          const appliesToAll = offerText.includes("all");

          if (appliesToBurger || appliesToPizza || appliesToDrink || appliesToAll) {
            let discountAmount = 0;

            if (offer.discountType === "percentage") {
              discountAmount = basePrice * (offer.discountValue / 100);
            } else if (offer.discountType === "fixed") {
              discountAmount = offer.discountValue;
            }

   
            if (discountAmount > bestDiscount) {
              bestDiscount = discountAmount;
              bestOffer = offer;
            }
          }
        }
      });

      const finalPrice = Math.max(basePrice - bestDiscount, 0);

      return {
        ...item,
        discountedPrice: finalPrice.toFixed(2),
        appliedOfferTitle: bestOffer?.title || null,
      };
    });
  }, [menuItems, offers]);

  const filteredItems =
    selectedCategory === "all"
      ? discountedMenuItems
      : discountedMenuItems.filter((item) => item.categoryId === selectedCategory);

  const visibleItems = filteredItems.slice(0, visibleCount);
  const handleLoadMore = () => setVisibleCount((prev) => prev + 8);

  const handleAddToCart = (item) => {
    dispatch(
      addToCart({
        id: item.id,
        name: item.name,
        price: parseFloat(item.discountedPrice),
        image: item.image,
      })
    );
    dispatch(calculateTotal());
  };

  return (
    <div className="min-h-screen bg-black text-white">

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
            From crispy appetizers to hearty main courses and delightful desserts,
            our menu offers something for every craving.
          </p>
        </div>
      </div>


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


      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {loading ? (
          <div className="col-span-full text-center text-gray-400 py-20">
            Loading menu...
          </div>
        ) : visibleItems.length === 0 ? (
          <div className="col-span-full text-center text-gray-400 py-20">
            No items found.
          </div>
        ) : (
          visibleItems.map((item) => (
            <div key={item.id} className="relative">

              {/* {item.appliedOfferTitle && (
                <div className="absolute top-2 left-2 bg-orange-600 text-white text-xs font-semibold px-2 py-1 rounded">
                  {item.appliedOfferTitle}
                </div>
              )} */}

              <MenuItemCard
                id={item.id}
                name={item.name}
                description={item.description}
                price={item.discountedPrice}
                img={`${item.image}?w=400&q=60`}
                rating={item.rating}
                // isFavorite={false}
                onAddToCart={() => handleAddToCart(item)}
                onToggleFavorite={() => console.log("Fav:", item.id)}
              />
            </div>
          ))
        )}
      </div>


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
