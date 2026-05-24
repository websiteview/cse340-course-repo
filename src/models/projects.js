import db from './db.js';

/* Get all projects */
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

/* Get projects by organization ID */
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

    const queryParams = [organizationId];

    const result = await db.query(query, queryParams);

    return result.rows;

};

/* Get single project by ID */
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

    const queryParams = [projectId];

    const result = await db.query(query, queryParams);

    return result.rows[0];

};

export {
    getAllProjects,
    getProjectsByOrganizationId,
    getProjectById
};