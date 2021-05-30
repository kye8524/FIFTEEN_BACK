let express = require('express');
let router = express.Router();
const pool = require('../utils/pool');
const moment = require('moment');

const d = new Date();
const f = 'YYYY-MM-DD';

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

router.get('/', async (req, res) => {
    if(req.userInfo){
        try{
            const data = await pool.query('select orderSeq, userSeq, productSeq, title, count, price, pay_price, delivery, date_format(date,\'%Y-%m-%d\') as date, order_state, field from Orders');
            return res.json(data[0]);
        }catch (err) {
            return res.status(400).json(err);
        }
    }
});
/**
 * @swagger
 * /order/{userSeq} :
 *   get:
 *     summary: 회원별 주문내역 조회
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

router.get('/:userSeq', async (req, res) => {
    if(req.userInfo){
        let userSeq = req.userInfo.userSeq;
        try{
            const data = await pool.query('select orderSeq, userSeq, productSeq, title, count, price, pay_price, delivery, date_format(date,\'%Y-%m-%d\') as date, order_state, field from Orders where userSeq=?',[userSeq]);
            return res.json(data[0]);
        }catch (err) {
            return res.status(400).json(err);
        }
    }else {
        console.log('cookie none');
        res.status(403).send({msg: "권한이 없습니다."});
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
 *                      delivery:
 *                          type: varchar(100)
 *                          description: 배송지 이름
 *                      price:
 *                          type: int
 *                          description: 상품 가격
 *                      pay_price:
 *                          type: varchar(100)
 *                          description: 결제 금액
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
            const {count,delivery,price,pay_price}=req.body;
            const date = moment(d).format(f);
            const productData = await pool.query('select title,field from Product where productSeq=?',[productSeq])
            let title = productData[0][0].title
            //let price = productData[0][0].price
            //let mileage = productData[0][0].mileage
            let field = productData[0][0].field
            //let discount = productData[0][0].discount
           // let pay_price = price*(100-discount)/100
            const data = await pool.query('INSERT INTO Orders SET ?', {userSeq,productSeq,title,count,price,pay_price,delivery,date,field});
            //const updateUser = await pool.query('UPDATE UserInfo set totalOder=totalOder+1,mileage=? where userSeq=?',[mileage,userSeq]);
            //console.log(updateUser[0]);
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
 * /order/cart_add/{productSeq}:
 *   post:
 *     summary: 장바구니 주문내역 추가 == 구매하기
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
 *                      delivery:
 *                          type: varchar(100)
 *                          description: 배송지 이름
 *                      price:
 *                          type: int
 *                          description: 상품 가격
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
router.post('/cart_add/:productSeq', async (req, res) => {
    if(req.userInfo){
        try {
            const {productSeq}=req.params
            let userSeq = req.userInfo.userSeq;
            const {count,delivery,price}=req.body;
            const date = moment(d).format(f);
            const pay_price=0;
            const data = await pool.query('INSERT INTO Orders SET ?', {userSeq,productSeq,title,count,price,pay_price,delivery,date,field});
            return res.json(data[0]);
        } catch (err) {
            return res.status(400).json(err);
        }
    }else {
        console.log('cookie none');
        res.status(403).send({msg: "권한이 없습니다."});
    }
});

router.post('/test', async (req, res) => {
    if(req.userInfo){
        try {
            const {productSeq}=req.params
            let userSeq = req.userInfo.userSeq;
            const {count,delivery,price}=req.body;
            const date = moment(d).format(f);
            const pay_price=0;
            const data = await pool.query('INSERT INTO Orders SET ?', {userSeq,productSeq,title,count,price,pay_price,delivery,date,field});
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