import { Request, Response } from "express";
import sanitizeHtml from "sanitize-html";
import { emailRegex } from "../utils/constants";
import {
  MatchPassword,
  getUserFromEmail,
  getUserFromId,
  getUserStartup,
} from "../services/user.service";
import {
  allocateWorkspace,
  createNewWorkspace,
  deleteAllocation,
  getAllStartups,
  getAllUsers,
  getAllWorkspaceRequests,
  getAllWorkspaces,
  getStartupFromId,
  getUserStartupMember,
  getWorkspaceAllocations,
  getWorkspaceFromId,
  updateStartupPublic,
  updateStartupStatus,
  updateWorkspace,
  updateWorkspaceRequestStatus,
} from "../services/admin.service";

export const adminLogin = async (req: Request, res: Response) => {
  try {
    let { email, password } = req.body;

    email = sanitizeHtml(email, {
      allowedTags: [],
      allowedAttributes: {},
    });

    email = email.toLowerCase();

    if (!email || !password) {
      return res.status(400).json({
        message: "Invalid request! Please try again.",
        code: "INVALID_REQUEST",
      });
    }

    if (!emailRegex.test(email)) {
      return res.status(400).json({
        message: "Invalid email address! Please try again.",
        code: "INVALID_EMAIL",
      });
    }

    const user = await getUserFromEmail(email);

    if (!user) {
      return res.status(400).json({
        message: "User does not exist!",
        code: "USER_DOES_NOT_EXIST",
      });
    }

    const passwordIsValid = await MatchPassword(password, user.password, true);

    if (!passwordIsValid) {
      return res.status(400).json({
        message: "Invalid Account Credentials!",
      });
    }

    if (!user.is_admin) {
      return res.status(404).json({
        message: "You are not authorized to access this page!",
        code: "UNAUTHORIZED",
      });
    }

    // create a session
    req.session.user = {
      userId: user.id.toString(),
    };

    const DEPLOYMENT = process.env.DEPLOYMENT;

    req.session.environment = `ic-${DEPLOYMENT}`;

    req.session.save(function (err) {
      if (err) {
        console.log(err);
        return res.status(400).json({ message: "ERROR_IN_SESSION" });
      }
    });

    return res.status(200).json({
      message: "Admin logged in successfully!",
      code: "ADMIN_LOGGED_IN",
      user: {
        id: user.id,
        email: user.email,
        is_admin: user.is_admin,
        name: user.name,
      },
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

// Startup

export const getStartups = async (req: Request, res: Response) => {
  try {
    const startups = await getAllStartups();

    return res.status(200).json({
      message: "Startups fetched successfully!",
      code: "STARTUPS_FETCHED",
      startups,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getStartupData = async (req: Request, res: Response) => {
  try {
    const { startupId } = req.params;

    if (!startupId) {
      return res.status(400).json({
        message: "Invalid request! Please try again.",
        code: "INVALID_REQUEST",
      });
    }

    const startup = await getStartupFromId(startupId);

    if (!startup) {
      return res.status(400).json({
        message: "Startup does not exist!",
        code: "STARTUP_DOES_NOT_EXIST",
      });
    }

    return res.status(200).json({
      message: "Startup details fetched successfully!",
      code: "STARTUP_FETCHED",
      startup,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const updateStatus = async (req: Request, res: Response) => {
  try {
    const { startupId } = req.params;
    const { status, public_profile } = req.body;

    if (!startupId || !status) {
      return res.status(400).json({
        message: "Invalid request! Please try again.",
        code: "INVALID_REQUEST",
      });
    }

    const startup = await getStartupFromId(startupId);

    if (!startup) {
      return res.status(400).json({
        message: "Startup does not exist!",
        code: "STARTUP_DOES_NOT_EXIST",
      });
    }

    let updatedStartup = await updateStartupStatus(startupId, status);
    updatedStartup = await updateStartupPublic(startupId, public_profile);

    return res.status(200).json({
      message: "Startup status updated successfully!",
      code: "STARTUP_STATUS_UPDATED",
      startup: updatedStartup,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

// User
export const getUsers = async (req: Request, res: Response) => {
  try {
    const users = await getAllUsers();

    return res.status(200).json({
      message: "Users fetched successfully!",
      code: "USERS_FETCHED",
      users,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getUserData = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({
        message: "Invalid request! Please try again.",
        code: "INVALID_REQUEST",
      });
    }

    const user = await getUserFromId(userId);

    if (!user) {
      return res.status(400).json({
        message: "User does not exist!",
        code: "USER_DOES_NOT_EXIST",
      });
    }

    const userStartup = await getUserStartup(userId);

    if (userStartup) {
      user.startup = {
        ...userStartup,
        type: "admin",
      };
    }

    const userMembership = await getUserStartupMember(userId);

    if (userMembership) {
      user.startup = {
        ...userMembership,
        type: "member",
      };
    }

    return res.status(200).json({
      message: "User details fetched successfully!",
      code: "USER_FETCHED",
      user,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

// Workspace
export const addNewWorkspace = async (req: Request, res: Response) => {
  try {
    const { name, location, description, size, amenities, available } =
      req.body;

    if (!name || !location || !description || !size || !amenities) {
      return res.status(400).json({
        message: "Invalid request! Please try again.",
        code: "INVALID_REQUEST",
      });
    }

    const workspace = await createNewWorkspace({
      name,
      location,
      description,
      size,
      amenities,
      available,
    });

    return res.status(200).json({
      message: "Workspace added successfully!",
      code: "WORKSPACE_ADDED",
      workspace,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const updateWorkspaceDetails = async (req: Request, res: Response) => {
  try {
    const {
      name,
      location,
      description,
      size,
      amenities,
      available,
      workspaceId,
    } = req.body;

    if (
      !name ||
      !location ||
      !description ||
      !size ||
      !amenities ||
      !workspaceId
    ) {
      return res.status(400).json({
        message: "Invalid request! Please try again.",
        code: "INVALID_REQUEST",
      });
    }

    const workspace = await updateWorkspace({
      name,
      location,
      description,
      size,
      amenities,
      available,
      workspaceId,
    });

    if (!workspace) {
      return res.status(400).json({
        message: "Workspace does not exist!",
        code: "WORKSPACE_DOES_NOT_EXIST",
      });
    }

    return res.status(200).json({
      message: "Workspace updated successfully!",
      code: "WORKSPACE_UPDATED",
      workspace,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getWorkspaces = async (req: Request, res: Response) => {
  try {
    const workspaces = await getAllWorkspaces();

    return res.status(200).json({
      message: "Workspaces fetched successfully!",
      code: "WORKSPACES_FETCHED",
      workspaces,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

// Workspace requests

export const getWorkspaceRequests = async (req: Request, res: Response) => {
  try {
    const workspaceRequests = await getAllWorkspaceRequests();

    return res.status(200).json({
      message: "Workspace requests fetched successfully!",
      code: "WORKSPACE_REQUESTS_FETCHED",
      requests: workspaceRequests,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const changeWorkspaceRequestStatus = async (
  req: Request,
  res: Response
) => {
  try {
    const { requestId } = req.params;
    const { status } = req.body;

    if (!requestId || !status) {
      return res.status(400).json({
        message: "Invalid request! Please try again.",
        code: "INVALID_REQUEST",
      });
    }

    const workspaceRequest = await updateWorkspaceRequestStatus(
      requestId,
      status
    );

    return res.status(200).json({
      message: "Workspace request status updated successfully!",
      code: "WORKSPACE_REQUEST_STATUS_UPDATED",
      request: workspaceRequest,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

// Workspace allocations
export const workspaceAllocation = async (req: Request, res: Response) => {
  try {
    const { workspace_id, startupId, users, start_date, end_date } = req.body;

    if (!workspace_id) {
      return res.status(400).json({
        message: "Invalid request! Please try again.",
        code: "INVALID_REQUEST",
      });
    }
    const workspace = await getWorkspaceFromId(workspace_id);

    if (!workspace) {
      return res.status(400).json({
        message: "Workspace does not exist!",
        code: "WORKSPACE_DOES_NOT_EXIST",
      });
    }

    for (const userId of users) {
      const user = await getUserFromId(userId);

      if (!user) {
        return res.status(400).json({
          message: "User does not exist!",
          code: "USER_DOES_NOT_EXIST",
        });
      }

      await allocateWorkspace({
        workspaceId: workspace_id,
        userId,
        startupId: startupId || null,
        startDate: start_date,
        endDate: end_date,
      });
    }

    return res.status(200).json({
      message: "Workspace allocated successfully!",
      code: "WORKSPACE_ALLOCATED",
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getAllAllocations = async (req: Request, res: Response) => {
  try {
    const allocations = await getWorkspaceAllocations();

    return res.status(200).json({
      message: "Workspace allocations fetched successfully!",
      code: "WORKSPACE_ALLOCATIONS_FETCHED",
      allocations,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const removeAllocation = async (req: Request, res: Response) => {
  try {
    const { allocationId } = req.params;

    if (!allocationId) {
      return res.status(400).json({
        message: "Invalid request! Please try again.",
        code: "INVALID_REQUEST",
      });
    }

    const allocation = await deleteAllocation(allocationId);

    return res.status(200).json({
      message: "Allocation deleted successfully!",
      code: "ALLOCATION_DELETED",
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
