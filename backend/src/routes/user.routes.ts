import express from "express";
import { verifySession } from "../middlewares/auth/VerifySession.middleware";
import { getMyWorkspaceRequest, getStartupDetails, getUserProfile, registerStartup, requestWorkspace, updateProfile } from "../controllers/user.controller";

const router = express.Router();

router.post("/register-startup",[verifySession], registerStartup);

router.get("/startup",[verifySession], getStartupDetails);

router.get("/profile",[verifySession], getUserProfile);

router.post("/profile/update",[verifySession], updateProfile);

router.post("/workspace/request",[verifySession], requestWorkspace);

router.get("/workspace/request",[verifySession], getMyWorkspaceRequest);









export { router as userRoutes };