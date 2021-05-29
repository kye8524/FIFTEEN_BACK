let express = require('express');
let router = express.Router();
const pool = require('../utils/pool');
const moment = require('moment');

const d = new Date();
const f = 'YYYY-MM-DD';
/**
 * @swagger
 * tags:
 *   name: qna
 *   description: 문의
 */
/**
 * @swagger
 * /qna :
 *   get:
 *     summary: 전체 문의 조회
 *     tags: [qna]
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
        const data = await pool.query("select qnaSeq,title,content,userSeq,productSeq,answer,answer_state,product_title,count,orderSeq,date_format(regdate,'%Y-%m-%d')as readate from QnA");
        return res.json(data[0]);
    } catch (err) {
        return res.status(400).json(err);
    }
});
/**
 * @swagger
 * /qna/{productSeq}:
 *   get:
 *     summary: 상품별 문의 조회
 *     tags: [qna]
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
        const data=await pool.query('select qnaSeq,title,content,userSeq,productSeq,answer,answer_state,product_title,count,orderSeq,date_format(regdate,\'%Y-%m-%d\')as readate from QnA where productSeq =?',productSeq);
        return res.json(data[0]);
    }catch (err) {
        return res.status(400).json(err);
    }
});
/**
 * @swagger
 * /qna/detail/{qnaSeq}:
 *   get:
 *     summary: 문의 상세 조회
 *     tags: [qna]
 *     parameters:
 *       - in: path
 *         name: qnaSeq
 *         required: true
 *         type: int
 *         description: 문의 Seq 정보
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
router.get('/detail/:qnaSeq', async (req, res) => {
    try {
        let qnaSeq = req.params.qnaSeq;
        console.log(qnaSeq)
        const data=await pool.query('select qnaSeq,title,content,userSeq,productSeq,answer,answer_state,product_title,count,orderSeq,date_format(regdate,\'%Y-%m-%d\')as readate from QnA where qnaSeq =?',qnaSeq);
        return res.json(data[0]);
    }catch (err) {
        return res.status(400).json(err);
    }
});

/**
 * @swagger
 * /qna/add/question:
 *   post:
 *     summary: 문의 추가
 *     tags: [qna]
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
 *                      productSeq:
 *                          type: int
 *
 *              required:
 *                  - title
 *                  - content
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
router.post('/add/question', async (req, res,next) => {
    if(req.userInfo){
        try {
            const userSeq = req.userInfo.userSeq;
            const regdate = moment(d).format(f);
            console.log(regdate);
            const {title,content,productSeq} = req.body;
            const orderData = await pool.query('select * from Orders where userSeq=? AND productSeq=?',[userSeq,productSeq]);
            if(orderData[0][0]){
                const orderSeq = orderData[0][0].orderSeq;
                const count = orderData[0][0].count;
                const product_title = orderData[0][0].title;
                const data = await pool.query('INSERT INTO QnA SET ?', {title,content,regdate,userSeq,productSeq,orderSeq,product_title,count});
                return res.json(data[0]);
            }else{
                const data = await pool.query('INSERT INTO QnA SET ?', {title,content,regdate,userSeq,productSeq});
                return res.json(data[0]);
            }
        } catch (err) {
            return res.status(400).json(err);
        }
    }else {
        console.log('cookie none');
        res.status(403).send({msg: "권한이 없습니다."});
    }
});
/**
 * @swagger
 * /qna/add/answer/{qnaSeq}:
 *   post:
 *     summary: 답변 추가
 *     tags: [qna]
 *     consumes:
 *       - application/x-www-form-urlencoded
 *     requestBody:
 *       content:
 *          application/x-www-form-urlencoded:
 *              schema:
 *                  type: object
 *                  properties:
 *                      answer:
 *                          type: varchar(200)
 *
 *              required:
 *                  - answer
 *     parameters:
 *       - in: header
 *         name: x-access-token
 *         type: string
 *         format: uuid
 *         required: true
 *       - in: path
 *         name: qnaSeq
 *         required: true
 *         type: int
 *         description: 문의 Seq 정보
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
router.post('/add/answer/:qnaSeq', async (req, res,next) => {
    if(req.userInfo){
        try {
            let qnaSeq = req.params.qnaSeq;
            const {answer} = req.body;
            const answer_state =1;
            const data = await pool.query('update QnA set answer_state=?,answer=? where qnaSeq=?', [answer_state,answer,qnaSeq]);
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