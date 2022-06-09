const mongoose = require('mongoose')
const User = mongoose.model('users')

User.findOne({ googleId: "userInput" })
    .then((existingUser) => {
        if (existingUser) {
            // we already have a record with the given profile ID
        } else {
            // we don't have a user record with this ID. make a new record
            new User({ googleId: '1234567890' })
                .save()
                .then(user => {
                    // callback function (e.g. print change successfully)
                })
        }
    })
