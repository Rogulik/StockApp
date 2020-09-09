import {
  CREATE_DISHES,
  GET_DISHES,
  GET_DISHES_BY_RESTAURANT,
  GET_DISH,
  UPDATE_DISH,
  DELETE_DISH,
  ERROR_DISHES,
} from './types';
import api from '../utils/api';
import { setAlert } from './alert';

//get the dishess for specific menu
export const getDishes = (menuId) => async (dispatch) => {
  try {
    const res = await api.get(`/dish/${menuId}/list`);
    dispatch({
      type: GET_DISHES,
      payload: res.data,
    });
  } catch (error) {
    dispatch({
      type: ERROR_DISHES,
      payload: { error: error },
    });
  }
};
//get the dishess for specific restaurant
export const getDishesByRestaurant = (restaurantId) => async (dispatch) => {
  try {
    const res = await api.get(`/dish/connected-dishes/${restaurantId}`);
    dispatch({
      type: GET_DISHES_BY_RESTAURANT,
      payload: res.data,
    });
  } catch (error) {
    dispatch({
      type: ERROR_DISHES,
      payload: { error },
    });
  }
};
//get the single dish for specific menu
export const getDish = (menuId, dishId) => async (dispatch) => {
  try {
    const res = await api.get(`/dish/${menuId}/single/${dishId}`);
    dispatch({
      type: GET_DISH,
      payload: res.data,
    });
  } catch (error) {
    dispatch({
      type: ERROR_DISHES,
      payload: { error: error.msg },
    });
  }
};

//create the dish for specific menu
export const createDishes = (menuId, formData, history) => async (dispatch) => {
  try {
    const res = await api.post(`/dish/${menuId}/create-dish`, formData);

    dispatch({
      type: CREATE_DISHES,
      payload: res.data,
    });

    dispatch(
      setAlert(
        formData.length === 1
          ? 'Dish has been created'
          : 'Dishes have been created',
        'success',
      ),
    );
    history.push(`/show-dish/${menuId}`);
  } catch (error) {
    dispatch({
      type: ERROR_DISHES,
      payload: { error: error.msg },
    });
  }
};

//delete the dish for specific menu
export const deleteDish = (menuId, dishId) => async (dispatch) => {
  try {
    await api.delete(`/dish/${menuId}/delete/${dishId}`);

    dispatch({
      type: DELETE_DISH,
      payload: dishId,
    });

    dispatch(setAlert('Dish has been deleted', 'warning'));
  } catch (error) {
    dispatch({
      type: ERROR_DISHES,
      payload: { error: error.msg },
    });
  }
};

//update individual dish for specific menu
export const updateDish = (menuId, dishId, updateFormData, history) => async (
  dispatch,
) => {
  try {
    const res = await api.put(
      `/dish/${menuId}/update/${dishId}`,
      updateFormData,
    );

    dispatch({
      type: UPDATE_DISH,
      payload: res.data,
    });

    dispatch(setAlert('Dish has been updated', 'info'));
    history.push(`/show-dish/${menuId}`);
  } catch (error) {
    dispatch({
      type: ERROR_DISHES,
      payload: { error: error.msg },
    });
  }
};
