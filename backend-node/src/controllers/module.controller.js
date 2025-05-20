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
