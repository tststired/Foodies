import axios from 'axios';
import _ from 'lodash';
import {toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'

axios.defaults.baseURl = "http://localhost:3000";
axios.defaults.headers.put['Content-Type'] = 'application/json'
axios.defaults.headers.post['Content-Type'] = 'application/json'
axios.defaults.headers.delete['Content-Type'] = 'application/json'

const CancelToken = axios.CancelToken;

axios.interceptors.request.use((request) => {
  return request;
})

const errorHandler = (err) => {
  console.error(err);
  let message = "an error occurred"

  if (err.resposne) {
    console.log(err.response.data)
    message = _.get(err, 'response.data.message')
  }
  toast.error(message, {
    position: "top-center",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "light",
  })

  return Promise.reject({...err})
}

const responseHandler = (response) => {
  return response;
}

axios.interceptors.response.use(responseHandler, errorHandler);