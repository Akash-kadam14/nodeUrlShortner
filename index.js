const express = require('express');
const emoji = require('node-emoji');
const mongoose = require('mongoose');
const rocket = emoji.get('rocket');
const shortUrl = require('./model/shortUrl');
const app = express();

mongoose.connect('mongodb://localhost:27017/url-Shortner',
{useNewUrlParser:true,useUnifiedTopology:true})


app.set('view engine','ejs')

app.use(express.urlencoded({ extended:false }))


app.get("/",async(req,res)=>{
   const shortUrls = await shortUrl.find()
    res.render('index',{shortUrls:shortUrls})
})

app.post("/shortUrls",async(req,res)=>{
await shortUrl.create({full:req.body.fullUrl})
res.redirect('/')
})

app.get("/:shortUrl",async(req,res)=>{
   const newShortUrl = await shortUrl.findOne({ short:req.params.shortUrl})
   if(newShortUrl==null){
    return res.sendStatus(404)
   }
   newShortUrl.clicks++
   newShortUrl.save()

   res.redirect(newShortUrl.full)
})

app.listen(process.env.PORT || 5000 , ()=>{
    console.log(`server listening at port ${process.env.PORT || 5000} ${rocket} `);
})