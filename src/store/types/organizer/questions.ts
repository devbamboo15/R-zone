import createTypes from 'redux-create-action-types';

export default createTypes(
  'SIGNUP_QUESTIONS',
  'SIGNUP_QUESTIONS_SUCCESS',
  'SIGNUP_QUESTIONS_ERROR',
  'USER_QUESTIONS',
  'USER_QUESTIONS_SUCCESS',
  'USER_QUESTIONS_ERROR',
  'UPDATE_USER_QUESTIONS',
  'UPDATE_USER_QUESTIONS_SUCCESS',
  'UPDATE_USER_QUESTIONS_ERROR'
);

export interface ISignUpQuestion {
  id: string;
  type: string;
  attributes: {
    question: string;
    sort_order: string;
  };
}
