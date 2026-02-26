const express = require('express');
const { getArticles, getArticleById, createArticle, updateArticle, deleteArticle, processAI } = require('../controllers/articleController');
const auth = require('../middleware/auth');

const router = express.Router();

router.get('/', getArticles);
router.get('/:id', getArticleById);
router.post('/', auth, createArticle);
router.put('/:id', auth, updateArticle);
router.delete('/:id', auth, deleteArticle);

router.post('/ai', auth, processAI);

module.exports = router;
