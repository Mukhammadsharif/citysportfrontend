import React, {useEffect, useState} from 'react'
import dayjs from 'dayjs';
import {AdapterDayjs} from '@mui/x-date-pickers/AdapterDayjs';
import {LocalizationProvider} from '@mui/x-date-pickers/LocalizationProvider';
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Textarea from '@mui/joy/Textarea';
import {useDeleteRequest, useLoad, usePutRequest} from "../hooks/request";
import {SUBSCRIPTION_DETAIL} from "../tools/urls";
import Alert from "../components/AlertComponent";
import BookmarkBorderTwoToneIcon from '@mui/icons-material/BookmarkBorderTwoTone';
import DeleteOutlineTwoToneIcon from '@mui/icons-material/DeleteOutlineTwoTone';
import {useDispatch, useSelector} from "react-redux";
import {changeToggle} from "../store/features/toggleSlice";
import {useLocation, useNavigate} from "react-router-dom";
import {DatePicker} from "@mui/x-date-pickers";

export default function SubscriptionDetail() {
    const {state} = useLocation()
    const navigation = useNavigate()
    const token = localStorage.getItem('token')
    const userType = localStorage.getItem('userType')
    const dispatch = useDispatch()
    const toggle = useSelector(state => state.toggle)
    const [type, setType] = useState('');
    const [name, setName] = useState('');
    const [debt, setDebt] = useState('')
    const [price, setPrice] = useState('')
    const [enterDate, setEnterDate] = useState(dayjs().format('YYYY-MM-DD'))
    const [exitDate, setExitDate] = useState(dayjs().add(1, 'month').format('YYYY-MM-DD'))
    const [phone, setPhone] = useState('')
    const [additionalInfo, setAdditionalInfo] = useState('')
    const [error, setError] = useState(false)
    const [errorText, setErrorText] = useState('')

    const {response: subscription} = useLoad({
        url: SUBSCRIPTION_DETAIL.replace('id', state?.id),
        headers: {
            Authorization: `Token ${token}`
        }
    }, [toggle])


    const updateSubscriptionRequest = usePutRequest({
        url: SUBSCRIPTION_DETAIL.replace('id', state?.id),
        headers: {
            Authorization: `Token ${token}`
        }
    })

    const deleteSubscriptionRequest = useDeleteRequest({
        url: SUBSCRIPTION_DETAIL.replace('id', state?.id),
        headers: {
            Authorization: `Token ${token}`
        }
    })


    const updateSubscription = async () => {
        const {response} = await updateSubscriptionRequest.request({
            data: {
                type,
                name,
                subscriptionDate: enterDate,
                expirationDate: exitDate,
                price,
                debt: debt || '0',
                phone: phone,
                additionalInfo: additionalInfo,
            }
        })

        if (response) {
            setType('')
            setPrice('')
            setPhone('')
            setDebt('')
            setAdditionalInfo('')
            dispatch(changeToggle(!toggle))
            navigation('/')
        } else {
            setErrorText('Данные не были сохранены. Попробуйте снова. И убедитесь что все поля были заполнены верно')
            setError(true)
        }
    }

    useEffect(() => {
        if (subscription) {
            setType(subscription?.type)
            setExitDate(subscription?.expirationDate)
            setEnterDate(subscription?.subscriptionDate)
            setName(subscription?.name)
            setPhone(subscription?.phone)
            setPrice(subscription?.price)
            setDebt(subscription?.debt)
        }
    }, [subscription])

    const deleteSubscription = async () => {
        const {error} = await deleteSubscriptionRequest.request()
        if (!error) {
            navigation('/')
        }
    }
    return (
        <div style={{
            width: '100%',
            display: 'flex',
            flexDirection: 'row',
            flexWrap: 'wrap',
            justifyContent: 'space-around',
            alignItems: 'flex-start',
            paddingBottom: 20
        }}>
            <TextField
                required={true}
                label="Тип"
                color={'primary'}
                sx={{width: '45%', mt: 2}}
                value={type}
                onChange={e => setType(e.target.value)}
            />


            <TextField
                required={true}
                label="ФИО"
                color={'primary'}
                sx={{width: '45%', mt: 2}}
                value={name}
                onChange={e => setName(e.target.value)}
            />

            <TextField
                required={true}
                label="Стоимость"
                color={'primary'}
                sx={{width: '45%', mt: 2}}
                value={price}
                onChange={e => setPrice(e.target.value)}
            />

            <TextField
                required={true}
                label="Задольжость"
                color={'primary'}
                sx={{width: '45%', mt: 2}}
                value={debt}
                onChange={e => setDebt(e.target.value)}
            />


            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                    value={dayjs(enterDate)}
                    sx={{width: '45%', mt: 2}}
                    label={"Дата начало"}
                    onChange={e => setEnterDate(dayjs(new Date(e).toISOString()).format('YYYY-MM-DD'))}
                />

                <DatePicker
                    value={dayjs(exitDate)}
                    sx={{width: '45%', mt: 2}}
                    label={"Дата окончания"}
                    onChange={e => setExitDate(dayjs(new Date(e).toISOString()).format('YYYY-MM-DD'))}
                />
            </LocalizationProvider>


            <TextField
                required={true}
                label="Телефон"
                color={'primary'}
                sx={{width: '45%', mt: 2}}
                value={phone}
                onChange={e => setPhone(e.target.value)}
            />


            <Textarea
                placeholder="Дополнительная информация"
                color="primary"
                sx={{width: '95%', mt: 2}}
                size="lg"
                variant="outlined"
                minRows={5}
                value={additionalInfo}
                onChange={e => setAdditionalInfo(e.target.value)}
            />

            <Button
                color={'success'}
                onClick={() => updateSubscription()}
                sx={{height: 50, mt: 2, width: '95%'}}
                variant="outlined"
                startIcon={<BookmarkBorderTwoToneIcon/>}>
                Сохранить
            </Button>

            <Button
                color={'warning'}
                onClick={() => {
                    navigation('/')
                }}
                sx={{height: 50, mt: 2, width: '95%'}}
                variant="outlined"
                startIcon={<DeleteOutlineTwoToneIcon/>}>
                Отменить
            </Button>

            <Button
                color={'error'}
                onClick={() => {
                    if (userType === 'admin') {
                        deleteSubscription()
                    } else {
                        setErrorText('У вас нет право на удаление записи')
                        setError(true)
                    }
                }}
                sx={{height: 50, mt: 2, width: '95%'}}
                variant="outlined"
                startIcon={<DeleteOutlineTwoToneIcon/>}>
                Удалить
            </Button>

            {error ? <Alert setError={setError} errorText={errorText} top={5}/> : ''}
        </div>
    )
}
