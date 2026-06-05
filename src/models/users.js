import db from './db.js';
import bcrypt from 'bcrypt';

const createUser = async (name, email, passwordHash) => {
    const sql = `
        INSERT INTO users
        (
            name,
            email,
            password_hash,
            role_id
        )
        VALUES
        (
            $1,
            $2,
            $3,
            1
        )
        RETURNING *;
    `;

    const result = await db.query(
        sql,
        [name, email, passwordHash]
    );

    return result.rows[0];
};

const findUserByEmail = async (email) => {

    const query = `
        SELECT
            user_id,
            name,
            email,
            password_hash,
            role_id
        FROM users
        WHERE email = $1
    `;

    const queryParams = [email];

    const result = await db.query(
        query,
        queryParams
    );

    if (result.rows.length === 0) {
        return null;
    }

    return result.rows[0];
};

const verifyPassword = async (
    password,
    passwordHash
) => {
    return bcrypt.compare(
        password,
        passwordHash
    );
};

const authenticateUser = async (
    email,
    password
) => {

    const user = await findUserByEmail(email);

    if (!user) {
        return null;
    }

    const isValid = await verifyPassword(
        password,
        user.password_hash
    );

    if (!isValid) {
        return null;
    }

    delete user.password_hash;

    return user;
};

export {
    createUser,
    authenticateUser
};