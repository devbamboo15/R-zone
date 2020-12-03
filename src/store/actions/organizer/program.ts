import idx from 'idx';
import * as Api from 'src/api';
import {
  ICreateCombinedProgramData,
  IUpdateProgramData,
  CreateAdvanceProgramData,
  IAdvanceProgramData,
  ISendEmailToParticipantsData,
  IProgramFilterType,
} from 'src/api/program';
import groupBy from 'lodash/groupBy';
import toast from 'src/helpers/Toast';
import { getAllProgramGroups } from 'src/store/actions/organizer/group';
import get from 'lodash/get';
import { IReduxState } from '../../reducers';
import Types from '../../types/organizer/program';
import GroupTypes from '../../types/organizer/group';

// Get New Program Code
export const getNewProgramCode = () => async (
  dispatch: CustomDispatch,
  getState: () => IReduxState
) => {
  try {
    const organizationId = idx(
      getState(),
      x => x.auth.profile.data.relationships.organization.data.id
    );
    dispatch({ type: Types.GET_PROGRAM_CODE_REQUEST });
    const resp = await Api.getNewProgramCode(organizationId);
    const code = get(resp, 'data.code') || '';
    dispatch({
      type: Types.GET_PROGRAM_CODE_SUCCESS,
      payload: code,
    });
  } catch (error) {
    dispatch({
      type: Types.GET_PROGRAM_CODE_ERROR,
      payload: error.message,
    });
  }
};

export const createProgram = (data: ICreateCombinedProgramData) => async (
  dispatch: CustomDispatch,
  getState: () => IReduxState
) => {
  try {
    const organizationId = idx(
      getState(),
      x => x.auth.profile.data.relationships.organization.data.id
    );
    dispatch({ type: Types.CREATE_PROGRAM_REQUEST });
    await Api.createCombinedProgram(organizationId, data);
    dispatch({
      type: Types.CREATE_PROGRAM_SUCCESS,
    });
    toast.success('Program Created Successfully');
    dispatch({
      type: Types.GET_PROGRAMS_RESET_DATA,
    });
    setTimeout(() => {
      // reseting data after few seconds, as we are navigating to programs screen, and user might create new program again
      dispatch({
        type: Types.CREATE_PROGRAM_RESET_DATA,
      });
    }, 4000);
  } catch (error) {
    dispatch({
      type: Types.CREATE_PROGRAM_ERROR,
      payload: error.message,
    });
  }
};

export const getAllProgramsWithoutPagination = () => async (
  dispatch: CustomDispatch,
  getState: () => IReduxState
) => {
  try {
    const organizationId = idx(
      getState(),
      x => x.auth.profile.data.relationships.organization.data.id
    );

    dispatch({ type: Types.GET_ALL_PROGRAMS_REQUEST });
    const res = await Api.getAllProgramsWithoutPagination(organizationId);
    const programs = res.data || [];
    dispatch({
      type: Types.GET_ALL_PROGRAMS_SUCCESS,
      payload: programs,
    });
  } catch (error) {
    dispatch({
      type: Types.GET_ALL_PROGRAMS_ERROR,
      payload: error.message,
    });
  }
};

export const getAllProgramsForAuthUser = (
  filter?: IProgramFilterType
) => async (dispatch: CustomDispatch, getState: () => IReduxState) => {
  const organizationId = idx(
    getState(),
    x => x.auth.profile.data.relationships.organization.data.id
  );
  if (organizationId) {
    try {
      dispatch({ type: Types.GET_PROGRAMS_REQUEST });
      const res = await Api.getAllProgramsForAuthUser(organizationId, filter);
      if (res && res.data) {
        res.data = res.data.map(p => ({
          ...p,
          id: p.id.toString(),
        }));
      }
      dispatch({
        type: Types.GET_PROGRAMS_SUCCESS,
        payload: {
          program: res,
        },
      });
      const included = idx(res, x => x.included) || [];
      const groups = groupBy(included, 'attributes.program_id');
      dispatch({
        type: GroupTypes.SET_MULTIPLE_PROGRAM_GROUPS,
        payload: { groups },
      });
    } catch (error) {
      dispatch({
        type: Types.GET_PROGRAMS_ERROR,
        payload: error.message,
      });
    }
  } else {
    toast.error('organizationId not found');
  }
};

export const getAllPrograms = (
  filter?: IProgramFilterType,
  loadMore?: boolean,
  cb?: any
) => async (dispatch: CustomDispatch, getState: () => IReduxState) => {
  const organizationId = idx(
    getState(),
    x => x.auth.profile.data.relationships.organization.data.id
  );
  if (organizationId) {
    try {
      dispatch({ type: Types.GET_PROGRAMS_REQUEST, payload: { loadMore } });
      const res = await Api.getAllPrograms(organizationId, filter);
      if (res && res.data) {
        res.data = res.data.map(p => ({
          ...p,
          id: p.id.toString(),
        }));
      }
      const currentPage = get(filter, 'page', 0) + 1;
      const totalPage = get(res, 'meta.pagination.total_pages', 0);
      const morePage =
        currentPage >= 1 &&
        currentPage < totalPage &&
        (get(res, 'data') || []).length === 10;
      dispatch({
        type: Types.GET_PROGRAMS_SUCCESS,
        payload: {
          program: res,
          loadMore,
          morePage,
          total: get(res, 'meta.pagination.total', 0),
        },
      });
      const included = idx(res, x => x.included) || [];
      const groups = groupBy(included, 'attributes.program_id');
      dispatch({
        type: GroupTypes.SET_MULTIPLE_PROGRAM_GROUPS,
        payload: { groups },
      });
      if (cb) cb(morePage);
    } catch (error) {
      dispatch({
        type: Types.GET_PROGRAMS_ERROR,
        payload: error.message,
      });
    }
  } else {
    toast.error('organizationId not found');
  }
};

export const searchPrograms = (searchText: string) => async (
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
        type: Types.SEARCH_PROGRAMS_REQUEST,
        payload: { text: searchText },
      });
      const res = await Api.searchProgram(organizationId, searchText);
      dispatch({
        type: Types.SEARCH_PROGRAMS_SUCCESS,
        payload: {
          program: res,
        },
      });
    } catch (error) {
      dispatch({
        type: Types.SEARCH_PROGRAMS_ERROR,
        payload: error.message,
      });
    }
  } else {
    toast.error('organizationId not found');
  }
};

export const resetSearchPrograms = () => async (dispatch: CustomDispatch) => {
  dispatch({ type: Types.SEARCH_PROGRAMS_RESET_DATA });
};

export const updateProgram = (
  id: string,
  data: IUpdateProgramData,
  cb?: Function
) => async (dispatch: CustomDispatch, getState: () => IReduxState) => {
  try {
    const organizationId = idx(
      getState(),
      x => x.auth.profile.data.relationships.organization.data.id
    );
    dispatch({ type: Types.UPDATE_PROGRAM_REQUEST, payload: { id } });
    await Api.updateProgram(organizationId, id, data);
    dispatch({
      type: Types.UPDATE_PROGRAM_SUCCESS,
      payload: { id, data },
    });
    toast.success('Program Updated Successfully');
    if (cb) cb();
  } catch (error) {
    dispatch({
      type: Types.UPDATE_PROGRAM_ERROR,
      payload: { id, error: error.message },
    });
  }
};

export const deleteProgram = (id: string) => async (
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
        type: Types.DELETE_PROGRAM_REQUEST,
        payload: { id },
      });
      await Api.deleteProgram(organizationId, id);
      dispatch({
        type: Types.DELETE_PROGRAM_SUCCESS,
        payload: { id },
      });
      toast.success('Program deleted successfully!');
      setTimeout(() => {
        // reseting data after few seconds
        dispatch({
          type: Types.DELETE_PROGRAM_RESET_DATA,
          payload: { id },
        });
      }, 1000);
    } catch (error) {
      dispatch({
        type: Types.DELETE_PROGRAM_ERROR,
        payload: { id, error: error.message },
      });
    }
  } else {
    toast.error('organizationId not found');
  }
};

export const createAdvancedProgram = (
  data: CreateAdvanceProgramData,
  cb?: Function
) => async (dispatch: CustomDispatch, getState: () => IReduxState) => {
  try {
    const organizationId = idx(
      getState(),
      x => x.auth.profile.data.relationships.organization.data.id
    );
    dispatch({ type: Types.CREATE_ADVANCED_PROGRAM_REQUEST });
    await Api.createAdvanceProgram(organizationId, data);
    dispatch({
      type: Types.CREATE_ADVANCED_PROGRAM_SUCCESS,
    });
    toast.success('Program Created Successfully');
    if (cb) cb();
    setTimeout(() => {
      // reseting data after few seconds, as we are navigating to programs screen, and user might create new program again
      dispatch({
        type: Types.CREATE_ADVANCED_PROGRAM_RESET_DATA,
      });
    }, 4000);
  } catch (error) {
    dispatch({
      type: Types.CREATE_ADVANCED_PROGRAM_ERROR,
      payload: error.message,
    });
  }
};

export const updateAdvancedProgram = (
  id: string,
  data: IAdvanceProgramData,
  cb?: Function
) => async (dispatch: CustomDispatch, getState: () => IReduxState) => {
  try {
    const organizationId = idx(
      getState(),
      x => x.auth.profile.data.relationships.organization.data.id
    );
    dispatch({ type: Types.UPDATE_ADVANCED_PROGRAM_REQUEST, payload: { id } });
    await Api.updateAdvanceProgram(organizationId, id, data);
    dispatch({
      type: Types.UPDATE_ADVANCED_PROGRAM_SUCCESS,
      payload: { id, data },
    });
    dispatch(getAllProgramGroups(id));
    toast.success('Program Updated Successfully');
    if (cb) cb();
  } catch (error) {
    dispatch({
      type: Types.UPDATE_ADVANCED_PROGRAM_ERROR,
      payload: { id, error: error.message },
    });
  }
};

export const sendEmailToParticipants = (
  data: ISendEmailToParticipantsData
) => async (dispatch: CustomDispatch) => {
  try {
    dispatch({ type: Types.SEND_EMAIL_TO_PARTICIPANTS_REQUEST });
    const res = await Api.sendEmailToParticipants(data);
    dispatch({ type: Types.SEND_EMAIL_TO_PARTICIPANTS_SUCCESS, payload: res });
    toast.success('Send email successfully!');
  } catch (error) {
    dispatch({ type: Types.SEND_EMAIL_TO_PARTICIPANTS_ERROR, payload: error });
  }
};

// Clone Program
export const cloneProgram = (programId: string) => async (
  dispatch: CustomDispatch,
  getState: () => IReduxState
) => {
  try {
    const organizationId = idx(
      getState(),
      x => x.auth.profile.data.relationships.organization.data.id
    );
    dispatch({ type: Types.CLONE_PROGRAM_REQUEST });
    const res = await Api.cloneProgram(organizationId, programId);
    dispatch({
      type: Types.CLONE_PROGRAM_SUCCESS,
      data: res,
    });
    toast.success('Program Cloned Successfully');
  } catch (error) {
    dispatch({
      type: Types.CLONE_PROGRAM_ERROR,
      payload: error.message,
    });
  }
};
