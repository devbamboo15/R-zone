import { connect } from 'react-redux';
import themr from 'src/helpers/themr';
import { compose } from 'recompose';
import { IReduxState } from 'src/store/reducers';
import idx from 'idx';
import get from 'lodash/get';
import { addAuthUser } from 'src/store/actions/organizer/users';
import Add, { AddAuthorizedUsersProps } from './Add';
import styles from './styles.scss';

export default compose(
  themr<AddAuthorizedUsersProps>('AddAuthorizedUsers', styles),
  connect(
    (state: IReduxState) => {
      const users = idx(state, x => x.organizer.users.users.data) || [];
      const addUserLoading = idx(
        state,
        x => x.organizer.users.addUser.isInProgress
      );
      const addUserSuccess = idx(state, x => x.organizer.users.addUser.success);
      const programs = idx(state, x => x.organizer.program.programs.data) || [];
      const groupPrograms =
        idx(state, x => x.organizer.group.programGroups) || {};
      const makeProgramPermissions = programs.reduce((acc, program): any => {
        acc[program.id] = {
          read: false,
          write: false,
        };
        return acc;
      }, {});

      const makeGroupPermissions = Object.keys(groupPrograms).reduce(
        (acc, programId): any => {
          acc[programId] = get(groupPrograms[programId], 'data', []).reduce(
            (groupacc: any, group) => {
              groupacc[group.id] = {
                read: false,
                write: false,
              };
              return groupacc;
            },
            {}
          );
          return acc;
        },
        {}
      );
      return {
        users,
        addUserLoading,
        addUserSuccess,
        userAccess: {
          program: makeProgramPermissions,
          group_by_program: makeGroupPermissions,
        },
      };
    },
    {
      addAuthUser,
    }
  )
)(Add);
