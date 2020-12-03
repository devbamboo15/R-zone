import { connect } from 'react-redux';
import themr from 'src/helpers/themr';
import { compose } from 'recompose';
import { IReduxState } from 'src/store/reducers';
import idx from 'idx';
import get from 'lodash/get';
import find from 'lodash/find';
import { updateAuthUser } from 'src/store/actions/organizer/users';
import Edit, { EditAuthorizedUsersProps } from './Edit';
import styles from './styles.scss';

export default compose(
  themr<EditAuthorizedUsersProps>('EditAuthorizedUsers', styles),
  connect(
    (state: IReduxState, props: EditAuthorizedUsersProps) => {
      const userid = get(props, 'match.params.userid', null);
      const users = idx(state, x => x.organizer.users.users.data) || [];
      const user = users.find(useritem => useritem.id === userid);
      const access = idx(state, x => x.organizer.users.usersAccess.data);
      const organizationId = idx(
        state,
        x => x.auth.profile.data.relationships.organization.data.id
      );
      const owner = users.filter(userObj => {
        const roles = idx(userObj, x => x.relationships.roles.data) || [];
        const role = find(roles, { id: 'owner' });
        return !!role;
      });
      const userAccess = get(
        access,
        `access.${user.id}[0].attributes.access.${organizationId}`,
        {}
      );
      return {
        users,
        user,
        updateUserLoading:
          idx(state, x => x.organizer.users.updateUser[user.id].loading) ||
          false,
        updateUserStatus: idx(
          state,
          x => x.organizer.users.updateUser[user.id].status
        ),
        userAccess,
        owner: owner[0],
      };
    },
    {
      updateAuthUser,
    }
  )
)(Edit);
