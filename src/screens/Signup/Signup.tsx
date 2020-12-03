import * as React from 'react';
import cx from 'classnames';
import { Redirect } from 'react-router-dom';
import WizardSteps from 'src/components/WizardSteps';
import ZoneType, { Role } from 'src/screens/Signup/Steps/ZoneType';
import omit from 'lodash/omit';
import CreateAccount from 'src/screens/Signup/Steps/CreateAccount';
// import AboutOrganization from 'src/screens/Signup/Steps/AboutOrganization';
import LoginHeader from 'src/components/LoginHeader';
import { Container } from 'semantic-ui-react';
import * as H from 'history';
import * as queryString from 'query-string';
import get from 'lodash/get';
import find from 'lodash/find';
import Spinner from 'src/components/Spinner';
import urls from 'src/helpers/urls';

export type SignupProps = IScreenProps & {
  jumpToNextStep?: Function; // coming from WizardStep component
  jumpToPreviousStep?: Function; // coming from WizardStep component
  role: Role;
  setRole: Function;
  accountData: any;
  setAccountData: Function;
  doRegister: Function;
  registerInProgress: boolean;
  organizerData: any;
  setOrganizerData: Function;
  history: H.History;
  registerStatus?: string;
  resetRegister: Function;
  checkSignuptoken: Function;
  signupUserLoading: boolean;
  signupUser: any;
  profileId?: string;
  isLoggedIn?: boolean;
};

class Signup extends React.Component<SignupProps> {
  onSubmit = () => {
    const {
      role,
      accountData,
      organizerData,
      history,
      doRegister,
    } = this.props;
    const params = queryString.parse(history.location.search);
    const preSelectedPlanId = get(params, 'pre_selected_planid') || '';
    const token = get(params, 'token');
    let numberOfReaders = get(organizerData, 'numberOfReaders', '');
    const registeredEmail = get(params, 'email', '');
    if (preSelectedPlanId) {
      const planIdObj = preSelectedPlanId.split('_');
      if (planIdObj[1] === 'pp') {
        numberOfReaders = parseInt(planIdObj[2], 10);
      } else {
        numberOfReaders = parseInt(planIdObj[1], 10);
      }
    }
    const orgData = omit(organizerData, ['numberOfReaders']);
    const bodyRequest = {
      ...accountData,
      role,
      token,
      organization: orgData,
    };
    if (registeredEmail !== get(accountData, 'email', '')) {
      bodyRequest.invitation_email = registeredEmail;
    }
    doRegister(bodyRequest, preSelectedPlanId, numberOfReaders);
  };

  componentDidMount() {
    const { history, setRole } = this.props;
    const params = queryString.parse(history.location.search);
    const preSelectedPlanId = get(params, 'pre_selected_planid');
    if (preSelectedPlanId) {
      setRole(Role.ORGANIZER);
    }
  }

  componentDidUpdate(prevProps: SignupProps) {
    const {
      signupUser,
      signupUserLoading,
      setRole,
      setAccountData,
    } = this.props;
    if (
      !signupUserLoading &&
      prevProps.signupUserLoading !== signupUserLoading
    ) {
      const attr = get(signupUser, 'data.attributes', {});
      const included = get(signupUser, 'included', []);
      const role = find(included, { type: 'role' }) || {};
      const accountData = {
        firstName: attr.first_name,
        lastName: attr.last_name,
        email: attr.email,
        password: '',
        confirmPassword: '',
        terms: true,
      };
      setRole(role.id);
      setAccountData(accountData);
    }
  }

  render() {
    const {
      classes,
      history,
      role,
      setRole,
      setAccountData,
      registerInProgress,
      setOrganizerData,
      signupUserLoading,
      isLoggedIn,
      profileId,
    } = this.props;

    if (isLoggedIn && profileId) {
      return <Redirect to={urls.PROGRAMS()} />;
    }

    let steps = [
      {
        title: (
          <h2 className={classes.center}>
            What type of Reader Zone <br /> Account do you need?{' '}
          </h2>
        ),
        component: (
          <ZoneType
            onNext={(selectedRole: Role) => {
              setRole(selectedRole);
            }}
            history={history}
          />
        ),
      },
      {
        title: <h2 className={classes.center}>Create Your Account</h2>,
        component: (
          <CreateAccount
            registerInProgress={registerInProgress}
            onNext={data => {
              setAccountData(data);
              if (role !== Role.ORGANIZER) {
                setOrganizerData(null);
                this.onSubmit();
              }
            }}
            accountData={this.props.accountData}
            history={history}
          />
        ),
      },
    ];
    if (typeof role === 'undefined' || role === null) {
      steps = [...steps, { title: null, component: null }];
    }
    // if role is organizer , add 3rd step
    if (role === Role.ORGANIZER) {
      window.location.href = urls.PRICING_PAGE;
      return '';
      // steps = [
      //   ...steps,
      //   {
      //     title: (
      //       <h2 className={classes.center}>Tell us about your Organization </h2>
      //     ),
      //     component: (
      //       <AboutOrganization
      //         registerInProgress={registerInProgress}
      //         onNext={data => {
      //           setOrganizerData(data);
      //           this.onSubmit();
      //         }}
      //         onPrev={data => {
      //           setOrganizerData(data);
      //         }}
      //         organizerData={this.props.organizerData}
      //         history={history}
      //       />
      //     ),
      //   },
      // ];
    }

    return (
      <div className={classes.loginPage}>
        {signupUserLoading && (
          <div className={classes.pageLoading}>
            <Spinner />
          </div>
        )}
        <LoginHeader history={history} />
        <div className={cx(classes.signupFlow, classes.stepOne)}>
          <Container fluid>
            <section>
              <div className={cx(classes.zoneTypeWrap, classes.formPanel)}>
                <div className={classes.zoneType}>
                  <WizardSteps
                    steps={steps}
                    checkValidToken={this.props.checkSignuptoken}
                  />
                </div>
              </div>
            </section>
          </Container>
        </div>
      </div>
    );
  }
}

export default Signup;
