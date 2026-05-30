import express from 'express';

console.log('🔥 ROUTES.JS IS LOADED'); 

import { showHomePage } from './controllers/index.js';

import {
    showOrganizationsPage,
    showOrganizationDetailsPage,
    showNewOrganizationForm,
    processNewOrganizationForm
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

/* =========================
   ORGANIZATIONS
========================= */

router.get('/organizations', showOrganizationsPage);

router.get('/organization/:id', showOrganizationDetailsPage);

/* 🆕 NEW ORGANIZATION FORM (GET) */
router.get('/new-organization', showNewOrganizationForm);


/* 🆕 CREATE ORGANIZATION (POST) */
router.post('/new-organization', processNewOrganizationForm);

router.get('/new-organization', (req, res) => {
    console.log('ROUTE HIT: new-organization');
    res.send('IT WORKS');
});

/* =========================
   PROJECTS
========================= */

router.get('/projects', showProjectsPage);

router.get('/project/:id', showProjectDetailsPage);

/* =========================
   CATEGORIES
========================= */

router.get('/categories', showCategoriesPage);

router.get('/category/:id', showCategoryDetailsPage);

/* =========================
   ERROR TEST ROUTE
========================= */

router.get('/test-error', testErrorPage);

export default router;