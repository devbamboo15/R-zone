import { concat, findIndex, merge, find, filter, map, cloneDeep } from 'lodash';
import {
  IReaderItem,
  Pagination,
  IGroupReader,
  IUserData,
  INoteData,
} from 'src/store/types/common';
import Types from 'src/store/types/organizer/reader';
import idx from 'idx';
import { IBookItem } from 'src/store/types';

interface IReaders {
  [id: string]: {
    data: IGroupReader[];
    error: string;
    loading: boolean;
  }; // here id will be group id , we are keeping readers array based on group id
}
interface IReader {
  data: IUserData & {
    notes: INoteData[];
  };
  error: string;
  loading: boolean;
}

interface IAllReaders {
  data: Pagination & {
    data: IReaderItem[];
  };
  error: string;
  loading: boolean;
}

interface ISearchReader {
  data: IReaderItem[];
  error: string;
  loading: boolean;
}

interface IAction {
  error: string;
  loading: boolean;
}

interface IActionWithSuccess {
  error: string;
  loading: boolean;
  success: boolean;
}

interface IActionBooks {
  data: IBookItem[];
  error: string;
  loading: boolean;
}
interface IActionBook {
  data: IBookItem;
  error: string;
  loading: boolean;
}

interface IAnyData {
  data: any[];
  error: string;
  loading: boolean;
}

const initialState = {
  readers: {} as IReaders,
  reader: {
    data: {
      notes: [],
    },
    error: '',
    loading: false,
  } as IReader,
  readerDetail: {
    data: {
      notes: [],
    },
    error: '',
    loading: false,
  } as IReader,
  readerMetrics: {
    data: {},
    error: '',
    loading: false,
  } as any,
  allReaders: {
    data: {
      data: [],
    },
    error: '',
    loading: false,
  } as IAllReaders,
  searchReaders: {
    data: [],
    error: '',
    loading: false,
  } as ISearchReader,
  addReader: {
    error: '',
    loading: false,
  } as IAction,
  assignReader: {
    error: '',
    loading: false,
  } as IAction,
  deleteBulkReader: {
    error: '',
    loading: false,
  } as IAction,
  deleteReader: {} as { [id: string]: IReduxOperationRequest },
  updateReader: {} as { [id: string]: IReduxOperationRequest },
  addReaderNote: {
    error: '',
    loading: false,
  } as IAction,
  deleteAllReaderNote: {
    error: '',
    loading: false,
  } as IAction,
  addBook: {
    error: '',
    loading: false,
  } as IAction,
  deleteBook: {
    error: '',
    loading: false,
  } as IAction,
  reviewBook: {
    error: '',
    loading: false,
  } as IAction,
  finishBook: {
    error: '',
    loading: false,
  } as IAction,
  reReadBook: {
    error: '',
    loading: false,
  } as IAction,
  booksReading: {
    data: [],
    error: '',
    loading: false,
  } as IActionBooks,
  booksFinished: {
    data: [],
    error: '',
    loading: false,
  } as IActionBooks,
  book: {
    data: {},
    error: '',
    loading: false,
  } as IActionBook,
  feeds: {
    data: [],
    error: '',
    loading: false,
  } as IAnyData,
  entries: {
    data: [],
    error: '',
    loading: false,
  } as IAnyData,
  updateFeed: {
    loading: false,
    success: false,
    error: '',
  } as IActionWithSuccess,
  deleteFeed: {
    loading: false,
    success: false,
    error: '',
  } as IActionWithSuccess,
  allReadersWithoutPagination: {
    data: [],
    error: '',
    loading: false,
  } as IAnyData,
};

export default (
  state = initialState,
  action: IReduxAction
): typeof initialState => {
  switch (action.type) {
    // Get All Readers
    case Types['ORGANIZER.GET_GROUP_READERS_REQUEST']: {
      const { groupId } = action.payload;
      return {
        ...state,
        readers: merge(state.readers, {
          [groupId]: {
            loading: true,
            error: '',
          },
        }),
      };
    }
    case Types['ORGANIZER.GET_GROUP_READERS_SUCCESS']: {
      const { data = [], groupId } = action.payload;
      return {
        ...state,
        readers: {
          ...state.readers,
          [groupId]: {
            loading: false,
            error: '',
            data,
          },
        },
      };
    }
    case Types['ORGANIZER.GET_GROUP_READERS_ERROR']: {
      const { error = '', groupId } = action.payload;
      return {
        ...state,
        readers: merge(state.readers, {
          [groupId]: {
            loading: false,
            error,
          },
        }),
      };
    }

    // Delete reader from group
    case Types['ORGANIZER.DELETE_READER_REQUEST']: {
      const { readerId } = action.payload;
      return {
        ...state,
        deleteReader: {
          ...state.deleteReader,
          [readerId]: {
            loading: true,
            error: '',
            status: '',
          },
        },
      };
    }
    case Types['ORGANIZER.DELETE_READER_SUCCESS']: {
      const { readerId, groupId } = action.payload;

      const readers = idx(state, x => x.readers[groupId].data);
      const pos = findIndex(readers, { id: readerId });
      readers.splice(pos, 1);
      const newReaders = [...readers];

      return {
        ...state,
        readers: merge(state.readers, {
          [groupId]: {
            data: newReaders,
          },
        }),
        deleteReader: {
          ...state.deleteReader,
          [readerId]: {
            loading: false,
            error: '',
          },
        },
      };
    }
    case Types['ORGANIZER.DELETE_BULK_READER_REQUEST']: {
      return {
        ...state,
        deleteBulkReader: {
          loading: true,
          error: '',
        },
      };
    }
    case Types['ORGANIZER.DELETE_BULK_READER_SUCCESS']: {
      return {
        ...state,
        deleteBulkReader: {
          loading: false,
          error: '',
        },
      };
    }
    case Types['ORGANIZER.DELETE_BULK_READER_ERROR']: {
      const { error } = action.payload;
      return {
        ...state,
        deleteBulkReader: {
          loading: false,
          error,
        },
      };
    }
    case Types['ORGANIZER.DELETE_READER_ERROR']: {
      const { readerId, error } = action.payload;
      return {
        ...state,
        deleteReader: {
          ...state.deleteReader,
          [readerId]: {
            loading: false,
            error,
            status: 'error',
          },
        },
      };
    }
    // Get All Readers
    case Types['ORGANIZER.GET_READERS_REQUEST']: {
      return {
        ...state,
        allReaders: {
          ...state.allReaders,
          error: '',
          loading: true,
        },
      };
    }
    case Types['ORGANIZER.GET_READERS_SUCCESS']: {
      return {
        ...state,
        allReaders: {
          data: action.payload,
          error: '',
          loading: false,
        },
      };
    }
    case Types['ORGANIZER.GET_READERS_LOAD_MORE_SUCCESS']: {
      return {
        ...state,
        allReaders: {
          data: {
            ...action.payload,
            data: concat(state.allReaders.data.data, action.payload.data),
          },
          error: '',
          loading: false,
        },
      };
    }
    case Types['ORGANIZER.GET_READERS_ERROR']: {
      return {
        ...state,
        allReaders: {
          ...state.allReaders,
          loading: false,
          error: action.payload,
        },
      };
    }

    // Get search Readers
    case Types['ORGANIZER.GET_SEARCH_READERS_REQUEST']: {
      return {
        ...state,
        searchReaders: {
          ...state.searchReaders,
          error: '',
          loading: true,
        },
      };
    }
    case Types['ORGANIZER.GET_SEARCH_READERS_SUCCESS']: {
      return {
        ...state,
        searchReaders: {
          data: action.payload,
          error: '',
          loading: false,
        },
      };
    }
    case Types['ORGANIZER.GET_SEARCH_READERS_ERROR']: {
      return {
        ...state,
        searchReaders: {
          ...state.searchReaders,
          loading: false,
          error: action.payload,
        },
      };
    }
    // Get Reader
    case Types['ORGANIZER.GET_READER_REQUEST']: {
      return {
        ...state,
        reader: {
          ...state.reader,
          error: '',
          loading: true,
        },
      };
    }
    case Types['ORGANIZER.GET_READER_SUCCESS']: {
      return {
        ...state,
        reader: {
          data: action.payload,
          error: '',
          loading: false,
        },
      };
    }
    case Types['ORGANIZER.GET_READER_ERROR']: {
      return {
        ...state,
        reader: {
          ...state.reader,
          loading: false,
          error: action.payload,
        },
      };
    }

    // Get Reader Detail
    case Types['ORGANIZER.GET_READER_DETAIL_REQUEST']: {
      return {
        ...state,
        readerDetail: {
          ...state.readerDetail,
          error: '',
          loading: true,
        },
      };
    }
    case Types['ORGANIZER.GET_READER_DETAIL_SUCCESS']: {
      return {
        ...state,
        readerDetail: {
          data: action.payload,
          error: '',
          loading: false,
        },
      };
    }
    case Types['ORGANIZER.GET_READER_DETAIL_ERROR']: {
      return {
        ...state,
        readerDetail: {
          ...state.readerDetail,
          loading: false,
          error: action.payload,
        },
      };
    }

    // Get Reader Metrics
    case Types['ORGANIZER.GET_READER_METRICS_REQUEST']: {
      return {
        ...state,
        readerMetrics: {
          ...state.readerMetrics,
          error: '',
          loading: true,
        },
      };
    }
    case Types['ORGANIZER.GET_READER_METRICS_SUCCESS']: {
      return {
        ...state,
        readerMetrics: {
          data: action.payload,
          error: '',
          loading: false,
        },
      };
    }
    case Types['ORGANIZER.GET_READER_METRICS_ERROR']: {
      return {
        ...state,
        readerMetrics: {
          data: {},
          loading: false,
          error: action.payload,
        },
      };
    }

    // Get Reader Notes
    case Types['ORGANIZER.GET_READER_NOTES_REQUEST']: {
      return {
        ...state,
        reader: {
          ...state.reader,
          error: '',
          loading: true,
        },
      };
    }
    case Types['ORGANIZER.GET_READER_NOTES_SUCCESS']: {
      return {
        ...state,
        reader: {
          data: {
            ...state.reader.data,
            notes: action.payload,
          },
          error: '',
          loading: false,
        },
      };
    }
    case Types['ORGANIZER.GET_READER_NOTES_ERROR']: {
      return {
        ...state,
        reader: {
          ...state.reader,
          loading: false,
          error: action.payload,
        },
      };
    }

    // Add Readers
    case Types['ORGANIZER.ADD_READERS_REQUEST']: {
      return {
        ...state,
        addReader: {
          error: '',
          loading: true,
        },
      };
    }
    case Types['ORGANIZER.ADD_READERS_SUCCESS']: {
      return {
        ...state,
        addReader: {
          error: '',
          loading: false,
        },
      };
    }
    case Types['ORGANIZER.ADD_READERS_ERROR']: {
      return {
        ...state,
        addReader: {
          loading: false,
          error: action.payload,
        },
      };
    }
    // Assign Readers
    case Types['ORGANIZER.ASSIGN_READERS_REQUEST']: {
      return {
        ...state,
        assignReader: {
          error: '',
          loading: true,
        },
      };
    }
    case Types['ORGANIZER.ASSIGN_READERS_SUCCESS']: {
      return {
        ...state,
        assignReader: {
          error: '',
          loading: false,
        },
      };
    }
    case Types['ORGANIZER.ASSIGN_READERS_ERROR']: {
      return {
        ...state,
        assignReader: {
          loading: false,
          error: action.payload,
        },
      };
    }

    // Update Reader
    case Types['ORGANIZER.UPDATE_READER_REQUEST']: {
      return {
        ...state,
        updateReader: {
          [action.payload.id]: {
            status: '',
            error: null,
            loading: true,
          },
        },
      };
    }
    case Types['ORGANIZER.UPDATE_READER_SUCCESS']: {
      const { updatedReader, id } = action.payload;
      const allReaders = cloneDeep(state.allReaders);
      const allReaderItems = map(allReaders.data.data, item => {
        return item.user_id === id ? { ...item, ...updatedReader } : item;
      });

      return {
        ...state,
        allReaders: {
          ...state.allReaders,
          data: {
            ...state.allReaders.data,
            data: allReaderItems,
          },
        },
        updateReader: {
          [action.payload.id]: {
            status: 'success',
            error: null,
            loading: false,
          },
        },
      };
    }
    case Types['ORGANIZER.UPDATE_READER_ERROR']: {
      return {
        ...state,
        updateReader: {
          [action.payload.id]: {
            status: 'error',
            error: action.payload,
            loading: false,
          },
        },
      };
    }

    // Add Reader Note
    case Types['ORGANIZER.ADD_READER_NOTE_REQUEST']: {
      return {
        ...state,
        addReaderNote: {
          error: '',
          loading: true,
        },
      };
    }
    case Types['ORGANIZER.ADD_READER_NOTE_SUCCESS']: {
      return {
        ...state,
        addReaderNote: {
          error: '',
          loading: false,
        },
      };
    }
    case Types['ORGANIZER.ADD_READER_NOTE_ERROR']: {
      return {
        ...state,
        addReaderNote: {
          error: action.payload,
          loading: false,
        },
      };
    }

    // Delete All Reader Note
    case Types['ORGANIZER.DELETE_ALL_READER_NOTE_REQUEST']: {
      return {
        ...state,
        deleteAllReaderNote: {
          error: '',
          loading: true,
        },
      };
    }
    case Types['ORGANIZER.DELETE_ALL_READER_NOTE_SUCCESS']: {
      return {
        ...state,
        deleteAllReaderNote: {
          error: '',
          loading: false,
        },
      };
    }
    case Types['ORGANIZER.DELETE_ALL_READER_NOTE_ERROR']: {
      return {
        ...state,
        deleteAllReaderNote: {
          error: action.payload,
          loading: false,
        },
      };
    }
    // Add Book
    case Types['ORGANIZER.ADD_BOOK_REQUEST']: {
      return {
        ...state,
        addBook: {
          error: '',
          loading: true,
        },
      };
    }
    case Types['ORGANIZER.ADD_BOOK_SUCCESS']: {
      return {
        ...state,
        addBook: {
          error: '',
          loading: false,
        },
      };
    }
    case Types['ORGANIZER.ADD_BOOK_ERROR']: {
      return {
        ...state,
        addBook: {
          loading: false,
          error: action.payload,
        },
      };
    }
    // Finish Book
    case Types['ORGANIZER.FINISH_BOOK_REQUEST']: {
      return {
        ...state,
        finishBook: {
          error: '',
          loading: true,
        },
      };
    }
    case Types['ORGANIZER.FINISH_BOOK_SUCCESS']: {
      // remove book from books reading
      const booksReadingData = idx(state, x => x.booksReading.data);
      const newBooksReadingData = filter(
        booksReadingData,
        (item: IBookItem) => item.id !== action.payload
      );
      // add book from to books finished
      const newBookFinished = find(
        booksReadingData,
        (item: IBookItem) => item.id === action.payload
      );
      const newBooksFinishedData = [
        newBookFinished,
        ...idx(state, x => x.booksFinished.data),
      ];
      return {
        ...state,
        booksReading: {
          ...state.booksReading,
          data: newBooksReadingData,
        },
        booksFinished: {
          ...state.booksFinished,
          data: newBooksFinishedData,
        },
        finishBook: {
          error: '',
          loading: false,
        },
      };
    }
    case Types['ORGANIZER.FINISH_BOOK_ERROR']: {
      return {
        ...state,
        finishBook: {
          loading: false,
          error: action.payload,
        },
      };
    }
    // Re-Read Book
    case Types['ORGANIZER.REREAD_BOOK_REQUEST']: {
      return {
        ...state,
        reReadBook: {
          error: '',
          loading: true,
        },
      };
    }
    case Types['ORGANIZER.REREAD_BOOK_SUCCESS']: {
      // remove book from books reading
      const booksReadingData = idx(state, x => x.booksReading.data);
      const newBooksReadingData = booksReadingData.map(book => {
        if (book.id === action.payload) {
          book.read_count += 1;
        }
        return book;
      });
      return {
        ...state,
        booksReading: {
          ...state.booksReading,
          data: newBooksReadingData,
        },
        reReadBook: {
          error: '',
          loading: false,
        },
      };
    }
    case Types['ORGANIZER.REREAD_BOOK_ERROR']: {
      return {
        ...state,
        reReadBook: {
          loading: false,
          error: action.payload,
        },
      };
    }
    // Review Book
    case Types['ORGANIZER.REVIEW_BOOK_REQUEST']: {
      return {
        ...state,
        reviewBook: {
          error: '',
          loading: true,
        },
      };
    }
    case Types['ORGANIZER.REVIEW_BOOK_SUCCESS']: {
      return {
        ...state,
        reviewBook: {
          error: '',
          loading: false,
        },
      };
    }
    case Types['ORGANIZER.REVIEW_BOOK_ERROR']: {
      return {
        ...state,
        reviewBook: {
          loading: false,
          error: action.payload,
        },
      };
    }
    // Delete Book
    case Types['ORGANIZER.DELETE_BOOK_REQUEST']: {
      return {
        ...state,
        deleteBook: {
          error: '',
          loading: true,
        },
      };
    }
    case Types['ORGANIZER.DELETE_BOOK_SUCCESS']: {
      const booksReadingData = idx(state, x => x.booksReading.data);
      const newBooksReadingData = filter(
        booksReadingData,
        (item: IBookItem) => item.id !== action.payload
      );
      const booksFinishedData = idx(state, x => x.booksFinished.data);
      const newBooksFinishedData = filter(
        booksFinishedData,
        (item: IBookItem) => item.id !== action.payload
      );
      return {
        ...state,
        booksReading: {
          ...state.booksReading,
          data: newBooksReadingData,
        },
        booksFinished: {
          ...state.booksFinished,
          data: newBooksFinishedData,
        },
        deleteBook: {
          error: '',
          loading: false,
        },
      };
    }
    case Types['ORGANIZER.DELETE_BOOK_ERROR']: {
      return {
        ...state,
        deleteBook: {
          loading: false,
          error: action.payload,
        },
      };
    }
    // Books Reading
    case Types['ORGANIZER.GET_BOOKS_READING_REQUEST']: {
      return {
        ...state,
        booksReading: {
          ...state.booksReading,
          error: '',
          loading: true,
        },
      };
    }
    case Types['ORGANIZER.GET_BOOKS_READING_SUCCESS']: {
      return {
        ...state,
        booksReading: {
          data: action.payload,
          error: '',
          loading: false,
        },
      };
    }
    case Types['ORGANIZER.GET_BOOKS_READING_ERROR']: {
      return {
        ...state,
        booksReading: {
          ...state.booksReading,
          loading: false,
          error: action.payload,
        },
      };
    }
    case Types['ORGANIZER.ADD_BOOKS_READING']: {
      return {
        ...state,
        booksReading: {
          ...state.booksReading,
          data: [...state.booksReading.data, ...action.payload],
        },
      };
    }
    // Books Finished
    case Types['ORGANIZER.GET_BOOKS_FINISHED_REQUEST']: {
      return {
        ...state,
        booksFinished: {
          ...state.booksFinished,
          error: '',
          loading: true,
        },
      };
    }
    case Types['ORGANIZER.GET_BOOKS_FINISHED_SUCCESS']: {
      return {
        ...state,
        booksFinished: {
          data: action.payload,
          error: '',
          loading: false,
        },
      };
    }
    case Types['ORGANIZER.GET_BOOKS_FINISHED_ERROR']: {
      return {
        ...state,
        booksFinished: {
          ...state.booksFinished,
          loading: false,
          error: action.payload,
        },
      };
    }
    // Assign Readers
    case Types['ORGANIZER.GET_BOOK_REQUEST']: {
      return {
        ...state,
        book: {
          ...state.book,
          error: '',
          loading: true,
        },
      };
    }
    case Types['ORGANIZER.GET_BOOK_SUCCESS']: {
      return {
        ...state,
        book: {
          data: action.payload,
          error: '',
          loading: false,
        },
      };
    }
    case Types['ORGANIZER.GET_BOOK_ERROR']: {
      return {
        ...state,
        book: {
          ...state.book,
          loading: false,
          error: action.payload,
        },
      };
    }

    // All Readers
    case Types['ORGANIZER.GET_ALL_READERS_REQUEST']: {
      return {
        ...state,
        allReadersWithoutPagination: {
          ...state.allReadersWithoutPagination,
          error: '',
          loading: true,
        },
      };
    }
    case Types['ORGANIZER.GET_ALL_READERS_SUCCESS']: {
      return {
        ...state,
        allReadersWithoutPagination: {
          data: action.payload,
          error: '',
          loading: false,
        },
      };
    }
    case Types['ORGANIZER.GET_ALL_READERS_ERROR']: {
      return {
        ...state,
        allReadersWithoutPagination: {
          ...state.allReadersWithoutPagination,
          loading: false,
          error: action.payload,
        },
      };
    }

    // Reader Feeds
    case Types['ORGANIZER.GET_READER_FEEDS_REQUEST']: {
      return {
        ...state,
        feeds: {
          ...state.feeds,
          error: '',
          loading: true,
        },
      };
    }
    case Types['ORGANIZER.GET_READER_FEEDS_SUCCESS']: {
      return {
        ...state,
        feeds: {
          data: action.payload,
          error: '',
          loading: false,
        },
      };
    }
    case Types['ORGANIZER.GET_READER_FEEDS_ERROR']: {
      return {
        ...state,
        feeds: {
          ...state.feeds,
          loading: false,
          error: action.payload,
        },
      };
    }
    // Reader Entries
    case Types['ORGANIZER.GET_READER_ENTRIES_REQUEST']: {
      return {
        ...state,
        entries: {
          data: [],
          error: '',
          loading: true,
        },
      };
    }
    case Types['ORGANIZER.GET_READER_ENTRIES_SUCCESS']: {
      return {
        ...state,
        entries: {
          data: action.payload,
          error: '',
          loading: false,
        },
      };
    }
    case Types['ORGANIZER.GET_READER_ENTRIES_ERROR']: {
      return {
        ...state,
        entries: {
          data: [],
          loading: false,
          error: action.payload,
        },
      };
    }
    // Update Reader Feed
    case Types['ORGANIZER.UPDATE_READER_FEEDS_REQUEST']: {
      return {
        ...state,
        updateFeed: {
          loading: true,
          success: false,
          error: '',
        },
      };
    }
    case Types['ORGANIZER.UPDATE_READER_FEEDS_SUCCESS']: {
      const { feedId } = action.payload;
      const feedData = action.payload.data;
      const oldFeeds = [...state.feeds.data];
      const updateFeedIndex = findIndex(oldFeeds, { id: feedId });
      oldFeeds[updateFeedIndex] = {
        ...oldFeeds[updateFeedIndex],
        data: {
          ...oldFeeds[updateFeedIndex].data,
          message: feedData.message,
        },
      };
      return {
        ...state,
        updateFeed: {
          loading: false,
          success: true,
          error: '',
        },
        feeds: {
          ...state.feeds,
          data: oldFeeds,
        },
      };
    }
    case Types['ORGANIZER.UPDATE_READER_FEEDS_ERROR']: {
      return {
        ...state,
        updateFeed: {
          loading: false,
          success: false,
          error: action.payload,
        },
      };
    }
    // Delete Reader Feed
    case Types['ORGANIZER.DELETE_READER_FEEDS_REQUEST']: {
      return {
        ...state,
        deleteFeed: {
          loading: true,
          success: false,
          error: '',
        },
      };
    }
    case Types['ORGANIZER.DELETE_READER_FEEDS_SUCCESS']: {
      const feedId = action.payload;
      let oldFeeds = [...state.feeds.data];
      oldFeeds = oldFeeds.filter(feed => feed.id !== feedId);
      return {
        ...state,
        deleteFeed: {
          loading: false,
          success: true,
          error: '',
        },
        feeds: {
          ...state.feeds,
          data: oldFeeds,
        },
      };
    }
    case Types['ORGANIZER.DELETE_READER_FEEDS_ERROR']: {
      return {
        ...state,
        deleteFeed: {
          loading: false,
          success: false,
          error: action.payload,
        },
      };
    }

    default:
      return state;
  }
};
