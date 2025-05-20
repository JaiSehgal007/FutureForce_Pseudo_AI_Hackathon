import mongoose, { Schema } from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const userSchema = new Schema({
  name: { type: String, required: true },
  age: Number,
  gender: { type: String, enum: ['Male', 'Female', 'Other'] },
  educationLevel: String,
  email: { type: String, required: true, unique: true },
  contact: String,
  profilePicture: String,
  password: { type: String, required: true },
  userType: { type: String, enum: ['Student', 'Mentor', 'Admin'], required: true },
  refreshToken: { type: String, default: null },
  interestedAreas: [String],
  experienceFields: [String],
}, { timestamps: true });

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});


userSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    { _id: this._id, email: this.email, name: this.name },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: process.env.ACCESS_TOKEN_EXPIRY }
  );
};

userSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    { _id: this._id },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: process.env.REFRESH_TOKEN_EXPIRY }
  );
};

userSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};

export const User = mongoose.model('User', userSchema);
