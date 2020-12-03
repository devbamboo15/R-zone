import { connect } from 'react-redux';
import themr from 'src/helpers/themr';
import { compose } from 'recompose';
import { withRouter } from 'react-router-dom';
import { IReduxState } from 'src/store/reducers';
import idx from 'idx';
import { getAllProgramsForAuthUser } from 'src/store/actions/organizer/program';
import { getAuthorizedUser } from 'src/store/actions/organizer/users';
import UserForm, { UserFormProps, UserFormPropsOut } from './UserForm';
import styles from './styles.scss';

export default compose<UserFormProps, UserFormPropsOut>(
  withRouter,
  themr<UserFormProps>('UserForm', styles),
  connect(
    (state: IReduxState) => {
      return {
        organization: idx(
          state,
          x => x.auth.profile.data.attributes.organization
        ),
        programs: idx(state, x => x.organizer.program.programs.data) || [],
        getProgramLoading: idx(
          state,
          x => x.organizer.program.programs.loading
        ),
        groups: idx(state, x => x.organizer.group.programGroups) || {},
      };
    },
    {
      getAllProgramsForAuthUser,
      getAuthorizedUser,
    }
  )
)(UserForm);
