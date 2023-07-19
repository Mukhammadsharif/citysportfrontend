import React, {useState} from 'react'
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import {useLoad} from "../hooks/request";
import {GET_ALL_ORDERS} from "../tools/urls";
import {useNavigate} from "react-router-dom";
import {TableFooter, TablePagination} from "@mui/material";
import {useTheme} from "@mui/material/styles";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import LastPageIcon from "@mui/icons-material/LastPage";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";
import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft";
import PropTypes from "prop-types";
import CreateOrder from "./CreateOrder";
import {useSelector} from "react-redux";
import {getFormattedCurrentDate} from "../tools/helpers";

function TablePaginationActions(props) {
    const theme = useTheme();
    const {count, page, rowsPerPage, onPageChange} = props;

    const handleFirstPageButtonClick = (event) => {
        onPageChange(event, 0);
    };

    const handleBackButtonClick = (event) => {
        onPageChange(event, page - 1);
    };

    const handleNextButtonClick = (event) => {
        onPageChange(event, page + 1);
    };

    const handleLastPageButtonClick = (event) => {
        onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
    };

    return (
        <Box sx={{flexShrink: 0, ml: 2.5}}>
            <IconButton
                onClick={handleFirstPageButtonClick}
                disabled={page === 0}
                aria-label="first page"
            >
                {theme.direction === 'rtl' ? <LastPageIcon/> : <FirstPageIcon/>}
            </IconButton>
            <IconButton
                onClick={handleBackButtonClick}
                disabled={page === 0}
                aria-label="previous page"
            >
                {theme.direction === 'rtl' ? <KeyboardArrowRight/> : <KeyboardArrowLeft/>}
            </IconButton>
            <IconButton
                onClick={handleNextButtonClick}
                disabled={page >= Math.ceil(count / rowsPerPage) - 1}
                aria-label="next page"
            >
                {theme.direction === 'rtl' ? <KeyboardArrowLeft/> : <KeyboardArrowRight/>}
            </IconButton>
            <IconButton
                onClick={handleLastPageButtonClick}
                disabled={page >= Math.ceil(count / rowsPerPage) - 1}
                aria-label="last page"
            >
                {theme.direction === 'rtl' ? <FirstPageIcon/> : <LastPageIcon/>}
            </IconButton>
        </Box>
    );
}

TablePaginationActions.propTypes = {
    count: PropTypes.number.isRequired,
    onPageChange: PropTypes.func.isRequired,
    page: PropTypes.number.isRequired,
    rowsPerPage: PropTypes.number.isRequired,
};

export default function AllOrders() {
    const navigate = useNavigate()
    const token = localStorage.getItem('token')
    const toggle = useSelector(state => state.toggle)
    const [filterParams, setFilterParams] = useState({day: getFormattedCurrentDate()})
    const {response} = useLoad({
        url: GET_ALL_ORDERS,
        headers: {
            Authorization: `Token ${token}`
        },
        params: filterParams
    }, [toggle, filterParams])


    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(100);

    // Avoid a layout jump when reaching the last page with empty rows.
    const emptyRows =
        page > 0 ? Math.max(0, (1 + page) * rowsPerPage - response?.length) : 0;

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };


    return (
        <div style={{display: 'flex', flexDirection: 'column', width: '100%'}}>
            <CreateOrder filterParams={filterParams} setFilterParams={setFilterParams}/>
            <TableContainer component={Paper}>
                <Table sx={{minWidth: '100%'}} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell sx={{fontWeight: 900}}>Тип</TableCell>
                            <TableCell align="right" sx={{fontWeight: 900}}>Номер</TableCell>
                            <TableCell align="right" sx={{fontWeight: 900}}>Вход</TableCell>
                            <TableCell align="right" sx={{fontWeight: 900}}>Выход</TableCell>
                            <TableCell align="right" sx={{fontWeight: 900}}>Сумма</TableCell>
                            <TableCell align="right" sx={{fontWeight: 900}}>Количество</TableCell>
                            <TableCell align="right" sx={{fontWeight: 900}}>Плавки</TableCell>
                            <TableCell align="right" sx={{fontWeight: 900}}>Массаж</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {(rowsPerPage > 0
                                ? response?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                : response
                        )?.toReversed().map((row) => (
                            <TableRow
                                key={row.id}
                                sx={{
                                    '&:last-child td, &:last-child th': {border: 0},
                                    backgroundColor: row.isClosed ? '#00DFC8' : '',
                                    cursor: 'pointer'
                                }}
                                onClick={() => {
                                    navigate('/order-detail', {state: {id: row?.id}})
                                }}
                            >
                                <TableCell component="th" scope="row">
                                    {row.type === 'sauna'
                                        ? 'Сауна'
                                        : row.type === 'pool'
                                            ? 'Бассейн'
                                            : row.type === 'billiard'
                                                ? 'Биллиард'
                                                : 'Трен/Зал'

                                    }
                                </TableCell>

                                <TableCell align="right">
                                    {row.type === 'sauna'
                                        ? row?.sauna?.name
                                        : row.type === 'pool'
                                            ? row?.pool?.name
                                            : row.type === 'billiard'
                                                ? row?.billiard?.name
                                                : row?.training?.name

                                    }
                                </TableCell>
                                <TableCell align="right">
                                    <div style={{display: 'flex', flexDirection: 'column'}}>
                                        <div>{`${new Date(row.dateEntered).getHours()}:${new Date(row.dateEntered).getMinutes()}`}</div>
                                        {/*<div>{`${new Date(row.dateEntered).getFullYear()}-${new Date(row.dateEntered).getMonth()}-${new Date(row.dateEntered).getDate()}`}</div>*/}
                                    </div>
                                </TableCell>
                                <TableCell align="right">
                                    <div style={{display: 'flex', flexDirection: 'column'}}>
                                        <div>{`${new Date(row.dateExit).getHours()}:${new Date(row.dateExit).getMinutes()}`}</div>
                                        {/*<div>{`${new Date(row.dateExit).getFullYear()}-${new Date(row.dateExit).getMonth()}-${new Date(row.dateExit).getDate()}`}</div>*/}
                                    </div>
                                </TableCell>
                                <TableCell align="right">{parseInt(row?.summ).toLocaleString('en')}</TableCell>
                                <TableCell align="right">{row?.number}</TableCell>
                                <TableCell align="right">{row.shortsNumber}</TableCell>
                                <TableCell align="right">{row.relax ? 'Да' : 'Нет'}</TableCell>
                            </TableRow>
                        ))}
                        {emptyRows > 0 && (
                            <TableRow style={{height: 53 * emptyRows}}>
                                <TableCell colSpan={6}/>
                            </TableRow>
                        )}
                    </TableBody>

                    <TableFooter>
                        <TableRow>
                            <TablePagination
                                rowsPerPageOptions={[100, 50, 25, 10, {label: 'All', value: -1}]}
                                colSpan={10}
                                count={response?.length}
                                rowsPerPage={rowsPerPage}
                                page={page}
                                onPageChange={handleChangePage}
                                onRowsPerPageChange={handleChangeRowsPerPage}
                                ActionsComponent={TablePaginationActions}
                            />
                        </TableRow>
                    </TableFooter>
                </Table>
            </TableContainer>
        </div>
    )
}
