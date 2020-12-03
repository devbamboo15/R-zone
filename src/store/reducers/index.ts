import { combineReducers } from 'redux';
import AppReducer from './app';
import AuthReducer from './auth';
import BookBankReducer from './bookbank';
import GroupReducer from './group';
import GoalReducer from './goal';
import RoleReducer from './role';
import QuestionsReducer from './organizer/questions';
import ProgramReducer from './organizer/program';
import OrganizerGroupReducer from './organizer/group';
import OrganizerAwardsReducer from './organizer/awards';
import OrganizerReaderReducer from './organizer/reader';
import OrganizerAuthorizedUsersReducer from './organizer/users';
import OrganizationsReducer from './organizer/organizations';
import InviteReadersReducer from './organizer/invite';
import PlansReducer from './plans';
import Types from '../types/auth';
import ReportsReducer from './reports';
import ShareReducer from './share';
import SetupReducer from './setup';

const reducers = {
  app: AppReducer,
  auth: AuthReducer,
  bookBank: BookBankReducer,
  group: GroupReducer,
  goal: GoalReducer,
  role: RoleReducer,
  plans: PlansReducer,
  reports: ReportsReducer,
  share: ShareReducer,
  setup: SetupReducer,
  organizer: combineReducers({
    program: ProgramReducer,
    group: OrganizerGroupReducer,
    awards: OrganizerAwardsReducer,
    reader: OrganizerReaderReducer,
    users: OrganizerAuthorizedUsersReducer,
    organizations: OrganizationsReducer,
    invite: InviteReadersReducer,
    questions: QuestionsReducer,
  }),
};

const combinedReducer = combineReducers(reducers);

const rootReducer = (state, action) => {
  if (action.type === Types.LOGOUT) {
    state = undefined;
  }

  return combinedReducer(state, action);
};

export interface IReduxState {
  app: ReturnType<typeof AppReducer>;
  auth: ReturnType<typeof AuthReducer>;
  bookBank: ReturnType<typeof BookBankReducer>;
  group: ReturnType<typeof GroupReducer>;
  goal: ReturnType<typeof GoalReducer>;
  role: ReturnType<typeof RoleReducer>;
  plans: ReturnType<typeof PlansReducer>;
  reports: ReturnType<typeof ReportsReducer>;
  share: ReturnType<typeof ShareReducer>;
  organizer: {
    program: ReturnType<typeof ProgramReducer>;
    group: ReturnType<typeof OrganizerGroupReducer>;
    awards: ReturnType<typeof OrganizerAwardsReducer>;
    reader: ReturnType<typeof OrganizerReaderReducer>;
    users: ReturnType<typeof OrganizerAuthorizedUsersReducer>;
    organizations: ReturnType<typeof OrganizationsReducer>;
    invite: ReturnType<typeof InviteReadersReducer>;
    questions: ReturnType<typeof QuestionsReducer>;
  };
  setup: ReturnType<typeof SetupReducer>;
}

export default rootReducer;
