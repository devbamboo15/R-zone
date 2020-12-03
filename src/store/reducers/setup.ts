import Types from '../types/setup';

const initialState = {
  child: {
    loading: false,
    data: [] as any[],
    error: null as string,
  },
  programs: {
    loading: false,
    data: [] as any[],
    error: null as string,
  },
  childDetails: {
    loading: false,
    data: {} as any,
    error: null as string,
  },
  addMeChild: {
    loading: false,
    data: {} as any,
    error: null as string,
  },
  lastEntryData: {},
};

export default (
  state = initialState,
  action: IReduxAction
): typeof initialState => {
  switch (action.type) {
    // GET_ME_CHILD
    case Types.GET_ME_CHILD_REQUEST: {
      return {
        ...state,
        child: {
          data: [],
          loading: true,
          error: null,
        },
      };
    }
    case Types.GET_ME_CHILD_SUCCESS: {
      return {
        ...state,
        child: {
          data: action.payload,
          loading: false,
          error: null,
        },
      };
    }
    case Types.GET_ME_CHILD_ERROR: {
      return {
        ...state,
        child: {
          data: [],
          loading: false,
          error: action.payload,
        },
      };
    }
    case Types.ADD_ME_CHILD_DATA: {
      return {
        ...state,
        child: {
          ...state.child,
          data: [...state.child.data, ...[action.payload]],
        },
      };
    }
    // GET_ME_CHILD_DETAILS
    case Types.GET_ME_CHILD_DETAILS_REQUEST: {
      return {
        ...state,
        childDetails: {
          data: {},
          loading: true,
          error: null,
        },
      };
    }
    case Types.GET_ME_CHILD_DETAILS_SUCCESS: {
      return {
        ...state,
        childDetails: {
          data: action.payload,
          loading: false,
          error: null,
        },
      };
    }
    case Types.GET_ME_CHILD_DETAILS_ERROR: {
      return {
        ...state,
        childDetails: {
          data: {},
          loading: false,
          error: action.payload,
        },
      };
    }
    // GET_ME_PROGRAM
    case Types.GET_ME_PROGRAM_REQUEST: {
      return {
        ...state,
        programs: {
          data: [],
          loading: true,
          error: null,
        },
      };
    }
    case Types.GET_ME_PROGRAM_SUCCESS: {
      return {
        ...state,
        programs: {
          data: action.payload,
          loading: false,
          error: null,
        },
      };
    }
    case Types.GET_ME_PROGRAM_ERROR: {
      return {
        ...state,
        programs: {
          data: [],
          loading: false,
          error: action.payload,
        },
      };
    }
    // ADD_ME_CHILD
    case Types.ADD_ME_CHILD_REQUEST: {
      return {
        ...state,
        addMeChild: {
          data: {},
          loading: true,
          error: null,
        },
      };
    }
    case Types.ADD_ME_CHILD_SUCCESS: {
      return {
        ...state,
        addMeChild: {
          data: action.payload,
          loading: false,
          error: null,
        },
      };
    }
    case Types.ADD_ME_CHILD_ERROR: {
      return {
        ...state,
        addMeChild: {
          data: {},
          loading: false,
          error: action.payload,
        },
      };
    }
    case Types.SET_LAST_ENTRY_DATA: {
      return {
        ...state,
        lastEntryData: action.payload,
      };
    }
    default:
      return state;
  }
};
