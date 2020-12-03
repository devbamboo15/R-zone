import concat from 'lodash/concat';
import get from 'lodash/get';
import Types from '../types/reports';

const initialState = {
  feeds: {
    loading: false,
    error: '',
    data: {} as any,
  },
  overviews: {
    loading: false,
    error: '',
    data: {} as any,
  },
};

export default (
  state = initialState,
  action: IReduxAction
): typeof initialState => {
  switch (action.type) {
    case Types.GET_FEED_REQUEST: {
      return {
        ...state,
        feeds: {
          ...state.feeds,
          loading: true,
          error: '',
        },
      };
    }
    case Types.GET_FEED_MORE_SUCCESS: {
      const oldFeedData = { ...state.feeds.data };
      const newFeedDataArr = concat(
        oldFeedData.data,
        get(action, 'payload.data', [])
      );
      const newFeedData = { ...action.payload };
      newFeedData.data = newFeedDataArr;
      return {
        ...state,
        feeds: {
          loading: false,
          data: newFeedData,
          error: null,
        },
      };
    }
    case Types.GET_FEED_SUCCESS: {
      return {
        ...state,
        feeds: {
          loading: false,
          data: action.payload,
          error: null,
        },
      };
    }
    case Types.GET_FEED_ERROR: {
      return {
        ...state,
        feeds: {
          ...state.feeds,
          loading: false,
          error: action.payload,
        },
      };
    }

    case Types.GET_OVERVIEWS_REQUEST: {
      return {
        ...state,
        overviews: {
          ...state.overviews,
          loading: true,
          error: '',
        },
      };
    }
    case Types.GET_OVERVIEWS_MORE_SUCCESS: {
      const oldOverviewData = { ...state.overviews.data };
      const newOverviewDataArr = concat(
        oldOverviewData.data,
        get(action, 'payload.data', [])
      );
      const newOverviewData = { ...action.payload };
      newOverviewData.data = newOverviewDataArr;
      return {
        ...state,
        overviews: {
          loading: false,
          data: newOverviewData,
          error: null,
        },
      };
    }
    case Types.GET_OVERVIEWS_SUCCESS: {
      return {
        ...state,
        overviews: {
          loading: false,
          data: action.payload,
          error: null,
        },
      };
    }
    case Types.GET_OVERVIEWS_ERROR: {
      return {
        ...state,
        overviews: {
          ...state.overviews,
          loading: false,
          error: action.payload,
        },
      };
    }
    default:
      return state;
  }
};
