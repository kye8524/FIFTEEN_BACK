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
 * /order/all :
 *   get:
 *     summary: 모든 고객 주문내역 조회
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

router.get('/all', async (req, res) => {
    if(req.userInfo){
        try{
            const data = await pool.query('select orderSeq,date_format(date,\'%Y-%m-%d\') as date, productSeq, count, field,price, pay_price, order_state, userSeq from Orders');
            return res.json(data[0]);
        }catch (err) {
            return res.status(400).json(err);
        }
    }
});
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
            const data = await pool.query('select orderSeq,date_format(date,\'%Y-%m-%d\') as date, delivery, productSeq, count, price, pay_price, order_state, userSeq from Orders where userSeq',userSeq);
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
 *     summary: 주문내역 추가 == 구매하기
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
 *                      date:
 *                          type: datetime
 *                          description: 주문 날짜 2021-02-21
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
            let userSeq = req.userInfo.userSeq;
            const {count,date}=req.body;
            const productData = await pool.query('select image,title,price,field,discount,mileage from Product where productSeq=?',[productSeq])
            let image = productData[0][0].image
            let title = productData[0][0].title
            let price = productData[0][0].price
            let mileage = productData[0][0].mileage
            let field = productData[0][0].field
            let discount = productData[0][0].discount
            let pay_price = price*(100-discount)/100
            const userData = await pool.query('select name from Delivery where userSeq=?',[userSeq])
            let delivery = userData[0][0].name
            const data = await pool.query('INSERT INTO Orders SET ?', {userSeq,productSeq,image,title,count,price,pay_price,delivery,date,field});
            const updateUser = await pool.query('UPDATE UserInfo set totalOder=totalOder+1,mileage=? where userSeq=?',[mileage,userSeq]);
            console.log(updateUser[0]);
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
 *     summary: 주문내역 주문상태 수정하기
 *     tags: [order]
 *     consumes:
 *       - application/x-www-form-urlencoded
 *     requestBody:
 *       content:
 *          application/x-www-form-urlencoded:
 *              schema:
 *                  type: object
 *                  properties:
 *                      order_state:
 *                          type: varchar(45)
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
            const {order_state} = req.body;
            console.log(order_state);
            const result = await pool.query('UPDATE Orders SET order_state=? WHERE orderSeq=?', [order_state,orderSeq]);
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
            const result = await pool.query('delete from Orders WHERE orderSeq=?',orderSeq);
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