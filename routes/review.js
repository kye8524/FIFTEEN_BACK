let express = require('express');
let router = express.Router();
const pool = require('../utils/pool');
const moment = require('moment');

const d = new Date();
const f = 'YYYY-MM-DD';
/**
 * @swagger
 * tags:
 *   name: review
 *   description: 리뷰
 */
/**
 * @swagger
 * /review :
 *   get:
 *     summary: 전체 리뷰 조회
 *     tags: [review]
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
        const data = await pool.query("select reviewSeq,title,content,userSeq,productSeq,score,delivery,recommend,date_format(regdate,'%Y-%m-%d')as readate from Review");
        return res.json(data[0]);
    } catch (err) {
        return res.status(400).json(err);
    }
});
/**
 * @swagger
 * /review/{productSeq}:
 *   get:
 *     summary: 상품별 리뷰 조회
 *     tags: [review]
 *     parameters:
 *       - in: path
 *         name: productSeq
 *         required: true
 *         type: int
 *         description: 상품 Seq 정보
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
router.get('/:productSeq', async (req, res) => {
    try {
        let productSeq = req.params.productSeq;
        const data=await pool.query('select reviewSeq,title,content,userSeq,productSeq,score,delivery,recommend,date_format(regdate,\'%Y-%m-%d\')as readate from Review where productSeq =?',productSeq);
        return res.json(data[0]);
    }catch (err) {
        return res.status(400).json(err);
    }
});
/**
 * @swagger
 * /review/detail/{reviewSeq}:
 *   get:
 *     summary: 리뷰 상세 조회
 *     tags: [review]
 *     parameters:
 *       - in: path
 *         name: reviewSeq
 *         required: true
 *         type: int
 *         description: 리뷰 Seq 정보
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
router.get('/detail/:reviewSeq', async (req, res) => {
    try {
        let reviewSeq = req.params.reviewSeq;
        console.log(reviewSeq)
        const data=await pool.query('select reviewSeq,title,content,userSeq,productSeq,score,delivery,recommend,date_format(regdate,\'%Y-%m-%d\')as readate from Review where reviewSeq =?',reviewSeq);
        return res.json(data[0]);
    }catch (err) {
        return res.status(400).json(err);
    }
});

/**
 * @swagger
 * /review/add:
 *   post:
 *     summary: 리뷰 추가
 *     tags: [review]
 *     consumes:
 *       - application/x-www-form-urlencoded
 *     requestBody:
 *       content:
 *          application/x-www-form-urlencoded:
 *              schema:
 *                  type: object
 *                  properties:
 *                      title:
 *                          type: varchar(45)
 *                      content:
 *                          type: mediumtext
 *                      score:
 *                          type: int
 *                          description: 별점(1~5)
 *                      delivery:
 *                          type: varchar(45)
 *                          description: 배송(빠름,보통,느림)
 *                      recommend:
 *                          type: varchar(45)
 *                          description: 추천(적극,추천,비추천)
 *                      productSeq:
 *                          type: int
 *              required:
 *                  - title
 *                  - content
 *                  - score
 *                  - delivery
 *                  - recommend
 *                  - productSeq
 *     parameters:
 *       - in: header
 *         name: x-access-token
 *         type: string
 *         format: uuid
 *         required: true
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
router.post('/add', async (req, res,next) => {
    if(req.userInfo){
        try {
            const userSeq = req.userInfo.userSeq;
            const regdate = moment(d).format(f);
            console.log(regdate);
            const {title,content,score,delivery,recommend,productSeq} = req.body;
            const data = await pool.query('INSERT INTO Review SET ?', {title,content,regdate,userSeq,productSeq,score,delivery,recommend})
            return res.json(data[0]);
        } catch (err) {
            return res.status(400).json(err);
        }
    }else {
    console.log('cookie none');
    res.status(403).send({msg: "권한이 없습니다."});
}
});
module.exports = router;