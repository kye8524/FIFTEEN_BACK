let express = require('express');
let router = express.Router();
const pool = require('../utils/pool');

/**
 * @swagger
 * tags:
 *   name: cart
 *   description: 장바구니
 */
/**
 * @swagger
 * /cart :
 *   get:
 *     summary: 장바구니 조회
 *     tags: [cart]
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
            const data = await pool.query('select * from Cart where userSeq=?',userSeq);
            return res.json(data[0]);
        }catch (err) {
            return res.status(400).json(err);
        }
    }
});

/**
 * @swagger
 * /cart/add/{productSeq}:
 *   post:
 *     summary: 장바구니 추가
 *     tags: [cart]
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
            const userSeq = req.userInfo.userSeq;
            const {productSeq}=req.params
            const {count}=req.body;
            const is_cart = await pool.query('select * from Cart where productSeq=? AND userSeq=?',[productSeq,userSeq]);
            if(is_cart[0][0]){
                let cartSeq=is_cart[0][0].cartSeq;
                let pre_count = parseInt(is_cart[0][0].count);
                let final_count=parseInt(count)+pre_count;
                console.log(final_count);
                const result = await pool.query('UPDATE Cart set count=? where cartSeq=?',[final_count,cartSeq]);
                return res.json(result[0]);
            }else{
                const productData = await pool.query('select image,title,price from Product where productSeq=?',[productSeq])
                console.log(productData[0][0]);
                let image = productData[0][0].image
                let title = productData[0][0].title
                let price = productData[0][0].price
                const data = await pool.query('INSERT INTO Cart SET ?', {productSeq,userSeq,image,title,price,count})
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
 * /cart/re/{cartSeq}:
 *   post:
 *     summary: 장바구니 수정하기
 *     tags: [cart]
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
 *         name: cartSeq
 *         required: true
 *         type: int
 *         description: 장바구니 Seq 정보
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
router.post("/re/:cartSeq", async (req, res) => {
    if(req.userInfo){
        try {
            let cartSeq = req.params.cartSeq;
            const {count} = req.body;
            const result = await pool.query('UPDATE Cart SET count=? WHERE cartSeq=?', [count,cartSeq]);
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
 * /cart/ki/{cartSeq}:
 *   delete:
 *     summary: 장바구니 상품 삭제
 *     tags: [cart]
 *     parameters:
 *       - in: header
 *         name: x-access-token
 *         type: string
 *         format: uuid
 *         required: true
 *       - in: path
 *         name: cartSeq
 *         required: true
 *         type: int
 *         description: 장바구니 Seq 정보
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
router.delete('/ki/:cartSeq', async (req, res) => {
    if(req.userInfo){
        try {
            let cartSeq = req.params.cartSeq;
            const result = await pool.query('delete from Cart WHERE cartSeq=?',cartSeq);
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