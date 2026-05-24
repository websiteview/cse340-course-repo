// Import model functions

import {
    getAllProjects,
    getProjectById
} from '../models/projects.js';

import {
    getCategoriesByProjectId
} from '../models/categories.js';

// Define controller functions

const showProjectsPage = async (req, res) => {

    const projects = await getAllProjects();

    const title = 'Service Projects';

    res.render('projects', {
        title,
        projects
    });

};

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

// Export controller functions

export {
    showProjectsPage,
    showProjectDetailsPage
};