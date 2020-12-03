import { connect } from 'react-redux';
import { compose } from 'recompose';
import {
  doSandboxLogin,
  resetSandboxLogin,
  doLogout,
} from 'src/store/actions/auth';
import { IReduxState } from 'src/store/reducers';
import idx from 'idx';
import SandboxLogin from './SandboxLogin';

export default compose<any, any>(
  connect(
    (state: IReduxState) => ({
      isLoggingIn: idx(state, x => x.auth.sandbox_login.inProgress),
      isLoggedIn: !!idx(state, x => x.auth.login.access_token),
      profileId: idx(state, x => x.auth.profile.data.id),
      fetchingProfile: idx(state, x => x.auth.profile.inProgress),
    }),
    {
      doSandboxLogin,
      resetSandboxLogin,
      doLogout,
    }
  )
)(SandboxLogin);
