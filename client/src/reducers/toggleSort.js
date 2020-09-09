import { TOGGLE_SORT } from '../actions/types';

const initialState = false;

export default function (state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case TOGGLE_SORT:
      return !state;
    default:
      return state;
  }
}
