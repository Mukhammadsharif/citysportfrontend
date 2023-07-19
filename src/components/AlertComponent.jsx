import React, {useEffect} from 'react'
import {AlertTitle} from "@mui/material";

export default function Alert({errorText, setError}) {

    useEffect(() => {
        setTimeout(() => {
            setError(false)
        }, 3000)
    }, [])

    return (
        <Alert severity="error">
            <AlertTitle>Ошибка!</AlertTitle>
            <strong>{errorText}</strong>
        </Alert>
    )
}
