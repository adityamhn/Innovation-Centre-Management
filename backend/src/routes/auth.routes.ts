import express from "express";
import { checkAdminLoginStatus, checkLoginStatus, logoutUser, userLogin, userRegister } from "../controllers/auth.controller";

const router = express.Router();

router.post("/login", userLogin);

router.post("/register", userRegister);

router.get("/status", checkLoginStatus);

router.get("/admin/status", checkAdminLoginStatus);

router.get("/logout", logoutUser);







export { router as authRoutes };