import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserCircle } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
const LoginForm = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [userData, setUserData] = useState(null); 

  const data = {
    username: username,
    password: password,
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      fetchUserProfile(token);
    }
  }, []); 

  const fetchUserProfile = async (token) => {
    try {
      const response = await fetch(`http://localhost:3050/singleUser/${token.userId}`, {
        headers: {
          Authorization: `Bearer ${token}`, 
        },
      });

      if (response.ok) {
        const userProfileData = await response.json();
        setUserData(userProfileData); 
      } else {
        console.error("Failed to fetch user profile:", response.statusText);
      }
    } catch (error) {
      console.error("Error fetching user profile:", error);
    }
  };

  const checkAuth = async () => {
    try {
      const response = await fetch("http://localhost:3050/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        const { token } = await response.json();
        setSuccessMessage("Logged In Successfully");
        localStorage.setItem("token", token);
        fetchUserProfile(token);
        navigate("/UserList");
        window.location.reload();
      } else {
        alert("Failed to log in. Please try again.");
      }
    } catch (error) {
      console.error("Error logging in:", error);
    }
  };

  return (
    <div className="container custom-background" style={{height:"800px"}}>
      
      <div className="row">
        <div className="col-12 col-md-5 mx-auto custom-background2 custom-shadow  m-5 p-4 rounded ">
          {successMessage && (
            <div className="alert alert-success" role="alert">
              {successMessage}
            </div>
          )}
          {userData && (
            <div className="alert alert-info" role="alert">
              Username: {userData.username}
        
            </div>
          )}
          <h2 className="text-center text-light custom-background  w-75 mx-auto p-2" style={{marginTop:"-40px"}}>Login</h2>
          <form onSubmit={checkAuth} className="w-75 mx-auto">
            <div className=" mx-auto  text-center" style={{fontSize:"100px"}} >
              <FontAwesomeIcon  icon={faUserCircle} />
            </div>
            <div className="mb-3">
              <label className="text-light">UserName</label>
              <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} className="form-control rounded bg-dark text-light border-0" placeholder="Username" />
            </div>
            <div className="mb-3">
              <label className="text-light" >Password</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="form-control rounded bg-dark text-light border-0" placeholder="Password" />
            </div>
            <div className="mb-3 form-check">
              <input type="checkbox" className="form-check-input" id="rememberMe" />
              <label className="form-check-label text-light" htmlFor="rememberMe">Remember me</label>
            </div>
            <button type="submit" className="btn btn-primary rounded w-100">Login</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
