import { configureStore } from "@reduxjs/toolkit";
import authReducer  from "../feature/userSlice";

export const store=configureStore({
    reducer:{
        auth:authReducer
    }
})

export default store;