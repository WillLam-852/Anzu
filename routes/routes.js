const Models = require('../models/Models')

module.exports = (app) => {
    
    app.get('/api/new_page', async (req, res) => {
        const page = new Models.Page({ 
            title: req.query.title,
            order: req.query.order,
            badge_image: null, 
            cards: [] });
        const new_page = await page.save()
        res.send({ success: new_page === page })
    })

    app.get('/api/cards', async (req, res) => {
        try {
            const page = await Models.Page.find({
                title: req.query.title
            })
            res.send(page)
        } catch (err) {
            res.send({ success: false, error: err })
        }
    })

    app.get('/api/new_card', (req, res) => {
        const card = new Models.Card({ 
            title: req.query.title,
            order: req.query.order,
            image: null, 
            description: req.query.description });
        Models.Page.findOneAndUpdate(
            { title: req.query.page },
            { $push: { cards: card } },
            function(err, _) {
                if (err) {
                    res.send({ success: false, error: err })
                } else {
                    res.send({ success: true })
                }
            }
        )
    })

}