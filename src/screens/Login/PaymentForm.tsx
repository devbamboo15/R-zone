import * as React from 'react';
import Button, { ButtonColor, ButtonType } from 'src/components/Button';
import Heading, { HeadingType } from 'src/components/Heading';
import { Icon, Grid } from 'semantic-ui-react';
import get from 'lodash/get';
import Payment from 'src/components/Payment';
import cx from 'classnames';
import urls from 'src/helpers/urls';

export type PaymentFormProps = IComponentProps & {
  history: any;
  classes: any;
  onChange: Function;
  createSubscriptionWithBraintree: Function;
  doLogout: Function;
  currentPaymentInfo: any;
  loadedToken: any;
  showPaymentMessage: boolean;
  loadedBraintreeToken: boolean;
  createSubscriptionWithBraintreeLoading: boolean;
  createSubscriptionWithBraintreeError: any;
  preSelectedPlanId: string;
  profileEmail: string;
  isPrePayPlan: boolean;
  switchPlans: any;
  selectedPlanPP: any;
  selectedPlanMonthly: any;
  paymentSubscription: any;
  setFirstPayment: any;
  monthlyPricing: number;
  totalPricing: number;
};

const getSaveMoney = (selectedPlan, monthlyPrice) => {
  let savePrice = 0;
  const totalPrepaidPrice = parseInt(selectedPlan.price, 10);
  if (selectedPlan.category === 'year' || selectedPlan.category === 'year_pp') {
    // if it is year plans
    savePrice = monthlyPrice * 12 - totalPrepaidPrice;
  } else if (
    selectedPlan.category === 'school' ||
    selectedPlan.category === 'school_pp'
  ) {
    // if it is school plans
    savePrice = monthlyPrice * 11 - totalPrepaidPrice;
  } else if (
    selectedPlan.category === 'summer' ||
    selectedPlan.category === 'summer_pp'
  ) {
    // if it is summer plans
    savePrice = monthlyPrice * 5 - totalPrepaidPrice;
  }
  return savePrice;
};

const getCurrentPlan = planObj => {
  const plan = get(planObj, 'braintree_plan', '');
  let name = '';
  const method = plan.includes('_pp_') ? 'Pre-Paid' : 'Monthly Plan';
  let price = parseInt(get(planObj, 'plan_detail.price'), 10);
  let totalPrice = plan.includes('_pp_')
    ? parseInt(get(planObj, 'plan_detail.price'), 10)
    : 0;
  if (plan.includes('year')) {
    name = 'Year Round';
    if (!plan.includes('_pp_')) {
      totalPrice = price * 12;
    } else {
      price = totalPrice / 10;
    }
  } else if (plan.includes('school')) {
    name = 'School Year';
    if (!plan.includes('_pp_')) {
      totalPrice = price * 11;
    } else {
      price = totalPrice / 11;
    }
  } else {
    name = 'Summer Reading';
    if (!plan.includes('_pp_')) {
      totalPrice = price * 5;
    } else {
      price = totalPrice / 5;
    }
  }

  return {
    name,
    method,
    numberOfReaders: get(planObj, 'plan_detail.readers_max', ''),
    price: Math.ceil(price),
    totalPrice: Math.ceil(totalPrice),
  };
};

const PaymentForm = ({
  history,
  classes,
  onChange,
  currentPaymentInfo,
  loadedToken,
  showPaymentMessage,
  loadedBraintreeToken,
  createSubscriptionWithBraintreeLoading,
  preSelectedPlanId,
  isPrePayPlan,
  switchPlans,
  monthlyPricing,
  createSubscriptionWithBraintree,
  totalPricing,
  selectedPlanPP,
  selectedPlanMonthly,
  profileEmail,
  paymentSubscription,
  createSubscriptionWithBraintreeError,
}: PaymentFormProps) => {
  let currentPlanObj = {};
  if (paymentSubscription) {
    currentPlanObj = getCurrentPlan(paymentSubscription);
  }
  let saveMoney = 0;
  let monthlyPrice = '';
  if (selectedPlanPP) {
    saveMoney = getSaveMoney(selectedPlanPP, monthlyPricing);
  }
  if (selectedPlanMonthly) {
    monthlyPrice = selectedPlanMonthly.price;
  }
  const currentPrice = get(currentPlanObj, 'price', '');

  return (
    <div className={classes.loginStyles.paymentFormInner}>
      <div className={classes.loginStyles.paymentFormHeader}>
        {currentPaymentInfo && loadedBraintreeToken ? (
          <>
            <h2>Payment Success!</h2>
            <p
              style={{
                marginBottom: '2rem',
                marginTop: '5px',
                display: 'block',
              }}>
              An email receipt has been sent to: {profileEmail}
            </p>
          </>
        ) : (
          <>
            <h2>
              Due Today: $
              {isPrePayPlan ? totalPricing : Math.ceil(monthlyPricing)}
            </h2>
            <>
              <span
                className={cx(classes.loginStyles.switchPlan)}
                onClick={() => {
                  const preSelectedPlanArr = preSelectedPlanId.split('_');
                  const newPreSelectedPlanId = isPrePayPlan
                    ? `${
                        switchPlans[
                          `${preSelectedPlanArr[0]}_${preSelectedPlanArr[1]}_`
                        ]
                      }${preSelectedPlanArr[2]}`
                    : `${switchPlans[`${preSelectedPlanArr[0]}_`]}${
                        preSelectedPlanArr[1]
                      }`;
                  history.push({
                    pathname: '/login',
                    search: `?pre_selected_planid=${newPreSelectedPlanId}`,
                  });
                }}>
                {isPrePayPlan
                  ? `Switch to $${monthlyPrice} /mo - Cancel Anytime`
                  : `Switch to Pre-Paid - save $${saveMoney}!`}
              </span>
            </>
            <p>Choose a payment method to continue your purchase.</p>
          </>
        )}
      </div>
      <Payment
        onChange={paymentInfo => {
          if (paymentInfo) {
            const submitData = {
              payment_method_nonce: get(paymentInfo, 'nonce'),
              plan_id: preSelectedPlanId,
            };
            createSubscriptionWithBraintree(submitData);
          } else {
            onChange(null);
          }
        }}
        currentPaymentInfo={currentPaymentInfo}
        loadedToken={loadedToken}
        createSubscriptionWithBraintreeError={
          createSubscriptionWithBraintreeError
        }
        createSubscriptionWithBraintreeLoading={
          createSubscriptionWithBraintreeLoading
        }
      />
      {showPaymentMessage && (
        <Grid className={classes.loginStyles.paymentMessageWrapper}>
          <Grid.Row
            className={cx(
              classes.loginStyles.paymentMessage,
              paymentSubscription && classes.loginStyles.currentPlan
            )}>
            <Grid.Column width={1}>
              <Icon
                name="lightbulb"
                circular
                className={classes.loginStyles.infoIcon}
              />
            </Grid.Column>
            {paymentSubscription ? (
              <>
                <Grid.Column width={15}>
                  <Heading
                    headingProps={{
                      as: 'h4',
                      className: classes.loginStyles.paymentMessageHeading,
                    }}
                    type={HeadingType.BOLD_500}>
                    Your current plan:
                  </Heading>
                </Grid.Column>
                <Grid.Column width={16}>
                  {get(currentPlanObj, 'numberOfReaders', 20) > 20 ? (
                    <>
                      <p className={classes.loginStyles.currentPlanDes}>
                        {get(currentPlanObj, 'method', '')}:{' '}
                        {get(currentPlanObj, 'name', '')} - Up to{' '}
                        {get(currentPlanObj, 'numberOfReaders', '')} Readers
                      </p>
                      <p className={classes.loginStyles.currentPlanDes}>
                        ${currentPrice === 19 ? 20 : currentPrice}/mo - $
                        {get(currentPlanObj, 'totalPrice', '')} Total
                      </p>
                    </>
                  ) : (
                    <>
                      <p className={classes.loginStyles.currentPlanDes}>
                        Reader Zone FREE Plan - Up to 20 Readers
                      </p>
                      <p className={classes.loginStyles.currentPlanDes}>
                        $0 Total
                      </p>
                    </>
                  )}
                </Grid.Column>
              </>
            ) : (
              <>
                <Grid.Column width={15}>
                  <Heading
                    headingProps={{
                      as: 'h4',
                      className: classes.loginStyles.paymentMessageHeading,
                    }}
                    type={HeadingType.BOLD_500}>
                    Purchase Orders
                  </Heading>
                </Grid.Column>
                <Grid.Column width={16}>
                  <p className={classes.loginStyles.paymentMessageDes}>
                    We welcome purchase orders from any organization. Use the
                    contact information below to request a draft invoice or
                    submit your PO.
                  </p>
                  <div className={classes.loginStyles.paymentMessageHelper}>
                    <p>
                      <span>Email:</span>
                      <a href="mailto:help@readerzone.com">
                        help@readerzone.com
                      </a>
                    </p>
                    <p>
                      <span>Phone:</span>
                      <a href="tel:2088885160"> 208-888-5160</a>
                    </p>
                  </div>
                </Grid.Column>
              </>
            )}
          </Grid.Row>
        </Grid>
      )}
      {loadedBraintreeToken && (
        <>
          {currentPaymentInfo ? (
            <div className={classes.loginStyles.continuesToMyAccountButton}>
              <Button
                colorVariant={ButtonColor.PRIMARY}
                buttonType={ButtonType.ROUND}
                buttonProps={{
                  size: 'large',
                  type: 'button',
                  loading: createSubscriptionWithBraintreeLoading,
                  onClick: () => {
                    history.push(urls.SIGNUP_CONFIRMATION());
                  },
                }}>
                Continue To My Account
              </Button>
            </div>
          ) : (
            <Button
              colorVariant={ButtonColor.PRIMARY}
              buttonType={ButtonType.ROUND}
              buttonProps={{
                size: 'large',
                type: 'button',
                className: classes.loginStyles.backButton,
                onClick: () => {
                  window.location.href = urls.SITE_HOMEPAGE;
                },
              }}>
              Back
            </Button>
          )}
        </>
      )}
    </div>
  );
};

export default PaymentForm;
