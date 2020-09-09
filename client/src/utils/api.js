import axios from 'axios';
import store from '../store';
import {
  LOGOUT,
  CLEAR_FACILITIES,
  CLEAR_MENUS,
  CLEAR_DISHES,
  CLEAR_CONNECTION_RESTAURANT_MENU,
} from '../actions/types';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});
/**
 intercept any error responses from the api
 and check if the token is no longer valid.
 ie. Token has expired
 logout the user if the token has expired
**/

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.message === 'Token is not valid') {
      store.dispatch({ type: LOGOUT });
      store.dispatch({ type: CLEAR_FACILITIES });
      store.dispatch({ type: CLEAR_MENUS });
      store.dispatch({ type: CLEAR_DISHES });
      store.dispatch({ type: CLEAR_CONNECTION_RESTAURANT_MENU });
    }
    return Promise.reject(err);
  },
);

export default api;
