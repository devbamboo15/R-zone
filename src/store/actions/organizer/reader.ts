import idx from 'idx';
import { filter, omit, find, get, map, pick } from 'lodash';
import * as Api from 'src/api';
import toast from 'src/helpers/Toast';
import Types, { IFilterParam } from 'src/store/types/organizer/reader';
import {
  IGroupReader,
  ILastEntryItem,
  IReaderProgress,
} from 'src/store/types/common';
import {
  IAddOrAssignReadersData,
  IUpdateReaderData,
  IAddReaderNoteData,
  IAddBookData,
  IReviewBookData,
} from 'src/api/reader';
import { IBookItem } from 'src/store/types';
import { IReduxState } from '../../reducers';

export const getAllReaders = (param: {
  programId: string;
  groupId: string;
  order?: string;
}) => async (dispatch: CustomDispatch, getState: () => IReduxState) => {
  const organizationId = idx(
    getState(),
    x => x.auth.profile.data.relationships.organization.data.id
  );
  if (organizationId) {
    try {
      dispatch({
        type: Types['ORGANIZER.GET_GROUP_READERS_REQUEST'],
        payload: {
          groupId: param.groupId,
        },
      });
      const res = await Api.getAllReaders({
        organizationId,
        programId: param.programId,
        groupId: param.groupId,
        order: param.order,
      });
      const included: any = idx(res, x => x.included) || [];
      let users: IGroupReader[] = filter(included, { type: 'user' });
      users = users.map(user => {
        const lastEntry: ILastEntryItem = find(included, {
          type: 'last_entry',
          attributes: { user_id: Number(user.id) },
        });
        const progress: IReaderProgress = find(included, {
          type: 'readerProgress',
          id: user.id,
        });
        user = {
          ...user,
          lastEntry,
          progress,
        };
        return user;
      });
      dispatch({
        type: Types['ORGANIZER.GET_GROUP_READERS_SUCCESS'],
        payload: {
          groupId: param.groupId,
          data: users,
        },
      });
    } catch (error) {
      dispatch({
        type: Types['ORGANIZER.GET_GROUP_READERS_ERROR'],
        payload: {
          groupId: param.groupId,
          error: error.message,
        },
      });
    }
  } else {
    toast.error('organizationId not found');
  }
};

export const deleteBulkReader = (readerIds: number[], cb?: any) => async (
  dispatch: CustomDispatch
) => {
  try {
    dispatch({ type: Types['ORGANIZER.DELETE_BULK_READER_REQUEST'] });
    const response = await Api.deleteBulkReader(readerIds);
    dispatch({
      type: Types['ORGANIZER.DELETE_BULK_READER_SUCCESS'],
      payload: [],
    });
    toast.success(
      `${response.deleted} Reader${
        response.deleted > 1 ? 's' : ''
      } Deleted Successfully`
    );
    if (cb) cb();
  } catch (error) {
    dispatch({
      type: Types['ORGANIZER.DELETE_BULK_READER_ERROR'],
      payload: { error: error.message },
    });
  }
};

export const deleteGroupReader = (
  readerId: string,
  goalId: string,
  groupId: string
) => async (dispatch: CustomDispatch) => {
  try {
    dispatch({
      type: Types['ORGANIZER.DELETE_READER_REQUEST'],
      payload: { goalId, readerId, groupId },
    });
    await Api.deleteGroupReader(readerId, goalId);
    dispatch({
      type: Types['ORGANIZER.DELETE_READER_SUCCESS'],
      payload: { goalId, readerId, groupId },
    });
  } catch (error) {
    dispatch({
      type: Types['ORGANIZER.DELETE_READER_ERROR'],
      payload: { goalId, readerId, groupId, error: error.message },
    });
  }
};
export const updateReader = (
  id: string | number,
  data: IUpdateReaderData,
  cb?: Function,
  notGetReader?: boolean
) => async (dispatch: CustomDispatch, getState: () => IReduxState) => {
  const organizationId = idx(
    getState(),
    x => x.auth.profile.data.relationships.organization.data.id
  );
  if (organizationId) {
    try {
      dispatch({
        type: Types['ORGANIZER.UPDATE_READER_REQUEST'],
        payload: { id },
      });
      await Api.updateReader(id, {
        ...data,
        organization_id: organizationId,
      });
      if (!notGetReader) {
        dispatch(getReader(id));
      }

      /** We need to update detail of reader in list all readers */
      const readerDetail = await Api.getReaderDetail(id, organizationId);
      const updatedReader = {
        ...data,
        program: map(readerDetail.program_group, item => ({
          id: item.program_id,
          name: item.program_name,
        })),
        group: map(readerDetail.program_group, item => ({
          id: item.group_id,
          name: item.group_name,
          program_id: item.program_id,
        })),
      };
      /** end update information */

      dispatch({
        type: Types['ORGANIZER.UPDATE_READER_SUCCESS'],
        payload: { id, updatedReader },
      });
      toast.success('Updated Reader Successfully');
      if (cb) cb();
    } catch (error) {
      dispatch({
        type: Types['ORGANIZER.UPDATE_READER_ERROR'],
        payload: {
          id,
          error: error.message,
        },
      });
    }
  } else {
    toast.error('organizationId not found');
  }
};
export const getReader = (id: string | number) => async (
  dispatch: CustomDispatch,
  getState: () => IReduxState
) => {
  const organizationId = idx(
    getState(),
    x => x.auth.profile.data.relationships.organization.data.id
  );
  if (organizationId) {
    try {
      dispatch({
        type: Types['ORGANIZER.GET_READER_REQUEST'],
      });
      const res = await Api.getReaderDetail(id, organizationId);
      dispatch({
        type: Types['ORGANIZER.GET_READER_SUCCESS'],
        payload: res,
      });
    } catch (error) {
      dispatch({
        type: Types['ORGANIZER.GET_READER_ERROR'],
        payload: error.message,
      });
    }
  }
};
export const getReaderDetail = (
  id: string | number,
  groupId?: string
) => async (dispatch: CustomDispatch) => {
  try {
    dispatch({
      type: Types['ORGANIZER.GET_READER_DETAIL_REQUEST'],
    });
    const res = await Api.getReader(id, groupId);
    dispatch({
      type: Types['ORGANIZER.GET_READER_DETAIL_SUCCESS'],
      payload: res,
    });
  } catch (error) {
    dispatch({
      type: Types['ORGANIZER.GET_READER_DETAIL_ERROR'],
      payload: error.message,
    });
  }
};
export const getReaderMetrics = (
  id: string | number,
  groupId?: string,
  interval?: string
) => async (dispatch: CustomDispatch) => {
  try {
    dispatch({
      type: Types['ORGANIZER.GET_READER_METRICS_REQUEST'],
    });
    const res = await Api.getReaderMetrics(id, groupId, interval);
    dispatch({
      type: Types['ORGANIZER.GET_READER_METRICS_SUCCESS'],
      payload: get(res, 'data') || {},
    });
  } catch (error) {
    dispatch({
      type: Types['ORGANIZER.GET_READER_METRICS_ERROR'],
      payload: error.message,
    });
  }
};
export const getReaderNotes = (id: string | number) => async (
  dispatch: CustomDispatch
) => {
  try {
    dispatch({
      type: Types['ORGANIZER.GET_READER_NOTES_REQUEST'],
    });
    const res = await Api.getReaderNotes(id);
    const notes = map(res.data, (note: any) => ({
      id: note.id,
      ...get(note, 'attributes'),
    }));
    dispatch({
      type: Types['ORGANIZER.GET_READER_NOTES_SUCCESS'],
      payload: notes,
    });
  } catch (error) {
    dispatch({
      type: Types['ORGANIZER.GET_READER_NOTES_ERROR'],
      payload: error.message,
    });
  }
};
export const addReaderNote = (
  data: IAddReaderNoteData,
  cb?: Function
) => async (dispatch: CustomDispatch) => {
  try {
    dispatch({
      type: Types['ORGANIZER.ADD_READER_NOTE_REQUEST'],
    });
    await Api.addReaderNote(data);
    dispatch({
      type: Types['ORGANIZER.ADD_READER_NOTE_SUCCESS'],
    });
    dispatch(getReaderNotes(data.user_id));
    toast.success('Add Note Successfully');
    if (cb) cb();
  } catch (error) {
    dispatch({
      type: Types['ORGANIZER.ADD_READER_NOTE_ERROR'],
      payload: error.message,
    });
  }
};
export const deleteAllReaderNote = (
  id: string | number,
  cb?: Function
) => async (dispatch: CustomDispatch) => {
  try {
    dispatch({
      type: Types['ORGANIZER.DELETE_ALL_READER_NOTE_REQUEST'],
    });
    await Api.deleteAllReaderNote(id);
    dispatch({
      type: Types['ORGANIZER.DELETE_ALL_READER_NOTE_SUCCESS'],
    });
    dispatch(getReaderNotes(id));
    toast.success('Delete All Notes Successfully');
    if (cb) cb();
  } catch (error) {
    dispatch({
      type: Types['ORGANIZER.DELETE_ALL_READER_NOTE_ERROR'],
      payload: error.message,
    });
  }
};
export const getListReaders = (param?: IFilterParam, cb?: any) => async (
  dispatch: CustomDispatch,
  getState: () => IReduxState
) => {
  const organizationId = idx(
    getState(),
    x => x.auth.profile.data.relationships.organization.data.id
  );
  if (organizationId) {
    try {
      dispatch({ type: Types['ORGANIZER.GET_READERS_REQUEST'] });
      const res = await Api.getListReaders({
        organizationId,
        filter: omit(param, ['isMore']),
      });
      if (get(param, 'isMore')) {
        dispatch({
          type: Types['ORGANIZER.GET_READERS_LOAD_MORE_SUCCESS'],
          payload: res,
        });
      } else {
        dispatch({
          type: Types['ORGANIZER.GET_READERS_SUCCESS'],
          payload: res,
        });
      }
      if (cb) cb();
    } catch (error) {
      dispatch({
        type: Types['ORGANIZER.GET_READERS_ERROR'],
        payload: error.message,
      });
    }
  } else {
    toast.error('organizationId not found');
  }
};

export const searchReaders = (searchText: string) => async (
  dispatch: CustomDispatch,
  getState: () => IReduxState
) => {
  const organizationId = idx(
    getState(),
    x => x.auth.profile.data.relationships.organization.data.id
  );
  if (organizationId) {
    try {
      dispatch({ type: Types['ORGANIZER.GET_SEARCH_READERS_REQUEST'] });
      const res = await Api.searchReaders({
        organizationId,
        search: searchText,
      });
      dispatch({
        type: Types['ORGANIZER.GET_SEARCH_READERS_SUCCESS'],
        payload: res.data || [],
      });
    } catch (error) {
      dispatch({
        type: Types['ORGANIZER.GET_SEARCH_READERS_ERROR'],
        payload: error.message,
      });
    }
  } else {
    toast.error('organizationId not found');
  }
};

export const addReaders = (
  data: IAddOrAssignReadersData,
  cb?: Function
) => async (dispatch: CustomDispatch, getState: () => IReduxState) => {
  const organizationId = idx(
    getState(),
    x => x.auth.profile.data.relationships.organization.data.id
  );
  if (organizationId) {
    try {
      dispatch({ type: Types['ORGANIZER.ADD_READERS_REQUEST'] });
      await Api.addOrAssignReaders(organizationId, data);
      dispatch({
        type: Types['ORGANIZER.ADD_READERS_SUCCESS'],
      });
      toast.success('Add Readers Successfully');
      if (cb) cb();
    } catch (error) {
      dispatch({
        type: Types['ORGANIZER.ADD_READERS_ERROR'],
        payload: error.message,
      });
      toast.error(error.message);
    }
  } else {
    toast.error('organizationId not found');
  }
};

export const assignReaders = (
  data: IAddOrAssignReadersData,
  cb?: Function
) => async (dispatch: CustomDispatch, getState: () => IReduxState) => {
  const organizationId = idx(
    getState(),
    x => x.auth.profile.data.relationships.organization.data.id
  );
  if (organizationId) {
    try {
      dispatch({ type: Types['ORGANIZER.ASSIGN_READERS_REQUEST'] });
      await Api.addOrAssignReaders(organizationId, data);
      dispatch({
        type: Types['ORGANIZER.ASSIGN_READERS_SUCCESS'],
      });
      toast.success('Move Readers Successfully');
      if (cb) cb();
    } catch (error) {
      dispatch({
        type: Types['ORGANIZER.ASSIGN_READERS_ERROR'],
        payload: error.message,
      });
      toast.error(error.message);
    }
  } else {
    toast.error('organizationId not found');
  }
};

export const addBook = (
  readerId: string | number,
  data: IAddBookData & { book: IBookItem },
  cb?: Function
) => async (dispatch: CustomDispatch) => {
  try {
    dispatch({ type: Types['ORGANIZER.ADD_BOOK_REQUEST'] });
    await Api.addBook(readerId, pick(data, [
      'id',
      'group_id',
      'read_once',
    ]) as IAddBookData);
    dispatch({
      type: Types['ORGANIZER.ADD_BOOK_SUCCESS'],
    });
    dispatch(getBooksReading(readerId));
    toast.success('Add Book Successfully');
    if (cb) cb();
  } catch (error) {
    dispatch({
      type: Types['ORGANIZER.ADD_BOOK_ERROR'],
      payload: error.message,
    });
    toast.error(error.message);
  }
};
export const deleteBook = (
  readerId: string | number,
  bookId: string | number,
  data?: Api.IDeleteBookData,
  cb?: Function
) => async (dispatch: CustomDispatch) => {
  try {
    dispatch({ type: Types['ORGANIZER.DELETE_BOOK_REQUEST'] });
    await Api.deleteBook(readerId, bookId, data || {});
    dispatch({
      type: Types['ORGANIZER.DELETE_BOOK_SUCCESS'],
      payload: bookId,
    });
    toast.success('Remove Book Successfully');
    if (cb) cb();
  } catch (error) {
    dispatch({
      type: Types['ORGANIZER.DELETE_BOOK_ERROR'],
      payload: error.message,
    });
  }
};
export const getBook = (
  readerId: string | number,
  bookId: string | number
) => async (dispatch: CustomDispatch) => {
  try {
    dispatch({ type: Types['ORGANIZER.GET_BOOK_REQUEST'] });
    const res = await Api.getBook(readerId, bookId);
    dispatch({
      type: Types['ORGANIZER.GET_BOOK_SUCCESS'],
      payload: res,
    });
  } catch (error) {
    dispatch({
      type: Types['ORGANIZER.GET_BOOK_ERROR'],
      payload: error.message,
    });
    toast.error(error.message);
  }
};
export const reviewBook = (
  readerId: string | number,
  bookId: string | number,
  data: IReviewBookData,
  cb?: Function
) => async (dispatch: CustomDispatch) => {
  try {
    dispatch({ type: Types['ORGANIZER.REVIEW_BOOK_REQUEST'] });
    await Api.reviewBook(readerId, bookId, data);
    dispatch({
      type: Types['ORGANIZER.REVIEW_BOOK_SUCCESS'],
    });
    toast.success('Review Book Successfully');
    if (cb) cb();
  } catch (error) {
    dispatch({
      type: Types['ORGANIZER.REVIEW_BOOK_ERROR'],
      payload: error.message,
    });
    toast.error(error.message);
  }
};

export const finishBook = (
  readerId: string | number,
  book: any,
  cb?: Function
) => async (dispatch: CustomDispatch) => {
  try {
    dispatch({ type: Types['ORGANIZER.FINISH_BOOK_REQUEST'] });
    await Api.finishBook(readerId, book);
    dispatch({
      type: Types['ORGANIZER.FINISH_BOOK_SUCCESS'],
      payload: get(book, 'id'),
    });
    toast.success('Finish Book Successfully');
    if (cb) cb();
  } catch (error) {
    dispatch({
      type: Types['ORGANIZER.FINISH_BOOK_ERROR'],
      payload: error.message,
    });
    toast.error(error.message);
  }
};

export const reReadBook = (
  readerId: string | number,
  book: any,
  cb?: Function
) => async (dispatch: CustomDispatch) => {
  try {
    dispatch({ type: Types['ORGANIZER.REREAD_BOOK_REQUEST'] });
    await Api.reReadBook(readerId, book);
    dispatch({
      type: Types['ORGANIZER.REREAD_BOOK_SUCCESS'],
      payload: get(book, 'id'),
    });
    toast.success('Re-Read Book Successfully');
    if (cb) cb();
  } catch (error) {
    dispatch({
      type: Types['ORGANIZER.REREAD_BOOK_ERROR'],
      payload: error.message,
    });
    toast.error(error.message);
  }
};

export const getBooksReading = (id?: string | number) => async (
  dispatch: CustomDispatch
) => {
  try {
    dispatch({ type: Types['ORGANIZER.GET_BOOKS_READING_REQUEST'] });
    const res = await (id ? Api.getBooks(id) : Api.getUserBooks());
    const books = [];

    filter(
      res.data,
      (item: any) => !get(item, 'attributes.pivot.finished_at')
    ).forEach((item: any) => {
      books.push({
        ...idx(item, x => x.attributes.data || {}),
        read_once: get(item, 'attributes.read_once'),
        group_id: get(item, 'attributes.group_id'),
        read_count: get(item, 'attributes.read_count'),
      });
    });

    dispatch({
      type: Types['ORGANIZER.GET_BOOKS_READING_SUCCESS'],
      payload: books,
    });
  } catch (error) {
    dispatch({
      type: Types['ORGANIZER.GET_BOOKS_READING_ERROR'],
      payload: error.message,
    });
    toast.error(error.message);
  }
};

export const getBooksFinished = (id: string | number) => async (
  dispatch: CustomDispatch
) => {
  try {
    dispatch({ type: Types['ORGANIZER.GET_BOOKS_FINISHED_REQUEST'] });
    const res = await Api.getBooks(id);
    const books = [];
    filter(res.data, (item: any) =>
      get(item, 'attributes.pivot.finished_at')
    ).forEach((item: any) => {
      books.push({
        ...idx(item, x => x.attributes.data || {}),
        group_id: get(item, 'attributes.group_id'),
      });
    });
    dispatch({
      type: Types['ORGANIZER.GET_BOOKS_FINISHED_SUCCESS'],
      payload: books,
    });
  } catch (error) {
    dispatch({
      type: Types['ORGANIZER.GET_BOOKS_FINISHED_ERROR'],
      payload: error.message,
    });
    toast.error(error.message);
  }
};

export const getAllReadersWithoutPagination = () => async (
  dispatch: CustomDispatch,
  getState: () => IReduxState
) => {
  try {
    const organizationId = idx(
      getState(),
      x => x.auth.profile.data.relationships.organization.data.id
    );

    dispatch({ type: Types['ORGANIZER.GET_ALL_READERS_REQUEST'] });
    const res = await Api.getAllReadersWithoutPagination(organizationId);
    const readers = (res || []).map(r => ({
      ...r,
      group: (r.group || []).map(g => g.toString()),
    }));
    dispatch({
      type: Types['ORGANIZER.GET_ALL_READERS_SUCCESS'],
      payload: readers,
    });
  } catch (error) {
    dispatch({
      type: Types['ORGANIZER.GET_ALL_READERS_ERROR'],
      payload: error.message,
    });
  }
};

export const getReaderFeeds = (readerId: string, filterParams?: any) => async (
  dispatch: CustomDispatch
) => {
  try {
    dispatch({ type: Types['ORGANIZER.GET_READER_FEEDS_REQUEST'] });
    const res = await Api.getReaderFeeds(readerId, filterParams);
    const resData = get(res, 'data') || [];
    const progressData = resData ? resData[0] : {};
    const feeds = get(progressData, 'user_activities') || [];
    dispatch({
      type: Types['ORGANIZER.GET_READER_FEEDS_SUCCESS'],
      payload: feeds,
    });
  } catch (error) {
    dispatch({
      type: Types['ORGANIZER.GET_READER_FEEDS_ERROR'],
      payload: error.message,
    });
  }
};
export const getReaderEntires = (readerId: string, groupId: string) => async (
  dispatch: CustomDispatch
) => {
  try {
    dispatch({ type: Types['ORGANIZER.GET_READER_ENTRIES_REQUEST'] });
    const res = await Api.getReaderEntries(readerId, groupId);
    const payload = res.data || [];
    dispatch({
      type: Types['ORGANIZER.GET_READER_ENTRIES_SUCCESS'],
      payload,
    });
  } catch (error) {
    dispatch({
      type: Types['ORGANIZER.GET_READER_ENTRIES_ERROR'],
      payload: error.message,
    });
  }
};
export const updateReaderFeed = (feedId: string, data: any, cb?: any) => async (
  dispatch: CustomDispatch
) => {
  try {
    dispatch({ type: Types['ORGANIZER.UPDATE_READER_FEEDS_REQUEST'] });
    await Api.updateReaderFeed(feedId, data);
    dispatch({
      type: Types['ORGANIZER.UPDATE_READER_FEEDS_SUCCESS'],
      payload: {
        feedId,
        data,
      },
    });
    toast.success('Updated Reader Feed Successfully');
    if (cb) cb();
  } catch (error) {
    dispatch({
      type: Types['ORGANIZER.UPDATE_READER_FEEDS_ERROR'],
      payload: error.message,
    });
    toast.error(error.message);
  }
};
export const deleteReaderFeed = (feedId: string, cb?: any) => async (
  dispatch: CustomDispatch
) => {
  try {
    dispatch({ type: Types['ORGANIZER.DELETE_READER_FEEDS_REQUEST'] });
    await Api.deleteReaderFeed(feedId);
    dispatch({
      type: Types['ORGANIZER.DELETE_READER_FEEDS_SUCCESS'],
      payload: feedId,
    });
    toast.success('Deleted Reader Feed Successfully');
    if (cb) cb();
  } catch (error) {
    dispatch({
      type: Types['ORGANIZER.DELETE_READER_FEEDS_ERROR'],
      payload: error.message,
    });
    toast.error(error.message);
  }
};
