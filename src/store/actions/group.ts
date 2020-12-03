import idx from 'idx';
import * as Api from 'src/api';
import toast from 'src/helpers/Toast';
import Types, { IGoal } from '../types/group';
import { IReduxState } from '../reducers';

export const selectCurrentGroup = (group: IGoal) => async (
  dispatch: CustomDispatch
) => {
  dispatch({ type: Types.SELECT_CURRENT_GROUP, payload: group });
};

export const getAllGroups = () => async (
  dispatch: CustomDispatch,
  getState: () => IReduxState
) => {
  try {
    const userId = idx(getState(), x => x.auth.profile.data.id);
    dispatch({ type: Types.GET_GROUPS_REQUEST });
    const res = await Api.getUserGroups(userId);
    dispatch({ type: Types.GET_GROUPS_SUCCESS, payload: res.included });
  } catch (error) {
    dispatch({ type: Types.GET_GROUPS_ERROR, payload: error.message });
  }
};

export const createReadingEntry = (
  userId: string,
  goalId: string,
  data: any,
  cb?: Function,
  isV2?: boolean
) => async (dispatch: CustomDispatch) => {
  try {
    dispatch({ type: Types.CREATE_READING_ENTRY_REQUEST });
    const res = await Api.createReadingEntry(userId, goalId, data, isV2);
    dispatch({
      type: Types.CREATE_READING_ENTRY_SUCCESS,
      payload: res.included,
    });
    toast.success('Added entry Successfully');
    // TODO: Only fetch current goal updated data
    if (cb) {
      cb();
    } else {
      dispatch(getAllGroups());
    }
  } catch (error) {
    dispatch({
      type: Types.CREATE_READING_ENTRY_ERROR,
      payload: error.message,
    });
  }
};

export const addBulkEntry = (
  programId: string,
  groupId: string,
  data: any[],
  cb?: Function
) => async (dispatch: CustomDispatch, getState: () => IReduxState) => {
  try {
    const organizationId = idx(
      getState(),
      x => x.auth.profile.data.relationships.organization.data.id
    );
    dispatch({ type: Types.BULK_ENTRY_REQUEST });
    await Api.addBulkEntry(organizationId, programId, groupId, data);
    dispatch({
      type: Types.BULK_ENTRY_SUCCESS,
    });
    toast.success('Bulk entry Successfully');
    if (cb) {
      cb();
    }
  } catch (error) {
    dispatch({
      type: Types.BULK_ENTRY_ERROR,
      payload: error.message,
    });
  }
};
