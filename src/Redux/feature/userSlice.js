import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import api, { setAuthToken } from "../../util/authApi";

const saved = JSON.parse(localStorage.getItem('auth')) || null;

const initialState = {
    user:{
        id:saved?.id || null,
        name:saved?.name || null,
        email:saved?.email || null,
        quidId:saved?.quidId || null,
        token:saved?.token || null
    },
    isLoggedIn:false,
    status:'idle',
    error:null
}

if(initialState.user.token){
    setAuthToken(initialState.user.token)
}

export const registerUser= createAsyncThunk(
    'auth/register',
    async (payload, { rejectWithValue})=>{
        try {
            const res = await api.post('/auth/register',payload);
            return res.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message)
        }
    }
)

export const loginUser = createAsyncThunk(
    'auth/login',
    async (payload, { rejectWithValue })=>{
        try {
            const res = await api.post('/auth/login',payload);
            return res.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message)
        }
    }
)

const authSlice = createSlice({
    name:"auth",
    initialState,
    reducers:{
        logout:(state)=>{
            state.isLoggedIn=false,
            state.user={id:null,name:null,email:null,token:null,quidId:null},
            localStorage.removeItem('auth'),
            setAuthToken(null)
        },
        setCredentails(state,action){
            const{quidId,token,id,name,email}=action.payload;
            state.user.quidId=quidId;
            state.user.token=token;
            state.user.id=id;
            state.user.name=name;
            state.user.email=email;
            localStorage.setItem('auth',JSON.stringify({quidId,token,id,name,email}))
            setAuthToken(token)
        },
    },
    extraReducers:(builder)=>{
        builder
        .addCase(registerUser.pending,(state)=>{
            state.status='loading',
            state.error=null
        })
        .addCase(registerUser.fulfilled,(state,action)=>{
            state.status='succed',
            state.user.quidId=action.payload.quidId,
            state.user.email=action.payload.email,
            state.user.id=action.payload.id,
            state.user.name=action.payload.name,
            state.user.token=action.payload.token,
            localStorage.setItem('auth',JSON.stringify({
                id:state.user.id,
                name:state.user.name,
                email:state.user.email,
                quizId:state.user.quidId,
                token:state.user.token
            }))
            setAuthToken(state.user.token)
        })
        .addCase(registerUser.rejected,(state,action)=>{
            state.status='failed',
            state.error=action.payload || action.error.message
        })
        //login
        .addCase(loginUser.pending,(state)=>{
            state.status='loading',
            state.error=null
        })
        .addCase(loginUser.fulfilled,(state,action)=>{
            state.isLoggedIn=true,
            state.status='succeded',
            state.user.id=action.payload.id,
            state.user.email=action.payload.email,
            state.user.token=action.payload.token,
            state.user.name=action.payload.name,
            state.user.quidId=action.payload.quidId,
            localStorage.setItem('auth',JSON.stringify({
                id:state.user.id,
                quidId:state.user.quidId,
                token:state.user.token,
                name:state.user.name,
                email:state.user.email
            }))
            // setAuthToken(state.user.token)
        })
        .addCase(loginUser.rejected,(state,action)=>{
            state.error=action.payload || action.error.message,
            state.status='failed'

        })
    }
})

export const {logout,setCredentails}=authSlice.actions
export default authSlice.reducer
