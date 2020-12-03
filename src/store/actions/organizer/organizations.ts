import idx from 'idx';
import * as Api from 'src/api';
import toast from 'src/helpers/Toast';
import Types from '../../types/organizer/organizations';
import { fetchMeData } from '../auth';
import { IReduxState } from '../../reducers';

export const getAllOrganizations = () => async (dispatch: CustomDispatch) => {
  try {
    dispatch({ type: Types.GET_USER_ORGANIZATIONS });
    const res = await Api.getAllOrganizations();
    dispatch({
      type: Types.GET_USER_ORGANIZATIONS_SUCCESS,
      payload: idx(res, x => x.data),
    });
  } catch (error) {
    dispatch({
      type: Types.GET_USER_ORGANIZATIONS_ERROR,
      payload: error.message,
    });
  }
};

export const getOrganizationProgress = (
  programId?: string,
  groupId?: string,
  filterData?: any
) => async (dispatch: CustomDispatch, getState: () => IReduxState) => {
  try {
    const organizationId = idx(
      getState(),
      x => x.auth.profile.data.relationships.organization.data.id
    );
    dispatch({ type: Types.GET_ORGANIZATIONS_PROGRESS });
    const res = await Api.getOrganizationProgress(
      organizationId,
      programId,
      groupId,
      filterData
    );
    dispatch({
      type: Types.GET_ORGANIZATIONS_PROGRESS_SUCCESS,
      payload: {
        organizationProgress: idx(res, x => x.data),
      },
    });
  } catch (error) {
    dispatch({
      type: Types.GET_ORGANIZATIONS_PROGRESS_ERROR,
      payload: error.message,
    });
  }
};

export const setOrganization = (id: string) => async (
  dispatch: CustomDispatch
) => {
  try {
    dispatch({ type: Types.SET_USER_ORGANIZATION });
    await Api.setOrganization(id);
    dispatch(fetchMeData());
    toast.success('Organization Switched Successfully');
  } catch (error) {
    dispatch({
      type: Types.SET_USER_ORGANIZATION_ERROR,
      payload: error.message,
    });
  }
};
