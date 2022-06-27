import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useLocation } from 'react-router-dom'
import { Stack, Typography } from '@mui/material'
import Box from '@mui/material/Box'
import ButtonBase from '@mui/material/ButtonBase'
import { styled } from '@mui/material/styles'
import { Buffer } from 'buffer'
import ResponsiveAppBar from '../components/ResponsiveAppBar'
import home_banner from '../images/home_banner.jpeg'
import map_1 from '../images/map_1.PNG'
import map_2 from '../images/map_2.PNG'

const contact_us_text = `Anzu
1605 Champion Bldg
287-291 Des Voeux Road Central
Sheung Wan
上環德輔道中287-291長達大廈1605室
email : anzuhk@yahoo.com
WhatsApp to 44459808`


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
        height: 350,
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

    const MapImage = styled('span')(( { theme }) => ({
        position: 'relative',
        height: 350,
        [theme.breakpoints.down('sm')]: {
            width: '70% !important', // Overrides inline-style
        },
    }))

    const ImageSrc = styled('span')({
        // position: 'absolute',
        width: '100%',
        height: '100%',
        objectFit: 'contain',
        // maxWidth: '100%',
        // maxeight: '100%', 
        // left: 0,
        // right: 0,
        // top: 0,
        // bottom: 0,
        backgroundPosition: 'center 40%',
        backgroundRepeat: 'no-repeat'
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
        opacity: 0.2,
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
            <Box sx={{ maxWidth: 900 }}>
                <Box sx={{ pb: 3 }}>
                    <img src={home_banner} alt="Home Banner" width={"100%"} />
                </Box>
                <Box>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', minWidth: 300, width: '100%' }}>
                        {pages && pages.pages.map((page) => (
                            <ImageButton
                                focusRipple
                                href={page.title}
                                key={page.title}
                                style={{
                                    width: '50%',
                                    minHeight: '200px'
                                }}
                            >
                                {page.button_image ? 
                                    <ImageSrc style={{ backgroundImage: `url(${`data:${page.button_image.img.contentType};base64,${Buffer.from(page.button_image.img.data, 'binary').toString('base64')}`})` }} /> 
                                : 
                                    null
                                }
                                <ImageBackdrop className="MuiImageBackdrop-root" />
                                <Image>
                                    <Typography
                                        component="span"
                                        variant="h4"
                                        color="inherit"
                                        sx={{
                                            position: 'relative',
                                            p: 4,
                                            pt: 2,
                                            pb: (theme) => `calc(${theme.spacing(1)} + 6px)`,
                                        }}
                                    >
                                        {page.title}
                                        <ImageMarked className="MuiImageMarked-root" />
                                    </Typography>
                                </Image>
                            </ImageButton>
                        ))}
                    </Box>
                </Box>
                <Box sx={{ pt: 2 }}>
                    <Typography variant='h4'>Contact Us</Typography>
                    <Typography paragraph component={'span'}>
                        {contact_us_text.split("\n").map((i,key) => {
                            return <div key={key}>{i}</div>;
                        })}
                    </Typography>
                </Box>
                <Box>
                    <Stack spacing={4} direction={{ xs: 'column', sm: 'row' }} alignItems="flex-start">
                        <MapImage
                            style={{
                                width: '55%',
                                height: '100%'
                            }}
                        >
                            <img src={map_1} alt="MAP 1" width="100%"/>
                        </MapImage>
                        <MapImage
                            style={{
                                width: '40%',
                                height: '100%'
                            }}
                        >
                            <img src={map_2} alt="MAP 2" width="100%"/>
                        </MapImage>
                    </Stack>
                </Box>
            </Box>
        </Box>
    )
}

export default Home