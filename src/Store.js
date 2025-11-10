import { configureStore } from "@reduxjs/toolkit"
import menuReducer from "./features/menuSlice"
import cartReducer from "./features/cartSlice"
import offersReducer from "./features/offersSlice"
import categoryReducer from "./features/categorySlice"

export const store =configureStore({
reducer:{
    menu: menuReducer,
   categories: categoryReducer,
    cart: cartReducer,
    offers: offersReducer,

},

})