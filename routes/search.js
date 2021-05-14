let express = require('express');
let router = express.Router();
const pool = require('../utils/pool');

/**
 * @swagger
 * tags:
 *   name: search
 *   description: 검색
 */
/**
 * @swagger
 * /search/{keyword}:
 *   get:
 *     summary: 검색하기
 *     tags: [search]
 *     parameters:
 *       - in: path
 *         name: keyword
 *         required: true
 *         type: int
 *         description: 검색 키워드(제목,카테고리,작가,내용,가격)
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
router.get('/:keyword', async (req, res) => {
    try {
        let keyword = req.params.keyword;
        console.log(keyword)
        const data=await pool.query('select * from Product where concat(title,field,author,a_intro,content,price) like ?', '%' + keyword + '%');
        if(data[0]){
            return res.json(data[0]);
        }else{
            return res.json({"message":"검색결과가 없습니다."})
        }
    }catch (err) {
        return res.status(400).json(err);
    }
});

module.exports = router;