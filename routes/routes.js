const bodyParser = require('body-parser')
const fs = require('fs')
const path = require('path')
const Models = require('../models/Models')
const upload_image = require('../utils/multerStorage')

module.exports = (app) => {

    var jsonParser = bodyParser.json()

    // Ok
    app.get('/api/all_pages', async (req, res) => {
        try {
            const page = await Models.Page.find({})
            res.send(page)
        } catch (err) {
            res.send({ success: false, error: err })
        }
    })

    // Ok
    app.post('/api/new_page', jsonParser, async (req, res) => {
        const page = new Models.Page({ 
            title: req.body.title,
            banner_image: null,
            button_image: req.body.button_image,
            cards: [] 
        })
        const new_page = await page.save()
        res.send({ success: new_page === page, page_id: new_page._id })
    })

    // Ok
    app.post('/api/upload_banner_image/', jsonParser, async (req, res) => {
        try {
            await Models.Page.findByIdAndUpdate(
                req.body.page_id,
                { banner_image: req.body.banner_image }
            )
            res.send({ success: true })
        } catch (err) {
            res.send({ success: false, error: err })
        }
    })
    
    // Ok TODO: Add delete S3 file
    app.post('/api/delete_page', jsonParser, async (req, res) => {
        try {
            const new_page = await Models.Page.findByIdAndDelete(req.body.page_id)
            if (new_page) {
                res.send({ success: true })
            } else {
                res.send({ success: false, error: '找不到這頁面' })
            }
        } catch (err) {
            res.send({ success: false, error: err })
        }
    })

    // Ok
    app.post('/api/edit_title', jsonParser, async (req, res) => {
        try {
            if (req.body.title != undefined) {
                const new_page = await Models.Page.findByIdAndUpdate(
                    req.body.page_id,
                    { title: req.body.title }
                )
                if (new_page) {
                    res.send({ success: true })
                } else {
                    res.send({ success: true, error: 'Cannot find page by page_id' })
                }
            }
        } catch (err) {
            res.send({ success: false, error: err })
        }
    })

    // Ok
    app.post('/api/new_card', jsonParser, async (req, res) => {
        const obj = new Models.Card({ 
            title: req.body.title,
            image: req.body.image,
            description: req.body.description 
        })
        try {
            const page = await Models.Page.findByIdAndUpdate(
                req.body.page_id,
                { $push: { cards: obj } },
                { new: true }
            )
            const new_card = page.cards[page.cards.length - 1]
            if (new_card) {
                res.send({ success: true, obj: new_card })
            } else {
                res.send({ success: false, error: 'cannot find this page' })
            }
        } catch (err) {
            res.send({ success: false, error: err })
        }
    })

    // Ok
    app.post('/api/edit_card', jsonParser, async (req, res) => {
        const obj = { 
            title: req.body.title,
            image: req.body.image,
            description: req.body.description
        }
        try {
            await Models.Page.updateOne(
                { "_id": req.body.page_id, "cards._id": req.body.card_id },
                {
                    $set: {
                        "cards.$.title": obj.title,
                        "cards.$.image": obj.image,
                        "cards.$.description": obj.description,
                    }
                }
            )
            res.send({ success: true })
        } catch (err) {
            res.send({ success: false, error: err })
        }
    })

    // Ok TODO: Add delete S3 file
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
}