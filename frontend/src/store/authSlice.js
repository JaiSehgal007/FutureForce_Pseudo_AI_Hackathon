// import { createAsyncThunk,createSlice, isRejectedWithValue } from "@reduxjs/toolkit";
// import api from '../services/api';

// // Thunk to fetch profile + items from backend
// export const fetchProfile=createAsyncThunk(
//     'auth/fetchProfile',
//     async(_,{rejectWithValue})=>{
//         try{
//             const [userRes]=await Promise.all([
//                 api.get('/user/current-user'),
//             ]);
//             console.log(userRes)
//             return {
//                 user:userRes.data.data.user,
//                 isAuthenticated:true
//             }
//         }catch(err)
//         {
//             return rejectWithValue(err.response?.data.message||err.message);
//         }
//     }
// );

// const authSlice=createSlice({
//     name:'auth',
//     initialState:{
//         user:null,
//         loading:false,
//         error:null,
//         isAuthenticated:false,
//     },
//     reducers:{
//         logout(state){
//             state.user=null
//             state.isAuthenticated=false
//             state.loading=false
//         }
//     },
//     extraReducers:(builder)=>{
//         builder.addCase(fetchProfile.pending,(state)=>{
//             state.loading=true;
//         })
//     .addCase(fetchProfile.fulfilled, (state, action) => {
//       state.loading = false;
//       state.user = action.payload.user;
//       state.isAuthenticated = action.payload.isAuthenticated;
//     })
//     .addCase(fetchProfile.rejected, (state, action) => {
//       state.loading = false;
//       state.error = action.payload;
//         state.isAuthenticated = false;
//     });
//     }
// })

// export const { logout } = authSlice.actions
// export default authSlice.reducer


import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from '../services/api';

// Thunk to fetch profile + items from backend
export const fetchProfile = createAsyncThunk(
  'auth/fetchProfile',
  async (_, { rejectWithValue }) => {
    try {
      const [userRes] = await Promise.all([
        api.get('/user/current-user'),
      ]);
      const user = userRes.data.data.user;
      return {
        user,
        isAuthenticated: true,
        userType: user.userType // 👈 assuming your backend returns user.role as "Student" or "Mentor"
      };
    } catch (err) {
      return rejectWithValue(err.response?.data.message || err.message);
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    userType: null, // 👈 added to track role
    loading: false,
    error: null,
    isAuthenticated: false,
  },
  reducers: {
    logout(state) {
      state.user = null;
      state.userType = null; // 👈 clear role on logout
      state.isAuthenticated = false;
      state.loading = false;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProfile.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.userType = action.payload.userType; // 👈 save the role
        state.isAuthenticated = action.payload.isAuthenticated;
      })
      .addCase(fetchProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.isAuthenticated = false;
        state.userType = null;
      });
  }
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
