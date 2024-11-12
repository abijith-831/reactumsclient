import React from 'react'
import AdminNavbar from '../components/Admin/AdminNavbar'
import AdminDashboard from '../components/Admin/AdminDashboard'
import '../components/css/dashboard.css'

const Admin = () => {
  return (
    <div className="admin-container">
      <AdminNavbar/>
      <AdminDashboard/>
    </div>
  )
}

export default Admin
