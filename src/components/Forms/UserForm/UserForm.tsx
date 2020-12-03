import * as React from 'react';
import Table from 'src/components/Table';
import Checkbox from 'src/components/FormFields/Checkbox';
import Heading, { HeadingColor, HeadingType } from 'src/components/Heading';
import Input from 'src/components/FormFields/Input';
import {
  TableRow,
  Grid,
  Accordion,
  InputOnChangeData,
  Popup,
} from 'semantic-ui-react';
import _forEach from 'lodash/forEach';
import cloneDeep from 'lodash/cloneDeep';
import cx from 'classnames';
import get from 'lodash/get';
import merge from 'lodash/merge';
import { IProgram } from 'src/store/types/organizer/program';
import OpenSvg from 'assets/icons/open.svg';
import CloseSvg from 'assets/icons/minus.svg';
import { confirmModal } from 'src/components/Modal/ConfirmationModal';
import Spinner from 'src/components/Spinner';
import styles from './styles.scss';

export interface UserFormPropsOut {
  handleChange: (
    event: React.ChangeEvent<HTMLInputElement>,
    data: InputOnChangeData
  ) => void;
  handleBlur: (
    event: React.ChangeEvent<HTMLInputElement>,
    data: InputOnChangeData
  ) => void;
  values: any;
  activeIndex?: number;
  setFieldValue: Function;
  handleClick: Function;
  edit?: boolean;
  errors?: any;
  touched?: any;
  owner?: any;
  user?: any;
  userAccess?: any;
}

export type UserFormProps = IComponentProps & {
  handleChange: (
    event: React.ChangeEvent<HTMLInputElement>,
    data: InputOnChangeData
  ) => void;
  handleBlur: (
    event: React.ChangeEvent<HTMLInputElement>,
    data: InputOnChangeData
  ) => void;
  values: any;
  activeIndex?: number;
  handleClick: any;
  edit?: boolean;
  errors?: any;
  touched?: any;
  programs?: IProgram[];
  getAllProgramsForAuthUser: Function;
  getAuthorizedUser?: Function;
  getProgramLoading?: boolean;
  groups: any;
  match?: any;
  setFieldValue?: Function;
  owner?: any;
  user?: any;
  organization?: any;
  userAccess?: any;
};

class UserForm extends React.PureComponent<UserFormProps> {
  componentDidMount() {
    const { match, edit } = this.props;
    const { params } = match;

    if (edit) {
      this.props.getAuthorizedUser(params.userid);
    }
    this.props.getAllProgramsForAuthUser();
  }

  updateProgramAccess = (
    setFieldValue,
    values,
    id,
    type: 'read' | 'write',
    checked
  ) => {
    let extraData = {};
    // We clone the values to remove reference object to initital values
    values = cloneDeep(values);

    if (type === 'read' && !checked) {
      // if read is not checked, then write also should be disabled
      extraData = {
        write: false,
      };
    }
    if (type === 'write' && checked) {
      // if write is checked, then read also should be checked
      extraData = {
        read: true,
      };
    }
    setFieldValue('access', {
      ...merge(values.access, {
        program: {
          [id]: {
            [type]: checked,
            ...extraData,
          },
        },
      }),
    });
    _forEach(get(values, `access.group_by_program.${id}`), (obj, groupId) => {
      setFieldValue('access', {
        ...merge(values.access, {
          group_by_program: {
            [id]: {
              [groupId]: {
                [type]: checked,
                ...extraData,
              },
            },
          },
        }),
      });
    });
  };

  updateGroupAccess = (
    setFieldValue,
    values,
    id,
    programId,
    type: 'read' | 'write',
    checked
  ) => {
    let extraData = {};
    // We clone the values to remove reference object to initital values
    values = cloneDeep(values);

    if (type === 'read' && !checked) {
      // if read is not checked, then write also should be disabled
      extraData = {
        write: false,
      };
    }
    if (type === 'write' && checked) {
      // if write is checked, then read also should be checked
      extraData = {
        read: true,
      };
    }

    setFieldValue('access', {
      ...merge(values.access, {
        group_by_program: {
          [programId]: {
            [id]: {
              [type]: checked,
              ...extraData,
            },
          },
        },
      }),
    });

    let isSelectedAll = true;
    _forEach(get(values, `access.group_by_program.${programId}`), obj => {
      if (!obj[type]) {
        isSelectedAll = false;
      }
    });
    if (!isSelectedAll) {
      // if not select all children, then unselect program
      setFieldValue('access', {
        ...merge(values.access, {
          program: {
            [programId]: {
              [type]: false,
              write: false,
            },
          },
        }),
      });
    } else {
      setFieldValue('access', {
        ...merge(values.access, {
          program: {
            [programId]: {
              [type]: true,
              read: true,
            },
          },
        }),
      });
    }
  };

  render() {
    const {
      activeIndex,
      handleClick,
      classes,
      edit,
      handleChange,
      handleBlur,
      values,
      errors,
      touched,
      programs,
      groups,
      setFieldValue,
      owner,
      user,
      organization,
      getProgramLoading,
      userAccess,
    } = this.props;

    const accessOwner = get(values, 'access.owner', false);
    const initAccessOwner = get(userAccess, 'owner', false);

    const isDisabledForOwner =
      initAccessOwner && organization.owner_count === 1;
    const isDisabledCheckbox = accessOwner;

    const contentPopupPermission =
      'Permissions cannot be edited for an Account Owner. The Account Owner must have access to all Reading Programs and Groups.';

    return (
      <>
        <Grid columns={4}>
          <Input
            inputProps={{
              placeholder: 'First Name',
              onChange: handleChange,
              onBlur: handleBlur,
              value: values.first_name,
              name: 'first_name',
            }}
            label="First Name"
            errorMessage={
              get(touched, 'first_name') && get(errors, 'first_name')
            }
          />
          <Input
            inputProps={{
              placeholder: 'Last Name',
              onChange: handleChange,
              onBlur: handleBlur,
              value: values.last_name,
              name: 'last_name',
            }}
            label="Last Name"
            errorMessage={get(touched, 'last_name') && get(errors, 'last_name')}
          />
          <Input
            inputProps={{
              placeholder: 'Email Address',
              type: 'email',
              onChange: handleChange,
              onBlur: handleBlur,
              value: values.email,
              name: 'email',
            }}
            label="Email Address"
            errorMessage={get(touched, 'email') && get(errors, 'email')}
          />
        </Grid>
        <Grid className={classes.permissionContent}>
          <Heading
            headingProps={{ as: 'h4', className: classes.permission }}
            type={HeadingType.NORMAL}>
            Permissions
          </Heading>
          <Popup
            content="Can't delete the only Account Owner"
            wide
            position="top left"
            size="small"
            disabled={!edit || !isDisabledForOwner}
            trigger={
              <div className={classes.checkboxPermission}>
                <Checkbox
                  checkboxProps={{
                    disabled: edit && isDisabledForOwner,
                    checked: accessOwner,
                    onChange: (_, { checked }) => {
                      const ownerEmail = get(owner, 'attributes.email', '');
                      const userEmail = get(user, 'attributes.email', '');
                      if (checked && ownerEmail !== userEmail) {
                        confirmModal.open({
                          // message: `This will replace ${firstName} ${lastName} as the Owner for your entire Organization. Are you sure?`,
                          message:
                            'This action will give this user Account Owner privileges. \nThe user will have full access to all the data, reading programs and settings in this account.',
                          onOkClick: () => {
                            setFieldValue('access.owner', checked);
                          },
                        });
                      } else {
                        setFieldValue('access.owner', checked);
                      }
                    },
                  }}>
                  <Heading
                    headingProps={{ as: 'h5' }}
                    type={HeadingType.NORMAL}
                    colorVariant={HeadingColor.SECONDARY}>
                    Organization Owner
                  </Heading>
                </Checkbox>
              </div>
            }
          />
        </Grid>
        <Table
          widths={[12, 2, 2]}
          fields={['Program Name', 'Read', 'Write']}
          accordian
          tableProps={{ className: classes.tableContainer }}>
          <TableRow className={classes.table_row} />
        </Table>
        {getProgramLoading ? (
          <div className={classes.loadingContainer}>
            <Spinner />
          </div>
        ) : (
          <Accordion styled className={classes.accordianContainer} fluid>
            {programs.map((program, index) => (
              <div key={index}>
                <Accordion.Title
                  index={index}
                  active={activeIndex === index}
                  className={cx({
                    [styles.accordianContent]: activeIndex === index,
                  })}>
                  <Grid>
                    <Grid.Column
                      width={12}
                      className={classes.rowStyle}
                      onClick={() => handleClick(null, { index })}>
                      <Heading
                        headingProps={{ as: 'h3' }}
                        type={HeadingType.NORMAL}
                        Icon={activeIndex === index ? CloseSvg : OpenSvg}
                        iconHeight={25}
                        nomargin>
                        {get(program, 'attributes.name')};{' '}
                        {program.attributes.code}
                      </Heading>
                    </Grid.Column>
                    <Grid.Column width={2}>
                      <Popup
                        content={contentPopupPermission}
                        wide
                        position="top center"
                        size="small"
                        disabled={!isDisabledCheckbox}
                        trigger={
                          <div className={classes.popupContainer}>
                            <Checkbox
                              checkboxProps={{
                                disabled: isDisabledCheckbox,
                                checked:
                                  get(
                                    values.access,
                                    `program.${program.id}.read`,
                                    false
                                  ) || isDisabledCheckbox,
                                onChange: (_, { checked }) => {
                                  this.updateProgramAccess(
                                    setFieldValue,
                                    values,
                                    program.id,
                                    'read',
                                    checked
                                  );
                                },
                              }}
                            />
                          </div>
                        }
                      />
                    </Grid.Column>
                    <Grid.Column width={2}>
                      <Popup
                        content={contentPopupPermission}
                        wide
                        position="top center"
                        size="small"
                        disabled={!isDisabledCheckbox}
                        trigger={
                          <div className={classes.popupContainer}>
                            <Checkbox
                              checkboxProps={{
                                disabled: isDisabledCheckbox,
                                checked:
                                  get(
                                    values.access,
                                    `program.${program.id}.write`,
                                    false
                                  ) || isDisabledCheckbox,
                                onChange: (_, { checked }) => {
                                  this.updateProgramAccess(
                                    setFieldValue,
                                    values,
                                    program.id,
                                    'write',
                                    checked
                                  );
                                },
                              }}
                            />
                          </div>
                        }
                      />
                    </Grid.Column>
                  </Grid>
                </Accordion.Title>
                <Accordion.Content
                  active={activeIndex === index}
                  className={cx({
                    [styles.accordianContent]: activeIndex === index,
                  })}>
                  {get(groups, `${program.id}.data`, []).map(programGroup => (
                    <Grid key={programGroup.id}>
                      <Grid.Column width={12} className={classes.rowItem}>
                        <Heading
                          headingProps={{ as: 'h4' }}
                          type={HeadingType.NORMAL}
                          colorVariant={HeadingColor.SECONDARY}>
                          {get(programGroup, 'attributes.name')}
                        </Heading>
                      </Grid.Column>
                      <Grid.Column width={2}>
                        <Popup
                          content={contentPopupPermission}
                          wide
                          position="top center"
                          size="small"
                          disabled={!isDisabledCheckbox}
                          trigger={
                            <div className={classes.popupContainer}>
                              <Checkbox
                                checkboxProps={{
                                  disabled: isDisabledCheckbox,
                                  checked:
                                    get(
                                      values.access,
                                      `group_by_program.${program.id}.${
                                        programGroup.id
                                      }.read`,
                                      false
                                    ) || isDisabledCheckbox,
                                  onChange: (_, { checked }) => {
                                    this.updateGroupAccess(
                                      setFieldValue,
                                      values,
                                      programGroup.id,
                                      program.id,
                                      'read',
                                      checked
                                    );
                                  },
                                }}
                              />
                            </div>
                          }
                        />
                      </Grid.Column>
                      <Grid.Column width={2}>
                        <Popup
                          content={contentPopupPermission}
                          wide
                          position="top center"
                          size="small"
                          disabled={!isDisabledCheckbox}
                          trigger={
                            <div className={classes.popupContainer}>
                              <Checkbox
                                checkboxProps={{
                                  disabled: isDisabledCheckbox,
                                  checked:
                                    get(
                                      values.access,
                                      `group_by_program.${program.id}.${
                                        programGroup.id
                                      }.write`,
                                      false
                                    ) || isDisabledCheckbox,
                                  onChange: (_, { checked }) => {
                                    this.updateGroupAccess(
                                      setFieldValue,
                                      values,
                                      programGroup.id,
                                      program.id,
                                      'write',
                                      checked
                                    );
                                  },
                                }}
                              />
                            </div>
                          }
                        />
                      </Grid.Column>
                    </Grid>
                  ))}
                </Accordion.Content>
              </div>
            ))}
          </Accordion>
        )}
      </>
    );
  }
}

export default UserForm;
