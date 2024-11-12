import React from 'react'
import Login from '../components/User/Login'

const LoginPage = ({isAdminLogin}) => {
  return (
    <div>
      <Login isAdminLogin={isAdminLogin}/>
    </div>
  )
}

export default LoginPage

