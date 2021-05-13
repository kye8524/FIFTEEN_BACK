let express = require('express');
let router = express.Router();
const pool = require('../utils/pool');

/**
 * @swagger
 * tags:
 *   name: product
 *   description: 상품
 */
/**
 * @swagger
 * /product :
 *   get:
 *     summary: 전체 상품 조회
 *     tags: [product]
 *     responses:
 *       200:
 *         description: 성공
 *       403:
 *         $ref: '#/components/res/Forbidden'
 *       404:
 *         $ref: '#/components/res/NotFound'
 *       400:
 *         $ref: '#/components/res/BadRequest'
 */

router.get('/', async (req, res) => {
    try {
        const data = await pool.query('select * from Product');
        return res.json(data[0]);
    } catch (err) {
        return res.status(400).json(err);
    }
});

module.exports = router;