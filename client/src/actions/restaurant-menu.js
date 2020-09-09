import api from '../utils/api';
import { setAlert } from './alert';
import {
  CREATE_CONNECTION_RESTAURANT_MENU,
  DELETE_CONNECTION_RESTAURANT_MENU,
  GET_CONNECTION_RESTAURANT_MENU,
  ERROR_CONNECTION_RESTAURANT_MENU,
} from './types';

export const createConnection = (restaurantId, menus, history) => async (
  dispatch,
) => {
  try {
    const res = await api.post(`/restaurant-menu/connect-menu/${restaurantId}`, menus);
    dispatch({
      type: CREATE_CONNECTION_RESTAURANT_MENU,
      payload: { menus: res.data, restaurant: restaurantId },
    });
    dispatch(setAlert('Connection has been created', 'success'));
    history.push('/dashboard');
  } catch (error) {
    const errors = error.response.data.errors;
    if (errors) {
      errors.forEach((element) => dispatch(setAlert(element.msg, 'danger')));
    }
  }
};

export const getRestaurantMenuConnections = (id) => async (dispatch) => {
  try {
    const res = await api.get(`/restaurant-menu/connected-menu/${id}`);

    dispatch({
      type: GET_CONNECTION_RESTAURANT_MENU,
      payload: { menus: res.data, restaurant: id },
    });
  } catch (error) {
    dispatch({
      type: ERROR_CONNECTION_RESTAURANT_MENU,
      payload: {
        error,
      },
    });
  }
};

//delete connections
export const deleteRestaurantMenuConnections = (menuId, restaurantId) => async (
  dispatch,
) => {
  try {
    const res = await api.delete(
      `/restaurant-menu/connected-menu/${restaurantId}/delete/${menuId}`,
    );

    dispatch({
      type: DELETE_CONNECTION_RESTAURANT_MENU,
      payload: menuId,
    });
    dispatch({
      type: GET_CONNECTION_RESTAURANT_MENU,
      payload: { menus: res.data, restaurant: restaurantId },
    });
    dispatch(setAlert('Menu removed from this restaurant', 'success'));
  } catch (error) {
    dispatch({
      type: ERROR_CONNECTION_RESTAURANT_MENU,
      payload: {
        msg: error.response.statusText,
        status: error.response.status,
      },
    });
  }
};
