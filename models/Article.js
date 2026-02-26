const pool = require('../config/db');

const Article = {
    create: async (articleData, author_id) => {
        const { title, content, summary, category, tags } = articleData;
        const [result] = await pool.query(
            'INSERT INTO Articles (title, content, summary, category, tags, author_id) VALUES (?, ?, ?, ?, ?, ?)',
            [title, content, summary, category, tags, author_id]
        );
        return result.insertId;
    },

    findAll: async (filters = {}) => {
        let query = `
            SELECT a.id, a.title, a.summary, a.category, a.tags, a.created_at, a.updated_at, a.author_id, u.username as author_name 
            FROM Articles a 
            LEFT JOIN Users u ON a.author_id = u.id
        `;
        const queryParams = [];
        const conditions = [];

        if (filters.search) {
            conditions.push('(a.title LIKE ? OR a.content LIKE ? OR a.tags LIKE ?)');
            const searchTerm = `%${filters.search}%`;
            queryParams.push(searchTerm, searchTerm, searchTerm);
        }

        if (filters.category) {
            conditions.push('a.category = ?');
            queryParams.push(filters.category);
        }

        if (conditions.length > 0) {
            query += ' WHERE ' + conditions.join(' AND ');
        }

        query += ' ORDER BY a.created_at DESC';

        const [rows] = await pool.query(query, queryParams);
        return rows;
    },

    findById: async (id) => {
        const [rows] = await pool.query(`
            SELECT a.*, u.username as author_name 
            FROM Articles a 
            LEFT JOIN Users u ON a.author_id = u.id 
            WHERE a.id = ?
        `, [id]);
        return rows[0];
    },

    update: async (id, articleData) => {
        const { title, content, summary, category, tags } = articleData;
        await pool.query(
            'UPDATE Articles SET title = ?, content = ?, summary = ?, category = ?, tags = ? WHERE id = ?',
            [title, content, summary, category, tags, id]
        );
    },

    delete: async (id) => {
        await pool.query('DELETE FROM Articles WHERE id = ?', [id]);
    }
};

module.exports = Article;
