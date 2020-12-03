import * as React from 'react';
import cx from 'classnames';
import { Redirect, Link } from 'react-router-dom';
import { Formik } from 'formik';
import * as Yup from 'yup';
import themr from 'src/helpers/themr';
import LoginHeader from 'src/components/LoginHeader';
import Button, { ButtonColor, ButtonType } from 'src/components/Button';
import { Form, Container, Icon } from 'semantic-ui-react';
import Input from 'src/components/FormFields/Input';
import urls from 'src/helpers/urls';
import * as queryString from 'query-string';
import get from 'lodash/get';
import * as H from 'history';
import toast from 'src/helpers/Toast';
import isEqual from 'lodash/isEqual';
import Spinner from 'src/components/Spinner';
import styles from '../Signup/styles.scss';

export type ResetPasswordProps = IScreenProps & {
  doResetPassword: Function;
  doCheckResetPassword: Function;
  isLoggingIn?: boolean;
  checkResetPasswordLoading: boolean;
  resetPasswordLoading?: boolean; 
  checkResetPasswordData?: any;
  isLoggedIn?: boolean;
  profileId?: string;
  history: H.History;
};

class ResetPassword extends React.Component<ResetPasswordProps> {
  state = {
    showPassword: false,
    hideForm: false,
  };

  onSubmit = values => {
    this.props.doResetPassword(values);
  };

  onTooglePassword = () => {
    this.setState((preState: any) => ({
      ...preState,
      showPassword: !preState.showPassword,
    }));
  };

  componentDidMount() {
    const { history, doCheckResetPassword } = this.props;
    const params = queryString.parse(history.location.search);
    let email = get(params, 'email');
    if (email) email = email.split(' ').join('+');
    doCheckResetPassword(email);
  }

  componentDidUpdate(prevProps) {
    const { checkResetPasswordData } = this.props;
    if (!isEqual(checkResetPasswordData, {})) {
      const isReset = get(checkResetPasswordData, 'isReset');
      const prevIsReset = get(prevProps, 'checkResetPasswordData.isReset');
      if (!isReset && isReset !== prevIsReset) {
        this.setState({
          hideForm: true,
        });
        toast.error('Reset password link is expired');
        setTimeout(() => {
          window.location.href = urls.SITE_HOMEPAGE;
        }, 2000);
      }
    }
  }

  render() {
    const {
      classes,
      isLoggingIn,
      isLoggedIn,
      history,
      profileId,
      resetPasswordLoading,
      checkResetPasswordLoading,
    } = this.props;
    const { hideForm } = this.state;
    if (isLoggedIn && profileId) {
      return <Redirect to={urls.PROGRAMS()} />;
    }

    const params = queryString.parse(this.props.history.location.search);
    const token = get(params, 'token');
    let email = get(params, 'email');
    if (email) email = email.split(' ').join('+');

    return (
      <div className={classes.loginPage}>
        <LoginHeader history={history} />
        <div className={cx(classes.signupFlow, classes.stepFour)}>
          <Container fluid>
            <section>
              <div className={classes.formPanel}>
                {(checkResetPasswordLoading || hideForm) && (
                  <div className={classes.resetPasswordPreLoading}>
                    <Spinner />
                  </div>
                )}
                <h2>Reset Password</h2>
                <Formik
                  onSubmit={this.onSubmit}
                  initialValues={{
                    email,
                    password: '',
                    password_confirmation: '',
                    token,
                  }}
                  validationSchema={Yup.object().shape({
                    password: Yup.string()
                      .required('Password is required')
                      .min(
                        8,
                        'Your password must be at least 8 characters long'
                      ),
                    password_confirmation: Yup.string()
                      .oneOf(
                        [Yup.ref('password'), null],
                        'Password Confirmation not match'
                      )
                      .required('Password Confirmation is required'),
                  })}>
                  {formProps => {
                    return (
                      <Form
                        onSubmit={formProps.handleSubmit}
                        className={classes.loginForm}>
                        {/* <Input
                          label="Email Address"
                          inputProps={{
                            name: 'email',
                            type: 'email',
                            value: formProps.values.email,
                            onChange: formProps.handleChange,
                            onBlur: formProps.handleBlur,
                          }}
                          classes={{ column: classes.inputField }}
                          errorMessage={
                            formProps.touched.email &&
                            (formProps.errors.email as string)
                          }
                        /> */}
                        <Input
                          label="Password"
                          inputProps={{
                            name: 'password',
                            type:
                              this.state.showPassword === true
                                ? 'text'
                                : 'password',
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
                          classes={{ column: classes.inputField }}
                          errorMessage={
                            formProps.touched.password &&
                            (formProps.errors.password as string)
                          }
                        />
                        <Input
                          label="Password Confirmation"
                          inputProps={{
                            name: 'password_confirmation',
                            type:
                              this.state.showPassword === true
                                ? 'text'
                                : 'password',
                            value: formProps.values.password_confirmation,
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
                          classes={{ column: classes.inputField }}
                          errorMessage={
                            formProps.touched.password_confirmation &&
                            (formProps.errors.password_confirmation as string)
                          }
                        />
                        <div className={classes.center}>
                          <Form.Group grouped>
                            <Button
                              colorVariant={ButtonColor.SECONDARY}
                              buttonType={ButtonType.ROUND}
                              buttonProps={{
                                size: 'large',
                                type: 'submit',
                                loading: isLoggingIn || resetPasswordLoading,
                              }}>
                              Reset
                            </Button>
                          </Form.Group>
                          <p>
                            Already have account?{' '}
                            <Link to="/login">Click here</Link>
                          </p>
                        </div>
                      </Form>
                    );
                  }}
                </Formik>
              </div>
            </section>
          </Container>
        </div>
      </div>
    );
  }
}

export default themr<ResetPasswordProps>('ResetPassword', styles)(
  ResetPassword
);
