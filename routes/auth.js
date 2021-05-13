let express = require('express');
let router = express.Router();
const pool = require('../utils/pool');

const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const cUtil = require('../utils/token');
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
router.post('/signup',function (req,res,next) {
    let array = {
        email: req.body.email,
        passwd: req.body.passwd,
        name: req.body.name,
        id: req.body.id,
        gender: req.body.gender,
        phoneNum: req.body.phoneNum
    }
    if (!cUtil.isDelivered(array)) {
        res.status(400).send("ALL CONTENTS ARE NOT DELIVERED");
    } else {
        console.log("All contents are delivered");
    }
    var sql1 = "SELECT userSeq FROM UserInfo WHERE id = ?";
    pool.query(sql1, array.id, function (err, rows, field) {
        if (err) {
            console.log("check info before insert");
            console.log(err);
            res.status(500).send('500 SERVER ERROR, db1');
        } else if (rows.length !== 0) {
            console.log("ALREADY EXIST ACCOUNT");
            res.send('<script type="text/javascript">alert("이미 존재하는 계정입니다.");history.back();</script>');
        } else {
            crypPw(array.passwd)
                .then(function (resolve) {
                    const salt = resolve[0];
                    const hsPw = resolve[1];
                    let timestamp = new Date().getTime();
                    let token = jwt.sign(req.body.email, timestamp.toString(16), {
                        algorithm: 'HS256'
                    });
                    let accessTokenSubStr = token.substr(0, 64);
                    let param2 = {
                        name: array.name,
                        id: array.id,
                        email: array.email,
                        passwd: hsPw,
                        gender: array.gender,
                        phoneNum: array.phoneNum,
                        accessToken: accessTokenSubStr,
                        salt: salt,
                        signTime : Date.now()
                    };
                    console.log("암호화 성공")
                    const sql2 = "INSERT INTO UserInfo SET ?;";
                    pool.query(sql2,param2, function (err, rows, fields) {
                        if (err) {
                            console.log("insert query error")
                            console.log(err);
                            res.status(500).send('500 SERVER ERROR, db3');
                        } else {
                            console.log('REGISTER SUCCESS');
                        }
                    })
                })
        }
    })
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