import { connect } from 'react-redux';
import themr from 'src/helpers/themr';
import idx from 'idx';
import { compose } from 'recompose';
import { IReduxState } from 'src/store/reducers';
import get from 'lodash/get';
import { setFirstPayment } from 'src/store/actions/plans';

import MyAccount, { MyAccountProps } from './MyAccount';
import styles from './styles.scss';

// export default MyAccount;

export default compose(
  themr<MyAccountProps>('MyAccount', styles),
  connect(
    (state: IReduxState) => {
      const profile = idx(state, x => x.auth.profile.data);
      const role =
        get(profile, 'attributes.organization_role') === 'owner'
          ? 'owner'
          : get(profile, 'relationships.roles.data[0].id');
      return {
        role,
        createSubscriptionLoading: get(
          state,
          'plans.createSubscription.loading'
        ),
        firstPayment: get(state, 'plans.firstPayment'),
        updateCreditCardInfoLoading: get(
          state,
          'plans.updateCreditCardInfo.loading'
        ),
        organizationId: get(
          state,
          'auth.profile.data.relationships.organization.data.id'
        ),
      };
    },
    {
      setFirstPayment,
    }
  )
)(MyAccount);
