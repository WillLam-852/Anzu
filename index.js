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
require('./routes/routes')(app)


if (process.env.NODE_ENV === 'production') {
    const aws = require('aws-sdk')

    app.get('/api/sign-s3', (req, res) => {
        const s3 = new aws.S3();
        const fileName = req.query['file-name'];
        const fileType = req.query['file-type'];
        const s3Params = {
          Bucket: keys.s3_bucket_name,
          Key: fileName,
          Expires: 60,
          ContentType: fileType,
          ACL: 'public-read'
        };
        
        s3.getSignedUrl('putObject', s3Params, (err, data) => {
            console.log(err)
            console.log(data)
            if(err){
                return res.end();
            }
            const returnData = {
                signedRequest: data,
                url: `https://${keys.s3_bucket_name}.s3.amazonaws.com/${fileName}`
            };
            console.log('returnData:', returnData)
            res.send(returnData);
        });
    });
        
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
