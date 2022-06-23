import React, { Component, useEffect } from 'react'
import { useSelector } from 'react-redux'
import http from '../http-common'

const TestPage = () => {
    const pages = useSelector((state) => state.pages)

    useEffect(() => {
        console.log('TestPage:', pages.pages, pages.titles)
    }, [pages])

    return (
        <div>
            TestPage
        </div>
    )
}

export default TestPage

// export default class FilesUploadComponent extends Component {
//     constructor(props) {
//         super(props);
//         this.onFileChange = this.onFileChange.bind(this);
//         this.onSubmit = this.onSubmit.bind(this);
//         this.state = {
//             profileImg: ''
//         }
//     }
//     onFileChange(e) {
//         this.setState({ profileImg: e.target.files[0] })
//     }
//     onSubmit(e) {
//         e.preventDefault()
//         const formData = new FormData()
//         formData.append('profileImg', this.state.profileImg)
//         http.post("/upload_image", formData, {
//         }).then(res => {
//             console.log(res)
//         })
//     }

//     render() {
//         return (
//             <div className="container">
//                 <div className="row">
//                     <form onSubmit={this.onSubmit}>
//                         <div className="form-group">
//                             <input type="file" onChange={this.onFileChange} />
//                         </div>
//                         <div className="form-group">
//                             <button className="btn btn-primary" type="submit">Upload</button>
//                         </div>
//                     </form>
//                 </div>
//             </div>
//         )
//     }
// }