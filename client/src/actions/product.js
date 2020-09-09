import {
    CREATE_PRODUCTS,
    GET_PRODUCTS,
    GET_PRODUCT,
    UPDATE_PRODUCT,
    DELETE_PRODUCT,
    ERROR_PRODUCT,
  } from './types';
  import api from '../utils/api';
  import { setAlert } from './alert';

  
  //get the products for specific user
  export const getProducts = () => async (dispatch) => {
    try {
      const res = await api.get(`/product/`);
      dispatch({
        type: GET_PRODUCTS,
        payload: res.data,
      });
    } catch (error) {
      dispatch({
        type: ERROR_PRODUCT,
        payload: { error: error },
      });
    }
  };
  
  //get the single product for specific user
  export const getProduct = (productId) => async (dispatch) => {
    try {
      const res = await api.get(`/product/${productId}`);
      dispatch({
        type: GET_PRODUCT,
        payload: res.data,
      });
    } catch (error) {
      dispatch({
        type: ERROR_PRODUCT,
        payload: { error: error.msg },
      });
    }
  };
  
  export const createProducts = (formData, history) => async (dispatch) => {
    try {
      const res = await api.post(`/product/`, formData);
  
      dispatch({
        type: CREATE_PRODUCTS,
        payload: res.data,
      });
  
      dispatch(
        setAlert(
          formData.length === 1
            ? 'Product has been created'
            : 'Product have been created',
          'success',
        ),
      );
      history.push(`/display-product`);
    } catch (error) {
      const singleError = error.response.data
      dispatch({
        type: ERROR_PRODUCT,
        payload: { error: singleError },
      });
      const errors = error.response.data.errors;
      dispatch(setAlert(singleError,'danger'))
      if (errors) {
        errors.forEach((element) => dispatch(setAlert(element.msg, 'danger')));
      }
    }
  };
  
  export const deleteProduct = (productId) => async (dispatch) => {
    try {
      await api.delete(`/product/${productId}`);
  
      dispatch({
        type: DELETE_PRODUCT,
        payload: productId,
      });
  
      dispatch(setAlert('Product has been deleted', 'warning'));
    } catch (error) {
      dispatch({
        type: ERROR_PRODUCT,
        payload: { error: error.msg },
      });
    }
  };
  
  export const updateProduct = (productId, updateFormData, history) => async (
    dispatch,
  ) => {
    try {
      const res = await api.put(
        `/product/${productId}`,
        updateFormData,
      );
  
      dispatch({
        type: UPDATE_PRODUCT,
        payload: res.data,
      });
  
      dispatch(setAlert('Product has been updated', 'info'));
      history.push(`/display-product`);
    } catch (error) {
      dispatch({
        type: ERROR_PRODUCT,
        payload: { error: error.msg },
      });
    }
  };
  