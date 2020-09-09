import api from '../utils/api';
import { setAlert } from './alert';

import {
  GET_FACILITIES,
  CLEAR_FACILITIES,
  FACILITIES_ERROR,
  CREATE_FACILITIES,
  DELETE_FACILITY,
  GET_FACILITY,
} from './types';

//Get current user facilities
export const getUserFacilities = () => async (dispatch) => {
  try {
    const res = await api.get('/facility/me');

    dispatch({
      type: GET_FACILITIES,
      payload: res.data,
    });
  } catch (error) {
    dispatch({
      type: FACILITIES_ERROR,
      payload: {
        msg: error.response.statusText,
        status: error.response.status,
      },
    });
  }
};

//get single facility of the user
export const getUserFacility = (id) => async (dispatch) => {
  try {
    const res = await api.get(`/facility/${id}`);
    dispatch({
      type: GET_FACILITY,
      payload: res.data,
    });
  } catch (error) {
    dispatch({
      type: FACILITIES_ERROR,
      payload: {
        msg: error.response,
        status: error.response,
      },
    });
  }
};

//create facility
export const createFacility = (formData, history) => async (dispatch) => {
  try {
    const res = await api.post('/facility', formData);

    dispatch({
      type: CREATE_FACILITIES,
      payload: res.data,
    });

    dispatch(
      setAlert(
        formData.length === 1
          ? 'Facility has been created'
          : 'Facilities have been created',
        'success',
      ),
    );
    history.push('/dashboard');
  } catch (error) {
    const errors = error.response.data.errors;
    if (errors) {
      errors.forEach((element) => dispatch(setAlert(element.msg, 'danger')));
    }
    dispatch(setAlert(error.response.data,'danger'))
  }
};

//delete facility
export const deleteFacility = (id) => async (dispatch) => {
  try {
    const res = await api.delete(`/facility/${id}`);

    dispatch({
      type: DELETE_FACILITY,
      payload: id,
    });

    dispatch({
      type: GET_FACILITIES,
      payload: res.data,
    });

    dispatch(setAlert('Facility Removed', 'success'));
  } catch (error) {
    dispatch({
      type: FACILITIES_ERROR,
      payload: {
        msg: error.response.statusText,
        status: error.response.status,
      },
    });
  }
};
