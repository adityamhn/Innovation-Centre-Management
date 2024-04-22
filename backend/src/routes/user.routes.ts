import express from "express";
import { verifySession } from "../middlewares/auth/VerifySession.middleware";
import {
  getMyWorkspaceRequest,
  getPublicStartups,
  getStartupDetails,
  getUserProfile,
  registerStartup,
  requestWorkspace,
  updateProfile,
  updateStartupProfile,
} from "../controllers/user.controller";

const router = express.Router();

router.post("/register-startup", [verifySession], registerStartup);

router.get("/startup", [verifySession], getStartupDetails);

router.post("/startup/update", [verifySession], updateStartupProfile);

router.get("/startup/public", getPublicStartups);

router.get("/profile", [verifySession], getUserProfile);

router.post("/profile/update", [verifySession], updateProfile);

router.post("/workspace/request", [verifySession], requestWorkspace);

router.get("/workspace/request", [verifySession], getMyWorkspaceRequest);

export { router as userRoutes };
