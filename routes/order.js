let express = require('express');
let router = express.Router();
const pool = require('../utils/pool');

/**
 * @swagger
 * tags:
 *   name: order
 *   description: 주문내역
 */
/**
 * @swagger
 * /order :
 *   get:
 *     summary: 주문내역 조회
 *     tags: [order]
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
            const data = await pool.query('select * from order where userSeq=?',userSeq);
            return res.json(data[0]);
        }catch (err) {
            return res.status(400).json(err);
        }
    }
});

/**
 * @swagger
 * /order/add/{productSeq}:
 *   post:
 *     summary: 주문내역 추가
 *     tags: [order]
 *     consumes:
 *       - application/x-www-form-urlencoded
 *     requestBody:
 *       content:
 *          application/x-www-form-urlencoded:
 *              schema:
 *                  type: object
 *                  properties:
 *                      count:
 *                          type: int
 *                          description: 상품 수량
 *     parameters:
 *       - in: header
 *         name: x-access-token
 *         type: string
 *         format: uuid
 *         required: true
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
router.post('/add/:productSeq', async (req, res) => {
    if(req.userInfo){
        try {
            const {productSeq}=req.params
            const {count}=req.body;
            const productData = await pool.query('select image,title,price from Product where productSeq=?',[productSeq])
            console.log(productData[0][0]);
            let image = productData[0][0].image
            let title = productData[0][0].title
            let price = productData[0][0].price
            let userSeq = req.userInfo.userSeq;
            const data = await pool.query('INSERT INTO order SET ?', {productSeq,userSeq,image,title,price,count})
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
 * /order/re/{orderSeq}:
 *   post:
 *     summary: 주문내역 수정하기
 *     tags: [order]
 *     consumes:
 *       - application/x-www-form-urlencoded
 *     requestBody:
 *       content:
 *          application/x-www-form-urlencoded:
 *              schema:
 *                  type: object
 *                  properties:
 *                      count:
 *                          type: int
 *     parameters:
 *       - in: header
 *         name: x-access-token
 *         type: string
 *         format: uuid
 *         required: true
 *       - in: path
 *         name: orderSeq
 *         required: true
 *         type: int
 *         description: 주문내역 Seq 정보
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
router.post("/re/:orderSeq", async (req, res) => {
    if(req.userInfo){
        try {
            let orderSeq = req.params.orderSeq;
            const {count} = req.body;
            const result = await pool.query('UPDATE order SET count=? WHERE orderSeq=?', [count,orderSeq]);
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
 * /order/ki/{orderSeq}:
 *   delete:
 *     summary: 주문내역 상품 삭제
 *     tags: [order]
 *     parameters:
 *       - in: header
 *         name: x-access-token
 *         type: string
 *         format: uuid
 *         required: true
 *       - in: path
 *         name: orderSeq
 *         required: true
 *         type: int
 *         description: 주문내역 Seq 정보
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
router.delete('/ki/:orderSeq', async (req, res) => {
    if(req.userInfo){
        try {
            let orderSeq = req.params.orderSeq;
            const result = await pool.query('delete from order WHERE orderSeq=?',orderSeq);
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