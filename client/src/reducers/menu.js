import {
  GET_MENUS,
  GET_MENU,
  CREATE_MENUS,
  MENUS_ERROR,
  CLEAR_MENUS,
  DELETE_MENU,
} from '../actions/types';

const initialState = {
  menu: null,
  menus: [],
  loading: true,
  error: {},
};

export default function (state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case GET_MENUS:
    case CREATE_MENUS:
      return {
        ...state,
        menus: payload,
        loading: false,
      };
    case GET_MENU:
      return {
        ...state,
        menu: payload,
        loading: false,
      };
    case MENUS_ERROR:
      return {
        ...state,
        error: payload,
        loading: false,
      };
    case CLEAR_MENUS:
      return {
        ...state,
        menu: {},
        menus: [],
        loading: false,
      };
    case DELETE_MENU:
      return {
        ...state,
        menus: state.menus.filter((menu) => menu.id !== payload),
        loading: false,
      };
    default:
      return state;
  }
}
