import * as React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import get from 'lodash/get';
import { Formik } from 'formik';
import isEqual from 'lodash/isEqual';
import { Form } from 'semantic-ui-react';
import Button, { ButtonColor, ButtonType } from 'src/components/Button';
import URL from 'src/helpers/urls';
import Heading, { HeadingColor, HeadingType } from 'src/components/Heading';
import Title from 'src/components/Title';
import AlertModal from 'src/components/Modal/AlertModal';
import { ICreateAuthUserData } from 'src/api/users';
import UserForm from 'src/components/Forms/UserForm';
import BackSvg from 'assets/icons/back.svg';
import CancelSvg from 'assets/icons/cancel.svg';
import UpdateSvg from 'assets/icons/update.svg';
import UserEditScg from 'assets/icons/edit_user.svg';
import { checkExistingAuthorizedUser } from 'src/helpers/methods';
import toast from 'src/helpers/Toast';
import * as Yup from 'yup';

export type EditAuthorizedUsersProps = IComponentProps &
  RouteComponentProps & {
    user: ICreateAuthUserData;
    users: ICreateAuthUserData[];
    updateAuthUser: Function;
    updateUserLoading: boolean;
    updateUserStatus: any;
    userAccess: any;
    owner: any;
  };
interface EditUserState {
  showAlert: boolean;
  activeIndex: number;
}

class EditAuthorizedUsers extends React.Component<
  EditAuthorizedUsersProps,
  EditUserState
> {
  form: any;

  state = {
    activeIndex: 0,
    showAlert: false,
  };

  componentDidUpdate(prevProps: EditAuthorizedUsersProps) {
    if (this.props.updateUserLoading !== prevProps.updateUserLoading) {
      if (
        prevProps.updateUserLoading === true &&
        this.props.updateUserStatus === 'success'
      ) {
        this.props.history.push(URL.MYACCOUNT_TAB({ tab: 'authorized_user' }));
      }
    }
  }

  gotoAuthorizedScreen = formIsValid => {
    const {
      history: { push },
    } = this.props;
    if (formIsValid) {
      return this.toggleAlert();
    }
    return push(URL.MYACCOUNT_TAB({ tab: 'authorized_user' }));
  };

  handleClick = (e, titleProps) => {
    const { index } = titleProps;
    const { activeIndex } = this.state;
    const newIndex = activeIndex === index ? -1 : index;

    this.setState({ activeIndex: newIndex });
  };

  toggleAlert = () => this.setState(state => ({ showAlert: !state.showAlert }));

  updateUser = values => {
    const { updateAuthUser, user, users } = this.props;
    const isOtherUser = checkExistingAuthorizedUser(users, {
      ...user,
      attributes: {
        ...(get(user, 'atttributes') || {}),
        ...values,
      },
    });
    if (isOtherUser) {
      toast.error('Email already exists');
    } else {
      updateAuthUser(user.id, values);
    }
  };

  isDirty = () => {
    if (this.form) {
      const { initialValues } = this.form;
      const stateValues = this.form.state.values;
      return !isEqual(initialValues, stateValues);
    }
    return false;
  };

  render() {
    const {
      classes,
      user,
      updateUserLoading,
      userAccess = {},
      owner,
    } = this.props;
    const { activeIndex, showAlert } = this.state;
    const initialValues = {
      first_name: get(user, 'attributes.first_name', ''),
      last_name: get(user, 'attributes.last_name', ''),
      email: get(user, 'attributes.email', ''),
      access: { ...userAccess },
    };
    return (
      <div>
        <Formik
          ref={ref => (this.form = ref)}
          initialValues={initialValues}
          onSubmit={this.updateUser}
          enableReinitialize
          validationSchema={Yup.object().shape({
            first_name: Yup.string().required('First name is required'),
            last_name: Yup.string().required('Last name is required'),
            email: Yup.string()
              .required('Email is required')
              .email('Email is invalid'),
          })}>
          {({
            values,
            handleChange,
            handleBlur,
            handleSubmit,
            setFieldValue,
            handleReset,
            touched,
            errors,
          }) => {
            const dirty = this.isDirty();
            return (
              <>
                <Button
                  buttonProps={{
                    onClick: () => this.gotoAuthorizedScreen(dirty),
                  }}
                  buttonType={ButtonType.TRANSPARENT}>
                  <div className={classes.backHeading}>
                    <BackSvg />
                    <Heading
                      colorVariant={HeadingColor.SECONDARY}
                      headingProps={{ as: 'h5' }}>
                      Back to All Authorized Users
                    </Heading>
                  </div>
                </Button>
                <Title icon={<UserEditScg height={25} />}>Edit User</Title>
                <Form onSubmit={handleSubmit}>
                  <UserForm
                    activeIndex={activeIndex}
                    handleClick={this.handleClick}
                    edit
                    handleBlur={handleBlur}
                    handleChange={handleChange}
                    values={values}
                    userAccess={userAccess}
                    setFieldValue={setFieldValue}
                    touched={touched}
                    errors={errors}
                    owner={owner}
                    user={user}
                  />
                  <div className={classes.bottomBar}>
                    {dirty && (
                      <Button
                        colorVariant={ButtonColor.DANGER}
                        icon={<CancelSvg height={16} />}
                        buttonType={ButtonType.ROUND}
                        buttonProps={{
                          onClick: () => {
                            handleReset();
                          },
                        }}>
                        <Heading
                          headingProps={{ as: 'h4' }}
                          colorVariant={HeadingColor.WHITE}
                          type={HeadingType.NORMAL}>
                          Cancel
                        </Heading>
                      </Button>
                    )}
                    <div className={classes.saveButton}>
                      <Button
                        buttonProps={{
                          disabled: !dirty,
                          type: 'submit',
                          loading: updateUserLoading,
                        }}
                        colorVariant={dirty && ButtonColor.PRIMARY}
                        buttonType={ButtonType.ROUND}
                        icon={<UpdateSvg height={16} />}>
                        <Heading
                          headingProps={{ as: 'h4' }}
                          colorVariant={HeadingColor.WHITE}
                          type={HeadingType.NORMAL}>
                          Update
                        </Heading>
                      </Button>
                    </div>
                  </div>
                </Form>
                <AlertModal
                  modelProps={{
                    open: showAlert,
                    centered: false,
                    dimmer: 'inverted',
                    onClose: this.toggleAlert,
                  }}
                  onCancel={() => {
                    this.props.history.push(
                      URL.MYACCOUNT_TAB({ tab: 'authorized_user' })
                    );
                  }}
                  onSave={() => this.updateUser(values)}
                  text="You have made some changes in other tab. Do you want to save them or Discard?"
                />
              </>
            );
          }}
        </Formik>
      </div>
    );
  }
}

export default EditAuthorizedUsers;
