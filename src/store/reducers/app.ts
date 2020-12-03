import Types from '../types/app';

const initialState = {
  dummyEvent: '',
};

export default (state = initialState, action: IReduxAction) => {
  switch (action.type) {
    case Types.DUMMY_REDUX_EVENT: {
      return state;
    }
    default:
      return state;
  }
};
