import axios from 'axios'
import humps from 'humps'

// export const domain = ' http://127.0.0.1:8000/'
// export const domain = 'http://95.130.227.173/'

export const domain = 'https://mukhammadsharif.pythonanywhere.com/'
//  Add Base URL and change snake_case to camelCase
const baseAxios = axios.create({
    baseURL: `${domain}`,
    transformResponse: [
        ...axios.defaults.transformResponse,
        humps.camelizeKeys,
    ],
    transformRequest: [
        humps.decamelizeKeys,
        ...axios.defaults.transformRequest,
    ],
})

baseAxios.interceptors.request.use((config) => ({
    ...config,
    params: humps.decamelizeKeys(config.params),
}))

export default baseAxios
