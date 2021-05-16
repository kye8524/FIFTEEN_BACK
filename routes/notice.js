let express = require('express');
let router = express.Router();
const pool = require('../utils/pool');

/**
 * @swagger
 * tags:
 *   name: notice
 *   description: 공지사항
 */
/**
 * @swagger
 * /notice :
 *   get:
 *     summary: 전체 공지사항 조회
 *     tags: [notice]
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
        const data = await pool.query("select title,content,image,date_format(start_date,'%Y-%m-%d'),date_format(end_date,'%Y-%m-%d') from Notice");
        return res.json(data[0]);
    } catch (err) {
        return res.status(400).json(err);
    }
});
/**
 * @swagger
 * /notice/{noticeSeq}:
 *   get:
 *     summary: 공지사항 상세 조회
 *     tags: [notice]
 *     parameters:
 *       - in: path
 *         name: noticeSeq
 *         required: true
 *         type: int
 *         description: 공지사항 Seq 정보
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
router.get('/:noticeSeq', async (req, res) => {
    try {
        let noticeSeq = req.params.noticeSeq;
        console.log(noticeSeq)
        const data=await pool.query('select * from Notice where noticeSeq =?',noticeSeq);
        return res.json(data[0]);
    }catch (err) {
        return res.status(400).json(err);
    }
});

/**
 * @swagger
 * /notice/add:
 *   post:
 *     summary: 공지사항 추가
 *     tags: [notice]
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
 *                      image:
 *                          type: varchar(300)
 *                      start_date:
 *                          type: datetime
 *                      end_date:
 *                          type: datetime
 *              required:
 *                  - title
 *                  - content
 *                  - image
 *                  - start_date
 *                  - end_date
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
router.post('/add', async (req, res) => {
    if(req.userInfo){
        try {
            const {title,content,image,start_date,end_date} = req.body;
            const data = await pool.query('INSERT INTO Notice SET ?', {title,content,image,start_date,end_date})
            return res.json(data[0]);
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
 * /notice/re/{noticeSeq}:
 *   post:
 *     summary: 공지사항 수정하기
 *     tags: [notice]
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
 *                      image:
 *                          type: varchar(300)
 *                      start_date:
 *                          type: datetime
 *                      end_date:
 *                          type: datetime
 *              required:
 *                  - title
 *                  - content
 *                  - image
 *                  - start_date
 *                  - end_date
 *     parameters:
 *       - in: header
 *         name: x-access-token
 *         type: string
 *         format: uuid
 *         required: true
 *       - in: path
 *         name: noticeSeq
 *         required: true
 *         type: int
 *         description: 공지사항 Seq 정보
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
router.post("/re/:noticeSeq", async (req, res) => {
    if(req.userInfo){
        try {
            let noticeSeq = req.params.noticeSeq;
            console.log(noticeSeq);
            const {title,content,image,start_date,end_date} = req.body;
            const result = await pool.query('UPDATE Notice SET title=?,content=?,image=?,start_date=?,end_date=? WHERE noticeSeq=?', [title,content,image,start_date,end_date,noticeSeq]);
            return res.json(result[0])
        } catch (err) {
            res.status(400).json(err);
        }
    }else {
        console.log('cookie none');
        res.status(403).send({msg: "권한이 없습니다."});
    }
});

/**
 * @swagger
 * /notice/ki/{noticeSeq}:
 *   delete:
 *     summary: 상품 삭제
 *     tags: [notice]
 *     parameters:
 *       - in: header
 *         name: x-access-token
 *         type: string
 *         format: uuid
 *         required: true
 *       - in: path
 *         name: noticeSeq
 *         required: true
 *         type: int
 *         description: 공지사항 Seq 정보
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
router.delete('/ki/:noticeSeq', async (req, res) => {
    if(req.userInfo){
        try {
            let noticeSeq = req.params.noticeSeq;
            const result = await pool.query('delete from Notice WHERE noticeSeq=?',noticeSeq);
            return res.json(result[0])
        } catch (err) {
            res.status(400).json(err);
        }
    }else {
        console.log('cookie none');
        res.status(403).send({msg: "권한이 없습니다."});
    }
});
module.exports = router;