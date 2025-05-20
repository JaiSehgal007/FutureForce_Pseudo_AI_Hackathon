import { Router } from "express";
import {
    createCourse,
    addModulesToCourse,
    getAllCourses,
    getCourseById,
    editCourse,
    deleteCourse,
    enrollInCourse,
    unenrollFromCourse,
    getEnrolledCourses
} from "../controllers/course.controller.js";

import {verifyJWT} from "../middlewares/auth.middleware.js"
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();   

router.get("/test" , (req , res) => {
    return res.status(200).json({
        message : "Hello World"
    })
}) 

router.post("/create" , verifyJWT , upload.fields([
        {
            name : "image",
            maxCount : 1
        }
]), createCourse);
router.post("/add-modules/:courseId" , verifyJWT , upload.fields([
    {
        name : "image",
        maxCount : 1
    }
]) , addModulesToCourse);
router.get("/all" , getAllCourses);
router.get("/:courseId" , getCourseById);
router.patch("/update/:courseId" , verifyJWT , upload.fields([
    {
        name : "image",
        maxCount : 1
    }
]) , editCourse);
router.delete("/delete/:courseId" , verifyJWT , deleteCourse);
router.post("/enroll/:courseId" , verifyJWT , enrollInCourse);
router.delete("/unenroll/:courseId" , verifyJWT , unenrollFromCourse);
router.post("/my-courses" , 
    verifyJWT , 
    getEnrolledCourses);

export default router;