import express from 'express';

console.log('🔥 ROUTES.JS IS LOADED');

import { showHomePage } from './controllers/index.js';

import {
    showUserRegistrationForm,
    processUserRegistrationForm,
    showLoginForm,
    processLoginForm,
    processLogout
} from './controllers/users.js';

import {
    showOrganizationsPage,
    showOrganizationDetailsPage,
    showNewOrganizationForm,
    processNewOrganizationForm,
    organizationValidation,
    showEditOrganizationForm,
    processEditOrganizationForm
} from './controllers/organizations.js';

import {
    showProjectsPage,
    showProjectDetailsPage,
    showNewProjectForm,
    processNewProjectForm,
    projectValidation
} from './controllers/projects.js';

import {
    showCategoriesPage,
    showCategoryDetailsPage,
    showAssignCategoriesForm,
    processAssignCategoriesForm,

    // NEW CATEGORY CRUD
    showNewCategoryForm,
    processNewCategoryForm,
    showEditCategoryForm,
    processEditCategoryForm,
    categoryValidation

} from './controllers/categories.js';

import { testErrorPage } from './controllers/errors.js';

const router = express.Router();

/* =========================
   HOME
========================= */

router.get('/', showHomePage);

/* =========================
   USER REGISTRATION
========================= */

router.get(
    '/register',
    showUserRegistrationForm
);

router.post(
    '/register',
    processUserRegistrationForm
);

/* =========================
   USER LOGIN
========================= */

router.get(
    '/login',
    showLoginForm
);

router.post(
    '/login',
    processLoginForm
);

/* =========================
   USER LOGOUT
========================= */

router.get(
    '/logout',
    processLogout
);

/* =========================
   ORGANIZATIONS
========================= */

router.get('/organizations', showOrganizationsPage);

router.get('/organization/:id', showOrganizationDetailsPage);

/* =========================
   NEW ORGANIZATION
========================= */

router.get('/new-organization', showNewOrganizationForm);

router.post(
    '/new-organization',
    organizationValidation,
    processNewOrganizationForm
);

/* =========================
   EDIT ORGANIZATION
========================= */

router.get('/edit-organization/:id', showEditOrganizationForm);

router.post(
    '/edit-organization/:id',
    organizationValidation,
    processEditOrganizationForm
);

/* =========================
   PROJECTS
========================= */

router.get('/projects', showProjectsPage);

router.get('/project/:id', showProjectDetailsPage);

/* =========================
   NEW PROJECT
========================= */

router.get('/new-project', showNewProjectForm);

router.post(
    '/new-project',
    projectValidation,
    processNewProjectForm
);

/* =========================
   ASSIGN CATEGORIES
========================= */

router.get(
    '/project/:projectId/assign-categories',
    showAssignCategoriesForm
);

router.post(
    '/project/:projectId/assign-categories',
    processAssignCategoriesForm
);

/* =========================
   CATEGORIES
========================= */

router.get('/categories', showCategoriesPage);

router.get('/category/:id', showCategoryDetailsPage);

/* =========================
   NEW CATEGORY
========================= */

router.get(
    '/new-category',
    showNewCategoryForm
);

router.post(
    '/new-category',
    categoryValidation,
    processNewCategoryForm
);

/* =========================
   EDIT CATEGORY
========================= */

router.get(
    '/edit-category/:id',
    showEditCategoryForm
);

router.post(
    '/edit-category/:id',
    categoryValidation,
    processEditCategoryForm
);

/* =========================
   ERROR TEST ROUTE
========================= */

router.get('/test-error', testErrorPage);

export default router;