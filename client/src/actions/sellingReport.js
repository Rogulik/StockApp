import {
  CREATE_SELLING_REPORT,
  GET_SELLING_REPORT_BY_DATE,
  DELETE_SELLING_REPORT,
  UPDATE_ITEM_FROM_SELLING_REPORT,
  ERROR_SELLING_REPORT,
} from './types';
import api from '../utils/api';
import { setAlert } from './alert';

export const createSellingReport = (restaurantId, formData, history) => async (
  dispatch,
) => {
  try {
    const res = await api.post(`/daily-selling-report/create-report/${restaurantId}`, formData);

    dispatch({
      type: CREATE_SELLING_REPORT,
      payload: res.data,
    });
    history.push('/dashboard');
    dispatch(setAlert('Daily Report has been created', 'success'));
  } catch (error) {
    dispatch({
      type: ERROR_SELLING_REPORT,
      payload: error.response.data,
    });
    
    dispatch(setAlert(error.response.data,'danger'))

    const errors = error.response.data.errors;
    if (errors) {
      errors.forEach((element) => dispatch(setAlert(element.msg, 'danger')));
    }
  }
};

export const showSellingReportByDate = (restaurantId, reportDate) => async (
  dispatch,
) => {
  try {
    const res = await api.get(
      `/daily-selling-report/${restaurantId}/report-list/${reportDate}`,
    );

    dispatch({
      type: GET_SELLING_REPORT_BY_DATE,
      payload: res.data,
    });
  } catch (error) {
    dispatch({
      type: ERROR_SELLING_REPORT,
      payload: error.response.data,
    });
    dispatch(setAlert(error.response.data.msg, 'warning'));
  }
};

export const deleteSellingReportByDate = (restaurantId, reportDate) => async (
  dispatch,
) => {
  try {
    const res = await api.delete(
      `/daily-selling-report/${restaurantId}/delete-report/${reportDate}`,
    );
    dispatch({
      type: DELETE_SELLING_REPORT,
    });
    dispatch(setAlert(res.data, 'warning'));
  } catch (error) {
    dispatch({
      type: ERROR_SELLING_REPORT,
      payload: error.response,
    });
  }
};

export const updateSingleItemFromReport = (
  restaurantId,
  dishId,
  updatedFormData,
) => async (dispatch) => {
  try {
    const res = await api.put(
      `/daily-selling-report/${restaurantId}/update-report/${dishId}`,
      updatedFormData,
    );
    dispatch({
      type: UPDATE_ITEM_FROM_SELLING_REPORT,
      payload: res.data,
    });
    dispatch(setAlert('Report has been updated', 'success'));
  } catch (error) {
    dispatch({
      type: ERROR_SELLING_REPORT,
      payload: error.response,
    });
  }
};
