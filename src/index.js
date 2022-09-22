const express = require('express');
const emoji = require('node-emoji');
const mongoose = require('mongoose');
const rocket = emoji.get('rocket');
const shortUrl = require('../model/shortUrl');
const serverless = require('serverless-http')
const app = express();
const router = express.Router()

mongoose.connect('mongodb://localhost:27017/url-Shortner',
    { useNewUrlParser: true, useUnifiedTopology: true })


app.set('view engine', 'ejs')

app.use(express.urlencoded({ extended: false }))


router.get("/", async (req, res) => {
    const shortUrls = await shortUrl.find()
    res.render('index', { shortUrls: shortUrls })
})

router.post("/shortUrls", async (req, res) => {
    await shortUrl.create({ full: req.body.fullUrl })
    res.redirect('/')
})

router.get("/:shortUrl", async (req, res) => {
    const newShortUrl = await shortUrl.findOne({ short: req.params.shortUrl })
    if (newShortUrl == null) {
        return res.sendStatus(404)
    }
    newShortUrl.clicks++
    newShortUrl.save()

    res.redirect(newShortUrl.full)
})
app.use('/', router)
module.exports.handler = serverless(app)