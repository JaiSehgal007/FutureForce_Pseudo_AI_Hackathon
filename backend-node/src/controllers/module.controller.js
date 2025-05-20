import {asyncHandler} from "../utils/asyncHandler.js"
import {ApiError} from "../utils/ApiError.js"
import {Module} from "../models/module.model.js"
import {uploadOnCloudinary} from "../utils/cloudinary.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {Course} from "../models/course.model.js"

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
        return new ApiResponse(201, "Module created successfully", module);
    } catch (error) {
        throw new ApiError(500, error?.message || "Could not create module");
    }
})

const getModules = asyncHandler(async (req, res) => {
    try {
        const { courseId } = req.body;
        if (!courseId) {
            throw new ApiError(400, "Please provide courseId");
        }
        const course = await Course.findById(courseId).populate("modules");
        if (!course) {
            throw new ApiError(404, "Course not found");
        }
        return new ApiResponse(200, "Modules fetched successfully", course.modules);
    } catch (error) {
        throw new ApiError(500, error?.message || "Could not fetch modules");
    }
})

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
        return new ApiResponse(200, "Module deleted successfully", null);
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
        return new ApiResponse(200, "Module updated successfully", module);
    } catch (error) {
        throw new ApiError(500, error?.message || "Could not update module");
    }
})