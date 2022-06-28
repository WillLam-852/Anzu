// keys.js - figure out what set of credentials to return

module.exports = {
    mongoURI: process.env.MONGO_URL,
    aws_secret_key_id: process.env.AWS_ACCESS_KEY_ID,
    aws_secret_access_key: process.env.AWS_SECRET_ACCESS_KEY,
    s3_bucket_name: process.env.S3_BUCKET_NAME
}