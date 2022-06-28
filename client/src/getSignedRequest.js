import http from './http-common'

const getSignedRequest = async (file, cb) => {
    const body = {
        file_name: encodeURIComponent(file.name),
        file_type: file.type
    }
    try {
        const res = await http.get(`/sign-s3?file-name=${encodeURIComponent(file.name)}&file-type=${file.type}`, body)
        if (res.status === 200) {
            const xhr = new XMLHttpRequest();
            xhr.open('PUT', res.data.signedRequest);
            xhr.onreadystatechange = async () => {
                if (xhr.readyState === 4) {
                    if (xhr.status === 200) {
                        await cb(res.data.url)
                    } else {
                        throw Error(`上傳相片失敗`)
                    }
                }
            }
            xhr.send(file)
        } else {
            throw Error(`連接不到S3 server`)
        }
    } catch(err) {
        throw Error
    }
}

export default getSignedRequest
