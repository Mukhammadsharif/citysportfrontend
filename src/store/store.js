import {configureStore} from '@reduxjs/toolkit'
import languageReducer from './features/languageSlice'
import menuReducer from './features/activeMenuSlice'
import toggleReducer from './features/toggleSlice'

export const store = configureStore({
    reducer: {
        language: languageReducer,
        menuList: menuReducer,
        toggle: toggleReducer
    },
})
