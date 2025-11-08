

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../Firebase/config";


export const fetchMenuData = createAsyncThunk(
  "menu/fetchMenuData",
  async (_, thunkAPI) => {
    try {
      const [catSnap, itemsSnap] = await Promise.all([
        getDocs(collection(db, "categories")),
        getDocs(collection(db, "menuItems")),
      ]);

      const categories = catSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      const menuItems = itemsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      return { categories, menuItems };
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);

const menuSlice = createSlice({
  name: "menu",
  initialState: {
    categories: [],
    menuItems: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchMenuData.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMenuData.fulfilled, (state, action) => {
        state.loading = false;
        state.categories = action.payload.categories;
        state.menuItems = action.payload.menuItems;
      })
      .addCase(fetchMenuData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default menuSlice.reducer;
