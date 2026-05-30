import {
    getAllOrganizations,
    getOrganizationDetails,
    createOrganization
} from '../models/organizations.js';

import {
    getProjectsByOrganizationId
} from '../models/projects.js';

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
   NEW ORGANIZATION FORM (GET)
========================= */
const showNewOrganizationForm = async (req, res) => {

    const title = 'Add New Organization';

    res.render('new-organization', { title });
};

/* =========================
   PROCESS FORM (POST) + FLASH
========================= */
const processNewOrganizationForm = async (req, res) => {

    try {

        const { name, description, contactEmail } = req.body;

        console.log('FORM DATA:', req.body);

        const logoFilename = 'placeholder-logo.png';

        const organizationId = await createOrganization(
            name,
            description,
            contactEmail,
            logoFilename
        );

        console.log('CREATED ID:', organizationId);

        // 🔥 FLASH MESSAGE (STEP 5)
        req.flash('success', 'Organization added successfully!');

        // 🔥 PRG PATTERN (IMPORTANT FIX)
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
    processNewOrganizationForm
};