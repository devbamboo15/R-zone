import * as React from 'react';
import themr from 'src/helpers/themr';
import cx from 'classnames';
import Select from 'src/components/FormFields/Select';
import get from 'lodash/get';
import isEmpty from 'lodash/isEmpty';
import values from 'lodash/values';
import Button, { ButtonColor, ButtonType } from 'src/components/Button';
import { Grid } from 'semantic-ui-react';
import Heading, { HeadingColor, HeadingType } from 'src/components/Heading';
import SelectCheck from 'assets/icons/select_check.svg';
import SaveSvg from 'assets/icons/save.svg';
import { confirmModal } from 'src/components/Modal/ConfirmationModal';
import Spinner from 'src/components/Spinner';
import history from 'src/helpers/history';
import urls from 'src/helpers/urls';
import styles from './styles.scss';

export interface SettingForm {
  first_name?: string;
  last_name?: string;
  email?: string;
  password?: string;
  new_password?: string;
  confirm_password?: string;
  toggle1?: boolean;
  toggle2?: boolean;
  toggle3?: boolean;
}
export type ChangePlanFormProps = IComponentProps & {
  selectPlan: Function;
  plans?: any;
  onCancel: () => void;
  onSave: Function;
  onChangeSubscription: Function;
  onCancelSub: Function;
  currrentSubscriptionName: string;
  currrentSubscriptionId: string;
  cancelSubId: string;
  saveLoading: boolean;
  cancelSubLoading: boolean;
  oldSubId: string;
  preSelectedPlanId?: any;
  numberOfReaders?: string;
  preSelected?: boolean;
};

const makePlans = (plans): any[] => {
  return values(get(plans, 'school', {})).map(item => ({
    text: item.readers_max,
    value: item.readers_max,
  }));
};

const getPrice = (plans, planType, readerType, perMonth) => {
  const currentPlan = get(plans, planType) || [];
  const currentType = currentPlan.find(p => p.readers_max === readerType) || {};
  const currentPrice = !isEmpty(currentType) ? currentType.price : 0;
  const isPrePay = (currentType.category || '').indexOf('_pp') > -1;
  let totalMonths = 1;
  if ((currentType.category || '').indexOf('school') > -1) {
    // if it is school plans
    totalMonths = 11;
  } else if ((currentType.category || '').indexOf('summer') > -1) {
    // if it is summer plans
    totalMonths = 5;
  } else if ((currentType.category || '').indexOf('year') > -1) {
    // if it is year plans
    totalMonths = 10;
    if (!isPrePay) {
      // if it is not pre pay then count 12 months
      totalMonths = 12;
    }
  }
  if (isPrePay) {
    // if it is pre-pay
    if (perMonth) {
      let pricePerMonth = Math.ceil(currentPrice / totalMonths);
      if (currentType.plan_id === 'school_pp_250' && pricePerMonth === 19) {
        pricePerMonth = 20;
      }
      return pricePerMonth;
    }
    return currentPrice;
  }
  // if it is not pre-pay
  if (perMonth) {
    return currentPrice;
  }
  return Math.ceil(currentPrice * totalMonths);
};
const getSubId = (plans, planType, readerType) => {
  const currentPlan = get(plans, planType) || [];
  const currentType = currentPlan.find(p => p.readers_max === readerType) || {};
  return currentType.plan_id;
};

const findPlanById = (plans, planId) => {
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

const ChangePlanForm = (props: ChangePlanFormProps) => {
  const {
    classes,
    selectPlan,
    plans,
    onCancel,
    onSave,
    cancelSubId,
    currrentSubscriptionId,
    saveLoading,
    onCancelSub,
    cancelSubLoading,
    preSelectedPlanId,
    numberOfReaders,
  } = props;
  const subscriptionArr = currrentSubscriptionId
    ? currrentSubscriptionId.split('_')
    : [];
  const allPlans = makePlans(plans);

  let initialPlan = null;
  let selected = null;

  if (subscriptionArr[1]) {
    if (subscriptionArr[1] === 'pp') {
      initialPlan = parseInt(subscriptionArr[2], 10);
    } else {
      initialPlan = parseInt(subscriptionArr[1], 10);
    }
  } else if (preSelectedPlanId) {
    selected = findPlanById(plans, preSelectedPlanId);
    if (selectPlan) {
      initialPlan = selected.readers_max;
    }
  } else if (numberOfReaders) {
    initialPlan = numberOfReaders;
  }

  if (!initialPlan) initialPlan = get(allPlans[0], 'value');

  const initialSubscription =
    subscriptionArr[1] === 'pp'
      ? `${subscriptionArr[0]}_${subscriptionArr[1]}`
      : subscriptionArr[0]
      ? subscriptionArr[0]
      : '';
  const [feSelectPlan, setFeSelectPlan] = React.useState('');
  const [selectedPlan, setSelectedPlan] = React.useState(initialPlan);
  const [selectedSubscription] = React.useState(() => {
    if (selected) {
      const planIdArr = selected.plan_id.split('_');
      if (planIdArr.length === 3) {
        return `${planIdArr[0]}_${planIdArr[1]}`;
      }
      return planIdArr[0];
    }
    return initialSubscription;
  });

  const displayPlans = {
    school: get(plans, 'school') || [],
    school_pp: get(plans, 'school_pp') || [],
    year: get(plans, 'year') || [],
    year_pp: get(plans, 'year_pp') || [],
    summer: get(plans, 'summer') || [],
    summer_pp: get(plans, 'summer_pp') || [],
  };

  const isActivePlan = plan => {
    return (
      (subscriptionArr[subscriptionArr.length - 1] || '').toString() ===
        (selectedPlan || '').toString() && selectedSubscription === plan
    );
  };

  return (
    <>
      <Grid.Row className={classes.selectedReaderOfNumbersWrapper}>
        <Grid.Column width={11}>
          {cancelSubLoading && <Spinner />}
          <Select
            selectProps={{
              options: allPlans || [],
              placeholder: 'Select Your Number of readers',
              name: 'payment_method',
              value: selectedPlan,
              onChange: (_, { value }) => {
                setSelectedPlan(value);
              },
            }}
            label="Update Your Number of Readers"
          />
        </Grid.Column>
      </Grid.Row>
      {selectedPlan === 100000 ? (
        <Grid.Row columns={3} stretched>
          <Grid.Column>
            <div
              className={cx(
                classes.planColumn,
                classes.planMoreColumn,
                classes.planMonthly
              )}>
              <div className={classes.pricingItem}>
                <div
                  className={cx(
                    classes.pricingTitle,
                    classes.plan_primary,
                    classes.planHeader
                  )}>
                  <Heading
                    type={HeadingType.BOLD_600}
                    headingProps={{ as: 'h2' }}
                    colorVariant={HeadingColor.WHITE}>
                    Summer Reading
                  </Heading>
                  <Heading
                    type={HeadingType.BOLD_600}
                    headingProps={{ as: 'p' }}
                    colorVariant={HeadingColor.WHITE}>
                    May 1st - Sept 30th
                  </Heading>
                </div>
                <div className={classes.pricingDescription}>
                  <Heading headingProps={{ as: 'h4' }}>
                    Please Call
                    <br />
                    <a href="tel:1-800-824-4789">1-800-824-4789</a>
                  </Heading>
                </div>
              </div>
            </div>
          </Grid.Column>
          <Grid.Column>
            <div
              className={cx(
                classes.planColumn,
                classes.planMoreColumn,
                classes.planSummer
              )}>
              <div className={classes.pricingItem}>
                <div
                  className={cx(
                    classes.pricingTitle,
                    classes.plan_primary,
                    classes.planHeader
                  )}>
                  <Heading
                    type={HeadingType.BOLD_600}
                    headingProps={{ as: 'h2' }}
                    colorVariant={HeadingColor.WHITE}>
                    School Year
                  </Heading>
                  <Heading
                    type={HeadingType.BOLD_600}
                    headingProps={{ as: 'p' }}
                    colorVariant={HeadingColor.WHITE}>
                    Aug 1st - June 30th
                  </Heading>
                </div>
                <div className={classes.pricingDescription}>
                  <Heading headingProps={{ as: 'h4' }}>
                    Please Call
                    <br />
                    <a href="tel:1-800-824-4789">1-800-824-4789</a>
                  </Heading>
                </div>
              </div>
            </div>
          </Grid.Column>
          <Grid.Column>
            <div
              className={cx(
                classes.planColumn,
                classes.planMoreColumn,
                classes.planPrepay
              )}>
              <div className={classes.pricingItem}>
                <div
                  className={cx(
                    classes.pricingTitle,
                    classes.plan_primary,
                    classes.planHeader
                  )}>
                  <Heading
                    type={HeadingType.BOLD_600}
                    headingProps={{ as: 'h2' }}
                    colorVariant={HeadingColor.WHITE}>
                    Year Round!
                  </Heading>
                  <Heading
                    type={HeadingType.BOLD_600}
                    headingProps={{ as: 'p' }}
                    colorVariant={HeadingColor.WHITE}>
                    Pre-Pay & get 2 months free
                  </Heading>
                </div>
                <div className={classes.pricingDescription}>
                  <Heading headingProps={{ as: 'h4' }}>
                    Please Call
                    <br />
                    <a href="tel:1-800-824-4789">1-800-824-4789</a>
                  </Heading>
                </div>
              </div>
            </div>
          </Grid.Column>
        </Grid.Row>
      ) : (
        <>
          <label className={classes.selectPlanLabel}>Select Plan</label>
          <div className={classes.paymentList}>
            <Grid.Row columns={3} className={classes.selectPlanTop}>
              {Object.keys(displayPlans)
                .filter(
                  plan =>
                    ['school_pp', 'year_pp', 'summer_pp'].indexOf(plan) !== -1
                )
                .map(plan => (
                  <Grid.Column
                    className={cx(
                      classes.planColumn,
                      isActivePlan(plan) && classes.actived,
                      feSelectPlan === plan && classes.feActived,
                      {
                        [classes.sub_primary]: plan === 'school_pp',
                        [classes.sub_red]: plan === 'year_pp',
                        [classes.sub_secondary]: plan === 'summer_pp',
                      }
                    )}
                    key={plan}>
                    <div className={classes.pricingItem}>
                      <div
                        className={cx(classes.pricingTitle, {
                          [classes.plan_primary]: plan === 'school_pp',
                          [classes.plan_red]: plan === 'year_pp',
                          [classes.plan_secondary]: plan === 'summer_pp',
                        })}>
                        <Heading
                          type={HeadingType.BOLD_600}
                          headingProps={{ as: 'h5' }}
                          colorVariant={HeadingColor.WHITE}>
                          {plan.replace('_pp', '')}{' '}
                          {plan.includes('school')
                            ? 'Year'
                            : plan.includes('year')
                            ? 'Round!'
                            : 'Reading'}{' '}
                          <br />
                          <span>
                            {plan.includes('school')
                              ? 'Aug 1st - June 30th'
                              : plan.includes('year')
                              ? 'Two months free'
                              : 'May 1st - Sept 30th'}
                          </span>
                        </Heading>
                        <Heading
                          type={HeadingType.BOLD_600}
                          headingProps={{ as: 'h6' }}
                          colorVariant={HeadingColor.WHITE}
                        />
                      </div>
                      <div className={classes.pricingDescription}>
                        <div className={classes.price}>
                          <Heading
                            headingProps={{
                              as: 'h3',
                              className: classes.priceInner,
                            }}>
                            <span className={classes.priceDes}>Pre Paid</span>
                            <span className={classes.priceContent}>
                              <span className={classes.priceIcon}>$</span>
                              <span
                                className={classes.pricePerMonth}>{` ${getPrice(
                                plans,
                                plan,
                                selectedPlan,
                                true
                              )
                                .toString()
                                .substring(0, 4)}`}</span>
                              /mo
                            </span>
                          </Heading>
                        </div>
                        <div className={classes.action}>
                          {isActivePlan(plan) && (
                            <Heading
                              headingProps={{
                                as: 'h3',
                                className: classes.priceYourPlan,
                              }}>
                              Your Plan
                            </Heading>
                          )}
                          <Heading
                            headingProps={{
                              as: 'h3',
                              className: classes.priceTotal,
                            }}>
                            <span>{`$${getPrice(
                              plans,
                              plan,
                              selectedPlan,
                              false
                            )}`}</span>
                            <span>Total</span>
                          </Heading>
                          {!isActivePlan(plan) && (
                            <Button
                              icon={
                                feSelectPlan === plan && (
                                  <SelectCheck height={20} />
                                )
                              }
                              buttonProps={{
                                onClick: () => {
                                  setFeSelectPlan(plan);
                                },
                                type: 'button',
                              }}
                              buttonType={ButtonType.ROUND}
                              colorVariant={
                                plan === 'monthly'
                                  ? ButtonColor.SECONDARY
                                  : plan === 'prepay'
                                  ? ButtonColor.DANGER
                                  : ButtonColor.MAIN
                              }>
                              {feSelectPlan !== plan && 'Select'}
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </Grid.Column>
                ))}
            </Grid.Row>
            <Grid.Row columns={3} className={classes.selectPlanBottom}>
              {Object.keys(displayPlans)
                .filter(
                  plan => ['school', 'year', 'summer'].indexOf(plan) !== -1
                )
                .map(plan => (
                  <Grid.Column
                    className={cx(
                      classes.planColumn,
                      isActivePlan(plan) && classes.actived,
                      feSelectPlan === plan && classes.feActived,
                      {
                        [classes.sub_primary]: plan === 'school',
                        [classes.sub_red]: plan === 'year',
                        [classes.sub_secondary]: plan === 'summer',
                      }
                    )}
                    key={plan}>
                    <div className={classes.pricingItem}>
                      {/* <div
                        className={cx(classes.pricingTitle, {
                          [classes.plan_primary]: plan === 'school',
                          [classes.plan_red]: plan === 'year',
                          [classes.plan_secondary]: plan === 'summer',
                        })}>
                        <Heading
                          type={HeadingType.BOLD_600}
                          headingProps={{ as: 'h5' }}
                          colorVariant={HeadingColor.WHITE}>
                          {plan} Readers <br />
                          Monthly Fee
                        </Heading>
                        <Heading
                          type={HeadingType.BOLD_600}
                          headingProps={{ as: 'h6' }}
                          colorVariant={HeadingColor.WHITE}
                        />
                      </div> */}
                      <div className={classes.pricingDescription}>
                        <div className={classes.price}>
                          <Heading
                            headingProps={{
                              as: 'h3',
                              className: classes.priceInner,
                            }}>
                            <span className={classes.priceDes}>
                              <span>Monthly</span>
                              <span>Cancel Anytime</span>
                            </span>
                            <span className={classes.priceContent}>
                              <span className={classes.priceIcon}>$</span>
                              <span
                                className={classes.pricePerMonth}>{` ${getPrice(
                                plans,
                                plan,
                                selectedPlan,
                                true
                              )
                                .toString()
                                .substring(0, 4)}`}</span>
                              /mo
                            </span>
                          </Heading>
                        </div>
                        <div className={classes.action}>
                          {isActivePlan(plan) && (
                            <Heading
                              headingProps={{
                                as: 'h3',
                                className: classes.priceYourPlan,
                              }}>
                              Your Plan
                            </Heading>
                          )}
                          <Heading
                            headingProps={{
                              as: 'h3',
                              className: classes.priceTotal,
                            }}>{`$${getPrice(
                            plans,
                            plan,
                            selectedPlan,
                            false
                          )} Total`}</Heading>
                          {!isActivePlan(plan) && (
                            <Button
                              icon={
                                feSelectPlan === plan && (
                                  <SelectCheck height={20} />
                                )
                              }
                              buttonProps={{
                                onClick: () => {
                                  setFeSelectPlan(plan);
                                },
                                type: 'button',
                              }}
                              buttonType={ButtonType.ROUND}
                              colorVariant={
                                plan === 'monthly'
                                  ? ButtonColor.SECONDARY
                                  : plan === 'prepay'
                                  ? ButtonColor.DANGER
                                  : ButtonColor.MAIN
                              }>
                              {feSelectPlan !== plan && 'Select'}
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </Grid.Column>
                ))}
            </Grid.Row>
          </div>
        </>
      )}
      <Grid.Row>
        <Grid.Column width={16} className={classes.buttonGroups}>
          {cancelSubId && (
            <a
              href="#"
              className={classes.cancelSubLink}
              onClick={() => {
                confirmModal.open({
                  message: 'You will cancel your subcription. Are you sure?',
                  onOkClick: () => {
                    const data = {
                      subscription_id: cancelSubId,
                    };
                    onCancelSub(data, () => {
                      onCancel();
                    });
                  },
                });
              }}>
              Cancel Subscription
            </a>
          )}
          <div className={classes.buttonCancel}>
            <Button
              colorVariant={ButtonColor.DANGER_FADE}
              buttonProps={{
                type: 'button',
                onClick: onCancel,
              }}
              buttonType={ButtonType.ROUND}>
              <Heading
                headingProps={{ as: 'h4' }}
                type={HeadingType.BOLD_600}
                colorVariant={HeadingColor.WHITE}>
                Cancel
              </Heading>
            </Button>
          </div>
          <Button
            icon={<SaveSvg height={20} />}
            colorVariant={ButtonColor.PRIMARY}
            buttonProps={{
              type: 'button',
              loading: saveLoading,
              disabled: !feSelectPlan || selectedPlan === 100000,
              onClick: () => {
                const selectedSubId = getSubId(
                  plans,
                  feSelectPlan,
                  selectedPlan
                );
                const subArr = get(plans, feSelectPlan);
                const sub = subArr.find(s => s.plan_id === selectedSubId);
                onSave(selectedSubId);
                selectPlan(sub);
                onCancel();
                history.replace(`${urls.MYACCOUNT_TAB({ tab: 'payments' })}`);
              },
            }}
            buttonType={ButtonType.ROUND}>
            <Heading
              headingProps={{ as: 'h4' }}
              type={HeadingType.BOLD_600}
              colorVariant={HeadingColor.WHITE}>
              Save
            </Heading>
          </Button>
        </Grid.Column>
      </Grid.Row>
      {/* <Grid.Row>
        <Grid.Column width={8}>
          <Select
            selectProps={{
              options: [
                {
                  text: 'Credit Card',
                  value: '1',
                },
              ],
              placeholder: 'Select ',
              name: 'payment_method',
              value: '1',
              disabled: true,
            }}
            label="Payment Method"
          />
        </Grid.Column>
      </Grid.Row> */}
    </>
  );
};

export default themr<ChangePlanFormProps>('ChangePlanForm', styles)(
  ChangePlanForm
);
