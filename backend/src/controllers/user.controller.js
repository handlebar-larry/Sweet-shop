const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user.model");

// Register
const registerUser = async (req, res) => {
  const { name, email, contact, address, password } = req.body;

  try {
    const passwordHash = await bcrypt.hash(password, 10);

    await User.create({
      name,
      email,
      contact,
      address,
      password: passwordHash,
    });

    return res.status(200).json({ message: "Registered successfully!" });
  } catch (err) {
    return res.status(500).json({ message: "Registration failed!", error: err.message });
  }
};

// Login
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const userRecord = await User.findOne({ email });
    if (!userRecord) {
      return res.status(400).json({ message: "User not found!" });
    }

    const passwordMatches = await bcrypt.compare(password, userRecord.password);
    if (!passwordMatches) {
      return res.status(400).json({ message: "Invalid credentials!" });
    }

    const authToken = jwt.sign(
      { id: userRecord._id, isAdmin: userRecord.isAdmin, email: userRecord.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    return res
      .cookie("uid", authToken, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
      })
      .status(200)
      .json({ message: "Login successful!", token: authToken });
  } catch (err) {
    return res.status(500).json({ message: "Login failed!", error: err.message });
  }
};

const getUser = async (req, res) => {
  try {
    const authenticatedUserId = req.user.id;

    const user = await User.findById(authenticatedUserId).select(
      "name email isAdmin address profilepic contact"
    );

    if (!user) {
      return res.status(400).json({ message: "User not found!" });
    }

    return res.status(200).json({ user });
  } catch (err) {
    console.error("Error fetching user data:", err);
    return res.status(500).json({ message: "Failed to fetch user data" });
  }
};

// Logout
const logoutUser = async (req, res) => {
  try {
    res.clearCookie("uid", {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
    });

    return res.status(200).json({ message: "Logged out successfully!" });
  } catch (err) {
    return res.status(500).json({ message: "Logout failed!", error: err.message });
  }
};

// Keep old export names too (so old routes/tests won't break if referenced)
module.exports = {
  // new names
  registerUser,
  // legacy names
  createUser: registerUser,
  loginUser,
  getUser,
  logoutUser,
};
