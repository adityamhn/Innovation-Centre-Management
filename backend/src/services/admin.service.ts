import { pool } from "../db/db";
import { getStartupMembers, getUserFromId } from "./user.service";

export const getAllStartups = async () => {
  const res = await pool.query("SELECT * FROM startups");

  const startups = res.rows;

  for (const startup of startups) {
    const members = await getStartupMembers(startup.id);

    for (const member of members) {
      const user = await getUserFromId(member.user_id);
      member.user = user;
    }

    const admin = await getUserFromId(startup.startup_admin);
    startup.startup_admin = admin;
    startup.members = members;
  }

  return res.rows;
};

export const getStartupFromId = async (startupId: string) => {
  const res = await pool.query("SELECT * FROM startups WHERE id = $1", [
    startupId,
  ]);

  const startup = res.rows[0];

  const members = await getStartupMembers(startup.id);

  for (const member of members) {
    const user = await getUserFromId(member.user_id);
    member.user = user;
  }

  const admin = await getUserFromId(startup.startup_admin);
  startup.startup_admin = admin;
  startup.members = members;

  return startup;
};

export const updateStartupStatus = async (
  startupId: string,
  status: string
) => {
  const res = await pool.query(
    "UPDATE startups SET status = $1 WHERE id = $2",
    [status, startupId]
  );

  return res.rows[0];
};

export const getAllUsers = async () => {
  const res = await pool.query("SELECT * FROM users");

  return res.rows;
};

export const getUserStartupMember = async (userId: string) => {
  const res = await pool.query(
    "SELECT * FROM startup_members WHERE user_id = $1",
    [userId]
  );

  if (res.rows.length === 0) {
    return null;
  }

  const startupId = res.rows[0].startup_id;

  const startup = await getStartupFromId(startupId);

  return {
    ...startup,
    role: res.rows[0].role,
  };
};

export const createNewWorkspace = async ({
  name,
  location,
  description,
  size,
  amenities,
  available,
}: {
  name: string;
  location: string;
  description: string;
  size: string;
  amenities: string;
  available: boolean;
}) => {
  const res = await pool.query(
    "INSERT INTO workspaces (name, location, description, size, amenities, available) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
    [name, location, description, size, amenities, available ? "true" : "false"]
  );

  return res.rows[0];
};

export const updateWorkspace = async ({
  workspaceId,
  name,
  location,
  description,
  size,
  amenities,
  available,
}: {
  workspaceId: string;
  name: string;
  location: string;
  description: string;
  size: string;
  amenities: any;
  available: boolean;
}) => {
  const res = await pool.query(
    "UPDATE workspaces SET name = $1, location = $2, description = $3, size = $4, amenities = $5, available = $6 WHERE workspace_id = $7",
    [
      name,
      location,
      description,
      size,
      amenities,
      available ? "true" : "false",
      workspaceId,
    ]
  );

  return true;
};

export const getAllWorkspaces = async () => {
  const res = await pool.query("SELECT * FROM workspaces");

  return res.rows;
};

export const getAllWorkspaceRequests = async () => {
    const res = await pool.query("SELECT * FROM workspace_requests");

    for (const request of res.rows) {
        const user = await getUserFromId(request.requester_id);
        request.user = user;
    }

    return res.rows;
}

