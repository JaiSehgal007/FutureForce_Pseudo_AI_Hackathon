import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Course } from "../models/course.model.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import mongoose from "mongoose";
import { AttendedCourse } from "../models/attendedCourse.model.js";
import { Module } from "../models/module.model.js";
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
  // Get courseId from URL params instead of body
  const courseId = req.params.courseId;
  const userId = req.user._id;
  
  // Extract module data from request body
  const title = req.body.title;
  const description = req.body.description;
  
  if (!courseId || !title) {
    throw new ApiError(400, "Please provide courseId and module title");
  }

  const course = await Course.findById(courseId);
  if (!course) throw new ApiError(404, "Course not found");

  if (course.mentor.toString() !== userId.toString()) {
    throw new ApiError(403, "You are not authorized to modify this course");
  }
  
  // Create a new module
  const moduleData = {
    title,
    description: description || ""
  };
  
  // Add image URL if an image was uploaded
  if (req.files && req.files.image && req.files.image.length > 0) {
    // Process the uploaded file (this depends on your file upload setup)
    const uploadedFile = req.files.image[0];
    // Assuming you have a function to get the URL of the uploaded file
    moduleData.image = uploadedFile.path; // or however you get the image URL
  }
  
  // Create the module
  const module = await Module.create(moduleData);
  
  // Add module ID to course
  course.modules.push(module._id);
  await course.save();

  return res.status(200).json(new ApiResponse(200, "Module added to course", course));
});


// GET ALL COURSES
const getAllCourses = asyncHandler(async (req, res) => {
  const courses = await Course.find().populate("mentor", "-password -refreshToken");
  return res.status(200).json(new ApiResponse(200, "Courses fetched successfully", courses));
});


// Get recommended courses by calling FastAPI backend
const getRecommendedCourses = asyncHandler(async (req, res) => {
  // Get user from JWT (set by verifyJWT middleware)
  const userId = req.user?._id;
  if (!userId) {
    throw new ApiError(401, "Unauthorized: User not found");
  }

  // Fetch user from MongoDB
  const user = await User.findById(userId).select("interestedAreas");
  if (!user || !user.interestedAreas || user.interestedAreas.length === 0) {
    throw new ApiError(404, "No interested areas found for user");
  }

  try {
    // Call FastAPI /recommend-courses endpoint
    const fastapiUrl = `${process.env.FASTAPI_URL}/recommend-courses`;
    const response = await axios.post(fastapiUrl, {
      interestedAreas: user.interestedAreas,
    }, {
      headers: { "Content-Type": "application/json" },
    });

    // Format response to match FastAPI output
    const results = response.data.map((item) => ({
      area: item.area,
      courses: item.courses.map((course) => ({
        id: course.id,
        score: course.score,
        course_name: course.course_name,
        category: course.category,
        text: course.text,
      })),
    }));

    return res.status(200).json(
      new ApiResponse(200, "Recommended courses fetched successfully", results)
    );
  } catch (error) {
    console.error("Error calling FastAPI:", error.response?.data || error.message);
    throw new ApiError(
      error.response?.status || 500,
      error.response?.data?.detail || "Failed to fetch recommended courses"
    );
  }
});


const getCourseById = asyncHandler(async (req, res) => {
  const { courseId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(courseId)) {
    throw new ApiError(400, "Invalid courseId");
  }

  const result = await Course.aggregate([
    { $match: { _id: new mongoose.Types.ObjectId(courseId) } },

    // Populate mentor
    {
      $lookup: {
        from: "users",
        localField: "mentor",
        foreignField: "_id",
        as: "mentor",
        pipeline: [{ $project: { name: 1, email: 1 } }],
      },
    },

    // Populate modules
    {
      $lookup: {
        from: "modules", // the collection name in MongoDB (case-sensitive)
        localField: "modules",
        foreignField: "_id",
        as: "modules"
      },
    },

    // Format mentor as a single object
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

  return res.status(200).json(
    new ApiResponse(200, "Course fetched successfully", result[0])
  );
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
  getRecommendedCourses,
};
