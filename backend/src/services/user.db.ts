import { pool } from "../db/db";
import bcrypt from "bcryptjs";

export const getUserFromEmail = async (email: string) => {
  const res = await pool.query("SELECT * FROM users WHERE email = $1", [email]);

  return res.rows[0];
};

export const MatchPassword = async (
  password: string,
  userPasswordHash: string
) => {
  return bcrypt.compare(password, userPasswordHash);
};
