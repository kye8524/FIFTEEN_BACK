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
        const data = await pool.query('select eventSeq,title,content,image,date_format(start_date,\'%Y-%m-%d\') as start_date,date_format(end_date,\'%Y-%m-%d\')as end_date,active from Event');
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
        const data=await pool.query('select eventSeq,title,content,image,date_format(start_date,\'%Y-%m-%d\') as start_date,date_format(end_date,\'%Y-%m-%d\')as end_date,active from Event where eventSeq =?',eventSeq);
        return res.json(data[0]);
    }catch (err) {
        return res.status(400).json(err);
    }
});
/**
 * @swagger
 * /event/banner/active:
 *   get:
 *     summary: 활성화 이벤트 조회
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
router.get('/banner/active', async (req, res) => {
    try {
        const data=await pool.query('select eventSeq,title,content,image,date_format(start_date,\'%Y-%m-%d\') as start_date,date_format(end_date,\'%Y-%m-%d\')as end_date,active from Event where active=1');
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
 *       - multipart/form-data
 *     requestBody:
 *       content:
 *          multipart/form-data:
 *              schema:
 *                  type: object
 *                  properties:
 *                      title:
 *                          type: varchar(45)
 *                      content:
 *                          type: mediumtext
 *                      start_date:
 *                          type: datetime
 *                      end_date:
 *                          type: datetime
 *              required:
 *                  - title
 *                  - content
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
            try {
            const {title,content,start_date,end_date,image} = req.body;
            const data = await pool.query('INSERT INTO Event SET ?', {title,content,start_date,end_date,image})
            return res.json(data[0]);
        } catch (err) {
            return res.status(400).json(err);
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
 *                      start_date:
 *                          type: datetime
 *                      end_date:
 *                          type: datetime
 *              required:
 *                  - title
 *                  - content
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
            const {title,content,start_date,end_date,image} = req.body;
            const result = await pool.query('UPDATE Event SET title=?,content=?,start_date=?,end_date=?,image=? WHERE eventSeq=?', [title,content,start_date,end_date,image,eventSeq]);
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
 * /event/active/{eventSeq}:
 *   post:
 *     summary: 이벤트 활성화 수정
 *     tags: [event]
 *     consumes:
 *       - application/x-www-form-urlencoded
 *     requestBody:
 *       content:
 *          application/x-www-form-urlencoded:
 *              schema:
 *                  type: object
 *                  properties:
 *                      active:
 *                          type: int
 *                          description: 활성화(1)비활성화(0)
 *              required:
 *                  - active
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
router.post("/active/:eventSeq", async (req, res) => {
    if(req.userInfo){
        try {
            let eventSeq = req.params.eventSeq;
            const {active} = req.body;
            const result = await pool.query('UPDATE Event SET active=? WHERE eventSeq=?', [active,eventSeq]);
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