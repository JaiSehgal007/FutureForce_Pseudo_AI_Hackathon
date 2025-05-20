import {asyncHandler} from "../utils/asyncHandler.js"
import {ApiError} from "../utils/ApiError.js"
import {Module} from "../models/module.model.js"
import {uploadOnCloudinary} from "../utils/cloudinary.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {Course} from "../models/course.model.js"
import {User} from "../models/user.model.js"
import { AttendedCourse } from "../models/attendedCourse.model.js";
import mongoose from "mongoose";
const createModule = asyncHandler(async (req, res) => {
    try {
        const { title, description, courseId } = req.body;
        const userId = req.user._id;
        if (!title || !description || !courseId) {
            throw new ApiError(400, "Please provide all required fields");
        }
        const course = await Course.findById(courseId);
        if (!course) {
            throw new ApiError(404, "Course not found");
        }
        if (course.mentor.toString() !== userId.toString()) {
            throw new ApiError(403, "You are not authorized to create modules for this course");
        }
        const image = req.files?.image[0]?.path || null;
        let imageUrl = null;
        if (image) {
            const response = await uploadOnCloudinary(image);
            if (!response) {
                throw new ApiError(500, "Could not upload module image");
            }
            imageUrl = response.url;
        }
        const module = await Module.create({
            title,
            description,
            image: imageUrl || null,
        });
        course.modules.push(module._id);
        await course.save();
        if (!module) {
            throw new ApiError(500, "Could not create module");
        }
        return res.status(201).json(new ApiResponse(201, "Module created successfully", module));
    } catch (error) {
        throw new ApiError(500, error?.message || "Could not create module");
    }
})

const getModules = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { courseId } = req.body;

  if (!courseId) {
    throw new ApiError(400, "Please provide courseId");
  }

  if (!mongoose.Types.ObjectId.isValid(courseId)) {
    throw new ApiError(400, "Invalid courseId");
  }

  // Fetch the course and populate its modules
  const course = await Course.findById(courseId).populate("modules");
  if (!course) {
    throw new ApiError(404, "Course not found");
  }

  // Fetch the attendedCourse to check completed modules
  const attended = await AttendedCourse.findOne({ user: userId, course: courseId });
  const completedModuleIds = attended ? attended.completedModules.map(id => id.toString()) : [];

  // Add "completed" flag to each module
  const modulesWithCompletion = course.modules.map((module) => ({
    ...module.toObject(),
    completed: completedModuleIds.includes(module._id.toString()),
  }));

  return res
    .status(200)
    .json(new ApiResponse(200, "Modules fetched successfully", modulesWithCompletion));
});


const deleteModule = asyncHandler(async (req, res) => {
    try {
        const { moduleId } = req.body;
        const userId = req.user._id;
        if (!moduleId) {
            throw new ApiError(400, "Please provide moduleId");
        }
        const module = await Module.findById(moduleId);
        if (!module) {
            throw new ApiError(404, "Module not found");
        }
        const course = await Course.findOne({ modules: moduleId });
        if (course.mentor.toString() !== userId.toString()) {
            throw new ApiError(403, "You are not authorized to delete this module");
        }
        await Module.findByIdAndDelete(moduleId);
        course.modules = course.modules.filter((mod) => mod.toString() !== moduleId);
        await course.save();
        return res.status(200).json(new ApiResponse(200, "Module deleted successfully", null));
    } catch (error) {
        throw new ApiError(500, error?.message || "Could not delete module");
    }
})

const updateModule = asyncHandler(async (req, res) => {
    try {
        const { moduleId, title, description } = req.body;
        const userId = req.user._id;
        if (!moduleId || !title || !description) {
            throw new ApiError(400, "Please provide all required fields");
        }
        const module = await Module.findById(moduleId);
        if (!module) {
            throw new ApiError(404, "Module not found");
        }
        const course = await Course.findOne({ modules: moduleId });
        if (course.mentor.toString() !== userId.toString()) {
            throw new ApiError(403, "You are not authorized to update this module");
        }
        const image = req.files?.image[0]?.path || null;
        let imageUrl = null;
        if (image) {
            const response = await uploadOnCloudinary(image);
            if (!response) {
                throw new ApiError(500, "Could not upload module image");
            }
            imageUrl = response.url;
        }
        if(title)
        module.title = title;
        if(description)
        module.description = description;
        if(imageUrl)
        module.image = imageUrl || module.image;

        await module.save();
        return res.status(200).json(new ApiResponse(200, "Module updated successfully", module));
    } catch (error) {
        throw new ApiError(500, error?.message || "Could not update module");
    }
})

const getModuleById = asyncHandler(async (req, res) => {
    try {
        const { moduleId } = req.params;
        if (!moduleId) {
            throw new ApiError(400, "Please provide moduleId");
        }
        const module = await Module.findById(moduleId);
        if (!module) {
            throw new ApiError(404, "Module not found");
        }
        return res.status(200).json(new ApiResponse(200, "Module fetched successfully", module));
    } catch (error) {
        throw new ApiError(500, error?.message || "Could not fetch module");
    }
})

const toggleCompletedModule = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { courseId, moduleId } = req.body;

  if (!mongoose.Types.ObjectId.isValid(courseId) || !mongoose.Types.ObjectId.isValid(moduleId)) {
    throw new ApiError(400, "Invalid courseId or moduleId");
  }

  const attendedCourse = await AttendedCourse.findOne({
    user: userId,
    course: courseId,
  });

  if (!attendedCourse) {
    throw new ApiError(404, "User is not enrolled in this course");
  }

  const moduleIndex = attendedCourse.completedModules.findIndex(
    (modId) => modId.toString() === moduleId
  );

  if (moduleIndex !== -1) {
    // Already marked completed → unmark
    attendedCourse.completedModules.splice(moduleIndex, 1);
  } else {
    // Not marked → mark as completed
    attendedCourse.completedModules.push(new mongoose.Types.ObjectId(moduleId));
  }

  await attendedCourse.save();

  return res.status(200).json(
    new ApiResponse(
      200,
      attendedCourse.completedModules,
      "Module completion status toggled successfully"
    )
  );
});


export {
    createModule,
    getModules,
    deleteModule,
    updateModule,
    toggleCompletedModule,
    getModuleById
}