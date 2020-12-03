import { connect } from 'react-redux';
import { compose } from 'recompose';
import {
  doLogin,
  resetRegister,
  checkSignupEmail,
  doRegisterSkeepOrg,
  doLogout,
} from 'src/store/actions/auth';
import {
  getAllPlans,
  createSubscriptionWithBraintree,
  setFirstPayment,
} from 'src/store/actions/plans';
import { IReduxState } from 'src/store/reducers';
import idx from 'idx';
import Login from './Login';

export default compose<any, any>(
  connect(
    (state: IReduxState) => ({
      plans: idx(state, x => x.plans.plans.data) || {},
      isLoggingIn: idx(state, x => x.auth.login.inProgress),
      isLoggedIn: !!idx(state, x => x.auth.login.access_token),
      profileId: idx(state, x => x.auth.profile.data.id),
      profileEmail: idx(state, x => x.auth.profile.data.attributes.email),
      profileRole: idx(
        state,
        x => x.auth.profile.data.relationships.roles.data[0].id
      ),
      fetchingProfile: idx(state, x => x.auth.profile.inProgress),
      registerStatus: idx(state, x => x.auth.register.status),
      registerSkeepOrgLoading: idx(
        state,
        x => x.auth.registerSkeepOrg.inProgress
      ),
      checkExistingEmailLoading: idx(state, x => x.auth.signupEmail.loading),
      existingEmail: idx(state, x => x.auth.signupEmail.existing),
      createSubscriptionWithBraintreeLoading: idx(
        state,
        x => x.plans.createSubscriptionWithBraintree.loading
      ),
      createSubscriptionWithBraintreeError: idx(
        state,
        x => x.plans.createSubscriptionWithBraintree.error
      ),
      paymentSubscription: idx(
        state,
        x => x.auth.profile.data.attributes.subscription
      ),
    }),
    {
      doLogin,
      getAllPlans,
      resetRegister,
      checkSignupEmail,
      doRegisterSkeepOrg,
      createSubscriptionWithBraintree,
      setFirstPayment,
      doLogout,
    }
  )
)(Login);
