import themr from 'src/helpers/themr';
import { connect } from 'react-redux';
import { compose, withState } from 'recompose';
import {
  doRegister,
  resetRegister,
  checkSignuptoken,
} from 'src/store/actions/auth';
import { IReduxState } from 'src/store/reducers';
import idx from 'idx';
import { withRouter } from 'react-router-dom';
import styles from './styles.scss';
import Signup, { SignupProps } from './Signup';

export default compose<SignupProps, SignupProps>(
  withRouter,
  themr<SignupProps>('Signup', styles),
  connect(
    (state: IReduxState) => ({
      registerInProgress: idx(state, x => x.auth.register.inProgress),
      registerStatus: idx(state, x => x.auth.register.status),
      signupUser: idx(state, x => x.auth.signupToken.data),
      signupUserLoading: idx(state, x => x.auth.signupToken.loading),
      isLoggedIn: !!idx(state, x => x.auth.login.access_token),
      profileId: idx(state, x => x.auth.profile.data.id),
    }),
    {
      doRegister,
      resetRegister,
      checkSignuptoken,
    }
  ),
  withState('role', 'setRole', null),
  withState('accountData', 'setAccountData', null),
  withState('organizerData', 'setOrganizerData', null)
)(Signup);
