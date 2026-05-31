import {
    getAllCategories,
    getCategoryById,
    getProjectsByCategoryId,
    getCategoriesByProjectId,
    updateCategoryAssignments,
    createCategory,
    updateCategory
} from '../models/categories.js';

import {
    getProjectById
} from '../models/projects.js';

import {
    body,
    validationResult
} from 'express-validator';

/* =========================
   CATEGORY VALIDATION
========================= */
const categoryValidation = [
    body('name')
        .trim()
        .notEmpty()
        .withMessage('Category name is required')
        .isLength({ min: 3, max: 100 })
        .withMessage('Category name must be between 3 and 100 characters')
];

/* =========================
   SHOW CATEGORIES PAGE
========================= */
const showCategoriesPage = async (req, res) => {

    const categories = await getAllCategories();

    const title = 'Service Categories';

    res.render('categories', {
        title,
        categories
    });

};

/* =========================
   SHOW CATEGORY DETAILS PAGE
========================= */
const showCategoryDetailsPage = async (req, res) => {

    const categoryId = req.params.id;

    const category = await getCategoryById(categoryId);

    const projects = await getProjectsByCategoryId(categoryId);

    const title = category.name;

    res.render('category-details', {
        title,
        category,
        projects
    });

};

/* =========================
   NEW CATEGORY FORM
========================= */
const showNewCategoryForm = async (req, res) => {

    const title = 'Add New Category';

    res.render('new-category', {
        title
    });
};

/* =========================
   PROCESS NEW CATEGORY
========================= */
const processNewCategoryForm = async (req, res) => {

    const results = validationResult(req);

    if (!results.isEmpty()) {

        results.array().forEach(error => {
            req.flash('error', error.msg);
        });

        return res.redirect('/new-category');
    }

    try {

        const { name } = req.body;

        const categoryId = await createCategory(name);

        req.flash(
            'success',
            'Category created successfully!'
        );

        return res.redirect(`/category/${categoryId}`);

    } catch (error) {

        console.error(error);

        req.flash(
            'error',
            'Failed to create category'
        );

        return res.redirect('/new-category');
    }
};

/* =========================
   EDIT CATEGORY FORM
========================= */
const showEditCategoryForm = async (req, res) => {

    const categoryId = req.params.id;

    const category = await getCategoryById(categoryId);

    if (!category) {

        req.flash(
            'error',
            'Category not found'
        );

        return res.redirect('/categories');
    }

    const title = 'Edit Category';

    res.render('edit-category', {
        title,
        category
    });
};

/* =========================
   PROCESS EDIT CATEGORY
========================= */
const processEditCategoryForm = async (req, res) => {

    const results = validationResult(req);

    if (!results.isEmpty()) {

        results.array().forEach(error => {
            req.flash('error', error.msg);
        });

        return res.redirect(
            `/edit-category/${req.params.id}`
        );
    }

    try {

        const categoryId = req.params.id;

        const { name } = req.body;

        await updateCategory(
            categoryId,
            name
        );

        req.flash(
            'success',
            'Category updated successfully!'
        );

        return res.redirect(
            `/category/${categoryId}`
        );

    } catch (error) {

        console.error(error);

        req.flash(
            'error',
            'Failed to update category'
        );

        return res.redirect(
            `/edit-category/${req.params.id}`
        );
    }
};

/* =========================
   ASSIGN CATEGORIES FORM
========================= */
const showAssignCategoriesForm = async (req, res) => {

    const projectId = req.params.projectId;

    const project = await getProjectById(projectId);

    const categories = await getAllCategories();

    const assignedCategories =
        await getCategoriesByProjectId(projectId);

    const title = 'Assign Categories to Project';

    res.render('assign-categories', {
        title,
        project,
        categories,
        assignedCategories
    });
};

/* =========================
   PROCESS ASSIGN CATEGORIES
========================= */
const processAssignCategoriesForm = async (req, res) => {

    try {

        const projectId = req.params.projectId;

        const categoryIds = req.body.categories;

        await updateCategoryAssignments(
            projectId,
            categoryIds
        );

        req.flash(
            'success',
            'Categories updated successfully!'
        );

        return res.redirect(
            `/project/${projectId}`
        );

    } catch (error) {

        console.error(
            'Error updating categories:',
            error
        );

        req.flash(
            'error',
            'Failed to update categories'
        );

        return res.redirect(
            `/project/${req.params.projectId}/assign-categories`
        );
    }
};

/* =========================
   EXPORTS
========================= */
export {
    showCategoriesPage,
    showCategoryDetailsPage,

    showNewCategoryForm,
    processNewCategoryForm,

    showEditCategoryForm,
    processEditCategoryForm,

    showAssignCategoriesForm,
    processAssignCategoriesForm,

    categoryValidation
};