import express from "express";
import { verifySession } from "../middlewares/auth/VerifySession.middleware";
import { getStartupDetails, registerStartup } from "../controllers/user.controller";

const router = express.Router();

router.post("/register-startup",[verifySession], registerStartup);

router.get("/startup",[verifySession], getStartupDetails);







export { router as userRoutes };