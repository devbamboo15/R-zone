import * as API from 'src/api';
import get from 'lodash/get';
import filter from 'lodash/filter';
import Types from '../types/goal';

export const searchGoalCodes = (searchText: string) => async (
  dispatch: CustomDispatch
) => {
  try {
    dispatch({ type: Types.GOALSEARCH_BOOK_REQUEST });
    const res = await API.searchGoalCode(searchText);
    const goals = get(res, 'data') || [];
    const included = get(res, 'included') || [];
    const programs = filter(included, { type: 'program' }) || [];
    const program = programs[0] || {};
    const groups = filter(included, { type: 'group' }) || [];
    dispatch({
      type: Types.GOALSEARCH_BOOK_SUCCESS,
      payload: { goals, program, groups },
    });
  } catch (error) {
    dispatch({ type: Types.GOALSEARCH_BOOK_ERROR, payload: error });
  }
};
export const resetSearchGoalCodes = () => async (dispatch: CustomDispatch) => {
  dispatch({ type: Types.GOALSEARCH_BOOK_RESET });
};

export const joinGoal = (
  id: string | string[],
  readerId?: string,
  cb?: any
) => async (dispatch: CustomDispatch) => {
  try {
    dispatch({ type: Types.GOALJOIN_BOOK_REQUEST });
    const res = await API.goalJoin(id, readerId);
    dispatch({ type: Types.GOALJOIN_BOOK_SUCCESS, payload: res.items });
    if (cb) cb();
  } catch (error) {
    dispatch({ type: Types.GOALJOIN_BOOK_ERROR, payload: error });
  }
};

export const leaveGoal = (searchText: string) => async (
  dispatch: CustomDispatch
) => {
  try {
    dispatch({ type: Types.GOALLEAVE_BOOK_REQUEST });
    const res = await API.goalLeave(searchText);
    dispatch({ type: Types.GOALLEAVE_BOOK_SUCCESS, payload: res.items });
  } catch (error) {
    dispatch({ type: Types.GOALLEAVE_BOOK_ERROR, payload: error });
  }
};

export const getProgress = () => async (dispatch: CustomDispatch) => {
  try {
    dispatch({ type: Types.PROGRESS_REQUEST });
    const res = await API.getProgress();
    dispatch({ type: Types.PROGRESS_SUCCESS, payload: res.data });
  } catch (error) {
    dispatch({ type: Types.PROGRESS_ERROR, payload: error });
  }
};
