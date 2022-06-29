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
import getSignedRequest from '../getSignedRequest'

const Input = styled('input')({
    display: 'none',
})

const NewPage = () => {
    const [titles, setTitles] = useState([])
    const [editingTitle, setEditingTitle] = useState('')
    const [currentButtonImageFile, setCurrentButtonImageFile] = useState(undefined)
    const [previewButtonImage, setPreviewButtonImage] = useState(undefined)
    const pages = useSelector((state) => state.pages)
    const navigate = useNavigate()

    useEffect(() => {
        setTitles(pages.titles)
    }, [pages])

    const select_button_image = (e) => {
        if (e.target.files.length !== 0) {
            setCurrentButtonImageFile(e.target.files[0])
            setPreviewButtonImage(URL.createObjectURL(e.target.files[0]))
        }
    }

    const handleConfirmAction = async (e) => {
        e.preventDefault()
        if (editingTitle === '') {
            alert('請輸入頁面標題')
            return
        }
        if (!currentButtonImageFile) {
            alert('請選擇主頁按鈕照片')
            return
        }
        try {
            await getSignedRequest(currentButtonImageFile, create_new_page)
        } catch (err) {
            alert(`新增頁面失敗 (${err})`)
        }
    }

    const create_new_page = async (image_url) => {
        const new_page = {
            title: editingTitle,
            button_image: image_url
        }
        try {
            const res = await http.post("/add_page", new_page)
            if (res.data.success) {
                navigate("/Edit")
                window.location.reload(true)
            }
        } catch (err) {
            throw err
        }
    }

    const handleCancelAction = () => {
        navigate("/Edit")
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