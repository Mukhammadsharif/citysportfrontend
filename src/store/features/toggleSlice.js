import { createSlice } from '@reduxjs/toolkit'
import { LANGUAGE } from '../../tools/constant'

const initialState = localStorage.getItem(LANGUAGE) ? localStorage.getItem(LANGUAGE) : 'uz'

export const languageSlice = createSlice({
    name: 'languageChange',
    initialState,
    reducers: {
        changeLanguage: (state, action) => {
            state = action.payload
            return state
        },
    },
})

export const { changeLanguage } = languageSlice.actions

export default languageSlice.reducer
