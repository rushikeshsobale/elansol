import React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link } from 'react-router-dom'
export default function Navigation() {
  return (
    <div>
        <nav className=" text-center navbar navbar-expand-lg custom-background2 ">
  <div className="container w-25 mx-auto">
    
    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
      <span className="navbar-toggler-icon"></span>
    </button>
    <div className="collapse navbar-collapse" id="navbarNav">
      <ul className="navbar-nav fs-7">
        <li className="nav-item mx-2">
          <Link className="nav-link active" aria-current="page" to="/login">Home</Link>
        </li>
        <li className="nav-item mx-2">
          <Link className="nav-link" to="/register">Register</Link>
        </li>
        <li className="nav-item mx-2">
          <Link className="nav-link" to="/login">Login</Link>
        </li>
        <li className="nav-item mx-2">
          <Link className="nav-link" to="/UserList">Users</Link>
        </li>
      </ul>
    </div>
  </div>
</nav>
    </div>
  )
}
