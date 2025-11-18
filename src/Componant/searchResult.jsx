import React, { useEffect, useMemo, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import MenuItemCard from "./menuCard";
import { addToCart, calculateTotal } from "../features/cartSlice";
import { useLocation } from "react-router-dom";

function useQueryParams() {
  return new URLSearchParams(useLocation().search);
}

export default function SearchResult() {
  const searchTerm = useQueryParams().get("query") || "";
  const dispatch = useDispatch();
  const { items: menuItems } = useSelector((state) => state.menu);
  const { items: offers } = useSelector((state) => state.offers);

  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [visibleCount, setVisibleCount] = useState(8);


  const discountedMenuItems = useMemo(() => {
    const now = new Date();

    if (!menuItems) return [];

    return menuItems.map((item) => {
      let basePrice = item.hasSizes ? item.sizes[0]?.price : item.price;
      basePrice = parseFloat(basePrice) || 0;
      let bestDiscount = 0;
      let bestOffer = null;

      offers.forEach((offer) => {
        if (!offer.discountType || offer.discountValue == null || !offer.validUntil) return;
        const expiry = new Date(offer.validUntil);
        if (expiry <= now) return;

        const offerText = (offer.title + " " + offer.description).toLowerCase();
        const categoryName = (item.categoryName || "").toLowerCase();
        let applies = false;

        if (offerText.includes("all") || offerText.includes("كل")) applies = true;
        else if (offerText.includes("burger") && categoryName.includes("burger")) applies = true;
        else if (offerText.includes("pizza") && categoryName.includes("pizza")) applies = true;
        else if (offerText.includes("drink") && categoryName.includes("drink")) applies = true;

        if (!applies) return;

        const discountAmount =
          offer.discountType === "percentage"
            ? basePrice * (offer.discountValue / 100)
            : parseFloat(offer.discountValue);

        if (discountAmount > bestDiscount) {
          bestDiscount = discountAmount;
          bestOffer = offer;
        }
      });

      const finalPrice = Math.max(basePrice - bestDiscount, 0);
      return {
        ...item,
        originalPrice: basePrice.toFixed(2),
        discountedPrice: finalPrice.toFixed(2),
        discountAmount: bestDiscount.toFixed(2),
        appliedOfferTitle: bestOffer?.title || null,
        hasDiscount: bestDiscount > 0,
      };
    });
  }, [menuItems, offers]);


  const filteredResults = useMemo(() => {
    let items = discountedMenuItems;

    if (selectedCategory !== "all") {
      items = items.filter(item => item.categoryId === selectedCategory);
    }

    const term = searchTerm.toLowerCase().trim();
    if (term) {
      items = items.filter(
        item =>
          item.name.toLowerCase().includes(term) ||
          item.description.toLowerCase().includes(term)
      );
    }

    return items;
  }, [discountedMenuItems, selectedCategory, searchTerm]);


  const visibleResults = filteredResults.slice(0, visibleCount);
  const handleLoadMore = () => setVisibleCount(prev => prev + 8);


  useEffect(() => {
    setLoading(true);
    const timeout = setTimeout(() => setLoading(false), 300);
    return () => clearTimeout(timeout);
  }, [searchTerm, discountedMenuItems, selectedCategory]);


  const handleAddToCart = (menuItem) => {
    dispatch(addToCart({
      id: menuItem.id,
      name: menuItem.name,
      price: parseFloat(menuItem.discountedPrice),
      image: menuItem.image,
    }));
    dispatch(calculateTotal());
  };

  return (
    <div className="text-white p-4 min-h-screen bg-black text-center">
      {loading && <p>Loading...</p>}

      {!loading && filteredResults.length === 0 && <p>No items found.</p>}

      <div className="max-w-6xl mx-auto mt-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {visibleResults.map(item => (
          <MenuItemCard
            key={item.id}
            id={item.id}
            name={item.name}
            img={item.image}
            description={item.description}
            hasSizes={item.hasSizes}
            sizes={item.sizes}
            price={item.discountedPrice}
            appliedOfferTitle={item.appliedOfferTitle}
            onAddToCart={() => handleAddToCart(item)}
          />
        ))}
      </div>

      {visibleCount < filteredResults.length && (
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
