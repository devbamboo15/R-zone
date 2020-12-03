import Types, { IRoleItem } from '../types/role';

const initialState = {
  roles: {
    loading: false,
    error: null as string,
    data: [] as IRoleItem[],
  },
};

export default (
  state = initialState,
  action: IReduxAction
): typeof initialState => {
  switch (action.type) {
    // Roles
    case Types.USER_ROLES: {
      return {
        ...state,
        roles: {
          ...state.roles,
          loading: true,
        },
      };
    }
    case Types.USER_ROLES_SUCCESS: {
      return {
        ...state,
        roles: {
          ...state.roles,
          loading: false,
          error: '',
          data: action.payload,
        },
      };
    }
    case Types.USER_ROLES_ERROR: {
      return {
        ...state,
        roles: {
          ...state.roles,
          loading: false,
          error: action.payload,
        },
      };
    }
    default:
      return state;
  }
};
