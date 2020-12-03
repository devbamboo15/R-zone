import * as React from 'react';
import cx from 'classnames';
import Spinner from 'src/components/Spinner';
import DateRangePicker from 'src/components/DateRangePicker';
import * as moment from 'moment';
import Heading, { HeadingColor, HeadingType } from 'src/components/Heading';
import { Button as SemButton } from 'semantic-ui-react';
import get from 'lodash/get';
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
  programId?: any;
  groupId?: any;
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
    // const { readerId, getReaderFeeds } = this.props;
    // const { dateRangeActivityFeed } = this.state;

    // const startDate = get(dateRangeActivityFeed, 'startDate').format(
    //   'YYYY-MM-DD'
    // );
    // const endDate = get(dateRangeActivityFeed, 'endDate').format('YYYY-MM-DD');

    // getReaderFeeds(readerId, {
    //   start_date: startDate,
    //   end_date: endDate,
    // });
    this.applyFilter();
  };

  componentDidUpdate(prevProps) {
    const { programId, groupId, readerId } = this.props;
    if (
      prevProps.programId !== programId ||
      prevProps.groupId !== groupId ||
      prevProps.readerId !== readerId
    ) {
      this.applyFilter();
    }
  }

  applyFilter = () => {
    const { defaultFilter, dateRangeActivityFeed } = this.state;
    const { programId, groupId } = this.props;
    const startDate = get(dateRangeActivityFeed, 'startDate').format(
      'YYYY-MM-DD'
    );
    const endDate = get(dateRangeActivityFeed, 'endDate').format('YYYY-MM-DD');
    const { readerId, getReaderFeeds } = this.props;
    let filter: IFilter = {
      programs: programId && programId !== '0' ? [programId] : [],
      groups: groupId && groupId !== '0' ? [groupId] : [],
    };
    if (defaultFilter === 4) {
      filter = { ...filter, start_date: startDate, end_date: endDate };
    } else {
      filter = { ...filter, interval: get(dateTab, defaultFilter) };
    }
    getReaderFeeds(readerId, filter);
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
    const { dateRangeActivityFeed, defaultFilter, activeIndex } = this.state;
    const feedsData = readerFeeds;
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
