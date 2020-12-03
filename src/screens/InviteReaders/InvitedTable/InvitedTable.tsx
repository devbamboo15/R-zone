import * as React from 'react';
import themr from 'src/helpers/themr';
import { TableRow, TableCell } from 'semantic-ui-react';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import Table from 'src/components/Table';
import Button, { ButtonColor, ButtonType } from 'src/components/Button';
import Heading, { HeadingColor, HeadingType } from 'src/components/Heading';
import Spinner from 'src/components/Spinner';
import InviteWhiteSvg from 'assets/icons/invite_white.svg';
import styles from './styles.scss';
import { InviteType } from '../ManualInvite/ManualInvite';

export interface UserInvited {
  id: number;
  role: string;
  email: string;
  program: string;
  group?: string;
}
export interface ComponentProps {
  users: UserInvited[];
  onShowMode: Function;
  loading: boolean;
}
export type InvitedTableProps = IComponentProps &
  RouteComponentProps &
  ComponentProps;

class InvitedTable extends React.Component<InvitedTableProps> {
  renderLoader = () => {
    if (this.props.loading) {
      return <Spinner />;
    }
    return null;
  };

  render() {
    const { classes, users } = this.props;
    return (
      <div>
        <Table
          fields={['Email', 'Role', 'Program', 'Group']}
          tableProps={{ className: classes.table }}>
          {!this.props.loading &&
            users.map((user: any, index: number) => (
              <TableRow key={index}>
                <TableCell className={classes.tableCell}>
                  <Heading
                    headingProps={{ as: 'h4' }}
                    type={HeadingType.NORMAL}>
                    {user.role_id === 'participant'
                      ? `${user.first_name} ${user.last_name}`
                      : user.email}
                  </Heading>
                </TableCell>
                <TableCell className={classes.tableCell}>
                  <Heading
                    headingProps={{ as: 'h5' }}
                    type={HeadingType.NORMAL}
                    colorVariant={HeadingColor.GRAY}>
                    {user.role_title || ''}
                  </Heading>
                </TableCell>
                <TableCell className={classes.tableCell}>
                  <Heading
                    headingProps={{ as: 'h5' }}
                    type={HeadingType.NORMAL}
                    colorVariant={HeadingColor.GRAY}>
                    {user.program_name || ''}
                  </Heading>
                </TableCell>
                <TableCell className={classes.tableCell}>
                  <Heading
                    headingProps={{ as: 'h5' }}
                    type={HeadingType.NORMAL}
                    colorVariant={HeadingColor.GRAY}>
                    {user.group_name || ''}
                  </Heading>
                </TableCell>
              </TableRow>
            ))}
        </Table>
        {this.renderLoader()}
        {!this.props.loading && (
          <div className={classes.inviteMore}>
            <Button
              buttonProps={{
                onClick: () => {
                  this.props.onShowMode(InviteType.INVITES);
                },
              }}
              buttonType={ButtonType.ROUND}
              colorVariant={ButtonColor.SECONDARY}
              icon={<InviteWhiteSvg className={classes.icon} />}>
              <Heading
                headingProps={{ as: 'h5' }}
                type={HeadingType.NORMAL}
                colorVariant={HeadingColor.WHITE}>
                Invite more
              </Heading>
            </Button>
          </div>
        )}
      </div>
    );
  }
}

export default withRouter(
  themr<InvitedTableProps>('InvitedTable', styles)(InvitedTable)
);
