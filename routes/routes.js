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

    app.get('/api/new_card', async (req, res) => {
        const page = req.query.page
        const card = new Models.Card({ 
            title: req.query.title,
            order: req.query.order,
            image: null, 
            description: req.query.description });
        // const new_page = Models.Page.findOneAndUpdate(
        //     { title: req.query.page },
        //     { card: }
        // )
        res.send({ save: true })
    })

}