import * as React from 'react';
import { Item } from 'semantic-ui-react';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import themr from 'src/helpers/themr';
import BackArrow from 'react-icons/lib/fa/arrow-left';
import logoImg from 'src/assets/images/fulllogo.png';
import LogoutSvg from 'src/assets/icons/logout.svg';
import Menus from 'src/components/Menus';
import Heading, { HeadingColor, HeadingType } from 'src/components/Heading';
import Button, { ButtonColor, ButtonType } from 'src/components/Button';
import { doLogout } from 'src/store/actions/auth';
import urls from 'src/helpers/urls';
// import history from 'src/helpers/history';
import { IReduxState } from 'src/store/reducers';
import get from 'lodash/get';
import { Role } from 'src/screens/Signup/Steps/ZoneType';
import styles from './styles.scss';

export type LeftBarProps = IComponentProps & {
  logout?: typeof doLogout;
  paymentSubscription?: any;
  meLoading?: boolean;
  isSandboxLogin?: boolean;
  betaOriginal?: any;
  badgesAccount?: any;
  meRoles?: any[];
};

const LeftBar = ({
  classes,
  logout,
  // paymentSubscription,
  // isSandboxLogin,
  // betaOriginal,
  meRoles,
  badgesAccount,
}: LeftBarProps) => {
  // const maxReader = get(paymentSubscription, 'plan_detail.readers_max', 0);
  const isOrganizer = meRoles.filter(x => x.id === Role.ORGANIZER).length > 0;
  return (
    <div className={classes.leftbarContainer}>
      <Item className={classes.logoImg}>
        <Item.Image src={logoImg} size="small" />
        {/* maxReader <= 20 && !isSandboxLogin && betaOriginal === 1 && (
          <>
            <div className={classes.freePlan}>Free Edition</div>
            <div
              className={classes.upgradePlan}
              onClick={() => {
                history.push(
                  `${urls.MYACCOUNT_TAB({
                    tab: 'payments',
                  })}?show_list_plan=true`
                );
              }}>
              Upgrade
            </div>
          </>
        ) */}
      </Item>
      <Menus badgesAccount={badgesAccount} isOrganizer={isOrganizer} />
      <Item className={classes.bottomLeftContainer}>
        <Button
          colorVariant={ButtonColor.SECONDARY}
          buttonType={ButtonType.ROUND}
          buttonProps={{
            size: 'large',
            onClick: logout,
          }}
          icon={<LogoutSvg height={20} />}>
          <Heading
            type={HeadingType.NORMAL}
            colorVariant={HeadingColor.PINK}
            headingProps={{ as: 'h3' }}>
            Sign Out
          </Heading>
        </Button>
        <div className={classes.bottomBar}>
          <BackArrow color="#fff" />
          <a href={urls.SITE_HOMEPAGE} className={classes.bottomText}>
            Back to ReaderZone.com
          </a>
        </div>
      </Item>
    </div>
  );
};

export default compose<LeftBarProps, LeftBarProps>(
  themr<LeftBarProps>('LeftBar', styles),
  connect(
    (state: IReduxState) => ({
      paymentSubscription:
        get(state, 'auth.profile.data.attributes.subscription') || {},
      meLoading: get(state, 'auth.profile.inProgress'),
      isSandboxLogin: get(state, 'auth.login.isSandboxLogin'),
      meRoles: get(state, 'auth.profile.data.relationships.roles.data') || [],
      betaOriginal: get(
        state,
        'auth.profile.data.attributes.organization.beta_original',
        ''
      ),
      badgesAccount: get(
        state,
        'auth.profile.data.attributes.organization.badges',
        ''
      ),
    }),
    {
      logout: doLogout,
    }
  )
)(LeftBar);
