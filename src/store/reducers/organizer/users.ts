import findIndex from 'lodash/findIndex';
import idx from 'idx';
import Types from 'src/store/types/organizer/users';
import get from 'lodash/get';

const initialState = {
  addUser: {
    isInProgress: false,
    error: null,
    success: null,
  },
  users: {
    data: [] as any[],
    error: null,
    loading: false,
  },
  usersAccess: {
    data: {} as any,
  },
  deleteUser: {} as { [id: string]: IReduxOperationRequest },
  updateUser: {} as { [id: string]: IReduxOperationRequest },
  deleteAllUsers: {
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
    case Types.ADD_AUTHORIZED_USER_REQUEST: {
      return {
        ...state,
        addUser: {
          isInProgress: true,
          error: null,
          success: null,
        },
      };
    }
    case Types.ADD_AUTHORIZED_USER_SUCCESS: {
      return {
        ...state,
        addUser: {
          isInProgress: false,
          error: null,
          success: true,
        },
      };
    }
    case Types.ADD_AUTHORIZED_USER_ERROR: {
      return {
        ...state,
        addUser: {
          isInProgress: false,
          error: action.payload,
          success: false,
        },
      };
    }
    case Types.ADD_AUTHORIZED_USER_RESET: {
      return {
        ...state,
        addUser: {
          isInProgress: false,
          error: null,
          success: null,
        },
      };
    }

    // Get All Authorized Users
    case Types.GET_AUTHORIZED_USER_REQUEST: {
      return {
        ...state,
        users: {
          ...state.users,
          loading: true,
          error: null,
        },
      };
    }
    case Types.GET_AUTHORIZED_USER_SUCCESS: {
      return {
        ...state,
        users: {
          loading: false,
          data: action.payload,
          error: null,
        },
      };
    }
    case Types.GET_AUTHORIZED_USER_ERROR: {
      return {
        ...state,
        users: {
          ...state.users,
          loading: false,
          error: action.payload,
        },
      };
    }

    case Types.SET_AUTHORIZED_USER_ACCESS: {
      return {
        ...state,
        usersAccess: {
          ...state.usersAccess,
          data: action.payload,
        },
      };
    }

    // delete all users
    case Types.DELETE_ALL_AUTHORIZED_USERS_REQUEST: {
      return {
        ...state,
        deleteAllUsers: {
          loading: true,
          success: false,
          error: '',
        },
      };
    }
    case Types.DELETE_ALL_AUTHORIZED_USERS_SUCCESS: {
      const deletedIds = get(action, 'payload.data.users') || [];
      const oldUsers = [...state.users.data];
      const newUsers = oldUsers.filter(u => !deletedIds.includes(u.id));
      return {
        ...state,
        deleteAllUsers: {
          loading: false,
          success: true,
          error: '',
        },
        users: {
          ...state.users,
          data: newUsers,
        },
      };
    }
    case Types.DELETE_ALL_AUTHORIZED_USERS_ERROR: {
      return {
        ...state,
        deleteAllUsers: {
          loading: false,
          success: false,
          error: action.payload,
        },
      };
    }

    // delete user
    case Types.DELETE_AUTHORIZED_USER_REQUEST: {
      return {
        ...state,
        deleteUser: {
          ...state.deleteUser,
          [action.payload.id]: {
            loading: true,
            error: null,
            status: '',
          },
        },
        deleteAllUsers: {
          ...state.deleteAllUsers,
          loading: true,
        },
      };
    }
    case Types.DELETE_AUTHORIZED_USER_SUCCESS: {
      const oldUsers = idx(state, x => x.users.data) || [];
      const programIndex = findIndex(oldUsers, { id: action.payload.id });
      oldUsers.splice(programIndex, 1);
      const newUsers = [...oldUsers];
      return {
        ...state,
        users: {
          ...state.users,
          data: newUsers,
        },
        deleteUser: {
          ...state.deleteUser,
          [action.payload.id]: {
            loading: false,
            error: null,
            status: 'success',
          },
        },
        deleteAllUsers: {
          ...state.deleteAllUsers,
          loading: false,
        },
      };
    }
    case Types.DELETE_AUTHORIZED_USER_ERROR: {
      return {
        ...state,
        deleteUser: {
          ...state.deleteUser,
          [action.payload.id]: {
            loading: false,
            error: action.payload,
            status: 'error',
          },
        },
        deleteAllUsers: {
          ...state.deleteAllUsers,
          loading: false,
        },
      };
    }
    case Types.DELETE_AUTHORIZED_USER_RESET_DATA: {
      return {
        ...state,
        deleteUser: {
          ...state.deleteUser,
          [action.payload.id]: {
            loading: false,
            error: '',
            status: '',
          },
        },
      };
    }

    case Types.UPDATE_AUTHORIZED_USER_REQUEST: {
      return {
        ...state,
        updateUser: {
          ...state.updateUser,
          [action.payload.id]: {
            loading: true,
            error: null,
            status: '',
          },
        },
      };
    }
    case Types.UPDATE_AUTHORIZED_USER_SUCCESS: {
      const oldUsers = idx(state, x => x.users.data) || [];
      const userIndex = findIndex(oldUsers, { id: action.payload.id });
      // update user data
      let oldUser = oldUsers[userIndex];
      oldUser = {
        ...oldUser,
        attributes: {
          ...oldUser.attributes,
        },
      };
      oldUsers[userIndex] = oldUser;
      const newUsers = [...oldUsers];
      return {
        ...state,
        users: {
          ...state.users,
          data: newUsers,
        },
        updateUser: {
          ...state.updateUser,
          [action.payload.id]: {
            loading: false,
            error: null,
            status: 'success',
          },
        },
      };
    }
    case Types.UPDATE_AUTHORIZED_USER_ERROR: {
      return {
        ...state,
        updateUser: {
          ...state.updateUser,
          [action.payload.id]: {
            loading: false,
            error: action.payload,
            status: 'error',
          },
        },
      };
    }
    default:
      return state;
  }
};
