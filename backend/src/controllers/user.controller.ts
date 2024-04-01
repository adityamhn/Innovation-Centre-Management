import { Request, Response } from "express";
import {
  getUserFromId,
  getUserStartup,
  registerNewStartup,
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
