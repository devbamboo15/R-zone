import { connect } from 'react-redux';
import themr from 'src/helpers/themr';
import { compose } from 'recompose';
import idx from 'idx';
import { IReduxState } from 'src/store/reducers';
import {
  getAllPlans,
  createSubcription,
  changeSubcription,
  cancelSubscription,
  createSubscriptionWithBraintree,
  updateCreditCardInfo,
} from 'src/store/actions/plans';
import get from 'lodash/get';
import { withRouter } from 'react-router-dom';
import Payments, { PaymentsProps } from './Payments';
import styles from './styles.scss';

export default compose(
  withRouter,
  themr<PaymentsProps>('Payments', styles),
  connect(
    (state: IReduxState) => ({
      plans: idx(state, x => x.plans.plans.data) || {},
      createSubscriptionLoading: idx(
        state,
        x => x.plans.createSubscription.loading
      ),
      createSubscriptionWithBraintreeLoading: idx(
        state,
        x => x.plans.createSubscriptionWithBraintree.loading
      ),
      createSubscriptionWithBraintreeError: idx(
        state,
        x => x.plans.createSubscriptionWithBraintree.error
      ),
      changeSubscriptionLoading: idx(
        state,
        x => x.plans.changeSubscription.loading
      ),
      cancelSubscriptionLoading: idx(
        state,
        x => x.plans.cancelSubscription.loading
      ),
      cancelSubscriptionSuccess: idx(
        state,
        x => x.plans.cancelSubscription.success
      ),
      updateCreditCardInfoLoading: idx(
        state,
        x => x.plans.updateCreditCardInfo.loading
      ),
      meLoading: get(state, 'auth.profile.inProgress'),
      numberOfReaders:
        get(state, 'auth.register.numberOfReaders') ||
        get(state, 'auth.registerSkeepOrg.numberOfReaders'),
      preSelectedPlanId: get(state, 'auth.registerSkeepOrg.preSelectedPlanId'),
      paymentSubscription:
        get(state, 'auth.profile.data.attributes.subscription') || {},
      betaOriginal: get(
        state,
        'auth.profile.data.attributes.organization.beta_original',
        ''
      ),
    }),
    {
      getAllPlans,
      createSubcription,
      changeSubcription,
      cancelSubscription,
      updateCreditCardInfo,
      createSubscriptionWithBraintree,
    }
  )
)(Payments);
