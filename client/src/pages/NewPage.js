import React, { useState, useEffect } from 'react'
import { Stack, Typography } from '@mui/material'
import { useSelector, useDispatch } from 'react-redux'
import { logIn } from '../reducers/authReducer'
import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import CircularProgress from '@mui/material/CircularProgress'
import { styled } from '@mui/material/styles'
import { useNavigate } from "react-router-dom"
import http from '../http-common'
import ResponsiveAppBar from '../components/ResponsiveAppBar'
import getSignedRequest from '../getSignedRequest'
import { ADMIN_PASSWORD } from '../constant/constants'


const Input = styled('input')({
    display: 'none',
})

const NewPage = () => {
    const [titles, setTitles] = useState([])
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [editingPassword, setEditingPassword] = useState('')
    const [editingTitle, setEditingTitle] = useState('')
    const [currentButtonImageFile, setCurrentButtonImageFile] = useState(undefined)
    const [previewButtonImage, setPreviewButtonImage] = useState(undefined)
    const navigate = useNavigate()
    const dispatch = useDispatch()
    
    const pages = useSelector((state) => state.pages)
    const auth = useSelector((state) => state.auth)

    useEffect(() => {
        setTitles(pages.titles)
    }, [pages])

    useEffect(() => {
        setIsLoggedIn(auth.isLoggedIn)
    }, [auth])

    const select_button_image = (e) => {
        if (e.target.files.length !== 0) {
            setCurrentButtonImageFile(e.target.files[0])
            setPreviewButtonImage(URL.createObjectURL(e.target.files[0]))
        }
    }

    const handleConfirmAction = async (e) => {
        e.preventDefault()
        if (editingTitle === '') {
            alert('請輸入頁面標題')
            return
        }
        if (!currentButtonImageFile) {
            alert('請選擇主頁按鈕照片')
            return
        }
        try {
            setIsLoading(true)
            await getSignedRequest(currentButtonImageFile, create_new_page)
        } catch (err) {
            setIsLoading(true)
            alert(`新增頁面失敗 (${err})`)
        }
    }

    const create_new_page = async (image_url) => {
        const new_page = {
            title: editingTitle,
            button_image: image_url
        }
        try {
            const res = await http.post("/add_page", new_page)
            if (res.data.success) {
                navigate("/Edit")
                window.location.reload(true)
            }
        } catch (err) {
            throw err
        }
    }

    const handleCancelAction = () => {
        navigate("/Edit")
    }

    const handleLoginAction = () => {
        if (editingPassword === ADMIN_PASSWORD) {
            setIsLoggedIn(true)
            dispatch(logIn())
        } else {
            alert("密碼錯誤，請重新輸入")
        }
    }

    return (
        !isLoggedIn ?
            <Stack sx={{ alignItems: 'center '}} spacing={2} direction="row">
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
                <ResponsiveAppBar titles={titles} edit_mode={true} />
                <Box sx={sxs.container}>
                    <Box sx={sxs.box}>
                        <Typography variant='h3'>
                            新增頁面
                        </Typography>
                    </Box>
                    <Box sx={sxs.box}>
                        <TextField 
                            label="標題" 
                            value={editingTitle}
                            onChange={(e) => setEditingTitle(e.target.value)}
                            variant="outlined" 
                        />
                    </Box>
                    <Box sx={sxs.box}>
                        {previewButtonImage && (
                            <img src={previewButtonImage} alt="" style={sxs.img} />
                        )}
                        <Stack sx={sxs.box} spacing={2} direction="row">
                            <label htmlFor="image">
                                <Input accept="image/*" id="image" type="file" name='image' onChange={select_button_image} />
                                <Box>
                                    <Button variant="contained" component="span">
                                        {previewButtonImage ? "更改主頁按鈕照片" : "選擇主頁按鈕照片"}
                                    </Button>
                                </Box>
                            </label>
                            {previewButtonImage ?
                                <Box>
                                    <Button variant="outlined" component="span" color="warning" onClick={() => {
                                        setCurrentButtonImageFile(undefined)
                                        setPreviewButtonImage(undefined)
                                    }}>
                                        刪除主頁按鈕照片
                                    </Button>
                                </Box>
                            :
                            null}
                        </Stack>
                    </Box>
                    <Stack sx={{ pb: 2, alignItems: 'center '}} spacing={2} direction="row">
                        <Button variant="contained" onClick={handleConfirmAction}>確定</Button>
                        <Button variant="outlined" onClick={handleCancelAction}>取消</Button>
                    </Stack>
                    { isLoading ? <Box sx={sxs.box}> <CircularProgress /> </Box> : null}
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
    box: {
        pb: 2,
    },
    img: {
        maxWidth: '100%',
        maxHeight: 400,
        paddingBottom: 10
    }
}

export default NewPage