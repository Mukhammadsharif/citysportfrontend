import React, {useState} from 'react'
import dayjs from 'dayjs';
import {AdapterDayjs} from '@mui/x-date-pickers/AdapterDayjs';
import {LocalizationProvider} from '@mui/x-date-pickers/LocalizationProvider';
import Button from "@mui/material/Button";
import AddCircleOutlineTwoToneIcon from '@mui/icons-material/AddCircleOutlineTwoTone';
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
import {useLoad, usePostRequest, usePutRequest} from "../hooks/request";
import {
    CREATE_ORDER,
    GET_SUBSCRIPTIONS,
    GET_TYPES_LIST_FOR_ORDER,
    SET_BUSY_TYPE_NUMBER_FOR_ORDER
} from "../tools/urls";
import Alert from "./AlertComponent";
import BookmarkBorderTwoToneIcon from '@mui/icons-material/BookmarkBorderTwoTone';
import DeleteOutlineTwoToneIcon from '@mui/icons-material/DeleteOutlineTwoTone';
import {useDispatch, useSelector} from "react-redux";
import {changeToggle} from "../store/features/toggleSlice";
import {ButtonGroup} from "@mui/material";
import {getFormattedCurrentDate} from "../tools/helpers";

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

export default function CreateOrder({filterParams, setFilterParams}) {
    const token = localStorage.getItem('token')
    const dispatch = useDispatch()
    const toggle = useSelector(state => state.toggle)
    const [show, setShow] = useState(false)
    const [type, setType] = useState('');
    const [typeNumber, setTypeNumber] = useState('')
    const [number, setNumber] = useState('')
    const [enterDate, setEnterDate] = useState(dayjs().format('YYYY-MM-DDTHH:mm:ss[Z]'))
    const [exitDate, setExitDate] = useState(dayjs().add(1, 'hour').format('YYYY-MM-DDTHH:mm:ss[Z]'))
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

    const createOrderRequest = usePostRequest({
        url: CREATE_ORDER,
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

    const createOrder = async () => {
        const {response} = await createOrderRequest.request({
            data: {
                type,
                number,
                dateEntered: enterDate,
                dateExit: exitDate,
                summ: price,
                debt: debt,
                phone: phone,
                relax: relax,
                sauna: type === 'sauna' ? typeNumber.id : null,
                pool: type === 'pool' ? typeNumber.id : null,
                training: type === 'training' ? typeNumber.id : null,
                billiard: type === 'billiard' ? typeNumber.id : null,
                shortsNumber: shorts,
                subscription: chooseSubscription.id,
                isSubscribed: subscriptionToggle,
                additionalInfo: additionalInfo,
            }
        })

        if (response) {
            if (type !== 'training') {
                setBusyDetail()
            }
            setShow(false)
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
        } else {
            setErrorText('Данные не были сохранены. Попробуйте снова. И убедитесь что все поля были заполнены верно')
            setError(true)
        }
    }

    console.log(typesList)

    return (
        <div style={{width: '100%'}}>
            <div style={{width: '100%', display: 'flex', flexDirection: 'row', justifyContent: 'space-between'}}>
                <ButtonGroup variant="contained" aria-label="outlined primary button group"
                             sx={{height: 50, ml: 2, my: 2}}>
                    <Button onClick={() => setFilterParams({day: getFormattedCurrentDate()})}>Сегодня</Button>
                    <Button onClick={() => setFilterParams({seven_days: getFormattedCurrentDate()})}>7 дней</Button>
                    <Button onClick={() => setFilterParams({month: new Date().getMonth() + 1})}>Месяц</Button>
                    <Button onClick={() => setFilterParams({year: new Date().getFullYear()})}>Год</Button>
                    <Button onClick={() => setFilterParams({all: 'all'})}>Все</Button>
                </ButtonGroup>

                <Button
                    onClick={() => setShow(true)}
                    sx={{height: 50, mr: 2, my: 2}}
                    variant="outlined"
                    startIcon={<AddCircleOutlineTwoToneIcon/>}>
                    Добавить
                </Button>
            </div>

            {show ? (
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
                            {typesList?.length ? typesList.filter((cab) => cab.isBusy !== true).map((item) => (
                                <MenuItem key={item.id} value={item}>
                                    <ListItemText primary={item.name}/>
                                </MenuItem>
                            )) : ''}
                        </Select>
                    </FormControl>

                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DateTimePicker
                            defaultValue={dayjs()}
                            sx={{width: '45%', mt: 2}}
                            label={"Время входа"}
                            onChange={e => setEnterDate(e.format('YYYY-MM-DDTHH:mm:ss[Z]'))}
                        />

                        <DateTimePicker
                            defaultValue={dayjs().add(1, 'hour')}
                            sx={{width: '45%', mt: 2}}
                            label={"Время выхода"}
                            onChange={e => setExitDate(e.format('YYYY-MM-DDTHH:mm:ss[Z]'))}
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
                        onClick={() => createOrder()}
                        sx={{height: 50, mt: 2, width: '95%'}}
                        variant="outlined"
                        startIcon={<BookmarkBorderTwoToneIcon/>}>
                        Сохранить
                    </Button>

                    <Button
                        color={'warning'}
                        onClick={() => {
                            setShow(false)
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
                        }}
                        sx={{height: 50, mt: 2, width: '95%'}}
                        variant="outlined"
                        startIcon={<DeleteOutlineTwoToneIcon/>}>
                        Отменить
                    </Button>
                </div>
            ) : ''}

            {error ? <Alert setError={setError} errorText={errorText} top={5}/> : ''}
        </div>
    )
}
