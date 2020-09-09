import {
  CREATE_CONNECTION_RESTAURANT_MENU,
  DELETE_CONNECTION_RESTAURANT_MENU,
  CLEAR_CONNECTION_RESTAURANT_MENU,
  GET_CONNECTION_RESTAURANT_MENU,
  ERROR_CONNECTION_RESTAURANT_MENU,
} from '../actions/types';

const initialState = {
  restaurant: null,
  menus: [],
  loading: true,
  error: {},
};

export default function (state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case CREATE_CONNECTION_RESTAURANT_MENU:
    case GET_CONNECTION_RESTAURANT_MENU:
      return {
        ...state,
        restaurant: payload.restaurant,
        menus: payload.menus,
        loading: false,
      };
    case DELETE_CONNECTION_RESTAURANT_MENU:
      return {
        ...state,
        loading: false,
        menus: state.menus.filter((i) => i.menu !== payload),
      };
    case CLEAR_CONNECTION_RESTAURANT_MENU:
      return {
        ...state,
        restaurant: null,
        menus: [],
        loading: false,
      };
    case ERROR_CONNECTION_RESTAURANT_MENU:
      return {
        ...state,
        loading: false,
        error: { payload },
      };
    default:
      return state;
  }
}
