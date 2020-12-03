import * as React from 'react';
import themr from 'src/helpers/themr';
import * as H from 'history';
import logoImg from 'assets/images/filllogo.png';
import Button, { ButtonColor, ButtonType } from 'src/components/Button';
import { Icon } from 'semantic-ui-react';
import urls from 'src/helpers/urls';
import styles from './styles.scss';

type Props = IComponentProps & {
  history: H.History;
};

class Header extends React.Component<Props> {
  render() {
    const { classes, history } = this.props;
    return (
      <div className={classes.flowHeader}>
        <div className={classes.logo}>
          <img src={logoImg} alt="logo" />
        </div>
        <div className={classes.rightContent}>
          <a href={urls.SITE_HOMEPAGE}>
            <Icon name="arrow left" />
            <span>Back to Readerzone.com</span>
          </a>
          <Button
            colorVariant={ButtonColor.MAIN}
            buttonType={ButtonType.ROUND}
            buttonProps={{
              size: 'large',
              onClick: () => {
                history.push(urls.LOGIN());
              },
            }}>
            Login
          </Button>
          <Button
            colorVariant={ButtonColor.PRIMARY}
            buttonType={ButtonType.ROUND}
            buttonProps={{
              size: 'large',
              onClick: () => {
                history.push(urls.SIGNUP());
              },
            }}>
            Sign Up
          </Button>
        </div>
      </div>
    );
  }
}

export default themr<Props>('Header', styles)(Header);
