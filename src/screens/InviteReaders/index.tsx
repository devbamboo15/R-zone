import themr from 'src/helpers/themr';
import { compose, withState } from 'recompose';
import { withRouter } from 'react-router-dom';
import { IReduxState } from 'src/store/reducers';
import { connect } from 'react-redux';
import idx from 'idx';
import styles from './styles.scss';
import InviteReaders, { InviteReadersProps } from './InviteReaders';

export default compose<InviteReadersProps, {}>(
  withRouter,
  themr<InviteReadersProps>('InviteReaders', styles),
  connect((state: IReduxState) => {
    return {
      organizationId: idx(
        state,
        x => x.auth.profile.data.relationships.organization.data.id
      ),
    };
  }),
  withState('message', 'setMessage', null)
)(InviteReaders);
