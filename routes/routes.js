const bodyParser = require('body-parser')
const aws = require('aws-sdk')
const Models = require('../models/Models')
const keys = require('../config/keys')

module.exports = (app) => {

    var jsonParser = bodyParser.json()

    app.get('/api/sign-s3', (req, res) => {
        const s3 = new aws.S3()
        const fileName = req.query['file-name']
        const fileType = req.query['file-type']
        const s3Params = {
            Bucket: keys.s3_bucket_name,
            Key: fileName,
            Expires: 60,
            ContentType: fileType,
            ACL: 'public-read'
        }
        
        s3.getSignedUrl('putObject', s3Params, (err, data) => {
            if(err){
                return res.end()
            }
            const returnData = {
                signedRequest: data,
                url: `https://${keys.s3_bucket_name}.s3.amazonaws.com/${fileName}`
            }
            res.send(returnData)
        })
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

    // Ok
    app.post('/api/add_page', jsonParser, async (req, res) => {
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

    app.post('/api/delete_banner_image/', jsonParser, async (req, res) => {
        try {
            const page = await Models.Page.findByIdAndUpdate(
                req.body.page_id,
                { banner_image: null }
            )
            const s3 = new aws.S3()
            const s3Params = {
                Bucket: keys.s3_bucket_name,
                Key: page.banner_image.split("/").pop()
            }
            s3.deleteObject(s3Params, ()=>{})
            res.send({ success: true })
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
    app.post('/api/delete_page', jsonParser, async (req, res) => {
        try {
            const deleted_page = await Models.Page.findByIdAndDelete(req.body.page_id)
            if (deleted_page) {
                let delete_images = []
                if (deleted_page.button_image) {
                    delete_images.push({
                        Key: deleted_page.button_image.split("/").pop()
                    })
                }
                if (deleted_page.banner_image) {
                    delete_images.push({
                        Key: deleted_page.banner_image.split("/").pop()
                    })
                }
                delete_images = delete_images.concat(deleted_page.cards.map(({ image }) => {
                    return {
                        Key: image.split("/").pop()
                    }
                }))
                if (delete_images.length != 0) {
                    const s3 = new aws.S3()
                    const s3Params = {
                        Bucket: keys.s3_bucket_name,
                        Delete: { 
                            Objects: delete_images,
                            Quiet: true
                        }
                    }
                    s3.deleteObjects(s3Params, ()=>{})
                }
                res.send({ success: true })
            } else {
                res.send({ success: false, error: '找不到這頁面' })
            }
        } catch (err) {
            res.send({ success: false, error: err.message })
        }
    })

    // Ok
    app.post('/api/add_card', jsonParser, async (req, res) => {
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
            const originalpage = await Models.Page.findById(req.body.page_id)
            const original_card_image = originalpage.cards.find(card => card._id == req.body.card_id ).image
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
            if (original_card_image && !obj.image) {
                const s3 = new aws.S3()
                const s3Params = {
                    Bucket: keys.s3_bucket_name,
                    Key: original_card_image.split("/").pop()
                }
                s3.deleteObject(s3Params, ()=>{})
            }
            res.send({ success: true })
        } catch (err) {
            res.send({ success: false, error: err })
        }
    })

    // Ok
    app.post('/api/delete_card', jsonParser, async (req, res) => {
        try {
            const page = await Models.Page.findByIdAndUpdate(
                req.body.page_id,
                { $pull: { cards: { _id: req.body.card_id } } }
            )
            if (page.cards.find(card => card._id == req.body.card_id ).image) {
                const delete_image = page.cards.find(card => card._id == req.body.card_id ).image.split("/").pop()
                console.log('delete_image:', delete_image)
                const s3 = new aws.S3()
                const s3Params = {
                    Bucket: keys.s3_bucket_name,
                    Key: delete_image.split("/").pop()
                }
                s3.deleteObject(s3Params, ()=>{})
            }
            res.send({ success: true })
        } catch (err) {
            res.send({ success: false, error: err.message })
        }
    })
}