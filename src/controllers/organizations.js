import { 
    getAllOrganizations,
    getOrganizationDetails,
    createOrganization,
    updateOrganization
} from '../models/organizations.js';

import {
    getProjectsByOrganizationId
} from '../models/projects.js';

import {
    body,
    validationResult
} from 'express-validator';

/* =========================
   VALIDATION RULES
========================= */
const organizationValidation = [
    body('name')
        .trim()
        .notEmpty()
        .withMessage('Organization name is required')
        .isLength({ min: 3, max: 150 })
        .withMessage('Organization name must be between 3 and 150 characters'),

    body('description')
        .trim()
        .notEmpty()
        .withMessage('Organization description is required')
        .isLength({ max: 500 })
        .withMessage('Organization description cannot exceed 500 characters'),

    body('contactEmail')
        .trim()
        .normalizeEmail()
        .notEmpty()
        .withMessage('Contact email is required')
        .isEmail()
        .withMessage('Please provide a valid email address')
];

/* =========================
   SHOW ALL ORGANIZATIONS
========================= */
const showOrganizationsPage = async (req, res) => {

    const organizations = await getAllOrganizations();

    const title = 'Our Partner Organizations';

    res.render('organizations', {
        title,
        organizations
    });
};

/* =========================
   SHOW ORGANIZATION DETAILS
========================= */
const showOrganizationDetailsPage = async (req, res) => {

    const organizationId = req.params.id;

    const organizationDetails =
        await getOrganizationDetails(organizationId);

    const projects =
        await getProjectsByOrganizationId(organizationId);

    const title = 'Organization Details';

    res.render('organization', {
        title,
        organization: organizationDetails,
        projects
    });
};

/* =========================
   SHOW EDIT FORM (STEP 2)
========================= */
const showEditOrganizationForm = async (req, res) => {

    const organizationId = req.params.id;

    const organizationDetails = await getOrganizationDetails(organizationId);

    if (!organizationDetails) {
        req.flash('error', 'Organization not found');
        return res.redirect('/organizations');
    }

    const title = 'Edit Organization';

    res.render('edit-organization', {
        title,
        organization: organizationDetails
    });
};

/* =========================
   PROCESS EDIT FORM (STEP 3 - REQUIRED)
========================= */
const processEditOrganizationForm = async (req, res) => {

    const organizationId = req.params.id;

    const results = validationResult(req);

    if (!results.isEmpty()) {

        results.array().forEach((error) => {
            req.flash('error', error.msg);
        });

        return res.redirect(`/edit-organization/${organizationId}`);
    }

    try {

        const { name, description, contactEmail, logoFilename } = req.body;

        await updateOrganization(
            organizationId,
            name,
            description,
            contactEmail,
            logoFilename || 'placeholder-logo.png'
        );

        req.flash('success', 'Organization updated successfully!');

        return res.redirect(`/organization/${organizationId}`);

    } catch (error) {

        console.error('UPDATE ORGANIZATION ERROR:', error);

        req.flash('error', 'Error updating organization');

        return res.redirect(`/edit-organization/${organizationId}`);
    }
};

/* =========================
   NEW ORGANIZATION FORM
========================= */
const showNewOrganizationForm = async (req, res) => {

    const title = 'Add New Organization';

    res.render('new-organization', { title });
};

/* =========================
   PROCESS NEW ORGANIZATION FORM
========================= */
const processNewOrganizationForm = async (req, res) => {

    const results = validationResult(req);

    if (!results.isEmpty()) {

        results.array().forEach((error) => {
            req.flash('error', error.msg);
        });

        return res.redirect('/new-organization');
    }

    try {

        const { name, description, contactEmail } = req.body;

        const logoFilename = 'placeholder-logo.png';

        const organizationId = await createOrganization(
            name,
            description,
            contactEmail,
            logoFilename
        );

        req.flash('success', 'Organization added successfully!');

        return res.redirect(`/organization/${organizationId}`);

    } catch (error) {

        console.error('CREATE ORGANIZATION ERROR:', error);

        req.flash('error', 'Error creating organization');

        return res.redirect('/new-organization');
    }
};

/* =========================
   EXPORTS
========================= */
export {
    showOrganizationsPage,
    showOrganizationDetailsPage,
    showNewOrganizationForm,
    showEditOrganizationForm,
    processNewOrganizationForm,
    processEditOrganizationForm,
    organizationValidation
};