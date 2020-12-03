import { connect } from 'react-redux';
import themr from 'src/helpers/themr';
import { compose } from 'recompose';
import { IReduxState } from 'src/store/reducers';
import idx from 'idx';
import get from 'lodash/get';
import {
  getAllAuthorizedUsers,
  deleteAuthorizedUser,
  deleteAllAuthorizedUsers,
} from 'src/store/actions/organizer/users';
import styles from './styles.scss';

import AuthrizedUsers, { AuthorizedUsersProps } from './AuthrizedUsers';

export default compose(
  themr<AuthorizedUsersProps>('AuthorizedUsers', styles),
  connect(
    (state: IReduxState) => {
      const usersLoading = idx(state, x => x.organizer.users.users.loading);
      const profile = idx(state, x => x.auth.profile.data.attributes);
      const organization = idx(
        state,
        x => x.auth.profile.data.attributes.organization
      );
      const deleteAllUsersLoading = idx(
        state,
        x => x.organizer.users.deleteAllUsers.loading
      );
      return {
        usersLoading,
        profile,
        deleteAllUsersLoading,
        organization,
        ownerCount: get(organization, 'owner_count'),
        users: idx(state, x => x.organizer.users.users.data) || [],
      };
    },
    {
      getAllAuthorizedUsers,
      deleteAuthorizedUser,
      deleteAllAuthorizedUsers,
    }
  )
)(AuthrizedUsers);
