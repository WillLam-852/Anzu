const mongoose = require('mongoose')
const { Schema } = mongoose

const cardSchema = new Schema({
    page_id: String,
    title: String,
    description: String,
    image: String
})

const pageSchema = new Schema({
    title: String,
    banner_image: String,
    button_image: String,
    cards: [cardSchema]
})

module.exports = {
    Card: mongoose.model('Card', cardSchema),
    Page: mongoose.model('Page', pageSchema)
}