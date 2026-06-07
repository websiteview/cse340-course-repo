import 'dotenv/config';

import express from 'express';
import session from 'express-session';
import { fileURLToPath } from 'url';
import path from 'path';

import { testConnection } from './src/models/db.js';
import router from './src/routes.js';
import flash from './src/middleware/flash.js';

const NODE_ENV = process.env.NODE_ENV?.toLowerCase() || 'production';
const PORT = process.env.PORT || 3000;
const SESSION_SECRET = process.env.SESSION_SECRET;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

/* =========================
   STATIC FILES
========================= */
app.use(express.static(path.join(__dirname, 'public')));

/* =========================
   VIEW ENGINE
========================= */
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'src/views'));

/* =========================
   BODY PARSING (FOR FORMS)
========================= */
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

/* =========================
   SESSION MIDDLEWARE
========================= */
app.use(session({
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: false, // 
    cookie: { maxAge: 60 * 60 * 1000 } // 1 hour
}));

/* =========================
   FLASH MIDDLEWARE
========================= */
app.use(flash);

/* =========================
   GLOBAL REQUEST LOGGER
========================= */
app.use((req, res, next) => {
    if (NODE_ENV === 'development') {
        console.log(`${req.method} ${req.url}`);
    }
    next();
});

/* =========================
   TEMPLATE GLOBAL VARIABLES
========================= */
app.use((req, res, next) => {

    res.locals.isLoggedIn = false;
    res.locals.user = null;

    if (
        req.session &&
        req.session.user
    ) {

        res.locals.isLoggedIn = true;

        // Make current user available
        // to all EJS templates
        res.locals.user = req.session.user;
    }

    res.locals.NODE_ENV = NODE_ENV;

    next();
});

/* =========================
   ROUTES
========================= */
app.use(router);

/* =========================
   404 HANDLER
========================= */
app.use((req, res, next) => {
    const err = new Error('Page Not Found');
    err.status = 404;
    next(err);
});

/* =========================
   GLOBAL ERROR HANDLER
========================= */
app.use((err, req, res, next) => {

    console.error('Error occurred:', err.message);
    console.error('Stack trace:', err.stack);

    const status = err.status || 500;

    const template = status === 404 ? '404' : '500';

    const context = {
        title: status === 404 ? 'Page Not Found' : 'Server Error',
        error: err.message,
        stack: err.stack
    };

    res.status(status).render(`errors/${template}`, context);
});

/* =========================
   START SERVER
========================= */
app.listen(PORT, async () => {
    try {
        await testConnection();

        console.log(`Server running at http://127.0.0.1:${PORT}`);
        console.log(`Environment: ${NODE_ENV}`);

    } catch (error) {
        console.error('Error connecting to the database:', error);
    }
});