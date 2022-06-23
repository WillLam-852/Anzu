const mongoose = require('mongoose')
const { Schema } = mongoose

const cardSchema = new Schema({
    title: String,
    order: Number,
    image: {
        data: Buffer,
        contentType: String
    },
    description: String
})

const pageSchema = new Schema({
    title: String,
    order: Number,
    badge_image: {
        data: Buffer,
        contentType: String
    },
    button_image: {
        data: Buffer,
        contentType: String
    },
    cards: [cardSchema]
})

module.exports = {
    Card: mongoose.model('Card', cardSchema),
    Page: mongoose.model('Page', pageSchema)
}