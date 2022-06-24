import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { Stack, Typography } from '@mui/material'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import ResponsiveAppBar from '../components/ResponsiveAppBar'
import Card from '../components/Card'
import { styled } from '@mui/material/styles'
import { useLocation } from 'react-router-dom'
import { Buffer } from 'buffer'
import http from '../http-common'

const Input = styled('input')({
    display: 'none',
})

const Page = () => {
    const [titles, setTitles] = useState([])
    const [currentPage, setCurrentPage] = useState(undefined)
    const [editMode, setEditMode] = useState(false)
    const [currentImageFile, setCurrentImageFile] = useState(undefined)
    const [previewImage, setPreviewImage] = useState(undefined)
    const [warning, setWarning] = useState(undefined)
    const location = useLocation()

    const pages = useSelector((state) => state.pages)

    useEffect(() => {
        let path_title = location.pathname.slice(1)
        if (location.pathname.slice(1, 5) === 'Edit') {
            path_title = location.pathname.slice(6)
            setEditMode(true)
        }
        setTitles(pages.titles)
        setCurrentPage(pages.pages.find( element => element.title === path_title))
    }, [pages, location.pathname])
    
    const get_cards = (cards) => {
        var rows = []
        cards.forEach( card => {
            let card_data = {
                card_id: card._id,
                title: card.title,
                order: card.order,
                image: card.image,
                description: card.description,
                page_id: currentPage._id
            }
            rows.push(
                <Box maxWidth={700}>
                    <Card card_data={card_data} edit_mode={editMode? "編輯" : undefined} key={card._id}/>
                </Box>
            )
        })
        return rows
    }

    const select_image = (e) => {
        setCurrentImageFile(e.target.files[0])
        setPreviewImage(URL.createObjectURL(e.target.files[0]))
    }

    const handleUploadImageAction = async (e) => {
        e.preventDefault()
        if (!currentImageFile) {
            setWarning('請選擇照片')
            return
        }
        const formData = new FormData()
        formData.append('image', currentImageFile)
        formData.append('page_id', currentPage._id)
        const res = await http.post("/upload_banner_image", formData)
        if (res.data.success) {
            setWarning(undefined)
            setCurrentImageFile(undefined)
            setPreviewImage(undefined)
            window.location.reload(true)
        } else {
            setWarning(`上傳相片失敗 ${res.data.error}`)
        }
    }

    return (
        <Box>
            <ResponsiveAppBar titles={titles} edit_mode={editMode} />
            <Box sx={{ pb: 3 }}>
                <Typography variant='h3'>{currentPage ? currentPage.title : null}</Typography>
            </Box>
            <Box sx={{ pb: 3 }}>
                {currentPage && currentPage.banner_image && !previewImage ?
                    <img 
                        style={{ maxWidth: 400 }}
                        src={`data:${currentPage.banner_image.img.contentType};base64,${Buffer.from(currentPage.banner_image.img.data, 'binary').toString('base64')}`} 
                    />
                :
                    null
                }
                {currentPage && editMode?
                    <Box>
                        {previewImage && (
                            <img src={previewImage} alt="" style={{ maxWidth: 400 }} />
                        )}
                        <Stack sx={{ pb: 1 }} spacing={2} direction="row">
                            {previewImage ?
                                <Box>
                                    <Button variant="contained" component="span" onClick={handleUploadImageAction}>
                                        上傳照片
                                    </Button>
                                </Box>
                            :
                            null}
                            <label htmlFor="image">
                                <Input accept="image/*" id="image" type="file" name='image' onChange={select_image} />
                                <Box>
                                    <Button variant="outlined" component="span">
                                        {previewImage || currentPage.banner_image ? "更改照片" : "選擇照片"}
                                    </Button>
                                </Box>
                            </label>
                            {previewImage ?
                                <Box>
                                    <Button variant="outlined" component="span" color="warning" onClick={() => {
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
                :
                    null
                }
            </Box>
            {currentPage ? get_cards(currentPage.cards) : null}
            {currentPage && editMode ? 
                <Box maxWidth={700}>
                    <Card card_data={{ page_id: currentPage._id }} edit_mode="新增"/>
                </Box>
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
    )
}

export default Page