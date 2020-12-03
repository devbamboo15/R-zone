import Types, { IProgressItem } from '../types/goal';
import { IGoalItem } from '../types/common';

const initialState = {
  showToolTip: true,

  searchedGoals: {
    loading: false,
    data: [] as IGoalItem[],
    groups: [] as any[],
    program: {} as any,
    error: null as string,
    status: '' as string,
  },
  joinGoal: {
    loading: false,
    error: null as string,
    status: '' as string,
  },
  leaveGoal: {
    loading: false,
    error: null as string,
    status: '' as string,
  },
  progress: {
    loading: false,
    error: null as string,
    data: [] as IProgressItem[],
  },
};

export default (
  state = initialState,
  action: IReduxAction
): typeof initialState => {
  switch (action.type) {
    // SEARCH GOAL
    case Types.GOALSEARCH_BOOK_REQUEST: {
      return {
        ...state,
        searchedGoals: {
          data: [],
          program: {},
          groups: [],
          status: 'request',
          error: '',
          loading: true,
        },
      };
    }
    case Types.GOALSEARCH_BOOK_SUCCESS: {
      return {
        ...state,
        searchedGoals: {
          data: action.payload.goals,
          program: action.payload.program,
          groups: action.payload.groups,
          loading: false,
          error: '',
          status: 'success',
        },
      };
    }
    case Types.GOALSEARCH_BOOK_ERROR: {
      return {
        ...state,
        searchedGoals: {
          data: [],
          program: {},
          groups: [],
          loading: false,
          error: action.payload,
          status: 'failure',
        },
      };
    }
    case Types.GOALSEARCH_BOOK_RESET: {
      return {
        ...state,
        searchedGoals: {
          data: [],
          program: {},
          groups: [],
          loading: false,
          error: action.payload,
          status: '',
        },
      };
    }
    // JOIN GOAL
    case Types.GOALJOIN_BOOK_REQUEST: {
      return {
        ...state,
        joinGoal: {
          ...state.joinGoal,
          loading: true,
        },
      };
    }
    case Types.GOALJOIN_BOOK_SUCCESS: {
      return {
        ...state,
        joinGoal: {
          ...state.joinGoal,
          loading: false,
          error: '',
          status: 'success',
        },
      };
    }
    case Types.GOALJOIN_BOOK_ERROR: {
      return {
        ...state,
        joinGoal: {
          ...state.joinGoal,
          loading: false,
          error: action.payload,
          status: 'failure',
        },
      };
    }
    // LEAVE GOAL
    case Types.GOALLEAVE_BOOK_REQUEST: {
      return {
        ...state,
        leaveGoal: {
          ...state.leaveGoal,
          loading: true,
        },
      };
    }
    case Types.GOALLEAVE_BOOK_SUCCESS: {
      return {
        ...state,
        leaveGoal: {
          ...state.leaveGoal,
          loading: false,
          error: '',
          status: 'success',
        },
      };
    }
    case Types.GOALLEAVE_BOOK_ERROR: {
      return {
        ...state,
        leaveGoal: {
          ...state.leaveGoal,
          loading: false,
          error: action.payload,
          status: 'failure',
        },
      };
    }
    // Progress
    case Types.PROGRESS_REQUEST: {
      return {
        ...state,
        progress: {
          ...state.progress,
          loading: true,
        },
      };
    }
    case Types.PROGRESS_SUCCESS: {
      return {
        ...state,
        progress: {
          ...state.progress,
          loading: false,
          error: '',
          data: action.payload,
        },
      };
    }
    case Types.PROGRESS_ERROR: {
      return {
        ...state,
        progress: {
          ...state.progress,
          loading: false,
          error: action.payload,
        },
      };
    }
    default:
      return state;
  }
};
