import { connect } from 'react-redux';
import { compose } from 'recompose';
import { doForgetPassword } from 'src/store/actions/auth';
import { IReduxState } from 'src/store/reducers';
import idx from 'idx';
import ForgetPassword from './ForgetPassword';

export default compose<any, any>(
  connect(
    (state: IReduxState) => ({
      isLoggingIn: idx(state, x => x.auth.login.inProgress),
      isLoggedIn: !!idx(state, x => x.auth.login.access_token),
      profileId: idx(state, x => x.auth.profile.data.id),
      forgetPassword: idx(state, x => x.auth.forget_password),
    }),
    {
      doForgetPassword,
    }
  )
)(ForgetPassword);
