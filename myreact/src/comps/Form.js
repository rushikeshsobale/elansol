import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserCircle } from '@fortawesome/free-solid-svg-icons';
import * as jwt_decode from 'jwt-decode'; 
import { useNavigate } from 'react-router-dom';
import '../index.css'
const RegistrationForm = () => {
  const Navigate = useNavigate()
  const [name, setName] = useState("");
  const [dob, setDob] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !dob || !email || !password || !confirmPassword) {
      setErrorMessage("Please fill out all fields.");
      return;
    }

    if (!validateEmail(email)) {
      setErrorMessage("Please enter a valid email address.");
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match.");
      return;
    }

    const data = {
      name,
      dob,
      email,
      password,
      confirmPassword
    };

    try {
      // Send registration request
      const response = await fetch("http://localhost:3050/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      // Handle response
      if (response.ok) {
        const { message } = await response.json();
        setSuccessMessage(message);
        // Clear form fields
        setName("");
        setDob("");
        setEmail("");
        setPassword("");
        setConfirmPassword("");
        setErrorMessage("");
        Navigate("./login")
      } else {
        const { error } = await response.json();
        setErrorMessage(error);
      }
    } catch (error) {
      console.error("Error:", error);
      setErrorMessage("An error occurred. Please try again.");
    }
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  return (
    <div className="container p-3 custom-background" style={{height:"900px"}}>
      <div className="row">
        <div className="col-12 col-md-4 mx-auto custom-background2 custom-shadow rounded my-5">
          <h2 className="text-center text-light custom-background  w-75 mx-auto p-2" style={{marginTop:"-30px"}}>Register</h2>
          {errorMessage && (
            <div className="alert alert-danger" role="alert">
              {errorMessage}
            </div>
          )}
          {successMessage && (
            <div className="alert alert-success" role="alert">
              {successMessage}
            </div>
          )}
          <form className="w-75 mx-auto" onSubmit={handleSubmit}>
            <div className=" mx-auto  text-center" style={{ fontSize: "80px" }}>
              <FontAwesomeIcon icon={faUserCircle} />
            </div>
            <div className="mb-3">
              <label className="form-check-label text-light">User name</label>
              <input type="text" className="form-control rounded bg-dark text-light border-0" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div className="mb-3">
            <label className="form-check-label text-light">Date of Birth</label>
              <input type="date" className="form-control rounded bg-dark text-light border-0" placeholder="Date of Birth" value={dob} onChange={(e) => setDob(e.target.value)} />
            </div>
            <div className="mb-3">
            <label className="form-check-label text-light">Email</label>
              <input type="email" className="form-control rounded bg-dark text-light border-0" placeholder="Email address" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div className="mb-3">
              <label className="form-check-label text-light">password</label>
              <input type="password" className="form-control rounded bg-dark text-light border-0" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>
            <div className="mb-3">
              <label className="form-check-label text-light">Confirm password</label>
              <input type="password" className="form-control rounded bg-dark text-light border-0" placeholder="Confirm Password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
            </div>
            <button type="submit" className="btn btn-primary rounded w-100 mb-3">Register</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegistrationForm;
