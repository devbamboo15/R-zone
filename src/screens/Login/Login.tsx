import * as React from 'react';
import cx from 'classnames';
import ReCAPTCHA from 'react-google-recaptcha';
import { Redirect, Link } from 'react-router-dom';
import { Formik } from 'formik';
import * as Yup from 'yup';
import themr from 'src/helpers/themr';
import LoginHeader from 'src/components/LoginHeader';
import Button, { ButtonColor, ButtonType } from 'src/components/Button';
import { Form, Container, Icon, Grid } from 'semantic-ui-react';
import Input from 'src/components/FormFields/Input';
import urls from 'src/helpers/urls';
import * as queryString from 'query-string';
import get from 'lodash/get';
import isEmpty from 'lodash/isEmpty';
import { toast } from 'react-toastify';
import Select from 'src/components/FormFields/Select';
import Const from 'src/helpers/const';
import { Role } from 'src/screens/Signup/Steps/ZoneType';
import styles from '../Signup/styles.scss';
import loginStyles from './styles.scss';
import PaymentForm from './PaymentForm';

export type LoginProps = IScreenProps & {
  doLogin: Function;
  resetRegister: Function;
  checkSignupEmail: Function;
  doLogout: Function;
  doRegisterSkeepOrg: Function;
  createSubscriptionWithBraintree: Function;
  getAllPlans: Function;
  setFirstPayment: Function;
  isLoggingIn?: boolean;
  isLoggedIn?: boolean;
  fetchingProfile?: boolean;
  checkExistingEmailLoading?: boolean;
  registerSkeepOrgLoading?: boolean;
  existingEmail?: boolean;
  profileId?: string;
  registerStatus?: string;
  profileEmail?: string;
  profileRole?: string;
  plans: any;
  paymentSubscription: any;
  createSubscriptionWithBraintreeLoading: boolean;
  createSubscriptionWithBraintreeError: any;
};

const organizationType = [
  { text: 'School', value: 'school' },
  { text: 'School Library', value: 'school-library' },
  { text: 'Public Library', value: 'public-library' },
  { text: 'Classroom', value: 'classroom' },
  { text: 'Family', value: 'Family' },
  { text: 'Book Club', value: 'book-club' },
  { text: 'Other', value: 'other' },
];

const switchPlans = {
  school_: 'school_pp_',
  school_pp_: 'school_',
  summer_: 'summer_pp_',
  summer_pp_: 'summer_',
  year_: 'year_pp_',
  year_pp_: 'year_',
};

class Login extends React.Component<LoginProps> {
  state = {
    captchaLoaded: false,
    captchaToken: null,
    showPassword: false,
    showPasswordSignup: false,
    emailExistMode: false,
    existingEmailValue: '',
    step: 1,
    selectedPlanId: '',
    currentPaymentInfo: null,
    loadedBraintreeToken: false,
    showConfirmationPassword: false,
  };

  signupform: Formik<any> | null = null;

  captchaRef: any | null = null;

  captchaOnSuccess: Function | null = null;

  asyncScriptOnLoad = () => {
    this.setState({ captchaLoaded: true });
  };

  onSubmit = values => {
    const { history } = this.props;
    const params = queryString.parse(history.location.search);
    const searchRef = get(params, 'ref');
    this.props.doLogin(
      values.email,
      values.password,
      values.captchaToken,
      null,
      searchRef
    );
  };

  onTooglePassword = (isSignup?: boolean, isConfirm?: boolean) => {
    if (!isSignup) {
      if (isConfirm) {
        this.setState((preState: any) => ({
          ...preState,
          showConfirmationPassword: !preState.showConfirmationPassword,
        }));
      } else {
        this.setState((preState: any) => ({
          ...preState,
          showPassword: !preState.showPassword,
        }));
      }
    } else {
      this.setState((preState: any) => ({
        ...preState,
        showPasswordSignup: !preState.showPasswordSignup,
      }));
    }
  };

  findPlanById = (plans, planId, isPP?, isMonthly?) => {
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
      let currentType = null;
      if (isPP || isMonthly) {
        if (isPP) {
          const planIdArr = planId.split('_');
          const planIdCP = `${planIdArr[0]}_pp_${planIdArr[1]}`;
          if (currentPlan) {
            currentType = currentPlan.find(p => p.plan_id === planIdCP);
          }
        } else {
          const planIdCP = planId.replace('_pp', '');
          if (currentPlan) {
            currentType = currentPlan.find(p => p.plan_id === planIdCP);
          }
        }
      } else if (currentPlan) {
        currentType = currentPlan.find(p => p.plan_id === planId);
      }

      if (currentType) {
        result = currentType;
      }

      return true;
    });

    return result;
  };

  setCaptchaToken = (value: string, cb?: Function) => {
    if (cb) {
      this.setState({ captchaToken: value }, () => {
        cb();
      });
    } else {
      this.setState({ captchaToken: value });
    }
  };

  componentDidMount() {
    const { getAllPlans, history } = this.props;
    getAllPlans();
    const params = queryString.parse(history.location.search);
    const preSelectedPlanId = get(params, 'pre_selected_planid');
    this.setState({
      selectedPlanId: preSelectedPlanId,
    });
  }

  componentDidUpdate(prevProps: LoginProps) {
    const {
      checkExistingEmailLoading,
      existingEmail,
      history,
      createSubscriptionWithBraintreeLoading,
      createSubscriptionWithBraintreeError,
      fetchingProfile,
      isLoggedIn,
    } = this.props;
    const params = queryString.parse(history.location.search);
    const preSelectedPlanId = get(params, 'pre_selected_planid');
    if (preSelectedPlanId && preSelectedPlanId !== this.state.selectedPlanId) {
      this.setState({
        selectedPlanId: preSelectedPlanId,
      });
    }
    if (
      !createSubscriptionWithBraintreeLoading &&
      prevProps.createSubscriptionWithBraintreeLoading !==
        createSubscriptionWithBraintreeLoading
    ) {
      if (!createSubscriptionWithBraintreeError) {
        this.setState({
          currentPaymentInfo: true,
        });
      } else {
        const element: HTMLElement = document.getElementsByClassName(
          'braintree-toggle'
        )[0] as HTMLElement;
        element.click();
        this.setState({
          currentPaymentInfo: null,
        });
      }
    }
    if (
      !checkExistingEmailLoading &&
      checkExistingEmailLoading !== prevProps.checkExistingEmailLoading
    ) {
      if (!existingEmail) {
        this.setState({
          step: 2,
        });
        this.signupform.handleReset();
      } else {
        toast.error(
          'This email is associated with an existing Reader Zone account. To use this email for another account type, please login and delete the account. Then, you can re-use the email for different account type'
        );

        // We temporary remove emailExistMode and do not redirect user to Login page
        // https://tasks.getventive.com/projects/C5736-6CD
        /* this.setState({
          emailExistMode: true,
        }); */
      }
    }
    if (
      !fetchingProfile &&
      fetchingProfile !== prevProps.fetchingProfile &&
      isLoggedIn
    ) {
      this.setState({
        emailExistMode: false,
      });
    }
  }

  render() {
    const {
      classes,
      isLoggingIn,
      isLoggedIn,
      history,
      profileId,
      plans,
      fetchingProfile,
      checkSignupEmail,
      checkExistingEmailLoading,
      existingEmail,
      doRegisterSkeepOrg,
      registerSkeepOrgLoading,
      createSubscriptionWithBraintree,
      createSubscriptionWithBraintreeLoading,
      createSubscriptionWithBraintreeError,
      profileEmail,
      paymentSubscription,
      setFirstPayment,
      profileRole,
      doLogout,
    } = this.props;

    const {
      captchaLoaded,
      captchaToken,
      emailExistMode,
      step,
      existingEmailValue,
      currentPaymentInfo,
      loadedBraintreeToken,
    } = this.state;

    const params = queryString.parse(history.location.search);
    const preSelectedPlanId = get(params, 'pre_selected_planid');
    let numberOfReaders = 20;
    if (preSelectedPlanId && preSelectedPlanId !== 'free') {
      const planIdObj = preSelectedPlanId.split('_');
      if (planIdObj[1] === 'pp') {
        numberOfReaders = parseInt(planIdObj[2], 10);
      } else {
        numberOfReaders = parseInt(planIdObj[1], 10);
      }
    }

    const isFree = () => {
      return (
        (preSelectedPlanId && numberOfReaders === 20) ||
        preSelectedPlanId === 'free'
      );
    };
    const isLoggedInAndSelectPlan = () => {
      return isLoggedIn && profileId && preSelectedPlanId;
    };

    if (isLoggedIn && profileId && (!preSelectedPlanId || isFree())) {
      if (!isFree() && preSelectedPlanId) {
        return (
          <Redirect
            to={`${urls.MYACCOUNT_TAB({
              tab: 'payments',
            })}?pre_selected_planid=${preSelectedPlanId}`}
          />
        );
      }
      let redirectUrl = urls.HOME();
      if (profileRole === Role.READER || profileRole === Role.PARENT) {
        redirectUrl = urls.SETUP({ role: profileRole });
      } else {
        redirectUrl = urls.PROGRAMS();
      }
      return <Redirect to={redirectUrl} />;
    }

    let selectedPlan = null;
    let selectedPlanPP = null;
    let selectedPlanMonthly = null;
    if (!isEmpty(plans) && preSelectedPlanId)
      selectedPlan = this.findPlanById(plans, preSelectedPlanId);
    selectedPlanPP =
      preSelectedPlanId && !preSelectedPlanId.includes('_pp')
        ? this.findPlanById(plans, preSelectedPlanId, true)
        : null;
    selectedPlanMonthly =
      preSelectedPlanId && preSelectedPlanId.includes('_pp')
        ? this.findPlanById(plans, preSelectedPlanId, false, true)
        : null;
    if (isFree()) {
      selectedPlan = { id: 1, readers_max: 20 };
    }
    let currentPlanName = '';
    let monthlyPricing = 0;
    let totalPricing = 0;
    const isPrePayPlan =
      selectedPlan && (selectedPlan.category || '').indexOf('_pp') > -1;
    let totalMonths = 1;

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

    const getColorOfPlan = () => {
      const planCategory = get(selectedPlan, 'category', '').replace('_pp', '');
      return planCategory === 'school'
        ? classes.loginStyles.School
        : planCategory === 'summer'
        ? classes.loginStyles.Summer
        : planCategory === 'year'
        ? classes.loginStyles.Year
        : isFree()
        ? classes.loginStyles.Free
        : '';
    };
    const showPaymentMessage = !(currentPaymentInfo && loadedBraintreeToken);

    const renderFreeMonth = () => {
      if (!isFree()) {
        const planCategory = get(selectedPlan, 'category', '').replace(
          '_pp',
          ''
        );
        if (planCategory.includes('year')) {
          return isPrePayPlan ? '2 Months FREE!' : 'Cancel Anytime!';
        }
        // return `Over ${totalMonths} MONTHS!`;
        return '';
      }
      return '';
    };

    const LoginForm = (hasPlan?: boolean) => {
      return (
        <div
          className={cx(
            classes.mainStyles.formPanel,
            emailExistMode && classes.loginStyles.emailExistMode,
            emailExistMode && classes.loginStyles.step2
          )}>
          <h2>Login</h2>
          {hasPlan && (
            <p>Sign in to continue if you already have a Reader Zone account</p>
          )}
          {emailExistMode && (
            <p>
              Looks like this email is already associated with a Reader Zone
              account, please enter your password to login
            </p>
          )}
          <Formik
            onSubmit={values => {
              if (this.captchaRef) {
                if (captchaToken) {
                  this.onSubmit({ ...values, captchaToken });
                } else {
                  this.captchaOnSuccess = token => {
                    this.onSubmit({ ...values, captchaToken: token });
                  };
                  this.captchaRef.execute();
                }
              }
            }}
            initialValues={{
              email:
                existingEmail && !!existingEmailValue ? existingEmailValue : '',
              password: '',
            }}
            validationSchema={Yup.object().shape({
              email: Yup.string()
                .required('Email is required')
                .email('Email is invalid'),
              password: Yup.string().required('Password is required'),
            })}>
            {formProps => {
              return (
                <Form
                  onSubmit={formProps.handleSubmit}
                  className={classes.mainStyles.loginForm}>
                  <Input
                    label="Email Address"
                    inputProps={{
                      name: 'email',
                      type: 'email',
                      value: formProps.values.email,
                      onChange: formProps.handleChange,
                      onBlur: formProps.handleBlur,
                    }}
                    classes={{ column: classes.mainStyles.inputField }}
                    errorMessage={
                      formProps.touched.email &&
                      (formProps.errors.email as string)
                    }
                  />
                  <Input
                    label="Password"
                    inputProps={{
                      name: 'password',
                      type:
                        this.state.showPassword === true ? 'text' : 'password',
                      value: formProps.values.password,
                      icon: (
                        <Icon
                          name={
                            this.state.showPassword === true
                              ? 'eye'
                              : 'eye slash'
                          }
                          link
                          onClick={() => this.onTooglePassword()}
                        />
                      ),
                      onChange: formProps.handleChange,
                      onBlur: formProps.handleBlur,
                    }}
                    classes={{ column: classes.mainStyles.inputField }}
                    errorMessage={
                      formProps.touched.password &&
                      (formProps.errors.password as string)
                    }
                  />
                  <div className={classes.mainStyles.center}>
                    <Form.Group
                      grouped
                      className={
                        emailExistMode
                          ? classes.loginStyles.buttonGroupLogin
                          : ''
                      }>
                      {emailExistMode && (
                        <Button
                          colorVariant={ButtonColor.DANGER}
                          buttonType={ButtonType.ROUND}
                          buttonProps={{
                            size: 'large',
                            type: 'button',
                            onClick: () => {
                              this.setState({
                                emailExistMode: false,
                                existingEmailValue: '',
                              });
                            },
                          }}>
                          Cancel
                        </Button>
                      )}
                      <Button
                        colorVariant={
                          !hasPlan ? ButtonColor.SECONDARY : ButtonColor.PRIMARY
                        }
                        buttonType={ButtonType.ROUND}
                        buttonProps={{
                          disabled: !captchaLoaded,
                          size: 'large',
                          type: 'submit',
                          loading: isLoggingIn || fetchingProfile,
                        }}>
                        Login
                      </Button>
                    </Form.Group>
                    <p>
                      Forgot your password?{' '}
                      <Link to="/forget-password">Click Here</Link>
                    </p>
                  </div>
                </Form>
              );
            }}
          </Formik>
        </div>
      );
    };

    const signupForm = () => {
      return (
        <div
          className={cx(
            classes.mainStyles.formPanel,
            step > 1
              ? classes.loginStyles.registerSkeepOrStep2
              : classes.loginStyles.registerSkeepOrStep1,
            step === 3 ? classes.loginStyles.registerSkeepOrStep2New : ''
          )}>
          <h2>
            {step === 2
              ? 'Finish Setting Up'
              : step === 3
              ? `Tell us a little about your Organization`
              : `Don't have an account yet?`}
          </h2>
          {step === 1 && <p>Sign up here to get started</p>}
          <Formik
            onSubmit={formPropsValue => {
              if (step === 1) {
                checkSignupEmail(formPropsValue.email);
                this.setState({
                  existingEmailValue: formPropsValue.email,
                });
              } else if (step === 3) {
                if (this.captchaRef) {
                  if (captchaToken) {
                    const data = {
                      email: formPropsValue.email,
                      firstName: formPropsValue.first_name,
                      lastName: formPropsValue.last_name,
                      password: formPropsValue.password,
                      confirmPassword: formPropsValue.confirm_password,
                      organization: {
                        name: formPropsValue.name,
                        organization_type: formPropsValue.organization_type,
                      },
                      captchaToken,
                    };
                    doRegisterSkeepOrg(
                      data,
                      preSelectedPlanId,
                      numberOfReaders,
                      isFree()
                        ? () => {
                            history.push(urls.SIGNUP_CONFIRMATION());
                          }
                        : null
                    );
                  } else {
                    this.captchaOnSuccess = token => {
                      const data = {
                        email: formPropsValue.email,
                        firstName: formPropsValue.first_name,
                        lastName: formPropsValue.last_name,
                        password: formPropsValue.password,
                        confirmPassword: formPropsValue.confirm_password,
                        organization: {
                          name: formPropsValue.name,
                          organization_type: formPropsValue.organization_type,
                        },
                        captchaToken: token,
                      };
                      doRegisterSkeepOrg(
                        data,
                        preSelectedPlanId,
                        numberOfReaders,
                        isFree()
                          ? () => {
                              history.push(urls.SIGNUP_CONFIRMATION());
                            }
                          : null
                      );
                    };
                    this.captchaRef.execute();
                  }
                }
              } else {
                this.setState({
                  step: 3,
                });
              }
            }}
            initialValues={{
              email: existingEmailValue,
              first_name: '',
              last_name: '',
              password: '',
              name: '',
              organization_type: '',
              confirm_password: '',
              captchaToken: null,
            }}
            ref={(el: Formik<any> | null): void => {
              this.signupform = el;
            }}
            validationSchema={Yup.object().shape({
              email: Yup.string()
                .required('Email is required')
                .email('Email is invalid'),
              first_name:
                step !== 2
                  ? Yup.string()
                  : Yup.string().required('First Name is required'),
              name:
                step !== 3
                  ? Yup.string()
                  : Yup.string().required('Organization name is required'),
              organization_type:
                step !== 3
                  ? Yup.string()
                  : Yup.string().required('Please select Organization Type'),
              last_name:
                step !== 2
                  ? Yup.string()
                  : Yup.string().required('Last Name is required'),
              password:
                step !== 2
                  ? Yup.string()
                  : Yup.string()
                      .min(6, 'Required minimum of 8 characters')
                      .required('Required minimum of 8 characters')
                      .matches(Const.PASSWORD_PATTERN, {
                        message:
                          'Password must contain at least one numerical and uppercase letter',
                        excludeEmptyString: false,
                      }),
              confirm_password:
                step !== 2
                  ? Yup.string()
                  : Yup.string()
                      .oneOf(
                        [Yup.ref('password'), null],
                        'Passwords must match'
                      )
                      .required('Required minimum of 8 characters'),
            })}>
            {formProps => {
              return (
                <Form
                  onSubmit={formProps.handleSubmit}
                  className={classes.mainStyles.loginForm}>
                  {step === 2 ? (
                    <>
                      <label className={classes.loginStyles.emailStep2}>
                        {formProps.values.email}
                      </label>
                      <Input
                        inputProps={{
                          name: 'last_name',
                          type: 'hidden',
                          value: 'last-name',
                        }}
                      />
                      <Input
                        inputProps={{
                          name: 'password',
                          type: 'hidden',
                          value: 'new-password',
                        }}
                      />
                      <Input
                        inputProps={{
                          name: 'password',
                          type: 'hidden',
                          value: 'new-confirm_password',
                        }}
                      />
                      <Input
                        label="First Name"
                        inputProps={{
                          name: 'first_name',
                          type: 'text',
                          value: formProps.values.first_name,
                          onChange: formProps.handleChange,
                          onBlur: formProps.handleBlur,
                        }}
                        classes={{ column: classes.loginStyles.inputField }}
                        errorMessage={
                          formProps.touched.first_name &&
                          (formProps.errors.first_name as string)
                        }
                      />
                      <Input
                        label="Last Name"
                        inputProps={{
                          name: 'last_name',
                          type: 'text',
                          value: formProps.values.last_name || '',
                          onChange: formProps.handleChange,
                          onBlur: formProps.handleBlur,
                          autoComplete: 'last-name',
                        }}
                        classes={{ column: classes.loginStyles.inputField }}
                        errorMessage={
                          formProps.touched.last_name &&
                          (formProps.errors.last_name as string)
                        }
                      />
                      <Input
                        label="Password"
                        inputProps={{
                          name: 'password',
                          placeholder: '*******',
                          value: formProps.values.password || '',
                          onChange: formProps.handleChange,
                          onBlur: formProps.handleBlur,
                          autoComplete: 'new-password',
                          type:
                            this.state.showPassword === true
                              ? 'text'
                              : 'password',
                          icon: (
                            <Icon
                              name={
                                this.state.showPassword === true
                                  ? 'eye'
                                  : 'eye slash'
                              }
                              link
                              onClick={() => this.onTooglePassword(false)}
                            />
                          ),
                        }}
                        classes={{ column: classes.loginStyles.inputField }}
                        errorMessage={
                          formProps.touched.password &&
                          formProps.errors.password
                        }
                      />
                      <Input
                        label="Confirm Password"
                        inputProps={{
                          name: 'confirm_password',
                          placeholder: '*******',
                          value: formProps.values.confirm_password || '',
                          onChange: formProps.handleChange,
                          onBlur: formProps.handleBlur,
                          autoComplete: 'new-confirm_password',
                          type:
                            this.state.showConfirmationPassword === true
                              ? 'text'
                              : 'password',
                          icon: (
                            <Icon
                              name={
                                this.state.showConfirmationPassword === true
                                  ? 'eye'
                                  : 'eye slash'
                              }
                              link
                              onClick={() => this.onTooglePassword(false, true)}
                            />
                          ),
                        }}
                        classes={{ column: classes.loginStyles.inputField }}
                        errorMessage={
                          formProps.touched.confirm_password &&
                          formProps.errors.confirm_password
                        }
                      />
                    </>
                  ) : step === 3 ? (
                    <>
                      <Input
                        label="Organization Name"
                        inputProps={{
                          name: 'name',
                          type: 'text',
                          value: formProps.values.name,
                          onChange: formProps.handleChange,
                          onBlur: formProps.handleBlur,
                        }}
                        classes={{ column: classes.loginStyles.inputField }}
                        errorMessage={
                          formProps.touched.name &&
                          (formProps.errors.name as string)
                        }
                      />
                      <Select
                        label="Organization Type"
                        selectProps={{
                          className: classes.loginStyles.organizationType,
                          options: organizationType,
                          placeholder: 'Please Select',
                          value: formProps.values.organization_type,
                          onChange: (_, data) => {
                            formProps.setFieldValue(
                              'organization_type',
                              data.value
                            );
                            formProps.setFieldTouched('organization_type');
                          },
                        }}
                        errorMessage={
                          formProps.touched.organization_type &&
                          formProps.errors.organization_type
                        }
                      />
                    </>
                  ) : (
                    <Input
                      label="Email Address"
                      inputProps={{
                        name: 'email',
                        type: 'email',
                        value: formProps.values.email,
                        onChange: formProps.handleChange,
                        onBlur: formProps.handleBlur,
                      }}
                      classes={{ column: classes.loginStyles.inputField }}
                      errorMessage={
                        formProps.touched.email &&
                        (formProps.errors.email as string)
                      }
                    />
                  )}
                  <div
                    className={cx(
                      classes.mainStyles.center,
                      step !== 1 && classes.loginStyles.buttonGroup
                    )}>
                    <Form.Group grouped>
                      {step !== 1 && (
                        <Button
                          colorVariant={ButtonColor.DANGER}
                          buttonType={ButtonType.ROUND}
                          buttonProps={{
                            size: 'large',
                            type: 'button',
                            onClick: () => {
                              this.setState({
                                step: step === 3 ? 2 : 1,
                              });
                            },
                          }}>
                          Cancel
                        </Button>
                      )}
                      <Button
                        colorVariant={
                          step === 3
                            ? ButtonColor.SECONDARY
                            : ButtonColor.PRIMARY
                        }
                        buttonType={ButtonType.ROUND}
                        buttonProps={{
                          disabled: !captchaLoaded,
                          size: 'large',
                          type: 'submit',
                          loading:
                            checkExistingEmailLoading ||
                            registerSkeepOrgLoading,
                        }}>
                        {step === 1
                          ? 'Sign up'
                          : step === 2
                          ? 'Create Account'
                          : 'Next'}
                      </Button>
                    </Form.Group>
                  </div>
                </Form>
              );
            }}
          </Formik>
        </div>
      );
    };

    const paymentForm = () => {
      return (
        <PaymentForm
          history={history}
          classes={classes}
          onChange={payment => {
            this.setState({
              currentPaymentInfo: payment,
            });
          }}
          currentPaymentInfo={currentPaymentInfo}
          loadedToken={() => {
            this.setState({
              loadedBraintreeToken: true,
            });
          }}
          showPaymentMessage={showPaymentMessage}
          loadedBraintreeToken={loadedBraintreeToken}
          createSubscriptionWithBraintreeLoading={
            createSubscriptionWithBraintreeLoading
          }
          createSubscriptionWithBraintreeError={
            createSubscriptionWithBraintreeError
          }
          selectedPlanPP={selectedPlanPP}
          selectedPlanMonthly={selectedPlanMonthly}
          preSelectedPlanId={preSelectedPlanId}
          isPrePayPlan={isPrePayPlan}
          switchPlans={switchPlans}
          monthlyPricing={monthlyPricing}
          createSubscriptionWithBraintree={createSubscriptionWithBraintree}
          totalPricing={totalPricing}
          profileEmail={profileEmail}
          paymentSubscription={paymentSubscription}
          setFirstPayment={setFirstPayment}
          doLogout={doLogout}
        />
      );
    };

    return (
      <div
        className={cx(
          classes.mainStyles.loginPage,
          selectedPlan ? classes.loginStyles.hasPlan : ''
        )}>
        <LoginHeader history={history} />
        <ReCAPTCHA
          asyncScriptOnLoad={this.asyncScriptOnLoad}
          ref={node => (this.captchaRef = node)}
          sitekey={process.env.RECAPTCHA_SITE_KEY}
          size="invisible"
          onExpired={() => {
            this.setCaptchaToken(null);
          }}
          onChange={token => {
            if (token && this.captchaOnSuccess) {
              this.setCaptchaToken(token, () => {
                this.captchaOnSuccess(token);
              });
            }
          }}
        />
        <div
          className={cx(
            classes.mainStyles.signupFlow,
            classes.mainStyles.loginPageBg,
            classes.loginStyles.mixingForm,
            (step !== 1 || emailExistMode || isLoggedInAndSelectPlan()) &&
              classes.loginStyles.step2,
            isLoggedInAndSelectPlan() && classes.loginStyles.paymentSelected
          )}>
          <Container fluid>
            <section>
              {selectedPlan && (
                <div
                  className={`${classes.mainStyles.formPanel} ${
                    classes.mainStyles.paymentMessage
                  } ${classes.loginStyles.planInfo} ${getColorOfPlan()} `}>
                  <div
                    className={`${
                      classes.loginStyles.planInfoGradient
                    } ${getColorOfPlan()}`}
                  />
                  <Grid>
                    <Grid.Column width={16}>
                      <div
                        className={cx(
                          classes.loginStyles.planInforSection,
                          classes.loginStyles.first
                        )}>
                        <span>Please login or create an</span>
                        <span>
                          {isFree()
                            ? 'account to setup your'
                            : 'account to complete'}
                        </span>
                        <span>
                          {isFree() ? 'FREE account' : 'your purchase'}
                        </span>
                      </div>
                      <div
                        className={cx(
                          classes.loginStyles.planInforSection,
                          classes.loginStyles.second
                        )}>
                        <span>You have selected the:</span>
                        <span>
                          <span className={classes.loginStyles.intro}>
                            <span>
                              {isFree() ? (
                                <span>
                                  Reader Zone FREE Plan
                                  <span
                                    style={{
                                      display: 'inline-block',
                                      width: 'auto',
                                      marginLeft: '10px',
                                    }}>
                                    -
                                  </span>
                                </span>
                              ) : (
                                `${currentPlanName}${
                                  !(
                                    step !== 1 ||
                                    emailExistMode ||
                                    isLoggedInAndSelectPlan()
                                  )
                                    ? isPrePayPlan
                                      ? ', Pre-Paid'
                                      : ', Monthly Plan'
                                    : ''
                                } `
                              )}
                            </span>
                          </span>
                          <span className={classes.loginStyles.price}>
                            {!isFree() ? (
                              <>
                                <span className={classes.loginStyles.number}>
                                  ${Math.ceil(monthlyPricing)}
                                </span>
                                <span className={classes.loginStyles.unit}>
                                  /{` `}mo
                                </span>
                              </>
                            ) : (
                              '$0'
                            )}
                          </span>
                        </span>
                        <span
                          className={cx(
                            classes.loginStyles.secondFooter,
                            renderFreeMonth() === '' &&
                              classes.loginStyles.noContent
                          )}>
                          {renderFreeMonth() !== '' && (
                            <span className={classes.loginStyles.footerLeft}>
                              {renderFreeMonth()}
                            </span>
                          )}
                          <span>Up to {selectedPlan.readers_max} Readers</span>
                        </span>
                      </div>
                      <div
                        className={cx(
                          classes.loginStyles.planInforSection,
                          classes.loginStyles.third,
                          isFree() && classes.loginStyles.freePlan,
                          renderFreeMonth() === '' &&
                            classes.loginStyles.notYear
                        )}>
                        <span>
                          {isFree()
                            ? 'DUE TODAY'
                            : `${
                                isPrePayPlan
                                  ? `${currentPlanName}, Pre-Paid`
                                  : 'Monthly Payment'
                              }`}
                        </span>
                        {step !== 1 || isLoggedInAndSelectPlan() ? (
                          <>
                            {isFree() ? (
                              <span className={classes.loginStyles.number}>
                                $0
                              </span>
                            ) : (
                              <span className={classes.loginStyles.priceInner}>
                                <span className={classes.loginStyles.number}>
                                  ${Math.ceil(monthlyPricing)}
                                </span>
                                <span className={classes.loginStyles.unit}>
                                  /{` `}mo
                                </span>
                                <span style={{ marginTop: '0' }}>
                                  {renderFreeMonth()}
                                </span>
                              </span>
                            )}
                          </>
                        ) : (
                          <>
                            {isFree() ? (
                              <span>$0</span>
                            ) : (
                              <>
                                <span>${totalPricing}</span>
                                <span>{renderFreeMonth()}</span>
                              </>
                            )}
                          </>
                        )}
                      </div>
                    </Grid.Column>
                  </Grid>
                </div>
              )}

              {selectedPlan && !emailExistMode ? (
                <div
                  className={cx(
                    classes.loginStyles.selectedPlanForm,
                    (step !== 1 || isLoggedInAndSelectPlan()) &&
                      classes.loginStyles.step2
                  )}>
                  <div className={classes.loginStyles.customLogin}>
                    {LoginForm(true)}
                  </div>
                  {isLoggedInAndSelectPlan() ? (
                    <div className={classes.loginStyles.paymentForm}>
                      {paymentForm()}
                    </div>
                  ) : (
                    <div className={classes.loginStyles.customSignup}>
                      {signupForm()}
                    </div>
                  )}
                </div>
              ) : (
                LoginForm()
              )}
            </section>
          </Container>
        </div>
      </div>
    );
  }
}

export default themr<LoginProps>('Login', { mainStyles: styles, loginStyles })(
  Login
);
