import {createSlice} from '@reduxjs/toolkit'

const initialState = false

export const toggleSlice = createSlice({
    name: 'toggle',
    initialState,
    reducers: {
        changeToggle: (state, action) => {
            state = action.payload
            return state
        },
    },
})

export const {changeToggle} = toggleSlice.actions

export default toggleSlice.reducer
