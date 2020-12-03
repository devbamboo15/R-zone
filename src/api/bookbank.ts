import request from './request';
import { IDeleteBookData } from './reader';

export interface IAddBooksData {
  id: string | string[];
  group_id: string | number;
}

export async function searchBooks(searchText: string) {
  return request.call({
    url: 'https://www.googleapis.com/books/v1/volumes',
    method: 'GET',
    params: {
      q: searchText,
    },
    headers: {},
  });
}

export async function getUserBooks() {
  return request.call({
    url: '/me/book/',
    method: 'GET',
  });
}

export async function addUserBook(id: string) {
  return request.call({
    url: '/me/book/',
    method: 'POST',
    data: {
      id,
    },
  });
}

export async function finishUserBook(id: string) {
  return request.call({
    url: `/me/book/${id}`,
    method: 'PATCH',
    data: {
      completed: true,
      completed_at: true,
    },
  });
}

export async function finishUserBooks(
  bookId: string | string[],
  groupId: string,
  readerId?: string
) {
  const url = readerId ? `/user/${readerId}/book` : `/me/book`;
  return request.call({
    url,
    method: 'PATCH',
    data: {
      completed: true,
      completed_at: true,
      finished: true,
      group_id: groupId,
      book_id: bookId,
    },
  });
}

export async function addBooks(data: IAddBooksData, readerId?: string) {
  const url = readerId ? `/user/${readerId}/book` : `/me/book`;
  return request.call({
    url,
    method: 'POST',
    data,
  });
}

export async function removeUserBook(id: string, data?: IDeleteBookData) {
  return request.call({
    url: `/me/book/${id}`,
    method: 'DELETE',
    data,
  });
}
