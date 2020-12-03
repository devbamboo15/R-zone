import * as React from 'react';
import { ToastContainer } from 'react-toastify';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import isEmpty from 'lodash/isEmpty';
import { Router, Switch, Redirect } from 'react-router-dom';
import Layout, { EmptyLayout, DrawerLayout } from 'src/components/Layout';
import ConfirmationModal, {
  confirmModal,
} from 'src/components/Modal/ConfirmationModal';
import { fetchMeData, doLogout } from 'src/store/actions/auth';
import URL from 'src/helpers/urls';
import history from 'src/helpers/history';
import SandboxLogin from 'src/screens/SandboxLogin';
import Login from 'src/screens/Login';
import Signup from 'src/screens/Signup';
import SignupConfirmation from 'src/screens/Signup/Confirmation';
import OneLastThing from 'src/screens/Signup/OneLastThing';
import Thanks from 'src/screens/Thanks';
import Setup from 'src/screens/Setup';
import Share from 'src/screens/Share';
import MyAccount from 'src/screens/MyAccount';
import ReaderAccount from 'src/screens/ReaderAccount';
import AddAuthorizedUsers from 'src/screens/MyAccount/AuthorizedUsers/Add';
import EditAuthorizedUsers from 'src/screens/MyAccount/AuthorizedUsers/Edit';
import Programs from 'src/screens/Programs';
import Groups from 'src/screens/Programs/Groups';
import Readers from 'src/screens/Programs/Readers';
import Reports from 'src/screens/Reports';
import ReaderDetail from 'src/screens/Programs/ReaderDetail';
import InviteReaders from 'src/screens/InviteReaders';
import ManageReaders from 'src/screens/ManageReaders';
import { IReduxState } from 'src/store/reducers';
import ForgetPassword from 'src/screens/ForgetPassword';
import ResetPassword from 'src/screens/ResetPassword';
import ProgressBadges from 'src/screens/ProgressBadges';
import idx from 'idx';
import { IUserData } from 'src/store/types/common';
import LoadingGif from 'src/assets/images/loading.gif';
import { getSandboxLogin } from 'src/helpers/sessionStorage';
import { Role } from 'src/screens/Signup/Steps/ZoneType';

type Props = IComponentProps & {
  isLoggedIn: boolean;
  fetchMeData: Function;
  profile: IUserData;
  isAllDataAvailable: boolean;
  isSandboxLogin: boolean;
  loginToken: string;
  doLogout: Function;
  profileRole: string[];
};

class Screens extends React.Component<Props> {
  state = {
    isMeDataLoading: true,
  };

  componentDidMount() {
    localStorage.removeItem('notRedirect');
    const { isSandboxLogin, loginToken } = this.props;
    if (this.props.isLoggedIn) {
      this.setState({ isMeDataLoading: true });
      this.props.fetchMeData(() => {
        this.setState({ isMeDataLoading: false });
      });
    } else {
      this.setState({ isMeDataLoading: false });
    }
    if (isSandboxLogin) {
      // if user is logged in as sandbox last time
      // Here we will check if user has opened new tab after logged in as sandbox
      // as we are storing data in redux it will store to localstorage but if user open new tab then we should now allow him to access sandbox data
      // sandbox data is only valid for one tab/session
      // so we will check redux login token with session login token
      const sandboxLoginToken = getSandboxLogin();
      if (!sandboxLoginToken || sandboxLoginToken !== loginToken) {
        // if session token is not set or session token is not matching with login token then logout user
        this.props.doLogout();
      }
    }
  }

  renderPrivateRoutes() {
    const { isAllDataAvailable } = this.props;
    let { profileRole } = this.props;
    if (!isAllDataAvailable) {
      // if not logged in, then redirect to login
      return <Redirect to={URL.LOGIN()} />;
    }
    if (!profileRole) profileRole = [];
    const isOrganizer = profileRole.includes(Role.ORGANIZER);
    return (
      <Switch>
        <Layout
          path={URL.MYACCOUNT()}
          component={isOrganizer ? MyAccount : ReaderAccount}
          layout={DrawerLayout}
          exact
        />
        <Layout
          path={URL.MYACCOUNT_TAB()}
          component={MyAccount}
          layout={DrawerLayout}
        />
        <Layout
          path={URL.SHARE()}
          component={Share}
          layout={DrawerLayout}
          exact
        />
        <Layout
          path={URL.SHARE_TAB()}
          component={Share}
          layout={DrawerLayout}
        />
        <Layout
          path={URL.PROGRESS_BADGES()}
          component={ProgressBadges}
          layout={DrawerLayout}
          exact
        />
        <Layout
          path={URL.PROGRESS_BADGES_TAB()}
          component={ProgressBadges}
          layout={DrawerLayout}
        />
        <Layout
          path={URL.ADD_AUTHORIZED_USER()}
          component={AddAuthorizedUsers}
          layout={DrawerLayout}
        />
        <Layout
          path={URL.EDIT_AUTHORIZED_USER()}
          component={EditAuthorizedUsers}
          layout={DrawerLayout}
        />

        <Layout
          path={URL.READER_DETAIL()}
          component={ReaderDetail}
          layout={DrawerLayout}
          exact
        />
        {/* Keep readers above groups */}
        <Layout
          path={URL.READERS()}
          component={Readers}
          layout={DrawerLayout}
        />
        {/* Keep groups above programs */}
        <Layout path={URL.GROUPS()} component={Groups} layout={DrawerLayout} />
        <Layout
          path={URL.PROGRAMS()}
          component={Programs}
          layout={DrawerLayout}
        />
        <Layout
          path={URL.MANAGE_READERS()}
          component={ManageReaders}
          layout={DrawerLayout}
          exact
        />
        <Layout
          path={URL.INVITE_READERS()}
          component={InviteReaders}
          layout={DrawerLayout}
          exact
        />
        <Layout
          path={URL.INVITE_READERS_TAB()}
          component={InviteReaders}
          layout={DrawerLayout}
        />
        <Layout
          path={URL.REPORTS()}
          component={Reports}
          layout={DrawerLayout}
        />
        <Layout path={URL.SETUP()} component={Setup} layout={EmptyLayout} />
      </Switch>
    );
  }

  render() {
    const { isAllDataAvailable, isLoggedIn } = this.props;
    let { profileRole } = this.props;
    const { isMeDataLoading } = this.state;
    if (isLoggedIn && isMeDataLoading) {
      return (
        <div id="main_first_loading_container">
          <img
            src={LoadingGif}
            style={{ width: 100, height: 100 }}
            alt="Loading..."
          />
        </div>
      );
    }
    if (!profileRole) profileRole = [];
    let redirectUrl = URL.HOME();
    if (
      profileRole.includes(Role.READER) ||
      profileRole.includes(Role.PARENT)
    ) {
      redirectUrl = URL.SETUP({ role: profileRole[0] });
    } else {
      redirectUrl = URL.PROGRAMS();
    }

    return (
      <>
        <Router history={history}>
          <Switch>
            <Layout
              path={URL.HOME()}
              render={props =>
                !isAllDataAvailable ? (
                  <Login {...props} />
                ) : (
                  <Redirect to={redirectUrl} />
                )
              }
              layout={!isAllDataAvailable ? EmptyLayout : DrawerLayout}
              exact
            />
            <Layout
              path={URL.SANDBOX_LOGIN()}
              component={SandboxLogin}
              layout={EmptyLayout}
            />
            <Layout path={URL.LOGIN()} component={Login} layout={EmptyLayout} />
            <Layout
              path={URL.SIGNUP()}
              component={Signup}
              layout={EmptyLayout}
            />
            <Layout
              path={URL.FORGET_PASSWORD()}
              component={ForgetPassword}
              layout={EmptyLayout}
            />
            <Layout
              path={URL.RESET_PASSWORD()}
              component={ResetPassword}
              layout={EmptyLayout}
            />
            <Layout
              path={URL.THANKS()}
              component={Thanks}
              layout={EmptyLayout}
            />
            <Layout
              path={URL.ONE_LAST_THING()}
              component={OneLastThing}
              layout={EmptyLayout}
            />
            <Layout
              path={URL.SIGNUP_CONFIRMATION()}
              component={SignupConfirmation}
              layout={EmptyLayout}
            />
            {/* this should render after login */}
            {this.renderPrivateRoutes()}
          </Switch>
        </Router>
        <ToastContainer
          position="bottom-center"
          closeButton={false}
          hideProgressBar
          autoClose={3000}
        />
        <ConfirmationModal ref={confirmModal.setRef} />
      </>
    );
  }
}

export default compose(
  connect(
    (state: IReduxState) => {
      const isLoggedIn = !!idx(state, x => x.auth.login.access_token);
      const profile = idx(state, x => x.auth.profile.data);
      const notRedirect = localStorage.getItem('notRedirect');
      const isAllDataAvailable =
        (isLoggedIn && !isEmpty(profile)) || notRedirect === 'true';
      return {
        isLoggedIn,
        profile,
        isAllDataAvailable,
        loginToken: idx(state, x => x.auth.login.access_token),
        isSandboxLogin: idx(state, x => x.auth.login.isSandboxLogin),
        profileRole: idx(state, x =>
          x.auth.profile.data.relationships.roles.data.map(item => item.id)
        ),
      };
    },
    {
      fetchMeData,
      doLogout,
    }
  )
)(Screens);
