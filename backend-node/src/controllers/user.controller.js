import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";

const generateAccessAndRefreshToken = async (userId) => {
  const user = await User.findById(userId);
  const accessToken = user.generateAccessToken();
  const refreshToken = user.generateRefreshToken();
  user.refreshToken = refreshToken;
  await user.save({ validateBeforeSave: false });
  return { accessToken, refreshToken };
};

const registerUser = asyncHandler(async (req, res) => {
  const { name, age, gender, educationLevel, email, contact, userType, password } = req.body;
  if (!name || !email || !userType || !password) throw new ApiError(400, "Required fields missing");
  if (await User.findOne({ email })) throw new ApiError(400, "Email already in use");

  let profilePictureUrl = null;
  const profilePicture = req.files?.profilePicture?.[0]?.path;
  if (profilePicture) {
    const upload = await uploadOnCloudinary(profilePicture);
    if (!upload) throw new ApiError(500, "Cloudinary upload failed");
    profilePictureUrl = upload.url;
  }

  const user = await User.create({ name, age, gender, educationLevel, email, contact, userType, profilePicture: profilePictureUrl, password });
  const createdUser = await User.findById(user._id).select("-password -refreshToken");
  if (!createdUser) throw new ApiError(500, "User creation failed");

  res.status(201).json(new ApiResponse(201, createdUser, "User registered successfully"));
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, password, userType } = req.body;
  if (!email || !password || !userType) throw new ApiError(400, "Email, password, and userType required");

  const user = await User.findOne({ email, userType });
  if (!user) throw new ApiError(404, "User not found");

  if (!await user.isPasswordCorrect(password)) throw new ApiError(401, "Invalid credentials");
  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user._id);
  const loggedInUser = await User.findById(user._id).select("-password");

  const options = { httpOnly: true, secure: true };
  res.status(200).cookie("accessToken", accessToken, options).cookie("refreshToken", refreshToken, options)
    .json(new ApiResponse(200, { user: loggedInUser, accessToken }, "Login successful"));
});

const logoutUser = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(req.user._id, { refreshToken: null });
  const options = { httpOnly: true, secure: true };
  res.clearCookie("accessToken", options).clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "Logged out successfully"));
});

const refreshAccessToken = asyncHandler(async (req, res) => {
  const refreshToken = req.cookies?.refreshToken || req.body?.refreshToken;
  if (!refreshToken) throw new ApiError(401, "Refresh token missing");

  const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
  const user = await User.findById(decoded._id);
  if (!user || user.refreshToken !== refreshToken) throw new ApiError(401, "Invalid refresh token");

  const { accessToken, refreshToken: newRefreshToken } = await generateAccessAndRefreshToken(user._id);
  res.status(200).cookie("accessToken", accessToken).cookie("refreshToken", newRefreshToken)
    .json(new ApiResponse(200, { accessToken, refreshToken: newRefreshToken }, "Token refreshed"));
});

const changePassword = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  const user = await User.findById(req.user?._id);
  if (!user) throw new ApiError(401, "Unauthorized");
  if (!await user.isPasswordCorrect(oldPassword)) throw new ApiError(401, "Incorrect old password");
  user.password = newPassword;
  await user.save({ validateBeforeSave: false });
  res.status(200).json(new ApiResponse(200, {}, "Password updated"));
});

const getCurrentUser = asyncHandler(async (req, res) => {
  res.status(200).json(new ApiResponse(200, { user: req.user }, "User details fetched"));
});

const changeUserDetails = asyncHandler(async (req, res) => {
  const { name, email } = req.body;
  if (!name && !email) throw new ApiError(400, "No updates provided");
  const updatedUser = await User.findByIdAndUpdate(req.user._id, { $set: { name, email } }, { new: true }).select("-password");
  res.status(200).json(new ApiResponse(200, updatedUser, "User updated"));
});

const addInterestedAreas = asyncHandler(async (req, res) => {
  try {
    const { areas } = req.body;
    if (!Array.isArray(areas) || !areas.length) throw new ApiError(400, "Provide valid areas");
    const user = await User.findByIdAndUpdate(req.user._id, { $addToSet: { interestedAreas: { $each: areas } } }, { new: true }).select("-password -refreshToken");
    return res.status(200).json(new ApiResponse(200, user, "Interests updated"));
  } catch (error) {
    throw new ApiError(500, "Error updating interests");
  }
});

const addExperienceFields = asyncHandler(async (req, res) => {
  const { experiences } = req.body;
  if (!Array.isArray(experiences) || !experiences.length) throw new ApiError(400, "Provide valid experiences");
  const user = await User.findByIdAndUpdate(req.user._id, { $addToSet: { experienceFields: { $each: experiences } } }, { new: true }).select("-password -refreshToken");
  res.status(200).json(new ApiResponse(200, user, "Experience updated"));
});

export {
  registerUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
  changePassword,
  getCurrentUser,
  changeUserDetails,
  addInterestedAreas,
  addExperienceFields
};
