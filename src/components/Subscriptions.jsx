import React from 'react'
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import {useLoad} from "../hooks/request";
import {GET_SUBSCRIPTIONS} from "../tools/urls";
import {useNavigate} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {TableFooter, TablePagination} from "@mui/material";
import {useTheme} from "@mui/material/styles";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import LastPageIcon from "@mui/icons-material/LastPage";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";
import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft";
import PropTypes from "prop-types";
import CreateSubscription from "./CreateSubscription";

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

export default function Subscriptions() {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const toggle = useSelector(state => state.toggle)
    const token = localStorage.getItem('token')
    const {response} = useLoad({
        url: GET_SUBSCRIPTIONS,
        headers: {
            Authorization: `Token ${token}`
        }
    }, [toggle])


    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);

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
            <CreateSubscription/>
            <TableContainer component={Paper}>
                <Table sx={{minWidth: '100%'}} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell sx={{fontWeight: 900}}>Имя</TableCell>
                            <TableCell align="right" sx={{fontWeight: 900}}>Тип</TableCell>
                            <TableCell align="right" sx={{fontWeight: 900}}>Начало</TableCell>
                            <TableCell align="right" sx={{fontWeight: 900}}>Конец</TableCell>
                            <TableCell align="right" sx={{fontWeight: 900}}>Сумма</TableCell>
                            <TableCell align="right" sx={{fontWeight: 900}}>Телефон</TableCell>
                            <TableCell align="right" sx={{fontWeight: 900}}>Задолжность</TableCell>
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
                                    navigate('/subscription-detail', {state: {id: row?.id}})
                                }}
                            >
                                <TableCell component="th" scope="row">
                                    {row?.name}
                                </TableCell>

                                <TableCell align="right">
                                    {row?.type}
                                </TableCell>
                                <TableCell align="right">
                                    {row?.subscriptionDate}
                                </TableCell>
                                <TableCell align="right">
                                    {row?.expirationDate}
                                </TableCell>
                                <TableCell align="right" sx={{bgcolor: row?.debt !== '0.00' ? 'red' : ''}}>
                                    {parseInt(row?.price).toLocaleString('en')}
                                </TableCell>
                                <TableCell align="right">{row?.phone}</TableCell>
                                <TableCell align="right">{parseInt(row?.debt).toLocaleString('en')}</TableCell>
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
                                rowsPerPageOptions={[{label: 'All', value: -1}, 50, 25, 10]}
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
