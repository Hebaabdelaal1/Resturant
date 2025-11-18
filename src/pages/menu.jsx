import React, { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import MenuItemCard from "../Componant/menuCard";
import { fetchCategories } from "../features/categorySlice";
import { fetchMenuItems } from "../features/menuSlice";
import { addToCart, calculateTotal } from "../features/cartSlice";
import { fetchOffers } from "../features/offersSlice";
import { Toaster } from "react-hot-toast";

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
  
  console.log("=".repeat(60));
  console.log(" Starting discount calculation...");
  console.log(` Menu Items: ${menuItems?.length || 0}`);
  console.log(` Offers Available: ${offers?.length || 0}`);
  console.log(` Current Date: ${now.toLocaleDateString()}`);
  console.log("=".repeat(60));


  if (!menuItems || menuItems.length === 0) {
    console.log(" No menu items found!");
    return [];
  }

  if (!offers || offers.length === 0) {
    console.log(" No offers found - returning items without discounts");
    return menuItems.map(item => ({
      ...item,
      originalPrice: item.hasSizes ? item.sizes[0]?.price : item.price,
      discountedPrice: item.hasSizes ? item.sizes[0]?.price : item.price,
      discountAmount: 0,
      appliedOfferTitle: null,
      hasDiscount: false,
    }));
  }

  return menuItems.map((item) => {
    let basePrice = item.hasSizes ? item.sizes[0]?.price : item.price;
    basePrice = parseFloat(basePrice) || 0;

    let bestDiscount = 0;
    let bestOffer = null;
    let originalPrice = basePrice;

    console.log("\n" + "─".repeat(50));
    console.log(` Item: ${item.name}`);
    console.log(` Base Price: ${basePrice} EGP`);
    console.log(` Category: ${item.categoryName || "No category"}`);
    console.log(` Item ID: ${item.id}`);


    offers.forEach((offer, index) => {
      console.log(`\n  [${index + 1}/${offers.length}]  Checking offer: ${offer.title}`);

      if (!offer.discountType || offer.discountValue === undefined || offer.discountValue === null || !offer.validUntil) {
        console.log(`  ⚠️ Offer "${offer.title}" has missing data:`);
        console.log(`     - discountType: ${offer.discountType || "MISSING"}`);
        console.log(`     - discountValue: ${offer.discountValue ?? "MISSING"}`);
        console.log(`     - validUntil: ${offer.validUntil || "MISSING"}`);
        console.log(`  ❌ Skipping this offer`);
        return;
      }

     
      const expiry = new Date(offer.validUntil);
      console.log(`   Offer expires: ${expiry.toLocaleDateString()}`);
      
      if (expiry <= now) {
        console.log(`   Offer expired - skipping`);
        return;
      }
      console.log(`   Offer is still valid`);

      console.log(`   Description: ${offer.description}`);
      console.log(`   Discount: ${offer.discountValue} (${offer.discountType})`);

      const offerText = (offer.title + " " + offer.description).toLowerCase();
      const categoryName = (item.categoryName || "").toLowerCase();
      
      console.log(`   Searching in: "${offerText}"`);
      console.log(`   Item category: "${categoryName}"`);

      let applies = false;
      let matchReason = "";


      if (offerText.includes("all") || offerText.includes("كل")) {
        applies = true;
        matchReason = "Applies to ALL items";
      } else if (offerText.includes("burger") || offerText.includes("برجر")) {
        if (categoryName.includes("burger") || categoryName.includes("برجر")) {
          applies = true;
          matchReason = "Burger category match";
        }
      } else if (offerText.includes("pizza") || offerText.includes("بيتزا")) {
        if (categoryName.includes("pizza") || categoryName.includes("بيتزا")) {
          applies = true;
          matchReason = "Pizza category match";
        }
      } else if (offerText.includes("drink") || offerText.includes("مشروب")) {
        if (categoryName.includes("drink") || categoryName.includes("مشروب")) {
          applies = true;
          matchReason = "Drink category match";
        }
      } else if (offerText.includes("pasta") || offerText.includes("باستا")) {
        if (categoryName.includes("pasta") || categoryName.includes("باستا")) {
          applies = true;
          matchReason = "Pasta category match";
        }
      } else if (offerText.includes("dessert") || offerText.includes("حلويات")) {
        if (categoryName.includes("dessert") || categoryName.includes("حلويات")) {
          applies = true;
          matchReason = "Dessert category match";
        }
      } else if (offerText.includes("sandwich") || offerText.includes("ساندوتش")) {
        if (categoryName.includes("sandwich") || categoryName.includes("ساندوتش")) {
          applies = true;
          matchReason = "Sandwich category match";
        }
      } else if (offerText.includes("crepe") || offerText.includes("كريب")) {
        if (categoryName.includes("crepe") || categoryName.includes("كريب")) {
          applies = true;
          matchReason = "Crepe category match";
        }
      }

      if (!applies) {
        console.log(`   Offer does not apply to this item`);
        return;
      }

      console.log(`   ${matchReason}`);


      let discountAmount = 0;

      if (offer.discountType === "percentage") {
        discountAmount = basePrice * (offer.discountValue / 100);
        console.log(`   Calculation: ${basePrice} × ${offer.discountValue}% = ${discountAmount.toFixed(2)} EGP`);
      } else if (offer.discountType === "fixed") {
        discountAmount = parseFloat(offer.discountValue);
        console.log(`   Fixed discount: ${discountAmount} EGP`);
      } else {
        console.log(`   Unknown discount type: ${offer.discountType}`);
        return;
      }

 
      if (discountAmount > bestDiscount) {
        console.log(`   NEW BEST OFFER! (${discountAmount} > ${bestDiscount})`);
        bestDiscount = discountAmount;
        bestOffer = offer;
      } else {
        console.log(`   Not better than current best (${discountAmount} <= ${bestDiscount})`);
      }
    });


    const finalPrice = Math.max(basePrice - bestDiscount, 0);
    const hasDiscount = bestDiscount > 0;

    console.log("\n" + "═".repeat(50));
    console.log(` FINAL RESULTS for "${item.name}":`);
    console.log(`   Original Price: ${originalPrice.toFixed(2)} EGP`);
    console.log(`   Best Offer: ${bestOffer?.title || "None"}`);
    console.log(`   Discount Amount: -${bestDiscount.toFixed(2)} EGP`);
    console.log(`   Final Price: ${finalPrice.toFixed(2)} EGP`);
    console.log(`  ${hasDiscount ? '✅ HAS DISCOUNT' : ' NO DISCOUNT'}`);
    console.log("═".repeat(50));

    return {
      ...item,
      originalPrice: originalPrice.toFixed(2),
      discountedPrice: finalPrice.toFixed(2),
      discountAmount: bestDiscount.toFixed(2),
      appliedOfferTitle: bestOffer?.title || null,
      hasDiscount: hasDiscount,
    };
  });
}, [menuItems, offers]);
  const filteredItems =
    selectedCategory === "all"
      ? discountedMenuItems
      : discountedMenuItems.filter((item) => item.categoryId === selectedCategory);

  const visibleItems = filteredItems.slice(0, visibleCount);
  const handleLoadMore = () => setVisibleCount((prev) => prev + 8);

  const handleAddToCart = (menuItem, cartItem) => {
    dispatch(
      addToCart({
        id: menuItem.id,
        name: menuItem.name,
        price: parseFloat(cartItem.price),
        size: cartItem.size,
        image: menuItem.image,
        availableSizes: cartItem.availableSizes,
        availableSizesData: menuItem.sizes,
      })
    );

    dispatch(calculateTotal());
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <Toaster />

      {/* Hero Section */}
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
         
              <MenuItemCard
                id={item.id}
                name={item.name}
                img={item.image}
                description={item.description}
                hasSizes={item.hasSizes}
                sizes={item.sizes}
                price={item.discountedPrice}
                originalPrice={item.hasDiscount ? item.originalPrice : null}
                onAddToCart={(cartItem) => handleAddToCart(item, cartItem)}
              />
            </div>
          ))
        )}
      </div>

      {visibleCount < filteredItems.length && (
        <div className="text-center mt-10 ">
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