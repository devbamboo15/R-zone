import themr from 'src/helpers/themr';
import { compose, withState, withHandlers } from 'recompose';
import { withRouter } from 'react-router-dom';
import BulkInvite, {
  BulkInviteProps,
  ComponentProps,
  InviteType,
} from './BulkInvite';
import styles from './styles.scss';

export default compose<BulkInviteProps, ComponentProps>(
  withRouter,
  themr<BulkInviteProps>('BulkInvite', styles),
  withState('message', 'setMessage', ''),
  withState('isShowMode', 'setIsShowForm', InviteType.FORM),
  withHandlers({
    onAddMore: ({ setIsShowForm }) => () => setIsShowForm(InviteType.FORM),
  })
)(BulkInvite);
