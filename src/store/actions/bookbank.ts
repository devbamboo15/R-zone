import * as API from 'src/api';
import Types from '../types/bookbank';
import ReaderTypes from '../types/organizer/reader';

export const searchBooks = (searchText: string) => async (
  dispatch: CustomDispatch
) => {
  try {
    dispatch({ type: Types.SEARCH_BOOKS_REQUEST });
    const res = await API.searchBooks(searchText);
    dispatch({ type: Types.SEARCH_BOOKS_SUCCESS, payload: res.items });
  } catch (error) {
    dispatch({ type: Types.SEARCH_BOOKS_ERROR, payload: error });
  }
};

export const resetSearchBooks = () => async (dispatch: CustomDispatch) => {
  dispatch({ type: Types.SEARCH_BOOKS_RESET });
};

export const getUserBooks = (cb: () => any = () => {}) => async (
  dispatch: CustomDispatch
) => {
  try {
    dispatch({ type: Types.GET_USER_BOOKS_REQUEST });
    const res = await API.getUserBooks();
    dispatch({ type: Types.GET_USER_BOOKS_SUCCESS, payload: res.data });
    cb();
  } catch (error) {
    dispatch({ type: Types.GET_USER_BOOKS_ERROR, payload: error.message });
    cb();
  }
};

export const addUserBook = (id: string) => async (dispatch: CustomDispatch) => {
  try {
    dispatch({ type: Types.ADD_BOOK_REQUEST, payload: { id } });
    await API.addUserBook(id);
    dispatch({ type: Types.ADD_BOOK_SUCCESS, payload: { id } });
  } catch (error) {
    dispatch({
      type: Types.ADD_BOOK_ERROR,
      payload: { id, error: error.message },
    });
  }
};

export const finishUserBook = (id: string) => async (
  dispatch: CustomDispatch
) => {
  try {
    dispatch({ type: Types.FINISH_BOOK_REQUEST, payload: { id } });
    await API.finishUserBook(id);
    dispatch({ type: Types.FINISH_BOOK_SUCCESS, payload: { id } });
  } catch (error) {
    dispatch({
      type: Types.FINISH_BOOK_ERROR,
      payload: { id, error: error.message },
    });
  }
};

export const finishUserBooks = (
  bookId: string | string[],
  groupId: string,
  readerId?: string,
  cb?: Function
) => async (dispatch: CustomDispatch) => {
  try {
    dispatch({ type: Types.FINISH_BOOKS_REQUEST });
    await API.finishUserBooks(bookId, groupId, readerId);
    dispatch({ type: Types.FINISH_BOOKS_SUCCESS });
    if (cb) cb();
  } catch (error) {
    dispatch({
      type: Types.FINISH_BOOKS_ERROR,
      payload: error.message,
    });
  }
};

export const addBooks = (
  data: API.IAddBooksData,
  books: any[],
  readerId?: string,
  cb?: Function
) => async (dispatch: CustomDispatch) => {
  try {
    dispatch({ type: Types.ADD_BOOKS_REQUEST });
    await API.addBooks(data, readerId);
    dispatch({ type: Types.ADD_BOOKS_SUCCESS });
    dispatch({
      type: ReaderTypes['ORGANIZER.ADD_BOOKS_READING'],
      payload: books,
    });
    if (cb) cb();
  } catch (error) {
    dispatch({
      type: ReaderTypes['ORGANIZER.ADD_BOOKS_READING'],
      payload: books,
    });
    if (cb) cb();
    dispatch({
      type: Types.ADD_BOOKS_ERROR,
      payload: error.message,
    });
  }
};

export const removeUserBook = (
  id: string,
  data?: API.IDeleteBookData
) => async (dispatch: CustomDispatch) => {
  try {
    dispatch({ type: Types.REMOVE_BOOK_REQUEST, payload: { id } });
    await API.removeUserBook(id, data || {});
    dispatch({ type: Types.REMOVE_BOOK_SUCCESS, payload: { id } });
  } catch (error) {
    dispatch({
      type: Types.REMOVE_BOOK_ERROR,
      payload: { id, error: error.message },
    });
  }
};
