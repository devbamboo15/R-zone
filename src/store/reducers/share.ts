import Types, { IShareItem } from '../types/share';

const initialState = {
  loading: false,
  error: null as string,
  data: [] as IShareItem[],
  program_id: null,
  success: null,
  userLeaderboard: {
    loading: false,
    data: [],
    error: '',
  },
};

export default (
  state = initialState,
  action: IReduxAction
): typeof initialState => {
  switch (action.type) {
    case Types.SHARE: {
      return {
        ...state,
        loading: true,
      };
    }
    case Types.SHARE_SUCCESS: {
      return {
        ...state,
        loading: false,
        error: '',
        data: action.payload,
        success: null,
      };
    }
    case Types.UPDATE_SHARE_SUCCESS: {
      return {
        ...state,
        loading: false,
        error: '',
        data: action.payload,
        success: true,
      };
    }

    case Types.DELETE_SHARE_SUCCESS: {
      return {
        ...state,
        loading: false,
        error: '',
        data: [],
        success: true,
      };
    }

    case Types.SHARE_ERROR: {
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    }

    case Types.CLICK_SHARE: {
      return {
        ...state,
        loading: false,
        error: '',
        program_id: action.payload,
      };
    }

    case Types.GET_USER_LEADERBOARD: {
      return {
        ...state,
        userLeaderboard: {
          ...state.userLeaderboard,
          loading: true,
          error: '',
        },
      };
    }
    case Types.GET_USER_LEADERBOARD_SUCCESS: {
      return {
        ...state,
        userLeaderboard: {
          loading: false,
          data: action.payload,
          error: '',
        },
      };
    }
    case Types.GET_USER_LEADERBOARD_ERROR: {
      return {
        ...state,
        userLeaderboard: {
          loading: false,
          data: [],
          error: action.payload,
        },
      };
    }

    default:
      return state;
  }
};
