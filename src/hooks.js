import { useDispatch, useSelector } from "react-redux";
import { blindActionCreators} from "@reduxjs/toolkit"
import { useMemo } from "react";
import {store} from "../src/Redux/store/store"

export const useAppDispatch = ()=> useDispatch()
export const useAppSelector = useSelector;