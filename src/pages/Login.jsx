import React, {useState} from 'react'
import Avatar from "@mui/material/Avatar"
import Box from "@mui/material/Box"
import Button from "@mui/material/Button"
import TextField from "@mui/material/TextField"
import Typography from "@mui/material/Typography"
import Logo from '../assets/logo.png'
import {usePostRequest} from "../hooks/request";
import {LOGIN_USER} from "../tools/urls";
import {useNavigate} from "react-router-dom";
import Alert from "../components/AlertComponent";


export default function Login() {
    const navigate = useNavigate()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState(false)
    const [errorText, setErrorText] = useState('')

    const userLoginRequest = usePostRequest({
        url: LOGIN_USER
    })

    const login = async () => {
        const {response, error} = await userLoginRequest.request({
            data: {
                email, password
            }
        })

        if (response?.token) {
            setEmail('')
            setPassword('')
            localStorage.setItem('token', response?.token)
            localStorage.setItem('userType', response?.isAdmin ? 'admin' : 'user')
            navigate('/')
        }

        if (error) {
            setError(true)
            setErrorText('Введен неправилный логин или пароль')
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
                Вход
            </Typography>

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
                    if (email && password) {
                        login()
                    } else {
                        setError(true)
                        setErrorText('Заполните все поля!')
                    }
                }}>
                Вход
            </Button>

            {error ? <Alert setError={setError} errorText={errorText}/> : ''}
        </Box>
    )
}
