import * as React from 'react';
import cx from 'classnames';
import Spinner from 'src/components/Spinner';
import DateRangePicker from 'src/components/DateRangePicker';
import * as moment from 'moment';
import Heading, { HeadingColor, HeadingType } from 'src/components/Heading';
import { Button as SemButton } from 'semantic-ui-react';
import Select from 'src/components/FormFields/Select';
import get from 'lodash/get';
import findIndex from 'lodash/findIndex';
import EntrySvg from 'src/assets/icons/feeds/Entry.svg';
import FeedRow from './FeedRow';

export type Props = IComponentProps & {
  readerFeeds?: any[];
  readerFeedsLoading?: boolean;
  updateReaderFeed?: Function;
  deleteReaderFeed?: Function;
  getReaderFeeds?: Function;
  readerId: string;
  readerData?: any;
  updateFeedLoading?: boolean;
  deleteFeedLoading?: boolean;
  userAccessProgram?: any;
};

interface IStates {
  dateRangeActivityFeed?: any;
  defaultFilter: number;
  activeIndex: string;
  selectedProgramId: string;
  selectedGroupId: string;
}
interface IFilter {
  programs: any[];
  groups: any[];
  start_date?: string;
  end_date?: string;
  interval?: string;
}

const dateTab = {
  0: 'today',
  1: 'yesterday',
  2: 'last_week',
  3: 'last_month',
};

class ReaderFeeds extends React.Component<Props, IStates> {
  state = {
    activeIndex: '',
    dateRangeActivityFeed: {
      startDate: moment().subtract(29, 'days'), // for last 30 days
      endDate: moment(),
    },
    defaultFilter: 4,
    selectedProgramId: '0',
    selectedGroupId: '0',
  };

  setActiveFilter = type => {
    this.setState(
      () => ({
        defaultFilter: type,
      }),
      () => {
        this.applyFilter();
      }
    );
  };

  componentDidMount = () => {
    const { readerId, getReaderFeeds } = this.props;
    const { dateRangeActivityFeed } = this.state;

    const startDate = get(dateRangeActivityFeed, 'startDate').format(
      'YYYY-MM-DD'
    );
    const endDate = get(dateRangeActivityFeed, 'endDate').format('YYYY-MM-DD');

    getReaderFeeds(readerId, {
      start_date: startDate,
      end_date: endDate,
    });
  };

  applyFilter = () => {
    const {
      selectedProgramId,
      selectedGroupId,
      defaultFilter,
      dateRangeActivityFeed,
    } = this.state;
    const startDate = get(dateRangeActivityFeed, 'startDate').format(
      'YYYY-MM-DD'
    );
    const endDate = get(dateRangeActivityFeed, 'endDate').format('YYYY-MM-DD');
    const { readerId, getReaderFeeds } = this.props;
    let filter: IFilter = {
      programs:
        selectedProgramId && selectedProgramId !== '0'
          ? [selectedProgramId]
          : [],
      groups:
        selectedGroupId && selectedGroupId !== '0' ? [selectedGroupId] : [],
    };
    if (defaultFilter === 4) {
      filter = { ...filter, start_date: startDate, end_date: endDate };
    } else {
      filter = { ...filter, interval: get(dateTab, defaultFilter) };
    }
    getReaderFeeds(readerId, filter);
  };

  getProgramOptions = () => {
    const { readerData } = this.props;
    const programGroup = get(readerData, 'program_group') || [];
    const programOptions = [{ value: '0', text: 'All Programs' }];
    programGroup.map(pg => {
      const foundExistingOptionIndex = findIndex(programOptions, {
        value: pg.program_id.toString(),
      });
      if (foundExistingOptionIndex < 0) {
        programOptions.push({
          value: pg.program_id.toString(),
          text: pg.program_name,
        });
      }
      return true;
    });
    return programOptions;
  };

  getGroupOptions = (selectedProgram?: any) => {
    const { readerData } = this.props;
    const programGroup = get(readerData, 'program_group') || [];
    const groupOptions = [{ value: '0', text: 'All Groups' }];
    programGroup.map(pg => {
      const foundExistingOptionIndex = findIndex(groupOptions, {
        value: pg.group_id.toString(),
      });
      if (
        foundExistingOptionIndex < 0 &&
        (selectedProgram && selectedProgram !== '0'
          ? pg.program_id.toString() === selectedProgram
          : true)
      ) {
        groupOptions.push({
          value: pg.group_id.toString(),
          text: pg.group_name,
        });
      }
      return true;
    });
    return groupOptions;
  };

  render() {
    const {
      classes,
      readerFeedsLoading,
      updateReaderFeed,
      deleteReaderFeed,
      readerId,
      readerFeeds,
      updateFeedLoading,
      deleteFeedLoading,
      userAccessProgram,
    } = this.props;
    const {
      dateRangeActivityFeed,
      defaultFilter,
      activeIndex,
      selectedProgramId,
      selectedGroupId,
    } = this.state;
    const feedsData = readerFeeds;
    const programOptions = this.getProgramOptions();
    const groupOptions = this.getGroupOptions(selectedProgramId);
    return (
      <div className={classes.activityFeed}>
        <div className={classes.activityTop}>
          <div className={classes.activityTopTitle}>
            <Heading
              headingProps={{ as: 'h4' }}
              colorVariant={HeadingColor.CYAN}
              type={HeadingType.BOLD_600}>
              Activity Feed
              <div style={{ display: 'none' }}>
                <EntrySvg height={20} width={20} />
              </div>
            </Heading>
          </div>
          <div
            className={cx(
              classes.actionGroup,
              defaultFilter === 4 && classes.hasDatepicker
            )}>
            <div className={classes.leftSide}>
              <div className={classes.programSelect}>
                <Select
                  selectProps={{
                    options: programOptions,
                    value: selectedProgramId,
                    onChange: (_, { value }) => {
                      this.setState(
                        {
                          selectedProgramId: value.toString(),
                          selectedGroupId: '0',
                        },
                        () => {
                          this.applyFilter();
                        }
                      );
                    },
                  }}
                />
              </div>
              <div className={classes.groupSelect}>
                <Select
                  selectProps={{
                    options: groupOptions,
                    value: selectedGroupId,
                    onChange: (_, { value }) => {
                      this.setState(
                        {
                          selectedGroupId: value.toString(),
                        },
                        () => {
                          this.applyFilter();
                        }
                      );
                    },
                  }}
                />
              </div>
              {defaultFilter === 4 && (
                <div className={classes.dateRangeWrapper}>
                  <DateRangePicker
                    startDate={dateRangeActivityFeed.startDate}
                    endDate={dateRangeActivityFeed.endDate}
                    onDatesChange={({ startDate, endDate }) => {
                      this.setState(
                        {
                          dateRangeActivityFeed: {
                            startDate,
                            endDate: endDate || startDate,
                          },
                        },
                        () => {
                          this.applyFilter();
                        }
                      );
                    }}
                  />
                </div>
              )}
            </div>
            <SemButton.Group className={classes.activityTabs} size="mini">
              <SemButton
                onClick={() => this.setActiveFilter(0)}
                size="mini"
                type="button"
                className={
                  defaultFilter === 0
                    ? classes.reader_tab_active
                    : classes.simple_tab
                }>
                Today
              </SemButton>
              <SemButton
                onClick={() => this.setActiveFilter(1)}
                type="button"
                className={
                  defaultFilter === 1
                    ? classes.reader_tab_active
                    : classes.simple_tab
                }>
                Yesterday
              </SemButton>
              <SemButton
                onClick={() => this.setActiveFilter(2)}
                type="button"
                className={
                  defaultFilter === 2
                    ? classes.reader_tab_active
                    : classes.simple_tab
                }>
                Last Week
              </SemButton>
              <SemButton
                onClick={() => this.setActiveFilter(3)}
                type="button"
                className={
                  defaultFilter === 3
                    ? classes.reader_tab_active
                    : classes.simple_tab
                }>
                Last Month
              </SemButton>
              <SemButton
                onClick={() => this.setActiveFilter(4)}
                size="mini"
                type="button"
                className={
                  defaultFilter === 4
                    ? classes.reader_tab_active
                    : classes.simple_tab
                }>
                Custom
              </SemButton>
            </SemButton.Group>
          </div>
        </div>
        <div className={classes.activityContent}>
          {(readerFeedsLoading || updateFeedLoading || deleteFeedLoading) && (
            <Spinner />
          )}
          {feedsData.map(feed => (
            <FeedRow
              key={feed.id}
              userAccessProgram={userAccessProgram}
              feed={feed}
              onUpdateClick={id => {
                this.setState({ activeIndex: id });
              }}
              isActive={activeIndex === feed.id.toString()}
              onUpdate={updateReaderFeed}
              onDelete={deleteReaderFeed}
              readerId={readerId}
            />
          ))}
        </div>
      </div>
    );
  }
}

export default ReaderFeeds;
