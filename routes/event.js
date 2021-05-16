let express = require('express');
let router = express.Router();
const pool = require('../utils/pool');

/**
 * @swagger
 * tags:
 *   name: event
 *   description: 이벤트
 */
/**
 * @swagger
 * /event :
 *   get:
 *     summary: 전체 이벤트 조회
 *     tags: [event]
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
        const data = await pool.query('select eventSeq,title,content,image,date_format(start_date,\'%Y-%m-%d\') as start_date,date_format(end_date,\'%Y-%m-%d\')as end_date from Event');
        return res.json(data[0]);
    } catch (err) {
        return res.status(400).json(err);
    }
});
/**
 * @swagger
 * /event/{eventSeq}:
 *   get:
 *     summary: 이벤트 상세 조회
 *     tags: [event]
 *     parameters:
 *       - in: path
 *         name: eventSeq
 *         required: true
 *         type: int
 *         description: 이벤트 Seq 정보
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
router.get('/:eventSeq', async (req, res) => {
    try {
        let eventSeq = req.params.eventSeq;
        console.log(eventSeq)
        const data=await pool.query('select * from Event where eventSeq =?',eventSeq);
        return res.json(data[0]);
    }catch (err) {
        return res.status(400).json(err);
    }
});

/**
 * @swagger
 * /event/add:
 *   post:
 *     summary: 이벤트 추가
 *     tags: [event]
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
            const data = await pool.query('INSERT INTO Event SET ?', {title,content,image,start_date,end_date})
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
 * /event/re/{eventSeq}:
 *   post:
 *     summary: 이벤트 수정하기
 *     tags: [event]
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
 *         name: eventSeq
 *         required: true
 *         type: int
 *         description: 이벤트 Seq 정보
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
router.post("/re/:eventSeq", async (req, res) => {
    if(req.userInfo){
        try {
            let eventSeq = req.params.eventSeq;
            console.log(eventSeq);
            const {title,content,image,start_date,end_date} = req.body;
            const result = await pool.query('UPDATE Event SET title=?,content=?,image=?,start_date=?,end_date=? WHERE eventSeq=?', [title,content,image,start_date,end_date,eventSeq]);
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
 * /event/ki/{eventSeq}:
 *   delete:
 *     summary: 상품 삭제
 *     tags: [event]
 *     parameters:
 *       - in: header
 *         name: x-access-token
 *         type: string
 *         format: uuid
 *         required: true
 *       - in: path
 *         name: eventSeq
 *         required: true
 *         type: int
 *         description: 이벤트 Seq 정보
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
router.delete('/ki/:eventSeq', async (req, res) => {
    if(req.userInfo){
        try {
            let eventSeq = req.params.eventSeq;
            const result = await pool.query('delete from Event WHERE eventSeq=?',eventSeq);
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