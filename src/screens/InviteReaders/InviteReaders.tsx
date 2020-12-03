import * as React from 'react';
import { Tab } from 'semantic-ui-react';
import { RouteComponentProps } from 'react-router-dom';
import URL from 'src/helpers/urls';
import AccountIcon from 'assets/icons/account_icon.svg';
import Title from 'src/components/Title';
import InviteWhiteSvg from 'assets/icons/invite_white.svg';
import Alert, { AlertType, AlertPosition } from 'src/components/Alert';
import NoOrganizationModal from 'src/components/Modal/NoOrganizationModal';
import styles from './styles.scss';

import ManualInvite from './ManualInvite';
import BulkInvite from './BulkInvite';

export type InviteReadersProps = IComponentProps &
  RouteComponentProps<{ tab?: string }> & {
    setMessage: Function;
    message: string | null;
    organizationId: any;
  };

interface InviteReadersState {
  activeIndex: number;
}

const panes = props => {
  return [
    {
      menuItem: 'Manual Invite',
      render: () => (
        <Tab.Pane attached={false} className={styles.tabContent}>
          <ManualInvite onMessage={props.setMessage} />
        </Tab.Pane>
      ),
    },
    {
      menuItem: 'Bulk Invite',
      render: () => (
        <Tab.Pane attached={false} className={styles.tabBulkContent}>
          <BulkInvite onMessage={props.setMessage} />
        </Tab.Pane>
      ),
    },
  ];
};

class InviteReaders extends React.Component<
  InviteReadersProps,
  InviteReadersState
> {
  constructor(props) {
    super(props);
    const {
      match: {
        params: { tab },
      },
    } = props;
    this.state = {
      activeIndex: this.getIndex(tab),
    };
  }

  componentDidUpdate(props) {
    const {
      match: { params },
    } = props;
    const { match } = this.props;
    const { tab } = params;
    if (match.params.tab !== tab) {
      this.setState(() => ({
        activeIndex: this.getIndex(match.params.tab),
      }));
    }
  }

  getIndex = type => {
    switch (type) {
      case 'manual_invite':
        return 0;
      case 'bulk_invite':
        return 1;
      default:
        return 0;
    }
  };

  changeTab = (event, data) => {
    switch (data.activeIndex) {
      case 1:
        return this.props.history.push(
          URL.INVITE_READERS_TAB({ tab: 'bulk_invite' })
        );
      default:
        return this.props.history.push(
          URL.INVITE_READERS_TAB({ tab: 'manual_invite' })
        );
    }
  };

  render() {
    const { organizationId } = this.props;
    const { activeIndex } = this.state;
    return (
      <div>
        {/* No Organization Infomation Modal */}
        {!organizationId && (
          <NoOrganizationModal
            modelProps={{
              open: true,
              centered: false,
              dimmer: 'inverted',
            }}
            action="Invite Readers"
          />
        )}
        <Title icon={<AccountIcon height={25} />}>Invite Readers</Title>
        <Tab
          menu={{ color: 'green', secondary: true, pointing: true }}
          panes={panes(this.props)}
          className="invite-readers-tab"
          onTabChange={this.changeTab}
          activeIndex={activeIndex}
        />
        {this.props.message && (
          <Alert
            Icon={InviteWhiteSvg}
            iconStyle={{
              width: '25px',
            }}
            content={this.props.message}
            alertType={AlertType.SUCCESS}
            alertPosition={AlertPosition.BOTTOM_FIXED}
            autoDismiss={5}
          />
        )}
      </div>
    );
  }
}

export default InviteReaders;
