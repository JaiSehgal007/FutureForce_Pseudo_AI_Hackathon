import mongoose from "mongoose";

const attendedCourseSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    course: { type: mongoose.Schema.Types.ObjectId, ref: "Course" },
    completedModules: [{ type: mongoose.Schema.Types.ObjectId, ref: "Module" }],
    }, { timestamps: true });

export const AttendedCourse = mongoose.model("AttendedCourse", attendedCourseSchema);