import * as React from 'react';
import cx from 'classnames';
import { Redirect, Link } from 'react-router-dom';
import { Formik } from 'formik';
import * as Yup from 'yup';
import themr from 'src/helpers/themr';
import LoginHeader from 'src/components/LoginHeader';
import Button, { ButtonColor, ButtonType } from 'src/components/Button';
import { Form, Container } from 'semantic-ui-react';
import Input from 'src/components/FormFields/Input';
import urls from 'src/helpers/urls';
import styles from '../Signup/styles.scss';

export type LoginProps = IScreenProps & {
  doForgetPassword: Function;
  isLoggingIn?: boolean;
  isLoggedIn?: boolean;
  profileId?: string;
  forgetPassword?: any;
};

let initialValues = { email: '' };

class ForgetPassword extends React.Component<LoginProps> {
  state = {
    showPassword: false,
  };

  onSubmit = values => {
    this.props.doForgetPassword(values.email);
    initialValues = { email: '' };
  };

  onTooglePassword = () => {
    this.setState((preState: any) => ({
      ...preState,
      showPassword: !preState.showPassword,
    }));
  };

  render() {
    const {
      classes,
      isLoggingIn,
      isLoggedIn,
      history,
      profileId,
      forgetPassword,
    } = this.props;
    if (isLoggedIn && profileId) {
      return <Redirect to={urls.PROGRAMS()} />;
    }

    return (
      <div className={classes.loginPage}>
        <LoginHeader history={history} />
        <div className={cx(classes.signupFlow, classes.loginPageBg)}>
          <Container fluid>
            <section>
              <div className={classes.formPanel}>
                <h2>Reset Password</h2>

                <Formik
                  onSubmit={this.onSubmit}
                  enableReinitialize
                  initialValues={{ ...initialValues }}
                  validationSchema={Yup.object().shape({
                    email: Yup.string()
                      .required('Email is required')
                      .email('Email is invalid'),
                  })}>
                  {formProps => {
                    return (
                      <Form
                        onSubmit={formProps.handleSubmit}
                        className={classes.loginForm}>
                        <Input
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
                        />
                        <div className={classes.center}>
                          <Form.Group grouped>
                            <Button
                              colorVariant={ButtonColor.SECONDARY}
                              buttonType={ButtonType.ROUND}
                              buttonProps={{
                                size: 'large',
                                type: 'submit',
                                loading:
                                  isLoggingIn || forgetPassword.inProgress,
                              }}>
                              Send
                            </Button>
                          </Form.Group>
                          <p>
                            Don't have account?{' '}
                            <Link to="/signup">Sign Up</Link>
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

export default themr<LoginProps>('ForgetPassword', styles)(ForgetPassword);
