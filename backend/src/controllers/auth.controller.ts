import { Request, Response } from "express";
import {
  MatchPassword,
  createNewUser,
  getUserFromEmail,
  getUserFromId,
} from "../services/user.service";
import sanitizeHtml from "sanitize-html";
import { emailRegex } from "../utils/constants";

export const userRegister = async (req: Request, res: Response) => {
  try {
    let { name, email, password, is_mahe, regno } = req.body;

    email = sanitizeHtml(email, {
      allowedTags: [],
      allowedAttributes: {},
    });

    email = email.toLowerCase();

    if (!email || !password || !name || (is_mahe && !regno)) {
      return res.status(400).json({
        message: "Invalid payload! Please try again.",
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

    if (user) {
      return res.status(400).json({
        message: "User already exists!",
        code: "USER_ALREADY_EXISTS",
      });
    }

    const newUser = await createNewUser({
      name,
      email,
      password,
      is_mahe,
      reg_no: regno,
    });

    if (!newUser) {
      return res
        .status(500)
        .json({ message: "Error creating user! Try again later." });
    }

    return res.status(200).json({
      message: "User created successfully!",
      code: "USER_CREATED",
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const userLogin = async (req: Request, res: Response) => {
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

    const passwordIsValid = await MatchPassword(password, user.password, false);

    if (!passwordIsValid) {
      return res.status(400).json({
        message: "Invalid Account Credentials!",
      });
    }

    if (user.is_admin) {
      return res.status(400).json({
        message: "User does not exist!",
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
      message: "User logged in successfully!",
      code: "USER_LOGGED_IN",
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        is_admin: user.is_admin,
      },
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const checkLoginStatus = async (req: Request, res: Response) => {
  try {
    const { user } = req.session;

    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const userFound = await getUserFromId(user.userId);

    if (!userFound) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    return res.status(200).json({
      isLoggedIn: true,
      user: {
        id: userFound.id,
        email: userFound.email,
        name: userFound.name,
        is_admin: userFound.is_admin,
      },
    });
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({ message: "Internal Server Error", isLoggedIn: false });
  }
};

export const checkAdminLoginStatus = async (req: Request, res: Response) => {
  try {
    const { user } = req.session;

    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const userFound = await getUserFromId(user.userId);

    if (!userFound) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (!userFound.is_admin) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    return res.status(200).json({
      isLoggedIn: true,
      user: {
        id: userFound.id,
        email: userFound.email,
        name: userFound.name,
        is_admin: userFound.is_admin,
      },
    });
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({ message: "Internal Server Error", isLoggedIn: false });
  }
};

// logout
export const logoutUser = async (req: Request, res: Response) => {
  try {
    const user = req.session.user;
    if (user != null) {
      const SESS_NAME = process.env.SESS_NAME as string;

      req.session.destroy(() => {
        return res.clearCookie(SESS_NAME).json(user);
      });
    } else {
      return res.status(400).json({ message: "ERROR_SESSION_NOT_FOUND" });
    }
  } catch (err) {
    console.log(err);
    return res.status(400).json({ message: "ERROR" });
  }
};
