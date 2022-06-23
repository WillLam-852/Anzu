const express = require('express')
const mongoose = require('mongoose')
const keys = require('./config/keys')

mongoose.connect(keys.mongoURI, {}, err => {
    if (err) {
        console.log(`Error connecting mongoDB: ${err.message}`)
    }
    console.log('connected to MongoDB')
})

const app = express()

require('./models/Models')
require('./models/imageModel')
require('./routes/routes')(app)

const PORT = process.env.PORT || 5001
app.listen(PORT, err => {
    if (err) {
        console.log(err)
        return
    }
    console.log('Server listening on port', PORT)
})