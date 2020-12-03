import * as React from 'react';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { Link } from 'react-router-dom';
import ReCAPTCHA from 'react-google-recaptcha';
import themr from 'src/helpers/themr';
import Button, { ButtonColor, ButtonType } from 'src/components/Button';
import Input from 'src/components/FormFields/Input';
import Checkbox from 'src/components/FormFields/Checkbox';
import { Form, Grid, Icon } from 'semantic-ui-react';
import urls from 'src/helpers/urls';
import * as queryString from 'query-string';
import get from 'lodash/get';
import * as H from 'history';
import styles from '../styles.scss';

type Props = IComponentProps & {
  jumpToNextStep?: Function;
  jumpToPreviousStep?: Function;
  onNext: Function;
  registerInProgress: boolean;
  history: H.History;
  accountData?: any;
};
class CreateAccount extends React.Component<Props> {
  state = {
    captchaLoaded: false,
    showPassword: false,
    showConfirmationPassword: false,
  };

  captchaRef: any | null = null;

  asyncScriptOnLoad = () => {
    this.setState({ captchaLoaded: true });
  };

  onTooglePassword = (isConfirm: boolean) => {
    this.setState((preState: any) => ({
      ...preState,
      showConfirmationPassword: isConfirm
        ? !preState.showConfirmationPassword
        : preState.showConfirmationPassword,
      showPassword: !isConfirm ? !preState.showPassword : preState.showPassword,
    }));
  };

  render() {
    const { classes, registerInProgress, history, accountData } = this.props;
    const {
      captchaLoaded,
      showPassword,
      showConfirmationPassword,
    } = this.state;

    const params = queryString.parse(history.location.search);
    const preSelectedPlanid = get(params, 'pre_selected_planid');

    let initialValues = {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
      terms: true,
    };

    if (accountData) initialValues = accountData;

    return (
      <Formik
        onSubmit={() => {
          if (this.captchaRef) {
            this.captchaRef.reset();
            this.captchaRef.execute();
          }
        }}
        enableReinitialize
        initialValues={initialValues}
        validationSchema={Yup.object().shape({
          firstName: Yup.string().required('Firstname is required'),
          lastName: Yup.string().required('Lastname is required'),
          email: Yup.string()
            .email('Email is invalid')
            .required('Email is required'),
          password: Yup.string()
            .min(8, 'Required minimum of 8 characters')
            .required('Required minimum of 8 characters'),
          confirmPassword: Yup.string()
            .oneOf([Yup.ref('password'), null], 'Passwords must match')
            .required('Required minimum of 8 characters'),
          terms: Yup.boolean().oneOf(
            [true],
            'Must Accept Terms and Conditions'
          ),
        })}>
        {formProps => {
          const { values } = formProps;
          const { touched } = formProps;
          const { errors } = formProps;
          return (
            <Form
              onSubmit={formProps.handleSubmit}
              className={classes.signUpForm}>
              <Grid columns={2} doubling>
                <Grid.Column>
                  <Input
                    label="First Name"
                    inputProps={{
                      name: 'firstName',
                      placeholder: 'John',
                      value: values.firstName,
                      onChange: formProps.handleChange,
                      onBlur: formProps.handleBlur,
                    }}
                    errorMessage={touched.firstName && errors.firstName}
                  />
                </Grid.Column>
                <Grid.Column>
                  <Input
                    label="Last Name"
                    inputProps={{
                      name: 'lastName',
                      placeholder: 'Doe',
                      value: values.lastName,
                      onChange: formProps.handleChange,
                      onBlur: formProps.handleBlur,
                    }}
                    errorMessage={touched.lastName && errors.lastName}
                  />
                </Grid.Column>
              </Grid>
              <Grid columns={1}>
                <Grid.Column>
                  <Input
                    label="Email Address"
                    inputProps={{
                      name: 'email',
                      placeholder: 'Email',
                      type: 'email',
                      value: values.email,
                      onChange: formProps.handleChange,
                      onBlur: formProps.handleBlur,
                    }}
                    errorMessage={touched.email && errors.email}
                  />
                </Grid.Column>
              </Grid>
              <Grid columns={2} doubling>
                <Grid.Column>
                  <Input
                    label="Password"
                    inputProps={{
                      name: 'password',
                      placeholder: '*******',
                      type: showPassword === true ? 'text' : 'password',
                      icon: (
                        <Icon
                          name={showPassword === true ? 'eye' : 'eye slash'}
                          link
                          onClick={() => this.onTooglePassword(false)}
                        />
                      ),
                      value: values.password,
                      onChange: formProps.handleChange,
                      onBlur: formProps.handleBlur,
                    }}
                    errorMessage={touched.password && errors.password}
                  />
                </Grid.Column>
                <Grid.Column>
                  <Input
                    label="Confirm Password"
                    inputProps={{
                      name: 'confirmPassword',
                      placeholder: '*******',
                      type:
                        showConfirmationPassword === true ? 'text' : 'password',
                      icon: (
                        <Icon
                          name={
                            showConfirmationPassword === true
                              ? 'eye'
                              : 'eye slash'
                          }
                          link
                          onClick={() => this.onTooglePassword(true)}
                        />
                      ),
                      value: values.confirmPassword,
                      onChange: formProps.handleChange,
                      onBlur: formProps.handleBlur,
                    }}
                    errorMessage={
                      touched.confirmPassword && errors.confirmPassword
                    }
                  />
                </Grid.Column>
              </Grid>
              <Grid>
                <Grid.Column>
                  <Checkbox
                    checkboxProps={{
                      toggle: true,
                      label: (
                        <label>
                          <a
                            href="https://readerzone.webflow.io/terms-conditions"
                            target="_blank"
                            rel="noopener noreferrer">
                            Please accept the terms & Conditions
                          </a>
                        </label>
                      ),
                      checked: values.terms,
                      onChange: (_, data) =>
                        formProps.setFieldValue('terms', data.checked),
                    }}
                    errorMessage={touched.terms && errors.terms}
                  />
                </Grid.Column>
              </Grid>

              <ReCAPTCHA
                asyncScriptOnLoad={this.asyncScriptOnLoad}
                ref={node => (this.captchaRef = node)}
                sitekey={process.env.RECAPTCHA_SITE_KEY}
                size="invisible"
                onChange={token => {
                  if (token) {
                    this.props.jumpToNextStep();
                    this.props.onNext({ ...values, captchaToken: token });
                  }
                }}
              />

              <div className={classes.center}>
                {!preSelectedPlanid && (
                  <div style={{ float: 'left' }}>
                    <a
                      href="#"
                      className={classes.back}
                      onClick={() => {
                        this.props.jumpToPreviousStep();
                      }}>
                      Back
                    </a>
                  </div>
                )}

                <Button
                  colorVariant={ButtonColor.SECONDARY}
                  buttonType={ButtonType.ROUND}
                  buttonProps={{
                    type: 'submit',
                    loading: registerInProgress,
                    disabled: !captchaLoaded,
                  }}>
                  Next
                </Button>
                <p>
                  {preSelectedPlanid ? (
                    <Link
                      to={`${urls.LOGIN()}?pre_selected_planid=${preSelectedPlanid}`}>
                      I already have an account
                    </Link>
                  ) : (
                    <Link to={urls.LOGIN()}>I already have an account</Link>
                  )}
                </p>
              </div>
            </Form>
          );
        }}
      </Formik>
    );
  }
}

export default themr<Props>('CreateAccount', styles)(CreateAccount);
