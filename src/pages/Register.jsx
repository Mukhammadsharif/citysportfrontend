import React, {useState} from 'react'
import {Avatar, Box, Button, TextField, Typography} from "@mui/material";
import Logo from '../assets/logo.png'
import {usePostRequest} from "../hooks/request";
import {REGISTER_USER} from "../tools/urls";
import {useNavigate} from "react-router-dom";
import Alert from "../components/AlertComponent";


export default function Register() {
    const navigate = useNavigate()
    const [email, setEmail] = useState('')
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState(false)
    const [errorText, setErrorText] = useState('')

    const userRegisterRequest = usePostRequest({
        url: REGISTER_USER
    })

    const register = async () => {
        const {response} = await userRegisterRequest.request({
            data: {
                email, username, password
            }
        })

        if (response?.token) {
            setEmail('')
            setUsername('')
            setPassword('')
            navigate('/login')
        }

        if (error) {
            setError(true)
            setErrorText('Переправерьте ваши данные и повторите попытку')
        }
    }

    return (
        <Box
            style={{backgroundColor: '#E8D5D5'}}
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

            <Typography variant="h4" component="h2" color={'secondary'} sx={{mb: 3}}>
                Регистрация
            </Typography>

            <TextField
                required={true}
                label="Имя пользователя"
                color={'secondary'}
                sx={{mb: 3, width: '40%'}}
                value={username}
                onChange={e => setUsername(e.target.value)}
            />

            <TextField
                required={true}
                label="Электронная почта"
                color={'secondary'}
                sx={{mb: 3, width: '40%'}}
                value={email}
                onChange={e => setEmail(e.target.value)}
            />

            <TextField
                required={true}
                label="Пароль"
                color={'secondary'}
                sx={{mb: 3, width: '40%'}}
                value={password}
                onChange={e => setPassword(e.target.value)}
            />

            <Button
                variant="contained"
                sx={{mb: 3, width: '40%', height: 50}}
                color={'secondary'}
                onClick={() => {
                    if (email && username && password) {
                        register()
                    } else {
                        setError(true)
                        setErrorText('Заполните все поля!')
                    }
                }}>
                Регистрация
            </Button>

            {error ? <Alert setError={setError} errorText={errorText}/> : ''}
        </Box>
    )
}
