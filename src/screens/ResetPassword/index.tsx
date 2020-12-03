import { connect } from 'react-redux';
import { compose } from 'recompose';
import { doResetPassword, doCheckResetPassword } from 'src/store/actions/auth';
import { IReduxState } from 'src/store/reducers';
import idx from 'idx';
import { withRouter } from 'react-router-dom';
import ResetPassword from './ResetPassword';

export default compose<any, any>(
  withRouter,
  connect(
    (state: IReduxState) => ({
      isLoggingIn: idx(state, x => x.auth.login.inProgress),
      resetPasswordLoading: idx(state, x => x.auth.reset_password.inProgress),
      isLoggedIn: !!idx(state, x => x.auth.login.access_token),
      profileId: idx(state, x => x.auth.profile.data.id),
      checkResetPasswordData: idx(state, x => x.auth.check_reset_password.data),
      checkResetPasswordLoading: idx(
        state,
        x => x.auth.check_reset_password.inProgress
      ),
    }),
    {
      doResetPassword,
      doCheckResetPassword,
    }
  )
)(ResetPassword);
