import findIndex from 'lodash/findIndex';
import idx from 'idx';
import Types, {
  IWardsItem,
  IAwardsPreviewItem,
} from 'src/store/types/organizer/awards';

export interface IProgramAwardsState {
  data: IWardsItem[];
  error: any;
  loading: boolean;
}
export interface IProgramAwardsPreviewState {
  data: IAwardsPreviewItem;
  error: any;
  loading: boolean;
  status: string;
}
const initialState = {
  programAwards: {
    data: [],
    error: null,
    loading: false,
  } as IProgramAwardsState,
  leaderboard: {
    data: [],
    error: null,
    loading: false,
  },
  createAwards: {} as IReduxOperationRequest,
  updateAwards: {} as IReduxOperationRequest,
  awardsPreview: {
    data: {},
    error: null,
    loading: false,
    status: '',
  } as IProgramAwardsPreviewState,
  restoreDefaultAwards: {} as IReduxOperationRequest,
  updateAwardsAvatar: {} as IReduxOperationRequest,
  deleteAwardsAvatar: {} as IReduxOperationRequest,
};

export default (
  state = initialState,
  action: IReduxAction
): typeof initialState => {
  switch (action.type) {
    // Get Program Awards
    case Types.GET_PROGRAM_AWARDS_REQUEST: {
      return {
        ...state,
        programAwards: {
          ...state.programAwards,
          loading: true,
          error: '',
        },
      };
    }
    case Types.GET_PROGRAM_AWARDS_SUCCESS: {
      return {
        ...state,
        programAwards: {
          loading: false,
          error: '',
          data: action.payload.awards,
        },
      };
    }
    case Types.GET_PROGRAM_AWARDS_ERROR: {
      return {
        ...state,
        programAwards: {
          data: [],
          loading: false,
          error: action.payload.error,
        },
      };
    }

    // Get Group Awards
    case Types.GET_GROUP_AWARDS_REQUEST: {
      return {
        ...state,
        programAwards: {
          ...state.programAwards,
          loading: true,
          error: '',
        },
      };
    }
    case Types.GET_GROUP_AWARDS_SUCCESS: {
      return {
        ...state,
        programAwards: {
          loading: false,
          error: '',
          data: action.payload.awards,
        },
      };
    }
    case Types.GET_GROUP_AWARDS_ERROR: {
      return {
        ...state,
        programAwards: {
          data: [],
          loading: false,
          error: action.payload.error,
        },
      };
    }

    // Create Awards
    case Types.CREATE_AWARDS_REQUEST: {
      return {
        ...state,
        createAwards: {
          loading: true,
          error: '',
          status: '',
        },
      };
    }
    case Types.CREATE_AWARDS_SUCCESS: {
      return {
        ...state,
        createAwards: {
          loading: false,
          error: '',
          status: 'success',
        },
      };
    }
    case Types.CREATE_AWARDS_ERROR: {
      return {
        ...state,
        createAwards: {
          loading: false,
          error: String(idx(action, x => x.payload.error)),
          status: 'error',
        },
      };
    }
    case Types.CREATE_AWARDS_RESET_DATA: {
      return {
        ...state,
        createAwards: {
          loading: false,
          error: '',
          status: '',
        },
      };
    }

    // Update Awards
    case Types.UPDATE_AWARDS_REQUEST: {
      return {
        ...state,
        updateAwards: {
          loading: true,
          error: '',
          status: '',
        },
      };
    }
    case Types.UPDATE_AWARDS_SUCCESS: {
      const newAwards = [...state.programAwards.data];
      const newAwardIndex = findIndex(newAwards, { id: action.payload.id });
      newAwards[newAwardIndex] = action.payload.data;
      return {
        ...state,
        updateAwards: {
          loading: false,
          error: '',
          status: 'success',
        },
        programAwards: {
          ...state.programAwards,
          data: [...newAwards],
        },
      };
    }
    case Types.UPDATE_AWARDS_ERROR: {
      return {
        ...state,
        updateAwards: {
          loading: false,
          error: String(idx(action, x => x.payload.error)),
          status: 'error',
        },
      };
    }
    case Types.UPDATE_AWARDS_RESET_DATA: {
      return {
        ...state,
        updateAwards: {
          loading: false,
          error: '',
          status: '',
        },
      };
    }

    // Get Awards Preview
    case Types.GET_AWARDS_PREVEW_REQUEST: {
      return {
        ...state,
        awardsPreview: {
          ...state.awardsPreview,
          loading: true,
          error: '',
          status: '',
        },
      };
    }
    case Types.GET_AWARDS_PREVEW_SUCCESS: {
      return {
        ...state,
        awardsPreview: {
          loading: false,
          error: '',
          status: 'success',
          data: action.payload.data,
        },
      };
    }
    case Types.GET_AWARDS_PREVEW_ERROR: {
      return {
        ...state,
        awardsPreview: {
          ...state.awardsPreview,
          loading: false,
          error: String(idx(action, x => x.payload.error)),
          status: 'error',
        },
      };
    }

    // Restore default awards
    case Types.RESTORE_DEFAULT_AWARDS_REQUEST: {
      return {
        ...state,
        restoreDefaultAwards: {
          loading: true,
          error: '',
          status: '',
        },
      };
    }
    case Types.RESTORE_DEFAULT_AWARDS_SUCCESS: {
      const newAwards = [...state.programAwards.data];
      const newAwardIndex = findIndex(newAwards, { id: action.payload.id });
      newAwards[newAwardIndex] = action.payload.data;
      newAwards[newAwardIndex].is_default_avatar = 1;
      return {
        ...state,
        restoreDefaultAwards: {
          loading: false,
          error: '',
          status: 'success',
        },
        programAwards: {
          ...state.programAwards,
          data: [...newAwards],
        },
      };
    }
    case Types.RESTORE_DEFAULT_AWARDS_ERROR: {
      return {
        ...state,
        restoreDefaultAwards: {
          loading: false,
          error: String(idx(action, x => x.payload.error)),
          status: 'error',
        },
      };
    }
    case Types.RESTORE_DEFAULT_AWARDS_RESET_DATA: {
      return {
        ...state,
        restoreDefaultAwards: {
          loading: false,
          error: '',
          status: '',
        },
      };
    }

    // Update awards avatar
    case Types.UPDATE_AVATAR_AWARDS_REQUEST: {
      return {
        ...state,
        updateAwardsAvatar: {
          loading: true,
          error: '',
          status: '',
        },
      };
    }
    case Types.UPDATE_AVATAR_AWARDS_SUCCESS: {
      const newAwards = [...state.programAwards.data];
      const newAwardIndex = findIndex(newAwards, { id: action.payload.id });
      newAwards[newAwardIndex] = action.payload.data;
      return {
        ...state,
        updateAwardsAvatar: {
          loading: false,
          error: '',
          status: 'success',
        },
        programAwards: {
          ...state.programAwards,
          data: [...newAwards],
        },
      };
    }
    case Types.UPDATE_AVATAR_AWARDS_ERROR: {
      return {
        ...state,
        updateAwardsAvatar: {
          loading: false,
          error: String(idx(action, x => x.payload.error)),
          status: 'error',
        },
      };
    }

    // Delete awards avatar
    case Types.DELETE_AVATAR_AWARDS_REQUEST: {
      return {
        ...state,
        deleteAwardsAvatar: {
          loading: true,
          error: '',
          status: '',
        },
      };
    }
    case Types.DELETE_AVATAR_AWARDS_SUCCESS: {
      const newAwards = [...state.programAwards.data];
      const newAwardIndex = findIndex(newAwards, { id: action.payload.id });
      newAwards[newAwardIndex] = action.payload.data;
      newAwards[newAwardIndex].is_default_avatar = 1;
      return {
        ...state,
        deleteAwardsAvatar: {
          loading: false,
          error: '',
          status: 'success',
        },
        programAwards: {
          ...state.programAwards,
          data: [...newAwards],
        },
      };
    }
    case Types.DELETE_AVATAR_AWARDS_ERROR: {
      return {
        ...state,
        deleteAwardsAvatar: {
          loading: false,
          error: String(idx(action, x => x.payload.error)),
          status: 'error',
        },
      };
    }

    // Get Program Leaderboard
    case Types.GET_PROGRAM_LEADERBOARD_REQUEST: {
      return {
        ...state,
        leaderboard: {
          ...state.leaderboard,
          loading: true,
          error: '',
        },
      };
    }
    case Types.GET_PROGRAM_LEADERBOARD_SUCCESS: {
      return {
        ...state,
        leaderboard: {
          loading: false,
          error: '',
          data: action.payload.leaderboard,
        },
      };
    }
    case Types.GET_PROGRAM_LEADERBOARD_ERROR: {
      return {
        ...state,
        leaderboard: {
          data: [],
          loading: false,
          error: action.payload.error,
        },
      };
    }

    // Get Group Leaderboard
    case Types.GET_GROUP_LEADERBOARD_REQUEST: {
      return {
        ...state,
        leaderboard: {
          ...state.leaderboard,
          loading: true,
          error: '',
        },
      };
    }
    case Types.GET_GROUP_LEADERBOARD_SUCCESS: {
      return {
        ...state,
        leaderboard: {
          loading: false,
          error: '',
          data: action.payload.leaderboard,
        },
      };
    }
    case Types.GET_GROUP_LEADERBOARD_ERROR: {
      return {
        ...state,
        leaderboard: {
          data: [],
          loading: false,
          error: action.payload.error,
        },
      };
    }
    default:
      return state;
  }
};
