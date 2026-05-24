import express from 'express';

import { showHomePage } from './controllers/index.js';

import {
    showOrganizationsPage,
    showOrganizationDetailsPage
} from './controllers/organizations.js';

import { showProjectsPage } from './controllers/projects.js';

import { showCategoriesPage } from './controllers/categories.js';

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

/* Categories */
router.get('/categories', showCategoriesPage);

/* =========================
   ERROR TEST ROUTE
========================= */

router.get('/test-error', testErrorPage);

export default router;