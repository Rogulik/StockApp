import {
  CREATE_DISHES,
  GET_DISHES,
  GET_DISHES_BY_RESTAURANT,
  DELETE_DISH,
  UPDATE_DISH,
  ERROR_DISHES,
  GET_DISH,
} from '../actions/types';

const intitialState = {
  dish: {},
  dishes: [],
  loading: true,
  errors: {},
};

export default function (state = intitialState, action) {
  const { type, payload } = action;

  switch (type) {
    case GET_DISHES:
    case GET_DISHES_BY_RESTAURANT:
    case CREATE_DISHES:
      return {
        ...state,
        dishes: payload,
        loading: false,
      };
    case GET_DISH:
      return {
        ...state,
        dish: payload,
        loading: false,
      };
    case DELETE_DISH:
      return {
        ...state,
        dishes: state.dishes.filter((dish) => dish.id_dish !== payload),
        loading: false,
      };
    case UPDATE_DISH:
      return {
        ...state,
        dishes: payload,
        loading: false,
      };
    case ERROR_DISHES:
      return {
        ...state,
        dish: {},
        dishes: [],
        loading: false,
        errors: payload,
      };
    default:
      return state;
  }
}
