import * as React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { Popup, Form } from 'semantic-ui-react';
import Button, { ButtonColor, ButtonType } from 'src/components/Button';
import URL from 'src/helpers/urls';
import { get, filter, forEach } from 'lodash';
import Heading, { HeadingColor, HeadingType } from 'src/components/Heading';
import { ICreateAuthUserData } from 'src/api/users';
import Title from 'src/components/Title';
import AlertModal from 'src/components/Modal/AlertModal';
import UserForm from 'src/components/Forms/UserForm';
import SaveSvg from 'assets/icons/save.svg';
import UserSvg from 'assets/icons/user.svg';
import BackSvg from 'assets/icons/back.svg';
import { checkExistingAuthorizedUser } from 'src/helpers/methods';
import toast from 'src/helpers/Toast';
import CircleQuestion from 'src/assets/icons/CircleQuestion.svg';

export type AddAuthorizedUsersProps = IComponentProps &
  RouteComponentProps & {
    users: ICreateAuthUserData[];
    addAuthUser: Function;
    addUserLoading: boolean;
    addUserSuccess: boolean | null;
    userAccess: any;
  };
interface AddUserState {
  showAlert: boolean;
  activeIndex: number;
}

class AddAuthorizedUsers extends React.Component<
  AddAuthorizedUsersProps,
  AddUserState
> {
  state = {
    activeIndex: 0,
    showAlert: false,
  };

  componentDidUpdate(prevProps: AddAuthorizedUsersProps) {
    if (this.props.addUserLoading !== prevProps.addUserLoading) {
      if (
        prevProps.addUserLoading === true &&
        this.props.addUserSuccess === true
      ) {
        this.props.history.push(URL.MYACCOUNT_TAB({ tab: 'authorized_user' }));
      }
    }
  }

  handleClick = (e, titleProps) => {
    const { index } = titleProps;
    const { activeIndex } = this.state;
    const newIndex = activeIndex === index ? -1 : index;

    this.setState({ activeIndex: newIndex });
  };

  save = () => {
    const {
      history: { push },
    } = this.props;
    this.toggleAlert();
    push(URL.MYACCOUNT_TAB({ tab: 'authorized_user' }));
  };

  toggleAlert = () => this.setState(state => ({ showAlert: !state.showAlert }));

  saveUser = payload => {
    const { users } = this.props;
    const isOtherUser = checkExistingAuthorizedUser(users, {
      attributes: payload,
    });
    if (isOtherUser) {
      toast.error('Email already exists');
    } else {
      if (payload && payload.access && payload.access.group_by_program) {
        delete payload.access.group_by_program.undefined;
      }

      if (payload.access.owner === true) {
        const groupByProgram = {};
        const program = {};

        forEach(get(payload, 'access.group_by_program'), (items, programId) => {
          groupByProgram[programId] = {};
          forEach(items, (item, groupId) => {
            groupByProgram[programId][groupId] = {
              read: true,
              write: true,
            };
          });
        });

        forEach(get(payload, 'access.program'), (items, programId) => {
          program[programId] = {
            read: true,
            write: true,
          };
        });

        const ownerPayload = {
          ...payload,
          access: {
            ...payload.access,
            group_by_program: { ...groupByProgram },
            program: { ...program },
          },
        };
        this.props.addAuthUser(ownerPayload);
      } else {
        this.props.addAuthUser(payload);
      }
    }
  };

  gotoAuthorizedScreen = isValidForm => {
    const {
      history: { push },
    } = this.props;
    if (isValidForm) {
      return this.toggleAlert();
    }
    return push(URL.MYACCOUNT_TAB({ tab: 'authorized_user' }));
  };

  render() {
    const { classes, addUserLoading, userAccess } = this.props;
    const { activeIndex, showAlert } = this.state;

    const initialValues: ICreateAuthUserData = {
      first_name: '',
      last_name: '',
      email: '',
      access: userAccess,
    };
    return (
      <div>
        <Formik
          initialValues={initialValues}
          onSubmit={this.saveUser}
          validationSchema={Yup.object().shape({
            first_name: Yup.string().required('First name is Required'),
            last_name: Yup.string().required('Last name is Required'),
            email: Yup.string()
              .email('Email is invalid')
              .required('Email is Required'),
          })}>
          {({
            values,
            handleChange,
            handleBlur,
            handleSubmit,
            errors,
            touched,
            setFieldValue,
            dirty,
            isValid,
            /* and other goodies */
          }) => {
            const owner = get(values, 'access.owner', false);
            const listPermission = filter(
              values.access.program,
              item => item.read || item.write
            );
            const groupByProgram = get(values, 'access.group_by_program');
            forEach(groupByProgram, item => {
              const listGroupPermission = filter(
                item,
                itemGroup => itemGroup.read || itemGroup.write
              );
              if (listGroupPermission.length > 0) {
                listPermission.push(listGroupPermission);
              }
            });
            const permissionCheck = listPermission.length > 0 || owner;
            return (
              <>
                <Button
                  buttonProps={{
                    onClick: () => this.gotoAuthorizedScreen(dirty && isValid),
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
                <Title icon={<UserSvg height={25} />}>
                  <span>
                    Add Authorized User
                    <Popup
                      wide="very"
                      position="bottom center"
                      trigger={
                        <span className={classes.popupHelper}>
                          <CircleQuestion />
                        </span>
                      }>
                      <ul>
                        <li>
                          Account Owners can grant permission to others to
                          manage the entire account or any blend of reading
                          programs and/or reading groups.
                        </li>
                        <li>
                          Enter the name and email of a new user, select the
                          programs and/or groups to which he or she will have
                          access and click "Save".
                        </li>
                        <li>
                          The user will receive an email with a link to activate
                          the account. The user will see only the programs
                          and/or groups he or she can view or control.
                        </li>
                        <li>A user's permissions can be edited anytime.</li>
                      </ul>
                    </Popup>
                  </span>
                </Title>
                <Form onSubmit={handleSubmit}>
                  <UserForm
                    activeIndex={activeIndex}
                    handleClick={this.handleClick}
                    handleBlur={handleBlur}
                    handleChange={handleChange}
                    values={values}
                    errors={errors}
                    touched={touched}
                    setFieldValue={setFieldValue}
                  />
                  <div className={classes.bottomBar}>
                    <div className={classes.saveButton}>
                      <Button
                        buttonProps={{
                          disabled: !dirty || !isValid || !permissionCheck,
                          type: 'submit',
                          loading: addUserLoading,
                        }}
                        colorVariant={dirty && isValid && ButtonColor.PRIMARY}
                        buttonType={ButtonType.ROUND}
                        icon={<SaveSvg height={16} />}>
                        <Heading
                          headingProps={{ as: 'h4' }}
                          colorVariant={HeadingColor.WHITE}
                          type={HeadingType.NORMAL}>
                          Save
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
                  onSave={() => {
                    this.saveUser(values);
                  }}
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

export default AddAuthorizedUsers;
