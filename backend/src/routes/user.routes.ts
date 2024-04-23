import express from "express";
import { verifySession } from "../middlewares/auth/VerifySession.middleware";
import {
  getAllocatedWorkspace,
  getMyWorkspaceRequest,
  getPublicStartups,
  getStartupDetails,
  getUserDashboard,
  getUserProfile,
  registerStartup,
  requestForMentorship,
  requestWorkspace,
  updateProfile,
  updateStartupProfile,
} from "../controllers/user.controller";

const router = express.Router();


router.get("/dashboard", [verifySession], getUserDashboard);

router.post("/register-startup", [verifySession], registerStartup);

router.get("/startup", [verifySession], getStartupDetails);

router.post("/startup/update", [verifySession], updateStartupProfile);

router.get("/startup/public", getPublicStartups);

router.get("/profile", [verifySession], getUserProfile);

router.post("/profile/update", [verifySession], updateProfile);

router.post("/workspace/request", [verifySession], requestWorkspace);

router.get("/workspace/request", [verifySession], getMyWorkspaceRequest);

router.get("/my-workspace", [verifySession], getAllocatedWorkspace);

router.post("/mentorship/request", [verifySession], requestForMentorship);

export { router as userRoutes };
