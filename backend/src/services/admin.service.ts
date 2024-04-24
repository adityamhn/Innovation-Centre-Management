import { pool } from "../db/db";
import { getStartupMembers, getUserFromId } from "./user.service";

export const getAllStartups = async () => {
  const query = `
    SELECT 
      s.id, 
      s.name, 
      s.description, 
      s.website_url, 
      s.pitch_deck_url, 
      s.pitch_video_url, 
      s.logo_url, 
      s.startup_admin, 
      s.created_at, 
      s.industry, 
      s.status, 
      s.public_profile,
      m.user_id AS member_user_id,
      m.role AS member_role,
      u.id AS user_id,
      u.name AS user_name,
      u.email AS user_email,
      u.is_mahe AS user_is_mahe,
      u.reg_no AS user_reg_no,
      u.date_of_birth AS user_date_of_birth,
      u.contact AS user_contact,
      u.is_admin AS user_is_admin,
      u.created_at AS user_created_at
    FROM startups AS s
    LEFT JOIN startup_members AS m ON s.id = m.startup_id
    LEFT JOIN users AS u ON u.id = m.user_id OR u.id = s.startup_admin
    ORDER BY s.id, m.user_id`;

  const res = await pool.query(query);
  
  const startups = [];
  const startupMap:any = {};

  for (const row of res.rows) {
    if (!startupMap[row.id]) {
      startupMap[row.id] = {
        id: row.id,
        name: row.name,
        description: row.description,
        website_url: row.website_url,
        pitch_deck_url: row.pitch_deck_url,
        pitch_video_url: row.pitch_video_url,
        logo_url: row.logo_url,
        created_at: row.created_at,
        industry: row.industry,
        status: row.status,
        public_profile: row.public_profile,
        startup_admin: {
          id: row.user_id,
          name: row.user_name,
          email: row.user_email,
          is_mahe: row.user_is_mahe,
          reg_no: row.user_reg_no,
          date_of_birth: row.user_date_of_birth,
          contact: row.user_contact,
          is_admin: row.user_is_admin,
          created_at: row.user_created_at
        },
        members: []
      };
      startups.push(startupMap[row.id]);
    }

    if (row.member_user_id) {
      startupMap[row.id].members.push({
        user_id: row.member_user_id,
        role: row.member_role,
        user: {
          id: row.user_id,
          name: row.user_name,
          email: row.user_email,
          is_mahe: row.user_is_mahe,
          reg_no: row.user_reg_no,
          date_of_birth: row.user_date_of_birth,
          contact: row.user_contact,
          is_admin: row.user_is_admin,
          created_at: row.user_created_at
        }
      });
    }
  }

  return startups;
};

export const getStartupFromId = async (startupId: string) => {
  const res = await pool.query("SELECT id, name, description, website_url, pitch_deck_url, pitch_video_url, logo_url, startup_admin, created_at, industry, status, public_profile FROM startups WHERE id = $1", [
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

export const updateStartupPublic = async (
  startupId: string,
  isPublic: boolean
) => {
  const res = await pool.query(
    "UPDATE startups SET public_profile = $1 WHERE id = $2",
    [isPublic ? "true" : "false", startupId]
  );

  return res.rows[0];
}

export const getAllUsers = async () => {
  const res = await pool.query("SELECT id, name, reg_no, email, password, created_at, is_mahe, is_admin, date_of_birth, contact FROM users");

  return res.rows;
};

export const getUserStartupMember = async (userId: string) => {
  const res = await pool.query(
    "SELECT startup_id, user_id, role FROM startup_members WHERE user_id = $1",
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
  const res = await pool.query("SELECT workspace_id, name, location, size, amenities, available, description FROM workspaces");

  return res.rows;
};

export const getWorkspaceFromId = async (workspaceId: string) => {
  const res = await pool.query("SELECT workspace_id, name, location, size, amenities, available, description FROM workspaces WHERE workspace_id = $1", [
    workspaceId,
  ]);

  return res.rows[0];
}

export const getAllWorkspaceRequests = async () => {
  const query = `
    SELECT 
      wr.request_id, 
      wr.workspace_type, 
      wr.requester_id, 
      wr.reason, 
      wr.members_count, 
      wr.from_date, 
      wr.to_date, 
      wr.status, 
      wr.request_date,
      u.id AS user_id,
      u.name AS user_name,
      u.email AS user_email,
      u.is_mahe AS user_is_mahe,
      u.reg_no AS user_reg_no,
      u.date_of_birth AS user_date_of_birth,
      u.contact AS user_contact,
      u.is_admin AS user_is_admin,
      u.created_at AS user_created_at
    FROM workspace_requests AS wr
    JOIN users AS u ON wr.requester_id = u.id`;

  const res = await pool.query(query);

  const requests = res.rows.map(request => ({
    request_id: request.request_id,
    workspace_type: request.workspace_type,
    requester_id: request.requester_id,
    reason: request.reason,
    members_count: request.members_count,
    from_date: request.from_date,
    to_date: request.to_date,
    status: request.status,
    request_date: request.request_date,
    user: {
      id: request.user_id,
      name: request.user_name,
      email: request.user_email,
      is_mahe: request.user_is_mahe,
      reg_no: request.user_reg_no,
      date_of_birth: request.user_date_of_birth,
      contact: request.user_contact,
      is_admin: request.user_is_admin,
      created_at: request.user_created_at
    }
  }));

  return requests;
};


export const updateWorkspaceRequestStatus = async (
  requestId: string,
  status: string
) => {
  const res = await pool.query(
    "UPDATE workspace_requests SET status = $1 WHERE request_id = $2",
    [status, requestId]
  );

  return res.rows[0];
};

export const allocateWorkspace = async ({
  workspaceId,
  userId,
  startupId,
  startDate,
  endDate,
}: {
  workspaceId: string;
  userId: string;
  startupId: string;
  startDate: any;
  endDate: Date;
}) => {
  let res;

  if (!startDate) {
    throw new Error("Start and end date are required");
  }

  if (startupId) {
    res = await pool.query(
      "INSERT INTO workspace_allocations (workspace_id, start_date, user_id, startup_id, end_date) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [workspaceId, startDate, userId, startupId, endDate]
    );
  } else {
    res = await pool.query(
      "INSERT INTO workspace_allocations (workspace_id, start_date, user_id, end_date) VALUES ($1, $2, $3, $4) RETURNING *",
      [workspaceId, startDate, userId, endDate]
    );
  }

  return res.rows[0];
};

export const getWorkspaceAllocations = async () => {
  const res = await pool.query("SELECT allocation_id, workspace_id, start_date, user_id, startup_id, end_date FROM workspace_allocations");

  for (const allocation of res.rows) {
    const user = await getUserFromId(allocation.user_id);
    allocation.user = user;

    if (allocation.startup_id) {
      const startup = await getStartupFromId(allocation.startup_id);
      allocation.startup = startup;
    }

    const workspace = await getWorkspaceFromId(allocation.workspace_id);
    allocation.workspace = workspace;
  }

  return res.rows;
}

export const deleteAllocation = async (allocationId: string) => {
  const res = await pool.query("DELETE FROM workspace_allocations WHERE allocation_id = $1", [allocationId]);

  return res.rows[0];
}


export const createEvent = async ({
  title,
  description,
  eventDate,
  location,
  createdBy,
}: {
  title: string;
  description: string;
  eventDate: any;
  location: string;
  createdBy: string;
}) => {
  const res = await pool.query(
    "INSERT INTO events (title, description, event_date, location, created_by) VALUES ($1, $2, $3, $4, $5) RETURNING *",
    [title, description, eventDate, location, createdBy]
  );

  return res.rows[0];
}

export const getAllEvents = async () => {
  const res = await pool.query("SELECT event_id, title, description, event_date, location, created_by, posted_at FROM events");

  for (const event of res.rows) {
    const user = await getUserFromId(event.created_by);
    event.created_by = user;
  }

  return res.rows;
}

export const createNews = async ({
  title,
  content,
  postedBy,
}: {
  title: string;
  content: string;
  postedBy: string;
}) => {
  const res = await pool.query(
    "INSERT INTO news (title, content, posted_by) VALUES ($1, $2, $3) RETURNING *",
    [title, content, postedBy]
  );

  return res.rows[0];
}


export const getAllNews = async () => {
  const res = await pool.query("SELECT news_id, title, content, posted_by, posted_at FROM news");

  for (const news of res.rows) {
    const user = await getUserFromId(news.posted_by);
    news.posted_by = user;
  }

  return res.rows;
}

export const createInvestmentOpportunity = async ({
  opportunityDetails,
  visibility = true,
}: {
  opportunityDetails: string;
  visibility: any;
}) => {
  const res = await pool.query(
    "INSERT INTO investment_opportunities (opportunity_details, visibility) VALUES ($1, $2) RETURNING *",
    [opportunityDetails, visibility]
  );

  return res.rows[0];
}

export const getAllInvestmentOpportunities = async () => {
  const res = await pool.query("SELECT opportunity_id, opportunity_details, visibility, posted_at FROM investment_opportunities");

  return res.rows;
}


export const getAllMentorshipRequests = async () => {
 const query = `
    SELECT 
      mr.request_id, 
      mr.area_of_interest, 
      mr.available_days, 
      mr.request_details, 
      mr.user_id, 
      mr.status, 
      mr.requested_at,
      u.id AS user_id, 
      u.name AS user_name, 
      u.email AS user_email, 
      u.is_mahe AS user_is_mahe, 
      u.reg_no AS user_reg_no, 
      u.date_of_birth AS user_date_of_birth, 
      u.contact AS user_contact, 
      u.is_admin AS user_is_admin, 
      u.created_at AS user_created_at
    FROM mentorship_requests AS mr
    JOIN users AS u ON mr.user_id = u.id`;

  const res = await pool.query(query);
  const requests = res.rows.map(request => ({
    request_id: request.request_id,
    area_of_interest: request.area_of_interest,
    available_days: request.available_days,
    request_details: request.request_details,
    status: request.status,
    requested_at: request.requested_at,
    user: {
      id: request.user_id,
      name: request.user_name,
      email: request.user_email,
      is_mahe: request.user_is_mahe,
      reg_no: request.user_reg_no,
      date_of_birth: request.user_date_of_birth,
      contact: request.user_contact,
      is_admin: request.user_is_admin,
      created_at: request.user_created_at
    }
  }));

  return requests;
}

export const updateMentorshipRequestStatus = async (
  requestId: string,
  status: string
) => {
  const res = await pool.query(
    "UPDATE mentorship_requests SET status = $1 WHERE request_id = $2",
    [status, requestId]
  );

  return res.rows[0];
}


export const getStartupStats = async () => {
  try {
    const res = await pool.query("SELECT * FROM get_startup_stats();");
    return res.rows[0];  // Assuming the function always returns one row
  } catch (error) {
    console.error('Error executing get_startup_stats:', error);
    throw error;
  }
}