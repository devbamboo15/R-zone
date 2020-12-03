import Types from 'src/store/types/organizer/organizations';

const initialState = {
  organizations: {
    data: [] as any[],
    error: null,
    loading: false,
  },
  organizationProgress: {
    data: {},
    error: null,
    loading: false,
    filtered: null,
  },
};

export default (
  state = initialState,
  action: IReduxAction
): typeof initialState => {
  switch (action.type) {
    case Types.GET_USER_ORGANIZATIONS: {
      return {
        ...state,
        organizations: {
          ...state.organizations,
          loading: true,
          error: null,
        },
      };
    }
    case Types.GET_USER_ORGANIZATIONS_SUCCESS: {
      return {
        ...state,
        organizations: {
          loading: false,
          data: action.payload,
          error: null,
        },
      };
    }
    case Types.GET_USER_ORGANIZATIONS_ERROR: {
      return {
        ...state,
        organizations: {
          ...state.organizations,
          loading: false,
          error: action.payload,
        },
      };
    }
    case Types.GET_ORGANIZATIONS_PROGRESS: {
      return {
        ...state,
        organizationProgress: {
          ...state.organizationProgress,
          loading: true,
          error: null,
        },
      };
    }
    case Types.GET_ORGANIZATIONS_PROGRESS_SUCCESS: {
      return {
        ...state,
        organizationProgress: {
          ...state.organizationProgress,
          loading: false,
          data: action.payload.organizationProgress,
          error: null,
          filtered: action.payload.filtered,
        },
      };
    }
    case Types.GET_ORGANIZATIONS_PROGRESS_ERROR: {
      return {
        ...state,
        organizationProgress: {
          ...state.organizationProgress,
          loading: false,
          error: action.payload,
        },
      };
    }
    default:
      return state;
  }
};
