const express = require('express');
const router = express.Router();
const newsController = require('../controllers/newsController');
const authUser = require('../middleware/authUser');

// Middleware simples para garantir que só o CLI acess
const checkAdminAuth = (req, res, next) => {
    const secret = req.headers['x-admin-secret'];
    if (process.env.ADMIN_SECRET && secret !== process.env.ADMIN_SECRET) {
         return res.status(403).json({ message: "Acesso proibido. Rota exclusiva de admin." });
    }
    next();
};

router.post('/publish', checkAdminAuth, newsController.createNews);
router.get('/', authUser, newsController.getMyNews);

module.exports = router;