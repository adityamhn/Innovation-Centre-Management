import express from "express";
import {
  addInformation,
  addNewWorkspace,
  adminLogin,
  changeWorkspaceRequestStatus,
  getAllAllocations,
  getStartupData,
  getStartups,
  getStats,
  getUserData,
  getUsers,
  getWorkspaceRequests,
  getWorkspaces,
  removeAllocation,
  updateStatus,
  updateWorkspaceDetails,
  workspaceAllocation,
} from "../controllers/admin.controller";
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
router.post("/workspace/add", [verifyAdminSession], addNewWorkspace);

router.post("/workspace/update", [verifyAdminSession], updateWorkspaceDetails);

router.get("/workspace", [verifyAdminSession], getWorkspaces);

// Workspace requests
router.get("/workspace/requests", [verifyAdminSession], getWorkspaceRequests);

router.post(
  "/workspace/requests/:requestId/update",
  [verifyAdminSession],
  changeWorkspaceRequestStatus
);

// Workspace Allocation
router.post("/workspace/allocate", [verifyAdminSession], workspaceAllocation);

router.get("/workspace/allocations", [verifyAdminSession], getAllAllocations);

router.post(
  "/workspace/allocations/:allocationId/delete",
  [verifyAdminSession],
  removeAllocation
);

// information
router.post("/info/add", [verifyAdminSession], addInformation);

// Stats
router.get("/stats", [verifyAdminSession], getStats);

export { router as adminRoutes };
