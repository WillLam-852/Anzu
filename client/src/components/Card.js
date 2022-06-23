import React, { useState, useEffect } from 'react'
import { Stack, Typography } from '@mui/material'
import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import { styled } from '@mui/material/styles'
import http from '../http-common'

const Input = styled('input')({
    display: 'none',
})

const Card = ({ card_data, edit_mode=undefined }) => {
    const [isEdit, setIsEdit] = useState(false)
    const [editingTitle, setEditingTitle] = useState(undefined)
    const [editingDescription, setEditingDescription] = useState(undefined)
    const [currentImageFile, setCurrentImageFile] = useState(undefined)
    const [previewImage, setPreviewImage] = useState(undefined)
    const [card, setCard] = useState(undefined)
    const [warning, setWarning] = useState(undefined)

    useEffect(() => {
        setCard(card_data)
    }, [card_data]) 

    const handleEditAction = () => {
        if (card) {
            setEditingTitle(card.title)
            setEditingDescription(card.description)
        }
        setIsEdit(true)
    }

    const handleConfirmAction = async () => {
        if (card._id) {
            const new_card = {
                _id: card._id,
                order: 4,
                title: editingTitle,
                description: editingDescription,
                page_id: card.page_id
            }
            try {
                const res = await http.post("/edit_card", new_card)
                console.log(res.data)
                if (res.data.success) {
                    setCard(new_card)
                    setWarning(undefined)
                    setIsEdit(false)
                } else {
                    setWarning(`更改資料失敗 ${res.data.error}`)
                }
            } catch (err) {
                setWarning(`更改資料失敗 ${err}`)
            }
        } else {
            // const new_card = {
            //     order: 4,
            //     title: editingTitle,
            //     image: currentImageFile,
            //     description: editingDescription,
            //     page_id: card.page_id
            // }
            console.log('currentImageFile:', currentImageFile)
            let formData = new FormData()
            formData.append("file", currentImageFile)
            try {
                // const res = await http.post("/new_card", new_card)
                // if (res.data.success) {
                //     setCard(new_card)
                //     setWarning(undefined)
                //     setIsEdit(false)
                // } else {
                //     setWarning(`新增資料失敗 ${res.data.error}`)
                // }
                const res_img = await http.post("/upload_image", formData, {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    }
                })
                console.log('res_img:', res_img)
            } catch (err) {
                setWarning(`新增資料失敗 ${err}`)
            }
        }
    }

    const handleCancelAction = () => {
        setIsEdit(false)
    }

    // const upload = (file) => {
    //     let formData = new FormData()
    //     formData.append("file", file);
    //     return http.post("/upload_image", formData, {
    //         headers: {
    //             "Content-Type": "multipart/form-data",
    //         }
    //     })
    // }

    // const get_image = () => http.get("/get_image")

    const select_image = (e) => {
        setCurrentImageFile(e.target.files[0])
        setPreviewImage(URL.createObjectURL(e.target.files[0]))
    }
    
    return (
        isEdit ? 
            <Box sx={styles.box}>
                <Box sx={{ pb: 1.5 }}>
                    <TextField 
                        label="標題" 
                        value={editingTitle}
                        onChange={(e) => setEditingTitle(e.target.value)}
                        variant="outlined" 
                    />
                </Box>
                <Box sx={{ pb: 1.5 }}>
                    {previewImage && (
                        <img src={previewImage} alt="" />
                    )}
                    <Stack sx={{ pb: 1 }} spacing={2} direction="row">
                        <label htmlFor="contained-button-file">
                            <form action="/api/upload_image" method="post" enctype="multipart/form-data">
                                <Input accept="image/*" id="contained-button-file" type="file" name='image' onChange={select_image} />
                            </form>
                            <Box>
                                <Button variant="contained" component="span">
                                    {previewImage ? "更改照片" : "選擇照片"}
                                </Button>
                            </Box>
                        </label>
                        {previewImage ?
                            <Box>
                                <Button variant="outlined" component="span" onClick={() => {
                                    setCurrentImageFile(undefined)
                                    setPreviewImage(undefined)
                                }}>
                                    刪除照片
                                </Button>
                            </Box>
                        :
                        null}
                    </Stack>
                </Box>
                <Box sx={{ pt: 1.5 }}>
                    <TextField
                        style={{width: 400, flex: 1}}
                        label="文字 (可留空)"
                        multiline
                        rows={4}
                        value={editingDescription}
                        onChange={(e) => setEditingDescription(e.target.value)}
                        variant="outlined"
                    />
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
        :
            <Box sx={styles.box}>
                <Stack sx={{ pb: 1 }} spacing={2} direction="row">
                    {card?
                        <Typography variant="h5">
                            {card.title}
                        </Typography>
                        :
                        null
                    }
                    {edit_mode ?
                        <Button variant="outlined" size="small" onClick={handleEditAction}>{edit_mode}</Button>
                        :
                        null
                    }
                </Stack>
                <Box>
                    {card?
                        <img 
                            style={styles.img} 
                            src={card.image}
                            alt={card.title} />
                        :
                        null
                    }
                    {card?
                        <Box>
                            {card.description}
                        </Box>
                        :
                        null
                    }
                </Box>
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

export default Card