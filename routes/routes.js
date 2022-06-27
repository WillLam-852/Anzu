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
            banner_image: null,
            button_image: null,
            cards: [] 
        })
        const new_page = await page.save()
        res.send({ success: new_page === page, page_id: new_page._id })
    })

    // Ok
    app.post('/api/upload_button_image/', upload_image.single('image'), async (req, res, next) => {
        var obj = {
            img: {
                data: fs.readFileSync(path.join(__dirname, '../uploads/', req.file.filename)),
                contentType: 'image/png'
            }
        }
        try {
            await Models.Page.findByIdAndUpdate(
                req.body.page_id,
                { button_image: obj }
            )
            res.send({ success: true })
        } catch (err) {
            res.send({ success: false, error: err })
        }
    })

    // Ok
    app.post('/api/upload_banner_image/', upload_image.single('image'), async (req, res, next) => {
        var obj = {
            img: {
                data: fs.readFileSync(path.join(__dirname, '../uploads/', req.file.filename)),
                contentType: 'image/png'
            }
        }
        try {
            await Models.Page.findByIdAndUpdate(
                req.body.page_id,
                { banner_image: obj }
            )
            res.send({ success: true })
        } catch (err) {
            res.send({ success: false, error: err })
        }
    })
    
    // Ok
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
        const card = new Models.Card({ 
            title: req.body.title,
            description: req.body.description 
        })
        try {
            const page = await Models.Page.findByIdAndUpdate(
                req.body.page_id,
                { $push: { cards: card } },
                { new: true }
            )
            const new_card = page.cards[page.cards.length - 1]
            if (new_card) {
                res.send({ success: true, card: new_card })
            } else {
                res.send({ success: false, error: 'cannot find this page' })
            }
        } catch (err) {
            res.send({ success: false, error: err })
        }
    })

    // Ok
    app.post('/api/edit_card', jsonParser, async (req, res) => {
        const card = { 
            title: req.body.title,
            description: req.body.description
        }
        try {
            await Models.Page.updateOne(
                { "_id": req.body.page_id, "cards._id": req.body.card_id },
                {
                    $set: {
                        "cards.$.title": card.title,
                        "cards.$.description": card.description,
                    }
                }
            )
            res.send({ success: true })
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

    // Ok
    app.post('/api/upload_card_image/', upload_image.single('image'), async (req, res, next) => {
        var obj = {
            img: {
                data: fs.readFileSync(path.join(__dirname, '../uploads/', req.file.filename)),
                contentType: 'image/png'
            }
        }
        try {
            await Models.Page.updateOne(
                { "_id": req.body.page_id, "cards._id": req.body.card_id },
                {
                    $set: {
                        "cards.$.image": obj,
                    }
                }
            )
            res.send({ success: true })
        } catch (err) {
            res.send({ success: false, error: err })
        }
    })

    
    app.post('/api/delete_card_image/', jsonParser, async (req, res) => {
        try {
            await Models.Page.updateOne(
                { "_id": req.body.page_id, "cards._id": req.body.card_id },
                {
                    $set: {
                        "cards.$.image": null,
                    }
                }
            )
            res.send({ success: true })
        } catch (err) {
            res.send({ success: false, error: err })
        }
    })
}