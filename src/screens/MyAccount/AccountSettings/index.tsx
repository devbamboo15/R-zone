import { connect } from 'react-redux';
import themr from 'src/helpers/themr';
import { compose } from 'recompose';
import { IReduxState } from 'src/store/reducers';
import idx from 'idx';
import {
  doUpdateAccount,
  doCancelAccount,
  doMeBetaOff,
} from 'src/store/actions/auth';
import styles from './styles.scss';

import AccountSettings, { AccountSettingsProps } from './AccountSettings';

export default compose(
  themr<AccountSettingsProps>('AccountSettings', styles),
  connect(
    (state: IReduxState) => ({
      profile: idx(state, x => x.auth.profile.data.attributes) || {},
      isSaving: idx(state, x => x.auth.profile.inProgress) || false,
      meBetaOffLoading: idx(state, x => x.auth.meBetaOff.loading),
    }),
    {
      doUpdateAccount,
      doCancelAccount,
      doMeBetaOff,
    }
  )
)(AccountSettings);
