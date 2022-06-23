import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useLocation } from 'react-router-dom'
import { Typography } from '@mui/material'
import Box from '@mui/material/Box'
import ButtonBase from '@mui/material/ButtonBase'
import { styled } from '@mui/material/styles'
import ResponsiveAppBar from '../components/ResponsiveAppBar'

const Home = () => {
    const [titles, setTitles] = useState([])
    const [editMode, setEditMode] = useState(false)
    const pages = useSelector((state) => state.pages)
    const location = useLocation()

    useEffect(() => {
        if (location.pathname.slice(1, 5) === 'Edit') {
            setEditMode(true)
        }
        setTitles(pages.titles)
    }, [pages, location.pathname])

    const ImageButton = styled(ButtonBase)(({ theme }) => ({
        position: 'relative',
        height: 200,
        [theme.breakpoints.down('sm')]: {
            width: '100% !important', // Overrides inline-style
            height: 100,
        },
        '&:hover, &.Mui-focusVisible': {
            zIndex: 1,
            '& .MuiImageBackdrop-root': {
                opacity: 0.15,
            },
            '& .MuiImageMarked-root': {
                opacity: 0,
            },
            '& .MuiTypography-root': {
                border: '4px solid currentColor',
            },
        },
    }));

    const ImageSrc = styled('span')({
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        backgroundSize: 'cover',
        backgroundPosition: 'center 40%',
    });

    const Image = styled('span')(({ theme }) => ({
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: theme.palette.common.white,
    }));

    const ImageBackdrop = styled('span')(({ theme }) => ({
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        backgroundColor: theme.palette.common.black,
        opacity: 0.4,
        transition: theme.transitions.create('opacity'),
    }));

    const ImageMarked = styled('span')(({ theme }) => ({
        height: 3,
        width: 18,
        backgroundColor: theme.palette.common.white,
        position: 'absolute',
        bottom: -2,
        left: 'calc(50% - 9px)',
        transition: theme.transitions.create('opacity'),
    }));

    return (
        <Box>
            <ResponsiveAppBar titles={titles} edit_mode={editMode} />
            <Box sx={{ pb: 3 }}>
                <Typography variant='h3'>Banner Image</Typography>
            </Box>
            <Box>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', minWidth: 300, width: '100%' }}>
                    {titles.map((title) => (
                        <ImageButton
                            focusRipple
                            href={title}
                            key={title}
                            style={{
                                width: '50%',
                                minHeight: '200px'
                            }}
                        >
                            {/* <ImageSrc style={{ backgroundImage: `url(${image.url})` }} /> */}
                            <ImageBackdrop className="MuiImageBackdrop-root" />
                            <Image>
                                <Typography
                                    component="span"
                                    variant="subtitle1"
                                    color="inherit"
                                    sx={{
                                        position: 'relative',
                                        p: 4,
                                        pt: 2,
                                        pb: (theme) => `calc(${theme.spacing(1)} + 6px)`,
                                    }}
                                >
                                    {title}
                                    <ImageMarked className="MuiImageMarked-root" />
                                </Typography>
                            </Image>
                        </ImageButton>
                    ))}
                </Box>
            </Box>
            <Box sx={{ pt: 2 }}>
                <Typography variant='h3'>Contact Us</Typography>
                <Typography variant='h3'>Anzu</Typography>
                <Typography variant='h6'>1605 Champion Bldg</Typography>
                <Typography variant='h6'>287-291 Des Voeux Road Central</Typography>
                <Typography variant='h6'>Sheung Wan</Typography>
                <Typography variant='h6'>上環德輔道中287-291長達大廈1605室</Typography>
                <Typography variant='h6'>email: anzuhk@yahoo.com</Typography>
                <Typography variant='h6'>WhatsApp to 44459808</Typography>
            </Box>
            <Box>
                Map Image
            </Box>
        </Box>
    )
}

export default Home