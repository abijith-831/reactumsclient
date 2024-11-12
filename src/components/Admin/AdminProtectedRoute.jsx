import React from 'react'
import { Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux'

const AdminProtectedRoute = ({children}) => {
    const {adminUser} = useSelector((state)=> state.admin)

    if(!adminUser){
        return <Navigate to='/admin/login' replace />
    }
  return children 
}

export default AdminProtectedRoute
