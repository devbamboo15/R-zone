import * as React from 'react';
import Heading, { HeadingColor, HeadingType } from 'src/components/Heading';
import { UserForm } from 'src/components/Forms/InviteUserForm';
import compact from 'lodash/compact';
import history from 'src/helpers/history';
import { RouteComponentProps } from 'react-router-dom';
import RouteLeavingGuard from 'src/components/RouteLeavingGuard';
import InvitesTable from '../InvitesTable';
import BulkImport from './BulkImport';

export enum InviteType {
  FORM = 'form',
  TABLE = 'table',
}

export interface ComponentProps {
  onMessage?: Function;
}

export interface WithStateProps {
  message?: string;
  isShowMode: InviteType;
  setIsShowForm: Function;
  setMessage: Function;
}

export interface WithHandlersProps {
  onAddMore: () => void;
}

export type BulkInviteProps = IComponentProps &
  ComponentProps &
  WithStateProps &
  RouteComponentProps &
  WithHandlersProps & {
    classes: any;
  };

interface IState {
  users: UserForm[];
  countTotal: number;
  fileName: string;
}

class BulkInvite extends React.Component<BulkInviteProps, IState> {
  constructor(props) {
    super(props);
    this.state = {
      users: [],
      countTotal: 0,
      fileName: '',
    };
  }

  isValidEmail = (value = '') => {
    if (typeof value !== 'string') {
      return false;
    }
    return Boolean(
      String(value).match(
        /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      )
    );
  };

  addUsers = (users, fileName) => {
    const count = this.state.users.length;
    const newUsers = users.map(user => {
      const newUser: any = {};
      const listKeys = Object.keys(user);
      const keysLength = listKeys.length;
      for (let i = 0; i < keysLength; i++) {
        const key = listKeys[i] || '';
        const loweredCaseKey = key
          .toLowerCase()
          .trim()
          .replace(/ /g, '_');
        if (!newUser[loweredCaseKey]) {
          const value = user[key];
          if (this.isValidEmail(value)) {
            // if value is valid email then assign it to email key
            newUser.email = value;
          } else {
            newUser[loweredCaseKey] = value;
          }
        }
      }
      return newUser;
    });
    let userData = (newUsers || []).slice(0, 500).map((val, index) => {
      if (val.email) {
        return {
          id: count + index,
          first_name: val.first_name || '',
          last_name: val.last_name || '',
          email: val.email || '',
          role: val.role_id || '',
          program: val.program_id || '',
          group: val.group_id || '',
        };
      }
      return null;
    });
    userData = compact(userData);

    this.setState(
      state => ({
        fileName,
        users: [...state.users, ...userData],
        countTotal: state.countTotal + userData.length,
      }),
      () => {
        this.updateImportTitle(this.state.countTotal);
        this.props.setIsShowForm(InviteType.TABLE);
      }
    );
  };

  updateImportTitle = count => {
    const msg = `${count >= 10 ? count : `0${count}`} record${
      count > 1 ? 's' : ''
    } added via bulk invite ${this.state.fileName}`;
    this.props.setMessage(msg);
  };

  setIsShowMode = () => {
    this.props.history.goBack();
  };

  render() {
    const { message, isShowMode, onAddMore, classes } = this.props;
    const { users } = this.state;

    return (
      <>
        <RouteLeavingGuard
          when={users.length > 0}
          navigate={path => {
            this.setState({
              users: [],
            });
            history.push(path);
          }}
          shouldBlockNavigation={() => {
            // Block all url
            return true;
          }}
          message={`You haven't finished sending bulk invites. Discard uploaded list of invitees?`}
        />
        {isShowMode === InviteType.TABLE && (
          <div className={classes.heading}>
            <Heading
              headingProps={{ as: 'h4' }}
              type={HeadingType.NORMAL}
              colorVariant={HeadingColor.SECONDARY}>
              {message}
            </Heading>
          </div>
        )}
        <div
          className={
            isShowMode === InviteType.TABLE ? classes.listTable : classes.upload
          }>
          {isShowMode === InviteType.TABLE && (
            <InvitesTable
              onAddMore={onAddMore}
              users={this.state.users}
              onShowMode={this.setIsShowMode}
              onMessage={this.props.onMessage}
              isBulk
            />
          )}
          {isShowMode === InviteType.FORM && (
            <BulkImport addUsers={this.addUsers} />
          )}
        </div>
      </>
    );
  }
}

export default BulkInvite;
