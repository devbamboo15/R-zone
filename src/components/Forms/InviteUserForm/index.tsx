import * as React from 'react';
import themr from 'src/helpers/themr';
import { get } from 'lodash';
import idx from 'idx';
import Select from 'src/components/FormFields/Select';
import Checkbox from 'src/components/FormFields/Checkbox';
import Input from 'src/components/FormFields/Input';
import { Grid, Form, InputOnChangeData, GridColumn } from 'semantic-ui-react';
import { ISelection } from 'src/store/types/organizer/invite';
import HelperIcon from 'src/components/Helper/Icon';
import styles from './styles.scss';

export interface UserForm {
  id?: any;
  first_name?: string;
  last_name?: string;
  email: string;
  role?: any;
  program?: any;
  group?: any;
}

export type InviteUserFormProps = IComponentProps & {
  handleChange: (
    event: React.ChangeEvent<HTMLInputElement>,
    data: InputOnChangeData
  ) => void;
  handleBlur?: (
    event: React.ChangeEvent<HTMLInputElement>,
    data: InputOnChangeData
  ) => void;
  onCheckChange: (
    event: React.ChangeEvent<HTMLInputElement>,
    data: any
  ) => void;
  setFieldValue?: (field: string, value: any) => void;
  onDropdownChange: Function;
  values: UserForm;
  errors: any;
  roles: ISelection[];
  programs: ISelection[];
  groups: ISelection[];
  checked: boolean;
};

const prepaireDataSource = (values: any[]) => {
  return (
    idx(values, x =>
      x.map(val => ({
        text: val.label,
        value: val.value,
      }))
    ) || []
  );
};

const InviteUserForm = (props: InviteUserFormProps) => {
  const {
    classes,
    handleChange,
    handleBlur,
    setFieldValue,
    values,
    errors,
    roles,
    programs,
    groups,
  } = props;
  return (
    <Form>
      <Grid columns={4}>
        <GridColumn width={2} className={classes.center}>
          <Checkbox
            checkboxProps={{
              onChange: props.onCheckChange,
              checked: props.checked,
            }}
          />
        </GridColumn>
        <GridColumn>
          <Input
            inputProps={{
              placeholder: 'First Name',
              onChange: handleChange,
              onBlur: handleBlur,
              value: values.first_name,
              name: 'first_name',
            }}
            label="First Name"
            errorMessage={get(errors, 'first_name')}
          />
        </GridColumn>
        <GridColumn>
          <Input
            inputProps={{
              placeholder: 'Last Name',
              onChange: handleChange,
              onBlur: handleBlur,
              value: values.last_name,
              name: 'last_name',
            }}
            label="Last Name"
            errorMessage={get(errors, 'last_name')}
          />
        </GridColumn>
        <GridColumn>
          {values.role !== 'participant' ? (
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
              errorMessage={get(errors, 'email')}
            />
          ) : (
            ''
          )}
        </GridColumn>
      </Grid>
      <Grid columns={4}>
        <GridColumn width={2} className={classes.center} />
        <GridColumn
          className={
            values.role === 'participant' ? classes.RoleInternalReader : ''
          }>
          <Select
            selectProps={{
              options: prepaireDataSource(roles),
              placeholder: 'Select',
              name: 'role',
              value: values.role,
              onChange: (_, { value }) => {
                setFieldValue('role', value);
                props.onDropdownChange('role', value);
              },
            }}
            label="Role"
            errorMessage={get(errors, 'role')}
          />
          <HelperIcon
            content="!"
            className={classes.RoleTooltip}
            helperText="Internal Readers are Readers who don't have their own account. Only use this type if only you (the organizer) are making entries for these users."
          />
        </GridColumn>
        <GridColumn>
          <Select
            selectProps={{
              options: prepaireDataSource(programs),
              placeholder: 'Select',
              name: 'program',
              value: values.program,
              onChange: (_, { value }) => {
                setFieldValue('program', value);
                setFieldValue('group', '');
                props.onDropdownChange('program', value);
              },
            }}
            label="Program"
            errorMessage={get(errors, 'program')}
          />
        </GridColumn>
        <GridColumn>
          <Select
            selectProps={{
              options: prepaireDataSource(groups),
              placeholder: 'Select',
              name: 'group',
              value: values.group,
              onChange: (_, { value }) => {
                setFieldValue('group', value);
                props.onDropdownChange('group', value);
              },
            }}
            label="Group"
            errorMessage={get(errors, 'group')}
          />
        </GridColumn>
      </Grid>
    </Form>
  );
};

export default themr<InviteUserFormProps>('InviteUserForm', styles)(
  InviteUserForm
);
