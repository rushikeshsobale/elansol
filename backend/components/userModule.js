const mongoose = require("mongoose");

const userDetailsSchema = new mongoose.Schema({
    name: String,
    dob: String,
    email: String,
    password: String,
    confirmPassword: String
});

const UserDetails = mongoose.model("UserDetails", userDetailsSchema);

module.exports = UserDetails;
