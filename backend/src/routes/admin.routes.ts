import express from "express";
import { addNewWorkspace, adminLogin, getStartupData, getStartups, getUserData, getUsers, getWorkspaceRequests, getWorkspaces, updateStatus, updateWorkspaceDetails } from "../controllers/admin.controller";
import { verifyAdminSession } from "../middlewares/auth/VerifySession.middleware";

const router = express.Router();

router.post("/login", adminLogin);

// users
router.get("/users", [verifyAdminSession], getUsers);

router.get("/users/:userId", [verifyAdminSession], getUserData);

// startups
router.get("/startups", [verifyAdminSession], getStartups);

router.get("/startups/:startupId", [verifyAdminSession], getStartupData);

router.post("/startups/:startupId/update", [verifyAdminSession], updateStatus);

// Workspace
router.post("/workspace/add", [verifyAdminSession], addNewWorkspace)

router.post("/workspace/update", [verifyAdminSession], updateWorkspaceDetails)

router.get("/workspace", [verifyAdminSession], getWorkspaces)

// Workspace requests
router.get("/workspace/requests", [verifyAdminSession], getWorkspaceRequests)


export { router as adminRoutes };