import React, { useState, useEffect } from 'react'
import { Stack, Typography } from '@mui/material'
import { useSelector } from 'react-redux'
import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import { styled } from '@mui/material/styles'
import { useNavigate } from "react-router-dom"
import http from '../http-common'
import ResponsiveAppBar from '../components/ResponsiveAppBar'

const Input = styled('input')({
    display: 'none',
})

const NewPage = () => {
    const [titles, setTitles] = useState([])
    const [editingTitle, setEditingTitle] = useState('')
    const [currentButtonImageFile, setCurrentButtonImageFile] = useState(undefined)
    const [previewButtonImage, setPreviewButtonImage] = useState(undefined)
    const [warning, setWarning] = useState(undefined)
    const pages = useSelector((state) => state.pages)
    const navigate = useNavigate()

    useEffect(() => {
        setTitles(pages.titles)
    }, [pages])

    const uploadButtonImage = async (page_id) => {
        const formData = new FormData()
        formData.append('image', currentButtonImageFile)
        formData.append('page_id', page_id)
        const res = await http.post("/upload_button_image", formData)
        return res
    }

    const handleConfirmAction = async (e) => {
        e.preventDefault()
        if (editingTitle === '') {
            setWarning('請輸入頁面標題')
            return
        }
        if (!currentButtonImageFile) {
            setWarning('請選擇主頁按鈕照片')
            return
        }
        const new_page = {
            title: editingTitle,
        }
        try {
            // const res = await http.post("/new_page", new_page)
            // if (res.data.success) {
            // if (process.env.NODE_ENV === 'development') {
            //     const res_image = await uploadButtonImage(res.data.page_id)
            //     console.log(res_image.data)
            //     if (res_image.data.success) {
            //         navigate("/Edit")
            //         window.location.reload(true)
            //     } else {
            //         setWarning(`上傳相片失敗 ${res_image.data.error}`)
            //     }
            // } else if (process.env.NODE_ENV === 'production') {
            await getSignedRequest(currentButtonImageFile)
            // }
            // } else {
            //     setWarning(`新增頁面失敗 ${res.data.error}`)
            // }
        } catch (err) {
            setWarning(`新增頁面失敗 ${err}`)
        }
    }

    const handleCancelAction = () => {
        navigate("/Edit")
    }

    const select_button_image = (e) => {
        setCurrentButtonImageFile(e.target.files[0])
        setPreviewButtonImage(URL.createObjectURL(e.target.files[0]))
    }

    const getSignedRequest = async (file) => {
        // const xhr = new XMLHttpRequest()
        const body = {
            file_name: encodeURIComponent(file.name),
            file_type: file.type
        }
        const res = await http.get(`/sign-s3?file-name=${encodeURIComponent(file.name)}&file-type=${file.type}`, body)
        if (res.status === 200) {
            uploadFile(file, res.data.signedRequest, res.data.url);
        }
        
        // xhr.onreadystatechange = () => {
        //     if (xhr.readyState === 4) {
        //         if (xhr.status === 200) {
        //             const res = JSON.parse(xhr.responseText)
        //             uploadFile(file, res.signedRequest, res.url);
        //         } else {
        //             alert('Could not get signed URL.');
        //         }
        //     }
        // };
        // xhr.send();
    }

    const uploadFile = (file, signedRequest, url) => {
        console.log(signedRequest, url)
        const xhr = new XMLHttpRequest();
        xhr.open('PUT', signedRequest);
        xhr.onreadystatechange = () => {
          if(xhr.readyState === 4){
            console.log(xhr)
            if(xhr.status === 200){
              document.getElementById('preview').src = url;
              document.getElementById('avatar-url').value = url;
            }
            else{
              alert('Could not upload file.');
            }
          }
        };
        xhr.send(file);
      }

    return (
        <Box sx={styles.box}>
            <ResponsiveAppBar titles={titles} edit_mode={true} />
            <Box sx={{ pb: 2 }}>
                <Typography variant='h3'>
                    新增頁面
                </Typography>
            </Box>
            <Box sx={{ pb: 1.5 }}>
                <TextField 
                    label="標題" 
                    value={editingTitle}
                    onChange={(e) => setEditingTitle(e.target.value)}
                    variant="outlined" 
                />
            </Box>
            <Box sx={{ pb: 1.5 }}>
                {previewButtonImage && (
                    <img src={previewButtonImage} alt="" style={styles.img} />
                )}
                <Stack sx={{ pb: 1 }} spacing={2} direction="row">
                    <label htmlFor="image">
                        <Input accept="image/*" id="image" type="file" name='image' onChange={select_button_image} />
                        <Box>
                            <Button variant="contained" component="span">
                                {previewButtonImage ? "更改主頁按鈕照片" : "選擇主頁按鈕照片"}
                            </Button>
                        </Box>
                    </label>
                    {previewButtonImage ?
                        <Box>
                            <Button variant="outlined" component="span" color="warning" onClick={() => {
                                setCurrentButtonImageFile(undefined)
                                setPreviewButtonImage(undefined)
                            }}>
                                刪除主頁按鈕照片
                            </Button>
                        </Box>
                    :
                    null}
                </Stack>
            </Box>
            <Button sx={styles.button} variant="contained" onClick={handleConfirmAction}>確定</Button>
            <Button sx={styles.button} variant="outlined" onClick={handleCancelAction}>取消</Button>
            {warning ? 
                <Box>
                    <Typography variant='h7' color='red'>{warning}</Typography>
                </Box>
            :
                null
            }
        </Box>
    )
}

const styles = {
    box: {
        pb: 5,
    },
    img: {
        maxWidth: '100%',
        maxHeight: 400,
    },
    button: {
        m: 1
    }
}

export default NewPage