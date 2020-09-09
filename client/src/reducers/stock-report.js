import {
    CREATE_STOCK_REPORT,
    GET_STOCK_REPORT_BY_DATE,
    DELETE_STOCK_REPORT,
    UPDATE_ITEM_FROM_SELLING_REPORT,
    ERROR_SELLING_REPORT,
  } from '../actions/types';
  
  const intitialState = {
    stockReport: [],
    loading: true,
    errors: {},
  };
  
  export default function (state = intitialState, action) {
    const { type, payload } = action;
  
    switch (type) {
      case GET_STOCK_REPORT_BY_DATE:
      case UPDATE_ITEM_FROM_SELLING_REPORT:
      case CREATE_STOCK_REPORT:
        return {
          ...state,
          stockReport: payload.map(i => ({
            ...i,
            whole: Math.floor(i.amount_in_stock / i.amount_in_container),
            loose: i.amount_in_stock % i.amount_in_container,
          })),
          loading: false,
        };
      case DELETE_STOCK_REPORT:
        return {
          ...state,
          stockReport: [],
          loading: false,
        };
      case ERROR_SELLING_REPORT:
        return {
          ...state,
          stockReport: [],
          loading: false,
          errors: payload,
        };
      default:
        return state;
    }
  }
  