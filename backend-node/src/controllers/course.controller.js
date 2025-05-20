import {asyncHandler} from "../utils/asyncHandler.js"
import {ApiError} from "../utils/ApiError.js"
import {Course} from "../models/course.model.js"
import {uploadOnCloudinary} from "../utils/cloudinary.js"
import {ApiResponse} from "../utils/ApiResponse.js"

const createCourse = asyncHandler(async (req, res) => {
    try {
        const _id = req.user._id;
        const { title, description, price, domain } = req.body;
        if (!title || !price || !domain) {
            throw new ApiError(400, "Please provide all required fields");
        }
    
        // Upload course image to cloudinary
        const image = req.files?.image[0]?.path || null;
        let imageUrl = null;
        if (image) {
            const response = await uploadOnCloudinary(image);
            if (!response) {
                throw new ApiError(500, "Could not upload course image");
            }
            imageUrl = response.url;
        }
        const course = await Course.create({
            title,
            description,
            price,
            domain,
            image: imageUrl || null,
            mentor: _id
        });
        if(!course) {
            throw new ApiError(500, "Could not create course");
        }
        const createdCourse = await Course.findById(course._id).populate("mentor", "-password -refreshToken");
        return new ApiResponse(201, "Course created successfully", createdCourse);
    } catch (error) {
        throw new ApiError(500, error?.message || "Could not create course");
        
    }

})

const addModulesToCourse = asyncHandler(async (req, res) => {
    try {
        const { courseId, modules } = req.body;
        const userId = req.user._id;
        if (!courseId || !modules) {
            throw new ApiError(400, "Please provide all required fields");
        }
        const course = await Course.findById(courseId);
        if(course.mentor.toString() !== userId.toString()) {
            throw new ApiError(403, "You are not authorized to add modules to this course");
        }
        if (!course) {
            throw new ApiError(404, "Course not found");
        }
        course.modules.push(...modules);
        await course.save();
        return new ApiResponse(200, "Modules added to course successfully", course);
    } catch (error) {
        throw new ApiError(500, error?.message || "Could not add modules to course");
    }
})

const getAllCourses = asyncHandler(async (req, res) => {
    try {
        const courses = await Course.find().populate("mentor", "-password -refreshToken");
        return new ApiResponse(200, "Courses fetched successfully", courses);
    } catch (error) {
        throw new ApiError(500, error?.message || "Could not fetch courses");
    }
})

const getCourseById = asyncHandler(async (req, res) => {
    try {
        const { courseId } = req.params;
        if (!courseId) {
            throw new ApiError(400, "Please provide courseId");
        }
        const course = await Course.aggregate([
            {
                $match : { _id: new mongoose.Types.ObjectId(courseId) },
            },
            {
                $lookup: {
                    from: "users",
                    localField: "mentor",
                    foreignField: "_id",
                    as: "mentor",
                    pipeline: [
                        {
                            $project: {
                                name: 1,
                                email: 1,
                            },
                        },
                    ]
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
                    mentor: { name: "$mentor.name", email: "$mentor.email" },
                },
            },
        ])
        if (!course) {
            throw new ApiError(404, "Course not found");
        }
        return new ApiResponse(200, "Course fetched successfully", course);
    } catch (error) {
        throw new ApiError(500, error?.message || "Could not fetch course");
    }
})

const editCourse = asyncHandler(async (req, res) => {
    try {
        const { courseId } = req.params;
        const { title, description, price, domain } = req.body;
        if (!courseId) {
            throw new ApiError(400, "Please provide courseId");
        }
        if (!title || !description || !price || !domain) {
            throw new ApiError(400, "Please provide all required fields");
        }
        const course = await Course.findById(courseId);
        if (!course) {
            throw new ApiError(404, "Course not found");
        }
        if (course.mentor.toString() !== req.user._id.toString()) {
            throw new ApiError(403, "You are not authorized to edit this course");
        }
        if(title) {
            course.title = title;
        }
        if(description) {
            course.description = description;
        }  
        if(price) {
            course.price = price;
        }
        if(domain) {
            course.domain = domain;
        }
        course.save();
        return new ApiResponse(200, "Course updated successfully", course);
    } catch (error) {
        throw new ApiError(500, error?.message || "Could not update course");   
    }
})


export {
    createCourse,
    addModulesToCourse,
    getAllCourses,
    getCourseById,
    editCourse
}