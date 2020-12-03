import idx from 'idx';
import * as Api from 'src/api';
import toast from 'src/helpers/Toast';
import { IAwardData } from 'src/api/program';
import { IReduxState } from '../../reducers';
import Types from '../../types/organizer/awards';

export const getProgramAwards = (programId: string) => async (
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
        type: Types.GET_PROGRAM_AWARDS_REQUEST,
        payload: { programId },
      });
      const res = await Api.getProgramAwards(organizationId, programId);
      dispatch({
        type: Types.GET_PROGRAM_AWARDS_SUCCESS,
        payload: { awards: res },
      });
    } catch (error) {
      dispatch({
        type: Types.GET_PROGRAM_AWARDS_ERROR,
        payload: { error: error.message },
      });
    }
  } else {
    toast.error('organizationId not found');
  }
};

export const getGroupAwards = (programId: string, groupId: string[]) => async (
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
        type: Types.GET_GROUP_AWARDS_REQUEST,
        payload: { programId },
      });
      const res = await Api.getGroupAwards(organizationId, programId, groupId);
      dispatch({
        type: Types.GET_GROUP_AWARDS_SUCCESS,
        payload: { awards: res },
      });
    } catch (error) {
      dispatch({
        type: Types.GET_GROUP_AWARDS_ERROR,
        payload: { error: error.message },
      });
    }
  } else {
    toast.error('organizationId not found');
  }
};

export const createAwards = (data: IAwardData) => async (
  dispatch: CustomDispatch,
  getState: () => IReduxState
) => {
  try {
    const userId = idx(getState(), x => x.auth.profile.data.id);
    dispatch({
      type: Types.CREATE_AWARDS_REQUEST,
    });
    await Api.createAwards(userId, data);
    dispatch({
      type: Types.CREATE_AWARDS_SUCCESS,
      payload: data,
    });
    setTimeout(() => {
      dispatch({
        type: Types.CREATE_AWARDS_RESET_DATA,
      });
    }, 4000);
    toast.success('Awards Created Successfully');
  } catch (error) {
    dispatch({
      type: Types.CREATE_AWARDS_ERROR,
      payload: { error: error.message },
    });
  }
};

export const updateAwards = (
  awardsId: string,
  data: IAwardData,
  cb?: any
) => async (dispatch: CustomDispatch, getState: () => IReduxState) => {
  try {
    const userId = idx(getState(), x => x.auth.profile.data.id);
    dispatch({
      type: Types.UPDATE_AWARDS_REQUEST,
    });
    const award = await Api.updateAwards(userId, awardsId, data);
    dispatch({
      type: Types.UPDATE_AWARDS_SUCCESS,
      payload: {
        data: award,
        id: awardsId,
      },
    });
    setTimeout(() => {
      dispatch({
        type: Types.UPDATE_AWARDS_RESET_DATA,
      });
    }, 4000);
    toast.success('Awards Updated Successfully');
    if (cb) cb();
  } catch (error) {
    dispatch({
      type: Types.UPDATE_AWARDS_ERROR,
      payload: { error: error.message },
    });
  }
};

export const getAwardsPreview = (awardsId: string) => async (
  dispatch: CustomDispatch,
  getState: () => IReduxState
) => {
  try {
    const userId = idx(getState(), x => x.auth.profile.data.id);
    dispatch({
      type: Types.GET_AWARDS_PREVEW_REQUEST,
    });
    const data = await Api.getAwardsPreview(userId, awardsId);
    dispatch({
      type: Types.GET_AWARDS_PREVEW_SUCCESS,
      payload: {
        data: data.data,
      },
    });
  } catch (error) {
    dispatch({
      type: Types.GET_AWARDS_PREVEW_ERROR,
      payload: { error: error.message },
    });
  }
};

export const restoreDefaultAwards = (awardsId: string) => async (
  dispatch: CustomDispatch,
  getState: () => IReduxState
) => {
  try {
    const userId = idx(getState(), x => x.auth.profile.data.id);
    dispatch({
      type: Types.RESTORE_DEFAULT_AWARDS_REQUEST,
    });
    const data = await Api.restoreDefaultAwards(userId, awardsId);

    dispatch({
      type: Types.RESTORE_DEFAULT_AWARDS_SUCCESS,
      payload: {
        data,
        id: awardsId,
      },
    });
    setTimeout(() => {
      dispatch({
        type: Types.RESTORE_DEFAULT_AWARDS_RESET_DATA,
      });
    }, 4000);
    toast.success('Awards Restored Successfully');
  } catch (error) {
    dispatch({
      type: Types.RESTORE_DEFAULT_AWARDS_ERROR,
      payload: { error: error.message },
    });
  }
};

export const updateAwardsAvatar = (
  programId: string,
  groupId: string,
  awardId: string,
  data: any
) => async (dispatch: CustomDispatch, getState: () => IReduxState) => {
  try {
    const organizationId = idx(
      getState(),
      x => x.auth.profile.data.relationships.organization.data.id
    );
    dispatch({
      type: Types.UPDATE_AVATAR_AWARDS_REQUEST,
    });
    const res = await Api.updateAwardsAvatar(
      organizationId,
      programId,
      groupId,
      awardId,
      data
    );

    dispatch({
      type: Types.UPDATE_AVATAR_AWARDS_SUCCESS,
      payload: {
        data: res,
        id: awardId,
      },
    });
    // toast.success('Updated avatar Award Successfully');
  } catch (error) {
    dispatch({
      type: Types.UPDATE_AVATAR_AWARDS_ERROR,
      payload: { error: error.message },
    });
  }
};

export const deleteAwardsAvatar = (
  programId: string,
  groupId: string,
  awardId: string
) => async (dispatch: CustomDispatch, getState: () => IReduxState) => {
  try {
    const organizationId = idx(
      getState(),
      x => x.auth.profile.data.relationships.organization.data.id
    );
    dispatch({
      type: Types.DELETE_AVATAR_AWARDS_REQUEST,
    });
    const res = await Api.deleteAwardsAvatar(
      organizationId,
      programId,
      groupId,
      awardId
    );

    dispatch({
      type: Types.DELETE_AVATAR_AWARDS_SUCCESS,
      payload: {
        data: res,
        id: awardId,
      },
    });
    toast.success('Deleted avatar Award Successfully');
  } catch (error) {
    dispatch({
      type: Types.DELETE_AVATAR_AWARDS_ERROR,
      payload: { error: error.message },
    });
  }
};

export const getProgramLeaderboard = (
  programId: string,
  filter?: any
) => async (dispatch: CustomDispatch, getState: () => IReduxState) => {
  const organizationId = idx(
    getState(),
    x => x.auth.profile.data.relationships.organization.data.id
  );
  if (organizationId) {
    try {
      dispatch({
        type: Types.GET_PROGRAM_LEADERBOARD_REQUEST,
        payload: { programId },
      });
      const res = await Api.getProgramLeaderboard(
        organizationId,
        programId,
        filter
      );
      dispatch({
        type: Types.GET_PROGRAM_LEADERBOARD_SUCCESS,
        payload: { leaderboard: res },
      });
    } catch (error) {
      dispatch({
        type: Types.GET_PROGRAM_LEADERBOARD_ERROR,
        payload: { error: error.message },
      });
    }
  } else {
    toast.error('organizationId not found');
  }
};

export const getGroupLeaderboard = (
  programId: string,
  groupId: string,
  filter?: any
) => async (dispatch: CustomDispatch, getState: () => IReduxState) => {
  const organizationId = idx(
    getState(),
    x => x.auth.profile.data.relationships.organization.data.id
  );
  if (organizationId) {
    try {
      dispatch({
        type: Types.GET_GROUP_LEADERBOARD_REQUEST,
        payload: { programId },
      });
      const res = await Api.getGroupLeaderboard(
        organizationId,
        programId,
        groupId,
        filter
      );
      dispatch({
        type: Types.GET_GROUP_LEADERBOARD_SUCCESS,
        payload: { leaderboard: res },
      });
    } catch (error) {
      dispatch({
        type: Types.GET_GROUP_LEADERBOARD_ERROR,
        payload: { error: error.message },
      });
    }
  } else {
    toast.error('organizationId not found');
  }
};
