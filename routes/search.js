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
 *     summary: 상품 검색하기
 *     tags: [search]
 *     parameters:
 *       - in: path
 *         name: keyword
 *         required: true
 *         type: int
 *         description: 검색 키워드(제목,카테고리,작가,가격)
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
        const data=await pool.query('select * from Product where concat(title,field,author,price) like ?', '%' + keyword + '%');
        if(data[0]){
            return res.json(data[0]);
        }else{
            return res.json({"message":"검색결과가 없습니다."})
        }
    }catch (err) {
        return res.status(400).json(err);
    }
});
/**
 * @swagger
 * /search/price/{keyword}:
 *   get:
 *     summary: 상품 가격 검색하기
 *     tags: [search]
 *     parameters:
 *       - in: path
 *         name: keyword
 *         required: true
 *         type: int
 *         description: 검색 키워드(가격)
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
router.get('/price/:keyword', async (req, res) => {
    try {
        let keyword = req.params.keyword;
        const arr = keyword.split("~");
        console.log(arr)
        const data=await pool.query('select * from Product where price between ? and ?', [arr[0],arr[1]]);
        if(data[0]){
            return res.json(data[0]);
        }else{
            return res.json({"message":"검색결과가 없습니다."})
        }
    }catch (err) {
        return res.status(400).json(err);
    }
});
/**
 * @swagger
 * /search/notice/{keyword}:
 *   get:
 *     summary: 공지사항 검색하기
 *     tags: [search]
 *     parameters:
 *       - in: path
 *         name: keyword
 *         required: true
 *         type: int
 *         description: 검색 키워드(제목,내용)
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
router.get('/notice/:keyword', async (req, res) => {
    try {
        let keyword = req.params.keyword;
        console.log(keyword)
        const data=await pool.query('select * from Notice where concat(title,content) like ?', '%' + keyword + '%');
        if(data[0]){
            return res.json(data[0]);
        }else{
            return res.json({"message":"검색결과가 없습니다."})
        }
    }catch (err) {
        return res.status(400).json(err);
    }
});
/**
 * @swagger
 * /search/event/{keyword}:
 *   get:
 *     summary: 이벤트 검색하기
 *     tags: [search]
 *     parameters:
 *       - in: path
 *         name: keyword
 *         required: true
 *         type: int
 *         description: 검색 키워드(제목,내용)
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
router.get('/event/:keyword', async (req, res) => {
    try {
        let keyword = req.params.keyword;
        console.log(keyword)
        const data=await pool.query('select * from Event where concat(title,content) like ?', '%' + keyword + '%');
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