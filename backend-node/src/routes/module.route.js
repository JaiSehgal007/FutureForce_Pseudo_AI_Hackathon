    import mongoose from "mongoose";
    import express from "express";
    import {
        createModule,
        getModules,
        deleteModule,
        updateModule,
        toggleCompletedModule,
        getModuleById
    } from "../controllers/module.controller.js";
    import { verifyJWT } from "../middlewares/auth.middleware.js";
    import {upload} from "../middlewares/multer.middleware.js";
    const router = express.Router();

    // Route to create a new module
    router.post("/", verifyJWT ,upload.fields([
            {
                name : "image",
                maxCount : 1
            }
    ]) , createModule);
    // Route to get all modules
    router.get("/", verifyJWT,getModules);
    // Route to get a module by ID
    router.get("/:id",verifyJWT, getModuleById);
    // Route to update a module by ID
    router.put("/:id", updateModule);
    // Route to delete a module by ID
    router.delete("/:id", verifyJWT, deleteModule);
    // Route to toggle the completion status of a module
    router.post("/toggle-completion", verifyJWT, toggleCompletedModule);

    export default router;