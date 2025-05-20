import { Router } from "express";
import {registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken,
    changePassword,
    getCurrentUser,
    changeUserDetails,
    addInterestedAreas,
    addExperienceFields,
    getRecommendedCourses
} from "../controllers/user.controller.js";
import axios from "axios";
import {verifyJWT} from "../middlewares/auth.middleware.js"
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();

router.get("/test" , (req , res) => {
    return res.status(200).json({
        message : "Hello World"
    })
})

router.post("/register" , upload.fields([
        {
            name : "profilePicture",
            maxCount : 1
        }
]), registerUser);

router.post("/login" , loginUser);

router.post("/logout" , verifyJWT , logoutUser);

router.patch("/refresh-token" , refreshAccessToken);

router.patch("/change-password" , verifyJWT , changePassword);
router.get("/current-user" , verifyJWT , getCurrentUser);
router.patch("/change-user-details" , verifyJWT , upload.fields([
        {
            name : "profilePicture",
            maxCount : 1
        }
]), changeUserDetails);

router.patch("/add-interested-areas" , verifyJWT , addInterestedAreas);
router.patch("/add-experience-fields" , verifyJWT , addExperienceFields);

router.get("/recommend", verifyJWT, getRecommendedCourses);

export default router;

