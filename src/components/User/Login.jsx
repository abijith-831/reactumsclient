import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../css/login.css';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser, resetUserState } from '../../redux/userSlice';
import {toast} from 'react-toastify'


const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { currentUser, loading, error, success } = useSelector((state) => state.user);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [validationError, setValidationError] = useState('');
  

  const handleSubmit = (e) => {
    e.preventDefault();
    setValidationError('');

    if (!validateForm()) {
      return;
    }
    dispatch(loginUser({ email, password } ));
  };

  // console.log('curr',currentUser);
  
  useEffect(() => {
    if (success && currentUser) {
      navigate('/')
      toast.success('Login successful!', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
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
      dispatch(resetUserState());
    }

  }, [success, currentUser, navigate, dispatch , error ]);



  const handleSignup = () => {
    navigate('/signup');
  };


  const validateForm = ()=>{

    const emailRegex = /^[^\s@]+@gmail\.com$/;
    if (!emailRegex.test(email)) {
      setValidationError('Please enter a valid Email address');
      return false;
    }

    if (password.length < 3) {
      setValidationError('Password should be at least 3 characters...');
      return false;
    }

    setValidationError('');
    return true;
  }

  return (
    <div className="login-container d-flex align-items-center justify-content-center">
      <div className="card shadow-lg">
        <div className="card-body p-5">
          <h3 className="card-title text-center mb-4">Login</h3>

          {/* Display server-side error messages */}
          {error && <div className="alert alert-danger">{error}</div>}

          {/* Display client-side validation errors */}
          {validationError && <div className="alert alert-warning">{validationError}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-group mb-3">
              <label htmlFor="email" className="form-label">
                Email address
              </label>
              <input
                type="text"
                className="form-control form-control-lg"
                id="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                aria-label="Email address"
              />
            </div>
            <div className="form-group mb-4">
              <label htmlFor="password" className="form-label">
                Password
              </label>
              <input
                type="password"
                className="form-control form-control-lg"
                id="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                aria-label="Password"
              />
            </div>
            <div className="d-grid gap-2">
              <button type="submit" className="btn btn-primary btn-lg" disabled={loading}>
                {loading ? (
                  <>
                    <span
                      className="spinner-border spinner-border-sm me-2"
                      role="status"
                      aria-hidden="true"
                    ></span>
                    Logging In...
                  </>
                ) : (
                  'Login'
                )}
              </button>
            </div>
          </form>
          <div className="text-center mt-3">
            <button className="btn btn-link" onClick={handleSignup}>
              Create an Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
