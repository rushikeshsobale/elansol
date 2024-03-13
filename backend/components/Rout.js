const express = require("express");
const cookieParser = require("cookie-parser");
const router = express.Router();
const AllData = require("../components/userModule");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const secretKey = process.env.JWT_SECRET || "mySecreateKey";
router.use(cookieParser());

const verifyToken = (req, res, next) => {
    const token = req.cookies.token;
    console.log(token)
    if (!token) {
        return res.status(401).send("Unauthorized: No token provided");
    }

    jwt.verify(token, secretKey, (err, decoded) => {
        if (err) {
            return res.status(401).send("Unauthorized: Invalid token");
        }
        req.userId = decoded.userId;
        next();
    });
};

const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

router.post("/register", async (req, res) => {
    try {
        if (!req.body.name || !req.body.dob || !req.body.email || !req.body.password) {
            return res.status(400).json({ error: "Please fill out all fields." });
        }

        if (!validateEmail(req.body.email)) {
            return res.status(400).json({ error: "Please enter a valid email address." });
        }

        if (req.body.password !== req.body.confirmPassword) {
            return res.status(400).json({ error: "Passwords do not match." });
        }

        const existingUser = await AllData.findOne({ $or: [{ name: req.body.name }, { email: req.body.email }] });
        if (existingUser) {
            return res.status(400).json({ error: "Username or email already exists." });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);

        const user = new AllData({
            name: req.body.name,
            dob: req.body.dob,
            email: req.body.email,
            password: hashedPassword
        });

        await user.save();
        console.log("Data inserted successfully.");
        return res.status(200).json({ message: "Registration successful." });
    } catch (error) {
        console.error("Error during registration:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

router.post("/login", async (req, res) => {
    const { username, password } = req.body;
  
    try {
      const user = await AllData.findOne({ name: username });
  
      if (user) {
        const validPassword = await bcrypt.compare(password, user.password);
  
        if (validPassword) {
          const token = jwt.sign(
            { userId: user._id, username: user.name },
            secretKey,
            { expiresIn: "3560d" } 
          );
          console.log(token)
          res.cookie("token", token, { httpOnly: true, sameSite: "strict" });
          return res.status(200).json({ message: "Successfully logged in", token });
          
        } else {
          return res.status(400).send("Password does not match");
        }
      } else {
        return res.status(404).send("User not found...");
      }
    } catch (error) {
      console.error(error);
      return res.status(500).send("Internal Server Error");
    }
  });
  
router.get("/users", async (req, res) => {
    try {
        const allUsers = await AllData.find();
        return res.status(200).json(allUsers);
    } catch (error) {
        console.error("Error fetching users:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
});



router.get("/singleUser/:id",verifyToken, async (req, res) => {
    try {
        const _id = req.params.id;
        const singleData = await AllData.findById(_id);
        return res.status(200).send(singleData);
    } catch (error) {
        console.log("data not get ", error);
        return res.status(404).send("Data not found");
    }
});

router.put("/update/:id", async (req, res) => {
    try {
        const _id = req.params.id;
        const updateData = await AllData.findByIdAndUpdate(_id, req.body, { new: true });

        if (!updateData) {
            return res.status(404).send("User not found ");
        }

        return res.status(200).send("Data updated: " + updateData);
    } catch (error) {
        console.log(error);
        return res.status(500).send("Internal Server Error");
    }
});

router.delete('/remove/:userId', async (req, res) => {
    try {
    
        const userId = req.params.userId;

        
        const removedUser = await AllData.findByIdAndDelete(userId);

        if (removedUser) {
            res.status(200).json({ message: 'User removed successfully' });
        } else {
            res.status(404).json({ error: `User with ID ${userId} not found` });
        }
    } catch (error) {
        
        console.error('Error removing user:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
module.exports = router;
