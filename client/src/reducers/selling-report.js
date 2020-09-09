import {
  CREATE_SELLING_REPORT,
  GET_SELLING_REPORT_BY_DATE,
  DELETE_SELLING_REPORT,
  UPDATE_ITEM_FROM_SELLING_REPORT,
  ERROR_SELLING_REPORT,
} from '../actions/types';

const intitialState = {
  sellingReport: [],
  loading: true,
  errors: {},
};

export default function (state = intitialState, action) {
  const { type, payload } = action;

  switch (type) {
    case GET_SELLING_REPORT_BY_DATE:
    case UPDATE_ITEM_FROM_SELLING_REPORT:
    case CREATE_SELLING_REPORT:
      return {
        ...state,
        sellingReport: payload,
        loading: false,
      };
    case DELETE_SELLING_REPORT:
      return {
        ...state,
        sellingReport: [],
        loading: false,
      };
    case ERROR_SELLING_REPORT:
      return {
        ...state,
        sellingReport: [],
        loading: false,
        errors: payload,
      };
    default:
      return state;
  }
}
