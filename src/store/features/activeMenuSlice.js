import {createSlice} from '@reduxjs/toolkit'

const initialState = {
    all: true,
    sauna: false,
    pool: false,
    billiard: false,
    training: false,
    exit: false,
    detail: false,
    subscriptions: false,
    economics: false,
}

export const ActiveMenuSlice = createSlice({
    name: 'menuList',
    initialState,
    reducers: {
        changeActiveMenu: (state, action) => {
            state = action.payload
            return state
        }
    }
})

export const {changeActiveMenu} = ActiveMenuSlice.actions

export default ActiveMenuSlice.reducer
