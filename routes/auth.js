let express = require('express');
let router = express.Router();
const pool = require('../utils/pool');

const jwt = require('jsonwebtoken');
const crypto = require('crypto-promise');
const cUtil = require('../utils/util');
const nodemailer = require('nodemailer');
const smtpTransport = require('nodemailer-smtp-transport');
require('dotenv').config()

/**
 * @swagger
 * tags:
 *   name: auth
 *   description: 회원가입 및 로그인
 */
/**
 * @swagger
 * /auth :
 *   get:
 *     summary: 전체 회원 조회
 *     tags: [auth]
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
router.get('/',async (req,res,next)=>{
        try {
            const data = await pool.query('select * from UserInfo')
            return res.json(data[0])
        }catch (err) {
            return res.status(500).json(err)
        }
})
/**
 * @swagger
 * /auth/{userSeq} :
 *   get:
 *     summary: 특정 회원 조회
 *     tags: [auth]
 *     parameters:
 *       - in: header
 *         name: x-access-token
 *         type: string
 *         format: uuid
 *         required: true
 *       - in: path
 *         name: userSeq
 *         required: true
 *         type: int
 *         description: 회원 Seq 정보
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
router.get('/:userSeq',async (req,res,next)=>{
    if(req.userInfo){
        const {userSeq}=req.params;
        try {
            const data = await pool.query('select * from UserInfo where userSeq=?',[userSeq])
            console.log(data[0][0]);
            return res.json(data[0])
        }catch (err) {
            return res.status(500).json(err)
        }
    }else{
        res.status(403).send({"message" : "Token error!"});
    }
})
/**
 * @swagger
 * /auth/signup :
 *   post:
 *     summary: 회원가입
 *     tags: [auth]
 *     consumes:
 *       - application/x-www-form-urlencoded
 *     requestBody:
 *       content:
 *          application/x-www-form-urlencoded:
 *              schema:
 *                  type: object
 *                  properties:
 *                      id:
 *                          type: varchar(45)
 *                      passwd:
 *                          type: text
 *                      name:
 *                          type: varchar(15)
 *                      phoneNum:
 *                          type: varchar(11)
 *                      email:
 *                          type: varchar(100)
 *              required:
 *                  - id
 *                  - passwd
 *                  - name
 *                  - phoneNum
 *                  - email
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
async function crypPw(password) {
    let salt = "";
    let newPw;
    try{
        let data = await crypto.randomBytes(64);
        salt = data.toString();
        let key = await crypto.pbkdf2(password, salt, 98523, 64, 'sha512');
        newPw = key.toString('base64');
        return [salt, newPw];
    }catch (err) {
        throw Error(err);
    }
}


router.post('/signup', async (req, res, next) => {
    const { id,passwd,name,email,phoneNum} = req.body
    const data = await pool.query("select * from UserInfo where id=?",[id]);
        try {
            const pwData = await crypPw(passwd);
            const salt = pwData[0];
            const newPw = pwData[1];

            const token = jwt.sign(req.body.email, Date.now().toString(16), {
                algorithm: 'HS256'
            });
            let insertData = {
                id : id,
                passwd : newPw,
                name : name,
                phoneNum : phoneNum,
                email : email,
                signTime : Date.now(),
                accessToken : token,
                salt : salt
            }

            const data = await pool.query('insert into UserInfo(id, passwd, name, phoneNum, email, signTime, accessToken, salt) values(?,?,?,?,?,?,?,?)',[id,newPw,name,phoneNum,email,Date.now(),token,salt]);

            return res.json(Object.assign(data[0],insertData))
        } catch (err) {
            return res.status(500).json(err)
        }

})
/**
 * @swagger
 * /auth/overlap_id :
 *   post:
 *     summary: 아이디 중복체크
 *     tags: [auth]
 *     consumes:
 *       - application/x-www-form-urlencoded
 *     requestBody:
 *       content:
 *          application/x-www-form-urlencoded:
 *              schema:
 *                  type: object
 *                  properties:
 *                      id:
 *                          type: varchar(45)
 *              required:
 *                  - id
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
router.post('/overlap_id', async (req, res, next) => {
    try{
        const {id} = req.body
        const data = await pool.query("select * from UserInfo where id=?",[id]);
        let checkid = new Object();
        checkid.tf = false;
        if(data[0][0]){
            checkid.tf = false;
            res.send(checkid)
        }else{
            checkid.tf = true;
            res.send(checkid)
        }
    }catch (err) {
        return res.status(500).json(err)
    }
})
/**
 * @swagger
 * /auth/overlap_email :
 *   post:
 *     summary: 이메일 중복체크
 *     tags: [auth]
 *     consumes:
 *       - application/x-www-form-urlencoded
 *     requestBody:
 *       content:
 *          application/x-www-form-urlencoded:
 *              schema:
 *                  type: object
 *                  properties:
 *                      email:
 *                          type: varchar(45)
 *              required:
 *                  - email
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
router.post('/overlap_email', async (req, res, next) => {
    try{
        const {email} = req.body
        const data = await pool.query("select * from UserInfo where email=?",[email]);
        let checkid = new Object();
        checkid.tf = false;
        if(data[0][0]){
            checkid.tf = false;
            res.send(checkid)
        }else{
            checkid.tf = true;
            res.send(checkid)
        }
    }catch (err) {
        return res.status(500).json(err)
    }
})
/**
 * @swagger
 * /auth/login :
 *   post:
 *     summary: 로그인
 *     tags: [auth]
 *     consumes:
 *       - application/x-www-form-urlencoded
 *     requestBody:
 *       content:
 *          application/x-www-form-urlencoded:
 *              schema:
 *                  type: object
 *                  properties:
 *                      id:
 *                          type: varchar(45)
 *                      passwd:
 *                          type: text
 *              required:
 *                  - id
 *                  - passwd
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
async function pwBySalt(password, salt) {
    try {
        let key = await crypto.pbkdf2(password, salt, 98523, 64, 'sha512');
        return key.toString('base64');
    }catch (err) {
        throw Error(err);
    }
}
router.post('/login', async (req, res, next)=>{
    const {id, passwd} = req.body;
    try{
        let userData = await pool.query("SELECT * from UserInfo where id = ?", [id]);
        if(userData[0][0]){
            let newPw = await pwBySalt(passwd, userData[0][0].salt);
            if(userData[0][0].passwd === newPw){
                return res.json(userData[0][0]);
            }else {
                return res.json({"status": 0});
            }
        }else{
            return res.json({"status":0});
        }
    }catch (err) {
        console.log(err);
        return res.status(500).json(err);
    }
})
/**
 * @swagger
 * /auth/token :
 *   get:
 *     summary: 회원 토큰 로그인
 *     tags: [auth]
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
router.get('/token', async (req, res, next)=>{
    if(req.userInfo){
        res.status(200).send(req.userInfo);
    }else{
        res.status(403).send({"message": "Token Error!"});
    }
})
/**
 * @swagger
 * /auth/signout :
 *   delete:
 *     summary: 회원 탈퇴
 *     tags: [auth]
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
router.delete('/signout', async (req,res,next)=>{
    if(req.userInfo){
        try {
            let userSeq = req.userInfo.userSeq;
            const result = await pool.query('delete from UserInfo WHERE userSeq=?',userSeq);
            return res.json(result[0])
        } catch (err) {
            res.status(400).json(err);
        }
    }else {
        console.log('cookie none');
        res.status(403).send({msg: "권한이 없습니다."});
    }
})
module.exports = router;