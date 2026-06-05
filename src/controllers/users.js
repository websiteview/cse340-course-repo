import bcrypt from 'bcrypt';

import {
    createUser,
    authenticateUser
} from '../models/users.js';

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

        return res.redirect('/');
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

export {
    showUserRegistrationForm,
    processUserRegistrationForm,
    showLoginForm,
    processLoginForm,
    processLogout
};