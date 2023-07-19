import React from 'react'
import {useDispatch, useSelector} from "react-redux";
import {changeActiveMenu} from "../store/features/activeMenuSlice";

export default function CustomMenu() {
    const dispatch = useDispatch()
    const menu = useSelector(state => state.menuList)
    const userType = localStorage.getItem('userType')

    return (
        <div style={{
            height: '100vh',
            width: '20%',
            padding: 20,
            backgroundColor: '#1771F1',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-around',
            position: 'sticky',
            top: 0
        }}>
            <div
                onClick={() => {
                    dispatch(changeActiveMenu(
                        {
                            all: true,
                            sauna: false,
                            pool: false,
                            billiard: false,
                            training: false,
                            exit: true,
                            subscriptions: false,
                            detail: false,
                            economics: false,
                        }
                    ))
                }}
                className={'menu-item'}>
                Все посететели
            </div>

            <div
                onClick={() => {
                    dispatch(changeActiveMenu(
                        {
                            all: false,
                            sauna: true,
                            pool: false,
                            billiard: false,
                            training: false,
                            exit: false,
                            subscriptions: false,
                            detail: false,
                            economics: false,
                        }
                    ))
                }}
                className={'menu-item'}>
                Сауна
            </div>

            <div
                onClick={() => {
                    dispatch(changeActiveMenu(
                        {
                            all: false,
                            sauna: false,
                            pool: true,
                            billiard: false,
                            training: false,
                            exit: false,
                            subscriptions: false,
                            detail: false,
                            economics: false,
                        }
                    ))
                }}
                className={'menu-item'}>
                Бассейн
            </div>

            <div
                onClick={() => {
                    dispatch(changeActiveMenu(
                        {
                            all: false,
                            sauna: false,
                            pool: false,
                            billiard: true,
                            training: false,
                            exit: false,
                            subscriptions: false,
                            detail: false,
                            economics: false,
                        }
                    ))
                }}
                className={'menu-item'}>
                Биллиард
            </div>

            <div
                onClick={() => {
                    dispatch(changeActiveMenu(
                        {
                            all: false,
                            sauna: false,
                            pool: false,
                            billiard: false,
                            training: true,
                            exit: false,
                            subscriptions: false,
                            detail: false,
                            economics: false,
                        }
                    ))
                }}
                className={'menu-item'}>
                Тренажерный зал
            </div>

            <div
                onClick={() => {
                    dispatch(changeActiveMenu(
                        {
                            all: false,
                            sauna: false,
                            pool: false,
                            billiard: false,
                            training: false,
                            exit: false,
                            subscriptions: true,
                            detail: false,
                            economics: false,
                        }
                    ))
                }}
                className={'menu-item'}>
                Абонементы
            </div>

            {userType === 'admin' ? (
                <div
                    onClick={() => {
                        dispatch(changeActiveMenu(
                            {
                                all: false,
                                sauna: false,
                                pool: false,
                                billiard: false,
                                training: false,
                                exit: false,
                                subscriptions: false,
                                detail: false,
                                economics: true,
                            }
                        ))
                    }}
                    className={'menu-item'}>
                    Отчеты
                </div>
            ) : ''}

            <div
                onClick={() => {
                    dispatch(changeActiveMenu(
                        {
                            all: false,
                            sauna: false,
                            pool: false,
                            billiard: false,
                            training: false,
                            exit: true,
                            subscriptions: false,
                            detail: false,
                            economics: false,
                        }
                    ))
                }}
                className={'menu-item'}>
                Выход
            </div>
        </div>
    )
}
