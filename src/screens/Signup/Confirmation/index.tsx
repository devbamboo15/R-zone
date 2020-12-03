import themr from 'src/helpers/themr';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import { doLogout } from 'src/store/actions/auth';
import { withRouter } from 'react-router-dom';
import styles from './styles.scss';
import Confirmation, { ConfirmationProps } from './view';

export default compose<ConfirmationProps, ConfirmationProps>(
  withRouter,
  themr<ConfirmationProps>('Confirmation', styles),
  connect(
    () => ({}),
    {
      doLogout,
    }
  )
)(Confirmation);
