import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useLocation, useNavigate } from 'react-router-dom'
import { Stack, Typography } from '@mui/material'
import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import { styled } from '@mui/material/styles'
import http from '../http-common'
import AlertDialog from '../components/AlertDialog'
import Card from '../components/Card'
import ResponsiveAppBar from '../components/ResponsiveAppBar'
import getSignedRequest from '../getSignedRequest'


const Input = styled('input')({
    display: 'none',
})

const Page = () => {
    const [titles, setTitles] = useState([])
    const [currentPage, setCurrentPage] = useState(undefined)
    const [editMode, setEditMode] = useState(false)
    const [isEdittingTitle, setIsEdittingTitle] = useState(false)
    const [editingTitle, setEditingTitle] = useState('')
    const [isImageDeleted, setIsImageDeleted] = useState(false)
    const [currentImageFile, setCurrentImageFile] = useState(undefined)
    const [previewImage, setPreviewImage] = useState(undefined)
    const location = useLocation()
    const navigate = useNavigate()

    const pages = useSelector((state) => state.pages)

    useEffect(() => {
        let path_title = decodeURIComponent(location.pathname.slice(1))
        if (location.pathname.slice(1, 5) === 'Edit') {
            path_title = decodeURIComponent(location.pathname.slice(6))
            setEditMode(true)
        }
        setTitles(pages.titles)
        setCurrentPage(pages.pages.find( element => element.title === path_title))
    }, [pages, location.pathname])

    useEffect(() => {
        if (currentPage && currentPage.banner_image) {
            setIsImageDeleted(false)
        } else {
            setIsImageDeleted(true)
        }
    }, [currentPage])
    
    const handleEditTitleAction = () => {
        setIsEdittingTitle(true)
        setEditingTitle(currentPage.title)
    }

    const handleConfirmTitleAction = async () => {
        const res = await http.post("/edit_title", {
            page_id: currentPage._id,
            title: editingTitle
        })
        if (res.data.success) {
            setIsEdittingTitle(false)
            navigate(`/Edit/${editingTitle}`)
            window.location.reload(true)
        } else {
            alert(`更改頁面標題 (${res.data.error})`)
        }
    }

    const handleCancelTitleAction = () => {
        setIsEdittingTitle(false)
    }

    const handleDeletePageAction = async () => {
        const res = await http.post("/delete_page", {
            page_id: currentPage._id
        })
        if (res.data.success) {
            navigate(`/Edit`)
            window.location.reload(true)
        } else {
            alert(`刪除頁面失敗 (${res.data.error})`)
        }
    }

    ///// Image-related Functions /////

    const show_banner_image = () => {
        if (previewImage) {
            return <img style={sxs.img} src={previewImage} alt="" />
        } else if (currentPage && currentPage.banner_image) {
            return <img style={sxs.img} src={currentPage.banner_image} alt="" />
        }
        return null
    }

    const select_banner_image = (e) => {
        if (e.target.files.length !== 0) {
            setCurrentImageFile(e.target.files[0])
            setPreviewImage(URL.createObjectURL(e.target.files[0]))
        }
    }

    const handleUploadImageAction = async (e) => {
        e.preventDefault()
        if (!currentImageFile) {
            alert('請選擇照片')
            return
        }
        try {
            await getSignedRequest(currentImageFile, upload_banner_image)
        } catch (err) {
            alert(`上傳照片失敗 (${err})`)
        }
    }

    const upload_banner_image = async (image_url) => {
        try {
            const res = await http.post("/upload_banner_image", {
                page_id: currentPage._id,
                banner_image: image_url
            })
            if (res.data.success) {
                window.location.reload(true)
            }
        } catch (err) {
            throw(err)
        }
    }

    const delete_banner_image = async (image_url) => {
        if (!isImageDeleted) {
            try {
                const res = await http.post("/delete_banner_image", {
                    page_id: currentPage._id
                })
                if (res.data.success) {
                    window.location.reload(true)
                }
            } catch (err) {
                alert(err.message)
            }
        } else {
            setCurrentImageFile(undefined)
            setPreviewImage(undefined)
        }
    }


    ///// View-related Functions /////
    
    const show_title = () => {
        if (isEdittingTitle) {
            return (
                <Box>
                    <TextField 
                        sx={sxs.box}
                        label="頁面標題" 
                        value={editingTitle}
                        onChange={(e) => setEditingTitle(e.target.value)}
                        variant="outlined" 
                    />
                    <Stack sx={sxs.stack} spacing={2} direction="row">
                        <Button variant="contained" onClick={handleConfirmTitleAction}> 確定 </Button>
                        <Button variant="outlined" onClick={handleCancelTitleAction}> 取消 </Button>
                    </Stack>
                </Box>
            )
        } else {
            return (
                <Stack sx={sxs.stack} spacing={2} direction="row">
                    {currentPage && currentPage.title ? <Typography variant='h3'> {currentPage.title} </Typography> : null}
                    {editMode ? <Button variant="outlined" onClick={handleEditTitleAction}> 更改頁面標題 </Button> : null}
                </Stack>
            )
        }
    }

    const get_cards = (cards) => {
        var rows = []
        cards.forEach( card => {
            let card_data = {
                card_id: card._id,
                title: card.title,
                image: card.image,
                description: card.description,
                page_id: currentPage._id
            }
            rows.push(
                <Box maxWidth={700} key={card._id}>
                    <Card card_data={card_data} edit_mode={editMode? "編輯" : undefined} key={card._id}/>
                </Box>
            )
        })
        return rows
    }

    return (
        <Box>
            <ResponsiveAppBar titles={titles} edit_mode={editMode} />
            <Box sx={sxs.section}>
                {show_title()}
            </Box>
            <Box sx={sxs.section}>
                {show_banner_image()}
                <Stack sx={sxs.box} spacing={2} direction="row">
                    {previewImage ? <Button variant="contained" component="span" onClick={handleUploadImageAction}> 上傳照片 </Button> : null}
                    <label htmlFor="image">
                        <Input accept="image/*" id="image" type="file" name='image' onChange={select_banner_image} />
                        <Button variant="outlined" component="span">
                            {previewImage || (currentPage && currentPage.banner_image)? "更改照片" : "選擇照片"}
                        </Button>
                    </label>
                    {previewImage || (currentPage && currentPage.banner_image) ? <AlertDialog title="刪除照片" variant="contained" color="warning" onClick={delete_banner_image} /> : null }
                </Stack>
            </Box>
            {currentPage ? get_cards(currentPage.cards) : null}
            {currentPage && editMode ? 
                <Box>
                    <Card card_data={{ page_id: currentPage._id }} edit_mode="新增" />
                    <AlertDialog title="刪除頁面" variant="contained" color="warning" onClick={handleDeletePageAction}/>
                </Box>
            :
                null
            }
        </Box>
    )
}

const sxs = {
    section: {
        pb: 3
    },
    box: {
        pb: 2
    },
    stack: {
        alignItems: 'center'
    },
    img: {
        maxWidth: '100%',
        maxHeight: 400,
        paddingBottom: 10
    }
}

export default Page