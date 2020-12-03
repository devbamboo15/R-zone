import findIndex from 'lodash/findIndex';
import idx from 'idx';
import get from 'lodash/get';
import Types, { IProgram } from 'src/store/types/organizer/program';

const initialState = {
  createProgram: {
    isInProgress: false,
    error: null,
    success: null,
  },
  createAdvancedProgram: {
    isInProgress: false,
    error: null,
    success: null,
  },
  updateAdvancedProgram: {
    isInProgress: false,
    error: null,
    success: null,
  },
  allPrograms: {
    data: [] as IProgram[],
    loading: false,
    error: null,
  },
  programs: {
    data: [] as IProgram[],
    error: null,
    loading: false,
    dataWithIncluded: {} as any,
    morePage: false as boolean,
    total: 0 as number,
    reset: false as boolean,
  },
  programCode: {
    data: '',
    loading: false,
    error: null,
  },
  searchPrograms: {
    loading: false,
    data: [],
    dataWithIncluded: {} as any,
    error: '',
    text: '',
  },
  updateProgram: {} as { [id: string]: IReduxOperationRequest },
  deleteProgram: {} as { [id: string]: IReduxOperationRequest },
  sendEmailParticipant: {
    loading: false,
    error: '',
  },
  cloneProgram: {
    loading: false,
    success: false,
    error: '',
  },
};
export default (
  state = initialState,
  action: IReduxAction
): typeof initialState => {
  switch (action.type) {
    case Types.GET_PROGRAMS_RESET_DATA: {
      return {
        ...state,
        programs: {
          data: [],
          error: null,
          loading: false,
          dataWithIncluded: {},
          morePage: true,
          total: 0,
          reset: true,
        },
      };
    }
    case Types.GET_ALL_PROGRAMS_REQUEST: {
      return {
        ...state,
        allPrograms: {
          ...state.allPrograms,
          loading: true,
          error: null,
        },
      };
    }
    case Types.GET_ALL_PROGRAMS_SUCCESS: {
      return {
        ...state,
        allPrograms: {
          ...state.allPrograms,
          loading: false,
          error: null,
          data: action.payload,
        },
      };
    }
    case Types.GET_ALL_PROGRAMS_ERROR: {
      return {
        ...state,
        allPrograms: {
          ...state.allPrograms,
          loading: false,
          error: action.payload,
        },
      };
    }
    case Types.CREATE_PROGRAM_REQUEST: {
      return {
        ...state,
        createProgram: {
          isInProgress: true,
          error: null,
          success: null,
        },
      };
    }
    case Types.CREATE_PROGRAM_SUCCESS: {
      return {
        ...state,
        createProgram: {
          isInProgress: false,
          error: null,
          success: true,
        },
      };
    }
    case Types.CREATE_PROGRAM_ERROR: {
      return {
        ...state,
        createProgram: {
          isInProgress: false,
          error: action.payload,
          success: false,
        },
      };
    }
    case Types.CREATE_PROGRAM_RESET_DATA: {
      return {
        ...state,
        createProgram: {
          isInProgress: false,
          error: null,
          success: null,
        },
      };
    }

    // Get All Programs
    case Types.GET_PROGRAMS_REQUEST: {
      return {
        ...state,
        programs: {
          ...state.programs,
          loading: true,
          error: null,
          morePage: false,
          total: get(state, 'programs.total', 0),
          reset: false,
        },
      };
    }
    case Types.GET_PROGRAMS_SUCCESS: {
      return {
        ...state,
        programs: {
          loading: false,
          reset: false,
          data: action.payload.loadMore
            ? [...state.programs.data, ...action.payload.program.data]
            : action.payload.program.data,
          dataWithIncluded: action.payload.loadMore
            ? {
                data: [
                  ...state.programs.dataWithIncluded.data,
                  ...action.payload.program.data,
                ],
                included: [
                  ...state.programs.dataWithIncluded.included,
                  ...action.payload.program.included,
                ],
              }
            : action.payload.program,
          morePage: action.payload.morePage,
          total: action.payload.total,
          error: null,
        },
      };
    }
    case Types.GET_PROGRAMS_ERROR: {
      return {
        ...state,
        programs: {
          ...state.programs,
          loading: false,
          error: action.payload,
          morePage: false,
          total: 0,
          reset: false,
        },
      };
    }

    // Search Programs
    case Types.SEARCH_PROGRAMS_REQUEST: {
      return {
        ...state,
        searchPrograms: {
          ...state.searchPrograms,
          loading: true,
          error: null,
          text: String(idx(action, x => x.payload.text)),
        },
      };
    }
    case Types.SEARCH_PROGRAMS_SUCCESS: {
      return {
        ...state,
        searchPrograms: {
          ...state.searchPrograms,
          loading: false,
          data: action.payload.program.data,
          dataWithIncluded: action.payload.program,
          error: null,
        },
      };
    }
    case Types.SEARCH_PROGRAMS_ERROR: {
      return {
        ...state,
        searchPrograms: {
          ...state.searchPrograms,
          loading: false,
          error: action.payload,
        },
      };
    }
    case Types.SEARCH_PROGRAMS_RESET_DATA: {
      return {
        ...state,
        searchPrograms: {
          text: '',
          data: [],
          dataWithIncluded: {},
          loading: false,
          error: '',
        },
      };
    }

    // update program
    case Types.UPDATE_PROGRAM_REQUEST: {
      return {
        ...state,
        updateProgram: {
          ...state.updateProgram,
          [action.payload.id]: {
            loading: true,
            error: null,
            status: '',
          },
        },
      };
    }
    case Types.UPDATE_PROGRAM_SUCCESS: {
      const oldPrograms = idx(state, x => x.programs.data) || [];
      const programIndex = findIndex(oldPrograms, { id: action.payload.id });
      // update program data
      let oldProgram = oldPrograms[programIndex];
      oldProgram = {
        ...oldProgram,
        attributes: {
          ...oldProgram.attributes,
          name: `${idx(action, x => x.payload.data.name)}`,
          reading_log: Number(idx(action, x => x.payload.data.reading_log)),
        },
      };
      oldPrograms[programIndex] = oldProgram;
      const newPrograms = [...oldPrograms];
      return {
        ...state,
        programs: {
          ...state.programs,
          data: newPrograms,
        },
        updateProgram: {
          ...state.updateProgram,
          [action.payload.id]: {
            loading: false,
            error: null,
            status: 'success',
          },
        },
      };
    }
    case Types.UPDATE_PROGRAM_ERROR: {
      return {
        ...state,
        updateProgram: {
          ...state.updateProgram,
          [action.payload.id]: {
            loading: false,
            error: action.payload,
            status: 'error',
          },
        },
      };
    }

    // delete program
    case Types.DELETE_PROGRAM_REQUEST: {
      return {
        ...state,
        deleteProgram: {
          ...state.deleteProgram,
          [action.payload.id]: {
            loading: true,
            error: null,
            status: '',
          },
        },
      };
    }
    case Types.DELETE_PROGRAM_SUCCESS: {
      const oldPrograms = idx(state, x => x.programs.data) || [];
      const programIndex = findIndex(oldPrograms, { id: action.payload.id });
      oldPrograms.splice(programIndex, 1);
      const newPrograms = [...oldPrograms];
      return {
        ...state,
        programs: {
          ...state.programs,
          data: newPrograms,
          total: state.programs.total - 1,
        },
        deleteProgram: {
          ...state.deleteProgram,
          [action.payload.id]: {
            loading: false,
            error: null,
            status: 'success',
          },
        },
      };
    }
    case Types.DELETE_PROGRAM_ERROR: {
      return {
        ...state,
        deleteProgram: {
          ...state.deleteProgram,
          [action.payload.id]: {
            loading: false,
            error: action.payload,
            status: 'error',
          },
        },
      };
    }
    case Types.DELETE_PROGRAM_RESET_DATA: {
      return {
        ...state,
        deleteProgram: {
          ...state.deleteProgram,
          [action.payload.id]: {
            loading: false,
            error: '',
            status: '',
          },
        },
      };
    }

    // Create Advance Program
    case Types.CREATE_ADVANCED_PROGRAM_REQUEST: {
      return {
        ...state,
        createAdvancedProgram: {
          isInProgress: true,
          error: null,
          success: null,
        },
      };
    }
    case Types.CREATE_ADVANCED_PROGRAM_SUCCESS: {
      return {
        ...state,
        createAdvancedProgram: {
          isInProgress: false,
          error: null,
          success: true,
        },
      };
    }
    case Types.CREATE_ADVANCED_PROGRAM_ERROR: {
      return {
        ...state,
        createAdvancedProgram: {
          isInProgress: false,
          error: action.payload,
          success: false,
        },
      };
    }
    case Types.CREATE_ADVANCED_PROGRAM_RESET_DATA: {
      return {
        ...state,
        createAdvancedProgram: {
          isInProgress: false,
          error: null,
          success: null,
        },
      };
    }

    // UPDATE Advance Program
    case Types.UPDATE_ADVANCED_PROGRAM_REQUEST: {
      return {
        ...state,
        updateAdvancedProgram: {
          isInProgress: true,
          error: null,
          success: null,
        },
      };
    }
    case Types.UPDATE_ADVANCED_PROGRAM_SUCCESS: {
      const oldPrograms = idx(state, x => x.programs.data) || [];
      const programIndex = findIndex(oldPrograms, { id: action.payload.id });
      // update program data
      let oldProgram = oldPrograms[programIndex];
      oldProgram = {
        ...oldProgram,
        attributes: {
          ...oldProgram.attributes,
          name: `${idx(action, x => x.payload.data.program.name)}`,
          reading_log: Number(
            idx(action, x => x.payload.data.program.reading_log)
          ),
        },
      };
      oldPrograms[programIndex] = oldProgram;
      const newPrograms = [...oldPrograms];
      return {
        ...state,
        programs: {
          ...state.programs,
          data: newPrograms,
        },
        updateAdvancedProgram: {
          isInProgress: false,
          error: null,
          success: true,
        },
      };
    }
    case Types.UPDATE_ADVANCED_PROGRAM_ERROR: {
      return {
        ...state,
        updateAdvancedProgram: {
          isInProgress: false,
          error: true,
          success: false,
        },
      };
    }

    // Clone Program
    case Types.CLONE_PROGRAM_REQUEST: {
      return {
        ...state,
        cloneProgram: {
          loading: true,
          error: null,
          success: null,
        },
      };
    }
    case Types.CLONE_PROGRAM_SUCCESS: {
      const newProgram = get(action, 'data.data') || {};
      const newPrograms = [...state.programs.data, ...newProgram];
      return {
        ...state,
        cloneProgram: {
          loading: false,
          error: null,
          success: true,
        },
        programs: {
          ...state.programs,
          data: newPrograms,
        },
      };
    }
    case Types.CLONE_PROGRAM_ERROR: {
      return {
        ...state,
        cloneProgram: {
          loading: false,
          error: null,
          success: true,
        },
      };
    }

    // Get Program Code
    case Types.GET_PROGRAM_CODE_REQUEST: {
      return {
        ...state,
        programCode: {
          loading: true,
          error: null,
          data: '',
        },
      };
    }
    case Types.GET_PROGRAM_CODE_SUCCESS: {
      return {
        ...state,
        programCode: {
          loading: false,
          data: action.payload,
          error: null,
        },
      };
    }
    case Types.GET_PROGRAM_CODE_ERROR: {
      return {
        ...state,
        programCode: {
          loading: false,
          error: action.payload,
          data: '',
        },
      };
    }
    case Types.SEND_EMAIL_TO_PARTICIPANTS_REQUEST: {
      return {
        ...state,
        sendEmailParticipant: {
          error: null,
          loading: true,
        },
      };
    }
    case Types.SEND_EMAIL_TO_PARTICIPANTS_SUCCESS: {
      return {
        ...state,
        sendEmailParticipant: {
          error: null,
          loading: false,
        },
      };
    }
    case Types.SEND_EMAIL_TO_PARTICIPANTS_ERROR: {
      return {
        ...state,
        sendEmailParticipant: {
          error: action.payload,
          loading: false,
        },
      };
    }
    default:
      return state;
  }
};
