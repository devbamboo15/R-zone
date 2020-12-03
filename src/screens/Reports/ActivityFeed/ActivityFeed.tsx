import * as React from 'react';
import themr from 'src/helpers/themr';
import cn from 'classnames';
import AwardSvg from 'src/assets/icons/feeds/Award.svg';
import BookSvg from 'src/assets/icons/feeds/Book.svg';
import EntrySvg from 'src/assets/icons/feeds/Entry.svg';
import GoalSvg from 'src/assets/icons/feeds/Goal.svg';
import ProgramSvg from 'src/assets/icons/feeds/Program.svg';
import get from 'lodash/get';
import InfiniteScroll from 'react-infinite-scroller';
import Spinner from 'src/components/Spinner';
import styles from './styles.scss';

interface TimeLine {
  status: TimeLineStatusType;
  date: any;
  content: string;
  classes?: any;
}
export enum TimeLineStatusType {
  GOAL = 'goal',
  LOG = 'log',
  AWARD = 'award',
  BOOK = 'book',
  READER = 'reader',
}
export type ActivityFeedProps = IComponentProps & {
  timeLines: {
    data: TimeLine[];
  };
  onLoadMoreFeed: () => void;
  feedsLoading: boolean;
};
const getIcon = (status: string) => {
  let icon;
  let color;
  const statusStr = status ? status.replace(/\\/g, '') : '';
  switch (statusStr) {
    case 'AppDomainGoalsGoal':
      color = 'turquoise';
      icon = <GoalSvg height={20} width={20} />;
      break;
    case 'AppDomainGoalsEntry':
      color = 'gray4';
      icon = <EntrySvg height={20} width={20} />;
      break;
    case 'AppDomainAwardsUserAward':
      color = 'secondary_color';
      icon = <AwardSvg height={20} width={20} />;
      break;
    case 'AppDomainBooksBook':
      color = 'green';
      icon = <BookSvg height={20} width={20} />;
      break;
    case 'AppDomainOrganizationsProgram':
      color = 'warning';
      icon = <ProgramSvg height={20} width={20} />;
      break;
    default:
      color = 'turquoise';
      icon = <GoalSvg height={20} width={20} />;
      break;
  }
  return { icon, color };
};
const ActivityFeed = ({ classes, timeLines, onLoadMoreFeed, feedsLoading }) => {
  React.useEffect(() => {
    if (!feedsLoading) {
      const hasMore = !!get(timeLines, 'next_page_url');
      const timelineWrapper = document.getElementById('timeline_wrapper');

      if (
        hasMore &&
        timelineWrapper.scrollHeight <= timelineWrapper.clientHeight
      ) {
        onLoadMoreFeed();
      }
    }
  });
  return (
    <div className={classes.container}>
      <label className={classes.title}>
        Activity Feed: {/* TODO: fix svg icon */}
        <div style={{ display: 'none' }}>
          <EntrySvg height={20} width={20} />
        </div>
      </label>
      {feedsLoading && (
        <div className={classes.LoadingFeed}>
          <Spinner />
        </div>
      )}
      <div className={classes.timeLineList} id="timeline_wrapper">
        <InfiniteScroll
          pageStart={0}
          initialLoad={false}
          loadMore={onLoadMoreFeed}
          useWindow={false}
          threshold={50}
          hasMore={!!get(timeLines, 'next_page_url')}>
          {get(timeLines, 'data', []).map((item, index) => (
            <div
              key={index}
              className={cn(classes.item, getIcon(item.subject_type).color)}>
              <span className={classes.icon}>
                {getIcon(item.subject_type).icon}
              </span>
              <div className={classes.content}>
                <span className={classes.date}>{get(item, 'created_at')}</span>
                <span className={classes.divide}>-</span>
                <p>{get(item, 'data.message')}</p>
              </div>
            </div>
          ))}
        </InfiniteScroll>
      </div>
    </div>
  );
};

export default themr<ActivityFeedProps>('ActivityFeed', styles)(ActivityFeed);
