import axios from 'axios'
// import router from '@/router/index'

// const baseURL = process.env.NODE_ENV === 'production' ? process.env.VUE_APP_BASE_URL : 'https://localhost:5001/'
const baseProxyURL = process.env.VUE_APP_PROXY_URL + process.env.VUE_APP_CLICKUP_URL

const HTTP_PROXY = axios.create({
	baseURL: baseProxyURL,
	timeout: 20000,
	headers: {
		Accept: 'application/json',
		Authorization: process.env.VUE_APP_CLICKUP_TOKEN,
	},
})

const showError = (error) => console.error(error.response.status, error.message)

const errorStatus = (type, error) => {
	if (type === 401) {
		// localStorage.removeItem('authcode') // REMOVE TOKEN
		// router.go() // Refresh quando não esta autorizado
		showError(error)
	}
}

const errorInterceptor = error => {
	if (!error.response) return Promise.reject(error)

	errorStatus(error.response.status, error)
	return Promise.reject(error)
}

const responseInterceptor = ({ config, data, status, statusText }) => {
	if (status >= 200 && status < 300) {
		return Promise.resolve({ config, data, status, statusText })
	}
	return Promise.reject({ config, data, status, statusText })
}

HTTP_PROXY.interceptors.response.use(responseInterceptor, errorInterceptor)

export { HTTP_PROXY }
