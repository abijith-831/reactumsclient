import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css'; 
import '../css/signup.css'; 
import { useDispatch, useSelector } from 'react-redux';
import { signupUser, resetUserState } from '../../redux/userSlice'; 
import { useNavigate } from 'react-router-dom';
import {toast} from 'react-toastify'

const Signup = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading, error, success, currentUser } = useSelector((state) => state.user);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    pic: null,
  });
  const [preview, setPreview] = useState(null);
  const [validationError, setValidationError] = useState('');

  const handleImage = (e) => {
    const img = e.target.files[0];
    if (img) {
      setFormData((prev) => ({ ...prev, pic: img }));
      setPreview(URL.createObjectURL(img));
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const submitHandler = (e) => {
    e.preventDefault();

    const { name, email, password, pic } = formData;

    if (!name || !email || !password || !pic) {
      setValidationError('All fields are required.');
      return;
    }

    if(!validateForm()){
      return
    }

    const data = new FormData();
    data.append('name', name);
    data.append('email', email);
    data.append('password', password);
    data.append('pic', pic);

    dispatch(signupUser(data));
  };

  useEffect(() => {
    if (success) {
      navigate('/');
      toast.success('SignUp successful!', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
      dispatch(resetUserState());
    }
  }, [success, navigate, dispatch]);


  const validateForm = () => {
    const { name, email, password } = formData;

    const nameRegex = /^[A-Za-z\s]+$/;
    if (!nameRegex.test(name)) {
      setValidationError('Name should contain only alphabets and spaces.');
      return false;
    }


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
  };

  return (
    <div  className="signup-container d-flex align-items-center justify-content-center">
      <div className="card shadow-lg" >
        <div className="card-body p-5" >
          <h3 className="card-title text-center mb-4">Sign Up</h3>
          {error && <div className="alert alert-danger">{error}</div>}
          {validationError && <div className="alert alert-warning">{validationError}</div>}
          {loading && <div className="alert alert-info">Signing up...</div>}
          <form onSubmit={submitHandler}>
            <div className="row">
              
              <div className="col-md-6">
                <div className="form-group mb-3 position-relative">
                  <label htmlFor="name" className="form-label">Name</label>
                  <input
                    type="text"
                    className="form-control form-control-lg ps-5"
                    id="name"
                    name="name"
                    placeholder="Enter your name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    aria-label="Name"
                  />
                </div>

                <div className="form-group mb-3 position-relative">
                  <label htmlFor="email" className="form-label">Email address</label>
                  <input
                    type="text"
                    className="form-control form-control-lg ps-5"
                    id="email"
                    name="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    aria-label="Email address"
                  />
                </div>

                <div className="form-group mb-3 position-relative">
                  <label htmlFor="password" className="form-label">Password</label>
                  <input
                    type="password"
                    className="form-control form-control-lg ps-5"
                    id="password"
                    name="password"
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    aria-label="Password"
                  />
                </div>
              </div>

            
              <div className="col-md-6">
                <div className="text-center mb-3">
                  <img
                    src={preview || 'https://via.placeholder.com/150'}
                    alt="Profile Preview"
                    className="profile-preview"
                  />
                </div>

                <div className="form-group mb-4 text-center">
                  <label htmlFor="pic" className="form-label d-block">Profile Picture</label>
                  <input
                    type="file"
                    className="form-control-file upload-input"
                    id="pic"
                    name="pic"
                    onChange={handleImage}
                    accept="image/*"
                    required
                    aria-label="Profile Picture"
                  />
                </div>
              </div>
            </div>

            <div className="d-grid gap-2">
              <button type="submit" className="btn btn-primary btn-lg" disabled={loading}>
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Signing Up...
                  </>
                ) : 'Sign Up'}
              </button>
            </div>
          </form>
          <div className="mt-3 text-center">
            <p>
              Already have an account? <a href="/login" className="signup-link">Login here</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
