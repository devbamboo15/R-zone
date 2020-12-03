import * as React from 'react';
import { Table, GridColumn, Dropdown, Grid } from 'semantic-ui-react';
import Button, { ButtonColor, ButtonType } from 'src/components/Button';
import Heading, { HeadingColor, HeadingType } from 'src/components/Heading';
import ReSelect from 'src/components/ReSelect';
import { get, isEqual } from 'lodash';
import Input from 'src/components/FormFields/Input';
import Checkbox from 'src/components/FormFields/Checkbox';
import { Formik } from 'formik';
import * as Yup from 'yup';
import idx from 'idx';
import UnionSvg from 'assets/icons/union.svg';
import UnionGreenSvg from 'assets/icons/union_green.svg';
import DeleteIcon from 'src/assets/icons/delete.svg';
import CursorSvg from 'src/assets/icons/cursor.svg';
import CancelSvg from 'assets/icons/cancel.svg';
import SaveSvg from 'assets/icons/save.svg';
import InviteUserForm, { UserForm } from 'src/components/Forms/InviteUserForm';
import { ISelection } from 'src/store/types/organizer/invite';
import HelperIcon from 'src/components/Helper/Icon';

export interface ComponentProps {
  user: UserForm;
  selectCheckbox: boolean;
  shouldUpdate: boolean;
  index: number;
  onChange: Function;
  roles: ISelection[];
  programs: ISelection[];
  programGroups: {
    [x: string]: ISelection[];
  };
  role?: any;
  program?: any;
  group?: any;
  onDelete: Function;
  onFormSubmit: (values: UserForm) => void;
  profile: any;
  onRef?: Function;
}

export type InvitesRowProps = ComponentProps & {
  classes: any;
};

interface InvitesRowState {
  checked: boolean;
  currentRowAction: number | null;
  currentRowEdit: number | null;
  groups: ISelection[];
  role: any;
  program: any;
  group: any;
  formData: UserForm;
  emailRequired: boolean;
  firstNameRequired: boolean;
  lastNameRequired: boolean;
  programRequired: boolean;
}

class InvitesRow extends React.Component<InvitesRowProps, InvitesRowState> {
  constructor(props) {
    super(props);
    this.state = {
      checked: this.props.selectCheckbox,
      currentRowAction: null,
      currentRowEdit: null,
      groups: [],
      role: this.props.role,
      program: this.props.program,
      group: this.props.group,
      formData: this.props.user,
      emailRequired: false,
      programRequired: false,
      firstNameRequired: false,
      lastNameRequired: false,
    };
  }

  componentDidMount() {
    this.props.onRef(this);
  }

  componentWillUnmount() {
    this.props.onRef(undefined);
  }

  componentDidUpdate(prevProps) {
    if (
      this.props.shouldUpdate &&
      this.props.selectCheckbox !== prevProps.selectCheckbox &&
      this.props.selectCheckbox !== this.state.checked
    ) {
      this.setState({ checked: this.props.selectCheckbox });
    }
    if (this.state.checked) {
      if (this.props.role !== prevProps.role) {
        this.setState(state => ({
          role: this.props.role,
          formData: { ...state.formData, role: this.props.role.value },
        }));
      }

      if (this.props.program !== prevProps.program) {
        const programId = idx(this.props, x => x.program.value);
        const groups = this.props.programGroups[programId.toString()];
        this.setState(state => ({
          program: this.props.program,
          groups,
          group: null,
          formData: { ...state.formData, program: this.props.program.value },
        }));
      }

      if (this.props.group !== prevProps.group) {
        const newGroup = this.props.group ? this.props.group.value : null;
        this.setState(state => ({
          group: this.props.group,
          formData: { ...state.formData, group: newGroup },
        }));
      }
    }
  }

  // Get data retruns updated data item.
  getUpdatedData = () => {
    const { formData } = this.state;
    return {
      first_name: formData.first_name,
      last_name: formData.last_name,
      email: formData.email,
      role_id: formData.role,
      program_id: formData.program,
      group_id: formData.group,
    };
  };

  // isChecked retruns selection status.
  isChecked = () => this.state.checked;

  // Check form validation
  isValid = () => {
    let flagValue = true;
    const { formData } = this.state;
    let stateObject = {};
    if (formData.role !== 'participant') {
      if (!formData.email) {
        stateObject = { ...stateObject, emailRequired: true };
        flagValue = false;
      }
      if (formData.email && this.isInValidEmail(formData.email)) {
        stateObject = { ...stateObject, emailRequired: true };
        flagValue = false;
      }
    } else if (
      formData.first_name.trim() === '' ||
      formData.last_name.trim() === ''
    ) {
      flagValue = false;
    }

    if (!formData.program) {
      stateObject = { ...stateObject, programRequired: true };
      flagValue = false;
    }
    if (!flagValue) {
      this.setState({ ...stateObject });
    }
    return flagValue;
  };

  onChange = (e, { checked }) => {
    this.setState({ checked });
    this.props.onChange(checked);
    e.preventDefault();
  };

  onSubmit = (values: UserForm) => {
    this.setState(state => ({
      formData: { ...state.formData, ...values },
    }));
    this.props.onFormSubmit(values);
    this.setState({ currentRowEdit: null });
  };

  onDropdownChange = (type, val) => {
    if (type === 'role') {
      const selectedValue = this.props.roles.filter(
        value => value.value === val
      );
      const itemValue =
        selectedValue && selectedValue.length > 0 ? selectedValue[0] : null;
      this.setState(state => ({
        role: itemValue,
        formData: { ...state.formData, role: itemValue.value },
      }));
    } else if (type === 'program') {
      const selectedValue = this.props.programs.filter(
        value => value.value === val
      );
      const itemValue =
        selectedValue && selectedValue.length > 0 ? selectedValue[0] : null;
      const groups = this.props.programGroups[val.toString()];
      this.setState({ groups, program: itemValue });
    } else if (type === 'group') {
      const selectedValue = this.state.groups.filter(
        value => value.value === val
      );
      const itemValue =
        selectedValue && selectedValue.length > 0 ? selectedValue[0] : null;
      this.setState({ group: itemValue });
    }
  };

  onRowDropdownChange = (type, val) => {
    if (type === 'role') {
      this.setState(state => ({
        role: val,
        formData: { ...state.formData, role: val.value },
      }));
    } else if (type === 'program') {
      const programId = idx(val, x => x.value);
      const newGroups = this.props.programGroups[programId.toString()];
      this.setState(state => ({
        program: val,
        groups: newGroups,
        group: null,
        formData: { ...state.formData, program: val.value },
        programRequired: false,
      }));
    } else if (type === 'group') {
      this.setState(state => ({
        group: val,
        formData: { ...state.formData, group: val.value },
      }));
    }
  };

  isInValidEmail = value => {
    if (value.match(/^[a-zA-Z0-9+._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/)) {
      return false;
    }
    return true;
  };

  render() {
    const { classes, onDelete, user, index } = this.props;
    return (
      <Table.Row key={index}>
        {this.state.currentRowEdit !== user.id ? (
          <>
            <Table.Cell width={2}>
              <Checkbox
                secondary
                center
                checkboxProps={{
                  onChange: this.onChange,
                  checked: this.state.checked,
                }}
              />
            </Table.Cell>
            <Table.Cell width={4}>
              {this.state.formData &&
              this.state.formData.role === 'participant' ? (
                <>
                  <div
                    style={{
                      padding: '0 5px 0 0',
                      width: '48%',
                      display: 'inline-block',
                    }}>
                    <Input
                      inputProps={{
                        placeholder: 'First name',
                        disabled: false,
                        error: this.state.firstNameRequired,
                        value: get(this.state.formData, 'first_name'),
                        onChange: (e, data) => {
                          this.setState(state => ({
                            formData: {
                              ...state.formData,
                              first_name: data.value,
                            },
                            firstNameRequired: data.value === '',
                          }));
                        },
                      }}
                    />
                  </div>
                  <div
                    style={{
                      padding: '0 0 0 5px',
                      width: '48%',
                      display: 'inline-block',
                    }}>
                    <Input
                      inputProps={{
                        placeholder: 'Last name',
                        disabled: false,
                        error: this.state.lastNameRequired,
                        value: get(this.state.formData, 'last_name'),
                        onChange: (e, data) => {
                          this.setState(state => ({
                            formData: {
                              ...state.formData,
                              last_name: data.value,
                            },
                            lastNameRequired: data.value === '',
                          }));
                        },
                      }}
                    />
                  </div>
                </>
              ) : (
                <Input
                  inputProps={{
                    placeholder: 'Email',
                    disabled: false,
                    error: this.state.emailRequired,
                    value: get(this.state.formData, 'email'),
                    onChange: (e, data) => {
                      this.setState(state => ({
                        formData: {
                          ...state.formData,
                          email: data.value,
                        },
                        emailRequired: this.isInValidEmail(data.value),
                      }));
                    },
                  }}
                />
              )}
            </Table.Cell>
            <Table.Cell
              width={2}
              className={
                this.state.formData &&
                this.state.formData.role === 'participant'
                  ? classes.RoleInternalReader
                  : ''
              }>
              <ReSelect
                selectProps={{
                  options: this.props.roles,
                  isDisabled: false,
                  placeholder: 'Select',
                  value: this.state.role,
                  onChange: val => this.onRowDropdownChange('role', val),
                }}
              />
              <HelperIcon
                content="!"
                className={classes.RoleTooltip}
                helperText="Internal Readers are Readers who don't have their own account. Only use this type if only you (the organizer) are making entries for these users."
              />
            </Table.Cell>
            <Table.Cell width={3}>
              <ReSelect
                selectProps={{
                  options: this.props.programs,
                  isDisabled: false,
                  placeholder: 'Select',
                  value: this.state.program,
                  error: this.state.programRequired,
                  onChange: val => this.onRowDropdownChange('program', val),
                }}
              />
            </Table.Cell>
            <Table.Cell width={3}>
              <ReSelect
                selectProps={{
                  options: this.state.groups,
                  isDisabled: false,
                  placeholder: 'Select',
                  value: this.state.group,
                  onChange: val => this.onRowDropdownChange('group', val),
                }}
              />
            </Table.Cell>
            <Table.Cell textAlign="center" width={2}>
              <Dropdown
                icon={
                  this.state.currentRowAction === user.id ? (
                    <UnionGreenSvg />
                  ) : (
                    <UnionSvg />
                  )
                }
                onClick={() => this.setState({ currentRowAction: user.id })}
                onClose={() => this.setState({ currentRowAction: null })}>
                <Dropdown.Menu className={classes.moreOptionDropdown}>
                  <Dropdown.Item
                    className={classes.actionOption}
                    text="More Options"
                    icon={<CursorSvg height={20} />}
                    onClick={() => this.setState({ currentRowEdit: user.id })}
                  />
                  <Dropdown.Item
                    className={classes.actionOption}
                    text="Delete"
                    icon={<DeleteIcon width={19} height={20} />}
                    onClick={() => onDelete(user.id)}
                  />
                </Dropdown.Menu>
              </Dropdown>
            </Table.Cell>
          </>
        ) : (
          // {/* row for form edit */}
          <Table.Cell colSpan={6} width={16}>
            <Formik
              initialValues={{ ...this.state.formData }}
              enableReinitialize
              onSubmit={this.onSubmit}
              validationSchema={Yup.object().shape({
                first_name: Yup.string().required('First name is Required'),
                last_name: Yup.string().required('Last name is Required'),
                role: Yup.string().nullable(),
                email: Yup.string().when('role', role => {
                  return role === 'participant'
                    ? Yup.string().nullable()
                    : Yup.string()
                        .email()
                        .required('Email is Required');
                }),
                program: Yup.string().required('Program is Required'),
                group: Yup.string().nullable(),
              })}>
              {({
                values,
                errors,
                handleChange,
                handleBlur,
                handleSubmit,
                setFieldValue,
              }) => (
                <>
                  <InviteUserForm
                    errors={errors}
                    handleBlur={handleBlur}
                    handleChange={handleChange}
                    setFieldValue={setFieldValue}
                    values={values}
                    roles={this.props.roles}
                    programs={this.props.programs}
                    groups={this.state.groups}
                    onDropdownChange={this.onDropdownChange}
                    onCheckChange={this.onChange}
                    checked={this.state.checked}
                  />
                  <Grid>
                    <GridColumn width={14}>
                      <div className={classes.bottomBarButtons}>
                        <div className={classes.saveButton}>
                          <Button
                            buttonProps={{
                              type: 'submit',
                              disabled: isEqual(user, values),
                              onClick: () => handleSubmit(),
                            }}
                            colorVariant={ButtonColor.PRIMARY}
                            buttonType={ButtonType.ROUND}
                            icon={<SaveSvg height={16} />}>
                            <Heading
                              headingProps={{ as: 'h4' }}
                              colorVariant={HeadingColor.WHITE}
                              type={HeadingType.NORMAL}>
                              Save
                            </Heading>
                          </Button>
                          <Button
                            buttonProps={{
                              onClick: () =>
                                this.setState({ currentRowEdit: null }),
                            }}
                            colorVariant={ButtonColor.DANGER}
                            icon={<CancelSvg height={16} />}
                            buttonType={ButtonType.ROUND}>
                            <Heading
                              headingProps={{ as: 'h4' }}
                              colorVariant={HeadingColor.WHITE}
                              type={HeadingType.NORMAL}>
                              Cancel
                            </Heading>
                          </Button>
                        </div>
                      </div>
                    </GridColumn>
                    <GridColumn width={2} />
                  </Grid>
                </>
              )}
            </Formik>
          </Table.Cell>
        )}
      </Table.Row>
    );
  }
}

export default InvitesRow;
