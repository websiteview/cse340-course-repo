import express from 'express';

import { showHomePage } from './controllers/index.js';

import {
    showOrganizationsPage,
    showOrganizationDetailsPage
} from './controllers/organizations.js';

import {
    showProjectsPage,
    showProjectDetailsPage
} from './controllers/projects.js';

import {
    showCategoriesPage,
    showCategoryDetailsPage
} from './controllers/categories.js';

import { testErrorPage } from './controllers/errors.js';

const router = express.Router();

/* =========================
   ROUTES
========================= */

/* Home page */
router.get('/', showHomePage);

/* Organizations */
router.get('/organizations', showOrganizationsPage);

/* Single organization details */
router.get('/organization/:id', showOrganizationDetailsPage);

/* Projects */
router.get('/projects', showProjectsPage);

/* Single project details */
router.get('/project/:id', showProjectDetailsPage);

/* Categories */
router.get('/categories', showCategoriesPage);

/* Single category details */
router.get('/category/:id', showCategoryDetailsPage);

/* =========================
   ERROR TEST ROUTE
========================= */

router.get('/test-error', testErrorPage);

export default router;