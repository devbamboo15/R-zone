import * as React from 'react';
import { TableRow, TableCell, Message } from 'semantic-ui-react';
import FacebookLogin from 'react-facebook-login/dist/facebook-login-render-props';
import InstagramLogin from 'react-instagram-login';
import * as H from 'history';

import Table from 'src/components/Table';
import Button, { ButtonColor, ButtonType } from 'src/components/Button';
import Heading, { HeadingColor, HeadingType } from 'src/components/Heading';
import Spinner from 'src/components/Spinner';
import Const from 'src/helpers/const';
import FacebookImg from 'assets/images/facebook.png';
// import TwitterImg from 'assets/images/twitter.png';
// import InstaImg from 'assets/images/instagram.png';
// import SnapImg from 'assets/images/snapchat.png';
import get from 'lodash/get';
import * as queryString from 'query-string';
import { Link } from 'react-router-dom';

declare global {
  interface Window {
    snapKitInit: any;
    snap: any;
  }
}

window.snapKitInit = window.snapKitInit || {};
window.snap = window.snap || {};

export type SocialMediaProps = IComponentProps & {
  profile: any;
  isSaving: boolean;
  doUpdateAccount: Function;
  userSocial: any;
  getUserSocialDetail: Function;
  history: H.History;
};

interface SocialMediaState {
  isSuccess: boolean;
  loading: boolean;
}
class SocialMedia extends React.Component<SocialMediaProps, SocialMediaState> {
  state = {
    isSuccess: false,
    loading: false,
  };

  componentDidMount = () => {
    const params = queryString.parse(this.props.history.location.search);
    const token = get(params, 'token');
    const tokenSecret = get(params, 'tokenSecret');
    const provider = get(params, 'provider');

    if (token && tokenSecret && provider) {
      this.props.getUserSocialDetail(token, tokenSecret, provider);
      this.setState({ isSuccess: true });
    }

    // Load the SDK asynchronously
    // setTimeout(() => {
    //   this.mountSnapChat();
    // }, 2000);
    // (function(d, s, id) {
    //   const sjs = d.getElementsByTagName(s)[0];
    //   if (d.getElementById(id)) return;
    //   const js: any = d.createElement(s);
    //   js.id = id;
    //   js.src = 'https://sdk.snapkit.com/js/v1/login.js';
    //   sjs.parentNode.insertBefore(js, sjs);
    // })(document, 'script', 'loginkit-sdk');
  };

  mountSnapChat = () => {
    const { doUpdateAccount } = this.props;
    const loginButtonIconId = 'reader-snapchat-login';
    // Mount Login Button
    window.snap.loginkit.mountButton(loginButtonIconId, {
      clientId: Const.SNAPCHAT_CLIENT_ID,
      redirectURI: Const.SOCIAL_REDIRECT_URL,
      scopeList: ['user.display_name', 'user.bitmoji.avatar'],
      handleResponseCallback: () => {
        window.snap.loginkit.fetchUserInfo().then(({ data }) => {
          doUpdateAccount({ snapchat: JSON.stringify(data) });
          this.setState({ isSuccess: true });
        });
      },
    });
    const selecter = document.getElementsByName('snap-connect-login-button')[0]
      .childNodes[0] as HTMLDivElement;
    selecter.innerText = 'Connect';
    this.setState({ loading: false });
  };

  renderSocialButton = item => {
    const { doUpdateAccount } = this.props;
    if (item.status) {
      return (
        <Button
          buttonType={ButtonType.ROUND}
          colorVariant={ButtonColor.DANGER_FADE}
          buttonProps={{
            size: 'tiny',
            onClick: () => {
              doUpdateAccount({ [item.network]: null });
              // this.setState({ loading: true });
              // setTimeout(() => {
              //   if (item.network === 'snapchat') {
              //     this.mountSnapChat();
              //   }
              // }, 2000);
            },
          }}>
          Deactivate
        </Button>
      );
    }

    switch (item.network) {
      case 'facebook':
        return (
          <FacebookLogin
            appId={Const.FACEBOOK_APP_ID}
            callback={facebook => {
              const fbName = get(facebook, 'name');
              if (fbName) {
                doUpdateAccount({ facebook: JSON.stringify(facebook) });
                this.setState({ isSuccess: true });
              }
            }}
            render={renderProps => (
              <Button
                buttonType={ButtonType.ROUND}
                colorVariant={ButtonColor.SUCCESS_FADE}
                buttonProps={{ size: 'tiny', onClick: renderProps.onClick }}>
                Connect
              </Button>
            )}
          />
        );
      case 'instagram':
        return (
          <InstagramLogin
            primary
            clientId={Const.INSTAGRAM_CLIENT_ID}
            onSuccess={res => {
              doUpdateAccount({ instagram: res });
              this.setState({ isSuccess: true });
            }}
            onFailure={() => {}}
            cssClass="ui tiny primary button roundBtn success_fade">
            Connect
          </InstagramLogin>
        );
      case 'snapchat':
        return <div id="reader-snapchat-login" />;
      default:
        // Twitter
        return (
          <Button
            buttonType={ButtonType.ROUND}
            buttonProps={{
              size: 'tiny',
              onClick: () => {
                window.location.href = `${
                  process.env.API_BASE_URL
                }/login/twitter`;
              },
            }}
            colorVariant={ButtonColor.SUCCESS_FADE}>
            Connect
          </Button>
        );
    }
  };

  render() {
    const { classes, profile, userSocial } = this.props;
    const { isSuccess, loading } = this.state;
    const data = [
      {
        id: 0,
        network: 'facebook',
        status: profile.facebook,
        detail: profile.facebook && `FB: ${JSON.parse(profile.facebook).name}`,
        image: FacebookImg,
      },
      // {
      //   id: 1,
      //   network: 'twitter',
      //   status: profile.twitter,
      //   detail:
      //     profile.twitter &&
      //     `https://twitter.com/${JSON.parse(profile.twitter).nickname}`,
      //   image: TwitterImg,
      // },
      // {
      //   id: 2,
      //   network: 'instagram',
      //   status: profile.instagram,
      //   detail: '',
      //   image: InstaImg,
      // },
      // {
      //   id: 3,
      //   network: 'snapchat',
      //   status: profile.snapchat,
      //   detail: '',
      //   image: SnapImg,
      // },
    ];

    return (
      <div>
        <Table fields={['Network', 'Status', 'Detail', 'Actions']}>
          {data.map((item: any) => (
            <TableRow className={classes.table_row} key={item.id}>
              <TableCell>
                <div className={classes.tableCell}>
                  <img
                    src={item.image}
                    alt={item.network}
                    className={classes.socialImg}
                  />
                  <Heading
                    headingProps={{ as: 'h3' }}
                    type={HeadingType.NORMAL}>
                    {item.network}
                  </Heading>
                </div>
              </TableCell>
              <TableCell>
                {item.status ? (
                  <Heading
                    headingProps={{ as: 'h4' }}
                    type={HeadingType.NORMAL}
                    colorVariant={HeadingColor.PRIMARY}>
                    Connected
                  </Heading>
                ) : (
                  <Heading
                    headingProps={{ as: 'h4' }}
                    type={HeadingType.NORMAL}
                    colorVariant={HeadingColor.FAID}>
                    Not-Connected
                  </Heading>
                )}
              </TableCell>
              <TableCell>
                <Heading
                  headingProps={{ as: 'h4' }}
                  type={HeadingType.NORMAL}
                  colorVariant={HeadingColor.GRAY}>
                  {item.detail}
                </Heading>
              </TableCell>
              <TableCell>{this.renderSocialButton(item)}</TableCell>
            </TableRow>
          ))}
        </Table>
        {(loading || userSocial.inProgress) && <Spinner />}
        {isSuccess && (
          <Message color="green" size="mini">
            You've successfully connected a social media account! Now you can
            promote your Program on any of the above channels. Go to
            <Link className={classes.linkText} to="/share">
              &nbsp;Promote
            </Link>{' '}
            to see how!"
          </Message>
        )}

        {/* <div className={classes.bottomBar}>
          <Button colorVariant={ButtonColor.PRIMARY}>Save</Button>
        </div> */}
      </div>
    );
  }
}

export default SocialMedia;
