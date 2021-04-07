const express = require('express');
const { Readable } = require('stream');
const { uploadImageToS3, deleteFileFromS3, getFileFromS3 } = require('../middleware/s3-handlers');
const { checkUser } = require('../middleware/auth');
const File = require('../models/filesModel');

const router = new express.Router();

router.post('/upload-file', checkUser, uploadImageToS3, async (req, res) => {
    if (!req.file) return res.status(422).send({ code: 422, message: "File not uploaded" });

    const file = new File({
        originalName: req.file.originalname,
        storageName: req.file.key.split("/")[1],
        bucket: process.env.S3_BUCKET,
        region: process.env.AWS_REGION,
        key: req.file.key,
        owner: req.user._id
    });

    try {
        await file.save();
        res.redirect('/');
    } catch (err) {
        res.status(400).send(err);
    }
});



router.get('/get-file', checkUser, getFileFromS3, async (req, res) => {
    const fileName = req.query.key.split('_')[2];
    const stream = Readable.from(req.fileBuffer);
        res.setHeader(
            'Content-Disposition',
            'inline; filename=' + fileName
        );
    stream.pipe(res);
});



router.delete('/delete-file', checkUser, deleteFileFromS3, async (req, res) => {
    try {
        await File.findOneAndDelete({key: req.query.key});
        res.send();
    } catch (err) {
        console.log(err);
    }
});



module.exports = router;