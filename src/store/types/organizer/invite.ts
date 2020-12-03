import createTypes from 'redux-create-action-types';

export default createTypes(
  // Invite readers
  'SEND_INVITE_READERS',
  'SEND_INVITE_READERS_SUCCESS',
  'SEND_INVITE_READERS_ERROR',
  'GET_INVITE_READERS',
  'GET_INVITE_READERS_SUCCESS',
  'GET_INVITE_READERS_ERROR',
  'PREVIEW_INVITE_READER_REQUEST',
  'PREVIEW_INVITE_READER_SUCCESS',
  'PREVIEW_INVITE_READER_ERROR'
);

export interface IInviteReaderItem {
  type: string;
  id: string;
  attributes: {
    title: string;
    scopes: string[];
  };
}

export interface ISelection {
  label: string;
  value: string;
}
