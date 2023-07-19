import React, {useEffect} from 'react'
import AlertTitle from "@mui/material/AlertTitle";
import Alert from "@mui/material/Alert";

export default function AlertComponent({errorText, setError, top = '10%'}) {

    useEffect(() => {
        setTimeout(() => {
            setError(false)
        }, 3000)
    }, [])

    return (
        <Alert severity="warning" sx={{position: 'absolute', top: top, width: '50%'}}>
            <AlertTitle>Ошибка!</AlertTitle>
            <strong>{errorText}</strong>
        </Alert>
    )
}
