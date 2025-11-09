import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { db } from "../Firebase/config";

// 🔹 LocalStorage helpers
const getLocalCart = () => {
  const cart = localStorage.getItem("cart");
  return cart ? JSON.parse(cart) : [];
};

const saveLocalCart = (cart) => {
  localStorage.setItem("cart", JSON.stringify(cart));
};

// 🔹 Fetch user cart from Firestore
export const fetchUserCart = createAsyncThunk(
  "cart/fetchUserCart",
  async (userId, thunkAPI) => {
    try {
      const ref = doc(db, "carts", userId);
      const snap = await getDoc(ref);
      return snap.exists() ? snap.data().items || [] : [];
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

// 🔹 Merge local cart + Firestore cart
export const mergeAndSyncCart = createAsyncThunk(
  "cart/mergeAndSyncCart",
  async ({ userId, localCart }, thunkAPI) => {
    try {
      const ref = doc(db, "carts", userId);
      const snap = await getDoc(ref);
      let mergedCart = [...localCart];

      if (snap.exists()) {
        const serverCart = snap.data().items || [];
        serverCart.forEach((serverItem) => {
          const localItem = mergedCart.find((i) => i.id === serverItem.id);
          if (localItem) {
            localItem.quantity += serverItem.quantity;
          } else {
            mergedCart.push(serverItem);
          }
        });
      }

      await setDoc(ref, { userId, items: mergedCart });
      return mergedCart;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

// 🔹 Save updated cart to Firestore
export const syncCartToFirestore = createAsyncThunk(
  "cart/syncCartToFirestore",
  async ({ userId, cart }, thunkAPI) => {
    try {
      const ref = doc(db, "carts", userId);
      await updateDoc(ref, { items: cart });
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    items: getLocalCart(),
    total: 0,
  },
  reducers: {
    addToCart: (state, action) => {
      const item = action.payload;
      const existing = state.items.find((i) => i.id === item.id);
      if (existing) {
        existing.quantity += 1;
      } else {
        state.items.push({ ...item, quantity: 1 });
      }
      saveLocalCart(state.items);
    },

    removeFromCart: (state, action) => {
      state.items = state.items.filter((i) => i.id !== action.payload);
      saveLocalCart(state.items);
    },

    increaseQty: (state, action) => {
      const item = state.items.find((i) => i.id === action.payload);
      if (item) item.quantity += 1;
      saveLocalCart(state.items);
    },

    decreaseQty: (state, action) => {
      const item = state.items.find((i) => i.id === action.payload);
      if (item && item.quantity > 1) item.quantity -= 1;
      saveLocalCart(state.items);
    },

    clearCart: (state) => {
      state.items = [];
      saveLocalCart([]);
    },

    calculateTotal: (state) => {
      state.total = state.items.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      );
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserCart.fulfilled, (state, action) => {
        state.items = action.payload;
      })
      .addCase(mergeAndSyncCart.fulfilled, (state, action) => {
        state.items = action.payload;
      });
  },
});

export const {
  addToCart,
  removeFromCart,
  increaseQty,
  decreaseQty,
  clearCart,
  calculateTotal,
} = cartSlice.actions;

export default cartSlice.reducer;
