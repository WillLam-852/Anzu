import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { Typography } from '@mui/material'
import Box from '@mui/material/Box'
import ResponsiveAppBar from '../components/ResponsiveAppBar'
import Card from '../components/Card'
import { useLocation } from 'react-router-dom'

const Page = () => {
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
            rows.push(<Card card_data={card_data} key={card._id}/>)
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
                <Card card_data={{ page_id: currentPage._id }} edit_mode="新增"/>
                :
                null
            }
        </Box>
    )
}

export default Page