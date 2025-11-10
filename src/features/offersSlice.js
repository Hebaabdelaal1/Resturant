
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../Firebase/config";



export const fetchOffers = createAsyncThunk(
  "offers/fetchOffers",
  async (_, thunkAPI) => {
    try {
      const snapshot = await getDocs(collection(db, "offers"));
      const offersData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));

      const today = new Date();


      const validOffers = offersData.filter(
        offer => new Date(offer.validUntil) >= today
      );

      return validOffers;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

const offersSlice = createSlice({
  name: "offers",
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  extraReducers: builder => {
    builder
      .addCase(fetchOffers.pending, state => {
        state.loading = true;
      })
      .addCase(fetchOffers.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchOffers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default offersSlice.reducer;
