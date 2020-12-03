import createTypes from 'redux-create-action-types';

export default createTypes(
  'GET_FEED_REQUEST',
  'GET_FEED_SUCCESS',
  'GET_FEED_MORE_SUCCESS',
  'GET_FEED_ERROR',

  'GET_OVERVIEWS_REQUEST',
  'GET_OVERVIEWS_SUCCESS',
  'GET_OVERVIEWS_MORE_SUCCESS',
  'GET_OVERVIEWS_ERROR'
);
