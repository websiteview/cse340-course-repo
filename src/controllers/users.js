import bcrypt from 'bcrypt';

import {
    createUser,
    authenticateUser,
    getAllUsers
} from '../models/users.js';

import {
    getVolunteerProjects
} from '../models/projects.js';

/* =========================
   REGISTER
========================= */

const showUserRegistrationForm = async (req, res) => {

    res.render('register', {
        title: 'Register'
    });

};

const processUserRegistrationForm = async (req, res) => {

    try {

        const {
            name,
            email,
            password
        } = req.body;

        const passwordHash = await bcrypt.hash(
            password,
            10
        );

        await createUser(
            name,
            email,
            passwordHash
        );

        req.flash(
            'success',
            'Registration successful.'
        );

        res.redirect('/login');

    } catch (error) {

        console.error(error);

        req.flash(
            'error',
            'Unable to create account.'
        );

        res.redirect('/register');
    }
};

/* =========================
   LOGIN
========================= */

const showLoginForm = async (req, res) => {

    res.render('login', {
        title: 'Login'
    });

};

const processLoginForm = async (req, res) => {

    const {
        email,
        password
    } = req.body;

    const user = await authenticateUser(
        email,
        password
    );

    if (user) {

        req.session.user = user;

        req.flash(
            'success',
            'Login successful.'
        );

        console.log(
            'Logged in user:',
            user
        );

        return res.redirect('/dashboard');
    }

    req.flash(
        'error',
        'Invalid email or password.'
    );

    res.redirect('/login');
};

/* =========================
   LOGOUT
========================= */

const processLogout = async (
    req,
    res
) => {

    req.session.destroy(() => {

        res.redirect('/login');

    });

};

/* =========================
   REQUIRE LOGIN
========================= */

const requireLogin = (
    req,
    res,
    next
) => {

    if (!req.session.user) {

        req.flash(
            'error',
            'You must be logged in to access that page.'
        );

        return res.redirect('/login');
    }

    next();
};

/* =========================
   REQUIRE ROLE
========================= */

const requireRole = (
    role
) => {

    return (
        req,
        res,
        next
    ) => {

        if (
            req.session.user &&
            req.session.user.role_name === role
        ) {

            return next();
        }

        req.flash(
            'error',
            'You do not have permission to access that page.'
        );

        return res.redirect('/dashboard');
    };
};

/* =========================
   DASHBOARD
========================= */

const showDashboard = async (
    req,
    res
) => {

    const {
        user_id,
        name,
        email
    } = req.session.user;

    const volunteerProjects =
        await getVolunteerProjects(
            user_id
        );

    res.render(
        'dashboard',
        {
            title: 'Dashboard',
            name,
            email,
            volunteerProjects
        }
    );
};

/* =========================
   USERS PAGE (ADMIN ONLY)
========================= */

const showUsersPage = async (
    req,
    res
) => {

    try {

        const users = await getAllUsers();

        res.render(
            'users',
            {
                title: 'Registered Users',
                users
            }
        );

    } catch (error) {

        console.error(
            'USERS PAGE ERROR:',
            error
        );

        req.flash(
            'error',
            'Unable to load users.'
        );

        return res.redirect(
            '/dashboard'
        );
    }
};

export {
    showUserRegistrationForm,
    processUserRegistrationForm,
    showLoginForm,
    processLoginForm,
    processLogout,
    requireLogin,
    requireRole,
    showDashboard,
    showUsersPage
};