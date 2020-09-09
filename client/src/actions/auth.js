import api from '../utils/api';
import {
  REGISTER_SUCCESS,
  REGISTER_FAIL,
  USER_LOADED,
  AUTH_ERROR,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  LOGOUT,
  CLEAR_FACILITIES,
  CLEAR_MENUS,
  ACCOUNT_DELETED,
  ACCOUNT_UPDATED,
  CLEAR_CONNECTION_RESTAURANT_MENU,
} from './types';
import { setAlert } from './alert';

//load user
export const loadUser = () => async (dispatch) => {
  try {
    const res = await api.get('/auth');

    dispatch({
      type: USER_LOADED,
      payload: res.data,
    });
  } catch (error) {
    dispatch({
      type: AUTH_ERROR,
    });
  }
};

//register user
export const register = ({ first_name, last_name, email, password }) => async (
  dispatch,
) => {
  const body = JSON.stringify({ first_name, last_name, email, password });

  try {
    const res = await api.post('/users', body);

    dispatch({
      type: REGISTER_SUCCESS,
      payload: res.data,
    });
    dispatch(loadUser());
  } catch (error) {
    const errors = error.response.data.errors;
    if (errors) {
      errors.forEach((element) => dispatch(setAlert(element.msg, 'danger')));
    }

    dispatch({
      type: REGISTER_FAIL,
    });
  }
};

//login user
export const login = (email, password) => async (dispatch) => {
  const body = JSON.stringify({ email, password });

  try {
    const res = await api.post('/auth', body);

    dispatch({
      type: LOGIN_SUCCESS,
      payload: res.data,
    });
    dispatch(loadUser());
  } catch (error) {
    const errors = error.response.data.errors;
    if (errors) {
      errors.forEach((element) => dispatch(setAlert(element.msg, 'danger')));
    }

    dispatch({
      type: LOGIN_FAIL,
    });
  }
};

//delete user

export const deleteAccount = () => async (dispatch) => {
  if (window.confirm('Are you sure you want delete this account')) {
    try {
      await api.delete('/api/auth');

      dispatch({ type: CLEAR_FACILITIES });
      dispatch({ type: CLEAR_MENUS });
      dispatch({ type: ACCOUNT_DELETED });
      dispatch({ CLEAR_CONNECTION_RESTAURANT_MENU });
      dispatch(setAlert('Account has been deleted', 'warning'));
    } catch (error) {
      dispatch({
        type: AUTH_ERROR,
      });
    }
  }
};
//update user
export const updateAccount = (oldPassword, password, history) => async (
  dispatch,
) => {
  const body = JSON.stringify({ oldPassword, password });

  try {
    const res = await api.put('/api/auth', body);
    dispatch({
      type: ACCOUNT_UPDATED,
      payload: res.data,
    });
    dispatch(loadUser());
    dispatch(setAlert('Account has been updated', 'success'));
    history.push('/dashboard');
  } catch (error) {
    const errors = error.response.data.errors;
    if (errors) {
      errors.forEach((element) => dispatch(setAlert(element.msg, 'danger')));
    }
  }
};

//logout and clear facilities from the dashboard
export const logout = () => (dispatch) => {
  dispatch({ type: LOGOUT });
  dispatch({ type: CLEAR_FACILITIES });
  dispatch({ type: CLEAR_MENUS });
  dispatch({ type: CLEAR_CONNECTION_RESTAURANT_MENU });
};
