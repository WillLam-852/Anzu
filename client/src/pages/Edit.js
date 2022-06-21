import React from 'react'
import Box from '@mui/material/Box'
import Card from '../components/Card'

const EditPage = () => {
    return (
        <Box>
            <Card init_title="茶道" image={'https://images.unsplash.com/photo-1551963831-b3b1ca40c98e'} init_description="選擇喜歡浴衣款式、配襯頭飾
    於傳統和室中留下倩影" edit_page/>
            <Card init_title="茶道" image={'https://images.unsplash.com/photo-1551963831-b3b1ca40c98e'} edit_page/>
            <Card init_title="茶道" image={'https://images.unsplash.com/photo-1551963831-b3b1ca40c98e'} edit_page/>
        </Box>
    )
}

export default EditPage