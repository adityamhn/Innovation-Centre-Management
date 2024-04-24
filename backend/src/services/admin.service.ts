import { pool } from "../db/db";
import { getUserFromId } from "./user.service";

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
      s.created_at, 
      s.industry, 
      s.status, 
      s.public_profile,
      JSON_BUILD_OBJECT(
        'id', u.id,
        'name', u.name,
        'email', u.email,
        'is_mahe', u.is_mahe,
        'reg_no', u.reg_no,
        'date_of_birth', u.date_of_birth,
        'contact', u.contact,
        'is_admin', u.is_admin,
        'created_at', u.created_at
      ) AS startup_admin,
      (
        SELECT JSON_AGG(
          JSON_BUILD_OBJECT(
            'user_id', m.user_id,
            'role', m.role,
            'user', JSON_BUILD_OBJECT(
              'id', mu.id,
              'name', mu.name,
              'email', mu.email,
              'is_mahe', mu.is_mahe,
              'reg_no', mu.reg_no,
              'date_of_birth', mu.date_of_birth,
              'contact', mu.contact,
              'is_admin', mu.is_admin,
              'created_at', mu.created_at
            )
          )
        )
        FROM startup_members AS m
        JOIN users AS mu ON mu.id = m.user_id
        WHERE m.startup_id = s.id
      ) AS members
    FROM startups AS s
    LEFT JOIN users AS u ON u.id = s.startup_admin
    ORDER BY s.id`;

  const res = await pool.query(query);
  return res.rows.map(row => ({
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
    startup_admin: row.startup_admin,
    members: row.members || []
  }));
};

export const getStartupFromId = async (startupId: string) => {
  const query = `
    SELECT
      s.id, 
      s.name, 
      s.description, 
      s.website_url, 
      s.pitch_deck_url, 
      s.pitch_video_url, 
      s.logo_url, 
      s.created_at, 
      s.industry, 
      s.status, 
      s.public_profile,
      JSON_BUILD_OBJECT(
        'id', admin.id,
        'name', admin.name,
        'email', admin.email,
        'is_mahe', admin.is_mahe,
        'reg_no', admin.reg_no,
        'date_of_birth', admin.date_of_birth,
        'contact', admin.contact,
        'is_admin', admin.is_admin,
        'created_at', admin.created_at
      ) AS startup_admin,
      COALESCE(
        (
          SELECT JSON_AGG(
            JSON_BUILD_OBJECT(
              'user_id', m.user_id,
              'role', m.role,
              'name', u.name,
              'email', u.email,
              'is_mahe', u.is_mahe,
              'reg_no', u.reg_no,
              'date_of_birth', u.date_of_birth,
              'contact', u.contact,
              'is_admin', u.is_admin,
              'created_at', u.created_at
            )
          ) 
          FROM startup_members m
          JOIN users u ON m.user_id = u.id
          WHERE m.startup_id = s.id
        ),
        '[]'
      ) AS members
    FROM startups s
    LEFT JOIN users admin ON s.startup_admin = admin.id
    WHERE s.id = $1
    GROUP BY s.id, admin.id`;

  const res = await pool.query(query, [startupId]);

  if (res.rows.length === 0) {
    return null; // Or handle the case when no startup is found with the given ID
  }

  const startupData = res.rows[0];

  const startup = {
    id: startupData.id,
    name: startupData.name,
    description: startupData.description,
    website_url: startupData.website_url,
    pitch_deck_url: startupData.pitch_deck_url,
    pitch_video_url: startupData.pitch_video_url,
    logo_url: startupData.logo_url,
    created_at: startupData.created_at,
    industry: startupData.industry,
    status: startupData.status,
    public_profile: startupData.public_profile,
    startup_admin: startupData.startup_admin,
    members: startupData.members
  };

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
  const query = `
    SELECT 
      wa.allocation_id, 
      wa.workspace_id, 
      wa.start_date, 
      wa.user_id, 
      wa.startup_id, 
      wa.end_date,
      JSON_BUILD_OBJECT(
        'id', u.id,
        'name', u.name,
        'email', u.email,
        'is_mahe', u.is_mahe,
        'reg_no', u.reg_no,
        'date_of_birth', u.date_of_birth,
        'contact', u.contact,
        'is_admin', u.is_admin,
        'created_at', u.created_at
      ) AS user,
      COALESCE(
        (
          SELECT ROW_TO_JSON(s)
          FROM (
            SELECT
              s.id, 
              s.name, 
              s.description, 
              s.website_url, 
              s.pitch_deck_url, 
              s.pitch_video_url, 
              s.logo_url, 
              s.created_at, 
              s.industry, 
              s.status, 
              s.public_profile,
              JSON_BUILD_OBJECT(
                'id', a.id,
                'name', a.name,
                'email', a.email,
                'is_mahe', a.is_mahe,
                'reg_no', a.reg_no,
                'date_of_birth', a.date_of_birth,
                'contact', a.contact,
                'is_admin', a.is_admin,
                'created_at', a.created_at
              ) AS startup_admin,
              COALESCE(
                (
                  SELECT JSON_AGG(
                    JSON_BUILD_OBJECT(
                      'user_id', m.user_id,
                      'role', m.role,
                      'name', um.name,
                      'email', um.email,
                      'is_mahe', um.is_mahe,
                      'reg_no', um.reg_no,
                      'date_of_birth', um.date_of_birth,
                      'contact', um.contact,
                      'is_admin', um.is_admin,
                      'created_at', um.created_at
                    )
                  )
                  FROM startup_members m
                  JOIN users um ON m.user_id = um.id
                  WHERE m.startup_id = wa.startup_id
                ),
                '[]'
              ) AS members
            FROM startups s
            LEFT JOIN users a ON s.startup_admin = a.id
            WHERE s.id = wa.startup_id
          ) s
        ),
        '{}'
      ) AS startup,
      JSON_BUILD_OBJECT(
        'workspace_id', ws.workspace_id,
        'name', ws.name,
        'location', ws.location,
        'size', ws.size,
        'amenities', ws.amenities,
        'available', ws.available,
        'description', ws.description
      ) AS workspace
    FROM workspace_allocations wa
    JOIN workspaces ws ON wa.workspace_id = ws.workspace_id
    JOIN users u ON wa.user_id = u.id
  `;

  const res = await pool.query(query);

  return res.rows.map(allocation => ({
    allocation_id: allocation.allocation_id,
    workspace_id: allocation.workspace_id,
    user_id: allocation.user_id,  
    startup_id: allocation.startup_id,
    start_date: allocation.start_date,
    end_date: allocation.end_date,
    user: allocation.user,
    startup: allocation.startup,
    workspace: allocation.workspace
  }));
};


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