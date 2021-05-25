const express = require("express");
const upload = require('./fileupload');
const multer = require('multer');
const pool = require('../utils/pool');

const router = express.Router();

router.post("/notice/upload", (req, res, next) => {
    // FormData의 경우 req로 부터 데이터를 얻을수 없다.
    // upload 핸들러(multer)를 통해서 데이터를 읽을 수 있다

    upload(req, res, function(err) {
        if (err instanceof multer.MulterError) {
            return next(err);
        } else if (err) {
            return next(err);
        }
        //console.log('원본파일명 : ' + req.file.originalname)
        //console.log('저장파일명 : ' + req.file.filename)
        //console.log('크기 : ' + req.file.size)
        console.log('경로 : ' + req.file.location) //s3 업로드시 업로드 url을 가져옴
        const image = req.file.location;
        return res.json({"image":image});
    });
});
router.post("/notice/re/:noticeSeq", (req, res, next) => {
    // FormData의 경우 req로 부터 데이터를 얻을수 없다.
    // upload 핸들러(multer)를 통해서 데이터를 읽을 수 있다

    upload(req, res, function(err) {
        const {noticeSeq} = req.params
        if (err instanceof multer.MulterError) {
            return next(err);
        } else if (err) {
            return next(err);
        }
        //console.log('원본파일명 : ' + req.file.originalname)
        //console.log('저장파일명 : ' + req.file.filename)
        //console.log('크기 : ' + req.file.size)
        console.log('경로 : ' + req.file.location) //s3 업로드시 업로드 url을 가져옴
        const result = pool.query("UPDATE Notice set image=? where noticeSeq=?",[req.file.location,noticeSeq])
        return res.json(result[0]);
    });
});
router.post("/event/upload", (req, res, next) => {
    // FormData의 경우 req로 부터 데이터를 얻을수 없다.
    // upload 핸들러(multer)를 통해서 데이터를 읽을 수 있다

    upload(req, res, function(err) {
        if (err instanceof multer.MulterError) {
            return next(err);
        } else if (err) {
            return next(err);
        }
        //console.log('원본파일명 : ' + req.file.originalname)
        //console.log('저장파일명 : ' + req.file.filename)
        //console.log('크기 : ' + req.file.size)
        console.log('경로 : ' + req.file.location) //s3 업로드시 업로드 url을 가져옴
        const result = pool.query("INSERT INTO Event(image) value (?)",[req.file.location])
        return res.json(result[0]);
    });
});
router.post("/event/re/:eventSeq", (req, res, next) => {
    // FormData의 경우 req로 부터 데이터를 얻을수 없다.
    // upload 핸들러(multer)를 통해서 데이터를 읽을 수 있다

    upload(req, res, function(err) {
        const {eventSeq} = req.params
        if (err instanceof multer.MulterError) {
            return next(err);
        } else if (err) {
            return next(err);
        }
        //console.log('원본파일명 : ' + req.file.originalname)
        //console.log('저장파일명 : ' + req.file.filename)
        //console.log('크기 : ' + req.file.size)
        console.log('경로 : ' + req.file.location) //s3 업로드시 업로드 url을 가져옴
        const result = pool.query("UPDATE Event set image=? where eventSeq=?",[req.file.location,eventSeq])
        return res.json(result[0]);
    });
});

module.exports = router;