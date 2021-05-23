let express = require('express');
let router = express.Router();
const pool = require('../utils/pool');

/**
 * @swagger
 * tags:
 *   name: product
 *   description: 상품
 */
/**
 * @swagger
 * /product :
 *   get:
 *     summary: 전체 상품 조회
 *     tags: [product]
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
        const data = await pool.query('select * from Product');
        return res.json(data[0]);
    } catch (err) {
        return res.status(400).json(err);
    }
});
/**
 * @swagger
 * /product/{productSeq}:
 *   get:
 *     summary: 상품 상세 조회
 *     tags: [product]
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
        console.log(productSeq)
        const data=await pool.query('select * from Product where productSeq =?',productSeq);
        return res.json(data[0]);
    }catch (err) {
        return res.status(400).json(err);
    }
});

/**
 * @swagger
 * /product/add:
 *   post:
 *     summary: 상품 추가
 *     tags: [product]
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
 *                      field:
 *                          type: varchar(45)
 *                      a_intro:
 *                          type: mediumtext
 *                      content:
 *                          type: mediumtext
 *                      image:
 *                          type: varchar(300)
 *                      author:
 *                          type: varchar(45)
 *                      price:
 *                          type: int
 *                      mileage:
 *                          type: int
 *                      delivery:
 *                          type: int
 *                      page:
 *                          type: int
 *                      publisher:
 *                          type: varchar(45)
 *                      p_date:
 *                          type: varchar(45)
 *              required:
 *                  - title
 *                  - field
 *                  - a_intro
 *                  - content
 *                  - image
 *                  - author
 *                  - price
 *                  - mileage
 *                  - delivery
 *                  - page
 *                  - publisher
 *                  - p_date
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
        const {title,field,a_intro,content,image,author,price,mileage,delivery,page,publisher,p_date} = req.body;
        const data = await pool.query('INSERT INTO Product SET ?', {title,field,a_intro,content,image,author,price,mileage,delivery,page,publisher,p_date})
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
 * /product/re/{productSeq}:
 *   post:
 *     summary: 상품 수정하기
 *     tags: [product]
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
 *                      field:
 *                          type: varchar(45)
 *                      a_intro:
 *                          type: mediumtext
 *                      content:
 *                          type: mediumtext
 *                      image:
 *                          type: varchar(300)
 *                      author:
 *                          type: varchar(45)
 *                      price:
 *                          type: int
 *                      mileage:
 *                          type: int
 *                      delivery:
 *                          type: int
 *                      page:
 *                          type: int
 *                      publisher:
 *                          type: varchar(45)
 *                      p_date:
 *                          type: varchar(45)
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
router.post("/re/:productSeq", async (req, res) => {
    if(req.userInfo){
    try {
        let productSeq = req.params.productSeq;
        console.log(productSeq);
        const {title,field,a_intro,content,image,author,price,mileage,delivery,page,publisher,p_date} = req.body;
        const result = await pool.query('UPDATE Product SET title=?,field=?,a_intro=?,content=?,image=?,author=?,price=?,mileage=?,delivery=?,page=?,publisher=?,p_date=? WHERE productSeq=?', [title,field,a_intro,content,image,author,price,mileage,delivery,page,publisher,p_date,productSeq]);
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
 * /product/ki/{productSeq}:
 *   delete:
 *     summary: 상품 삭제
 *     tags: [product]
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
router.delete('/ki/:productSeq', async (req, res) => {
    if(req.userInfo){
        try {
            let productSeq = req.params.productSeq;
            const result = await pool.query('delete from Product WHERE productSeq=?',productSeq);
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
 * /product/category/{field}:
 *   get:
 *     summary: 상품 카테고리 조회
 *     tags: [product]
 *     parameters:
 *       - in: path
 *         name: field
 *         required: true
 *         type: varchar(45)
 *         description: 상품 카테고리 정보
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
router.get('/category/:field', async (req, res) => {
    try {
        let field = req.params.field;
        console.log(field)
        const data=await pool.query('select * from Product where field =?',field);
        return res.json(data[0]);
    }catch (err) {
        return res.status(400).json(err);
    }
});
module.exports = router;