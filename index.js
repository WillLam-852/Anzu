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
require('./routes/Routes')(app)

if (process.env.NODE_ENV === 'production') {
    // Express will serve up production assets
    // like our main.js file, or main.css file!
    app.use(express.static('client/build'))

    // Express will serve up the index.html file
    // if it doesn't recognize the route
    const path = require('path')
    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'))
    })
}

const PORT = process.env.PORT || 5001
app.listen(PORT, err => {
    if (err) {
        console.log(err)
        return
    }
    console.log('Server listening on port', PORT)
})
