import React from 'react'
import { Navbar , Nav , Container , Form , FormControl , Button } from 'react-bootstrap'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import {adminLogout} from '../../redux/adminSlice'


const AdminNavbar = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handleLogout = ()=>{
    dispatch(adminLogout())
    navigate('/admin/login')
  }
  return (
    <div>
      <Navbar bg="transparent" variant="dark" expand="lg" className="mb-4">
      <Container fluid>
        <Navbar.Brand href="/admin/dashboard">Hello , Admin</Navbar.Brand>
        <Navbar.Toggle aria-controls="admin-navbar-nav" />
        <Navbar.Collapse id="admin-navbar-nav">
          <Nav className="me-auto">
          </Nav>
          <Nav className="align-items-center">          
            <Button variant="outline-light" style={{backgroundColor:'red'}} onClick={handleLogout} >
              Logout
            </Button>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
    </div>
  )
}

export default AdminNavbar
