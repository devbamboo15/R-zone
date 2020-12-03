import * as API from 'src/api';
import idx from 'idx';
import toast from 'src/helpers/Toast';
import get from 'lodash/get';
import Types from '../types/share';
import { IReduxState } from '../reducers';

export const getShares = () => async (dispatch: CustomDispatch) => {
  try {
    dispatch({ type: Types.SHARE });
    const res = await API.getShares();

    if (res.data) {
      dispatch({ type: Types.SHARE_SUCCESS, payload: res.data });
    } else {
      dispatch({ type: Types.SHARE_SUCCESS, payload: null });
    }
  } catch (error) {
    dispatch({ type: Types.SHARE_ERROR, payload: error });
  }
};

export const getUserLeaderboard = (
  programIds: any,
  groupIds: any,
  badgeType: number,
  metric?: any
) => async (dispatch: CustomDispatch, getState: () => IReduxState) => {
  try {
    dispatch({ type: Types.GET_USER_LEADERBOARD });
    const organizationId = idx(
      getState(),
      x => x.auth.profile.data.relationships.organization.data.id
    );

    const res = await API.getUserLeaderboard(
      programIds,
      badgeType,
      organizationId,
      groupIds,
      metric
    );
    if (res.data) {
      dispatch({
        type: Types.GET_USER_LEADERBOARD_SUCCESS,
        payload: get(res, 'data.records') || [],
      });
    } else {
      dispatch({ type: Types.GET_USER_LEADERBOARD_SUCCESS, payload: [] });
    }
  } catch (error) {
    dispatch({ type: Types.GET_USER_LEADERBOARD_ERROR, payload: error });
  }
};
export const resetUserLeaderboard = () => (dispatch: CustomDispatch) => {
  dispatch({ type: Types.GET_USER_LEADERBOARD_SUCCESS, payload: [] });
};

export const updateShare = (data: API.IShareItem) => async (
  dispatch: CustomDispatch
) => {
  try {
    dispatch({ type: Types.SHARE });
    const res = await API.updateShare(data);
    dispatch({ type: Types.UPDATE_SHARE_SUCCESS, payload: res.data });
    toast.success('Updated Badges Successfully');
  } catch (error) {
    dispatch({ type: Types.SHARE_ERROR, payload: error });
  }
};

export const chooseProgram = (programId: string) => (
  dispatch: CustomDispatch
) => {
  dispatch({ type: Types.CLICK_SHARE, payload: programId });
};

export const deleteShare = () => async (dispatch: CustomDispatch) => {
  try {
    dispatch({ type: Types.SHARE });
    await API.deleteShare();
    dispatch({ type: Types.DELETE_SHARE_SUCCESS });
  } catch (error) {
    dispatch({ type: Types.SHARE_ERROR, payload: error });
  }
};
