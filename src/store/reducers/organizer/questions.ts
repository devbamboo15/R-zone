import Types, { ISignUpQuestion } from '../../types/organizer/questions';

const initialState = {
  questions: {
    loading: false,
    error: null as string,
    data: [] as ISignUpQuestion[],
  },
  userQuestions: {
    loading: false,
    error: null as string,
    data: {},
  },
};

export default (
  state = initialState,
  action: IReduxAction
): typeof initialState => {
  switch (action.type) {
    case Types.SIGNUP_QUESTIONS:
      return {
        ...state,
        questions: {
          ...state.questions,
          loading: true,
        },
      };
    case Types.SIGNUP_QUESTIONS_SUCCESS:
      return {
        ...state,
        questions: {
          ...state.questions,
          loading: false,
          error: '',
          data: action.payload,
        },
      };
    case Types.SIGNUP_QUESTIONS_ERROR:
      return {
        ...state,
        questions: {
          ...state.questions,
          loading: false,
          error: action.payload,
        },
      };
    case Types.USER_QUESTIONS:
      return {
        ...state,
        userQuestions: {
          ...state.userQuestions,
          loading: true,
        },
      };
    case Types.USER_QUESTIONS_SUCCESS:
      return {
        ...state,
        userQuestions: {
          ...state.userQuestions,
          loading: false,
          error: '',
          data: {
            ...state.userQuestions.data,
            [action.payload.userId]: action.payload.data,
          },
        },
      };
    case Types.USER_QUESTIONS_ERROR:
      return {
        ...state,
        userQuestions: {
          ...state.userQuestions,
          loading: false,
          error: action.payload,
        },
      };
    default:
      return state;
  }
};
