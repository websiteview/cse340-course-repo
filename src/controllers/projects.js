// Import model functions
import {
    getAllProjects,
    getProjectById,
    createProject,
    updateProject
} from '../models/projects.js';

import {
    getCategoriesByProjectId
} from '../models/categories.js';

import {
    getAllOrganizations
} from '../models/organizations.js';

import {
    body,
    validationResult
} from 'express-validator';

/* =========================
   VALIDATION RULES (PROJECTS)
========================= */
const projectValidation = [
    body('title')
        .trim()
        .notEmpty()
        .withMessage('Title is required')
        .isLength({ min: 3, max: 200 })
        .withMessage('Title must be between 3 and 200 characters'),

    body('description')
        .trim()
        .notEmpty()
        .withMessage('Description is required')
        .isLength({ max: 1000 })
        .withMessage('Description cannot exceed 1000 characters'),

    body('location')
        .trim()
        .notEmpty()
        .withMessage('Location is required')
        .isLength({ max: 200 })
        .withMessage('Location cannot exceed 200 characters'),

    body('date')
        .notEmpty()
        .withMessage('Date is required')
        .isISO8601()
        .withMessage('Invalid date format'),

    body('organizationId')
        .notEmpty()
        .withMessage('Organization is required')
        .isInt()
        .withMessage('Organization ID must be a valid integer')
];

/* =========================
   SHOW ALL PROJECTS
========================= */
const showProjectsPage = async (req, res) => {

    const projects = await getAllProjects();

    const title = 'Service Projects';

    res.render('projects', {
        title,
        projects
    });
};

/* =========================
   SHOW PROJECT DETAILS
========================= */
const showProjectDetailsPage = async (req, res) => {

    const projectId = req.params.id;

    const project = await getProjectById(projectId);

    const categories = await getCategoriesByProjectId(projectId);

    const title = project.title;

    res.render('project-details', {
        title,
        project,
        categories
    });
};

/* =========================
   SHOW NEW PROJECT FORM
========================= */
const showNewProjectForm = async (req, res) => {

    const organizations = await getAllOrganizations();

    const title = 'Add New Project';

    res.render('new-project', {
        title,
        organizations
    });
};

/* =========================
   PROCESS NEW PROJECT FORM
========================= */
const processNewProjectForm = async (req, res) => {

    const results = validationResult(req);

    if (!results.isEmpty()) {

        results.array().forEach((error) => {
            req.flash('error', error.msg);
        });

        return res.redirect('/new-project');
    }

    try {

        const {
            title,
            description,
            location,
            date,
            organizationId
        } = req.body;

        await createProject(
            title,
            description,
            location,
            date,
            organizationId
        );

        req.flash('success', 'Project created successfully!');

        return res.redirect('/projects');

    } catch (error) {

        console.error('CREATE PROJECT ERROR:', error);

        req.flash('error', 'Error creating project');

        return res.redirect('/new-project');
    }
};

/* =========================
   SHOW EDIT PROJECT FORM
========================= */
const showEditProjectForm = async (req, res) => {

    const projectId = req.params.id;

    const project = await getProjectById(projectId);

    if (!project) {

        req.flash('error', 'Project not found');

        return res.redirect('/projects');
    }

    const organizations = await getAllOrganizations();

    const title = 'Edit Project';

    res.render('edit-project', {
        title,
        project,
        organizations
    });
};

/* =========================
   PROCESS EDIT PROJECT FORM
========================= */
const processEditProjectForm = async (req, res) => {

    const projectId = req.params.id;

    const results = validationResult(req);

    if (!results.isEmpty()) {

        results.array().forEach((error) => {
            req.flash('error', error.msg);
        });

        return res.redirect(`/edit-project/${projectId}`);
    }

    try {

        const {
            title,
            description,
            location,
            date,
            organizationId
        } = req.body;

        await updateProject(
            projectId,
            title,
            description,
            location,
            date,
            organizationId
        );

        req.flash(
            'success',
            'Project updated successfully!'
        );

        return res.redirect(`/project/${projectId}`);

    } catch (error) {

        console.error(
            'UPDATE PROJECT ERROR:',
            error
        );

        req.flash(
            'error',
            'Error updating project'
        );

        return res.redirect(
            `/edit-project/${projectId}`
        );
    }
};

/* =========================
   EXPORTS
========================= */
export {
    showProjectsPage,
    showProjectDetailsPage,
    showNewProjectForm,
    processNewProjectForm,
    showEditProjectForm,
    processEditProjectForm,
    projectValidation
};