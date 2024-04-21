import moment from "moment";
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

export const updateUserProfile = async ({
  contact,
  date_of_birth,
  name,
  userId,
}: {
  contact: string;
  date_of_birth: Date;
  name: string;
  userId: string;
}) => {
  console.log(date_of_birth);
  const formattedDateOfBirth = moment(date_of_birth).format("YYYY-MM-DD");

  const res = await pool.query(
    "UPDATE users SET contact = $1, date_of_birth = $2, name = $3 WHERE id = $4 RETURNING *",
    [contact, formattedDateOfBirth, name, userId]
  );

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

export const registerNewStartup = async ({
  name,
  description,
  pitch_deck_url,
  pitch_video_url,
  logo_url,
  industries,
  userId,
}: any) => {
  const res = await pool.query(
    "INSERT INTO startups (name, description, pitch_deck_url, pitch_video_url, logo_url, industry, startup_admin) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *",
    [
      name,
      description,
      pitch_deck_url,
      pitch_video_url,
      logo_url,
      industries,
      userId,
    ]
  );

  return res.rows[0];
};

export const addMemberToStartup = async ({
  startupId,
  email,
  role,
}: {
  startupId: string;
  email: string;
  role: string;
}) => {
  const user = await getUserFromEmail(email);

  if (!user) {
    throw new Error(`Member ${email}  does not exist!`);
  }

  const userId = user.id;

  const res = await pool.query(
    "INSERT INTO startup_members (startup_id, user_id, role) VALUES ($1, $2, $3) RETURNING *",
    [startupId, userId, role]
  );

  return res.rows[0];
};

export const getUserStartup = async (userId: string) => {
  const res = await pool.query(
    "SELECT * FROM startups WHERE startup_admin = $1",
    [userId]
  );

  return res.rows[0];
};

export const getStartupMembers = async (startupId: string) => {
  const res = await pool.query(
    "SELECT * FROM startup_members WHERE startup_id = $1",
    [startupId]
  );

  const data = res.rows;

  for (const user of data) {
    const userData = await getUserFromId(user.user_id);
    user.email = userData.email;
  }

  return data;
};

export const requestForWorkspace = async ({
  workspaceType,
  reason,
  userId,
  membersCount = 1,
  from,
  to,
}: {
  workspaceType: string;
  reason: string;
  userId: string;
  membersCount: any;
  from: Date;
  to: Date;
}) => {
  const res = await pool.query(
    "INSERT INTO workspace_requests (workspace_type, requester_id, reason, members_count, from_date, to_date) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
    [workspaceType, userId, reason, membersCount, from, to]
  );

  return res.rows[0];
};


export const getUserPendingWorkspaceRequests = async (userId: string) => {
  const res = await pool.query(
    "SELECT * FROM workspace_requests WHERE requester_id = $1 AND status = 'pending'",
    [userId]
  );

  return res.rows[0];
}