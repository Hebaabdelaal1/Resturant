// src/firebase/seedData.js
import { db } from './config';
import { collection, doc, setDoc, serverTimestamp } from 'firebase/firestore';

// إضافة Categories
export const addCategories = async () => {
  try {
    const categories = [
      {
        id: "cat1",
        name: "Pizza",
        image: "https://images.unsplash.com/photo-1513104890138-7c749659a591",
        description: "All types of delicious pizza"
      },
      {
        id: "cat2",
        name: "Burgers",
        image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd",
        description: "Juicy burgers with fresh ingredients"
      },
      {
        id: "cat3",
        name: "Drinks",
        image: "https://images.unsplash.com/photo-1437418747212-8d9709afab22",
        description: "Refreshing beverages"
      },
      {
        id: "cat4",
        name: "Pasta",
        image: "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9",
        description: "Italian pasta dishes"
      }
    ];

    for (const category of categories) {
      await setDoc(doc(db, "categories", category.id), {
        name: category.name,
        image: category.image,
        description: category.description
      });
      console.log(`Category ${category.name} added!`);
    }
    
    console.log("✅ All categories added successfully!");
  } catch (error) {
    console.error("❌ Error adding categories:", error);
  }
};

// إضافة Menu Items
export const addMenuItems = async () => {
  try {
    const items = [
      {
        id: "item1",
        name: "Margherita Pizza",
        description: "Classic pizza with tomato sauce, mozzarella, and fresh basil",
        image: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002",
        categoryId: "cat1",
        available: true,
        rating: 4.5,
        numReviews: 25,
        hasSizes: true,
        sizes: [
          { size: "Small", price: 80 },
          { size: "Medium", price: 120 },
          { size: "Large", price: 160 }
        ]
      },
      {
        id: "item2",
        name: "Pepperoni Pizza",
        description: "Pizza topped with pepperoni and extra cheese",
        image: "https://images.unsplash.com/photo-1628840042765-356cda07504e",
        categoryId: "cat1",
        available: true,
        rating: 4.7,
        numReviews: 30,
        hasSizes: true,
        sizes: [
          { size: "Small", price: 90 },
          { size: "Medium", price: 140 },
          { size: "Large", price: 180 }
        ]
      },
      {
        id: "item3",
        name: "Classic Burger",
        description: "Beef patty with lettuce, tomato, and special sauce",
        image: "https://images.unsplash.com/photo-1550547660-d9450f859349",
        categoryId: "cat2",
        available: true,
        rating: 4.3,
        numReviews: 18,
        hasSizes: true,
        sizes: [
          { size: "Regular", price: 85 },
          { size: "Large", price: 110 }
        ]
      },
      {
        id: "item4",
        name: "Coca Cola",
        description: "Cold refreshing soft drink",
        image: "https://images.unsplash.com/photo-1554866585-cd94860890b7",
        categoryId: "cat3",
        available: true,
        rating: 4.0,
        numReviews: 50,
        hasSizes: false,
        price: 20
      },
      {
        id: "item5",
        name: "Pasta Alfredo",
        description: "Creamy pasta with parmesan cheese",
        image: "https://images.unsplash.com/photo-1645112411341-6c4fd023714a",
        categoryId: "cat4",
        available: true,
        rating: 4.6,
        numReviews: 22,
        hasSizes: false,
        price: 110
      }
    ];

    for (const item of items) {
      const itemData = {
        name: item.name,
        description: item.description,
        image: item.image,
        categoryId: item.categoryId,
        available: item.available,
        rating: item.rating,
        numReviews: item.numReviews,
        hasSizes: item.hasSizes,
        createdAt: serverTimestamp()
      };

      if (item.hasSizes) {
        itemData.sizes = item.sizes;
      } else {
        itemData.price = item.price;
      }

      await setDoc(doc(db, "menuItems", item.id), itemData);
      console.log(`Menu item ${item.name} added!`);
    }
    
    console.log("✅ All menu items added successfully!");
  } catch (error) {
    console.error("❌ Error adding menu items:", error);
  }
};

// إضافة Offers
export const addOffers = async () => {
  try {
    const offers = [
      {
        id: "offer1",
        title: "Buy 1 Get 1 Free",
        description: "Buy any large pizza and get another one free!",
        discountType: "percentage",
        discountValue: 50,
        validUntil: "2025-12-31"
      },
      {
        id: "offer2",
        title: "20% Off on Burgers",
        description: "Get 20% discount on all burger meals",
        discountType: "percentage",
        discountValue: 20,
        validUntil: "2025-11-30"
      }
    ];

    for (const offer of offers) {
      await setDoc(doc(db, "offers", offer.id), {
        title: offer.title,
        description: offer.description,
        discountType: offer.discountType,
        discountValue: offer.discountValue,
        validUntil: offer.validUntil
      });
      console.log(`Offer ${offer.title} added!`);
    }
    
    console.log("✅ All offers added successfully!");
  } catch (error) {
    console.error("❌ Error adding offers:", error);
  }
};

// تشغيل كل الـ functions
export const seedAllData = async () => {
  console.log("🌱 Starting to seed data...");
  await addCategories();
  await addMenuItems();
  await addOffers();
  console.log("🎉 All data seeded successfully!");
};