import React, {useEffect, useState} from 'react'
import dayjs from 'dayjs';
import {AdapterDayjs} from '@mui/x-date-pickers/AdapterDayjs';
import {LocalizationProvider} from '@mui/x-date-pickers/LocalizationProvider';
import Button from "@mui/material/Button";
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import ListItemText from '@mui/material/ListItemText';
import Select from '@mui/material/Select';
import TextField from "@mui/material/TextField";
import {DateTimePicker} from '@mui/x-date-pickers/DateTimePicker';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Textarea from '@mui/joy/Textarea';
import {useDeleteRequest, useLoad, usePostRequest, usePutRequest} from "../hooks/request";
import {
    GET_SUBSCRIPTIONS,
    GET_TYPES_LIST_FOR_ORDER, ORDER_DETAIL,
    SET_BUSY_TYPE_NUMBER_FOR_ORDER
} from "../tools/urls";
import Alert from "../components/AlertComponent";
import BookmarkBorderTwoToneIcon from '@mui/icons-material/BookmarkBorderTwoTone';
import DeleteOutlineTwoToneIcon from '@mui/icons-material/DeleteOutlineTwoTone';
import {useDispatch, useSelector} from "react-redux";
import {changeToggle} from "../store/features/toggleSlice";
import {useLocation, useNavigate} from "react-router-dom";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 250,
        },
    },
};

const names = [
    {value: 'sauna', translation: 'Сауна'},
    {value: 'pool', translation: 'Бассейн'},
    {value: 'training', translation: 'Трен/зал'},
    {value: 'billiard', translation: 'Биллиард'},
];

export default function OrderDetail() {
    const {state} = useLocation()
    const navigation = useNavigate()
    const token = localStorage.getItem('token')
    const userType = localStorage.getItem('userType')
    const dispatch = useDispatch()
    const toggle = useSelector(state => state.toggle)
    const [type, setType] = useState('');
    const [oldTypeNumber, setOldTypeNumber] = useState('')
    const [typeNumber, setTypeNumber] = useState('')
    const [number, setNumber] = useState('')
    const [enterDate, setEnterDate] = useState('')
    const [exitDate, setExitDate] = useState('')
    const [price, setPrice] = useState('')
    const [phone, setPhone] = useState('')
    const [shorts, setShorts] = useState('')
    const [debt, setDebt] = useState('')
    const [additionalInfo, setAdditionalInfo] = useState('')
    const [relax, setRelax] = useState(false)
    const [subscriptionToggle, setSubscriptionToggle] = useState(false)
    const [chooseSubscription, setChooseSubscription] = useState('')
    const [error, setError] = useState(false)
    const [errorText, setErrorText] = useState('')

    const {response: order} = useLoad({
        url: ORDER_DETAIL.replace('id', state?.id),
        headers: {
            Authorization: `Token ${token}`
        }
    }, [toggle])

    const {response: typesList} = useLoad({
        url: GET_TYPES_LIST_FOR_ORDER.replace('types', `${type}s`),
        headers: {
            Authorization: `Token ${token}`
        }
    }, [type, toggle])

    const {response: subscriptionsList} = useLoad({
        url: GET_SUBSCRIPTIONS,
        headers: {
            Authorization: `Token ${token}`
        }
    }, [type, toggle])

    const updateOrderRequest = usePutRequest({
        url: ORDER_DETAIL.replace('id', state?.id),
        headers: {
            Authorization: `Token ${token}`
        }
    })

    const deleteOrderRequest = useDeleteRequest({
        url: ORDER_DETAIL.replace('id', state?.id),
        headers: {
            Authorization: `Token ${token}`
        }
    })

    const setBusyDetailRequest = usePutRequest({
        url: SET_BUSY_TYPE_NUMBER_FOR_ORDER.replace('types', `${type}s`).replace('id', typeNumber?.id),
        headers: {
            Authorization: `Token ${token}`
        }
    })

    const unDoBusyDetailRequest = usePutRequest({
        url: SET_BUSY_TYPE_NUMBER_FOR_ORDER.replace('types', `${type}s`).replace('id', oldTypeNumber?.id),
        headers: {
            Authorization: `Token ${token}`
        }
    })

    const unDoBusyDetail = async () => {
        const {response, error} = await unDoBusyDetailRequest.request({
            data: {
                name: oldTypeNumber.name,
                isBusy: false
            }
        })

        if (response) {
            console.log(response)
            updateOrder()
        } else {
            console.log(error)
        }
    }
    const setBusyDetail = async () => {
        const {response, error} = await setBusyDetailRequest.request({
            data: {
                name: typeNumber.name,
                isBusy: true
            }
        })

        if (response) {
            console.log(response)
        } else {
            console.log(error)
        }
    }

    const updateOrder = async (closed = false) => {
        const {response} = await updateOrderRequest.request({
            data: {
                type,
                number: number || '0',
                dateEntered: new Date(enterDate).toISOString(),
                dateExit: new Date(exitDate).toISOString(),
                summ: price,
                debt: debt || '0',
                phone: phone,
                relax: relax,
                sauna: type === 'sauna' ? typeNumber.id : null,
                pool: type === 'pool' ? typeNumber.id : null,
                training: type === 'training' ? typeNumber.id : null,
                billiard: type === 'billiard' ? typeNumber.id : null,
                shortsNumber: shorts || '0',
                subscription: chooseSubscription ? chooseSubscription.id : null,
                isSubscribed: subscriptionToggle,
                additionalInfo: additionalInfo,
                isClosed: closed ? true : false,
            }
        })

        if (response) {
            if (type !== 'training' && !closed) {
                setBusyDetail()
            }
            setType('')
            setTypeNumber('')
            setNumber('')
            setPrice('')
            setPhone('')
            setShorts('')
            setDebt('')
            setAdditionalInfo('')
            setRelax(false)
            setSubscriptionToggle(false)
            setChooseSubscription('')
            dispatch(changeToggle(!toggle))
            navigation('/')
        } else {
            setErrorText('Данные не были сохранены. Попробуйте снова. И убедитесь что все поля были заполнены верно')
            setError(true)
        }
    }

    useEffect(() => {
        if (order?.type) {
            setType(order?.type)
            if (typesList?.length) {
                const newItem = typesList.find(item => item.id === order[order?.type].id)
                setTypeNumber(typesList[typesList.indexOf(newItem)])
                setOldTypeNumber(typesList[typesList.indexOf(newItem)])

                setNumber(order?.number)
                setPrice(order?.summ)
                setPhone(order?.phone)
                setShorts(order?.shortsNumber)
                setDebt(order?.debt)
                setAdditionalInfo(order?.additionalInfo)
                setRelax(order?.relax)
                setSubscriptionToggle(order?.isSubscribed)
                setEnterDate(new Date(order?.dateEntered).toString())
                setExitDate(new Date(order?.dateExit).toString())

                if (subscriptionsList?.length) {
                    const newSubscription = subscriptionsList.find(item => item.id === order.subscription.id)
                    setChooseSubscription(subscriptionsList[subscriptionsList.indexOf(newSubscription)])
                }
            }
        }
    }, [order, typesList, subscriptionsList])

    const deleteOrder = async () => {
        const {error} = await deleteOrderRequest.request()
        if (!error) {
            navigation('/')
        }
    }

    const closeOrder = async () => {
        if (type !== 'training') {
            const {response, error} = await setBusyDetailRequest.request({
                data: {
                    name: typeNumber.name,
                    isBusy: false
                }
            })

            if (response) {
                console.log(response)
                navigation('/')
            } else {
                console.log(error)
            }
        } else {
            navigation('/')
        }
    }

    return (
        <div style={{width: '100%', paddingTop: 30}}>
            <div style={{
                width: '100%',
                display: 'flex',
                flexDirection: 'row',
                flexWrap: 'wrap',
                justifyContent: 'space-around',
                alignItems: 'flex-start',
                paddingBottom: 20
            }}>
                <FormControl sx={{width: '45%'}}>
                    <InputLabel id="demo-multiple-checkbox-label">Тип</InputLabel>
                    <Select
                        labelId="demo-multiple-checkbox-label"
                        id="demo-multiple-checkbox"
                        value={type}
                        onChange={event => setType(event.target.value)}
                        input={<OutlinedInput label="Tag"/>}
                        MenuProps={MenuProps}
                        color={'primary'}
                    >
                        {names.map((item) => (
                            <MenuItem key={item.value} value={item.value}>
                                <ListItemText primary={item.translation}/>
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>


                <FormControl sx={{width: '45%'}}>
                    <InputLabel id="demo-multiple-checkbox-label">Номер</InputLabel>
                    <Select
                        labelId="demo-multiple-checkbox-label"
                        id="demo-multiple-checkbox"
                        value={typeNumber}
                        onChange={event => setTypeNumber(event.target.value)}
                        input={<OutlinedInput label="Номер"/>}
                        MenuProps={MenuProps}
                        color={'primary'}
                        disabled={!typesList}
                        onMouseDown={() => {
                            if (!typesList) {
                                setErrorText('Необходимо выбрать тип')
                                setError(true)
                            }
                        }}
                    >
                        {typesList?.length
                            ? typesList?.filter((cab) => cab.isBusy !== true || cab.id === typeNumber?.id)?.map((item) => (
                                <MenuItem key={item.id} value={item}>
                                    <ListItemText primary={item.name}/>
                                </MenuItem>
                            )) : ''}
                    </Select>
                </FormControl>

                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DateTimePicker
                        // defaultValue={dayjs()}
                        value={dayjs(enterDate)}
                        sx={{width: '45%', mt: 2}}
                        label={"Время входа"}
                        onChange={e => setEnterDate(new Date(e).toISOString())}
                    />

                    <DateTimePicker
                        // defaultValue={dayjs().add(1, 'hour')}
                        value={dayjs(exitDate)}
                        sx={{width: '45%', mt: 2}}
                        label={"Время выхода"}
                        onChange={e => setExitDate(new Date(e).toISOString())}
                    />
                </LocalizationProvider>

                <TextField
                    required={true}
                    label="Сумма"
                    color={'primary'}
                    sx={{width: '45%', mt: 2}}
                    value={price}
                    onChange={e => setPrice(e.target.value)}
                />

                <TextField
                    required={true}
                    label="Телефон"
                    color={'primary'}
                    sx={{width: '45%', mt: 2}}
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                />

                <TextField
                    required={true}
                    label="Количество плавок"
                    color={'primary'}
                    sx={{width: '45%', mt: 2}}
                    value={shorts}
                    onChange={e => setShorts(e.target.value)}
                />

                <TextField
                    required={true}
                    label="Задолжность"
                    color={'primary'}
                    sx={{width: '45%', mt: 2}}
                    value={debt}
                    onChange={e => setDebt(e.target.value)}
                />

                <div style={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'space-around',
                    width: '100%',
                    margin: 10
                }}>
                    <FormGroup>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={relax}
                                    value={relax}
                                    onChange={() => setRelax(!relax)}
                                    sx={{width: '25%'}}
                                />}
                            label="Массаж"/>
                    </FormGroup>

                    <FormGroup>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={subscriptionToggle}
                                    value={subscriptionToggle}
                                    onChange={() => {
                                        setSubscriptionToggle(!subscriptionToggle)
                                        setChooseSubscription('')
                                    }}
                                    sx={{width: '25%'}}
                                />}
                            label="Абонемент"/>
                    </FormGroup>
                </div>

                <TextField
                    required={true}
                    label="Количество"
                    color={'primary'}
                    sx={{width: '45%'}}
                    value={number}
                    onChange={e => setNumber(e.target.value)}
                />

                <FormControl sx={{width: '45%'}}>
                    <InputLabel id="demo-multiple-checkbox-label">Выбор абонемента</InputLabel>
                    <Select
                        labelId="demo-multiple-checkbox-label"
                        id="demo-multiple-checkbox"
                        value={chooseSubscription}
                        onChange={event => setChooseSubscription(event.target.value)}
                        input={<OutlinedInput label="Выбор абонемента"/>}
                        MenuProps={MenuProps}
                        color={'primary'}
                        disabled={!subscriptionToggle}
                        onMouseDown={() => {
                            if (!subscriptionToggle) {
                                setErrorText('Необходимо поставить галочку на пункт абонемента')
                                setError(true)
                            }
                        }}
                    >
                        {subscriptionsList?.length ? subscriptionsList.map((item) => (
                            <MenuItem key={item.id} value={item}>
                                <ListItemText primary={item.name}/>
                            </MenuItem>
                        )) : ''}
                    </Select>
                </FormControl>

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
                    onClick={() => {
                        if (typeNumber && type !== 'training') {
                            unDoBusyDetail()
                        } else if (typeNumber && type === 'training') {
                            updateOrder()
                        }
                    }}
                    sx={{height: 50, mt: 2, width: '95%'}}
                    variant="contained"
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
                    color={'primary'}
                    onClick={() => {
                        updateOrder(true)
                        closeOrder()
                    }}
                    sx={{height: 50, mt: 2, width: '95%'}}
                    variant="contained"
                    startIcon={<DeleteOutlineTwoToneIcon/>}>
                    Закрыть
                </Button>

                <Button
                    color={'error'}
                    onClick={() => {
                        if (userType === 'admin') {
                            deleteOrder()
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
            </div>

            {error ? <Alert setError={setError} errorText={errorText} top={100}/> : ''}
        </div>
    )
}
