let express = require('express');
let router = express.Router();
const pool = require('../utils/pool');

router.get('/', async (req, res) => {
    try {
        const data = await pool.query('select * from Product');
        return res.json(data[0]);
    } catch (err) {
        return res.status(400).json(err);
    }
});

module.exports = router;