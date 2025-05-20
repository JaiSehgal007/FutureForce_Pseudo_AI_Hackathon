import { createAsyncThunk,createSlice, isRejectedWithValue } from "@reduxjs/toolkit";
import api from '../services/api';

// Thunk to fetch profile + items from backend
export const fetchProfile=createAsyncThunk(
    'auth/fetchProfile',
    async(_,{rejectWithValue})=>{
        try{
            const [userRes]=await Promise.all([
                api.get('/user/current-user'),
            ]);
            console.log(userRes)
            return {
                user:userRes.data.data.user,
                isAuthenticated:true
            }
        }catch(err)
        {
            return rejectWithValue(err.response?.data.message||err.message);
        }
    }
);

const authSlice=createSlice({
    name:'auth',
    initialState:{
        user:null,
        loading:false,
        error:null,
        isAuthenticated:false,
    },
    reducers:{
        logout(state){
            state.user=null
        }
    },
    extraReducers:(builder)=>{
        builder.addCase(fetchProfile.pending,(state)=>{
            state.loading=true;
        })
    .addCase(fetchProfile.fulfilled, (state, action) => {
      state.loading = false;
      state.user = action.payload.user;
    })
    .addCase(fetchProfile.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
    }
})

export const { logout } = authSlice.actions
export default authSlice.reducer