import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useLocation } from 'react-router-dom'
import { logIn } from '../reducers/authReducer'
import { Stack, Typography } from '@mui/material'
import Box from '@mui/material/Box'
import ButtonBase from '@mui/material/ButtonBase'
import { styled } from '@mui/material/styles'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import ResponsiveAppBar from '../components/ResponsiveAppBar'
import home_banner from '../images/home_banner.jpeg'
import map_1 from '../images/map_1.PNG'
import map_2 from '../images/map_2.PNG'
import { CONTACT_US_TEXT, ADMIN_PASSWORD } from '../constant/constants'


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

    const MapImage = styled('span')(( { theme }) => ({
        position: 'relative',
        height: 350,
        [theme.breakpoints.down('sm')]: {
            width: '70% !important', // Overrides inline-style
        },
    }))

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
                        <Typography variant='h4'>ANZU</Typography>
                        <Typography paragraph component={'span'}>
                            {CONTACT_US_TEXT.split("\n").map((i,key) => {
                                return <div key={key}>{i}</div>;
                            })}
                        </Typography>
                    </Box>
                    <Box sx={sxs.section}>
                        <Stack spacing={4} direction={{ xs: 'column', sm: 'row' }} alignItems="flex-start">
                            <MapImage
                                style={{
                                    width: '40%',
                                    height: '100%'
                                }}
                            >
                                <img src={map_1} alt="MAP 1" width="100%"/>
                            </MapImage>
                            <MapImage
                                style={{
                                    width: '35%',
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
    img: {
        maxWidth: '90%',
        maxHeight: '90%',
        paddingBottom: 10
    }
}

export default Home