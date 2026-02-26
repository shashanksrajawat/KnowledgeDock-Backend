const Article = require('../models/Article');
const aiService = require('../services/aiService');

const getArticles = async (req, res, next) => {
    try {
        const filters = {
            search: req.query.search,
            category: req.query.category
        };
        const articles = await Article.findAll(filters);
        res.status(200).json({ success: true, articles });
    } catch (error) {
        next(error);
    }
};

const getArticleById = async (req, res, next) => {
    try {
        const article = await Article.findById(req.params.id);
        if (!article) {
            return res.status(404).json({ success: false, message: 'Article not found' });
        }
        res.status(200).json({ success: true, article });
    } catch (error) {
        next(error);
    }
};

const createArticle = async (req, res, next) => {
    try {
        const { title, content, summary, category, tags } = req.body;

        if (!title || !content) {
            return res.status(400).json({ success: false, message: 'Title and content are required' });
        }

        const articleId = await Article.create(
            { title, content, summary, category, tags },
            req.user.id
        );

        res.status(201).json({ success: true, message: 'Article created', articleId });
    } catch (error) {
        next(error);
    }
};

const updateArticle = async (req, res, next) => {
    try {
        const article = await Article.findById(req.params.id);
        if (!article) {
            return res.status(404).json({ success: false, message: 'Article not found' });
        }

        if (article.author_id !== req.user.id) {
            return res.status(403).json({ success: false, message: 'Not authorized to edit this article' });
        }

        await Article.update(req.params.id, req.body);
        res.status(200).json({ success: true, message: 'Article updated' });
    } catch (error) {
        next(error);
    }
};

const deleteArticle = async (req, res, next) => {
    try {
        const article = await Article.findById(req.params.id);
        if (!article) {
            return res.status(404).json({ success: false, message: 'Article not found' });
        }

        if (article.author_id !== req.user.id) {
            return res.status(403).json({ success: false, message: 'Not authorized to delete this article' });
        }

        await Article.delete(req.params.id);
        res.status(200).json({ success: true, message: 'Article deleted' });
    } catch (error) {
        next(error);
    }
};

const processAI = async (req, res, next) => {
    try {
        const { action, content } = req.body;
        if (!content) return res.status(400).json({ success: false, message: 'Content is required' });

        let result;
        if (action === 'improve') {
            result = await aiService.improveContent(content);
        } else if (action === 'summary') {
            result = await aiService.generateSummary(content);
        } else if (action === 'tags') {
            result = await aiService.suggestTags(content);
        } else {
            return res.status(400).json({ success: false, message: 'Invalid action' });
        }

        res.status(200).json({ success: true, result });
    } catch (error) {
        next(error);
    }
};

module.exports = { getArticles, getArticleById, createArticle, updateArticle, deleteArticle, processAI };
