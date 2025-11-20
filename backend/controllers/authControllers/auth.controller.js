import jwt from "jsonwebtoken";
import User from "../../models/user.model.js";

/**
 * @desc    Register a new user
 * @route   POST /api/auth/register
 * @access  Public
 */
export const registerUser = async (req, res, next) => {
  try {
    const { userName, userEmail, password, role } = req.body;

    // 1️⃣ Validate input fields
    if (!userName || !userEmail || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide userName, userEmail, and password.",
      });
    }

    // 2️⃣ Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ userName }, { userEmail }],
    });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Username or email already exists.",
      });
    }

    // 3️⃣ Create new user (password hashing handled by pre-save hook)
    const newUser = await User.create({
      userName,
      userEmail,
      password,
      role: role || "student",
    });

    // 4️⃣ Respond with success (exclude password)
    res.status(201).json({
      success: true,
      message: "User registered successfully.",
      data: {
        user: {
          _id: newUser._id,
          userName: newUser.userName,
          userEmail: newUser.userEmail,
          role: newUser.role,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Login user & set JWT token in HTTP-only cookie
 * @route   POST /api/auth/login
 * @access  Public
 */

export const loginUser = async (req, res, next) => {
  try {
    const { userEmail, password } = req.body;

    // 1️⃣ Validate input
    if (!userEmail || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required.",
      });
    }

    // 2️⃣ Find user and include password
    const user = await User.findOne({ userEmail }).select("+password");
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials.",
      });
    }

    // 3️⃣ Compare password using model method
    const isPasswordMatch = await user.comparePassword(password);
    if (!isPasswordMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials.",
      });
    }

    // 4️⃣ Generate JWT token
    const token = jwt.sign(
      {
        _id: user._id,
        userName: user.userName,
        userEmail: user.userEmail,
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "2h" }
    );

    // 5️⃣ Set cookie options
    const cookieOptions = {
      httpOnly: true, // prevents access via JS (XSS protection)
      secure: process.env.NODE_ENV === "production", // true on HTTPS
      sameSite: "none", // for two different origin 
      maxAge: 2 * 60 * 60 * 1000, // 2 hours
    };

    // 6️⃣ Send cookie and response
    res
      .status(200)
      .cookie("accessToken", token, cookieOptions)
      .json({
        success: true,
        message: "Logged in successfully.",
        data: {
          user: {
            _id: user._id,
            userName: user.userName,
            userEmail: user.userEmail,
            role: user.role,
          },
        },
      });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Check authentication status
 * @route   GET /api/auth/check
 * @access  Private
 */
export const checkAuth = async (req, res, next) => {
  try {
    const user = req.user; // populated by auth middleware
    res.status(200).json({
      success: true,
      message: "Authenticated user.",
      data: { user },
    });
  } catch (error) {
    next(error);
  }
};

export const logoutUser = async (req, res, next) => {
  try {
    // Clear the access token cookie
    res.clearCookie("accessToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
    });

    return res.status(200).json({
      success: true,
      message: "Logged out successfully.",
    });
  } catch (error) {
    next(error);
  }
};
