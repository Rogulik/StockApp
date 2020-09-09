import { GET_CURRENCIES } from '../actions/types';

const intitialState = {
  currencies: [],
  loading: true,
};

export default function (state = intitialState, action) {
  const { type, payload } = action;
  switch (type) {
    case GET_CURRENCIES:
      return {
        currencies: Object.keys(payload),
        loading: false,
      };
    default:
      return state;
  }
}
