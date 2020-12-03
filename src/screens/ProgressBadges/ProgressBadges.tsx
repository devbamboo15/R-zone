import * as React from 'react';
import get from 'lodash/get';
import { Tab } from 'semantic-ui-react';
import { RouteComponentProps } from 'react-router-dom';
import URL from 'src/helpers/urls';
import FacebookSvg from 'assets/icons/facebook.svg';
import ProgressBadgesHeadingSvg from 'assets/icons/progressBadgesHeading.svg';
import ShareFooter, {
  ShareFooterType,
} from 'src/screens/Share/ShareFooter/ShareFooter';
import MedalSvg from 'assets/icons/medal_red.svg';
import Title from 'src/components/Title';
import HtmlBadges from './HtmlBadges';

export type ProgressBadgesProps = IComponentProps &
  RouteComponentProps<{ tab?: string }> & {
    getAllPrograms: Function;
    getProgressBadges: Function;
    updateProgressBadges: Function;
    ProgressBadges?: any;
    auth?: any;
    programs?: any;
    organizationId: any;
    share?: any;
  };

interface ProgressBadgesState {
  activeIndex: number;
  badgeUrl: string;
  isValidUrl: boolean;
}

class ProgressBadges extends React.Component<
  ProgressBadgesProps,
  ProgressBadgesState
> {
  constructor(props) {
    super(props);
    const {
      match: {
        params: { tab },
      },
    } = props;
    this.state = {
      activeIndex: this.getIndex(tab),
      badgeUrl: '',
      isValidUrl: false,
    };
  }

  componentDidMount() {
    this.props.getAllPrograms();
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
      case 'htmlbadges':
        return 1;
      default:
        return 0;
    }
  };

  changeTab = (event, data) => {
    switch (data.activeIndex) {
      case 1:
        return this.props.history.push(
          URL.PROGRESS_BADGES_TAB({ tab: 'htmlbadges' })
        );
      default:
        return this.props.history.push(
          URL.PROGRESS_BADGES_TAB({ tab: 'facebook' })
        );
    }
  };

  openShareDialog = type => {
    const { badgeUrl } = this.state;
    const { share, programs } = this.props;

    let program = null;
    const userShare = get(share, 'data[0]attributes');
    if (!userShare) {
      program = get(programs, '[0]');
    } else {
      program = programs.find(item => item.id * 1 === userShare.program_id);
    }

    if (!program) return false;

    const url = `${process.env.API_BASE_URL}${badgeUrl ||
      `/user/leaderboard/program/group/badges_type`}`;

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

  render() {
    const { activeIndex, isValidUrl } = this.state;
    const { classes } = this.props;
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
            <HtmlBadges
              hideBadge
              onChangeUrl={(value, isValid) => {
                this.setState({
                  badgeUrl: value,
                  isValidUrl: isValid,
                });
              }}
            />
            {!!isValidUrl && (
              <ShareFooter
                shareType={ShareFooterType.FACEBOOK}
                onCustomizeBadgeFormSubmit={() =>
                  this.openShareDialog('facebook')
                }
              />
            )}
          </Tab.Pane>
        ),
      },
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
            <HtmlBadges
              onChangeUrl={(value, isValid) => {
                this.setState({
                  badgeUrl: value,
                  isValidUrl: isValid,
                });
              }}
              isValidUrl={isValidUrl}
            />
          </Tab.Pane>
        ),
      },
    ];

    return (
      <div>
        <Title icon={<ProgressBadgesHeadingSvg height={25} />}>
          Progress Badges
        </Title>
        <div style={{ display: 'none' }}>
          <ProgressBadgesHeadingSvg height={25} />
        </div>
        <p className={classes.subTitle}>
          Show Your Progress!
          <br />
          <br />
          Display how awesome your readers are by posting a badge that shows the
          real-time reading totals. Badges can be placed on any web page using
          the html snippet provided below. The badge will appear on your web
          page exactly as it appears below.
          <br />
          <br />
          Select the Reading Programs and or Reading Groups to include in the
          total. You can display all the Reading Programs down to a single
          Reading Group on a badge.
          <br />
          <br />
          To display the sum total of your entire Reader Zone account, select
          “All” in Badge type, Programs and Group.
          <br />
        </p>
        <Tab
          menu={{ color: 'green', secondary: true, pointing: true }}
          panes={panes}
          className={classes.tabContainer}
          onTabChange={this.changeTab}
          activeIndex={activeIndex}
        />
      </div>
    );
  }
}

export default ProgressBadges;
