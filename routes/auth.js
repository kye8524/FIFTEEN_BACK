let express = require('express');
let router = express.Router();
const pool = require('../utils/pool');

const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const cUtil = require('../utils/util');
require('dotenv').config()

/**
 * @swagger
 * tags:
 *   name: auth
 *   description: 회원가입 및 로그인
 */
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
 *                      gender:
 *                          type: varchar(1)
 *              required:
 *                  - id
 *                  - passwd
 *                  - name
 *                  - phoneNum
 *                  - email
 *                  - gender
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
router.post('/signup',async (req,res,next) => {
    try{
        let array = {
            email: req.body.email,
            passwd: req.body.passwd,
            name: req.body.name,
            id: req.body.id,
            gender: req.body.gender,
            phoneNum: req.body.phoneNum
        };
        let param2 = {
            name: array.name,
            id: array.id,
            email: array.email,
            passwd: array.passwd,
            gender: array.gender,
            phoneNum: array.phoneNum,
            signTime : Date.now()
        };
        const sql2 = "INSERT INTO UserInfo SET ?;";
        await pool.query(sql2,param2, function (err, rows, fields) {
            if (err) {
                console.log("insert query error")
                console.log(err);
                res.status(500).send('500 SERVER ERROR, db3');
            } else {
                console.log('REGISTER SUCCESS');
            }
        })

    }catch (err){
        return res.status(400).json(err);
    }
})

function crypPw(password) {
    return new Promise(function (resolve, reject) {
        let salt = "";
        let newPw;
        crypto.randomBytes(64, function (err, buf) {
            if (err) {
                console.error(err);
                res.status(500).send('500 SERVER ERROR');
            } else {
                salt = buf.toString('base64');
                crypto.pbkdf2(password, salt, 98523, 64, 'sha512', function (error, key) {
                    if (error) {
                        console.log(error);
                        res.status(400).send("crypto error");
                    } else {
                        newPw = key.toString('base64');
                        console.log("crypto : "+newPw);
                    }
                })
            }
        })
        setTimeout(() => {
            resolve([salt, newPw]);
        }, 500);
    })
}

function pwBySalt(password, salt) {
    return new Promise(function (resolve, reject) {
        crypto.pbkdf2(password, salt, 98523, 64, 'sha512', function (err, key) {
            resolve(key.toString('base64'));//replace추가
        })
    })
}

module.exports = router;