import createTypes from 'redux-create-action-types';

export default createTypes(
  'SHARE',
  'SHARE_SUCCESS',
  'SHARE_ERROR',
  'CLICK_SHARE',
  'UPDATE_SHARE_SUCCESS',
  'DELETE_SHARE_SUCCESS',
  'GET_USER_LEADERBOARD',
  'GET_USER_LEADERBOARD_SUCCESS',
  'GET_USER_LEADERBOARD_ERROR'
);

export interface IShareItem {
  type: string;
  id: string;
  attributes: {
    title_text: string;
    greeting_text: string;
    post_text: string;
    program_id: number;
  };
}
export interface IShareSelection {
  label: string;
  value: string;
  data: IShareItem;
}
