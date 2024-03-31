import { pool } from "../db/db";
import bcrypt from "bcryptjs";

export const getUserFromEmail = async (email: string) => {
  const res = await pool.query("SELECT * FROM users WHERE email = $1", [email]);

  return res.rows[0];
};

export const getUserFromId = async (id: string) => {
  const res = await pool.query("SELECT * FROM users WHERE id = $1", [id]);

  return res.rows[0];
};

export const MatchPassword = async (
  password: string,
  userPasswordHash: string,
  isAdmin: boolean
) => {
  if (isAdmin) {
    return password === userPasswordHash;
  }

  return bcrypt.compareSync(password, userPasswordHash);
};

export const createNewUser = async ({
  name,
  email,
  password,
  is_mahe,
  reg_no,
}: {
  name: string;
  email: string;
  password: string;
  is_mahe: boolean;
  reg_no: string;
}) => {
  const hashedPassword: any = (await bcrypt.hash(password, 12)) as string;

  const res = await pool.query(
    "INSERT INTO users (name, email, password, is_mahe, reg_no) VALUES ($1, $2, $3, $4, $5) RETURNING *",
    [name, email, hashedPassword, is_mahe, reg_no]
  );

  return res.rows[0];
};
