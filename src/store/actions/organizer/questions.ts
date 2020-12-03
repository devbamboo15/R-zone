import * as API from 'src/api';
import Types from '../../types/organizer/questions';

export const getSignUpQuestions = () => async (dispatch: CustomDispatch) => {
  try {
    dispatch({ type: Types.SIGNUP_QUESTIONS });
    const res = await API.getSignUpQuestions();
    dispatch({ type: Types.SIGNUP_QUESTIONS_SUCCESS, payload: res.data });
  } catch (error) {
    dispatch({ type: Types.SIGNUP_QUESTIONS_ERROR, payload: error });
  }
};

export const getUserQuestions = (
  userId: number | string,
  cb?: Function
) => async (dispatch: CustomDispatch) => {
  try {
    dispatch({ type: Types.USER_QUESTIONS });
    const res = await API.getUserQuestions(userId);
    dispatch({
      type: Types.USER_QUESTIONS_SUCCESS,
      payload: { data: res.data, userId },
    });
    if (cb) cb(res.data);
  } catch (error) {
    dispatch({ type: Types.USER_QUESTIONS_ERROR, payload: error });
    if (cb) cb(null);
  }
};

export const getMultipleUserQuestions = (
  userIds: number[] | string[],
  skipStore?: boolean,
  cb?: Function
) => async (dispatch: CustomDispatch) => {
  try {
    const dataById = {};
    for (const userId of userIds) {
      if (!skipStore) dispatch({ type: Types.USER_QUESTIONS });
      // eslint-disable-next-line no-await-in-loop
      const res = await API.getUserQuestions(userId);
      dataById[userId] = res.data;
      if (!skipStore) {
        dispatch({
          type: Types.USER_QUESTIONS_SUCCESS,
          payload: { data: res.data, userId },
        });
      }
    }
    if (cb) cb(dataById);
  } catch (error) {
    if (!skipStore) {
      dispatch({ type: Types.USER_QUESTIONS_ERROR, payload: error });
    }
    if (cb) cb(null);
  }
};
