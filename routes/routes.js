const bodyParser = require('body-parser')
const fs = require('fs')
const path = require('path')
const Models = require('../models/Models')
// const upload_image = require('../utils/multerStorage')
const ImageModel = require('../models/imageModel')
const multer  = require('multer')
const upload = multer({ dest: 'uploads/' })

module.exports = (app) => {

    var jsonParser = bodyParser.json()

    // Temp Ok
    app.post('/api/delete_all_pages', async (req, res) => {
        try {
            const db_res = await Models.Page.remove({})
            res.send({ success: true, deletedCount: db_res.deletedCount })
        } catch (err) {
            res.send({ success: false, error: err })
        }
    })

    // Ok
    app.get('/api/all_pages', async (req, res) => {
        try {
            const page = await Models.Page.find({})
            res.send(page)
        } catch (err) {
            res.send({ success: false, error: err })
        }
    })

    app.get('/api/all_pages/titles', async (req, res) => {
        try {
            let titles = []
            const pages = await Models.Page.find({}, 'title')
            pages.forEach( page => {
                titles.push(page.title)
            })
            res.send({ titles: titles })
        } catch (err) {
            res.send({ success: false, error: err })
        }
    })
    
    // Ok
    app.post('/api/new_page', jsonParser, async (req, res) => {
        const page = new Models.Page({ 
            title: req.body.title,
            order: req.body.order,
            badge_image: null, 
            cards: [] 
        })
        const new_page = await page.save()
        res.send({ success: new_page === page })
    })

    // Ok
    app.post('/api/delete_page', jsonParser, async (req, res) => {
        try {
            await Models.Page.findByIdAndDelete(req.body._id)
            res.send({ success: true })
        } catch (err) {
            res.send({ success: false, error: err })
        }
    })

    // Ok
    app.post('/api/edit_title', jsonParser, async (req, res) => {
        try {
            if (req.body.title != undefined) {
                await Models.Page.findByIdAndUpdate(
                    req.body._id,
                    { title: req.body.title }
                )
            }
            if (req.body.order != undefined) {
                await Models.Page.findByIdAndUpdate(
                    req.body._id,
                    { order: req.body.order }
                )
            }
            res.send({ success: true })
        } catch (err) {
            res.send({ success: false, error: err })
        }
    })

    // TODO: Edit Badge Image

    // Ok
    app.post('/api/edit_order', jsonParser, async (req, res) => {
        try {
            if (req.body.order != undefined) {
                await Models.Page.findByIdAndUpdate(
                    req.body._id,
                    { order: req.body.order }
                )
            }
            res.send({ success: true })
        } catch (err) {
            res.send({ success: false, error: err })
        }
    })

    // Ok
    app.post('/api/new_card', jsonParser, async (req, res) => {
        const card = new Models.Card({ 
            title: req.body.title,
            order: req.body.order,
            image: req.body.image, 
            description: req.body.description 
        })
        try {
            const page = await Models.Page.findByIdAndUpdate(
                req.body.page_id,
                { $push: { cards: card } },
                { new: true }
            )
            if (page != null) {
                res.send({ success: true, page: page })
            } else {
                res.send({ success: false, error: 'cannot find this page' })
            }
        } catch (err) {
            res.send({ success: false, error: err })
        }
    })

    // Ok
    app.post('/api/delete_card', jsonParser, async (req, res) => {
        try {
            await Models.Page.findByIdAndUpdate(
                req.body.page_id,
                { $pull: { cards: { _id: req.body._id } } }
            )
            res.send({ success: true })
        } catch (err) {
            res.send({ success: false, error: err })
        }
    })


    app.post('/api/edit_card', jsonParser, async (req, res) => {
        try {
            await Models.Page.updateOne(
                { "cards._id": req.body._id },
                {
                    $set: {
                        "cards.$.title": req.body.title,
                        "cards.$.order": req.body.order,
                        "cards.$.description": req.body.description,
                    }
                }
            )
            res.send({ success: true })
        } catch (err) {
            console.log('er', err)
            res.send({ success: false, error: err })
        }
    })

    // upload image
    app.post('/api/upload_image', upload.single('profileImg'), async (req, res, next) => {
        const url = req.protocol + '://' + req.get('host')
        const obj = {
            img: {
                data: url + '/uploads/' + req.file.filename,
                contentType: 'image/png'
            }
        }
        const newImage = new ImageModel({
            image: obj.img
        })
        newImage.save((err) => {
            err ? console.log('image err', err) : res.redirect("/")
        })
    })

    // get image
    app.get('/api/get_image')


    // edit card

}