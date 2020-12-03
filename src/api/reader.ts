import { get } from 'lodash';
import request from './request';
import { IFilterParam } from '../store/types/organizer/reader';

export enum AddOrAssignReadersAction {
  assign = 'assign',
  reassign = 'reassign',
}
export interface IGetListReadersParam {
  organizationId: string;
  filter?: IFilterParam;
}
export interface ISearchReadersParam {
  organizationId: string;
  search?: string;
}
export interface IAddOrAssignReadersData {
  action: AddOrAssignReadersAction;
  reader_id: string[] | number[];
  group_id: string | number;
}

export interface IUpdateReaderData {
  organization_id: string | number;
  first_name: string;
  last_name: string;
  email: string;
  groups?: string[] | number[];
  programs?: string[] | number[];
  parent_data?: object;
  child_data?: any[];
  new_child_data?: any[];
}
export interface IAddReaderNoteData {
  note: string;
  user_id: string | number;
}

export interface IAddBookData {
  id: string | number;
  group_id: string | number;
}
export interface IReviewBookData {
  rating: number;
  review: string;
}
export interface IGetBooksData {
  completed_at?: string | null;
}
export interface IDeleteBookData {
  group_id?: number;
}
export async function getAllReadersWithoutPagination(organizationId: string) {
  return request.call({
    url: `/organization/${organizationId}/all-readers`,
    method: 'GET',
  });
}

export async function getListReaders(data: IGetListReadersParam) {
  const { organizationId, filter } = data;
  return request.call({
    url: `/organization/${organizationId}/readers`,
    method: 'GET',
    params: {
      ...filter,
    },
  });
}

export async function searchReaders(data: ISearchReadersParam) {
  const { organizationId, search } = data;
  return request.call({
    url: `/organization/${organizationId}/readers`,
    method: 'GET',
    params: {
      search,
    },
  });
}

export async function addOrAssignReaders(
  organizationId: string,
  data: IAddOrAssignReadersData
) {
  return request.call({
    url: `/organization/${organizationId}/readers/manage`,
    method: 'POST',
    data,
  });
}

export async function getReader(readerId: string | number, groupId?: string) {
  return request.call({
    url: `/user/${readerId}`,
    method: 'GET',
    params: {
      include: 'trophies,notes,readerProgress,childs,goals',
      group_id: groupId,
    },
  });
}

export async function getReaderMetrics(
  readerId: string | number,
  groupId?: string,
  interval?: string
) {
  return request.call({
    url: `/user/${readerId}/metrics`,
    method: 'GET',
    params: {
      interval,
      group_id: groupId,
    },
  });
}

export async function getReaderDetail(
  readerId: string | number,
  organizationId: string | number
) {
  return request.call({
    url: `/user/${readerId}/detail`,
    method: 'GET',
    params: {
      organization_id: organizationId,
    },
  });
}

export async function getReaderNotes(readerId: string | number) {
  return request.call({
    url: `/user/notes`,
    method: 'GET',
    params: {
      user_id: readerId,
    },
  });
}
export async function updateReader(
  readerId: string | number,
  data: IUpdateReaderData
) {
  return request.call({
    url: `/user/${readerId}`,
    method: 'PATCH',
    data,
  });
}

export async function addReaderNote(data: IAddReaderNoteData) {
  return request.call({
    url: `/user/notes`,
    method: 'POST',
    data,
  });
}

export async function deleteAllReaderNote(id: string | number) {
  return request.call({
    url: `/user/notes`,
    method: 'DELETE',
    params: {
      user_id: id,
      notes: [],
    },
  });
}

export async function finishBook(readerId: string | number, book: any) {
  return request.call({
    url: `/user/${readerId}/book/${get(book, 'id')}`,
    method: 'PATCH',
    data: {
      finished: 1,
      group_id: get(book, 'group_id'),
    },
  });
}

export async function reReadBook(readerId: string | number, book: any) {
  return request.call({
    url: `/user/${readerId}/book/${get(book, 'id')}/reread`,
    method: 'PATCH',
    data: {
      completed: true,
      group_id: get(book, 'group_id'),
      read_once: false,
    },
  });
}

export async function addBook(readerId: string | number, data: IAddBookData) {
  return request.call({
    url: `/user/${readerId}/book/`,
    method: 'POST',
    data,
  });
}

export async function getBook(
  readerId: string | number,
  bookId: string | number
) {
  return request.call({
    url: `/user/${readerId}/book/${bookId}`,
    method: 'GET',
    params: {
      include: 'reviews',
    },
  });
}

export async function deleteBook(
  readerId: string | number,
  bookId: string | number,
  data?: IDeleteBookData
) {
  return request.call({
    url: `/user/${readerId}/book/${bookId}`,
    method: 'DELETE',
    data,
  });
}

export async function reviewBook(
  readerId: string | number,
  bookId: string | number,
  data: IReviewBookData
) {
  return request.call({
    url: `/user/${readerId}/book/${bookId}/review`,
    method: 'POST',
    data,
  });
}

export async function getBooks(id: string | number) {
  return request.call({
    url: `/user/${id}/book`,
    method: 'GET',
  });
}
export async function getReaderFeeds(userId: string, filter: any) {
  return request.call({
    url: `/user/${userId}/progress`,
    method: 'GET',
    params: {
      ...filter,
    },
  });
}
export async function getReaderEntries(userId: string, groupId: string) {
  return request.call({
    url: `/user/${userId}/entries?group_id=${groupId}`,
    method: 'GET',
  });
}
export async function updateReaderFeed(feedId: string, data: any) {
  return request.call({
    url: `/activity/${feedId}`,
    method: 'PATCH',
    data,
  });
}
export async function deleteReaderFeed(feedId: string) {
  return request.call({
    url: `/activity/${feedId}`,
    method: 'DELETE',
  });
}

export async function deleteBulkReader(readerIds: number[]) {
  return request.call({
    url: `/user`,
    method: 'DELETE',
    data: {
      user_ids: readerIds,
    },
  });
}
