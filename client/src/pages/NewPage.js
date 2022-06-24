import React, { useState } from 'react'
import { Stack, Typography } from '@mui/material'
import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import { styled } from '@mui/material/styles'
import { useHistory } from "react-router-dom"
import http from '../http-common'

const Input = styled('input')({
    display: 'none',
})

const NewPage = () => {
    const [editingTitle, setEditingTitle] = useState('')
    const [currentButtonImageFile, setCurrentButtonImageFile] = useState(undefined)
    const [previewButtonImage, setPreviewButtonImage] = useState(undefined)
    const [warning, setWarning] = useState(undefined)
    const history = useHistory()

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
            const res = await http.post("/new_page", new_page)
            if (res.data.success) {
                const res_image = await uploadButtonImage(res.data.page_id)
                if (res_image.data.success) {
                    setWarning(undefined)
                    history.push("/Edit")
                } else {
                    setWarning(`上傳相片失敗 ${res_image.data.error}`)
                }
            } else {
                setWarning(`新增頁面失敗 ${res.data.error}`)
            }
        } catch (err) {
            setWarning(`新增頁面失敗 ${err}`)
        }
    }

    const handleCancelAction = () => {
        history.push("/Edit")
    }

    const select_button_image = (e) => {
        setCurrentButtonImageFile(e.target.files[0])
        setPreviewButtonImage(URL.createObjectURL(e.target.files[0]))
    }

    return (
        <Box sx={styles.box}>
            <Box sx={{ pb: 2 }}>
                <Typography variant='h3'>
                    新頁面
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
                    <img src={previewButtonImage} alt="" />
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
        height: 300,
        width: null,
    },
    button: {
        m: 1
    }
}

export default NewPage