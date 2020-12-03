import idx from 'idx';
import groupBy from 'lodash/groupBy';
import memoize from 'lodash/memoize';
import sortBy from 'lodash/sortBy';
import Types, { IGoal, IGoalEntry, IGoalProgressSummary } from '../types/group';

const initialState = {
  currentSelectedGroup: {} as IGoal,
  groups: {
    loading: false,
    error: '',
    data: {} as { [key: string]: IGoal }, // this is key: value pair, where key is goal id and value is IGoal type
    sorted: [] as IGoal[],
  },
  createReadingEntry: {
    loading: false,
    success: false,
    error: '',
  },
  bulkEntry: {
    loading: false,
    success: false,
    error: '',
  },
};

const normalizeGoalData = arr => {
  const entries: IGoalEntry[] = [];
  const progressSummaries: IGoalProgressSummary[] = [];
  const goals: IGoal[] = [];
  arr.forEach(val => {
    if (val.type === 'entry') {
      entries.push(val);
    }
    if (val.type === 'progressSummary') {
      progressSummaries.push(val);
    }
    if (val.type === 'goal') {
      goals.push(val);
    }
  });
  const entriesObj = groupBy(entries, 'attributes.goal_id');
  const progressSummariesObj = groupBy(
    progressSummaries,
    'attributes.overallProgress.goal_id'
  );
  const goalsObj = groupBy(goals, 'id');
  const finalGoals = {} as { [key: string]: IGoal };
  Object.keys(goalsObj).map(key => {
    const goal = goalsObj[key][0];
    finalGoals[key] = {
      ...goal,
      entries: entriesObj[key] || [],
      progressSummary:
        idx(progressSummariesObj, x => x[key][0]) ||
        ({} as IGoalProgressSummary),
    };
    return key;
  });
  const sorted: IGoal[] = sortBy(
    // @ts-ignore
    Object.values(finalGoals),
    'attributes.group_name'
  );
  return { obj: finalGoals, sorted };
};
const memoizedNormalizedGoalData = memoize(normalizeGoalData);

export default (
  state = initialState,
  action: IReduxAction
): typeof initialState => {
  switch (action.type) {
    // Get User Books
    case Types.SELECT_CURRENT_GROUP: {
      return {
        ...state,
        currentSelectedGroup: action.payload,
      };
    }
    case Types.GET_GROUPS_REQUEST: {
      return {
        ...state,
        groups: {
          ...state.groups,
          loading: true,
          error: '',
        },
      };
    }
    case Types.GET_GROUPS_SUCCESS: {
      const arr = action.payload || [];
      const goals = memoizedNormalizedGoalData(arr);
      const alreadySelectedGroup = state.currentSelectedGroup;
      let newSelectedGroup = alreadySelectedGroup;
      // Check whether already selected group exist in goals.obj or not
      if (!goals.obj[alreadySelectedGroup.id]) {
        // if it doesn't exist then select first group by default
        newSelectedGroup = goals.sorted[0] || ({} as IGoal);
      } else {
        // if it already exist then just update with new info if any
        newSelectedGroup = goals.obj[alreadySelectedGroup.id];
      }
      return {
        ...state,
        groups: {
          ...state.groups,
          loading: false,
          error: '',
          data: goals.obj,
          sorted: goals.sorted,
        },
        currentSelectedGroup: { ...newSelectedGroup },
      };
    }
    case Types.GET_GROUPS_ERROR: {
      return {
        ...state,
        groups: {
          ...state.groups,
          loading: false,
          error: action.payload,
        },
      };
    }

    // Add entry
    case Types.CREATE_READING_ENTRY_REQUEST: {
      return {
        ...state,
        createReadingEntry: {
          loading: true,
          success: false,
          error: '',
        },
      };
    }
    case Types.CREATE_READING_ENTRY_SUCCESS: {
      return {
        ...state,
        createReadingEntry: {
          loading: false,
          success: true,
          error: '',
        },
      };
    }
    case Types.CREATE_READING_ENTRY_ERROR: {
      return {
        ...state,
        createReadingEntry: {
          loading: false,
          success: false,
          error: action.payload,
        },
      };
    }
    // Add bulk entry
    case Types.BULK_ENTRY_REQUEST: {
      return {
        ...state,
        bulkEntry: {
          loading: true,
          success: false,
          error: '',
        },
      };
    }
    case Types.BULK_ENTRY_SUCCESS: {
      return {
        ...state,
        bulkEntry: {
          loading: false,
          success: true,
          error: '',
        },
      };
    }
    case Types.BULK_ENTRY_ERROR: {
      return {
        ...state,
        bulkEntry: {
          loading: false,
          success: false,
          error: action.payload,
        },
      };
    }
    default:
      return state;
  }
};
