const Models = require('../models/Models')

module.exports = (app) => {

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
    app.post('/api/new_page', async (req, res) => {
        const page = new Models.Page({ 
            title: req.query.title,
            order: req.query.order,
            badge_image: null, 
            cards: [] 
        })
        const new_page = await page.save()
        res.send({ success: new_page === page })
    })

    // Ok
    app.post('/api/delete_page', async (req, res) => {
        try {
            await Models.Page.findByIdAndDelete(req.query._id)
            res.send({ success: true })
        } catch (err) {
            res.send({ success: false, error: err })
        }
    })

    // Ok
    app.post('/api/edit_title', async (req, res) => {
        try {
            if (req.query.title != undefined) {
                await Models.Page.findByIdAndUpdate(
                    req.query._id,
                    { title: req.query.title }
                )
            }
            if (req.query.order != undefined) {
                await Models.Page.findByIdAndUpdate(
                    req.query._id,
                    { order: req.query.order }
                )
            }
            res.send({ success: true })
        } catch (err) {
            res.send({ success: false, error: err })
        }
    })

    // TODO: Edit Badge Image

    // Ok
    app.post('/api/edit_order', async (req, res) => {
        try {
            if (req.query.order != undefined) {
                await Models.Page.findByIdAndUpdate(
                    req.query._id,
                    { order: req.query.order }
                )
            }
            res.send({ success: true })
        } catch (err) {
            res.send({ success: false, error: err })
        }
    })

    // Ok
    app.post('/api/new_card', async (req, res) => {
        const card = new Models.Card({ 
            title: req.query.title,
            order: req.query.order,
            image: null, 
            description: req.query.description 
        })
        try {
            const page = await Models.Page.findByIdAndUpdate(
                req.query.page_id,
                { $push: { cards: card } },
                { new: true }
            )
            if (page != null) {
                res.send({ success: true, page: page })
            } else {
                res.send({ success: false, page: 'cannot find this page' })
            }
        } catch (err) {
            res.send({ success: false, error: err })
        }
    })

    // Ok
    app.post('/api/delete_card', async (req, res) => {
        try {
            await Models.Page.findByIdAndUpdate(
                req.query.page_id,
                { $pull: { cards: { _id: req.query._id } } }
            )
            res.send({ success: true })
        } catch (err) {
            res.send({ success: false, error: err })
        }
    })


    // edit card

}