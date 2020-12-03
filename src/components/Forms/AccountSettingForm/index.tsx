import * as React from 'react';
import themr from 'src/helpers/themr';
import Checkbox from 'src/components/FormFields/Checkbox';
import Button, { ButtonColor, ButtonType } from 'src/components/Button';
import Input from 'src/components/FormFields/Input';
import { Grid, InputProps, Segment } from 'semantic-ui-react';
import styles from './styles.scss';

interface SettingForm {
  first_name?: string;
  last_name?: string;
  email?: string;
  password?: string;
  password_confirmation?: string;
  confirm_password?: string;
  notify_if_changes?: boolean;
  notify_if_milestones?: boolean;
  notify_if_inactive?: boolean;
}
export type AccountSettingFormProps = IComponentProps & {
  handleChange: (
    event: React.ChangeEvent<HTMLInputElement>,
    data: InputProps
  ) => void;
  handleBlur?: (
    event: React.ChangeEvent<HTMLInputElement>,
    data: InputProps
  ) => void;
  values: SettingForm;
  errors: any;
  isPasswordChange: boolean;
  togglePasswordFields: Function;
  touched: any;
  setFieldValue: Function;
};

const AccountSettingForm = (props: AccountSettingFormProps) => {
  const {
    classes,
    handleChange,
    handleBlur,
    values,
    errors,
    isPasswordChange,
    togglePasswordFields,
    touched,
    setFieldValue,
  } = props;
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
        />
      </Grid>
      <Grid columns={4}>
        <Input
          inputProps={{
            placeholder: 'Email Address',
            onChange: handleChange,
            onBlur: handleBlur,
            value: values.email,
            type: 'email',
            name: 'email',
          }}
          label="Email Address"
        />
      </Grid>
      <Grid columns={4}>
        <Input
          inputProps={{
            placeholder: 'Old Password',
            onChange: handleChange,
            onBlur: handleBlur,
            value: values.password,
            type: 'password',
            name: 'password',
          }}
          label="Old Password"
        />
        <Grid.Column
          verticalAlign="middle"
          width={10}
          className={classes.error}>
          {touched.password && (errors.password as string)}
        </Grid.Column>
      </Grid>
      {isPasswordChange && (
        <>
          <Grid columns={4}>
            <Input
              inputProps={{
                placeholder: 'New Password',
                onChange: handleChange,
                onBlur: handleBlur,
                value: values.password_confirmation,
                type: 'password',
                name: 'password_confirmation',
              }}
              label="New Password"
            />
            <Grid.Column
              verticalAlign="middle"
              width={10}
              className={classes.error}>
              {touched.password_confirmation &&
                (errors.password_confirmation as string)}
            </Grid.Column>
          </Grid>
          <Grid columns={4}>
            <Input
              inputProps={{
                placeholder: 'Confirm New Password',
                onChange: handleChange,
                onBlur: handleBlur,
                value: values.confirm_password,
                type: 'password',
                name: 'confirm_password',
              }}
              label="Confirm New Password"
            />
            <Grid.Column
              verticalAlign="middle"
              width={10}
              className={classes.error}>
              {touched.confirm_password && (errors.confirm_password as string)}
            </Grid.Column>
          </Grid>
        </>
      )}
      {!isPasswordChange && (
        <Grid columns={4}>
          <Grid.Column>
            <Button
              buttonType={ButtonType.ROUND}
              buttonProps={{
                fluid: true,
                onClick: () => togglePasswordFields(),
              }}
              colorVariant={ButtonColor.MAIN}>
              Change Password
            </Button>
          </Grid.Column>
        </Grid>
      )}

      <div className={classes.bottom_form}>
        <Grid as={Segment} className={classes.bottomSegment}>
          <Grid.Row className={classes.checkbox_form}>
            <Checkbox
              checkboxProps={{
                checked: values.notify_if_changes,
                toggle: true,
                onChange: (_, { checked }) => {
                  setFieldValue('notify_if_changes', checked);
                },
              }}>
              Send me emails on Reader Zone special offers
            </Checkbox>
          </Grid.Row>
          <Grid.Row className={classes.checkbox_form}>
            <Checkbox
              checkboxProps={{
                checked: values.notify_if_milestones,
                toggle: true,
                onChange: (_, { checked }) => {
                  setFieldValue('notify_if_milestones', checked);
                },
              }}>
              Send me emails on Reader Zone app updates
            </Checkbox>
          </Grid.Row>
          <Grid.Row className={classes.checkbox_form}>
            <Checkbox
              checkboxProps={{
                checked: values.notify_if_inactive,
                toggle: true,
                onChange: (_, { checked }) => {
                  setFieldValue('notify_if_inactive', checked);
                },
              }}>
              Send me emails for activity in my Organization (Recommended)
            </Checkbox>
          </Grid.Row>
        </Grid>
      </div>
    </>
  );
};

export default themr<AccountSettingFormProps>('AccountSettingForm', styles)(
  AccountSettingForm
);
