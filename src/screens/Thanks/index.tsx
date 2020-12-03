import themr from 'src/helpers/themr';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import { IReduxState } from 'src/store/reducers';
import { resetRegister, doLogin } from 'src/store/actions/auth';
import idx from 'idx';
import get from 'lodash/get';
import { withRouter } from 'react-router-dom';
import styles from './styles.scss';
import Thanks, { ThanksProps } from './thanks';

export default compose<ThanksProps, ThanksProps>(
  withRouter,
  themr<ThanksProps>('Thanks', styles),
  connect(
    (state: IReduxState) => ({
      registerStatus: idx(state, x => x.auth.register.status),
      registerEmail: get(state, 'auth.register.data.attributes.email'),
      registerPassword: get(state, 'auth.register.data.attributes.password'),
      loginLoading: get(state, 'auth.login.inProgress'),
    }),
    {
      resetRegister,
      doLogin,
    }
  )
)(Thanks);
