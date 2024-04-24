import moment from "moment";
import { pool } from "../db/db";
import bcrypt from "bcryptjs";
import { getWorkspaceFromId } from "./admin.service";

export const getUserFromEmail = async (email: string) => {
  const res = await pool.query(
    "SELECT id, name, email, is_mahe, reg_no, date_of_birth, contact, is_admin, created_at FROM users WHERE email = $1",
    [email]
  );

  return res.rows[0];
};

export const getUserFromId = async (id: string) => {
  const res = await pool.query(
    "SELECT id, name, email, is_mahe, reg_no, date_of_birth, contact, is_admin, created_at FROM users WHERE id = $1",
    [id]
  );

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
  const formattedDateOfBirth = moment(date_of_birth).format("YYYY-MM-DD");

  const res = await pool.query(
    "UPDATE users SET contact = $1, date_of_birth = $2, name = $3 WHERE id = $4 RETURNING *",
    [contact, formattedDateOfBirth, name, userId]
  );

  return res.rows[0];
};

export const MatchPassword = async (
  password: string,
  userId: string,
  isAdmin: boolean
) => {
  const res = await pool.query("SELECT password FROM users WHERE id = $1", [
    userId,
  ]);

  const userPasswordHash = res.rows[0].password;

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
  website_url,
  userId,
}: any) => {
  const res = await pool.query(
    "INSERT INTO startups (name, description, pitch_deck_url, pitch_video_url, logo_url, industry, website_url, startup_admin) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *",
    [
      name,
      description,
      pitch_deck_url,
      pitch_video_url,
      logo_url,
      industries,
      website_url,
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

export const deleteAllMembersFromStartup = async (startupId: string) => {
  const res = await pool.query(
    "DELETE FROM startup_members WHERE startup_id = $1",
    [startupId]
  );

  return res.rows;
};

export const getUserStartup = async (userId: string) => {
  const res = await pool.query(
    `SELECT id, name, description, website_url, pitch_deck_url, pitch_video_url, logo_url, industry, public_profile, status, created_at, startup_admin FROM startups WHERE startup_admin = $1`,
    [userId]
  );

  return res.rows[0];
};

export const updateStartup = async ({
  name,
  description,
  pitch_deck_url,
  pitch_video_url,
  logo_url,
  industries,
  website_url,
  startupId,
}: any) => {
  const res = await pool.query(
    "UPDATE startups SET name = $1, description = $2, pitch_deck_url = $3, pitch_video_url = $4, logo_url = $5, industry = $6, website_url = $7 WHERE id = $8 RETURNING *",
    [
      name,
      description,
      pitch_deck_url,
      pitch_video_url,
      logo_url,
      industries,
      website_url,
      startupId,
    ]
  );
  return res.rows[0];
};

export const getStartupMembers = async (startupId: string) => {
  const res = await pool.query(
    "SELECT startup_id, user_id, role FROM startup_members WHERE startup_id = $1",
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
    "SELECT request_id, workspace_type, requester_id, reason, members_count, from_date, to_date, status, request_date  FROM workspace_requests WHERE requester_id = $1",
    [userId]
  );

  return res.rows[0];
};

export const getAllPublicStartups = async () => {
  const res = await pool.query(
    "SELECT name, id, description, logo_url, website_url, industry, public_profile FROM startups WHERE public_profile = true"
  );

  return res.rows;
};

export const getMyAllocatedWorkspace = async (userId: string) => {
  const res = await pool.query(
    "SELECT allocation_id, workspace_id, start_date, user_id, startup_id, end_date  FROM workspace_allocations WHERE user_id = $1",
    [userId]
  );

  const allocation = res.rows[0];

  if (allocation.workspace_id) {
    const workspace = await getWorkspaceFromId(allocation.workspace_id);
    allocation.workspace = workspace;
  }

  return allocation;
};

export const requestMentorship = async ({
  area_of_interest,
  available_days,
  request_details,
  userId,
}: {
  area_of_interest: string;
  available_days: string;
  request_details: string;
  userId: string;
}) => {
  const res = await pool.query(
    "INSERT INTO mentorship_requests (area_of_interest, available_days, request_details, user_id) VALUES ($1, $2, $3, $4) RETURNING *",
    [area_of_interest, available_days, request_details, userId]
  );

  return res.rows[0];
};

export const getUserPendingMentorshipRequests = async (userId: string) => {
  const res = await pool.query(
    "SELECT request_id, area_of_interest, available_days, request_details, user_id, status FROM mentorship_requests WHERE user_id = $1 AND status = 'pending'",
    [userId]
  );

  return res.rows;
};


export const getAllInfo = async () => {

  const news = await pool.query(
    "SELECT news_id, title, content, posted_by, posted_at FROM news"
  );

  const events = await pool.query(
    "SELECT event_id, title, description, event_date, location, created_by, posted_at FROM events"
  );

  const opportunities = await pool.query(
    "SELECT opportunity_id, opportunity_details, visibility, posted_at FROM investment_opportunities WHERE visibility = true"
  );
  const final = [];

  for (const item of news.rows) {
    item.type = "news";
    final.push(item);
  }

  for (const item of events.rows) {
    item.type = "event";
    final.push(item);
  }

  for (const item of opportunities.rows) {
    item.type = "opportunity";
    final.push(item);
  }

  final.sort((a, b) => {
    return moment(b.posted_at).diff(moment(a.posted_at));
  });

  return final;
};
