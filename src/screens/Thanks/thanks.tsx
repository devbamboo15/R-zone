import * as React from 'react';
import { Link } from 'react-router-dom';
import Input from 'src/components/FormFields/Input';
import Button, { ButtonColor, ButtonType } from 'src/components/Button';
import thanksImg from 'assets/images/thanks-img.png';
import playStore from 'assets/images/play-store.png';
import appStore from 'assets/images/app-store.png';
import AccessDesktopSvg from 'src/assets/icons/AccessDesktop.svg';
import urls from 'src/helpers/urls';
import Heading, { HeadingColor, HeadingType } from 'src/components/Heading';
import * as Api from 'src/api';
import toast from 'src/helpers/Toast';
import * as H from 'history';
import cx from 'classnames';
import Spinner from 'src/components/Spinner';

export type ThanksProps = IComponentProps & {
  history: H.History;
  registerStatus: string;
  resetRegister: Function;
  doLogin: Function;
  registerEmail: string;
  registerPassword: string;
  loginLoading: boolean;
};
enum SendMode {
  NONE = -1,
  SMS,
  EMAIL,
}

class Thanks extends React.Component<ThanksProps> {
  state = {
    sendMode: SendMode.NONE,
    isSent: false,
    isLoading: false,
    phone: '',
  };

  async sendSMS() {
    try {
      this.setState({ isLoading: true });
      await Api.sendSMS(this.state.phone);
      this.setState({ isLoading: false, isSent: true });
      toast.success('SMS sent successfully');
    } catch (error) {
      toast.error('Something went wrong');
      this.setState({ isLoading: false });
    }
  }

  async sendEmail(email: string) {
    try {
      this.setState({ isLoading: true });
      await Api.sendEmail(email);
      this.setState({
        isLoading: false,
        isSent: true,
        sendMode: SendMode.EMAIL,
      });
      toast.success('Email sent successfully');
    } catch (error) {
      toast.error('Something went wrong');
      this.setState({ isLoading: false });
    }
  }

  renderSmsInputPart() {
    const { classes } = this.props;
    const { isSent, phone, isLoading } = this.state;

    if (isSent) {
      return (
        <div className={cx(classes.smsPart, classes.finished)}>
          <Heading
            headingProps={{ as: 'h3' }}
            type={HeadingType.NORMAL}
            colorVariant={HeadingColor.WHITE}>
            You should get a text shortly at
          </Heading>
          <Heading
            headingProps={{ as: 'h3' }}
            type={HeadingType.NORMAL}
            colorVariant={HeadingColor.CYAN}>
            {phone}
          </Heading>
          <Heading
            headingProps={{ as: 'h3' }}
            type={HeadingType.NORMAL}
            colorVariant={HeadingColor.WHITE}>
            for your Reader Zone invite!
          </Heading>
        </div>
      );
    }

    return (
      <div className={classes.smsPart}>
        <h2 className={classes.smsInputLabel}>Enter your Phone Number:</h2>
        <Input
          inputProps={{
            placeholder: 'Enter Phone number',
            value: phone,
            onChange: (_, data) => this.setState({ phone: data.value }),
          }}
          classes={{ column: classes.smsInput }}
        />
        <Button
          colorVariant={ButtonColor.PRIMARY}
          buttonType={ButtonType.ROUND}
          buttonProps={{
            size: 'large',
            fluid: true,
            loading: isLoading,
            onClick: () => {
              this.sendSMS();
            },
          }}>
          Send my Invite!
        </Button>
      </div>
    );
  }

  renderEmailPart() {
    const { classes, registerEmail } = this.props;
    if (!this.state.isSent) {
      return null;
    }
    return (
      <div className={classes.emailPart}>
        <Heading
          headingProps={{ as: 'h3' }}
          type={HeadingType.NORMAL}
          colorVariant={HeadingColor.WHITE}>
          Please check your inbox at
        </Heading>
        <Heading
          headingProps={{ as: 'h3' }}
          type={HeadingType.NORMAL}
          colorVariant={HeadingColor.CYAN}>
          {registerEmail || 'yourname@email.com'}
        </Heading>
        <Heading
          headingProps={{ as: 'h3' }}
          type={HeadingType.NORMAL}
          colorVariant={HeadingColor.WHITE}>
          for your Reader Zone invite!
        </Heading>
      </div>
    );
  }

  render() {
    const {
      classes,
      registerEmail,
      registerPassword,
      doLogin,
      history,
      loginLoading,
    } = this.props;
    const { sendMode, isSent, isLoading } = this.state;

    return (
      <div className={classes.thanksSign}>
        <div className={classes.successSignUp}>
          {!isSent ? (
            <h1>Thanks for signing up for Reader Zone!</h1>
          ) : (
            <h1>Your invite is on it’s way ...</h1>
          )}
          {!isSent && (
            <h3 className={classes.nextStepText}>
              Your next step is to download the app and login.
              <br />
              If you do not have a mobile device, you can access the app from
              your desktop.
            </h3>
          )}

          {sendMode === SendMode.NONE && (
            <>
              {isLoading && <Spinner />}
              <div className={classes.accessDesktopBtn}>
                <Button
                  colorVariant={ButtonColor.PRIMARY}
                  buttonType={ButtonType.ROUND}
                  icon={<AccessDesktopSvg height={20} />}
                  buttonProps={{
                    loading: loginLoading,
                    onClick: () => {
                      if (registerEmail && registerPassword) {
                        doLogin(registerEmail, registerPassword);
                      } else {
                        history.push(urls.LOGIN());
                      }
                    },
                  }}>
                  Access Your Account on Desktop
                </Button>
              </div>
              {!isSent && sendMode === SendMode.NONE && (
                <div className={classes.textMe}>
                  <Link
                    to="#"
                    onClick={() => {
                      this.sendEmail(registerEmail);
                    }}>
                    Email this to me
                  </Link>
                  <Link
                    to="#"
                    onClick={() => {
                      this.setState({ sendMode: SendMode.SMS });
                    }}>
                    Text this to me
                  </Link>
                </div>
              )}
              <div className={classes.mainImgContainer} title="ReaderZone">
                <img
                  className={classes.mainImg}
                  src={thanksImg}
                  alt="thanks-img"
                />
              </div>
            </>
          )}
          {sendMode === SendMode.SMS && this.renderSmsInputPart()}
          {sendMode === SendMode.EMAIL && this.renderEmailPart()}
          <div className={classes.downloadBtn}>
            <a
              target="_blank"
              href="https://play.google.com/store/apps/details?id=com.readerzone2.app&hl=en"
              rel="noopener noreferrer">
              <img src={playStore} alt="play-store-button" />
            </a>
            <a
              target="_blank"
              href="https://apps.apple.com/in/app/reader-zone/id1474405363"
              rel="noopener noreferrer">
              <img src={appStore} alt="app-store-button" />
            </a>
          </div>
          {(sendMode === SendMode.EMAIL || sendMode === SendMode.SMS) && (
            <div className={classes.dashboardButton}>
              <Button
                colorVariant={ButtonColor.WHITE}
                buttonType={ButtonType.ROUND}
                buttonProps={{
                  as: Link,
                  to: '#',
                  onClick: () => {
                    window.location.href = urls.SITE_HOMEPAGE;
                  },
                }}>
                Go To ReaderZone.com
              </Button>
            </div>
          )}
        </div>
      </div>
    );
  }
}

export default Thanks;
