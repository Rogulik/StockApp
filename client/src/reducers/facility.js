import {
  GET_FACILITY,
  FACILITY_ERROR,
  GET_FACILITIES,
  CREATE_FACILITIES,
  FACILITIES_ERROR,
  CLEAR_FACILITIES,
  DELETE_FACILITY,
} from '../actions/types';

const initialState = {
  facility: { loading: true },
  facilities: [],
  loading: true,
  error: {},
};

export default function (state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case GET_FACILITIES:
    case CREATE_FACILITIES:
      return {
        ...state,
        facilities: payload,
        loading: false,
      };
    case GET_FACILITY:
      return {
        ...state,
        facilities: [],
        facility: { ...payload, loading: false },
        loading: false,
      };
    case FACILITIES_ERROR:
    case FACILITY_ERROR:
      return {
        ...state,
        error: payload,
        loading: false,
      };
    case CLEAR_FACILITIES:
      return {
        ...state,
        facility: {},
        facilities: [],
        loading: false,
      };
    case DELETE_FACILITY:
      return {
        ...state,
        facilities: state.facilities.filter(
          (facility) => facility.id_facility !== payload,
        ),
        loading: false,
      };
    default:
      return state;
  }
}
