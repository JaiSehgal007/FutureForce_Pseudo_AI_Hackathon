import {asyncHandler} from "../utils/asyncHandler.js"
import {ApiError} from "../utils/ApiError.js"
import {User} from "../models/user.model.js"
import {uploadOnCloudinary} from "../utils/cloudinary.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import jwt from "jsonwebtoken"

const generateAccessAndRefreshToken = async (userId) => {
    try {
        const user = await User.findById(userId);
        const accessToken = await user.generateAccessToken();
        const refreshToken = await user.generateRefreshToken();
        
        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave : false })

        return {accessToken , refreshToken}
    } catch (error) {
        throw new ApiError(500 , "Could not generate access or refresh token")
    }
}

const registerUser = asyncHandler(async (req , res) => {
    try {
        const {name , age , gender , educationLevel , email, contact , userType , password} = req.body;
    
        if(!name || !email || !userType || !password){
            throw new ApiError(400 , "Please provide all required fields")
        }
        const existingUser = await User.findOne({email});
        if(existingUser){
            throw new ApiError(400 , "User already exists with this email")
        }

        // Upload profile picture to cloudinary
        const profilePicture = req.files?.profilePicture[0]?.path || null;
        let profilePictureUrl = null;
        if(profilePicture){
            const response = await uploadOnCloudinary(profilePicture);
            if(!response){
                throw new ApiError(500 , "Could not upload profile picture")
            }
            profilePictureUrl = response.url;
        }

        const user = await User.create({
            name,
            age,
            gender,
            educationLevel,
            email,
            userType,
            contact,
            profilePicture: profilePictureUrl,
            password
        });
        const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
        )
        if(!createdUser) {
            throw new ApiError(500 , "Internal Server Error :: Could not register user")
        }
        
        return res.status(201).json(
            new ApiResponse(201 , createdUser , "User registered Successfully")
        )

    } catch (error) {
        throw new ApiError(500 , error?.message || "Could not register user")
    }
})

const loginUser = asyncHandler(async (req, res) =>{

    const {email, password, userType} = req.body
    // console.log(username);

    if (!email && !password && !userType) {
        throw new ApiError(400, "email,password,userType is required")
    }

    const user = await User.findOne({email,userType})

    if (!user) {
        throw new ApiError(404, "User does not exist")
    }

   const isPasswordValid = await user.isPasswordCorrect(password)

   if (!isPasswordValid) {
    throw new ApiError(401, "Invalid user credentials")
    }

   const {accessToken, refreshToken} = await generateAccessAndRefreshToken(user._id)

    const loggedInUser = await User.findById(user._id).select("-password")
    // console.log(refreshToken);
    
    const options = {
        httpOnly: true,
        secure: true
    }
    // console.log(refreshToken);
    
    return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
        new ApiResponse(
            200, 
            {
                user: loggedInUser, accessToken
            },
            "User logged In Successfully"
        )
    )

})


const logoutUser = asyncHandler( async (req, res) => {
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $set : {
                refreshToken : undefined 
            }
        },
        {
            new : true
        }
    )
    const options = {
        httpOnly : true, 
        secure : true
    };

    return res
    .clearCookie("accessToken" , options)
    .clearCookie("refreshToken" , options)
    .json(new ApiResponse(200 , {} , "User logged Out successfully"))
})

const refreshAccessToken = asyncHandler(async (req , res) => {
    // console.log("hello");
    
    try {
        // console.log(req.cookies)
        const refreshToken = req.cookies?.refreshToken || req.body?.refreshToken;
        if (!refreshToken || typeof refreshToken !== 'string') {
            throw new ApiError(401, "Unauthorized request - Refresh token missing or invalid");
        }
        // console.log(refreshToken);
        
        const decodedToken = jwt.verify(refreshToken , process.env.REFRESH_TOKEN_SECRET)
        if(!decodedToken){
            throw new ApiError(401 , "Invalid Refresh Token")
        }
        const user = await User.findById(decodedToken._id)
        if(refreshToken !== user.refreshToken) {
            throw new ApiError(401 , "Refresh Token has expired or already used")
        }
        const {newRefreshToken , accessToken} = await generateAccessAndRefreshToken(user._id);
    
        return res
        .status(200)
        .cookie("accessToken" , accessToken)
        .cookie("refreshToken" , newRefreshToken)
        .json(
            new ApiResponse(
                200 , 
                {accessToken , refreshToken : newRefreshToken},
                "Access Token Refreshed"
            )
        )
    } catch (error) {
        throw new ApiError(201 , error?.message || "Something went wrong")
    }
})

const changePassword = asyncHandler ( async (req , res) => {
    const {oldPassword , newPassword} = req.body
    console.log(oldPassword , newPassword);
    
    const user = await User.findById(req.user?._id);
    if(!user){
        throw new ApiError(401 , "Unauthorized Request");
    }
    
    const isPasswordCorrect = await user.isPasswordCorrect(oldPassword);
    if(!isPasswordCorrect){
        throw new ApiError(401 , "Password is incorrect");
    }

    user.password = newPassword;
    await user.save({validateBeforeSave : false})

    return res
    .status(200)
    .json(
        new ApiResponse(200 , {} , "Password changed successfully")
    )
})
const getCurrentUser = asyncHandler( async (req,res) => {
    return res.status(200).json(
        new ApiResponse(200 , {user : req.user} , "User details fetched successfully")
    )
})

const changeUserDetails = asyncHandler ( async (req , res) => {
    const {fullname , email} = req.body;
    if(!(fullname || email)){
        throw new ApiError(400 , "Nothing to change")
    }
    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set : {
                fullname , 
                email
            }
        },
        {new : true}
    ).select("-password");
    return res
    .status(200)
    .json(
        new ApiResponse(200 , {} , "User details updated Successfully")
    )
})

// Add interested areas to a user's profile
const addInterestedAreas = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { areas } = req.body; // expected: ["AI", "ML", "Web Dev"]

  if (!Array.isArray(areas) || areas.length === 0) {
    throw new ApiError(400, "Please provide an array of interested areas.");
  }

  const user = await User.findByIdAndUpdate(
    userId,
    { $addToSet: { interestedAreas: { $each: areas } } }, // prevents duplicates
    { new: true }
  ).select("-password -refreshToken");

  res.status(200).json(new ApiResponse(200, user, "Interested areas updated"));
});

// Add experience fields to a user's profile
const addExperienceFields = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { experiences } = req.body; // expected: ["AI", "ML", "Web Dev"]

  if (!Array.isArray(experiences) || experiences.length === 0) {
    throw new ApiError(400, "Please provide an array of interested areas.");
  }

  const user = await User.findByIdAndUpdate(
    userId,
    { $addToSet: { experienceFields : { $each: experiences } } }, // prevents duplicates
    { new: true }
  ).select("-password -refreshToken");

  res.status(200).json(new ApiResponse(200, user, "Interested areas updated"));
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
}

