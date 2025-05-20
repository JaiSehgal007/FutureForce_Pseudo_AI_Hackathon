import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Course } from "../models/course.model.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import mongoose from "mongoose";
import { AttendedCourse } from "../models/attendedCourse.model.js";

// CREATE COURSE
const createCourse = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const { title, description, price, domain } = req.body;

  if (!title || !price || !domain) {
    throw new ApiError(400, "Please provide all required fields");
  }

  let imageUrl = null;
  const imagePath = req.files?.image?.[0]?.path;

  if (imagePath) {
    const uploaded = await uploadOnCloudinary(imagePath);
    if (!uploaded) {
      throw new ApiError(500, "Failed to upload course image");
    }
    imageUrl = uploaded.url;
  }

  const course = await Course.create({
    title,
    description,
    price,
    domain,
    image: imageUrl,
    mentor: _id,
  });

  const created = await Course.findById(course._id).populate("mentor", "-password -refreshToken");
  return res.status(201).json(new ApiResponse(201, "Course created successfully", created));
});

// ADD MODULES TO COURSE
const addModulesToCourse = asyncHandler(async (req, res) => {
  const { courseId, modules } = req.body;
  const userId = req.user._id;

  if (!courseId || !modules || !Array.isArray(modules)) {
    throw new ApiError(400, "Please provide courseId and modules array");
  }

  const course = await Course.findById(courseId);
  if (!course) throw new ApiError(404, "Course not found");

  if (course.mentor.toString() !== userId.toString()) {
    throw new ApiError(403, "You are not authorized to modify this course");
  }

  course.modules.push(...modules);
  await course.save();

  return res.status(200).json(new ApiResponse(200, "Modules added to course", course));
});

// GET ALL COURSES
const getAllCourses = asyncHandler(async (req, res) => {
  const courses = await Course.find().populate("mentor", "-password -refreshToken");
  return res.status(200).json(new ApiResponse(200, "Courses fetched successfully", courses));
});

// GET COURSE BY ID
const getCourseById = asyncHandler(async (req, res) => {
  const { courseId } = req.params;
  if (!mongoose.Types.ObjectId.isValid(courseId)) {
    throw new ApiError(400, "Invalid courseId");
  }

  const result = await Course.aggregate([
    { $match: { _id: new mongoose.Types.ObjectId(courseId) } },
    {
      $lookup: {
        from: "users",
        localField: "mentor",
        foreignField: "_id",
        as: "mentor",
        pipeline: [{ $project: { name: 1, email: 1 } }],
      },
    },
    {
      $project: {
        title: 1,
        description: 1,
        price: 1,
        domain: 1,
        image: 1,
        modules: 1,
        mentor: { $arrayElemAt: ["$mentor", 0] },
      },
    },
  ]);

  if (!result || result.length === 0) {
    throw new ApiError(404, "Course not found");
  }

  return res.status(200).json(new ApiResponse(200, "Course fetched successfully", result[0]));
});

// EDIT COURSE
const editCourse = asyncHandler(async (req, res) => {
  const { courseId } = req.params;
  const { title, description, price, domain } = req.body;

  if (!courseId) throw new ApiError(400, "Course ID is required");

  const course = await Course.findById(courseId);
  if (!course) throw new ApiError(404, "Course not found");

  if (course.mentor.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "Unauthorized to edit this course");
  }

  course.title = title || course.title;
  course.description = description || course.description;
  course.price = price || course.price;
  course.domain = domain || course.domain;

  await course.save();
  return res.status(200).json(new ApiResponse(200, "Course updated", course));
});

// DELETE COURSE
const deleteCourse = asyncHandler(async (req, res) => {
  const { courseId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(courseId)) {
    throw new ApiError(400, "Invalid course ID");
  }

  const course = await Course.findById(courseId);
  if (!course) throw new ApiError(404, "Course not found");

  if (course.mentor.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "Unauthorized to delete this course");
  }

  await Course.findByIdAndDelete(courseId);
  return res.status(200).json(new ApiResponse(200, "Course deleted", null));
});

// ENROLL IN COURSE
const enrollInCourse = asyncHandler(async (req, res) => {
  const { courseId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(courseId)) {
    throw new ApiError(400, "Invalid course ID");
  }

  const course = await Course.findById(courseId);
  if (!course) throw new ApiError(404, "Course not found");

  const userId = req.user._id;

  // Check if already enrolled in AttendedCourse collection
  const alreadyEnrolled = await AttendedCourse.findOne({ user: userId, course: courseId });
  if (alreadyEnrolled) throw new ApiError(400, "Already enrolled");

  // Create new enrollment document
  const attendedCourse = new AttendedCourse({
    user: userId,
    course: courseId,
    completedModules: [],
  });

  await attendedCourse.save();

  return res.status(200).json(new ApiResponse(200, "Enrolled successfully", null));
});

// UNENROLL FROM COURSE
const unenrollFromCourse = asyncHandler(async (req, res) => {
  const { courseId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(courseId)) {
    throw new ApiError(400, "Invalid course ID");
  }

  const userId = req.user._id;

  // Find enrollment doc for user and course
  const enrollment = await AttendedCourse.findOne({ user: userId, course: courseId });
  if (!enrollment) throw new ApiError(400, "Not enrolled");

  await enrollment.deleteOne();

  return res.status(200).json(new ApiResponse(200, "Unenrolled successfully", null));
});

// GET ENROLLED COURSES
const getEnrolledCourses = asyncHandler(async (req, res) => {
  try {
    // console.log(req);
    const userId = req.user?._id;
      if (!userId) throw new ApiError(400, "User ID is required");
    // Find all enrollments for the user and populate the course details
  const enrolledCourses = await AttendedCourse.find({ user: userId }).populate("course");
  
  
    // Map to just course details if you want
    
  
    return res.status(200).json(new ApiResponse(200, "Enrolled courses fetched", enrolledCourses));
  } catch (error) {
    throw new ApiError(500, error?.message || "Could not fetch enrolled courses");
    
  }
});

export {
  createCourse,
  addModulesToCourse,
  getAllCourses,
  getCourseById,
  editCourse,
  deleteCourse,
  enrollInCourse,
  unenrollFromCourse,
  getEnrolledCourses,
};
