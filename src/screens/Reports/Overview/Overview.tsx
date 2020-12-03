import * as React from 'react';
import { List } from 'semantic-ui-react';
import themr from 'src/helpers/themr';
import { get } from 'lodash';
import InfiniteScroll from 'react-infinite-scroller';
import Spinner from 'src/components/Spinner';
import { formatNumber } from 'src/helpers/number';
import Group, { GroupType } from './Group';
import styles from './styles.scss';

export type OverviewProps = IComponentProps & {
  classes?: any;
  overviews: {
    data: any[];
  };
  onLoadMoreOverview: () => void;
  overviewsLoading: boolean;
};

const metricIdsMap = {
  pages: 'Page',
  minutes: 'Minute',
  chapters: 'Chapter',
  books: 'Book',
  'yes/no': 'Yes/No',
  'yes/nos': 'Yes/No',
};

const Overview = ({
  classes,
  overviews,
  onLoadMoreOverview,
  overviewsLoading,
}) => {
  const pluralCheck = value => {
    if (value) {
      return value > 1 ? 's' : '';
    }
    return '';
  };
  return (
    <div className={classes.container}>
      <label className={classes.title}>Overview:</label>
      {overviewsLoading && (
        <div className={classes.LoadingOverview}>
          <Spinner />
        </div>
      )}
      <div className={classes.overviewWrapper}>
        <InfiniteScroll
          pageStart={0}
          initialLoad={false}
          loadMore={onLoadMoreOverview}
          useWindow={false}
          threshold={50}
          hasMore={!!get(overviews, 'next_page_url')}>
          {get(overviews, 'data', []).map((overview, index) => {
            // const statDate = overview.start_date;
            // const endDate = overview.end_date;
            const metricData = get(overview, 'overview') || {};
            const listMetricKeys = Object.keys(metricData) || [];
            return (
              <div key={index}>
                <div className={classes.summer}>
                  <div className={classes.topHeader}>
                    <span className={classes.subtitle}>{overview.name}</span>
                    {/* <List horizontal>
                    <List.Item>
                      <List.Content>
                        <strong className={classes.summerLabel}>Starts</strong>
                        <span className={classes.summerDate}>{statDate && moment(statDate).format('DD/MM/YYYY')}</span>
                      </List.Content>
                    </List.Item>
                    <List.Item>
                      <List.Content>
                        <strong>-</strong>
                      </List.Content>
                    </List.Item>
                    <List.Item>
                      <List.Content>
                        <strong className={classes.summerLabel}>Ends</strong>
                        <span className={classes.summerDate}>{endDate && moment(endDate).format('DD/MM/YYYY')}</span>
                      </List.Content>
                    </List.Item>
                  </List> */}
                  </div>
                  <List horizontal divided className={classes.listWrapper}>
                    <List.Item>
                      <List.Content>
                        <span className={classes.summerText}>
                          <span className={classes.number}>
                            {formatNumber(overview.total_readers)}
                          </span>{' '}
                          Reader{pluralCheck(overview.total_readers)}
                        </span>
                      </List.Content>
                    </List.Item>
                    <List.Item>
                      <List.Content>
                        <span className={classes.summerText}>
                          <span className={classes.number}>
                            {formatNumber(overview.total_groups)}
                          </span>{' '}
                          Total Group{pluralCheck(overview.total_readers)}
                        </span>
                      </List.Content>
                    </List.Item>
                    {/* <List.Item>
                      <Lipst.Content>
                        <san className={classes.summerText}>
                          {overview.total_entries} Total Entries
                        </span>
                      </List.Content>
                    </List.Item> */}
                    <List.Item>
                      <List.Content>
                        <span className={classes.summerText}>
                          {!overview.reading_log ? 'Goal-Based' : 'Reading Log'}
                        </span>
                      </List.Content>
                    </List.Item>
                  </List>
                  <List horizontal divided className={classes.listWrapper}>
                    {listMetricKeys.map((metricKey, i) => {
                      return (
                        <List.Item key={i}>
                          <List.Content>
                            <span className={classes.summerText}>
                              <span className={classes.number}>
                                {formatNumber(metricData[metricKey])}
                              </span>{' '}
                              Total {metricIdsMap[metricKey]}
                              {pluralCheck(metricData[metricKey])}
                            </span>
                          </List.Content>
                        </List.Item>
                      );
                    })}
                  </List>
                </div>
                <div className={classes.listGroups}>
                  {overview.groups &&
                    overview.groups.map(
                      (group: GroupType, indexGroup: number) => (
                        <Group
                          pluralCheck={pluralCheck}
                          key={indexGroup}
                          group={group}
                          classes={classes}
                          isReadingLog={overview.reading_log}
                        />
                      )
                    )}
                </div>
              </div>
            );
          })}
        </InfiniteScroll>
      </div>
    </div>
  );
};

export default themr<OverviewProps>('Overview', styles)(Overview);
