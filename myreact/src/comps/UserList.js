
import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { jwtDecode } from 'jwt-decode';

const UserList = () => {
    const [name, setName] = useState("");
    const [dob, setDob] = useState("");
    const [email, setEmail] = useState("");
    const [users, setUsers] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null); // Add state for the selected user
    const token = localStorage.getItem("token");
    console.log(token.userId, 'Hiiiiiiii')
    const decodedToken = jwtDecode(token);
    const userId = decodedToken.userId;
    console.log(userId, "giigigigig");
    const fetchUsers = async () => {
        try {
            const response = await fetch("http://localhost:3050/users");
            if (response.ok) {
                const data = await response.json();
                setUsers(data);
            } else {
                console.error("Failed to fetch users:", response.statusText);
            }
        } catch (error) {
            console.error("Error fetching users:", error);
        }
    };

    useEffect(() => {

        fetchUsers();

    }, []);

    const showModel = (user) => {
        setSelectedUser(user); // Set the selected user when the modal is opened
        setShowModal(true);
        // Set the initial state of name, dob, and email with the values of the selected user
        setName(user.name);
        setDob(user.dob);
        setEmail(user.email);
    };

    const closeModal = () => {
        setShowModal(false);
    };

    const saveChanges = async () => {
        try {
            const response = await fetch(`http://localhost:3050/update/${userId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name,
                    dob,
                    email
                }),
            });

            if (response.ok) {
                // Profile updated successfully
                console.log("Profile updated successfully");
                closeModal(); // Close the modal after saving changes
                fetchUsers();
            } else {
                console.error("Failed to update profile:", response.statusText);
            }
        } catch (error) {
            console.error("Error updating profile:", error);
        }
    };
    const removeUser = async (userId) => {
        try {
            const response = await fetch(`http://localhost:3050/remove/${userId}`, {
                method: "DELETE",
            });

            if (response.ok) {
                console.log("User removed successfully");
                fetchUsers();
            } else {
                console.error("Failed to remove user:", response.statusText);
            }
        } catch (error) {
            console.error("Error removing user:", error);
        }
    };
    return (
        <div className="container">
            <h2>User List</h2>
            <table className="table">
                <thead>
                    <tr>
                        <th scope="col">#</th>
                        <th scope="col">Name</th>
                        <th scope="col">Email</th>
                        <th scope="col">Date of Birth</th>
                        <th scope="col">Action</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((user, index) => (
                        <tr key={user._id}>
                            <td>{index + 1}</td>
                            <td>{user.name}</td>
                            <td>{user.email}</td>
                            <td>{user.dob}</td>
                            <td>
                                <button className={`btn btn-primary mr-2 ${user._id !== userId ? 'disabled' : ''}`} onClick={() => showModel(user)}>Edit</button>
                                <button className={`btn btn-danger ${user._id !== userId ? 'disabled' : ''}`} onClick={() => removeUser(user._id)}>Remove</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {/* Add your modal component here */}
            {showModal && (
                <div className="modal fade show" tabIndex="-1" role="dialog" style={{ display: 'block' }}>
                    <div className="modal-dialog" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Edit User Profile</h5>
                            </div>
                            <div className="modal-body">
                                <form>
                                    <div className="mb-3">
                                        <input type="text" className="form-control rounded border" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
                                    </div>
                                    <div className="mb-3">
                                        <input type="date" className="form-control rounded border" placeholder="Date of Birth" value={dob} onChange={(e) => setDob(e.target.value)} />
                                    </div>
                                    <div className="mb-3">
                                        <input type="email" className="form-control rounded border" placeholder="Email address" value={email} onChange={(e) => setEmail(e.target.value)} />
                                    </div>
                                </form>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={closeModal}>Close</button>
                                <button type="button" className="btn btn-primary" onClick={saveChanges}>Save changes</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserList;