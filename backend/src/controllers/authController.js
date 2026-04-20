import { User } from "../model/userModel.js";
import { signToken } from "../util/token.js";
import asyncWrapper from "../middleWares/asyncWrapper.js";
import ApiError from "../middleWares/ApiError.js";

/* =========================
   🟢 SIGN UP
========================= */
export const signUp = asyncWrapper(async (req, res, next) => {
  const { fullName, email, password, bio } = req.body;

  if (!fullName || !email || !password || !bio) {
    return next(new ApiError("All fields are required", 400));
  }

  const userExists = await User.findOne({ email });
  if (userExists) {
    return next(new ApiError("Email already in use", 400));
  }

  const user = await User.create({ fullName, email, password, bio });

  const token = signToken({ userId: user._id });

  res.status(201).json({
    success: true,
    message: "Account created successfully",
    user: {
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      bio: user.bio,
      profilePic: user.profilePic,
    },
    token,
  });
});

/* =========================
   🔵 LOGIN
========================= */
export const login = asyncWrapper(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new ApiError("Email and password are required", 400));
  }

  const user = await User.findOne({ email });
  if (!user) {
    return next(new ApiError("Invalid credentials", 401));
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    return next(new ApiError("Invalid credentials", 401));
  }

  const token = signToken({ userId: user._id });

  res.status(200).json({
    success: true,
    message: "Login successful",
    user: {
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      bio: user.bio,
      profilePic: user.profilePic,
    },
    token,
  });
});

/* =========================
   🟡 CHECK AUTH
========================= */
export const checkAuth = (req, res) => {
  res.status(200).json({
    success: true,
    user: req.user,
  });
};

/* =========================
   🟣 UPDATE PROFILE (FIXED)
========================= */
export const updateProfile = asyncWrapper(async (req, res, next) => {
  const { profilePic, bio, fullName } = req.body;
  const userId = req.user._id;

  const updatedFields = {
    bio,
    fullName,
  };

  // ✅ Just store URL (no upload here)
  if (profilePic) {
    updatedFields.profilePic = profilePic;
  }

  const updatedUser = await User.findByIdAndUpdate(
    userId,
    updatedFields,
    { new: true }
  );

  if (!updatedUser) {
    return next(new ApiError("Failed to update profile", 400));
  }

  res.status(200).json({
    success: true,
    message: "Profile updated successfully",
    user: updatedUser,
  });
});