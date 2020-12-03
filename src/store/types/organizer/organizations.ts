import createTypes from 'redux-create-action-types';

export default createTypes(
  'GET_USER_ORGANIZATIONS',
  'GET_USER_ORGANIZATIONS_SUCCESS',
  'GET_USER_ORGANIZATIONS_ERROR',

  'GET_ORGANIZATIONS_PROGRESS',
  'GET_ORGANIZATIONS_PROGRESS_SUCCESS',
  'GET_ORGANIZATIONS_PROGRESS_ERROR',

  'SET_USER_ORGANIZATION',
  'SET_USER_ORGANIZATION_ERROR'
);

export interface IOrganizetionProgress {
  pages: number;
  chapters: number;
  minutes: number;
  books: number;
  yes: number;
}
