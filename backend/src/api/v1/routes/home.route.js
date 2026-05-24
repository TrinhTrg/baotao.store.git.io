const express = require('express');
const router = express.Router();

const controller = require('../controllers/home.controller.js');

/**
 * @swagger
 * /api/v1/:
 *   get:
 *     summary: Get home page products
 *     tags:
 *       - Home
 *     responses:
 *       200:
 *         description: Home page products
 */
// router.get('/', controller.getHomeProducts);
router.get('/', (req, res) => {
    res.send("lz huy")
});

module.exports = router;