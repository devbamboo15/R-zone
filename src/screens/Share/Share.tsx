import * as React from 'react';
import { Tab, Menu } from 'semantic-ui-react';
import { RouteComponentProps } from 'react-router-dom';
import URL from 'src/helpers/urls';
import cn from 'classnames';
import AccountIcon from 'assets/icons/account_icon.svg';
// import TwitterSvg from 'assets/icons/twitter.svg';
import FacebookSvg from 'assets/icons/facebook.svg';
// import SnapchatSvg from 'assets/icons/snapchat.svg';
// import InstagramSvg from 'assets/icons/instagram.svg';
import SettingsIcon from 'assets/images/share/settings.png';
import DocsIcon from 'assets/images/share/docs.png';
import MedalSvg from 'assets/icons/medal_red.svg';
import Title from 'src/components/Title';
import ShareFooter, {
  ShareFooterType,
} from 'src/screens/Share/ShareFooter/ShareFooter';
import Spinner from 'src/components/Spinner';
import get from 'lodash/get';
import NoOrganizationModal from 'src/components/Modal/NoOrganizationModal';
import Facebook from './Facebook';
// import Twitter from './Twitter';
// import Instagram from './Instagram';
// import Snapchat from './Snapchat';
import HtmlBadges from './HtmlBadges';
import CustomizeBadge from './CustomizeBadge';
import PrintableFlyers from './PrintableFlyers';

export type ShareProps = IComponentProps &
  RouteComponentProps<{ tab?: string }> & {
    getAllPrograms: Function;
    getShares: Function;
    updateShare: Function;
    share?: any;
    auth?: any;
    programs?: any;
    organizationId: any;
  };

interface ShareState {
  activeIndex: number;
}

class Share extends React.Component<ShareProps, ShareState> {
  constructor(props) {
    super(props);
    const {
      match: {
        params: { tab },
      },
    } = props;
    this.state = {
      activeIndex: this.getIndex(tab),
    };
  }

  componentDidMount() {
    this.props.getAllPrograms();
    this.props.getShares();
  }

  componentDidUpdate(props) {
    const {
      match: { params },
    } = props;
    const { match } = this.props;
    const { tab } = params;

    if (match.params.tab !== tab) {
      this.setState(() => ({
        activeIndex: this.getIndex(match.params.tab),
      }));
    }
  }

  getIndex = type => {
    switch (type) {
      case 'facebook':
        return 0;
      // case 'twitter':
      //   return 1;
      // case 'instagram':
      //   return 2;
      // case 'snapchat':
      //   return 3;
      case 'htmlbadges':
        return 1;
      case 'customizebadge':
        return 2;
      case 'printableflyers':
        return 3;
      default:
        return 0;
    }
  };

  openShareDialog = type => {
    const { share, programs } = this.props;

    let program = null;
    const userShare = get(share, 'data[0]attributes');
    if (!userShare) {
      program = get(programs, '[0]');
    } else {
      program = programs.find(item => item.id * 1 === userShare.program_id);
    }

    if (!program) return false;

    const url = `${process.env.API_BASE_URL}/user/share/${this.props.auth.id}/${
      program.id
    }`;

    let shareLink = '';
    if (type === 'facebook') {
      shareLink = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
    } else if (type === 'twitter') {
      shareLink = `https://twitter.com/home?status=${url}`;
    }

    window.open(
      shareLink,
      '',
      `height=450, width=550, top=${window.innerHeight / 2 -
        275}, left=${window.innerWidth / 2 -
        225}, toolbar=0, location=0, menubar=0, directories=0, scrollbars=0`
    );

    return true;
  };

  changeTab = (event, data) => {
    switch (data.activeIndex) {
      // case 1:
      //   return this.props.history.push(URL.SHARE_TAB({ tab: 'twitter' }));
      // case 2:
      //   return this.props.history.push(URL.SHARE_TAB({ tab: 'instagram' }));
      // case 3:
      //   return this.props.history.push(URL.SHARE_TAB({ tab: 'snapchat' }));
      case 1:
        return this.props.history.push(URL.SHARE_TAB({ tab: 'htmlbadges' }));
      case 2:
        return this.props.history.push(
          URL.SHARE_TAB({ tab: 'customizebadge' })
        );
      case 3:
        return this.props.history.push(
          URL.SHARE_TAB({ tab: 'printableflyers' })
        );
      default:
        return this.props.history.push(URL.SHARE_TAB({ tab: 'facebook' }));
    }
  };

  render() {
    const { activeIndex } = this.state;
    const { classes, organizationId, share = {} } = this.props;
    const panes = [
      {
        menuItem: {
          content: 'Facebook',
          key: 'facebook',
          icon: activeIndex === 0 && (
            <FacebookSvg height={15} className={classes.tabIcon} />
          ),
        },
        render: () => (
          <Tab.Pane attached={false} className={classes.tabContent}>
            <Facebook />
            <ShareFooter
              shareType={ShareFooterType.FACEBOOK}
              onCustomizeBadgeFormSubmit={() =>
                this.openShareDialog('facebook')
              }
            />
          </Tab.Pane>
        ),
      },
      // {
      //   menuItem: {
      //     content: 'Twitter',
      //     key: 'twitter',
      //     icon: activeIndex === 1 && (
      //       <TwitterSvg height={15} className={classes.tabIcon} />
      //     ),
      //   },
      //   render: () => (
      //     <Tab.Pane attached={false} className={classes.tabContent}>
      //       <Twitter />
      //       <ShareFooter
      //         shareType={ShareFooterType.TWITTER}
      //         onCustomizeBadgeFormSubmit={() => this.openShareDialog('twitter')}
      //       />
      //     </Tab.Pane>
      //   ),
      // },
      // {
      //   menuItem: {
      //     content: 'Instagram',
      //     key: 'instagram',
      //     icon: activeIndex === 2 && (
      //       <InstagramSvg height={15} className={classes.tabIcon} />
      //     ),
      //   },
      //   render: () => (
      //     <Tab.Pane attached={false} className={classes.tabContent}>
      //       <Instagram />
      //       <ShareFooter shareType={ShareFooterType.INSTAGRAM} />
      //     </Tab.Pane>
      //   ),
      // },
      // {
      //   menuItem: {
      //     content: 'Snapchat',
      //     key: 'snapchat',
      //     icon: activeIndex === 3 && (
      //       <SnapchatSvg height={15} className={classes.tabIcon} />
      //     ),
      //   },
      //   render: () => (
      //     <Tab.Pane attached={false} className={classes.tabContent}>
      //       <Snapchat />
      //       <ShareFooter shareType={ShareFooterType.SNAPCHAT} />
      //     </Tab.Pane>
      //   ),
      // },
      {
        menuItem: {
          content: 'HTML Badges',
          key: 'html_badges',
          icon: activeIndex === 1 && (
            <MedalSvg height={15} className={classes.tabIcon} />
          ),
        },
        render: () => (
          <Tab.Pane attached={false} className={classes.tabContent}>
            <HtmlBadges />
          </Tab.Pane>
        ),
      },
      {
        menuItem: (
          <Menu.Item
            key="customize_badge"
            className={cn(classes.rightMenuItem, classes.first)}>
            <img src={SettingsIcon} alt="custom-icon" />
            Customize Badges
          </Menu.Item>
        ),
        render: () => (
          <Tab.Pane attached={false} className={cn(classes.tabCustomize)}>
            <CustomizeBadge history={this.props.history} />
          </Tab.Pane>
        ),
      },
      {
        menuItem: (
          <Menu.Item key="printable" className={classes.rightMenuItem}>
            <img src={DocsIcon} alt="printable-icon" />
            Printable Flyers
          </Menu.Item>
        ),
        render: () => (
          <Tab.Pane
            attached={false}
            className={cn(classes.tabContent, classes.tabPrintableFlyers)}>
            <PrintableFlyers />
            <ShareFooter
              shareType={ShareFooterType.FACEBOOK}
              onCustomizeBadgeFormSubmit={() => {}}
            />
          </Tab.Pane>
        ),
      },
    ];

    return (
      <div>
        {/* No Organization Infomation Modal */}
        {!organizationId && (
          <NoOrganizationModal
            modelProps={{
              open: true,
              centered: false,
              dimmer: 'inverted',
            }}
            action="Share/Promote"
          />
        )}
        <Title icon={<AccountIcon height={25} />}>Share / Promote</Title>
        <p className={classes.subTitle}>
          1. Select the type of badge you want, Facebook, Twitter or HTML.
          <br />
          2. Click "Customize Badges" to select the reading program you want to
          share and add your own copy.
          <br />
          3. Preview the badge prior to posting to make sure it's just right.
          <br />
          4. Save the badge and post it to social media and your own website.
          <br />
        </p>
        {share.loading && <Spinner />}
        <Tab
          menu={{ color: 'green', secondary: true, pointing: true }}
          panes={panes}
          className={cn(
            classes.tabContainer,
            activeIndex === 3 ? classes.noMarginBottom : ''
          )}
          onTabChange={this.changeTab}
          activeIndex={activeIndex}
        />
      </div>
    );
  }
}

export default Share;
