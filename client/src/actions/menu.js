import api from '../utils/api';
import { setAlert } from './alert';

import {
  GET_MENUS,
  MENUS_ERROR,
  CREATE_MENUS,
  DELETE_MENU,
  GET_MENU,
} from './types';

//Get current user menus
export const getUserMenus = () => async (dispatch) => {
  try {
    const res = await api.get('/menu/me');

    dispatch({
      type: GET_MENUS,
      payload: res.data,
    });
  } catch (error) {
    dispatch({
      type: MENUS_ERROR,
      payload: {
        error: error.msg,
      },
    });
  }
};
//get single menu of the user
export const getUserMenu = (id) => async (dispatch) => {
  try {
    const res = await api.get(`/menu/me/${id}`);
    dispatch({
      type: GET_MENU,
      payload: res.data,
    });
  } catch (error) {
    dispatch({
      type: MENUS_ERROR,
      payload: {
        error: error.msg,
      },
    });
  }
};

//create menus
export const createMenu = (formData, history) => async (dispatch) => {
  try {
    const res = await api.post('/menu', formData);

    dispatch({
      type: CREATE_MENUS,
      payload: res.data,
    });

    dispatch(
      setAlert(
        formData.length === 1
          ? 'Menu has been created'
          : 'Menus have been created',
        'success',
      ),
    );
    history.push('/menu');
  } catch (error) {
    const errors = error.response.data.errors;
    if (errors) {
      errors.forEach((element) => dispatch(setAlert(element.msg, 'danger')));
    }
  }
};

//delete menu

export const deleteMenu = (id) => async (dispatch) => {
  try {
    const res = await api.delete(`/menu/${id}`);

    dispatch({
      type: DELETE_MENU,
      payload: id,
    });

    dispatch({
      type: GET_MENUS,
      payload: res.data,
    });

    dispatch(setAlert('Menu Removed', 'success'));
  } catch (error) {
    dispatch({
      type: MENUS_ERROR,
      payload: {
        msg: error.response.statusText,
        status: error.response.status,
      },
    });
  }
};
