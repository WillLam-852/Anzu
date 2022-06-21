import React, { useState, useEffect } from 'react'
import { Stack, Typography } from '@mui/material'
import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'


const Card = ({ init_title, image, init_description, edit_page=false }) => {
    const [isEdit, setIsEdit] = useState(false)
    const [title, setTitle] = useState("")
    const [editingTitle, setEditingTitle] = useState("")
    const [description, setDescription] = useState("")
    const [editingDescription, setEditingDescription] = useState("")

    useEffect(() => {
        setTitle(init_title)
        setDescription(init_description)
    }, [init_title, init_description]) 

    const handleEditAction = () => {
        setEditingTitle(title)
        setEditingDescription(description)
        setIsEdit(true)
    }
    
    const handleConfirmAction = () => {
        setTitle(editingTitle)
        setDescription(editingDescription)
        setIsEdit(false)
    }

    const handleCancelAction = () => {
        setIsEdit(false)
    }

    return (
        isEdit ? 
            <Box sx={styles.box}>
                <Box sx={{ pb: 1.5 }}>
                    <TextField 
                        label="標題" 
                        value={editingTitle}
                        onChange={(e) => setEditingTitle(e.target.value)}
                        variant="outlined" 
                    />
                </Box>
                <Box>
                    <TextField
                        style={{width: 400, flex: 1}}
                        label="文字 (可留空)"
                        multiline
                        rows={4}
                        value={editingDescription}
                        onChange={(e) => setEditingDescription(e.target.value)}
                        variant="outlined"
                    />
                </Box>
                <Button sx={styles.button} variant="contained" onClick={handleConfirmAction}>確定</Button>
                <Button sx={styles.button} variant="outlined" onClick={handleCancelAction}>取消</Button>
            </Box>
        :
            <Box sx={styles.box}>
                <Stack sx={{ pb: 1 }} spacing={2} direction="row">
                    {title != null ?
                        <Typography variant="h5">
                            {title}
                        </Typography>
                        :
                        null
                    }
                    {edit_page ?
                        <Button variant="outlined" size="small" onClick={handleEditAction}>編輯</Button>
                        :
                        null
                    }
                </Stack>
                <Box>
                    {image != null ?
                        <img 
                            style={styles.img} 
                            src={image}
                            alt={title} />
                        :
                        null
                    }
                    {description != null ?
                        <Box>
                            {description}
                        </Box>
                        :
                        null
                    }
                </Box>
            </Box>
    )
}

const styles = {
    box: {
        pb: 5,
    },
    img: {
        height: 300,
        width: null,
    },
    button: {
        m: 1
    }
}

export default Card