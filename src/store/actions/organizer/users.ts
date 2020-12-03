import idx from 'idx';
import * as Api from 'src/api';
import { ICreateAuthUserData } from 'src/api/users';
import toast from 'src/helpers/Toast';
import groupBy from 'lodash/groupBy';
import { IReduxState } from '../../reducers';
import Types from '../../types/organizer/users';
import { fetchMeData } from '../auth';

export const getAllAuthorizedUsers = () => async (
  dispatch: CustomDispatch,
  getState: () => IReduxState
) => {
  const organizationId = idx(
    getState(),
    x => x.auth.profile.data.relationships.organization.data.id
  );
  if (organizationId) {
    try {
      dispatch({ type: Types.GET_AUTHORIZED_USER_REQUEST });
      const res = await Api.getAllAuthorizedUsers(organizationId);
      dispatch({
        type: Types.GET_AUTHORIZED_USER_SUCCESS,
        payload: idx(res, x => x.data),
      });
    } catch (error) {
      dispatch({
        type: Types.GET_AUTHORIZED_USER_ERROR,
        payload: error.message,
      });
    }
  } else {
    toast.error('organizationId not found');
  }
};

export const getAuthorizedUser = (id: string) => async (
  dispatch: CustomDispatch,
  getState: () => IReduxState
) => {
  const organizationId = idx(
    getState(),
    x => x.auth.profile.data.relationships.organization.data.id
  );
  try {
    dispatch({ type: Types.GET_AUTHORIZED_USER_DETAIL_REQUEST });
    const res = await Api.getAuthorizedUser(organizationId, id);

    const included = idx(res, x => x.included) || [];
    const access = groupBy(included, 'id');

    dispatch({
      type: Types.SET_AUTHORIZED_USER_ACCESS,
      payload: { access },
    });

    dispatch({
      type: Types.GET_AUTHORIZED_USER_DETAIL_SUCCESS,
      payload: idx(res, x => x.data),
    });
  } catch (error) {
    dispatch({
      type: Types.GET_AUTHORIZED_USER_DETAIL_ERROR,
      payload: error.message,
    });
  }
};

export const deleteAuthorizedUser = (id: string) => async (
  dispatch: CustomDispatch,
  getState: () => IReduxState
) => {
  const organizationId = idx(
    getState(),
    x => x.auth.profile.data.relationships.organization.data.id
  );
  if (organizationId) {
    try {
      dispatch({
        type: Types.DELETE_AUTHORIZED_USER_REQUEST,
        payload: { id },
      });
      await Api.deleteAuthorizedUser(organizationId, id);
      dispatch({
        type: Types.DELETE_AUTHORIZED_USER_SUCCESS,
        payload: { id },
      });
      dispatch(fetchMeData());
      toast.success('User deleted successfully!');
      setTimeout(() => {
        // reseting data after few seconds
        dispatch({
          type: Types.DELETE_AUTHORIZED_USER_RESET_DATA,
          payload: { id },
        });
      }, 1000);
    } catch (error) {
      dispatch({
        type: Types.DELETE_AUTHORIZED_USER_ERROR,
        payload: { id, error: error.message },
      });
    }
  } else {
    toast.error('organizationId not found');
  }
};

export const deleteAllAuthorizedUsers = (data: any, cb?: any) => async (
  dispatch: CustomDispatch,
  getState: () => IReduxState
) => {
  const organizationId = idx(
    getState(),
    x => x.auth.profile.data.relationships.organization.data.id
  );
  if (organizationId) {
    try {
      dispatch({
        type: Types.DELETE_ALL_AUTHORIZED_USERS_REQUEST,
      });
      await Api.deleteAllAuthorizedUsers(organizationId, data);
      dispatch({
        type: Types.DELETE_ALL_AUTHORIZED_USERS_SUCCESS,
        payload: { data },
      });
      toast.success('All users deleted successfully!');
      dispatch(fetchMeData());
      if (cb) cb();
    } catch (error) {
      dispatch({
        type: Types.DELETE_ALL_AUTHORIZED_USERS_ERROR,
        payload: { error: error.message },
      });
    }
  } else {
    toast.error('organizationId not found');
  }
};

export const addAuthUser = (data: ICreateAuthUserData) => async (
  dispatch: CustomDispatch,
  getState: () => IReduxState
) => {
  try {
    const organizationId = idx(
      getState(),
      x => x.auth.profile.data.relationships.organization.data.id
    );
    dispatch({ type: Types.ADD_AUTHORIZED_USER_REQUEST });
    await Api.addAuthorizedUser(organizationId, data);
    dispatch({
      type: Types.ADD_AUTHORIZED_USER_SUCCESS,
    });
    dispatch(getAllAuthorizedUsers());
    toast.success('User Added Successfully');
    dispatch(fetchMeData());
    setTimeout(() => {
      // reseting data after few seconds, as we are navigating to programs screen, and user might create new program again
      dispatch({
        type: Types.ADD_AUTHORIZED_USER_RESET,
      });
    }, 4000);
  } catch (error) {
    dispatch({
      type: Types.ADD_AUTHORIZED_USER_ERROR,
      payload: error.message,
    });
  }
};

export const updateAuthUser = (id: string, data: ICreateAuthUserData) => async (
  dispatch: CustomDispatch,
  getState: () => IReduxState
) => {
  try {
    const organizationId = idx(
      getState(),
      x => x.auth.profile.data.relationships.organization.data.id
    );
    dispatch({ type: Types.UPDATE_AUTHORIZED_USER_REQUEST, payload: { id } });
    await Api.updateAuthorizedUser(organizationId, id, data);
    await dispatch(fetchMeData());
    dispatch({
      type: Types.UPDATE_AUTHORIZED_USER_SUCCESS,
      payload: { id, data },
    });
    toast.success('User Permissions Updated Successfully');
  } catch (error) {
    dispatch({
      type: Types.UPDATE_AUTHORIZED_USER_ERROR,
      payload: { id, error: error.message },
    });
  }
};
