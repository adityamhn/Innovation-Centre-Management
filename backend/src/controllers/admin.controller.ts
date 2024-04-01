import { Request, Response } from "express";
import sanitizeHtml from "sanitize-html";
import { emailRegex } from "../utils/constants";
import { MatchPassword, getUserFromEmail } from "../services/user.service";

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
        name: user.name
      },
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
