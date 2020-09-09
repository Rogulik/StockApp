import {
    CREATE_STOCK_REPORT,
    GET_STOCK_REPORT_BY_DATE,
    DELETE_STOCK_REPORT,
    UPDATE_ITEM_FROM_SELLING_REPORT,
    ERROR_SELLING_REPORT,
  } from './types';

  import api from '../utils/api';
  import { setAlert } from './alert';
  
  export const createStockReport = (facilityId,reportDate, formData, history) => async (
    dispatch,
  ) => {
    try {
      const res = await api.post(`/daily-stock-report/create-report/${facilityId}/${reportDate}`, formData);
  
      dispatch({
        type: CREATE_STOCK_REPORT,
        payload: res.data,
      });

      history.push('/display-product');
      dispatch(setAlert('Daily Stock Report has been created', 'success'));
    } catch (error) {
      dispatch({
        type: ERROR_SELLING_REPORT,
        payload: error.response.data,
      });
      
      // dispatch(setAlert(error.response.data,'danger'))
  
      const errors = error.response.data.errors;
      if (errors) {
        errors.forEach((element) => dispatch(setAlert(element.msg, 'danger')));
      }
    }
  };
  
  export const showStockReportByDate = (facilityId, reportDate) => async (
    dispatch,
  ) => {
    try {
      const res = await api.get(
        `/daily-stock-report/${facilityId}/report-list/${reportDate}`,
      );
  
      dispatch({
        type: GET_STOCK_REPORT_BY_DATE,
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
  
export const deleteStockReportByDate = (facilityId, reportDate) => async (
    dispatch,
  ) => {
    try {
      const res = await api.delete(
        `/daily-stock-report/${facilityId}/delete-report/${reportDate}`,
      );
      dispatch({
        type: DELETE_STOCK_REPORT,
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
    facilityId,
    dishId,
    updatedFormData,
  ) => async (dispatch) => {
    try {
      const res = await api.put(
        `/daily-stock-report/${facilityId}/update-report/${dishId}`,
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
  