let express = require('express');
let router = express.Router();
const pool = require('../utils/pool');

/**
 * @swagger
 * tags:
 *   name: delivery
 *   description: 배송지
 */
/**
 * @swagger
 * /delivery :
 *   get:
 *     summary: 배송지 조회
 *     tags: [delivery]
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

router.get('/', async (req, res) => {
    if(req.userInfo){
        let userSeq = req.userInfo.userSeq;
        try{
            const data = await pool.query('select * from Delivery where userSeq=?',userSeq);
            return res.json(data[0]);
        }catch (err) {
            return res.status(400).json(err);
        }
    }
});
/**
 * @swagger
 * /delivery/{delSeq}:
 *   get:
 *     summary: 배송지 상세 조회
 *     tags: [delivery]
 *     parameters:
 *       - in: path
 *         name: delSeq
 *         required: true
 *         type: int
 *         description: 배송지 Seq 정보
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
router.get('/:delSeq', async (req, res) => {
    try {
        let delSeq = req.params.delSeq;
        const data=await pool.query('select * from Delivery where delSeq =?',delSeq);
        return res.json(data[0]);
    }catch (err) {
        return res.status(400).json(err);
    }
});

/**
 * @swagger
 * /delivery/add:
 *   post:
 *     summary: 배송지 추가
 *     tags: [delivery]
 *     consumes:
 *       - application/x-www-form-urlencoded
 *     requestBody:
 *       content:
 *          application/x-www-form-urlencoded:
 *              schema:
 *                  type: object
 *                  properties:
 *                      name:
 *                          type: varchar(45)
 *                          description: 배송지이름
 *                      address:
 *                          type: varchar(200)
 *                          description: 주소(동일로 107길 345)
 *                      address_detail:
 *                          type: varchar(200)
 *                          description: 상세주소(112동405호)
 *                      address_mail:
 *                          type: varchar(50)
 *                          description: 우편번호(01775)
 *                      phoneNum:
 *                          type: varchar(11)
 *                          description: 연락처
 *                      is_default:
 *                          type: int
 *                          description: default=0, 기본배송지=1
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
            const userSeq = req.userInfo.userSeq;
            const {name,address,address_detail,address_mail,phoneNum,is_default}=req.body;
            const data = await pool.query('INSERT INTO Delivery SET ?', {name,address,address_detail,address_mail,phoneNum,is_default,userSeq})
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
 * /delivery/re/{delSeq}:
 *   post:
 *     summary: 배송지 수정
 *     tags: [delivery]
 *     consumes:
 *       - application/x-www-form-urlencoded
 *     requestBody:
 *       content:
 *          application/x-www-form-urlencoded:
 *              schema:
 *                  type: object
 *                  properties:
 *                      name:
 *                          type: varchar(45)
 *                          description: 배송지이름
 *                      address:
 *                          type: varchar(200)
 *                          description: 주소(동일로 107길 345)
 *                      address_detail:
 *                          type: varchar(200)
 *                          description: 상세주소(112동405호)
 *                      address_mail:
 *                          type: varchar(50)
 *                          description: 우편번호(01775)
 *                      phoneNum:
 *                          type: varchar(11)
 *                          description: 연락처
 *                      is_default:
 *                          type: int
 *                          description: default=0, 기본배송지=1
 *     parameters:
 *       - in: header
 *         name: x-access-token
 *         type: string
 *         format: uuid
 *         required: true
 *       - in: path
 *         name: delSeq
 *         required: true
 *         type: int
 *         description: 배송지 Seq 정보
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
router.post("/re/:delSeq", async (req, res) => {
    if(req.userInfo){
        try {
            let delSeq = req.params.delSeq;
            const {name,address,address_detail,address_mail,phoneNum,is_default} = req.body;
            const result = await pool.query('UPDATE Delivery SET name=?,address=?,address_detail=?,address_mail=?,phoneNum=?,is_default=? WHERE delSeq=?', [name,address,address_detail,address_mail,phoneNum,is_default,delSeq]);
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
 * /delivery/ki/{delSeq}:
 *   delete:
 *     summary: 배송지 삭제
 *     tags: [delivery]
 *     parameters:
 *       - in: header
 *         name: x-access-token
 *         type: string
 *         format: uuid
 *         required: true
 *       - in: path
 *         name: delSeq
 *         required: true
 *         type: int
 *         description: 배송지 Seq 정보
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
router.delete('/ki/:delSeq', async (req, res) => {
    if(req.userInfo){
        try {
            let delSeq = req.params.delSeq;
            const result = await pool.query('delete from Delivery WHERE delSeq=?',delSeq);
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