import React from 'react'
import { useSelector } from 'react-redux'
import { Navigate } from 'react-router-dom'

const ProtectedRoute = ({children}) => {
    const currentUser = useSelector((state)=>state.user.currentUser)

    if(!currentUser){
        return <Navigate to='/login' replace/>
    }

    if(currentUser.isAdmin){
        return <Navigate to='/admin/dashboard' replace />
    }


    return children
}

export default ProtectedRoute
