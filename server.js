import express from 'express';
import { fileURLToPath } from 'url';
import path from 'path';

const NODE_ENV = process.env.NODE_ENV?.toLowerCase() || 'production';
const PORT = process.env.PORT || 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

/* Static files */
app.use(express.static(path.join(__dirname, 'public')));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'src/views'));

/* Routes */
app.get('/', (req, res) => {
    res.render('home', { title: 'Home' });
});

app.get('/organizations', (req, res) => {
     res.render('organizations', { title: 'Our Partner Organizations' });
});

app.get('/projects', (req, res) => {
    res.render('projects', { title: 'Upcoming Service Projects' });
});

app.get('/categories', (req, res) => {
    res.render('categories', { title: 'Project Categories' });
});

/* Start server */
app.listen(PORT, () => {
    console.log(`Server running at http://127.0.0.1:${PORT}`);
});