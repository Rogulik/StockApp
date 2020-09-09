import {
    CREATE_PRODUCTS,
    GET_PRODUCTS,
    DELETE_PRODUCT,
    UPDATE_PRODUCT,
    ERROR_PRODUCT,
    GET_PRODUCT,
  } from '../actions/types';
  
  const intitialState = {
    product: {},
    products: [],
    loading: true,
    errors: {},
  };
  
  export default function (state = intitialState, action) {
    const { type, payload } = action;
  
    switch (type) {
      case GET_PRODUCTS:
      case CREATE_PRODUCTS:
        return {
          ...state,
          products: payload,
          loading: false,
        };
      case GET_PRODUCT:
        return {
          ...state,
          product: payload,
          loading: false,
        };
      case DELETE_PRODUCT:
        return {
          ...state,
          products: state.products.filter((product) => product.id_product !== payload),
          loading: false,
        };
      case UPDATE_PRODUCT:
        return {
          ...state,
          products: payload,
          loading: false,
        };
      case ERROR_PRODUCT:
        return {
          ...state,
          product: {},
          products: [],
          loading: false,
          errors: payload,
        };
      default:
        return state;
    }
  }
  