import { TOGGLE_SORT } from './types';

export const setToggleSort = () => (dispatch) => {
  dispatch({
    type: TOGGLE_SORT,
  });
};
