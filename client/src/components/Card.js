import React, { useState, useEffect } from 'react'
import { Stack, Typography } from '@mui/material'
import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import { styled } from '@mui/material/styles'
import http from '../http-common'
import AlertDialog from './AlertDialog'
import getSignedRequest from '../getSignedRequest'

const Input = styled('input')({
    display: 'none',
})

const Card = ({ card_data, edit_mode=undefined }) => {
    const [isEdit, setIsEdit] = useState(false)
    const [isNewCard, setIsNewCard] = useState(false)
    const [isDeleted, setIsDeleted] = useState(false)
    const [isImageDeleted, setIsImageDeleted] = useState(false)
    const [card, setCard] = useState(undefined)
    const [editingTitle, setEditingTitle] = useState(undefined)
    const [editingDescription, setEditingDescription] = useState(undefined)
    const [currentImageFile, setCurrentImageFile] = useState(undefined)
    const [previewImage, setPreviewImage] = useState(undefined)
    const [warning, setWarning] = useState(undefined)

    useEffect(() => {
        setCard(card_data)
        if (!card_data.card_id) {
            setIsNewCard(true)
        }
    }, [card_data])

    const handleEditAction = () => {
        if (card) {
            setEditingTitle(card.title)
            setEditingDescription(card.description)
            if (card.image) {
                setIsImageDeleted(false)
            } else {
                setIsImageDeleted(true)
            }
        }
        setIsEdit(true)
    }

    const handleConfirmAction = async () => {
        try {
            if (currentImageFile) {
                if (process.env.NODE_ENV === 'production') {
                    await getSignedRequest(currentImageFile, update_card)
                }
            } else {
                await update_card(isImageDeleted ? null : undefined)
            }
        } catch (err) {
            isNewCard ? setWarning(`新增資料失敗 ${err}`) : setWarning(`更改資料失敗 ${err}`)
        }
    }

    const update_card = async (image_url) => {
        const new_card = {
            page_id: card.page_id,
            card_id: card.card_id,
            title: editingTitle,
            image: image_url,
            description: editingDescription,
        }
        try {
            const res = isNewCard ? await http.post("/add_card", new_card) : await http.post("/edit_card", new_card)
            if (res.data.success) {
                window.location.reload(true)
            }
        } catch (err) {
            throw err
        }
    }

    const handleCancelAction = () => {
        setIsEdit(false)
    }

    const handleDeleteAction = async () => {
        try {
            const res = await http.post("/delete_card", { 
                page_id: card.page_id,  
                _id: card.card_id
            })
            if (res.data.success) {
                setCard({ page_id: card.page_id })
                setWarning(undefined)
                setIsEdit(false)
                setIsDeleted(true)
            } else {
                setWarning(`新增資料失敗 ${res.data.error}`)
            }
        } catch (err) {
            setWarning(`新增資料失敗 ${err}`)
        }
    }

    const select_image = (e) => {
        setCurrentImageFile(e.target.files[0])
        setPreviewImage(URL.createObjectURL(e.target.files[0]))
        setIsImageDeleted(false)
    }
    
    return (
        !isDeleted ?
            isEdit ? 
                <Box sx={styles.box}>
                    <Box sx={{ pb: 1.5 }}>
                        <TextField 
                            label="標題 (可留空)" 
                            value={editingTitle}
                            onChange={(e) => setEditingTitle(e.target.value)}
                            variant="outlined" 
                        />
                    </Box>
                    {!isImageDeleted ? 
                        previewImage ? 
                            <img src={previewImage} alt="" style={styles.img} />
                        :
                            card.image ?
                                <img 
                                    style={styles.img} 
                                    src={card.image}
                                    alt={card.card_id} 
                                />
                            :
                                null
                    :
                        null
                    }
                    <Stack sx={{ pb: 1 }} spacing={2} direction="row">
                        <label htmlFor="card_image">
                            <Input accept="image/*" id="card_image" type="file" name='image' onChange={select_image} />
                            <Box>
                                <Button variant="outlined" component="span">
                                    {previewImage || card.image? "更改照片" : "選擇照片"}
                                </Button>
                            </Box>
                        </label>
                        {previewImage || card.image ?
                            <Box>
                                <Button variant="outlined" component="span" color="warning" onClick={() => {
                                    setCurrentImageFile(undefined)
                                    setPreviewImage(undefined)
                                    setIsImageDeleted(true)
                                }}>
                                    刪除照片
                                </Button>
                            </Box>
                        :
                        null}
                    </Stack>
                    <Box sx={{ pt: 1.5 }}>
                        <TextField
                            style={{ width: 700, flex: 1 }}
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
                    {!isNewCard?
                        <AlertDialog title="刪除" sx={styles.button} variant="contained" color="warning" onClick={handleDeleteAction}/>
                        :
                        null
                    }
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
                    {card && card.title?
                        <Typography variant="h4">
                            {card.title}
                        </Typography>
                        :
                        null
                    }
                    <Box>
                        {card && card.image?
                            <img 
                                style={styles.img} 
                                src={card.image}
                                alt={card.card_id} />
                            :
                            null
                        }
                        {card && card.description?
                            <Box sx={{ pt: 2 }}>
                                <Typography component={'span'} paragraph>
                                    {card.description.split("\n").map((i,key) => {
                                        return <div key={key}>{i}</div>;
                                    })}
                                </Typography>
                            </Box>
                            :
                            null
                        }
                    </Box>
                    {edit_mode ?
                        <Button variant="outlined" size="small" sx={{ mt: 1, mb: 3 }} onClick={handleEditAction}>{edit_mode}</Button>
                        :
                        null
                    }
                </Box>
        :
        null
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

export default Card