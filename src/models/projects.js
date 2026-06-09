import db from './db.js';

/* =========================
   GET ALL PROJECTS
========================= */
const getAllProjects = async () => {

    const query = `
        SELECT
            p.project_id,
            p.title,
            p.description,
            p.location,
            p.project_date,
            o.name AS organization_name
        FROM project p
        JOIN organization o
            ON p.organization_id = o.organization_id
        ORDER BY p.project_date;
    `;

    const result = await db.query(query);

    return result.rows;
};

/* =========================
   GET PROJECTS BY ORGANIZATION ID
========================= */
const getProjectsByOrganizationId = async (organizationId) => {

    const query = `
        SELECT
            project_id,
            organization_id,
            title,
            description,
            location,
            project_date
        FROM project
        WHERE organization_id = $1
        ORDER BY project_date;
    `;

    const result = await db.query(query, [organizationId]);

    return result.rows;
};

/* =========================
   GET SINGLE PROJECT BY ID
========================= */
const getProjectById = async (projectId) => {

    const query = `
        SELECT
            p.project_id,
            p.title,
            p.description,
            p.location,
            p.project_date,
            o.organization_id,
            o.name AS organization_name
        FROM project p
        JOIN organization o
            ON p.organization_id = o.organization_id
        WHERE p.project_id = $1;
    `;

    const result = await db.query(query, [projectId]);

    return result.rows.length > 0
        ? result.rows[0]
        : null;
};

/* =========================
   CREATE PROJECT
========================= */
const createProject = async (
    title,
    description,
    location,
    date,
    organizationId
) => {

    const query = `
        INSERT INTO project (
            title,
            description,
            location,
            project_date,
            organization_id
        )
        VALUES ($1, $2, $3, $4, $5)
        RETURNING project_id;
    `;

    const result = await db.query(query, [
        title,
        description,
        location,
        date,
        organizationId
    ]);

    if (
        !result.rows ||
        result.rows.length === 0
    ) {
        throw new Error(
            'Failed to create project'
        );
    }

    return result.rows[0].project_id;
};

/* =========================
   UPDATE PROJECT
========================= */
const updateProject = async (
    projectId,
    title,
    description,
    location,
    date,
    organizationId
) => {

    const query = `
        UPDATE project
        SET
            title = $1,
            description = $2,
            location = $3,
            project_date = $4,
            organization_id = $5
        WHERE project_id = $6
        RETURNING project_id;
    `;

    const result = await db.query(query, [
        title,
        description,
        location,
        date,
        organizationId,
        projectId
    ]);

    if (
        !result.rows ||
        result.rows.length === 0
    ) {
        throw new Error(
            'Failed to update project'
        );
    }

    return result.rows[0].project_id;
};

/* =========================
   ADD VOLUNTEER
========================= */
const addVolunteer = async (
    userId,
    projectId
) => {

    const query = `
        INSERT INTO project_volunteer
        (
            user_id,
            project_id
        )
        VALUES
        (
            $1,
            $2
        )
        ON CONFLICT DO NOTHING;
    `;

    await db.query(
        query,
        [userId, projectId]
    );
};

/* =========================
   REMOVE VOLUNTEER
========================= */
const removeVolunteer = async (
    userId,
    projectId
) => {

    const query = `
        DELETE FROM project_volunteer
        WHERE user_id = $1
        AND project_id = $2;
    `;

    await db.query(
        query,
        [userId, projectId]
    );
};

/* =========================
   CHECK IF USER IS VOLUNTEER
========================= */
const isUserVolunteer = async (
    userId,
    projectId
) => {

    const query = `
        SELECT *
        FROM project_volunteer
        WHERE user_id = $1
        AND project_id = $2;
    `;

    const result = await db.query(
        query,
        [userId, projectId]
    );

    return result.rows.length > 0;
};

/* =========================
   GET USER VOLUNTEER PROJECTS
========================= */
const getVolunteerProjects = async (
    userId
) => {

    const query = `
        SELECT
            p.project_id,
            p.title,
            p.location,
            p.project_date
        FROM project p
        JOIN project_volunteer pv
            ON p.project_id = pv.project_id
        WHERE pv.user_id = $1
        ORDER BY p.project_date;
    `;

    const result = await db.query(
        query,
        [userId]
    );

    return result.rows;
};

/* =========================
   EXPORTS
========================= */
export {
    getAllProjects,
    getProjectsByOrganizationId,
    getProjectById,
    createProject,
    updateProject,
    addVolunteer,
    removeVolunteer,
    isUserVolunteer,
    getVolunteerProjects
};