import { configureStore } from "@reduxjs/toolkit";
import useReducer  from "../feature/userSlice";

export const store=configureStore({
    reducer:{
        user:userReducer
    }
})