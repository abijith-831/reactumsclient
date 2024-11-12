import React, { useState, useEffect } from 'react';
import { Table, Button, Spinner, Alert  ,FormControl , Modal , Form} from 'react-bootstrap';
import axiosInstance from '../../api/axios'; 
import '../css/dashboard.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useDispatch, useSelector } from 'react-redux';
import { message } from 'antd';
import { updateUser , deleteUser , addUser} from '../../redux/adminSlice';
import useSelection from 'antd/es/table/hooks/useSelection';



const AdminDashboard = () => {
  const dispatch = useDispatch()


  const [users, setUsers] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState(null);

  const [searchItems , setSearchItems] = useState('')

  const [showModal , setShowModal] = useState(false)
  const [selected , setSelected] = useState(null)
  const [newName , setNewName] = useState('')
  const [newEmail , setNewEmail] = useState('')
  const [password , setPassword] = useState('')
  const [profile , setProfile] = useState('')

  const [userToDelete , setUserToDelete] = useState(null)
  const [showDeleteModal , setShowDeleteModal] = useState(false)

  const [showAddUserModal , setShowAddUserModal] = useState(false)
  const handleOpenAddUserModal = () => setShowAddUserModal(true);
  const handleCloseAddUserModal = () => setShowAddUserModal(false);



  

  //========== FOR RENDERING USER DETAILS ==========
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem('adminToken');
        const config = {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        };
        const response = await axiosInstance.get('http://localhost:5002/api/admin/dashboard', config);
        setUsers(response.data);
        setLoading(false);
      } catch (error) {
        const message =
          (error.response && error.response.data && error.response.data.message) ||
          error.message ||
          'Failed to fetch users.';
        setError(message);
        setLoading(false);
      }
    };

    fetchUsers();
  }, [])
  //================================================

  

  //=========== FOR UPDATING USER DETAILS ==========
  const handleEditUser = (user)=>{
    setShowModal(true)
    setSelected(user)
    setNewName(user.name)
    setNewEmail(user.email)
  }


  const handleUpdate = async (e) => {
    e.preventDefault();
  
    const updatedUser = {
      name: newName,
      email: newEmail,
      id: selected._id,
    };
  
    try {
       dispatch(updateUser(updatedUser));

      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user._id === updatedUser.id ? { ...user, name: newName, email: newEmail } : user
        )
      );
      setShowModal(false);
      setSelected(null);
  
      message.success('Profile updated successfully!')
      
    } catch (error) {
      message.error('Failed to update profile')
    }
  };



  const handleCloseModal = () => {
    setShowModal(false);
    setSelected(null);
  };
  //===============================================
  


  //=============   FOR DELETING USERS =============
  const handleDeleteUser = async(user)=>{
    setUserToDelete(user)
    setShowDeleteModal(true)
  }
  
  const handleCloseDeleteModal = ()=>{
    setUserToDelete(null)
    setShowDeleteModal(false)
  }

  const confirmDeleteUser = async()=>{
    if(!userToDelete) return

    try {
      dispatch(deleteUser(userToDelete._id))
      setUsers((prevUsers) => prevUsers.filter((user) => user._id !== userToDelete._id));
      setShowDeleteModal(false)
      setUserToDelete(null)
      message.success('User Deleted successfully!')
    } catch (error) {
      message.error('Failed to delete user')
    }
  }
  //=================================================




  //============== FOR CREATING A NEW USER ===========
  const handleProfilePictureChange = (e) => {
    setProfile(e.target.files[0]);
  };

  const handleAddUser = async(e)=>{
    e.preventDefault();
    
    const formData = new FormData();
    formData.append('name', newName);
    formData.append('email', newEmail);
    formData.append('password', password);
    formData.append('profile', profile);

    console.log('dadf',formData);
    try {
      dispatch (addUser(formData))
    } catch (error) {
      
    }

  }



  //==================================================
  //============== FOR SEARCHING USERS=================
  const handleSearch = (e)=>{
    setSearchItems(e.target.value)
  }

  const searchedUsers = users.filter(user=> 
    user.name.toLowerCase().includes(searchItems.toLowerCase()) 
  )
  //====================================================

  return (
    <div className='dashboard'>
      <div className="container">
        <h2 className="mb-4 text-center text-white">User Management</h2>
        <br />
        <div className="mb-4">
          <FormControl
            type="search"
            placeholder="Search Users"
            className="me-2"
            aria-label="Search"
            value={searchItems} 
            onChange={handleSearch}
          />
        </div>
        
        <Table >
          
          <thead>
            <tr>
              <th>No.</th>
              <th>Username</th>
              <th>Email</th>
              <th>Created Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {searchedUsers.length > 0 ? (
              searchedUsers.map((user, index) => (
                <tr key={user._id}>
                  <td>{index + 1}</td>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                  <td>
                    <Button onClick={()=>handleEditUser(user)} variant="warning" size="sm" className="me-2">
                      Edit
                    </Button>
                    <Button onClick={()=>handleDeleteUser(user)} variant="danger" size="sm">
                      Delete
                    </Button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center">No users found.</td>
              </tr>
            )}
          </tbody>

        </Table>
        <button onClick={handleOpenAddUserModal} className='add-user-btn' style={{display:'block'}}>ADD USER</button>


      </div>
      {selected && (
        <Modal show={showModal} onHide={handleCloseModal}>
          <Modal.Header closeButton>
            <Modal.Title>Edit User</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={handleUpdate}>
              <Form.Group controlId="formUserName" className="mb-3">
                <Form.Label>Username</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter username"
                  name="name"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  required
                />
              </Form.Group>
              <Form.Group controlId="formUserEmail" className="mb-3">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="Enter email"
                  name="email"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  required
                />
              </Form.Group>
              <Button variant="primary" type="submit" >
                submit
              </Button>
            </Form>
          </Modal.Body>
        </Modal>

        
      )}
            <Modal show={showDeleteModal} onHide={handleCloseDeleteModal}>
                <Modal.Header closeButton>
                  <Modal.Title>Confirm Delete</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  {userToDelete && (
                    <p>
                      Are you sure you want to delete <strong>{userToDelete.name}</strong>?
                    </p>
                  )}
                </Modal.Body>
                <Modal.Footer>
                  <Button variant="secondary" onClick={handleCloseDeleteModal}>
                    Cancel
                  </Button>
                  <Button variant="danger" onClick={confirmDeleteUser}>
                    Delete
                  </Button>
                </Modal.Footer>
            </Modal>

            <Modal show={showAddUserModal} >
              <Modal.Header closeButton>
                <Modal.Title>Add New User</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <Form onSubmit={handleAddUser}>
                  <Form.Group controlId="formUserName" className="mb-3">
                    <Form.Label>Username</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter username"
                      value={newName}
                      onChange={(e) => setNewName(e.target.value)}
                      required
                    />
                  </Form.Group>

                  <Form.Group controlId="formUserEmail" className="mb-3">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                      type="email"
                      placeholder="Enter email"
                      value={newEmail}
                      onChange={(e) => setNewEmail(e.target.value)}
                      required
                    />
                  </Form.Group>

                  <Form.Group controlId="formUserPassword" className="mb-3">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                      type="password"
                      placeholder="Enter password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </Form.Group>

                  <Form.Group controlId="formUserProfilePicture" className="mb-3">
                    <Form.Label>Profile Picture</Form.Label>
                    <Form.Control
                      type="file"
                      accept="image/*"
                      onChange={handleProfilePictureChange}
                    />
                  </Form.Group>

                  <Button variant="primary" type="submit">
                    Add User
                  </Button>
                </Form>
              </Modal.Body>
            </Modal>
    </div>
  );
};

export default AdminDashboard;
