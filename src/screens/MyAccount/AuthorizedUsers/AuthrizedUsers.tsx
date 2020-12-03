import * as React from 'react';
import {
  TableRow,
  Popup,
  TableCell,
  Grid,
  Form,
  GridColumn,
} from 'semantic-ui-react';
import { RouteComponentProps, withRouter, Link } from 'react-router-dom';
import Table from 'src/components/Table';
import Button, { ButtonColor, ButtonType } from 'src/components/Button';
import Input from 'src/components/FormFields/Input';
import Heading, { HeadingColor, HeadingType } from 'src/components/Heading';
import Checkbox from 'src/components/FormFields/Checkbox';
import URL from 'src/helpers/urls';
import Spinner from 'src/components/Spinner';
import get from 'lodash/get';
import isEqual from 'lodash/isEqual';
import findIndex from 'lodash/findIndex';
import { ICreateAuthUserData } from 'src/api/users';
import { confirmModal } from 'src/components/Modal/ConfirmationModal';
import { capitalize } from 'src/helpers/methods';

import PencilIcon from 'src/assets/icons/pencil.svg';
import DeleteIcon from 'src/assets/icons/delete.svg';
// import UpdateSvg from 'assets/icons/update.svg';
import AddSvg from 'assets/icons/plus.svg';

export type AuthorizedUsersProps = IComponentProps &
  RouteComponentProps & {
    getAllAuthorizedUsers: Function;
    usersLoading: boolean;
    users: ICreateAuthUserData[];
    deleteAuthorizedUser: Function;
    deleteAllAuthorizedUsers: Function;
    deleteAllUsersLoading: boolean;
    organization: any;
    profile: any;
    ownerCount: any;
  };

export interface AuthorizedUsersState {
  users: ICreateAuthUserData[];
  allUsers: ICreateAuthUserData[];
  checkAll: boolean;
  applyCheckAll: boolean;
  checkboxList: any[];
}
class AuthorizedUsers extends React.Component<
  AuthorizedUsersProps,
  AuthorizedUsersState
> {
  state = {
    users: [],
    allUsers: [],
    checkAll: false,
    applyCheckAll: true,
    checkboxList: [],
    organization: {},
  };

  componentDidMount() {
    this.props.getAllAuthorizedUsers();
  }

  static getDerivedStateFromProps(
    nextProps: AuthorizedUsersProps,
    prevState: AuthorizedUsersState
  ) {
    if (!isEqual(prevState.allUsers, nextProps.users))
      return {
        users: nextProps.users,
        allUsers: nextProps.users,
      };
    return null;
  }

  addAuthorizedUser = () => {
    const {
      history: { push },
    } = this.props;
    push(URL.ADD_AUTHORIZED_USER());
  };

  handleSearch = e => {
    const { allUsers } = this.state;
    const { value } = e.target;
    const filterUsers = allUsers.filter(user =>
      `${get(user, 'attributes.first_name', '')} ${get(
        user,
        'attributes.last_name',
        ''
      )}`
        .toLowerCase()
        .includes(value.toLowerCase())
    );
    this.setState(() => ({ users: filterUsers }));
  };

  handleSelectAll = (_, data: any): void => {
    const { users, ownerCount } = this.props;
    if (data.checked) {
      this.setState({
        checkAll: data.checked,
        applyCheckAll: ownerCount > 1,
        checkboxList: users.map(user => {
          const roleName = this.getRoleName(user);
          if (roleName === 'owner' && ownerCount === 1) {
            return {
              id: user.id,
              checked: false,
              role: roleName,
            };
          }

          return {
            id: user.id,
            checked: true,
            role: roleName,
          };
        }),
      });
    } else {
      this.setState({
        checkAll: data.checked,
        applyCheckAll: true,
        checkboxList: [],
      });
    }
  };

  handleDeleteAll = (): void => {
    const { checkboxList } = this.state;
    if (checkboxList && checkboxList.length > 0) {
      const checkIds = checkboxList.filter(c => c.checked);
      if (checkIds && checkIds.length > 0) {
        confirmModal.open({
          message: 'Do you want to delete all selected users?',
          onOkClick: () => {
            const { deleteAllAuthorizedUsers } = this.props;
            const data = {
              users: checkIds.map(u => u.id),
            };
            deleteAllAuthorizedUsers(data, () => {
              this.setState({
                checkAll: false,
                applyCheckAll: false,
                checkboxList: [],
              });
            });
          },
        });
      }
    }
  };

  checkDisabledDelete = (): boolean => {
    const { ownerCount } = this.props;
    return ownerCount === 1;
  };

  checkTypeHeading = (roleName): HeadingType => {
    return roleName === 'owner' ? HeadingType.BOLD_600 : HeadingType.NORMAL;
  };

  getRoleName = (user): string => {
    const role = get(user, 'attributes.organization_role');
    const rolePermission = get(user, 'relationships.roles.data[0].id');
    return role === 'owner' ? role : rolePermission;
  };

  checkDisableDeleteAll = () => {
    const { checkboxList } = this.state;
    const { ownerCount } = this.props;
    const filterOwner = checkboxList.filter(
      item => item.role === 'owner' && item.checked === true
    );

    return ownerCount <= filterOwner.length;
  };

  render() {
    const { classes, usersLoading, deleteAllUsersLoading } = this.props;
    const { users, checkAll, applyCheckAll, checkboxList } = this.state;
    const isDisabledDelete = this.checkDisabledDelete();
    const isDisableDeleteAll = this.checkDisableDeleteAll();

    return (
      <div>
        <Form>
          <Grid columns={2}>
            <Input
              inputProps={{
                placeholder: 'Search User',
                icon: 'search',
                onChange: this.handleSearch,
              }}
            />
            <GridColumn className={classes.bottomBar}>
              <Button
                buttonProps={{ onClick: this.addAuthorizedUser }}
                colorVariant={ButtonColor.PRIMARY}
                icon={<AddSvg height={20} />}
                buttonType={ButtonType.ROUND}>
                <Heading
                  headingProps={{ as: 'h4' }}
                  colorVariant={HeadingColor.WHITE}
                  type={HeadingType.NORMAL}>
                  Add New User
                </Heading>
              </Button>
            </GridColumn>
          </Grid>
        </Form>
        <Table
          onSelectAll={this.handleSelectAll}
          fields={[
            'Authorized Users',
            'Email',
            'Role',
            'Last Login',
            'Actions',
          ]}
          select
          disableSelect={isDisabledDelete && users.length === 1}
          disableDeleteAll={isDisableDeleteAll || users.length === 1}
          onDeleteAll={this.handleDeleteAll}
          deleteAllDisplay
          currentcheckAll={checkAll}>
          {deleteAllUsersLoading && (
            <TableRow>
              <TableCell colSpan="100%">
                <Spinner />
              </TableCell>
            </TableRow>
          )}
          {users.map((user: any) => {
            const eachUser = checkboxList.find(c => c.id === user.id) || {};
            const roleName = this.getRoleName(user);
            const headingType = this.checkTypeHeading(roleName);

            return (
              <TableRow className={classes.table_row} key={user.id}>
                <TableCell style={{ textAlign: 'right' }}>
                  <Link to={URL.EDIT_AUTHORIZED_USER({ userid: user.id })}>
                    <PencilIcon height={17} width={17} />
                  </Link>
                </TableCell>
                <TableCell>
                  <div className={classes.icon_container}>
                    <Checkbox
                      center
                      checkboxProps={{
                        disabled: roleName === 'owner' && isDisabledDelete,
                        checked: applyCheckAll ? checkAll : eachUser.checked,
                        onChange: (_, data: any) => {
                          const newCheckList = [...checkboxList];
                          const currentCheckboxIndex = findIndex(newCheckList, {
                            id: user.id,
                          });
                          if (currentCheckboxIndex >= 0) {
                            newCheckList[currentCheckboxIndex].checked =
                              data.checked;
                            this.setState({
                              applyCheckAll: false,
                              checkboxList: newCheckList,
                            });
                          } else {
                            const checkboxObj = {
                              id: user.id,
                              checked: data.checked,
                              role: this.getRoleName(user),
                            };
                            this.setState(state => ({
                              applyCheckAll: false,
                              checkboxList: [
                                ...state.checkboxList,
                                checkboxObj,
                              ],
                            }));
                          }
                        },
                      }}
                    />
                  </div>
                </TableCell>
                <TableCell>
                  <Heading headingProps={{ as: 'h4' }} type={headingType}>
                    {`${get(user, 'attributes.first_name')} ${get(
                      user,
                      'attributes.last_name'
                    )}`}
                  </Heading>
                </TableCell>
                <TableCell>
                  <Heading
                    headingProps={{ as: 'h5' }}
                    type={headingType}
                    colorVariant={HeadingColor.GRAY}>
                    {get(user, 'attributes.email')}
                  </Heading>
                </TableCell>
                <TableCell>
                  <Heading
                    headingProps={{ as: 'h5' }}
                    type={headingType}
                    colorVariant={HeadingColor.GRAY}>
                    {capitalize(roleName)}
                  </Heading>
                </TableCell>
                <TableCell>
                  <Heading
                    headingProps={{ as: 'h5' }}
                    type={headingType}
                    colorVariant={HeadingColor.GRAY}>
                    {/* TODO: need to get last login datetime */}
                  </Heading>
                </TableCell>
                <TableCell>
                  <Popup
                    content="Can't delete the only Account Owner"
                    wide
                    position="top right"
                    size="small"
                    disabled={roleName !== 'owner' || !isDisabledDelete}
                    trigger={
                      <div className={classes.buttonDelete}>
                        <Button
                          buttonProps={{
                            size: 'tiny',
                            disabled: roleName === 'owner' && isDisabledDelete,
                            onClick: () => {
                              confirmModal.open({
                                message:
                                  'Deleting this authorized user will completely remove the user from this Reader Zone account. The user can be re-added as an Authorized User by the Account Owner at any time.\n\nDo you want to delete this user?',
                                onOkClick: () =>
                                  this.props.deleteAuthorizedUser(user.id),
                              });
                            },
                          }}
                          buttonType={ButtonType.TRANSPARENT}>
                          <DeleteIcon height={20} />
                        </Button>
                      </div>
                    }
                  />
                </TableCell>
              </TableRow>
            );
          })}
        </Table>
        {usersLoading && <Spinner />}
        {/* <div className={classes.loadmoreContainer}>
          <Button
            buttonProps={{ primary: false }}
            icon={<UpdateSvg height={20} />}>
            <Heading
              headingProps={{ as: 'h5' }}
              type={HeadingType.NORMAL}
              colorVariant={HeadingColor.GRAY}>
              Load More
            </Heading>
          </Button>
        </div> */}
      </div>
    );
  }
}

export default withRouter(AuthorizedUsers);
