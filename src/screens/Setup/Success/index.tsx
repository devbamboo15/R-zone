import * as React from 'react';
import themr from 'src/helpers/themr';
import Button, { ButtonColor, ButtonType } from 'src/components/Button';
import RefreshSvg from 'src/assets/icons/Refresh.svg';
import EntryByDaySvg from 'src/assets/icons/EntryByDay.svg';
import LogoutBtnSvg from 'src/assets/icons/LogoutBtn.svg';
import awardSuccessImg from 'assets/images/award-success.png';
import playStore from 'assets/images/play-store.png';
import appStore from 'assets/images/app-store.png';
import history from 'src/helpers/history';
import get from 'lodash/get';
import urls from 'src/helpers/urls';

import styles from './styles.scss';

export type Props = IComponentProps & {
  onMakeAnother?: Function;
  doLogout?: Function;
};

const Success = props => {
  const { classes, onMakeAnother, doLogout } = props;
  return (
    <div className={classes.successWrapper}>
      <h2>
        Success! Your reading
        <br />
        entry is saved.
      </h2>
      <div className={classes.logoutSection}>
        <Button
          colorVariant={ButtonColor.DANGER}
          buttonType={ButtonType.ROUND}
          icon={<LogoutBtnSvg height={20} />}
          btnClass={classes.logoutSectionBtn}
          buttonProps={{
            onClick: () => {
              localStorage.setItem('notRedirect', 'true');
              doLogout();
              window.location.href = urls.SITE_HOMEPAGE;
            },
          }}>
          Logout
        </Button>
      </div>
      <div className={classes.mainImgContainer} title="ReaderZone">
        <img
          className={classes.mainImg}
          src={awardSuccessImg}
          alt="award-success-img"
        />
      </div>
      <p>
        You can make another reading entry for a different group,
        <br />
        or logout and return to make another entry!
      </p>
      <div className={classes.mainButtonSection}>
        <Button
          colorVariant={ButtonColor.PRIMARY}
          buttonType={ButtonType.ROUND}
          icon={<RefreshSvg height={20} />}
          btnClass={classes.makeAnotherBtn}
          buttonProps={{
            onClick: () => {
              history.push(get(history, 'location.pathname'), {
                search: '',
              });
              if (onMakeAnother) {
                onMakeAnother();
              }
            },
          }}>
          Make Another Entry
        </Button>
        <Button
          colorVariant={ButtonColor.PRIMARY}
          buttonType={ButtonType.ROUND}
          icon={<EntryByDaySvg height={22} />}
          btnClass={classes.gotoAccountBtn}
          buttonProps={{
            onClick: () => {
              history.push(urls.MYACCOUNT());
            },
          }}>
          Go to My Account
        </Button>
      </div>
      <div className={classes.downloadSection}>
        <p>You can download the Reader Zone app anytime!</p>
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
      </div>
    </div>
  );
};

export default themr<Props>('Success', styles)(Success);
