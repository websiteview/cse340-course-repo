import db from './db.js';

/* =========================
   GET ALL CATEGORIES
========================= */
const getAllCategories = async () => {

    const query = `
        SELECT
            category_id,
            name
        FROM category
        ORDER BY name;
    `;

    const result = await db.query(query);

    return result.rows;
};

/* =========================
   GET CATEGORY BY ID
========================= */
const getCategoryById = async (categoryId) => {

    const query = `
        SELECT
            category_id,
            name
        FROM category
        WHERE category_id = $1;
    `;

    const result = await db.query(query, [categoryId]);

    return result.rows[0];
};

/* =========================
   GET PROJECTS BY CATEGORY ID
========================= */
const getProjectsByCategoryId = async (categoryId) => {

    const query = `
        SELECT
            p.project_id,
            p.title,
            p.description,
            p.location,
            p.project_date
        FROM project p
        JOIN project_category pc
            ON p.project_id = pc.project_id
        WHERE pc.category_id = $1
        ORDER BY p.project_date;
    `;

    const result = await db.query(query, [categoryId]);

    return result.rows;
};

/* =========================
   GET CATEGORIES BY PROJECT ID
========================= */
const getCategoriesByProjectId = async (projectId) => {

    const query = `
        SELECT
            c.category_id,
            c.name
        FROM category c
        JOIN project_category pc
            ON c.category_id = pc.category_id
        WHERE pc.project_id = $1
        ORDER BY c.name;
    `;

    const result = await db.query(query, [projectId]);

    return result.rows;
};

/* =========================
   CREATE CATEGORY
========================= */
const createCategory = async (name) => {

    const query = `
        INSERT INTO category (name)
        VALUES ($1)
        RETURNING category_id;
    `;

    const result = await db.query(query, [name]);

    if (!result.rows || result.rows.length === 0) {
        throw new Error('Failed to create category');
    }

    return result.rows[0].category_id;
};

/* =========================
   UPDATE CATEGORY
========================= */
const updateCategory = async (categoryId, name) => {

    const query = `
        UPDATE category
        SET name = $1
        WHERE category_id = $2
        RETURNING category_id;
    `;

    const result = await db.query(query, [
        name,
        categoryId
    ]);

    if (!result.rows || result.rows.length === 0) {
        throw new Error('Failed to update category');
    }

    return result.rows[0].category_id;
};

/* =========================
   MANY-TO-MANY HELPERS
========================= */

/* Assign one category to a project */
const assignCategoryToProject = async (projectId, categoryId) => {

    const query = `
        INSERT INTO project_category (project_id, category_id)
        VALUES ($1, $2);
    `;

    await db.query(query, [projectId, categoryId]);
};

/* Update all category assignments for a project */
const updateCategoryAssignments = async (projectId, categoryIds) => {

    const deleteQuery = `
        DELETE FROM project_category
        WHERE project_id = $1;
    `;

    await db.query(deleteQuery, [projectId]);

    if (Array.isArray(categoryIds)) {

        for (const categoryId of categoryIds) {
            await assignCategoryToProject(projectId, categoryId);
        }

    } else if (categoryIds) {

        await assignCategoryToProject(projectId, categoryIds);
    }
};

/* =========================
   EXPORTS
========================= */
export {
    getAllCategories,
    getCategoryById,
    getProjectsByCategoryId,
    getCategoriesByProjectId,
    createCategory,
    updateCategory,
    updateCategoryAssignments
};