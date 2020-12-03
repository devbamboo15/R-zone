import * as React from 'react';
import { Grid, Icon } from 'semantic-ui-react';
import Input from 'src/components/FormFields/Input';
import Button, { ButtonType, ButtonColor } from 'src/components/Button';
import Heading, { HeadingType, HeadingColor } from 'src/components/Heading';
import ChangePlanForm from 'src/components/Forms/ChangePlanForm';
import get from 'lodash/get';
import isEqual from 'lodash/isEqual';
import cx from 'classnames';
import Spinner from 'src/components/Spinner';
import * as queryString from 'query-string';
import * as H from 'history';
import BraintreeWebDropIn from 'braintree-web-drop-in';
import * as Api from 'src/api';

export type PaymentsProps = IComponentProps & {
  getAllPlans: Function;
  createSubcription: Function;
  changeSubcription: Function;
  cancelSubscription: Function;
  updateCreditCardInfo: Function;
  createSubscriptionWithBraintree: Function;
  plans: any;
  createSubscriptionLoading: boolean;
  changeSubscriptionLoading: boolean;
  cancelSubscriptionLoading: boolean;
  cancelSubscriptionSuccess: boolean;
  updateCreditCardInfoLoading: boolean;
  createSubscriptionWithBraintreeLoading: boolean;
  createSubscriptionWithBraintreeError: boolean;
  meLoading: boolean;
  paymentSubscription: any;
  betaOriginal: any;
  history: H.History;
  numberOfReaders: string;
  preSelectedPlanId: string;
};

interface PaymentState {
  isChangePlan: boolean;
  selectedPlan: any;
  subscriptionId: string;
  preSelectedPlanId: any;
  clientTokenLoading: boolean;
  isChangeBraintree: boolean;
  isSelectedNewPlan: boolean;
  showErrorMessage: boolean;
  paymentPayload: any;
}

class Payments extends React.PureComponent<PaymentsProps, PaymentState> {
  state = {
    isChangePlan: false,
    selectedPlan: null,
    subscriptionId: '',
    preSelectedPlanId: null,
    clientTokenLoading: true,
    paymentPayload: null,
    isChangeBraintree: false,
    isSelectedNewPlan: false,
    showErrorMessage: false,
  };

  braintreeWrapper;

  instance;

  createSubscriptionWIthBraintree = paymentPayload => {
    const { createSubscriptionWithBraintree } = this.props;
    const { subscriptionId } = this.state;
    const submitData = {
      payment_method_nonce: get(paymentPayload, 'nonce'),
      plan_id: subscriptionId,
    };
    this.setState({
      isSelectedNewPlan: false,
    });
    createSubscriptionWithBraintree(submitData, true);
  };

  async componentDidMount() {
    const res = await Api.getBraintreeClientToken();
    const submitButton = document.querySelector('#submit-button');
    this.instance = (BraintreeWebDropIn as any).create(
      {
        container: this.braintreeWrapper,
        authorization: get(res, 'client_token', ''),
      },
      (err, dropinInstance) => {
        submitButton.addEventListener('click', () => {
          dropinInstance.requestPaymentMethod((_, payload) => {
            if (payload) {
              this.createSubscriptionWIthBraintree(payload);
              this.setState({
                paymentPayload: payload,
              });
            }
          });
        });
        this.setState({
          clientTokenLoading: false,
        });
        dropinInstance.on('paymentMethodRequestable', param => {
          const paymentMethodIsSelected = get(param, 'paymentMethodIsSelected');
          if (!paymentMethodIsSelected) {
            this.setState({
              isChangeBraintree: true,
            });
          }
        });
        const classname = document.getElementsByClassName('braintree-method');
        const $this = this;

        const myFunction = function() {
          const currentClass = this.getAttribute('class') || '';
          if (!currentClass.includes('braintree-method--active')) {
            $this.setState({
              isChangeBraintree: true,
            });
          }
        };

        for (let i = 0; i < classname.length; i++) {
          classname[i].addEventListener('click', myFunction, false);
        }
      }
    );
    const {
      preSelectedPlanId,
      history,
      paymentSubscription,
      plans,
    } = this.props;
    this.props.getAllPlans();
    const params = queryString.parse(history.location.search);

    const planId = get(params, 'pre_selected_planid') || preSelectedPlanId;
    const showListPlan = get(params, 'show_list_plan');
    if (showListPlan === 'true') {
      this.setState({
        isChangePlan: true,
      });
    }
    this.setState({
      subscriptionId: get(paymentSubscription, 'braintree_plan') || '',
    });
    if (planId && isEqual(paymentSubscription, {})) {
      const plan = this.findPlanById(plans, planId);
      if (plan)
        this.setState(() => ({
          preSelectedPlanId: planId,
          selectedPlan: plan,
          subscriptionId: plan.plan_id,
        }));
    }
  }

  changePlan = () => this.setState(() => ({ isChangePlan: true }));

  closeChangePlan = () => this.setState(() => ({ isChangePlan: false }));

  selectPlan = selectedPlan => {
    this.setState(() => ({ selectedPlan, isChangePlan: false }));
  };

  handleCreateSubscription = subscriptionId => {
    this.setState({
      subscriptionId,
      isChangePlan: false,
      isSelectedNewPlan: true,
    });
  };

  findPlanById = (plans, planId) => {
    const types = [
      'school',
      'school_pp',
      'summer',
      'summer_pp',
      'year',
      'year_pp',
    ];

    let result = null;
    types.map(planType => {
      const currentPlan = get(plans, planType) || [];
      const currentType = currentPlan.find(p => p.plan_id === planId);

      if (currentType) {
        result = currentType;
      }

      return true;
    });

    return result;
  };

  componentDidUpdate = (prevProps: PaymentsProps) => {
    const {
      cancelSubscriptionSuccess,
      meLoading,
      createSubscriptionWithBraintreeLoading,
      createSubscriptionWithBraintreeError,
    } = this.props;
    if (
      cancelSubscriptionSuccess &&
      cancelSubscriptionSuccess !== prevProps.cancelSubscriptionSuccess
    ) {
      this.setState({
        selectedPlan: null,
      });
    }
    if (
      !createSubscriptionWithBraintreeLoading &&
      createSubscriptionWithBraintreeLoading !==
        prevProps.createSubscriptionWithBraintreeLoading
    ) {
      if (createSubscriptionWithBraintreeError) {
        const element: HTMLElement = document.getElementsByClassName(
          'braintree-toggle'
        )[0] as HTMLElement;
        element.click();
      }
      this.setState({
        showErrorMessage: !!createSubscriptionWithBraintreeError,
      });
    }
    if (!meLoading && prevProps.meLoading !== meLoading) {
      this.setState({
        isChangeBraintree: false,
      });
    }
  };

  getPlanFromStore = () => {
    const { plans, preSelectedPlanId } = this.props;
    let planName = '';
    const planArr = (preSelectedPlanId || '').split('_') || [];
    const comparePlan =
      planArr.length === 3
        ? `${planArr[0]}_${planArr[1]}`
        : planArr.length > 0
        ? `${planArr[0]}`
        : '';
    if (comparePlan && plans[comparePlan]) {
      const plansLength = plans[comparePlan].length;
      for (let i = 0; i < plansLength; i++) {
        if (plans[comparePlan][i].plan_id === preSelectedPlanId) {
          planName = plans[comparePlan][i].name;
        }
      }
    }
    return planName;
  };

  render() {
    const {
      classes,
      plans,
      paymentSubscription,
      changeSubcription,
      changeSubscriptionLoading,
      meLoading,
      cancelSubscription,
      cancelSubscriptionLoading,
      numberOfReaders,
      createSubscriptionWithBraintree,
      createSubscriptionWithBraintreeLoading,
    } = this.props;
    const {
      isChangePlan,
      selectedPlan,
      subscriptionId,
      clientTokenLoading,
      paymentPayload,
      isChangeBraintree,
      isSelectedNewPlan,
      showErrorMessage,
    } = this.state;
    let currentPlanName = '';
    let monthlyPricing = 0;
    let totalPricing = 0;
    const isPrePayPlan =
      selectedPlan && (selectedPlan.category || '').indexOf('_pp') > -1;
    let totalMonths = 1;
    const params = queryString.parse(this.props.history.location.search);

    const planId = get(params, 'pre_selected_planid');

    if (selectedPlan) {
      if (
        selectedPlan.category === 'year' ||
        selectedPlan.category === 'year_pp'
      ) {
        // if it is year plans
        currentPlanName = 'Year Round';
        totalMonths = 10;
        if (!isPrePayPlan) {
          // if it is not pre pay then count 12 months
          totalMonths = 12;
        }
      } else if (
        selectedPlan.category === 'school' ||
        selectedPlan.category === 'school_pp'
      ) {
        // if it is school plans
        currentPlanName = 'School Year';
        totalMonths = 11;
      } else if (
        selectedPlan.category === 'summer' ||
        selectedPlan.category === 'summer_pp'
      ) {
        // if it is summer plans
        currentPlanName = 'Summer Reading';
        totalMonths = 5;
      }
      if (isPrePayPlan) {
        monthlyPricing = Number(selectedPlan.price) / totalMonths;
        if (
          selectedPlan.plan_id === 'school_pp_250' &&
          Math.ceil(monthlyPricing) === 19
        ) {
          monthlyPricing = 20;
        }
        totalPricing = Number(selectedPlan.price);
      } else {
        monthlyPricing = Number(selectedPlan.price);
        totalPricing = monthlyPricing * totalMonths;
      }
    }
    const currrentSubscriptionName = get(
      paymentSubscription,
      'plan_detail.name'
    );
    const chosenPlanFromStore = this.getPlanFromStore();
    const selectedPlanName = currrentSubscriptionName;
    const subscriptionArr = selectedPlanName
      ? selectedPlanName.split(' ')
      : selectedPlan && selectedPlan.name
      ? selectedPlan.name.split(' ')
      : chosenPlanFromStore
      ? chosenPlanFromStore.split(' ')
      : [];
    const currentSubscriptionId =
      get(paymentSubscription, 'braintree_plan') || '';
    const cancelSubId = get(paymentSubscription, 'braintree_id') || '';

    const isFree = () => {
      return !subscriptionArr[0] || !subscriptionArr[1];
    };

    const yourPlanPlaceholder = () => {
      if (isFree()) {
        return 'Free up to 20 Readers';
      }
      if (selectedPlan) {
        return `${
          isPrePayPlan ? 'Pre-Paid' : 'Monthly Plan'
        } ${currentPlanName} up to ${selectedPlan.readers_max} Readers`;
      }
      const planDisplayName =
        subscriptionArr[0] === 'Year'
          ? 'Year Round'
          : subscriptionArr[0] === 'Summer'
          ? 'Summer Reading'
          : 'School Year';
      if (subscriptionArr.length === 2) {
        return `Monthly Plan ${planDisplayName} up to ${
          subscriptionArr[1]
        } Readers`;
      }
      return `Pre-Paid ${planDisplayName} up to ${subscriptionArr[2]} Readers`;
    };

    return (
      <form
        className={cx(
          classes.formWrapper,
          isChangePlan && classes.subscriptionDetailForm
        )}
        onSubmit={(e: any) => {
          e.preventDefault();
          const submitData = {
            payment_method_nonce: get(paymentPayload, 'nonce'),
            plan_id: currentSubscriptionId || subscriptionId,
          };
          createSubscriptionWithBraintree(submitData);
        }}>
        <Grid className={isChangePlan ? classes.paddingBottom20 : ''}>
          <Grid.Column width={9}>
            <Grid>
              {isChangePlan && (
                <Grid className={classes.ChangePlanFormWrapper}>
                  <ChangePlanForm
                    selectPlan={this.selectPlan}
                    plans={plans}
                    onCancel={this.closeChangePlan}
                    onSave={this.handleCreateSubscription}
                    currrentSubscriptionName={currrentSubscriptionName}
                    currrentSubscriptionId={
                      subscriptionId ||
                      currentSubscriptionId ||
                      (selectedPlan ? selectedPlan.plan_id : false)
                    }
                    oldSubId={currentSubscriptionId}
                    onChangeSubscription={changeSubcription}
                    saveLoading={changeSubscriptionLoading}
                    cancelSubId={cancelSubId}
                    onCancelSub={cancelSubscription}
                    cancelSubLoading={cancelSubscriptionLoading}
                    preSelectedPlanId={this.state.preSelectedPlanId}
                    numberOfReaders={numberOfReaders}
                    preSelected={!!planId && isEqual(paymentSubscription, {})}
                  />
                </Grid>
              )}
              {selectedPlan && (
                <Grid.Row className={classes.paymentMessage}>
                  <Grid.Column width={2}>
                    <Icon
                      name="warning"
                      circular
                      className={cx(classes.warningIcon, classes.blue)}
                    />
                  </Grid.Column>
                  <Grid.Column width={14}>
                    <Heading
                      headingProps={{
                        as: 'h4',
                        className: classes.paymentMessageHeading,
                      }}
                      type={HeadingType.BOLD_500}>
                      You have selected the:
                      <span className={classes.currentPlanName}>
                        {currentPlanName} -{' '}
                        {isPrePayPlan ? 'Pre-Paid' : 'Monthly Plan'}
                      </span>
                    </Heading>
                    <Heading
                      headingProps={{
                        as: 'h4',
                        className: classes.paymentMessageHeading,
                      }}
                      type={HeadingType.BOLD_500}
                      colorVariant={HeadingColor.CYAN}>
                      Up to {selectedPlan.readers_max} Readers at
                      <span>${Math.ceil(monthlyPricing)} per month</span>
                    </Heading>
                    <Heading
                      headingProps={{
                        as: 'h4',
                        className: classes.paymentMessageHeading,
                      }}
                      type={HeadingType.BOLD_500}
                      colorVariant={HeadingColor.CYAN}>
                      Total Due Today: $
                      {isPrePayPlan
                        ? Math.ceil(totalPricing)
                        : Math.ceil(monthlyPricing)}
                    </Heading>
                    <Heading
                      headingProps={{
                        as: 'h4',
                        className: cx(
                          classes.paymentMessageHeading,
                          classes.last
                        ),
                      }}
                      type={HeadingType.BOLD_500}>
                      You can change this plan, or finalize your payment below.
                    </Heading>
                  </Grid.Column>
                </Grid.Row>
              )}
              {isSelectedNewPlan && (
                <Grid.Row className={classes.paymentMessage}>
                  <Grid.Column width={16}>
                    <Heading
                      headingProps={{
                        as: 'h4',
                        className: classes.paymentGuideMessage,
                      }}
                      type={HeadingType.BOLD_500}>
                      Please enter your card information to complete updating
                      your subscription plan
                    </Heading>
                  </Grid.Column>
                </Grid.Row>
              )}
              <Grid.Row columns={3}>
                <Grid.Column width={10}>
                  <Input
                    label="Your Plan"
                    inputProps={{
                      placeholder: yourPlanPlaceholder(),
                      disabled: true,
                    }}
                  />
                </Grid.Column>
                <Grid.Column
                  width={6}
                  verticalAlign="bottom"
                  className={classes.changePlanButton}>
                  <Button
                    buttonProps={{
                      onClick: this.changePlan,
                      type: 'button',
                    }}
                    buttonType={ButtonType.ROUND}
                    colorVariant={ButtonColor.MAIN}>
                    Change Plan
                  </Button>
                </Grid.Column>
              </Grid.Row>
              <Grid.Row
                className={cx(
                  classes.paymentFormRow,
                  isChangePlan && classes.hide
                )}>
                {(meLoading ||
                  clientTokenLoading ||
                  createSubscriptionWithBraintreeLoading) && <Spinner />}
                {showErrorMessage && (
                  <div className={classes.errorMessage}>
                    Your card transaction failed. If you continue to have
                    issues, please contact{' '}
                    <a
                      href="mailto:help@readerzone.com"
                      title="mail to help@readerzone.com">
                      help@readerzone.com
                    </a>
                  </div>
                )}
                <Grid container className={classes.paymentForm}>
                  <Grid.Row>
                    <div
                      ref={ref => {
                        this.braintreeWrapper = ref;
                      }}
                      className={classes.braintreeForm}
                    />
                    <Button
                      buttonProps={{
                        id: 'submit-button',
                        type: 'button',
                        loading:
                          createSubscriptionWithBraintreeLoading || meLoading,
                        disabled:
                          !!currentSubscriptionId &&
                          currentSubscriptionId === subscriptionId &&
                          !isChangeBraintree,
                        className: cx(
                          classes.purchaseButton,
                          clientTokenLoading ? classes.visibleHidden : ''
                        ),
                      }}>
                      Purchase
                    </Button>
                  </Grid.Row>
                </Grid>
              </Grid.Row>
            </Grid>
          </Grid.Column>

          <Grid.Column
            width={6}
            floated="right"
            className={classes.purchaseOrderColumn}>
            <Grid>
              {/* Purchase Order Message */}
              <Grid.Row
                className={cx(
                  classes.paymentMessage,
                  classes.purchaseOrderMessage
                )}>
                <Grid.Column width={2}>
                  <Icon
                    name="warning"
                    circular
                    className={classes.warningIcon}
                  />
                </Grid.Column>
                <Grid.Column width={14}>
                  <Heading
                    headingProps={{
                      as: 'h4',
                      className: classes.purchaseOrderHeading,
                    }}>
                    Purchase Orders
                  </Heading>
                  <Heading
                    headingProps={{
                      as: 'h4',
                      className: classes.purchaseOrderText,
                    }}
                    type={HeadingType.BOLD_500}>
                    We welcome purchase orders from any organization. Use the
                    contact information below to request a draft invoice or
                    submit your PO.
                  </Heading>
                  <Heading
                    headingProps={{
                      as: 'h4',
                      className: cx(
                        classes.purchaseOrderText,
                        classes.purchaseOrderHighlightText
                      ),
                    }}
                    type={HeadingType.BOLD_500}
                    colorVariant={HeadingColor.CYAN}>
                    Email: help@readerzone.com
                  </Heading>
                  <Heading
                    headingProps={{
                      as: 'h4',
                      className: cx(
                        classes.purchaseOrderText,
                        classes.purchaseOrderHighlightText
                      ),
                    }}
                    type={HeadingType.BOLD_500}
                    colorVariant={HeadingColor.CYAN}>
                    Phone: 208-888-5160
                  </Heading>
                  <Heading
                    headingProps={{
                      as: 'h4',
                      className: classes.purchaseOrderText,
                    }}
                    type={HeadingType.BOLD_500}>
                    Your account will be active upon receipt of an executed PO.
                  </Heading>
                  <Heading
                    headingProps={{
                      as: 'h4',
                      className: classes.purchaseOrderText,
                    }}
                    type={HeadingType.BOLD_500}>
                    Please call or email with questions, we'd love to help!
                  </Heading>
                </Grid.Column>
              </Grid.Row>
            </Grid>
          </Grid.Column>
        </Grid>
      </form>
    );
  }
}

export default Payments;
