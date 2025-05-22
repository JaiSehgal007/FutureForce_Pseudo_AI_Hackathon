import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from '../services/api';
// Check localStorage for existing auth data on initial load
const loadAuthState = () => {
  try {
    const serializedUser = localStorage.getItem('user');
    if (serializedUser === null) {
      return {
        user: null,
        isAuthenticated: false,
        userType: null
      };
    }
    const parsedUser = JSON.parse(serializedUser);
    return {
      user: parsedUser,
      isAuthenticated: true,
      userType: parsedUser.userType || null
    };
  } catch (err) {
    return {
      user: null,
      isAuthenticated: false,
      userType: null
    };
  }
};
// Initial state with persisted data
const initialState = {
  ...loadAuthState(),
  loading: false,
  error: null
};
// Thunk to fetch profile + items from backend
export const fetchProfile = createAsyncThunk(
  'auth/fetchProfile',
  async(_, { rejectWithValue }) => {
    try {
      const [userRes] = await Promise.all([
        api.get('/user/current-user'),
      ]);
      // Save user data to localStorage
      localStorage.setItem('user', JSON.stringify(userRes.data.data.user));
      return {
        user: userRes.data.data.user,
        isAuthenticated: true,
        userType: userRes.data.data.user.userType
      };
    } catch(err) {
      return rejectWithValue(err.response?.data.message || err.message);
    }
  }
);
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout(state) {
      // Clear localStorage on logout
      localStorage.removeItem('user');
      state.user = null;
      state.isAuthenticated = false;
      state.loading = false;
      state.userType = null;
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
        state.isAuthenticated = action.payload.isAuthenticated;
        state.userType = action.payload.userType;
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
