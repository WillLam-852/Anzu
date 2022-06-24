const mongoose = require('mongoose')
const { Schema } = mongoose

const imageSchema = new mongoose.Schema({
    title: String,
    img:
    {
        data: Buffer,
        contentType: String
    }
});

const cardSchema = new Schema({
    page_id: String,
    title: String,
    image: imageSchema,
    description: String
})

const pageSchema = new Schema({
    title: String,
    banner_image: imageSchema,
    button_image: imageSchema,
    cards: [cardSchema]
})

module.exports = {
    Card: mongoose.model('Card', cardSchema),
    Page: mongoose.model('Page', pageSchema),
    Image: mongoose.model('Image', imageSchema)
}