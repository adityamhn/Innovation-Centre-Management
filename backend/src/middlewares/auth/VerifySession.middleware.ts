import { Response, NextFunction, Request } from "express";
import { getUserFromId } from "../../services/user.service";

export const verifySession = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.session) {
    return res.status(403).send({ message: "SESSION_NOT_PROVIDED" });
  }
  const session = req.session; // cookie

  const FRONTEND_URL = process.env.FRONTEND_URL;

  if (session.user == null) {
    res.redirect(`${FRONTEND_URL}/login`);
    return;
  }

  const userId = session.user.userId;

  const user = await getUserFromId(userId);

  console.log(user)

  if (!user) {
    return res.status(403).send({ message: "USER_NOT_FOUND" });
  }

  res.locals.userId = userId;

  next();
};


export const verifyAdminSession = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.session) {
    return res.status(403).send({ message: "SESSION_NOT_PROVIDED" });
  }
  const session = req.session; // cookie

  const FRONTEND_URL = process.env.FRONTEND_URL;

  if (session.user == null) {
    res.redirect(`${FRONTEND_URL}/login`);
    return;
  }

  const userId = session.user.userId;

  const user = await getUserFromId(userId);

  console.log(user)

  if (!user) {
    return res.status(403).send({ message: "USER_NOT_FOUND" });
  }

  if (!user.is_admin) {
    return res.status(403).send({ message: "UNAUTHORIZED" });
  }

  res.locals.userId = userId;

  next();
};