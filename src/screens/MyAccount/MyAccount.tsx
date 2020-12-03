import * as React from 'react';
import { Tab, Menu, Popup } from 'semantic-ui-react';
import { RouteComponentProps } from 'react-router-dom';
import URL from 'src/helpers/urls';
import AccountIcon from 'assets/icons/account_icon.svg';
import Title from 'src/components/Title';
import WelcomeModal from 'src/components/Modal/WelcomeModal';

import AccountSettings from './AccountSettings';
import Organization from './Organization';
import SocialMedia from './SocialMedia';
import AuthorizedUsers from './AuthorizedUsers';
import MyOrganizations from './MyOrganizations';
import Payments from './Payments';

export type MyAccountProps = IComponentProps &
  RouteComponentProps<{ tab?: string }> & {
    showTooltip?: boolean;
    createSubscriptionLoading: boolean;
    updateCreditCardInfoLoading: boolean;
    organizationId: any;
    setFirstPayment: Function;
    firstPayment: boolean;
    role: string;
  };

interface MyAcccountState {
  activeIndex: number;
  showTooltip: boolean;
}

const panes = (
  role: string,
  classes: any,
  showTooltip: boolean,
  onCloseTooltip
) => {
  if (role !== 'owner') {
    return [
      {
        menuItem: 'Account Settings',
        render: () => (
          <Tab.Pane attached={false} className="tabContent">
            <AccountSettings />
          </Tab.Pane>
        ),
      },
      {
        menuItem: 'Social Media',
        render: () => (
          <Tab.Pane attached={false}>
            <SocialMedia />
          </Tab.Pane>
        ),
      },
    ];
  }

  return [
    {
      menuItem: 'Account Settings',
      render: () => (
        <Tab.Pane attached={false} className="tabContent">
          <AccountSettings />
        </Tab.Pane>
      ),
    },
    {
      menuItem: (
        <Menu.Item key="organization">
          <Popup
            content={`Almost done! You can start to create new Programs, but to invite Readers, you'll need to fill in your Organization details first.`}
            on={['click']}
            size="small"
            position="bottom center"
            onClose={onCloseTooltip}
            open={showTooltip}
            trigger={<span>Organization</span>}
            className={classes.processPaymentSuccessTooltip}
          />
        </Menu.Item>
      ),
      render: () => (
        <Tab.Pane attached={false}>
          <Organization />
        </Tab.Pane>
      ),
    },
    {
      menuItem: 'Social Media',
      render: () => (
        <Tab.Pane attached={false}>
          <SocialMedia />
        </Tab.Pane>
      ),
    },
    {
      menuItem: 'Authorized Users',
      render: () => (
        <Tab.Pane attached={false}>
          <AuthorizedUsers />
        </Tab.Pane>
      ),
    },
    {
      menuItem: 'My Organizations',
      render: () => (
        <Tab.Pane attached={false}>
          <MyOrganizations />
        </Tab.Pane>
      ),
    },
    {
      menuItem: 'Payments',
      render: () => (
        <Tab.Pane attached={false}>
          <Payments />
        </Tab.Pane>
      ),
    },
  ];
};

class MyAccount extends React.Component<MyAccountProps, MyAcccountState> {
  constructor(props) {
    super(props);
    const {
      match: {
        params: { tab },
      },
    } = props;
    this.state = {
      activeIndex: this.getIndex(tab),
      showTooltip: false,
    };
  }

  componentDidUpdate(props) {
    const {
      match: { params },
    } = props;
    const {
      match,
      createSubscriptionLoading,
      organizationId,
      updateCreditCardInfoLoading,
    } = this.props;
    const { tab } = params;

    if (match.params.tab !== tab) {
      this.setState(() => ({
        activeIndex: this.getIndex(match.params.tab),
      }));
    }
    if (
      (!createSubscriptionLoading &&
        createSubscriptionLoading !== props.createSubscriptionLoading) ||
      (!updateCreditCardInfoLoading &&
        updateCreditCardInfoLoading !== props.updateCreditCardInfoLoading)
    ) {
      if (!organizationId) {
        this.setState({
          showTooltip: true,
        });
      }
    }
  }

  getIndex = type => {
    switch (type) {
      case 'settings':
        return 0;
      case 'organization':
        return 1;
      case 'social_media':
        return 2;
      case 'authorized_user':
        return 3;
      case 'my_organizations':
        return 4;
      case 'payments':
        return 5;
      default:
        return 0;
    }
  };

  changeTab = (event, data) => {
    switch (data.activeIndex) {
      case 1:
        return this.props.history.push(
          URL.MYACCOUNT_TAB({ tab: 'organization' })
        );
      case 2:
        return this.props.history.push(
          URL.MYACCOUNT_TAB({ tab: 'social_media' })
        );
      case 3:
        return this.props.history.push(
          URL.MYACCOUNT_TAB({ tab: 'authorized_user' })
        );
      case 4:
        return this.props.history.push(
          URL.MYACCOUNT_TAB({ tab: 'my_organizations' })
        );
      case 5:
        return this.props.history.push(URL.MYACCOUNT_TAB({ tab: 'payments' }));
      default:
        return this.props.history.push(URL.MYACCOUNT_TAB({ tab: 'settings' }));
    }
  };

  handleCloseTooltip = () => {
    this.setState({
      showTooltip: false,
    });
    this.props.history.push(URL.MYACCOUNT_TAB({ tab: 'organization' }));
  };

  render() {
    const { activeIndex, showTooltip } = this.state;
    const { classes, firstPayment, setFirstPayment, role } = this.props;
    return (
      <div>
        {firstPayment && (
          <WelcomeModal
            modelProps={{
              open: true,
              centered: false,
              dimmer: 'inverted',
            }}
            action="Create new Program"
            onClose={() => {
              setFirstPayment(false);
            }}
          />
        )}
        <Title icon={<AccountIcon height={25} />}>Account Settings</Title>
        <Tab
          menu={{ color: 'green', secondary: true, pointing: true }}
          panes={panes(role, classes, showTooltip, this.handleCloseTooltip)}
          className="mytabs"
          onTabChange={this.changeTab}
          activeIndex={activeIndex}
        />
      </div>
    );
  }
}

export default MyAccount;
