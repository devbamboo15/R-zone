import idx from 'idx';
import * as Api from 'src/api';
import toast from 'src/helpers/Toast';
import { IReduxState } from 'src/store/reducers';
import Types from 'src/store/types/reports';
import omit from 'lodash/omit';
import get from 'lodash/get';

export const getAllFeeds = (filter?: any) => async (
  dispatch: CustomDispatch,
  getState: () => IReduxState
) => {
  const organizationId = idx(
    getState(),
    x => x.auth.profile.data.relationships.organization.data.id
  );
  if (organizationId) {
    try {
      dispatch({ type: Types.GET_FEED_REQUEST });
      const res = await Api.getAllFeeds(
        organizationId,
        omit(filter, ['isMore'])
      );
      if (get(filter, 'isMore')) {
        dispatch({
          type: Types.GET_FEED_MORE_SUCCESS,
          payload: res,
        });
      } else {
        dispatch({
          type: Types.GET_FEED_SUCCESS,
          payload: res,
        });
      }
    } catch (error) {
      dispatch({
        type: Types.GET_FEED_ERROR,
        payload: error.message,
      });
    }
  } else {
    toast.error('organizationId not found');
  }
};

export const getOverviews = (filter?: any) => async (
  dispatch: CustomDispatch,
  getState: () => IReduxState
) => {
  const organizationId = idx(
    getState(),
    x => x.auth.profile.data.relationships.organization.data.id
  );
  if (organizationId) {
    try {
      dispatch({ type: Types.GET_OVERVIEWS_REQUEST });
      const res = await Api.getOverviews(
        organizationId,
        omit(filter, ['isMore'])
      );
      if (get(filter, 'isMore')) {
        dispatch({
          type: Types.GET_OVERVIEWS_MORE_SUCCESS,
          payload: res,
        });
      } else {
        dispatch({
          type: Types.GET_OVERVIEWS_SUCCESS,
          payload: res,
        });
      }
    } catch (error) {
      dispatch({
        type: Types.GET_OVERVIEWS_ERROR,
        payload: error.message,
      });
    }
  } else {
    toast.error('organizationId not found');
  }
};
