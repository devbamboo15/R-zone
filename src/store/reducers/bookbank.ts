import Types, {
  IUserBook,
  IBookItem,
  IBookOperationRequest,
} from '../types/bookbank';

const initialState = {
  userBooks: {
    loading: false,
    data: [] as IUserBook[],
    error: null as string,
  },
  searchedBooks: {
    loading: false,
    data: [] as IBookItem[],
    error: null as string,
  },
  addBooks: {} as IBookOperationRequest,
  finishBooks: {} as IBookOperationRequest,
  removeBooks: {} as IBookOperationRequest,
  userFinishBooks: {
    loading: false,
    error: null,
  },
  userAddBooks: {
    loading: false,
    error: null,
  },
};

export default (
  state = initialState,
  action: IReduxAction
): typeof initialState => {
  switch (action.type) {
    // Get User Books
    case Types.GET_USER_BOOKS_REQUEST: {
      return {
        ...state,
        userBooks: {
          ...state.userBooks,
          loading: true,
        },
      };
    }
    case Types.GET_USER_BOOKS_SUCCESS: {
      return {
        ...state,
        userBooks: {
          ...state.userBooks,
          data: action.payload,
          loading: false,
        },
      };
    }
    case Types.GET_USER_BOOKS_ERROR: {
      return {
        ...state,
        userBooks: {
          ...state.userBooks,
          loading: false,
          error: action.payload,
        },
      };
    }
    // Search Books
    case Types.SEARCH_BOOKS_REQUEST: {
      return {
        ...state,
        searchedBooks: {
          ...state.searchedBooks,
          data: [],
          loading: true,
        },
      };
    }
    case Types.SEARCH_BOOKS_SUCCESS: {
      return {
        ...state,
        searchedBooks: {
          ...state.searchedBooks,
          data: action.payload,
          loading: false,
        },
      };
    }
    case Types.SEARCH_BOOKS_ERROR: {
      return {
        ...state,
        searchedBooks: {
          data: [],
          loading: false,
          error: action.payload,
        },
      };
    }
    case Types.SEARCH_BOOKS_RESET: {
      return {
        ...state,
        searchedBooks: {
          data: [],
          loading: false,
          error: '',
        },
      };
    }
    // Add User Book
    case Types.ADD_BOOK_REQUEST: {
      return {
        ...state,
        addBooks: {
          ...state.addBooks,
          [action.payload.id]: {
            loading: true,
            error: null,
            success: false,
          },
        },
      };
    }
    case Types.ADD_BOOK_SUCCESS: {
      let indexAddBook = -1;
      state.searchedBooks.data.forEach((element, index) => {
        if (element.id === action.payload.id) {
          indexAddBook = index;
        }
      });
      return {
        ...state,
        searchedBooks: {
          ...state.searchedBooks,
          data: [
            ...state.searchedBooks.data.slice(0, indexAddBook),
            ...state.searchedBooks.data.slice(indexAddBook + 1),
          ],
          loading: false,
        },
        addBooks: {
          ...state.addBooks,
          [action.payload.id]: {
            loading: false,
            error: null,
            success: true,
          },
        },
      };
    }
    case Types.ADD_BOOK_ERROR: {
      return {
        ...state,
        addBooks: {
          ...state.addBooks,
          [action.payload.id]: {
            loading: false,
            error: action.payload.error,
            success: false,
          },
        },
      };
    }
    // Finish User Book
    case Types.FINISH_BOOK_REQUEST: {
      return {
        ...state,
        finishBooks: {
          ...state.finishBooks,
          [action.payload.id]: {
            loading: true,
            error: null,
            success: false,
          },
        },
      };
    }
    case Types.FINISH_BOOK_SUCCESS: {
      let indexFinishBook = -1;
      state.userBooks.data.forEach((element, index) => {
        if (element.id === action.payload.id) {
          indexFinishBook = index;
        }
      });
      const attributesFirst = state.userBooks.data[indexFinishBook].attributes;
      const bookUpdate: IUserBook = {
        ...state.userBooks.data[indexFinishBook],
        attributes: {
          ...attributesFirst,
          completed_at: 'true',
        },
      };
      return {
        ...state,
        userBooks: {
          ...state.userBooks,
          data: [
            ...state.userBooks.data.slice(0, indexFinishBook),
            bookUpdate,
            ...state.userBooks.data.slice(indexFinishBook + 1),
          ],
        },
        finishBooks: {
          ...state.finishBooks,
          [action.payload.id]: {
            loading: false,
            error: null,
            success: true,
          },
        },
      };
    }
    case Types.FINISH_BOOK_ERROR: {
      return {
        ...state,
        finishBooks: {
          ...state.finishBooks,
          [action.payload.id]: {
            loading: false,
            error: action.payload.error,
            success: false,
          },
        },
      };
    }
    // Finish User Books
    case Types.FINISH_BOOKS_REQUEST: {
      return {
        ...state,
        userFinishBooks: {
          loading: true,
          error: null,
        },
      };
    }
    case Types.FINISH_BOOKS_SUCCESS: {
      return {
        ...state,
        userFinishBooks: {
          loading: false,
          error: null,
        },
      };
    }
    case Types.FINISH_BOOKS_ERROR: {
      return {
        ...state,
        userFinishBooks: {
          loading: false,
          error: action.payload,
        },
      };
    }
    // Add User Books
    case Types.ADD_BOOKS_REQUEST: {
      return {
        ...state,
        userAddBooks: {
          loading: true,
          error: null,
        },
      };
    }
    case Types.ADD_BOOKS_SUCCESS: {
      return {
        ...state,
        userAddBooks: {
          loading: false,
          error: null,
        },
      };
    }
    case Types.ADD_BOOKS_ERROR: {
      return {
        ...state,
        userAddBooks: {
          loading: false,
          error: action.payload,
        },
      };
    }

    // Remove User Book
    case Types.REMOVE_BOOK_REQUEST: {
      return {
        ...state,
        removeBooks: {
          ...state.removeBooks,
          [action.payload.id]: {
            loading: true,
            error: null,
            success: false,
          },
        },
      };
    }
    case Types.REMOVE_BOOK_SUCCESS: {
      let indexRemoveBook = -1;
      state.userBooks.data.forEach((element, index) => {
        if (element.id === action.payload.id) {
          indexRemoveBook = index;
        }
      });
      return {
        ...state,
        userBooks: {
          ...state.userBooks,
          data: [
            ...state.userBooks.data.slice(0, indexRemoveBook),
            ...state.userBooks.data.slice(indexRemoveBook + 1),
          ],
        },
        removeBooks: {
          ...state.removeBooks,
          [action.payload.id]: {
            loading: false,
            error: null,
            success: true,
          },
        },
      };
    }
    case Types.REMOVE_BOOK_ERROR: {
      return {
        ...state,
        removeBooks: {
          ...state.removeBooks,
          [action.payload.id]: {
            loading: false,
            error: action.payload.error,
            success: false,
          },
        },
      };
    }
    default:
      return state;
  }
};
