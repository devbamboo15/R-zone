import * as React from 'react';
import get from 'lodash/get';
import isArray from 'lodash/isArray';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { Grid } from 'semantic-ui-react';
import { formatNumber } from 'src/helpers/number';
import Select from 'src/components/FormFields/Select';
import Badge, { BadgeSize, BadgeType } from 'src/components/Badge';
import Spinner from 'src/components/Spinner';
import { capitalize } from 'src/helpers/methods';
import LeadershipFriendsvg from 'assets/icons/badgeLeadershipFriend.svg';
import cx from 'classnames';
import find from 'lodash/find';
import ProgramSelect from './ProgramSelect';
import GroupSelect from './GroupSelect';
import {
  BADGE_TYPE_OPTIONS,
  GROUP_VS_GROUP_PROGRAM,
  READER_VS_READER_PROGRAM,
  GOAL_BASE_PROGRAM,
} from './constants';
import ProgresBadgeDesign from '../ProgresBadgeDesign';

export type HtmlBadgesProps = IComponentProps & {
  programs?: any;
  groups?: any;
  share?: any;
  auth?: any;
  getAllOrganizerGroups?: any;
  getUserLeaderboard?: any;
  resetUserLeaderboard?: any;
  userLeaderboard?: any;
  userLeaderboardLoading?: any;
  hideBadge?: any;
  onChangeUrl?: any;
  isValidUrl?: boolean;
  programsLoading?: boolean;
  groupsLoading?: boolean;
  badgesAccount?: any;
  organizationName?: string;
  organizationId?: string;
};

interface IState {
  isLeaderBoard: boolean;
  badgeUrl: string;
}

export enum SortEnum {
  'group' = 'group',
  'program' = 'program',
}
class HtmlBadges extends React.Component<HtmlBadgesProps, IState> {
  constructor(props) {
    super(props);

    this.state = {
      isLeaderBoard: false,
      badgeUrl: '',
    };
  }

  form: any;

  componentDidMount() {
    this.props.getAllOrganizerGroups();
    this.props.resetUserLeaderboard();
  }

  componentDidUpdate(prevProps) {
    const { userLeaderboard, userLeaderboardLoading, onChangeUrl } = this.props;
    const { badgeUrl } = this.state;
    if (
      !userLeaderboardLoading &&
      userLeaderboardLoading !== prevProps.userLeaderboardLoading
    ) {
      if (!userLeaderboard || userLeaderboard.length <= 0) {
        onChangeUrl('', false);
      } else {
        onChangeUrl(badgeUrl, true);
      }
    }
  }

  renderProgramOption = () => {
    const { props } = this;
    const { isLeaderBoard } = this.state;
    let options = [];
    let programs = get(props, 'programs', []);
    if (isLeaderBoard) {
      programs = programs.filter(
        p => p && parseInt(get(p, 'attributes.reading_log', 0), 10) > 1
      );
    }
    options =
      programs.map((item: any) => {
        const program = {
          value: item.id,
        };
        return {
          ...program,
          text: item.attributes.name,
          label: isLeaderBoard ? null : item.attributes.name,
        };
      }) || [];
    if (!isLeaderBoard) {
      options.unshift({
        value: 'all',
        label: 'All',
      });
    }
    return options;
  };

  getReadingLog = programId => {
    const { programs } = this.props;
    const foundProgram = find(programs, { id: programId }) || {};
    const programReadingLog = get(foundProgram, 'attributes.reading_log', 0);
    return programReadingLog;
  };

  _isContestProgram = item => {
    const readingLog = get(item, 'attributes.reading_log');
    return (
      readingLog === GROUP_VS_GROUP_PROGRAM ||
      readingLog === READER_VS_READER_PROGRAM
    );
  };

  _isGoalBaseProgram = item => {
    const readingLog = get(item, 'attributes.reading_log');
    return readingLog === GOAL_BASE_PROGRAM;
  };

  getBadgeTypeOptions() {
    const { props } = this;
    let badgeTypeOptions = BADGE_TYPE_OPTIONS;
    const programs = get(props, 'programs', []);

    const contestProgram = programs.filter(item =>
      this._isContestProgram(item)
    );

    const goalBaseProgram = programs.filter(item =>
      this._isGoalBaseProgram(item)
    );

    // If an Organizer does not have any Contest type Programs,
    // then hide Leaderboard option.
    // https://tasks.getventive.com/projects/CB68A-A03
    if (contestProgram.length === 0) {
      badgeTypeOptions = badgeTypeOptions.filter(o => o.value !== '1');
    }

    // If an Organizer does not have any Goal Based type Programs,
    // then hide Progress Badges option.
    // https://tasks.getventive.com/projects/CB68A-A03
    if (goalBaseProgram.length === 0) {
      badgeTypeOptions = badgeTypeOptions.filter(o => o.value !== '2');
    }

    return badgeTypeOptions;
  }

  getGroupOptions = (isLeaderBoard, values, programs, groups) => {
    let groupIds = [];
    if (isArray(values.program)) {
      (get(values, 'program') || []).map(p => {
        const foundProgram = find(programs, { id: p.value }) || {};
        const foundGroupIds = (
          get(foundProgram, 'relationships.groups.data') || []
        ).map(g => g.id);
        groupIds = [...groupIds, ...foundGroupIds];
        return true;
      });
    } else {
      const foundProgram = find(programs, { id: values.program }) || {};
      groupIds = (get(foundProgram, 'relationships.groups.data') || []).map(
        g => g.id
      );
    }

    const groupOptions = groups
      .filter(
        g =>
          groupIds.indexOf(g.group_id) >= 0 ||
          (isArray(values.program) &&
            get(values, 'program[0].value', '') === 'all')
      )
      .map((item: any) => {
        const group = {
          value: item.group_id.toString(),
        };
        if (isLeaderBoard) {
          return {
            ...group,
            text: item.group_name,
          };
        }
        return {
          ...group,
          label: item.group_name,
        };
      });
    if (
      groupOptions.length > 0 &&
      this.getReadingLog(values.program) === 2 &&
      isLeaderBoard
    ) {
      groupOptions.unshift({
        value: 'all',
        text: 'All groups',
      });
    }
    return groupOptions;
  };

  badgeContent = program => {
    const { classes, userLeaderboard, programs, organizationName } = this.props;
    let placeholderProgramName = 'Placeholder Program Name';
    let foundProgram = {};
    if (isArray(program) && program.length > 1) {
      placeholderProgramName = organizationName;
    } else {
      const programId =
        isArray(program) && program.length === 1 ? program[0].value : program;
      foundProgram = find(programs, { id: programId }) || {};
      if (programId === 'all') {
        placeholderProgramName = organizationName;
      }
    }
    const firstLeaderboard = userLeaderboard[0] || { total_score: 0 };
    return (
      <>
        <div className={classes.badgeHeader}>
          <h2>
            {get(foundProgram, 'attributes.name', '') || placeholderProgramName}
          </h2>
          <h3>We have read</h3>
          <h1 className={classes.mainHeading}>
            {formatNumber(firstLeaderboard.total_score)}
          </h1>
          <h4>{firstLeaderboard.metric_id}</h4>
        </div>
        <div className={classes.badgeContent}>
          {userLeaderboard.map((leaderboard, i) => {
            if (i > 0) {
              return (
                <React.Fragment key={i}>
                  <h1>{formatNumber(leaderboard.total_score)}</h1>
                  <h4>{leaderboard.metric_id}</h4>
                </React.Fragment>
              );
            }
            return '';
          })}
        </div>
        <div className={classes.badgeFooter} />
      </>
    );
  };

  badgeLeadershipContent = foundProgram => {
    const { classes, userLeaderboard, badgesAccount } = this.props;
    if (badgesAccount === 1) {
      return (
        <div className={classes.badgeLeadershipList}>
          <div className={classes.topImg} />
          <ul>
            {userLeaderboard.length === 0 && <li style={{ height: '58px' }} />}
            {userLeaderboard.map((leaderboard, i) => {
              return (
                <li key={i}>
                  <div className={classes.icon}>
                    <LeadershipFriendsvg />
                  </div>
                  <div className={classes.content}>
                    <span className={classes.des}>
                      {leaderboard.group_name}
                    </span>
                    <span className={classes.total}>
                      {leaderboard.total_score}{' '}
                      {capitalize(leaderboard.metric_id)}
                    </span>
                  </div>
                  <div className={classes.number}>{i + 1}</div>
                </li>
              );
            })}
          </ul>
        </div>
      );
    }
    return (
      <ProgresBadgeDesign
        userLeaderboard={userLeaderboard}
        programName={get(foundProgram, 'attributes.name', '')}
      />
    );
  };

  renderBadge = (
    program,
    share,
    auth,
    render,
    isLeaderBoard,
    dontUseWrapper?
  ) => {
    let iframeHeight = 550;
    const { userLeaderboard, badgesAccount } = this.props;
    const { badgeUrl } = this.state;
    if (isLeaderBoard) {
      iframeHeight = 300;
      if (badgesAccount === 1) {
        iframeHeight = 400;
      }
      iframeHeight += (userLeaderboard.length - 1) * 70;
    }
    if (!isLeaderBoard && userLeaderboard && userLeaderboard.length > 1) {
      iframeHeight = 720 + (userLeaderboard.length - 2) * 115;
    }
    return (
      <Badge
        badgeSize={BadgeSize.LARGE}
        badgeType={BadgeType.HTML}
        isSpecial
        program={program}
        dontUseWrapper={dontUseWrapper}
        share={share}
        customIframe={`<iframe width="760" height="${iframeHeight}" style="margin-left: 120px" src="${
          process.env.API_BASE_URL
        }${badgeUrl}" frameborder="0"></iframe>`}
        auth={auth}>
        {render()}
      </Badge>
    );
  };

  renderContent = (isLeaderBoard, foundProgram) => {
    const { classes, badgesAccount } = this.props;
    return (
      <div
        className={cx(
          classes.badgesLeadershipInner,
          classes.badges450x500,
          classes.notBadge,
          (!isLeaderBoard || badgesAccount !== 1) && classes.normalMargin
        )}>
        {this.badgeLeadershipContent(foundProgram)}
      </div>
    );
  };

  handleGetLeaderboard = (values, programReadingLog) => {
    const { isLeaderBoard } = this.state;
    const {
      getUserLeaderboard,
      resetUserLeaderboard,
      onChangeUrl,
      programs,
      organizationId,
    } = this.props;
    const badgesType =
      values.badge_type === '3'
        ? values.badge_type
        : parseInt(values.badge_type || 0, 10);
    if (isLeaderBoard) {
      const program = parseInt(values.program || 0, 10);
      const group = parseInt(values.group || 0, 10);
      const isValidUrl =
        program && (group || programReadingLog === 2) && badgesType;
      this.setState({
        badgeUrl: `/user/leaderboard/${organizationId}/${badgesType ||
          'badge_type'}/${program || 'program'}${
          group && group.toString() !== 'all' ? `/${group}` : ''
        }`,
      });
      if (isValidUrl) {
        getUserLeaderboard(
          [program],
          group && group.toString() !== 'all' ? [group] : 0,
          badgesType
        );
      } else {
        resetUserLeaderboard();
        onChangeUrl('', false);
      }
    } else {
      const program = values.program || [];
      const isAllProgram = get(program, '[0].value', '') === 'all';
      const programIds = program.map(p => p.value);
      const group = values.group || [];
      const groupIds = group.map(g => g.value);
      const isValidUrl = programs.length > 0 && !!badgesType;
      this.setState({
        badgeUrl: `/user/leaderboard/${organizationId}/${badgesType ||
          'badge_type'}/${
          isAllProgram
            ? 0
            : programIds.length > 0
            ? programIds.toString()
            : 'program'
        }/${groupIds.length === 0 ? 0 : groupIds.toString()}`,
      });
      if (isValidUrl) {
        getUserLeaderboard(
          isAllProgram ? [0] : programIds,
          groupIds.length === 0 ? [0] : groupIds,
          badgesType
        );
      } else {
        resetUserLeaderboard();
        onChangeUrl('', false);
      }
    }
  };

  render() {
    const {
      classes,
      programs,
      share,
      auth,
      userLeaderboardLoading,
      hideBadge,
      isValidUrl,
      groups,
      programsLoading,
      groupsLoading,
      resetUserLeaderboard,
      onChangeUrl,
    } = this.props;
    let program = null;
    const userShare = get(share, 'data[0]attributes');
    if (!userShare) {
      program = get(programs, '[0]');
    } else {
      program = programs.find(item => item.id * 1 === userShare.program_id);
      if (!program) {
        program = get(programs, '[0]');
      }
    }

    return (
      <div>
        {(programsLoading || groupsLoading) && <Spinner />}
        <Formik
          initialValues={{
            badge_type: '3',
            program: '',
            group: '',
            metric: '',
          }}
          validationSchema={Yup.object().shape({})}
          ref={ref => (this.form = ref)}
          onSubmit={() => {}}>
          {formProps => {
            const { values, setFieldValue, setFieldTouched } = formProps;
            const foundProgram = find(programs, { id: values.program }) || {};
            const isLeaderBoard = values.badge_type === '1';
            const badgeTypeOptions = this.getBadgeTypeOptions();
            const groupOptions = this.getGroupOptions(
              isLeaderBoard,
              values,
              programs,
              groups
            );
            return (
              <>
                <Grid columns={5}>
                  <Select
                    selectProps={{
                      options: badgeTypeOptions,
                      placeholder: 'Badge Type',
                      onChange: (_, data) => {
                        setFieldValue('badge_type', data.value);
                        setFieldTouched('badge_type');
                        this.setState({
                          isLeaderBoard: data.value === '1',
                        });
                        setFieldValue('program', '');
                        setFieldValue('group', '');
                        setFieldValue('metric', '');
                        resetUserLeaderboard();
                        onChangeUrl('', false);
                      },
                      value: values.badge_type,
                      name: 'badge_type',
                    }}
                    label="Badge Type"
                  />
                  <ProgramSelect
                    isLeaderBoard={isLeaderBoard}
                    renderProgramOption={this.renderProgramOption}
                    formProps={formProps}
                    handleGetLeaderboard={this.handleGetLeaderboard}
                    getReadingLog={this.getReadingLog}
                    classes={classes}
                  />
                  <GroupSelect
                    isLeaderBoard={isLeaderBoard}
                    groupOptions={groupOptions}
                    formProps={formProps}
                    handleGetLeaderboard={this.handleGetLeaderboard}
                    getReadingLog={this.getReadingLog}
                    classes={classes}
                  />
                </Grid>
                {userLeaderboardLoading && <Spinner />}
                <div
                  className={cx(
                    classes.badgesPreview,
                    isLeaderBoard ? classes.leadership : classes.progressBadge
                  )}>
                  {isLeaderBoard ? (
                    <>
                      {hideBadge || !isValidUrl ? (
                        <>{this.renderContent(true, foundProgram)}</>
                      ) : (
                        <>
                          {this.renderBadge(
                            program,
                            share,
                            auth,
                            () => {
                              return (
                                <div
                                  className={cx(
                                    classes.badgesLeadershipInner,
                                    classes.badges450x500,
                                    classes.notBadge
                                  )}>
                                  {this.badgeLeadershipContent(foundProgram)}
                                </div>
                              );
                            },
                            isLeaderBoard
                          )}
                        </>
                      )}
                    </>
                  ) : (
                    <>
                      {hideBadge || !isValidUrl ? (
                        <div
                          className={cx(
                            classes.badgesInner,
                            classes.badges500x780
                          )}>
                          {this.badgeContent(values.program)}
                        </div>
                      ) : (
                        <>
                          {this.renderBadge(
                            program,
                            share,
                            auth,
                            () => {
                              return (
                                <div
                                  className={cx(
                                    classes.badgesInner,
                                    classes.badges500x780
                                  )}>
                                  {this.badgeContent(values.program)}
                                </div>
                              );
                            },
                            false,
                            true
                          )}
                        </>
                      )}
                    </>
                  )}
                </div>
              </>
            );
          }}
        </Formik>
      </div>
    );
  }
}

export default HtmlBadges;
