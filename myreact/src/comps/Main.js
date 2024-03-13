import React from 'react'
import {BrowserRouter, Route, Routes} from "react-router-dom"
import RegistrationForm from './Form'
import Navigation from './Navigation'
import LoginForm from './Login'
import "../../node_modules/bootstrap/dist/css/bootstrap.min.css"
import UserList from './UserList'


export default function Main() {
  return (
    <div>
        <BrowserRouter>
            <Navigation/>
            <Routes>
              
                <Route path="/register" element={<RegistrationForm/>}/>
                <Route path="/login" element={<LoginForm/>}/>
                <Route path="/UserList" element={<UserList/>}/>

            </Routes>
        </BrowserRouter>
    </div>
  )
}
