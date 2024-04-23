import { Request, Response } from "express";
import {
  addMemberToStartup,
  deleteAllMembersFromStartup,
  getAllInfo,
  getAllPublicStartups,
  getMyAllocatedWorkspace,
  getStartupMembers,
  getUserFromEmail,
  getUserFromId,
  getUserPendingWorkspaceRequests,
  getUserStartup,
  registerNewStartup,
  requestForWorkspace,
  requestMentorship,
  updateStartup,
  updateUserProfile,
} from "../services/user.service";
import { getStartupFromId } from "../services/admin.service";

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

export const updateStartupProfile = async (req: Request, res: Response) => {
  try {
    const { userId } = res.locals;

    const user = await getUserFromId(userId);

    if (!user) {
      return res.status(400).json({
        message: "User does not exist!",
        code: "USER_DOES_NOT_EXIST",
      });
    }

    const startupId = req.body.startup_id;

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

    let {
      name,
      description,
      pitch_deck_url,
      pitch_video_url,
      logo_url,
      industries,
      members,
    } = req.body;

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

    const updatedStartup = await updateStartup({
      name,
      description,
      pitch_deck_url,
      pitch_video_url,
      logo_url,
      industries,
      startupId: startup.id,
    });

    // check if members exist
    if (members && members.length > 0) {
      for (const member of members) {
        const user = await getUserFromEmail(member.email);
        if (!user) {
          return res.status(400).json({
            message: `Member ${member.email} does not exist!`,
            code: "MEMBER_DOES_NOT_EXIST",
          });
        }
      }
    }

    // delete all members
    await deleteAllMembersFromStartup(startup.id);

    // add new members
    for (const member of members) {
      await addMemberToStartup({
        startupId: startup.id,
        email: member.email,
        role: member.role,
      });
    }

    return res.status(200).json({
      message: "Startup profile updated successfully!",
      code: "STARTUP_PROFILE_UPDATED",
      startup: updatedStartup,
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
};

// Startups
export const getPublicStartups = async (req: Request, res: Response) => {
  try {
    const startups = await getAllPublicStartups();

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


export const getAllocatedWorkspace = async (req: Request, res: Response) => {
  try {
    const { userId } = res.locals;

    const user = await getUserFromId(userId);

    if (!user) {
      return res.status(400).json({
        message: "User does not exist!",
        code: "USER_DOES_NOT_EXIST",
      });
    }

    const workspace = await getMyAllocatedWorkspace(userId);

    if (!workspace) {
      return res.status(400).json({
        message: "Workspace does not exist!",
        code: "WORKSPACE_DOES_NOT_EXIST",
      });
    }

    return res.status(200).json({
      message: "Workspace fetched successfully!",
      code: "WORKSPACE_FETCHED",
      workspace,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}

export const requestForMentorship = async (req: Request, res: Response) => {
  try {
    const { userId } = res.locals;
    const user = await getUserFromId(userId);
    if (!user) {
      return res.status(400).json({
        message: "User does not exist!",
        code: "USER_DOES_NOT_EXIST",
      });
    }

    const { area_of_interest, available_days, request_details } = req.body;

    if (!area_of_interest || !available_days || !request_details) {
      return res.status(400).json({
        message: "Invalid request! Please try again.",
        code: "INVALID_REQUEST",
      });
    }

    const mentorshipRequest = await requestMentorship({
      area_of_interest,
      available_days,
      request_details,
      userId,
    });

    return res.status(200).json({
      message: "Mentorship request added successfully!",
      code: "MENTORSHIP_REQUEST_ADDED",
      mentorshipRequest,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}
// Dashboard

export const getUserDashboard = async (req: Request, res: Response) => {

  try {
    const { userId } = res.locals;

    const user = getUserFromId(userId);

    if (!user) {
      return res.status(400).json({
        message: "User does not exist!",
        code: "USER_DOES_NOT_EXIST",
      });
    }

    const dashboard = await getAllInfo();

    console.log(dashboard);

    return res.status(200).json({
      message: "User dashboard fetched successfully!",
      code: "DASHBOARD_FETCHED",
      dashboard,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}