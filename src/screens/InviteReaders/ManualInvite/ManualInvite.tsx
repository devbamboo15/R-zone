import * as React from 'react';
import get from 'lodash/get';
import * as queryString from 'query-string';
import history from 'src/helpers/history';
import URL from 'src/helpers/urls';
import InvitesTable from '../InvitesTable';
import InvitedTable from '../InvitedTable';

export enum InviteType {
  INVITED = 'invited',
  INVITES = 'invites',
}

export interface ComponentProps {
  onMessage?: Function;
}

export type ManualInviteProps = IComponentProps &
  ComponentProps & {
    classes: any;
    isShowMode: InviteType;
    invitedUsers: any;
    setIsShowMode: Function;
    loading: boolean;
  };

class ManualInvite extends React.Component<ManualInviteProps> {
  componentDidMount() {
    this.checkInvitedMode();
  }

  componentDidUpdate() {
    this.checkInvitedMode();
  }

  checkInvitedMode = () => {
    const { setIsShowMode } = this.props;
    const params = queryString.parse(history.location.search);
    const searchRef = get(params, 'invited');
    if (searchRef === 'true') {
      setIsShowMode(InviteType.INVITED);
      history.push(URL.INVITE_READERS_TAB({ tab: 'manual_invite' }));
    }
  };

  render() {
    const { isShowMode, invitedUsers } = this.props;

    return (
      <div>
        {isShowMode === InviteType.INVITES && (
          <InvitesTable
            onShowMode={this.props.setIsShowMode}
            onMessage={this.props.onMessage}
          />
        )}
        {isShowMode === InviteType.INVITED && (
          <InvitedTable
            users={invitedUsers || []}
            onShowMode={this.props.setIsShowMode}
            loading={this.props.loading}
          />
        )}
      </div>
    );
  }
}

export default ManualInvite;
