import { configureStore } from "@reduxjs/toolkit"
import menuReducer from "./features/menuSlice"
import cartReducer from "./features/cartSlice"

export const store =configureStore({
reducer:{
    menu :menuReducer,
    cart: cartReducer,

},

})