import { ADMIN_PASSWORD, CONTACT_US_TEXT } from '../constant/constants'
import React, { useEffect, useState } from 'react'
import { Stack, Typography } from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'

import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import ButtonBase from '@mui/material/ButtonBase'
import Linkify from 'react-linkify'
import ResponsiveAppBar from '../components/ResponsiveAppBar'
import TextField from '@mui/material/TextField'
import home_banner from '../images/home_banner.png'
import { logIn } from '../reducers/authReducer'
import { styled } from '@mui/material/styles'
import { useLocation } from 'react-router-dom'

const Home = () => {
    const [titles, setTitles] = useState([])
    const [editMode, setEditMode] = useState(false)
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const [editingPassword, setEditingPassword] = useState('')
    const pages = useSelector((state) => state.pages)
    const auth = useSelector((state) => state.auth)
    const dispatch = useDispatch()
    const location = useLocation()

    useEffect(() => {
        if (location.pathname.slice(1, 5) === 'Edit') {
            setEditMode(true)
        }
        setTitles(pages.titles)
    }, [pages, location.pathname])

    useEffect(() => {
        setIsLoggedIn(auth.isLoggedIn)
    }, [auth])

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

    const handleLoginAction = () => {
        if (editingPassword === ADMIN_PASSWORD) {
            setIsLoggedIn(true)
            dispatch(logIn())
        } else {
            alert("密碼錯誤，請重新輸入")
        }
    }

    return (
        editMode && !isLoggedIn ?
            <Stack sx={sxs.login} spacing={2} direction="row">
                <TextField 
                    label="編輯模式 密碼" 
                    type="password"
                    value={editingPassword}
                    onChange={(e) => setEditingPassword(e.target.value)}
                    onKeyDown={(ev) => {
                        if (ev.key === 'Enter') {
                            handleLoginAction()
                            ev.preventDefault();
                        }
                    }}
                    variant="outlined" 
                />
                <Button variant="contained" onClick={handleLoginAction}> 登入 </Button>
            </Stack>
        :
            <Box>
                <ResponsiveAppBar titles={titles} edit_mode={editMode} />
                <Box sx={sxs.container}>
                    <Box sx={sxs.section}>
                        <img src={home_banner} alt="Home Banner" width={"100%"} />
                    </Box>
                    <Box sx={sxs.section}>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', minWidth: 300, width: '100%' }}>
                            {pages && pages.pages.map((page) => (
                                <ImageButton
                                    focusRipple
                                    href={`${editMode?'/Edit':''}/${page.title}`}
                                    key={page.title}
                                    style={{
                                        width: '50%',
                                        border: '2px solid white',
                                        minHeight: '200px'
                                    }}
                                >
                                    {page.button_image ? <img style={sxs.img} src={page.button_image} alt="" /> : null}
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
                                            {page.title.split("\n").map((i,key) => {
                                                return <div key={key}>{i}</div>
                                            })}
                                            <ImageMarked className="MuiImageMarked-root" />
                                        </Typography>
                                    </Image>
                                </ImageButton>
                            ))}
                        </Box>
                    </Box>
                    <Box sx={sxs.section}>
                        <Typography variant='h4'>ANZU あんず</Typography>
                        <Typography sx={sxs.paragraph}><Linkify>{CONTACT_US_TEXT}</Linkify></Typography>
                    </Box>
                    <Box sx={sxs.section}>
                        <Stack spacing={4} direction={{ xs: 'column', sm: 'row' }} alignItems="flex-start">
                            <iframe 
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3691.7605677452057!2d114.1491210154435!3d22.28705788533048!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3404007dca18d291%3A0x8138ed7aac7eafa2!2sChampion%20Building%2C%20287-291%20Des%20Voeux%20Rd%20Central%2C%20Sheung%20Wan!5e0!3m2!1sen!2shk!4v1656524670425!5m2!1sen!2shk" 
                                style={sxs.map}
                                allowfullscreen="" 
                                loading="lazy" 
                                referrerpolicy="no-referrer-when-downgrade" 
                                title="Anzu" />
                        </Stack>
                    </Box>
                </Box>
            </Box>
    )
}

const sxs = {
    container: {
        pl: {
            xs: 0,
            sm: 0,
            md: 3,
            lg: 3,
            xl: 3
        },
        width: {
            xs: '100%',
            sm: '100%',
            md: 900,
            lg: 900,
            xl: 900
        }
    },
    login: {
        pl: 3,
        pt: 3,
        alignItems: 'center'
    },
    section: {
        pb: 4
    },
    box: {
        pb: 2
    },
    paragraph: {
        whiteSpace: 'pre-wrap'
    },
    img: {
        maxWidth: '90%',
        maxHeight: '90%',
        paddingBottom: 10
    },
    map: {
        border: 0,
        height: 450,
        width: 800,
        maxWidth: '100%'
    }
}

export default Home