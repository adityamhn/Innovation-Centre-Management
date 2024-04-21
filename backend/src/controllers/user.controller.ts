import { Request, Response } from "express";
import {
  addMemberToStartup,
  getStartupMembers,
  getUserFromId,
  getUserPendingWorkspaceRequests,
  getUserStartup,
  registerNewStartup,
  requestForWorkspace,
  updateUserProfile,
} from "../services/user.service";

export const registerStartup = async (req: Request, res: Response) => {
  try {
    let {
      name,
      description,
      pitch_deck_url,
      pitch_video_url,
      logo_url,
      industries,
      members,
    } = req.body;

    const { userId } = res.locals;

    if (
      !name ||
      !description ||
      !pitch_deck_url ||
      !pitch_video_url ||
      !logo_url ||
      !industries
    ) {
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

    const startup = await registerNewStartup({
      name,
      description,
      pitch_deck_url,
      pitch_video_url,
      logo_url,
      industries,
      userId: user.id,
    });

    if (members && members.length > 0) {
      for (const member of members) {
        try {
          await addMemberToStartup({
            startupId: startup.id,
            email: member.email,
            role: member.role,
          });
        } catch (err: any) {
          console.log(err);
          return res.status(500).json({ message: err.message });
        }
      }
    }

    return res.status(200).json({
      message: "Startup registered successfully!",
      code: "STARTUP_REGISTERED",
      startup,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getStartupDetails = async (req: Request, res: Response) => {
  try {
    const { userId } = res.locals;

    const user = await getUserFromId(userId);

    if (!user) {
      return res.status(400).json({
        message: "User does not exist!",
        code: "USER_DOES_NOT_EXIST",
      });
    }

    const startup = await getUserStartup(userId);

    if (!startup) {
      return res.status(400).json({
        message: "Startup does not exist!",
        code: "STARTUP_DOES_NOT_EXIST",
      });
    }

    const members = await getStartupMembers(startup.id);
    startup.members = members;

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

// New
export const getUserProfile = async (req: Request, res: Response) => {
  try {
    const { userId } = res.locals;

    const user = await getUserFromId(userId);

    if (!user) {
      return res.status(400).json({
        message: "User does not exist!",
        code: "USER_DOES_NOT_EXIST",
      });
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

export const updateProfile = async (req: Request, res: Response) => {
  try {
    const { userId } = res.locals;

    const user = await getUserFromId(userId);

    if (!user) {
      return res.status(400).json({
        message: "User does not exist!",
        code: "USER_DOES_NOT_EXIST",
      });
    }

    let { contact, date_of_birth, name } = req.body;

    if (!name || !contact || !date_of_birth) {
      return res.status(400).json({
        message: "Invalid request! Please try again.",
        code: "INVALID_REQUEST",
      });
    }

    const updatedUser = await updateUserProfile({
      name,
      contact,
      date_of_birth,
      userId,
    });

    return res.status(200).json({
      message: "User profile updated successfully!",
      code: "USER_PROFILE_UPDATED",
      user: updatedUser,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

// Workspace requests
export const requestWorkspace = async (req: Request, res: Response) => {
  try {
    const { userId } = res.locals;
    const user = await getUserFromId(userId);
    if (!user) {
      return res.status(400).json({
        message: "User does not exist!",
        code: "USER_DOES_NOT_EXIST",
      });
    }

    const { workspaceType, reason, membersCount, from, to } = req.body;

    if (!workspaceType || !reason || !membersCount || !from || !to) {
      return res.status(400).json({
        message: "Invalid request! Please try again.",
        code: "INVALID_REQUEST",
      });
    }

    const workspaceRequest = await requestForWorkspace({
      workspaceType,
      reason,
      userId,
      membersCount,
      from,
      to,
    });

    return res.status(200).json({
      message: "Workspace request added successfully!",
      code: "WORKSPACE_REQUEST_ADDED",
      workspaceRequest,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getMyWorkspaceRequest = async (req: Request, res: Response) => {
  try {
    const { userId } = res.locals;
    const user = await getUserFromId(userId);
    if (!user) {
      return res.status(400).json({
        message: "User does not exist!",
        code: "USER_DOES_NOT_EXIST",
      });
    }

    const workspaceRequest = await getUserPendingWorkspaceRequests(userId);

    return res.status(200).json({
      message: "Workspace requests fetched successfully!",
      code: "WORKSPACE_REQUESTS_FETCHED",
      request: workspaceRequest,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}
