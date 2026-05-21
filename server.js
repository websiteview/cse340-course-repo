import 'dotenv/config';

import express from 'express';
import { fileURLToPath } from 'url';
import path from 'path';

import { testConnection } from './src/models/db.js';
import router from './src/routes.js';

const NODE_ENV = process.env.NODE_ENV?.toLowerCase() || 'production';
const PORT = process.env.PORT || 3000;

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
   MIDDLEWARE
========================= */

/* Middleware to log all incoming requests */
app.use((req, res, next) => {

    if (NODE_ENV === 'development') {

        console.log(`${req.method} ${req.url}`);

    }

    next();

});

/* Middleware to make NODE_ENV available to all templates */
app.use((req, res, next) => {

    res.locals.NODE_ENV = NODE_ENV;

    next();

});

/* =========================
   ROUTES
========================= */

/* Use imported router */
app.use(router);

/* =========================
   404 ERROR HANDLER
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

    const template = status === 404
        ? '404'
        : '500';

    const context = {

        title: status === 404
            ? 'Page Not Found'
            : 'Server Error',

        error: err.message,

        stack: err.stack

    };

    res
        .status(status)
        .render(`errors/${template}`, context);

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