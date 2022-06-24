import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { Typography } from '@mui/material'
import Box from '@mui/material/Box'
import ResponsiveAppBar from '../components/ResponsiveAppBar'
import Card from '../components/Card'
import { useLocation } from 'react-router-dom'
import { Buffer } from 'buffer'
import http from '../http-common'

const Page = () => {
    const [images, setImages] = useState([])
    const [titles, setTitles] = useState([])
    const [currentPage, setCurrentPage] = useState(undefined)
    const [editMode, setEditMode] = useState(false)
    const pages = useSelector((state) => state.pages)
    const location = useLocation()

    useEffect(() => {
        let path_title = location.pathname.slice(1)
        if (location.pathname.slice(1, 5) === 'Edit') {
            path_title = location.pathname.slice(6)
            setEditMode(true)
        }
        setTitles(pages.titles)
        setCurrentPage(pages.pages.find( element => element.title === path_title))
    }, [pages, location.pathname])

    useEffect(() => {
        const get_images = async () => {
            const res = await http.get("/get_images")
            console.log(res.data.images)
            setImages(res.data.images)
        }
        get_images()
    }, [])
    
    const get_cards = (cards) => {
        var rows = []
        cards.forEach( card => {
            let card_data = {
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

    const get_images = (images) => {
        var rows = []
        images.forEach( image => {
            rows.push(
                <img src={`data:${image.img.contentType};base64,${Buffer.from(image.img.data, 'binary').toString('base64')}`} alt=''/>
            )
        })
        return rows
    }

    return (
        <Box>
            <ResponsiveAppBar titles={titles} edit_mode={editMode} />
            <Box sx={{ pb: 3 }}>
                <Typography variant='h3'>{currentPage ? currentPage.title : null}</Typography>
            </Box>
            <Box sx={{ pb: 3 }}>
                <Typography variant='h3'>Banner Image</Typography>
            </Box>
            {currentPage ? get_cards(currentPage.cards) : null}
            {currentPage && editMode ? 
                <Box maxWidth={700}>
                    <Card card_data={{ page_id: currentPage._id }} edit_mode="新增"/>
                </Box>
                :
                null
            }
            <h1>Uploaded Images</h1>
            <div>
                {
                    get_images(images)
                }
            </div>
        </Box>
    )
}

export default Page