import * as React from 'react';
import themr from 'src/helpers/themr';
import LoginHeader from 'src/components/LoginHeader';
import Button, { ButtonColor, ButtonType } from 'src/components/Button';
import { Container } from 'semantic-ui-react';
import styles from './styles.scss';

export type SandboxLoginProps = IScreenProps & {
  doSandboxLogin: Function;
  isLoggingIn?: boolean;
  isLoggedIn?: boolean;
  fetchingProfile?: boolean;
  profileId?: string;
  doLogout: Function;
  resetSandboxLogin: Function;
};

class SandboxLogin extends React.Component<SandboxLoginProps> {
  componentDidMount() {
    this.props.resetSandboxLogin();
  }

  onSubmit = () => {
    this.props.doLogout(() => {
      this.props.doSandboxLogin();
    });
  };

  render() {
    const { classes, isLoggingIn, history, fetchingProfile } = this.props;
    return (
      <div className={classes.loginPage}>
        <LoginHeader history={history} />
        <div className={classes.sandboxPage}>
          <Container fluid>
            <section>
              <div className={classes.formPanel}>
                <h2>Reader Zone Test Account</h2>
                <div>
                  <p>
                    The test account simulates a small library system with
                    reading programs for different age groups and library
                    branches.
                  </p>
                  <p>
                    You can add, change or delete anything in your test account.
                    Once you close the window. POOF, the account will reset.
                  </p>
                  <p>
                    Please email or call with any questions. We’d love to help.
                  </p>
                </div>
                <div className={classes.submitButton}>
                  <Button
                    colorVariant={ButtonColor.SECONDARY}
                    buttonType={ButtonType.ROUND}
                    buttonProps={{
                      size: 'large',
                      type: 'submit',
                      loading: isLoggingIn || fetchingProfile,
                      onClick: this.onSubmit,
                    }}>
                    Enter Test Account
                  </Button>
                </div>
              </div>
            </section>
          </Container>
        </div>
      </div>
    );
  }
}

export default themr<SandboxLoginProps>('SandboxLogin', styles)(SandboxLogin);
