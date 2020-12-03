import * as React from 'react';
import isEmpty from 'lodash/isEmpty';
import merge from 'lodash/merge';
import get from 'lodash/get';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { Grid, Form } from 'semantic-ui-react';
import Button, { ButtonColor, ButtonType } from 'src/components/Button';
import AccountSettingForm from 'src/components/Forms/AccountSettingForm';
import { confirmModal } from 'src/components/Modal/ConfirmationModal';
import Heading, { HeadingColor } from 'src/components/Heading';
import Footer from 'src/components/Footer';
import DeleleIcon from 'assets/icons/delete.svg';
import SaveIcon from 'assets/icons/save.svg';
import CancelIcon from 'assets/icons/cancel.svg';
import Spinner from 'src/components/Spinner';

export type AccountSettingsProps = IComponentProps & {
  profile: any;
  doUpdateAccount: Function;
  doCancelAccount: Function;
  isSaving: boolean;
};

interface AccountSettingsState {
  isPasswordChange: boolean;
}

class AccountSettings extends React.Component<
  AccountSettingsProps,
  AccountSettingsState
> {
  state = {
    isPasswordChange: false,
  };

  updateProfile = values => {
    const { isPasswordChange } = this.state;
    let updateAttr = {
      firstName: values.first_name,
      lastName: values.last_name,
      email: values.email,
      notificationPreferences: {
        notify_if_changes: values.notify_if_changes,
        notify_if_milestones: values.notify_if_milestones,
        notify_if_inactive: values.notify_if_inactive,
      },
    };
    if (isPasswordChange) {
      updateAttr = merge(updateAttr, {
        oldPassword: values.password,
        newPassword: values.confirm_password,
        confirmPassword: values.password_confirmation,
      });
    }
    this.props.doUpdateAccount(updateAttr);
  };

  togglePasswordFields = () =>
    this.setState(state => ({ isPasswordChange: !state.isPasswordChange }));

  render() {
    const { classes, profile, isSaving, doCancelAccount } = this.props;
    const { isPasswordChange } = this.state;
    const validations: any = {};
    if (isPasswordChange) {
      validations.password = Yup.string().required('Password is required');
      validations.password_confirmation = Yup.string()
        .required('Password is required')
        .min(8, 'Your password must be at least 8 characters long');
      validations.confirm_password = Yup.string()
        .oneOf(
          [Yup.ref('password_confirmation'), null],
          'Confirmation password not match'
        )
        .required('Password confirm is required');
    }
    const formInitialValues = {
      ...profile,
      password: '',
      password_confirmation: '',
      confirm_password: '',
      notify_if_changes: get(
        profile,
        'notification_preferences.notify_if_changes',
        true
      ),
      notify_if_milestones: get(
        profile,
        'notification_preferences.notify_if_milestones',
        true
      ),
      notify_if_inactive: get(
        profile,
        'notification_preferences.notify_if_inactive',
        true
      ),
    };
    return (
      <div>
        {!isEmpty(profile) ? (
          <Formik
            initialValues={formInitialValues}
            enableReinitialize
            validationSchema={Yup.object().shape({
              email: Yup.string()
                .required('Email is required')
                .email('Email is invalid'),
              ...validations,
            })}
            onSubmit={this.updateProfile}>
            {({
              values,
              errors,
              handleChange,
              handleBlur,
              handleSubmit,
              touched,
              setFieldValue,
              dirty,
              isValid,
              handleReset,
              /* and other goodies */
            }) => {
              return (
                <Form onSubmit={handleSubmit}>
                  <AccountSettingForm
                    errors={errors}
                    handleBlur={handleBlur}
                    handleChange={handleChange}
                    values={values}
                    isPasswordChange={isPasswordChange}
                    togglePasswordFields={this.togglePasswordFields}
                    touched={touched}
                    setFieldValue={setFieldValue}
                  />
                  <Grid.Row className={classes.lastElement}>
                    <Button
                      buttonType={ButtonType.TRANSPARENT}
                      buttonProps={{
                        onClick: () => {
                          confirmModal.open({
                            message:
                              'This will delete your entire Organization account. You will lose all associated Programs, Groups, Readers, along with all their data. Are you absolutely sure? WARNING: This cannot be undone',
                            onOkClick: () => {
                              doCancelAccount();
                            },
                          });
                        },
                        type: 'button',
                      }}
                      icon={<DeleleIcon height={20} />}>
                      <Heading
                        headingProps={{ as: 'h5' }}
                        colorVariant={HeadingColor.FAID}>
                        Delete Account
                      </Heading>
                    </Button>
                  </Grid.Row>

                  <Footer>
                    <div className="bottomBar">
                      <div className="buttonGroupContainer">
                        <Button
                          buttonProps={{
                            disabled: !dirty && !isPasswordChange,
                            type: 'button',
                            onClick: () => {
                              handleReset();
                              this.setState({
                                isPasswordChange: false,
                              });
                            },
                          }}
                          icon={<CancelIcon height={16} />}
                          colorVariant={ButtonColor.DANGER}
                          buttonType={ButtonType.ROUND}>
                          Cancel
                        </Button>
                        <Button
                          buttonProps={{
                            disabled: !dirty || !isValid,
                            loading: isSaving,
                            type: 'submit',
                          }}
                          icon={<SaveIcon height={16} />}
                          colorVariant={dirty && isValid && ButtonColor.PRIMARY}
                          buttonType={ButtonType.ROUND}>
                          Save
                        </Button>
                      </div>
                    </div>
                  </Footer>
                </Form>
              );
            }}
          </Formik>
        ) : (
          <Spinner />
        )}
      </div>
    );
  }
}

export default AccountSettings;
