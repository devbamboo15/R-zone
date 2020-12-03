import idx from 'idx';
import find from 'lodash/find';
import get from 'lodash/get';
import filter from 'lodash/filter';
import groupBy from 'lodash/groupBy';
import merge from 'lodash/merge';
import * as Api from 'src/api';
import { CombinedGroupData, IGroupsFilterType } from 'src/api/program';
import toast from 'src/helpers/Toast';
import Types from 'src/store/types/organizer/group';
import { getAuthorizedUser } from './users';
import { IReduxState } from '../../reducers';

export const createCombinedGroup = (
  programId: string,
  data: CombinedGroupData
) => async (dispatch: CustomDispatch, getState: () => IReduxState) => {
  try {
    const organizationId = idx(
      getState(),
      x => x.auth.profile.data.relationships.organization.data.id
    );
    dispatch({
      type: Types.CREATE_COMBINED_GROUP_REQUEST,
    });
    await Api.createCombinedGroup(organizationId, programId, data);
    const profileId = idx(getState(), x => x.auth.profile.data.id);
    dispatch(getAuthorizedUser(profileId));

    dispatch({
      type: Types.CREATE_COMBINED_GROUP_SUCCESS,
      payload: data,
    });
    setTimeout(() => {
      // reseting data after few seconds, as we are navigating to groups screen, and user might create new program again
      dispatch({
        type: Types.CREATE_COMBINED_GROUP_RESET_DATA,
      });
    }, 4000);
    toast.success('Group Created Successfully');
  } catch (error) {
    dispatch({
      type: Types.CREATE_COMBINED_GROUP_ERROR,
      payload: { error: error.message },
    });
  }
};

export const getAllProgramGroups = (
  programId: string,
  filterParam?: IGroupsFilterType,
  loadMore?: boolean,
  cb?: any
) => async (dispatch: CustomDispatch, getState: () => IReduxState) => {
  const organizationId = idx(
    getState(),
    x => x.auth.profile.data.relationships.organization.data.id
  );
  if (organizationId) {
    try {
      dispatch({
        type: Types.GET_PROGRAM_GROUPS_REQUEST,
        payload: { programId, loadMore },
      });
      const res = await Api.getProgramGroups(
        organizationId,
        programId,
        filterParam
      );
      const data: any = idx(res, x => x.data) || [];
      const included = idx(res, x => x.included) || [];
      const program = find(included, { type: 'program' });
      const allBooks = filter(included, { type: 'books' });
      const booksGroupBy = groupBy(allBooks, 'attributes.group_id');
      const groups = data.map(group => {
        const goal =
          find(included, {
            type: 'goal',
            id: String(group.attributes.active_goal_id),
          }) || {};
        const progress = find(included, {
          type: 'groupProgress',
          id: String(group.id),
        });
        return merge(group, {
          goal,
          books: booksGroupBy[group.id] || [],
          progress,
        });
      });
      const currentPage = get(filterParam, 'page', 0) + 1;
      const totalPage = get(res, 'meta.pagination.total_pages', 0);
      const morePage =
        currentPage >= 1 && currentPage < totalPage && groups.length === 10;
      dispatch({
        type: Types.GET_PROGRAM_GROUPS_SUCCESS,
        payload: {
          groups,
          program,
          programId,
          loadMore,
          morePage,
          total: get(res, 'meta.pagination.total', 0) || groups.length,
        },
      });
      if (cb) cb(morePage);
    } catch (error) {
      dispatch({
        type: Types.GET_PROGRAM_GROUPS_ERROR,
        payload: { error: error.message, programId },
      });
    }
  } else {
    toast.error('organizationId not found');
  }
};

export const updateCombinedGroup = (
  programId: string,
  groupId: string,
  data: CombinedGroupData,
  cb?: Function
) => async (dispatch: CustomDispatch, getState: () => IReduxState) => {
  try {
    const organizationId = idx(
      getState(),
      x => x.auth.profile.data.relationships.organization.data.id
    );
    dispatch({
      type: Types.UPDATE_PROGRAM_GROUPS_REQUEST,
      payload: { id: groupId, programId },
    });
    await Api.updateCombinedGroup(organizationId, programId, groupId, data);
    dispatch({
      type: Types.UPDATE_PROGRAM_GROUPS_SUCCESS,
      payload: { id: groupId, data, programId },
    });
    toast.success('Group Updated Successfully');
    if (cb) cb();
  } catch (error) {
    dispatch({
      type: Types.UPDATE_PROGRAM_GROUPS_ERROR,
      payload: { id: groupId, error: error.message, programId },
    });
  }
};

export const deleteGroupInProgram = (
  programId: string,
  groupId: string
) => async (dispatch: CustomDispatch, getState: () => IReduxState) => {
  const organizationId = idx(
    getState(),
    x => x.auth.profile.data.relationships.organization.data.id
  );
  if (organizationId) {
    try {
      dispatch({
        type: Types.DELETE_GROUP_REQUEST,
        payload: { groupId, programId },
      });
      await Api.deleteGroupInProgram(organizationId, programId, groupId);
      dispatch({
        type: Types.DELETE_GROUP_SUCCESS,
        payload: { groupId, programId },
      });
      toast.success('Group deleted successfully!');
    } catch (error) {
      dispatch({
        type: Types.DELETE_GROUP_ERROR,
        payload: { groupId, programId, error: error.message },
      });
    }
  } else {
    toast.error('organizationId not found');
  }
};

export const getAllOrganizerGroups = () => async (
  dispatch: CustomDispatch,
  getState: () => IReduxState
) => {
  const organizationId = idx(
    getState(),
    x => x.auth.profile.data.relationships.organization.data.id
  );
  if (organizationId) {
    try {
      dispatch({ type: Types.GET_ORGANIZER_GROUPS_REQUEST });
      const res = await Api.getAllOrganizerGroups(organizationId);
      dispatch({
        type: Types.GET_ORGANIZER_GROUPS_SUCCESS,
        payload: res.map(r => ({
          ...r,
          group_id: r.group_id.toString(),
        })),
      });
    } catch (error) {
      dispatch({
        type: Types.GET_ORGANIZER_GROUPS_ERROR,
        payload: error.message,
      });
    }
  } else {
    toast.error('organizationId not found');
  }
};

export const searchGroups = (programId: string, searchText: string) => async (
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
        type: Types.ORGANIZER_SEARCH_GROUP_REQUEST,
        payload: { programId },
      });
      const res = await Api.searchProgramGroups(
        organizationId,
        programId,
        searchText
      );
      dispatch({
        type: Types.ORGANIZER_SEARCH_GROUP_SUCCESS,
        payload: { programId, data: res.data },
      });
    } catch (error) {
      dispatch({
        type: Types.ORGANIZER_SEARCH_GROUP_ERROR,
        payload: { programId, error: error.message },
      });
    }
  } else {
    toast.error('organizationId not found');
  }
};
export const resetSearchGroups = (programId: string) => async (
  dispatch: CustomDispatch
) => {
  dispatch({
    type: Types.ORGANIZER_SEARCH_GROUP_RESET_DATA,
    payload: { programId },
  });
};
