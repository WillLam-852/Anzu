import React from 'react'
import { Typography } from '@mui/material'
import Box from '@mui/material/Box'
import ResponsiveAppBar from '../components/ResponsiveAppBar'
import Card from '../components/Card'

const Page = ({ titles, title, page, edit_mode=false }) => {
    const get_cards = (cards) => {
        var rows = []
        cards.forEach( card => {
            let card_data = card
            card_data.page_id = page._id
            rows.push(<Card card_data={card_data} edit_mode={edit_mode ? "編輯" : undefined} key={card._id}/>)
        })
        return rows
    }

    return (
        <Box>
            <ResponsiveAppBar titles={titles} edit_mode={edit_mode} />
            <Box sx={{ pb: 3 }}>
                <Typography variant='h3'>{title}</Typography>
            </Box>
            <Box sx={{ pb: 3 }}>
                <Typography variant='h3'>Banner Image</Typography>
            </Box>
            {page ? get_cards(page.cards) : null}
            {edit_mode ? 
                <Card card_data={{ page_id: page._id }} edit_mode="新增"/>
                :
                null
            }
        </Box>
    )
}

export default Page