import * as React from 'react';
import { Table, GridColumn, Statistic } from 'semantic-ui-react';
import Button, { ButtonColor, ButtonType } from 'src/components/Button';
import Heading, { HeadingColor, HeadingType } from 'src/components/Heading';
import ReSelect from 'src/components/ReSelect';
import Checkbox from 'src/components/FormFields/Checkbox';
import Spinner from 'src/components/Spinner';
import cx from 'classnames';
import { isFunction } from 'lodash';
import AddSvg from 'assets/icons/plus.svg';
// import PreviewEmailModal from 'src/components/Modal/PreviewEmailModal';
import { UserForm } from 'src/components/Forms/InviteUserForm';
import { ISelection } from 'src/store/types/organizer/invite';
import idx from 'idx';
import URL from 'src/helpers/urls';
import history from 'src/helpers/history';
import InvitesRow from './Row';
import BottomActions from '../BottomActions';
import { InviteType } from '../ManualInvite/ManualInvite';

export interface ComponentProps {
  onAddMore?: () => void;
  users?: UserForm[];
  onShowMode?: Function;
  onMessage?: Function;
  isBulk?: boolean;
}

export interface WithStateProps {
  currentRowAction: number | null;
  currentRowEdit: number | null;
  inviteProgramId: number | null;
  setCurrentRowAction: Function;
  setCurrentRowEdit: Function;
  setInviteProgramId: Function;
  roles: ISelection[];
  programs: ISelection[];
  programGroups: {
    [x: string]: ISelection[];
  };
  isInviteSaved: boolean;
}

export interface WithHandlerProps {
  onDelete: Function;
  onFormSubmit: (values: UserForm) => void;
}

export type InvitesTableProps = WithStateProps &
  WithHandlerProps &
  ComponentProps & {
    classes: any;
    sendInviteReaders: (data: any, cb?: Function) => void;
    profile: any;
    loading: boolean;
    totalSend: number;
  };
interface InvitesTableState {
  isSelectAll: boolean;
  shouldUpdateChild: boolean;
  countSelection: number;
  isOpenPreviewEmailModal: boolean;
  users: UserForm[];
  groups: ISelection[];
  role: any;
  program: any;
  group: any;
}

class InvitesTable extends React.Component<
  InvitesTableProps,
  InvitesTableState
> {
  constructor(props) {
    super(props);
    this.state = {
      isSelectAll: false,
      shouldUpdateChild: false,
      countSelection: 0,
      users: this.props.users || [],
      groups: [],
      role: null,
      program: null,
      group: null,
      isOpenPreviewEmailModal: false,
    };
  }

  rowNodes: any = [];

  componentDidUpdate(previousProps, previousState) {
    if (previousState.countSelection !== this.state.countSelection) {
      const isAllChecked =
        this.state.countSelection === this.state.users.length;
      if (isAllChecked !== this.state.isSelectAll) {
        this.setState({
          isSelectAll: isAllChecked,
          shouldUpdateChild: false,
        });
      }
    }

    // Navigate to invited page on allinvite success
    if (
      this.props.isInviteSaved &&
      previousProps.isInviteSaved !== this.props.isInviteSaved
    ) {
      if (isFunction(this.props.onShowMode)) {
        this.props.onShowMode(InviteType.INVITED);
      }
    }
  }

  openPreviewEmailModal = () => {
    this.setState({
      isOpenPreviewEmailModal: true,
    });
  };

  closePreviewEmailModal = () => {
    this.setState({
      isOpenPreviewEmailModal: false,
    });
  };

  onChangeRole = val => {
    this.setState({ role: val });
  };

  onChangeProgram = val => {
    const programId = idx(val, x => x.value);
    const newGroups = this.props.programGroups[programId.toString()];
    this.setState({ program: val, groups: newGroups, group: null });
    this.props.setInviteProgramId(programId);
  };

  onChangeGroup = val => {
    this.setState({ group: val });
  };

  addMore = () => {
    const item: UserForm = {
      id: this.state.users.length,
      first_name: '',
      last_name: '',
      email: '',
      role: '',
      program: '',
      group: '',
    };
    this.setState(state => ({ users: [...state.users, item] }));
  };

  onDelete = id => {
    this.setState(state => ({
      users: state.users.filter(val => val.id !== id),
    }));
  };

  onFormSubmit = (values: UserForm) => {
    this.setState(state => ({
      users: state.users.map(val => {
        if (values.id === val.id) {
          return { ...values };
        }
        return val;
      }),
    }));
    return values;
  };

  sendInviteReaders = () => {
    let inviteItems = [];
    let isSomeInvalid = false;
    this.rowNodes.map(node => {
      if (node) {
        if (node.isValid()) {
          inviteItems = [...inviteItems, node.getUpdatedData()];
        } else {
          isSomeInvalid = true;
        }
      }

      return node;
    });

    if (!isSomeInvalid && inviteItems.length > 0) {
      const data: any = {
        user_id: this.props.profile.data.id,
        invites: inviteItems,
      };
      this.props.sendInviteReaders(data, () => {
        if (this.props.isBulk) {
          history.push(
            `${URL.INVITE_READERS_TAB({ tab: 'manual_invite' })}?invited=true`
          );
        }
        setTimeout(() => {
          const msg = `You have sent ${inviteItems.length} invite${
            inviteItems.length > 1 ? 's' : ''
          }`;
          this.props.onMessage(msg);
        }, 0);
      });
    }

    return isSomeInvalid;
  };

  renderLoader = () => {
    if (this.props.loading) {
      return <Spinner />;
    }
    return null;
  };

  render() {
    const { classes, currentRowEdit, onAddMore } = this.props;
    const { countSelection } = this.state;

    return (
      <div>
        <Table unstackable className={classes.table}>
          <Table.Header>
            <Table.Row className={classes.tableRow}>
              <Table.HeaderCell
                width={2}
                className={cx(classes.tableHeaderRow, classes.centerCell)}>
                <Checkbox
                  secondary
                  center
                  checkboxProps={{
                    onChange: (e, { checked }) => {
                      if (checked) {
                        this.setState(state => ({
                          isSelectAll: checked,
                          countSelection: state.users.length,
                          shouldUpdateChild: true,
                        }));
                      } else {
                        this.setState({
                          isSelectAll: checked,
                          countSelection: 0,
                          shouldUpdateChild: true,
                        });
                      }
                    },
                    checked: this.state.isSelectAll,
                  }}
                />
                <Heading
                  headingProps={{
                    as: 'h5',
                    textAlign: 'center',
                    className: classes.selectAllHeading,
                  }}
                  colorVariant={HeadingColor.SECONDARY}
                  type={HeadingType.BOLD_500}>
                  Select All
                </Heading>
              </Table.HeaderCell>
              <Table.HeaderCell
                width={4}
                className={cx(classes.tableHeaderRow)}>
                <Heading
                  headingProps={{ as: 'h5', textAlign: 'left' }}
                  colorVariant={HeadingColor.CYAN}
                  type={HeadingType.NORMAL}>
                  Email
                </Heading>
                <Statistic horizontal size="mini">
                  <Statistic.Label className={classes.totalInviteLabel}>
                    Total Invites:{' '}
                  </Statistic.Label>
                  <Statistic.Value className={classes.totalInviteValue}>
                    {this.state.users.length}
                  </Statistic.Value>
                </Statistic>
              </Table.HeaderCell>
              <Table.HeaderCell
                width={2}
                className={cx(classes.tableHeaderRow)}>
                <Heading
                  headingProps={{ as: 'h5', textAlign: 'left' }}
                  colorVariant={HeadingColor.CYAN}
                  type={HeadingType.NORMAL}>
                  Role
                </Heading>
                <ReSelect
                  selectProps={{
                    placeholder: 'Select',
                    options: this.props.roles,
                    value: this.state.role,
                    onChange: this.onChangeRole,
                    isDisabled: countSelection <= 0,
                  }}
                />
              </Table.HeaderCell>
              <Table.HeaderCell
                width={3}
                className={cx(classes.tableHeaderRow)}>
                <Heading
                  headingProps={{ as: 'h5', textAlign: 'left' }}
                  colorVariant={HeadingColor.CYAN}
                  type={HeadingType.NORMAL}>
                  Program
                </Heading>
                <ReSelect
                  selectProps={{
                    placeholder: 'Select',
                    options: this.props.programs,
                    value: this.state.program,
                    onChange: this.onChangeProgram,
                    isDisabled: countSelection <= 0,
                  }}
                />
              </Table.HeaderCell>
              <Table.HeaderCell
                width={3}
                className={cx(classes.tableHeaderRow)}>
                <Heading
                  headingProps={{ as: 'h5', textAlign: 'left' }}
                  colorVariant={HeadingColor.CYAN}
                  type={HeadingType.NORMAL}>
                  Group
                </Heading>
                <ReSelect
                  selectProps={{
                    placeholder: 'Select',
                    options: this.state.groups,
                    value: this.state.group,
                    onChange: this.onChangeGroup,
                    isDisabled: countSelection <= 0,
                  }}
                />
              </Table.HeaderCell>
              <Table.HeaderCell
                width={2}
                className={cx(classes.tableHeaderRow)}
              />
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {this.state.users.map((user: UserForm, index) => (
              <InvitesRow
                key={index}
                onRef={ref => {
                  this.rowNodes[index] = ref;
                }}
                user={user}
                index={index}
                roles={this.props.roles}
                programs={this.props.programs}
                programGroups={this.props.programGroups}
                role={this.state.role}
                program={this.state.program}
                group={this.state.group}
                profile={this.props.profile}
                classes={classes}
                selectCheckbox={this.state.isSelectAll}
                shouldUpdate={this.state.shouldUpdateChild}
                onChange={checked => {
                  if (checked) {
                    this.setState(state => ({
                      countSelection: state.countSelection + 1,
                    }));
                  } else {
                    this.setState(state => ({
                      countSelection: state.countSelection - 1,
                    }));
                  }
                }}
                onDelete={this.onDelete}
                onFormSubmit={this.onFormSubmit}
              />
            ))}
          </Table.Body>
        </Table>
        <div>{this.renderLoader()}</div>
        <div className={classes.footerActions}>
          <GridColumn className={classes.bottomBar}>
            <Button
              buttonProps={{
                disabled: currentRowEdit !== null,
                primary: false,
                onClick: () =>
                  isFunction(onAddMore) ? onAddMore() : this.addMore(),
              }}
              colorVariant={
                currentRowEdit !== null ? ButtonColor.GRAY : ButtonColor.PRIMARY
              }
              icon={<AddSvg height={20} />}
              buttonType={ButtonType.ROUND}>
              <Heading
                headingProps={{ as: 'h4' }}
                colorVariant={HeadingColor.WHITE}
                type={HeadingType.NORMAL}>
                Add Reader
              </Heading>
            </Button>
          </GridColumn>
        </div>
        <BottomActions
          isDisabled={currentRowEdit !== null}
          onClick={this.sendInviteReaders}
          onClickPreviewEmail={this.openPreviewEmailModal}
        />
        {/* <PreviewEmailModal
          modelProps={{
            open: this.state.isOpenPreviewEmailModal,
            size: 'small',
            onClose: this.closePreviewEmailModal,
          }}
          onCancel={this.closePreviewEmailModal}
        /> */}
      </div>
    );
  }
}

export default InvitesTable;
