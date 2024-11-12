import React, { useEffect, useState } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import '../css/adminLogin.css';
import {toast} from 'react-toastify'
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {adminLogin , resetAdminState} from '../../redux/adminSlice'


const AdminLogin = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const {adminUser , loading , error, success} = useSelector((state)=>state.admin)

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (e) =>{
        e.preventDefault()
        dispatch(adminLogin({email , password}))
    }

    useEffect(() => {
        if (success && adminUser) {
          navigate('/admin/dashboard');
          toast.success('Admin login successful!', {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
          });
          dispatch(resetAdminState());
        }
    
        if (error) {
          toast.error(error, {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
          });
          dispatch(resetAdminState());
        }
      }, [success, adminUser, navigate, dispatch, error]);
    

  return (
    <div>
          <div className="login-container d-flex align-items-center justify-content-center">
      <div className="card shadow-lg">
        <div className="card-body p-5">
          <h3 className="card-title text-center mb-4">Admin Login</h3>

          <form onSubmit={handleSubmit}>
            <div className="form-group mb-3">
              <label htmlFor="email" className="form-label">Email address</label>
              <input
                type="email"
                className="form-control form-control-lg"
                id="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="form-group mb-4">
              <label htmlFor="password" className="form-label">Password</label>
              <input
                type="password"
                className="form-control form-control-lg"
                id="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="d-grid gap-2">
              <button type="submit" className="btn btn-primary btn-lg" >
                Login
              </button>
            </div>
          </form>
          <div className="text-center mt-3">
            <button className="btn btn-link" >
              Create an Account
            </button>
          </div>
        </div>
      </div>
    </div>

    </div>
  )
}

export default AdminLogin
