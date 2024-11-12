// client/src/redux/userSlice.js
import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import axiosInstance from "../api/axios";


const getInitialUser = () => {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser && storedUser !== "undefined") {
      try {
        return JSON.parse(storedUser);
      } catch (error) {
        console.error('Failed to parse currentUser from localStorage:', error);
        return null;
      }
    }
    return null;
};


const initialState = {
  currentUser: getInitialUser(),
  loading: false,
  error: null,
  success: false, 
};


const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: { 
    signUpStart: (state) => {
      state.loading = true;
      state.error = null;
      state.success = false;
    },
    signUpSuccess: (state, action) => {
      state.currentUser = action.payload;
      state.loading = false;
      state.error = null;
      state.success = true;
      localStorage.setItem('currentUser', JSON.stringify(action.payload));
    },
    signUpFailure: (state, action) => {
      state.loading = false; 
      state.error = action.payload;
      state.success = false;
    },

    resetUserState: () => initialState,

    loginStart:(state)=>{
        state.loading = true
        state.error = null
        state.success = false
    },
    loginSuccess:(state,action)=>{
        state.currentUser = action.payload.user
        state.loading = false
        state.error = null
        state.success = true
        localStorage.setItem('token',action.payload.token)
        localStorage.setItem('currentUser', JSON.stringify(action.payload.user));
    },
    loginFailure:(state , action)=>{
        state.loading = false
        state.error = action.payload
        state.success = false
    },

    logout: (state) => {
      state.currentUser = null;
      state.loading = false;
      state.error = null;
      state.success = false;
      localStorage.removeItem('token');
      localStorage.removeItem('currentUser');
    },

    updateProfileStart: (state) => {
      state.loading = true;
      state.error = null;
      state.success = false;
    },

    updateProfileSuccess: (state, action) => {
      state.currentUser = { ...state.currentUser, ...action.payload };
      state.loading = false;
      state.error = null;
      state.success = true;
      localStorage.setItem('currentUser', JSON.stringify(state.currentUser)); // Update local storage
    },

    updateProfileFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.success = false;
    },
  },
});

 
export const { signUpStart,
    signUpSuccess,
    signUpFailure, 
    resetUserState, 
    loginStart,
    loginSuccess,
    loginFailure,
    logout ,
    updateProfileStart,
    updateProfileSuccess,
    updateProfileFailure
} = userSlice.actions;


export const signupUser = (userData) => async (dispatch) => {
  dispatch(signUpStart());

  try {
    const config = {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    };

    const response = await axios.post('http://localhost:5002/api/users/signup', userData, config);

    dispatch(signUpSuccess(response.data));
  } catch (error) {

    const errorMessage = error.response && error.response.data && error.response.data.message
      ? error.response.data.message
      : error.message;

    dispatch(signUpFailure(errorMessage));
  }
};


export const loginUser = (credentials) => async (dispatch) => {
    dispatch(loginStart());

    try {
        const config = {
            headers: {
                'Content-Type': 'application/json',
            },
        };

        const response = await axios.post(`http://localhost:5002/api/users/login`, credentials, config);
        console.log('Login Response:', response.data);

        dispatch(loginSuccess(response.data));
    } catch (error) {
        console.error('Login Error:', error);
        const errorMessage = error.response && error.response.data && error.response.data.message
            ? error.response.data.message
            : error.message;

        dispatch(loginFailure(errorMessage));
    }
};


export const updateProfile = (userData)=>async(dispatch)=>{
  dispatch(updateProfileStart())

  try {
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
    };
    console.log('headerrr',config);

    const response = await axios.put('http://localhost:5002/api/users/update-profile', userData, config);
    console.log('sdfsgs',response.data);
    dispatch(updateProfileSuccess(response.data))
  } catch (error) {
    console.error('Profile Update Error:', error);
    const errorMessage = error.response && error.response.data && error.response.data.message
      ? error.response.data.message
      : error.message;
    dispatch(updateProfileFailure(errorMessage));
  }
}

export default userSlice.reducer;
