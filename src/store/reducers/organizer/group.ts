import findIndex from 'lodash/findIndex';
import merge from 'lodash/merge';
import get from 'lodash/get';
import find from 'lodash/find';
import idx from 'idx';
import Types, { IOrganizerGroupItem } from 'src/store/types/organizer/group';
import { IOrganizerGroup } from 'src/store/types/common';

const initialState = {
  createProgramGroups: {} as IReduxOperationRequest,
  programGroups: {} as {
    [id: string]: {
      data: IOrganizerGroup[];
      error: string | null;
      loading: boolean;
      morePage: boolean;
      total: number;
    };
  },
  allGroups: {
    data: [] as IOrganizerGroupItem[],
    error: null,
    loading: false,
  },
  updateGroup: {} as { [id: string]: IReduxOperationRequest },
  deleteGroup: {} as { [id: string]: IReduxOperationRequest },
  searchGroups: {} as { [id: string]: IReduxOperationRequest }, // id is program id, search group is based on program id
};

export default (
  state = initialState,
  action: IReduxAction
): typeof initialState => {
  switch (action.type) {
    // Create Program Group
    case Types.CREATE_COMBINED_GROUP_REQUEST: {
      return {
        ...state,
        createProgramGroups: {
          loading: true,
          error: '',
          status: '',
        },
      };
    }
    case Types.CREATE_COMBINED_GROUP_SUCCESS: {
      return {
        ...state,
        createProgramGroups: {
          loading: false,
          error: '',
          status: 'success',
        },
      };
    }
    case Types.CREATE_COMBINED_GROUP_ERROR: {
      return {
        ...state,
        createProgramGroups: {
          loading: false,
          error: String(idx(action, x => x.payload.error)),
          status: 'error',
        },
      };
    }
    case Types.CREATE_COMBINED_GROUP_RESET_DATA: {
      return {
        ...state,
        createProgramGroups: {
          loading: false,
          error: '',
          status: '',
        },
      };
    }

    // Get All Program Groups
    case Types.GET_PROGRAM_GROUPS_REQUEST: {
      const { programId } = action.payload;
      return {
        ...state,
        programGroups: {
          ...state.programGroups,
          [programId]: {
            ...(idx(state, x => x.programGroups[programId]) || {}),
            loading: true,
            error: null,
            morePage: false,
            total: get(state, `programGroups[${programId}].total`, 0),
          },
        },
      };
    }
    case Types.GET_PROGRAM_GROUPS_SUCCESS: {
      const {
        groups = [],
        programId,
        loadMore,
        morePage,
        total,
      } = action.payload;
      // update program info also
      // const oldPrograms = idx(state, x => x.programs.data) || [];
      // const pos = findIndex(oldPrograms, { id: program.id });
      // const newPrograms = [...oldPrograms];
      // if (pos > -1) {
      //   newPrograms[pos] = program;
      // }
      return {
        ...state,
        // programs: {
        //   ...state.programs,
        //   data: newPrograms,
        // },
        programGroups: {
          ...state.programGroups,
          [programId]: {
            loading: false,
            data: loadMore
              ? [...state.programGroups[programId].data, ...groups]
              : groups,
            error: null,
            morePage,
            total,
          },
        },
      };
    }
    case Types.GET_PROGRAM_GROUPS_ERROR: {
      const { programId } = action.payload;
      return {
        ...state,
        programGroups: {
          ...state.programGroups,
          [programId]: {
            loading: false,
            error: action.payload,
            data: [],
            morePage: false,
            total: 0,
          },
        },
      };
    }
    case Types.SET_MULTIPLE_PROGRAM_GROUPS: {
      const { groups = {} } = action.payload;
      let programGroups = {};
      Object.keys(groups).forEach(programId => {
        programGroups = {
          ...programGroups,
          [programId]: {
            data: groups[programId].map(g => {
              const oldGroups =
                get(state, `programGroups[${programId}].data`) || [];
              const oldGroup = find(oldGroups, { id: g.id }) || {};
              return {
                ...oldGroup,
                ...g,
              };
            }),
            loading: false,
            error: '',
          },
        };
      });
      return {
        ...state,
        programGroups: {
          ...state.programGroups,
          ...programGroups,
        },
      };
    }

    // update group
    case Types.UPDATE_PROGRAM_GROUPS_REQUEST: {
      return {
        ...state,
        updateGroup: {
          ...state.updateGroup,
          [action.payload.id]: {
            loading: true,
            error: '',
            status: '',
          },
        },
      };
    }
    case Types.UPDATE_PROGRAM_GROUPS_SUCCESS: {
      const { programId } = action.payload;
      const oldGroups = idx(state, x => x.programGroups[programId].data) || [];
      const groupIndex = findIndex(oldGroups, { id: action.payload.id });
      const books = idx(action, x => x.payload.data.book);
      // update group data
      let oldGroup = oldGroups[groupIndex];
      const oldBooks = [...oldGroup.books];
      const newBooks = books || oldBooks;

      oldGroup = merge(oldGroup, {
        attributes: idx(action, x => x.payload.data.group) || {},
        goal: { attributes: idx(action, x => x.payload.data.goal) || {} },
      });
      oldGroup.books = newBooks.map(book => book);
      oldGroups[groupIndex] = oldGroup;
      const newGroups = [...oldGroups];
      return {
        ...state,
        programGroups: {
          ...state.programGroups,
          [programId]: {
            ...(idx(state, x => x.programGroups[programId]) || {}),
            data: newGroups,
          },
        },
        updateGroup: {
          ...state.updateGroup,
          [action.payload.id]: {
            loading: false,
            error: '',
            status: 'success',
          },
        },
      };
    }
    case Types.UPDATE_PROGRAM_GROUPS_ERROR: {
      return {
        ...state,
        updateGroup: {
          ...state.updateGroup,
          [action.payload.id]: {
            loading: false,
            error: action.payload,
            status: 'error',
          },
        },
      };
    }

    // Get All Groups
    case Types.GET_ORGANIZER_GROUPS_REQUEST: {
      return {
        ...state,
        allGroups: {
          ...state.allGroups,
          loading: true,
          error: null,
        },
      };
    }
    case Types.GET_ORGANIZER_GROUPS_SUCCESS: {
      return {
        ...state,
        allGroups: {
          loading: false,
          data: action.payload,
          error: null,
        },
      };
    }
    case Types.GET_ORGANIZER_GROUPS_ERROR: {
      return {
        ...state,
        allGroups: {
          ...state.allGroups,
          loading: false,
          error: action.payload,
        },
      };
    }
    // delete group
    case Types.DELETE_GROUP_REQUEST: {
      return {
        ...state,
        deleteGroup: {
          ...state.deleteGroup,
          [action.payload.id]: {
            loading: true,
            error: null,
            status: '',
          },
        },
      };
    }
    case Types.DELETE_GROUP_SUCCESS: {
      const { programId } = action.payload;
      const oldProgramGroups =
        idx(state, x => x.programGroups[programId].data) || [];
      const groupIndex = findIndex(oldProgramGroups, { id: action.payload.id });
      oldProgramGroups.splice(groupIndex, 1);
      const newGroups = [...oldProgramGroups];
      return {
        ...state,
        programGroups: {
          ...state.programGroups,
          [programId]: {
            ...(idx(state, x => x.programGroups[programId]) || {}),
            data: newGroups,
            total: get(state, `programGroups[${programId}].total`, 0) - 1,
          },
        },
        deleteGroup: {
          ...state.deleteGroup,
          [action.payload.id]: {
            loading: false,
            error: null,
            status: 'success',
          },
        },
      };
    }
    case Types.DELETE_GROUP_ERROR: {
      return {
        ...state,
        deleteGroup: {
          ...state.deleteGroup,
          [action.payload.id]: {
            loading: false,
            error: action.payload,
            status: 'error',
          },
        },
      };
    }

    // search group
    case Types.ORGANIZER_SEARCH_GROUP_REQUEST: {
      return {
        ...state,
        searchGroups: {
          ...state.searchGroups,
          [action.payload.programId]: {
            loading: true,
            error: null,
            status: '',
            data: [],
          },
        },
      };
    }
    case Types.ORGANIZER_SEARCH_GROUP_SUCCESS: {
      return {
        ...state,
        searchGroups: {
          ...state.searchGroups,
          [action.payload.programId]: {
            loading: false,
            error: null,
            status: 'success',
            data: action.payload.data,
          },
        },
      };
    }
    case Types.ORGANIZER_SEARCH_GROUP_ERROR: {
      return {
        ...state,
        searchGroups: {
          ...state.searchGroups,
          [action.payload.programId]: {
            loading: false,
            error: action.payload,
            status: 'error',
            data: [],
          },
        },
      };
    }
    case Types.ORGANIZER_SEARCH_GROUP_RESET_DATA: {
      return {
        ...state,
        searchGroups: {
          ...state.searchGroups,
          [action.payload.programId]: {
            loading: false,
            error: null,
            status: '',
            data: [],
          },
        },
      };
    }
    default:
      return state;
  }
};
