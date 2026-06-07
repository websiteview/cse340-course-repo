import express from 'express';

console.log('🔥 ROUTES.JS IS LOADED');

import { showHomePage } from './controllers/index.js';

import {
    showUserRegistrationForm,
    processUserRegistrationForm,
    showLoginForm,
    processLoginForm,
    processLogout,
    requireLogin,
    requireRole,
    showDashboard,
    showUsersPage
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
    showEditProjectForm,
    processEditProjectForm,
    projectValidation
} from './controllers/projects.js';

import {
    showCategoriesPage,
    showCategoryDetailsPage,
    showAssignCategoriesForm,
    processAssignCategoriesForm,
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
DASHBOARD (PROTECTED)
========================= */

router.get(
    '/dashboard',
    requireLogin,
    showDashboard
);

/* =========================
ORGANIZATIONS
========================= */

router.get(
    '/organizations',
    showOrganizationsPage
);

router.get(
    '/organization/:id',
    showOrganizationDetailsPage
);

/* =========================
NEW ORGANIZATION
ADMIN ONLY
========================= */

router.get(
    '/new-organization',
    requireRole('admin'),
    showNewOrganizationForm
);

router.post(
    '/new-organization',
    requireRole('admin'),
    organizationValidation,
    processNewOrganizationForm
);

/* =========================
EDIT ORGANIZATION
ADMIN ONLY
========================= */

router.get(
    '/edit-organization/:id',
    requireRole('admin'),
    showEditOrganizationForm
);

router.post(
    '/edit-organization/:id',
    requireRole('admin'),
    organizationValidation,
    processEditOrganizationForm
);

/* =========================
PROJECTS
========================= */

router.get(
    '/projects',
    showProjectsPage
);

router.get(
    '/project/:id',
    showProjectDetailsPage
);

/* =========================
NEW PROJECT
ADMIN ONLY
========================= */

router.get(
    '/new-project',
    requireRole('admin'),
    showNewProjectForm
);

router.post(
    '/new-project',
    requireRole('admin'),
    projectValidation,
    processNewProjectForm
);

/* =========================
EDIT PROJECT
ADMIN ONLY
========================= */

router.get(
    '/edit-project/:id',
    requireRole('admin'),
    showEditProjectForm
);

router.post(
    '/edit-project/:id',
    requireRole('admin'),
    projectValidation,
    processEditProjectForm
);

/* =========================
ASSIGN CATEGORIES
ADMIN ONLY
========================= */

router.get(
    '/project/:projectId/assign-categories',
    requireRole('admin'),
    showAssignCategoriesForm
);

router.post(
    '/project/:projectId/assign-categories',
    requireRole('admin'),
    processAssignCategoriesForm
);

/* =========================
CATEGORIES
========================= */

router.get(
    '/categories',
    showCategoriesPage
);

router.get(
    '/category/:id',
    showCategoryDetailsPage
);

/* =========================
NEW CATEGORY
ADMIN ONLY
========================= */

router.get(
    '/new-category',
    requireRole('admin'),
    showNewCategoryForm
);

router.post(
    '/new-category',
    requireRole('admin'),
    categoryValidation,
    processNewCategoryForm
);

/* =========================
EDIT CATEGORY
ADMIN ONLY
========================= */

router.get(
    '/edit-category/:id',
    requireRole('admin'),
    showEditCategoryForm
);

router.post(
    '/edit-category/:id',
    requireRole('admin'),
    categoryValidation,
    processEditCategoryForm
);

/* =========================
USERS LIST
ADMIN ONLY
========================= */

router.get(
    '/users',
    requireRole('admin'),
    showUsersPage
);

/* =========================
ERROR TEST ROUTE
========================= */

router.get(
    '/test-error',
    testErrorPage
);

export default router;