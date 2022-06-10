const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const multer = require('multer');
const fs = require('fs')
const path = require('path')
const keys = require('./config/keys')

mongoose.connect(keys.mongoURI, {}, err => {
    if (err) {
        console.log(`Error connecting mongoDB: ${err.message}`)
    }
    console.log('connected to MongoDB')
})

const app = express()

const model = require('./models/Model')
require('./routes/routes')(app)



// // set up EJS (To be deleted)
// app.use(bodyParser.urlencoded({ extended: false }))
// app.use(bodyParser.json())
// app.set("view engine", "ejs");

// // set up multer for storing uploaded files
// var storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         cb(null, 'uploads')
//     },
//     filename: (req, file, cb) => {
//         cb(null, file.fieldname + '-' + Date.now())
//     }
// });
// var upload = multer({ storage: storage });


// const imgModel = require('./models/imageModel')

// // the GET request handler that provides the HTML UI
// app.get('/', (req, res) => {
//     imgModel.find({}, (err, items) => {
//         if (err) {
//             console.log(err);
//             res.status(500).send('An error occurred', err);
//         }
//         else {
//             res.render('imagesPage', { items: items });
//         }
//     });
// });


// // the POST handler for processing the uploaded file
  
// app.post('/', upload.single('image'), (req, res, next) => {
//     var obj = {
//         name: req.body.name,
//         desc: req.body.desc,
//         img: {
//             data: fs.readFileSync(path.join(__dirname, '/uploads/', req.file.filename)),
//             contentType: 'image/png'
//         }
//     }
//     imgModel.create(obj, (err, item) => {
//         if (err) {
//             console.log(err);
//         }
//         else {
//             // item.save();
//             res.redirect('/');
//         }
//     });
// });



const PORT = process.env.PORT || 5001
app.listen(PORT, err => {
    if (err) {
        console.log(err)
        return
    }
    console.log('Server listening on port', PORT)
})