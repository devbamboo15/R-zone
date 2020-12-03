import * as React from 'react';
import { get } from 'lodash';
import themr from 'src/helpers/themr';
import { List } from 'semantic-ui-react';
import * as moment from 'moment';
import { formatNumber } from 'src/helpers/number';
import styles from './styles.scss';

export interface GroupItemType {
  firstName?: string;
  lastName?: string;
  status: string;
  total: number;
}

export interface GroupUser {
  name: string;
  total_entries: number;
  goal_complete: boolean;
}
export interface GroupType {
  name: string;
  end_date: string;
  start_date: string;
  total_readers: number;
  total_entries: number;
  metric_id: string;
  interval_id: string;
  users: GroupUser[];
  id: number | string;
}
export type GroupProps = IComponentProps & {
  classes?: any;
  group: GroupType;
  isReadingLog?: boolean;
  pluralCheck?: any;
};
const metricIdsMap = {
  pages: 'Page',
  minutes: 'Minute',
  chapters: 'Chapter',
  books: 'Book',
  'yes/no': 'Yes/No',
  'yes/nos': 'Yes/No',
};
const intervalMap = {
  daily: 'Daily',
  week: 'Weekly',
  month: 'Monthly',
  program: 'Duration of Program',
};

const Group = ({ classes, group, isReadingLog, pluralCheck }) => {
  const startDate = group.start_date;
  const endDate = group.end_date;
  return (
    <div>
      <div className={classes.headerGroup}>
        <div className={classes.topHeaderGroup}>
          <span className={classes.groupName}>{group.name}</span>
          <List horizontal>
            <List.Item>
              {startDate && (
                <List.Content>
                  <span className={classes.groupHeaderLabel}>Starts</span>
                  <span>{moment(startDate).format('MM/DD/YYYY')}</span>
                </List.Content>
              )}
            </List.Item>
            <List.Item>
              {startDate && endDate && (
                <List.Content>
                  <strong>-</strong>
                </List.Content>
              )}
            </List.Item>
            <List.Item>
              {endDate && (
                <List.Content>
                  <span className={classes.groupHeaderLabel}>Ends</span>
                  <span>{moment(endDate).format('MM/DD/YYYY')}</span>
                </List.Content>
              )}
            </List.Item>
          </List>
        </div>
        <List horizontal divided>
          <List.Item>
            <List.Content>
              <span className={classes.summerText}>
                <span className={classes.number}>
                  {formatNumber(group.total_readers || 0)}
                </span>{' '}
                Reader{pluralCheck(group.total_readers)}
              </span>
            </List.Content>
          </List.Item>
          <List.Item>
            <List.Content>
              <span className={classes.summerText}>
                <span className={classes.number}>
                  {formatNumber(group.total_entries || 0)}
                </span>{' '}
                Total {metricIdsMap[group.metric_id]}
                {pluralCheck(group.total_entries)}
              </span>
            </List.Content>
          </List.Item>
          {!isReadingLog && (
            <List.Item>
              <List.Content>
                <span className={classes.summerText}>
                  {intervalMap[group.interval_id]}
                </span>
              </List.Content>
            </List.Item>
          )}
        </List>
      </div>
      <List className={classes.groupItems}>
        {group.users &&
          group.users.map((user, index) => {
            const complete = get(user, 'goal_complete', false);
            return (
              <List.Item key={index}>
                <div className={classes.groupItem}>
                  <span className={classes.groupItemRow}>
                    {get(user, 'name', '')}
                  </span>
                  {!isReadingLog && (
                    <span className={classes.groupItemRow}>
                      Goal:
                      <span className={classes.groupItemStatus}>
                        {complete ? (
                          <span className={classes.complete}>Complete</span>
                        ) : (
                          <span className={classes.notComplete}>
                            Not complete
                          </span>
                        )}
                      </span>
                    </span>
                  )}
                  <span className={classes.groupItemRow}>
                    <strong>
                      {formatNumber(get(user, 'total_entries', 0))}
                    </strong>
                    <span className={classes.groupItemLabel}>
                      Total{' '}
                      {get(user, 'total_entries', 0) > 1 ? 'Entries' : 'Entry'}
                    </span>
                  </span>
                </div>
              </List.Item>
            );
          })}
      </List>
    </div>
  );
};
export default themr<GroupProps>('Group', styles)(Group);
