import React, {useEffect, useState} from 'react'
import {useLoad} from "../hooks/request";
import {GET_ALL_ORDERS} from "../tools/urls";
import {useSelector} from "react-redux";
import Paper from "@mui/material/Paper";
import TableContainer from "@mui/material/TableContainer";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import TableBody from "@mui/material/TableBody";
import Typography from "@mui/material/Typography";
import {getFormattedCurrentDate} from "../tools/helpers";
import dayjs from "dayjs";
import {DatePicker} from "@mui/x-date-pickers";
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";
import {LocalizationProvider} from "@mui/x-date-pickers/LocalizationProvider";
import BookmarkBorderTwoToneIcon from "@mui/icons-material/BookmarkBorderTwoTone";
import Button from "@mui/material/Button";

export default function Economics() {
    const token = localStorage.getItem('token')
    const toggle = useSelector(state => state.toggle)
    const [todayEco, setTodayEco] = useState({price: 0, debt: 0})
    const [sevenEco, setSevenEco] = useState({price: 0, debt: 0})
    const [monthEco, setMonthEco] = useState({price: 0, debt: 0})
    const [yearEco, setYearEco] = useState({price: 0, debt: 0})
    const [allEco, setAllEco] = useState({price: 0, debt: 0})
    const [chooseEco, setChooseEco] = useState({price: 0, debt: 0})
    const [enterDate, setEnterDate] = useState(dayjs().format('YYYY-MM-DD'))


    const {response: all} = useLoad({
        url: GET_ALL_ORDERS,
        headers: {
            Authorization: `Token ${token}`
        },
    }, [toggle])

    const {response: today} = useLoad({
        url: GET_ALL_ORDERS,
        headers: {
            Authorization: `Token ${token}`
        },
        params: {
            day: getFormattedCurrentDate()
        }
    }, [toggle])

    const {response: chooseDay} = useLoad({
        url: GET_ALL_ORDERS,
        headers: {
            Authorization: `Token ${token}`
        },
        params: {
            day: enterDate
        }
    }, [toggle, enterDate])

    const {response: sevenDay} = useLoad({
        url: GET_ALL_ORDERS,
        headers: {
            Authorization: `Token ${token}`
        },
        params: {
            seven_days: getFormattedCurrentDate()
        }
    }, [toggle])

    const {response: month} = useLoad({
        url: GET_ALL_ORDERS,
        headers: {
            Authorization: `Token ${token}`
        },
        params: {
            month: new Date().getMonth() + 1
        }
    }, [toggle])

    const {response: year} = useLoad({
        url: GET_ALL_ORDERS,
        headers: {
            Authorization: `Token ${token}`
        },
        params: {
            year: new Date().getFullYear()
        }
    }, [toggle])


    useEffect(() => {
        if (today?.length) {
            let price = 0
            let debt = 0
            today.forEach((item) => {
                price += parseInt(item.summ)
                debt += parseInt(item.debt)
            })

            setTodayEco({price, debt})
        } else {
            setTodayEco({price: 0, debt: 0})
        }

        if (sevenDay?.length) {
            let price = 0
            let debt = 0
            sevenDay.forEach((item) => {
                price += parseInt(item.summ)
                debt += parseInt(item.debt)
            })

            setSevenEco({price, debt})
        } else {
            setSevenEco({price: 0, debt: 0})
        }

        if (month?.length) {
            let price = 0
            let debt = 0
            month.forEach((item) => {
                price += parseInt(item.summ)
                debt += parseInt(item.debt)
            })

            setMonthEco({price, debt})
        } else {
            setMonthEco({price: 0, debt: 0})
        }

        if (year?.length) {
            let price = 0
            let debt = 0
            year.forEach((item) => {
                price += parseInt(item.summ)
                debt += parseInt(item.debt)
            })

            setYearEco({price, debt})
        } else {
            setYearEco({price: 0, debt: 0})
        }

        if (all?.length) {
            let price = 0
            let debt = 0
            all.forEach((item) => {
                price += parseInt(item.summ)
                debt += parseInt(item.debt)
            })

            setAllEco({price, debt})
        } else {
            setAllEco({price: 0, debt: 0})
        }

        if (chooseDay?.length) {
            let price = 0
            let debt = 0
            chooseDay.forEach((item) => {
                price += parseInt(item.summ)
                debt += parseInt(item.debt)
            })

            setChooseEco({price, debt})
        } else {
            setChooseEco({price: 0, debt: 0})
        }

    }, [today, sevenDay, month, year, all, chooseDay])

    return (
        <div style={{display: 'flex', flexDirection: 'column', width: '100%'}}>
            <Typography variant="h5" component="h2" sx={{textAlign: 'center', mt: 3}}>
                {`${new Date().getDate()}-${new Date().getMonth() + 1}-${new Date().getFullYear()}`} - отчеты за сегодня
            </Typography>

            <TableContainer component={Paper}>
                <Table sx={{minWidth: 650}} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell sx={{fontWeight: 900, fontSize: 16}}>Доходы</TableCell>
                            <TableCell sx={{fontWeight: 900, fontSize: 16}} align="right">Долги</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        <TableRow sx={{'&:last-child td, &:last-child th': {border: 0}}}>
                            <TableCell align="left">{todayEco.price.toLocaleString('en')}</TableCell>
                            <TableCell align="right">{todayEco.debt.toLocaleString('en')}</TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </TableContainer>


            <Typography variant="h5" component="h2" sx={{textAlign: 'center', mt: 3}}>
                {`${new Date().getDate()}-${new Date().getMonth() + 1}-${new Date().getFullYear()}`} -
                {`  ${new Date(new Date().setDate(new Date().getDate() - 7)).getDate()}-${new Date(new Date().setDate(new Date().getDate() - 7)).getMonth() + 1}-${new Date(new Date().setDate(new Date().getDate() - 7)).getFullYear()}   `}
                - отчеты за 7 дней
            </Typography>

            <TableContainer component={Paper}>
                <Table sx={{minWidth: 650}} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell sx={{fontWeight: 900, fontSize: 16}}>Доходы</TableCell>
                            <TableCell sx={{fontWeight: 900, fontSize: 16}} align="right">Долги</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        <TableRow sx={{'&:last-child td, &:last-child th': {border: 0}}}>
                            <TableCell align="left">{sevenEco.price.toLocaleString('en')}</TableCell>
                            <TableCell align="right">{sevenEco.debt.toLocaleString('en')}</TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </TableContainer>


            <Typography variant="h5" component="h2" sx={{textAlign: 'center', mt: 3}}>
                {`${new Date().getMonth() + 1}-${new Date().getFullYear()}`} - отчеты за месяц
            </Typography>

            <TableContainer component={Paper}>
                <Table sx={{minWidth: 650}} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell sx={{fontWeight: 900, fontSize: 16}}>Доходы</TableCell>
                            <TableCell sx={{fontWeight: 900, fontSize: 16}} align="right">Долги</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        <TableRow sx={{'&:last-child td, &:last-child th': {border: 0}}}>
                            <TableCell align="left">{monthEco.price.toLocaleString('en')}</TableCell>
                            <TableCell align="right">{monthEco.debt.toLocaleString('en')}</TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </TableContainer>


            <Typography variant="h5" component="h2" sx={{textAlign: 'center', mt: 3}}>
                {`${new Date().getFullYear()}`} - отчеты за год
            </Typography>

            <TableContainer component={Paper}>
                <Table sx={{minWidth: 650}} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell sx={{fontWeight: 900, fontSize: 16}}>Доходы</TableCell>
                            <TableCell sx={{fontWeight: 900, fontSize: 16}} align="right">Долги</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        <TableRow sx={{'&:last-child td, &:last-child th': {border: 0}}}>
                            <TableCell align="left">{yearEco.price.toLocaleString('en')}</TableCell>
                            <TableCell align="right">{yearEco.debt.toLocaleString('en')}</TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </TableContainer>


            <Typography variant="h5" component="h2" sx={{textAlign: 'center', mt: 3}}>
                отчеты за все время
            </Typography>

            <TableContainer component={Paper}>
                <Table sx={{minWidth: 650}} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell sx={{fontWeight: 900, fontSize: 16}}>Доходы</TableCell>
                            <TableCell sx={{fontWeight: 900, fontSize: 16}} align="right">Долги</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        <TableRow sx={{'&:last-child td, &:last-child th': {border: 0}}}>
                            <TableCell align="left">{allEco.price.toLocaleString('en')}</TableCell>
                            <TableCell align="right">{allEco.debt.toLocaleString('en')}</TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </TableContainer>


            <Typography variant="h5" component="h2" sx={{textAlign: 'center', mt: 3}}>
                Отчеты за выбранное время
            </Typography>


            <div style={{
                padding: 10,
                paddingBottom: 40,
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between'
            }}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                        value={dayjs(enterDate)}
                        sx={{width: '100%', mt: 2}}
                        label={"Дата начало"}
                        onChange={e => setEnterDate(dayjs(new Date(e).toISOString()).format('YYYY-MM-DD'))}
                    />
                </LocalizationProvider>
            </div>

            <TableContainer component={Paper}>
                <Table sx={{minWidth: 650}} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell sx={{fontWeight: 900, fontSize: 16}}>Доходы</TableCell>
                            <TableCell sx={{fontWeight: 900, fontSize: 16}} align="right">Долги</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        <TableRow sx={{'&:last-child td, &:last-child th': {border: 0}}}>
                            <TableCell align="left">{chooseEco.price.toLocaleString('en')}</TableCell>
                            <TableCell align="right">{chooseEco.debt.toLocaleString('en')}</TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    )
}
