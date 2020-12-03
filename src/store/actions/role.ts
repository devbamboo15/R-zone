import * as API from 'src/api';
import Types from '../types/role';

export const getUserRoles = () => async (dispatch: CustomDispatch) => {
  try {
    dispatch({ type: Types.USER_ROLES });
    const res = await API.getUserRoles();
    dispatch({ type: Types.USER_ROLES_SUCCESS, payload: res.data });
  } catch (error) {
    dispatch({ type: Types.USER_ROLES_ERROR, payload: error });
  }
};
