import { GET_CURRENCIES } from './types';
import api from '../utils/api';

export const getCurrencyTypes = () => async (dispatch) => {
  try {
    const res = await api.get('/currency/');
    dispatch({
      type: GET_CURRENCIES,
      payload: res.data,
    });
  } catch (error) {
    throw error;
  }
};
