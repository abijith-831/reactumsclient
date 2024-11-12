import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../components/css/homePage.css';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout, updateProfile } from '../redux/userSlice';
import { toast } from 'react-toastify';
import banner from '../assets/header-img.svg';
import '@fortawesome/fontawesome-free/css/all.min.css';

 
const HomePage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const currentUser = useSelector((state) => state.user.currentUser);

    const [showModal, setShowModal] = useState(false);

    const [name, setName] = useState(currentUser.name);

    const [selectedFile, setSelectedFile] = useState(null);

    const [imgPreview, setImgPreview] = useState(currentUser.pic);

    const [validationError, setValidationError] = useState('');


    useEffect(() => {
        setImgPreview(currentUser.pic);
    }, [currentUser.pic]);


    const handleLogout = () => {
        dispatch(logout());
        toast.success('You have logged out successfully!', {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
        });
        navigate('/login');
    };


    const handleEditProfile = () => {
        setShowModal(true);
    };


    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImgPreview(reader.result); 
            };
            reader.readAsDataURL(file);
            setSelectedFile(file); 
        }
    };
    
    const validateForm = () => {
        const nameRegex = /^[A-Za-z\s]+$/;

        if (!nameRegex.test(name)) {
            setValidationError('Name should contain only alphabets and spaces.');
            return false;
        }

        setValidationError('');
        return true;
    };

    const handleSaveChanges = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }


        const formData = new FormData();
        formData.append('name', name);
        formData.append('userId',currentUser._id)
        if (selectedFile) {
            formData.append('pic', selectedFile);
        }

        dispatch(updateProfile(formData))
            .then(() => {
                toast.success('Profile updated successfully!', {
                    position: "top-right",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                });
                setShowModal(false); 
            })
            .catch((err) => {
                
            });
    };

    return (
        <div className="home-container">
            <nav className="navbar navbar-expand-lg shadow-sm">
                <div className="container-fluid">
                    <a className="navbar-brand d-flex align-items-center" href="/">
                        <img
                            src={
                                imgPreview && imgPreview.startsWith('data:image/')
                                    ? imgPreview
                                    : currentUser.pic
                                        ? `http://localhost:5002/${currentUser.pic}`
                                        : 'https://via.placeholder.com/40'
                            }
                            alt="Profile"
                            className="rounded-circle me-2 profile-pic"
                        />
                        <span className="brand-name text-white">Welcome, {currentUser.name}</span>
                    </a>
                    <button
                        className="navbar-toggler"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#navbarNav"
                        aria-controls="navbarNav"
                        aria-expanded="false"
                        aria-label="Toggle navigation"
                    >
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarNav">
                        <ul className="navbar-nav ms-auto align-items-center">
                            <li className="nav-item me-3">
                                <button
                                    className="btn btn-primary"
                                    onClick={handleEditProfile}
                                >
                                    Edit Profile
                                </button>
                            </li>
                            <li className="nav-item">
                                <button
                                    className="btn btn-danger"
                                    onClick={handleLogout}
                                >
                                    Logout
                                </button>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
            <main className="mt-4">
                <div className="welcome-section text-center">
                    <h1>Welcome to Your Dashboard</h1>
                    <p className="lead text-white">Explore and manage your account efficiently.</p>
                </div>
                <br />
                <div className='text-center banner-img'>
                    <img src={banner} alt="" style={{ width: '400px' }} />
                </div>
            </main>
            {showModal && (
                <div className="modal fade show" style={{ display: 'block' }} tabIndex="-1" role="dialog">
                    <div className="modal-dialog" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Edit Profile</h5>
                                <button type="button" className="close" onClick={() => setShowModal(false)} aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div className="modal-body">
                                <form onSubmit={handleSaveChanges}>
                                    {imgPreview && (
                                        <div className="mt-3 text-center">
                                            <img
                                                src={
                                                    imgPreview.startsWith('data:image/')
                                                        ? imgPreview
                                                        : `http://localhost:5002/${imgPreview}`
                                                }
                                                alt="Preview"
                                                className="img-thumbnail"
                                                style={{ width: '200px', height: '200px', borderRadius: '50%', borderColor: 'black' }}
                                            />
                                        </div>
                                    )}
                                    {validationError && <div className="alert alert-warning mt-3">{validationError}</div>}
                                    <div className="form-group mt-3">
                                        <label htmlFor="pic">Profile Picture</label>
                                        <input
                                            type="file"
                                            className="form-control"
                                            id="pic"
                                            accept="image/*"
                                            onChange={handleFileChange}
                                        />
                                    </div>

                                    <div className="form-group mt-3">
                                        <label htmlFor="name" style={{ borderColor: 'black' }}>Name</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="name"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                        />
                                    </div>

                                    <div className="modal-footer mt-3 text-center">
                                        <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Close</button>
                                        <button type="submit" className="btn btn-primary">Save changes</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            {showModal && <div className="modal-backdrop fade show"></div>}
        </div>
    );
}

export default HomePage;
