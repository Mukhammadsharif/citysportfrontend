import React from 'react'
import Avatar from "@mui/material/Avatar"
import Box from "@mui/material/Box"
import Button from "@mui/material/Button"
import Typography from "@mui/material/Typography"
import Logo from '../assets/logo.png'
import {useNavigate} from "react-router-dom";


export default function Logout() {
    const navigate = useNavigate()

    return (
        <Box
            // style={{backgroundColor: '#E8D5D5'}}
            sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                flexDirection: 'column',
                width: 1,
                height: '100vh',
            }}
        >
            <Avatar alt="Remy Sharp" src={Logo} sx={{transform: 'scale(3)', position: 'absolute', top: '10%'}}/>

            <Typography variant="h4" component="h2" color={'primary'} sx={{mb: 3}}>
                Выйти из платформы
            </Typography>


            <Button
                variant="contained"
                sx={{mb: 3, width: '40%', height: 50}}
                color={'primary'}
                onClick={() => {
                    localStorage.removeItem('token')
                    localStorage.removeItem('userType')
                    navigate('/login')
                }}>
                Выход
            </Button>

        </Box>
    )
}
