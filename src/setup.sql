CREATE TABLE organization (
    organization_id SERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    description TEXT NOT NULL,
    contact_email VARCHAR(255) NOT NULL,
    logo_filename VARCHAR(255) NOT NULL
);

INSERT INTO organization 
(name, description, contact_email, logo_filename)
VALUES
(
    'BrightFuture Builders',
    'A nonprofit focused on improving community infrastructure through sustainable construction projects.',
    'info@brightfuturebuilders.org',
    'brightfuture-logo.png'
),
(
    'GreenHarvest Growers',
    'An urban farming collective promoting food sustainability and education in local neighborhoods.',
    'contact@greenharvest.org',
    'greenharvest-logo.png'
),
(
    'UnityServe Volunteers',
    'A volunteer coordination group supporting local charities and service initiatives.',
    'hello@unityserve.org',
    'unityserve-logo.png'
);

/* =========================
   PROJECT TABLE
========================= */

CREATE TABLE project (
    project_id SERIAL PRIMARY KEY,

    organization_id INT NOT NULL,

    title VARCHAR(150) NOT NULL,

    description TEXT NOT NULL,

    location VARCHAR(150) NOT NULL,

    project_date DATE NOT NULL,

    CONSTRAINT fk_organization
        FOREIGN KEY (organization_id)
        REFERENCES organization(organization_id)
);

/* =========================
   SAMPLE PROJECT DATA
========================= */

INSERT INTO project
(
    organization_id,
    title,
    description,
    location,
    project_date
)
VALUES
(
    1,
    'Community Playground Build',
    'Building a safe playground for children.',
    'Boise, Idaho',
    '2026-06-10'
),
(
    1,
    'Neighborhood Cleanup',
    'Cleaning parks and sidewalks.',
    'Rexburg, Idaho',
    '2026-06-15'
),
(
    2,
    'Urban Garden Expansion',
    'Expanding community food gardens.',
    'Idaho Falls, Idaho',
    '2026-07-01'
),
(
    2,
    'Sustainability Workshop',
    'Teaching sustainable farming methods.',
    'Pocatello, Idaho',
    '2026-07-10'
),
(
    3,
    'Food Drive',
    'Collecting canned food donations.',
    'Twin Falls, Idaho',
    '2026-08-01'
),
(
    3,
    'Volunteer Training',
    'Training new community volunteers.',
    'Boise, Idaho',
    '2026-08-12'
);

/* =========================
   CATEGORY TABLE
========================= */

CREATE TABLE category (
    category_id SERIAL PRIMARY KEY,

    name VARCHAR(100) NOT NULL UNIQUE
);

/* =========================
   PROJECT CATEGORY JUNCTION TABLE
========================= */

CREATE TABLE project_category (
    project_id INT NOT NULL,

    category_id INT NOT NULL,

    PRIMARY KEY (project_id, category_id),

    CONSTRAINT fk_project
        FOREIGN KEY (project_id)
        REFERENCES project(project_id),

    CONSTRAINT fk_category
        FOREIGN KEY (category_id)
        REFERENCES category(category_id)
);

/* =========================
   SAMPLE CATEGORY DATA
========================= */

INSERT INTO category (name)
VALUES
('Community Service'),
('Environmental Sustainability'),
('Volunteer Training');

/* =========================
   PROJECT CATEGORY RELATIONSHIPS
========================= */

INSERT INTO project_category
(project_id, category_id)
VALUES
(1, 1),
(2, 1),
(3, 2),
(4, 2),
(5, 1),
(6, 3);