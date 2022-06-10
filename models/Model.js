const mongoose = require('mongoose')
const { Schema } = mongoose

const contentSchema = new Schema({
    text: String,
    image: {
        data: Buffer,
        contentType: String
    },
})

const sectionSchema = new Schema({
    name: String,
    content: [contentSchema]
})

const pageSchema = new Schema({
    title: String,
    badge_image: {
        data: Buffer,
        contentType: String
    },
    section: [sectionSchema]
})

mongoose.model('contents', contentSchema)
mongoose.model('sections', sectionSchema)
mongoose.model('pages', pageSchema)