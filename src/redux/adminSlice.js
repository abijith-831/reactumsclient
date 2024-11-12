import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import axiosInstance from "../api/axios";
import { toast } from "react-toastify";



const adminSlice = createSlice({
  name : 'admin',
  initialState: {
      adminUser: localStorage.getItem('adminUser') ? JSON.parse(localStorage.getItem('adminUser')) : null,
      loading: false,
      error: null,
      success: false,
      users:[]
    },
    reducers: {
      adminLogout: (state) => {
        state.adminUser = null;
        state.loading = false;
        state.error = null;
        state.success = false;
        localStorage.removeItem('token');
        toast.success('Admin logged out successfully!', { theme: 'colored' });
      },
      resetAdminState: (state) => {
        state.loading = false;
        state.error = null;
        state.success = false;
      },
      updateUserStart:(state)=>{
        state.loading = true
        state.error = null
        state.success = false
      },
      updateUserSuccess : (state,action)=>{
        state.loading = false;
        const updatedUser = action.payload;
        state.users = state.users.map(user => (user._id === updatedUser._id ? updatedUser : user));
        toast.success('User updated successfully!', { theme: 'colored' });
      },
      updateUserFailure : (state,action)=>{
        state.loading = false;
        state.error = action.payload;
        toast.error(action.payload, { theme: 'colored' });
      },
      setUsers: (state, action) => {
        state.users = action.payload; 
      },
      deleteUserStart:(state)=>{
        state.loading = true
        state.error = null
        state.success = false
      },
      deleteUserSuccess: (state, action) => {
        state.loading = false;
        state.success = true;
        const deletedUserId = action.payload;
        state.users = state.users.filter(user => user._id !== deletedUserId);
        toast.success('User deleted successfully!', { theme: 'colored' });
      },
      deleteUserFailure: (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
        toast.error(action.payload, { theme: 'colored' });
      },
      addUserStart:(state)=>{
        state.loading = true
        state.error = null
        state.success = false
      },
      addUserSuccess:(state,action)=>{
        state.loading = false;
        state.success = true;
        const newUser = action.payload;
        state.users.push(newUser);
        toast.success('User added successfully!', { theme: 'colored' });
      },
      addUserFailure:(state,action)=>{
        state.loading = false;
        state.error = action.payload;
        state.success = false;
        toast.error(action.payload, { theme: 'colored' });
      }
    },
    extraReducers: (builder) => {
      builder
        .addCase(adminLogin.pending, (state) => {
          state.loading = true;
          state.error = null;
          state.success = false;
        })
        .addCase(adminLogin.fulfilled, (state, action) => {
          state.loading = false;
          state.adminUser = action.payload.user;
          state.error = null;
          state.success = true;
        })
        .addCase(adminLogin.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload;
          state.success = false;
          
        });
    },
})


//=========== ADMIN LOGIN -==============
export const adminLogin = createAsyncThunk(
    'admin/login',
    async({email , password} , thunkAPI)=>{
        try {
            const config = {
                headers: {
                  'Content-Type': 'application/json',
                },
            };
            const response = await axios.post('http://localhost:5002/api/admin/login', { email, password }, config); 
            
            localStorage.setItem('token',response.data.token)
            localStorage.setItem('adminUser',JSON.stringify(response.data.user))
            
            return response.data
        } catch (error) {
            const message =
            (error.response && error.response.data && error.response.data.message) ||
            error.message ||
            'Admin login failed.';
            return thunkAPI.rejectWithValue(message);
        }
    }
)


//=========== UPDATE USER ==================
export const updateUser = (userData)=>async(dispatch)=>{
  dispatch(updateUserStart())
  try {
    const config = {
      headers : {
        'Content-Type': 'application/json'
      }
    }
    
    const response= await axios.put('http://localhost:5002/api/admin/updateUser', userData, config);
    
    dispatch(updateUserSuccess(response.data))
  } catch (error) {
    console.error('Profile Update Error:', error);
    const errorMessage = error.response && error.response.data && error.response.data.message
      ? error.response.data.message
      : error.message;
    dispatch(updateUserFailure(errorMessage));
  }
}



//=========== DELETE USER ==================
export const deleteUser = (userData)=>async(dispatch)=>{
  dispatch(deleteUserStart())
  console.log('user',userData);
    try {
      const config = {
        headers : {
          'Content-Type': 'application/json'
        }
      }

      const response= await axios.put('http://localhost:5002/api/admin/deleteUser', {userId:userData}, config);
      console.log('res',response.data);
      dispatch(deleteUserSuccess(response.data))
    } catch (error) {
      console.error('User Delete Error:', error);
      const errorMessage = error.response && error.response.data && error.response.data.message
        ? error.response.data.message
        : error.message;
      dispatch(deleteUserFailure(errorMessage));
    }
}



//=========== ADD A NEW USER  ==================
export const addUser = (userData)=>async(dispatch)=>{
  dispatch(addUserStart())
    try {
      const config = {
        headers : {
          'Content-Type': 'multipart/form-data'
        }
      }
      

      const response = await axios.post('http://localhost:5002/api/admin/addUser',userData,config)
    } catch (error) {
      
    }
  
}


export const { adminLogout,
              resetAdminState,

              updateUserStart,
              updateUserSuccess,
              updateUserFailure,

              setUsers,

              deleteUserStart,
              deleteUserSuccess,
              deleteUserFailure,

              addUserStart,
              addUserSuccess,
              addUserFailure
               } = adminSlice.actions;

export default adminSlice.reducer;