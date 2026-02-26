const pool = require('../config/db');

const User = {
    create: async (username, email, hashedPassword) => {
        const [result] = await pool.query(
            'INSERT INTO Users (username, email, password) VALUES (?, ?, ?)',
            [username, email, hashedPassword]
        );
        return result.insertId;
    },

    findByEmail: async (email) => {
        const [rows] = await pool.query('SELECT * FROM Users WHERE email = ?', [email]);
        return rows[0];
    },

    findById: async (id) => {
        const [rows] = await pool.query('SELECT id, username, email, created_at FROM Users WHERE id = ?', [id]);
        return rows[0];
    }
};

module.exports = User;
