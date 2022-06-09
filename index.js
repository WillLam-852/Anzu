const express = require('express')
const mongoose = require('mongoose')
const keys = require('./config/keys')
require('./models/User')

mongoose.connect(keys.mongoURI)

const app = express()

require('./routes/routes')(app)

const PORT = process.env.PORT || 5001
app.listen(PORT)