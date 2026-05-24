import {
    getAllOrganizations,
    getOrganizationDetails
} from '../models/organizations.js';

import {
    getProjectsByOrganizationId
} from '../models/projects.js';

/* Show all organizations */
const showOrganizationsPage = async (req, res) => {

    const organizations = await getAllOrganizations();

    const title = 'Our Partner Organizations';

    res.render('organizations', {
        title,
        organizations
    });

};

/* Show single organization details */
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

export {
    showOrganizationsPage,
    showOrganizationDetailsPage
};