import { connect } from 'react-redux';
import themr from 'src/helpers/themr';
import { compose } from 'recompose';
import { IReduxState } from 'src/store/reducers';
import idx from 'idx';
import { doUpdateAccount } from 'src/store/actions/auth';
import styles from './styles.scss';

import AccountSettings, { OrganizationProps } from './Organization';

export default compose(
  themr<OrganizationProps>('Organization', styles),
  connect(
    (state: IReduxState) => ({
      state,
      organization:
        idx(state, x => x.auth.profile.data.attributes.organization) || {},
      isSaving: idx(state, x => x.auth.profile.inProgress) || false,
    }),
    {
      doUpdateAccount,
    }
  )
)(AccountSettings);
