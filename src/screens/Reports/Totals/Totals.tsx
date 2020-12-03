import * as React from 'react';
import { get } from 'lodash';
import themr from 'src/helpers/themr';
import { List, Statistic } from 'semantic-ui-react';
import { formatNumber } from 'src/helpers/number';
import styles from './styles.scss';

export type TotalsProps = IComponentProps & {
  classes?: any;
  totals: any;
  filterTime?: number;
};
const Totals = ({ classes, totals }) => {
  return (
    <div className={classes.container}>
      <div className={classes.topHeader}>
        <label className={classes.title}>Totals:</label>
      </div>
      <List className={classes.listTotals}>
        <List.Item>
          <Statistic className={classes.totalItem}>
            <Statistic.Value className={classes.bookTotal}>
              {formatNumber(get(totals, 'books') || 0)}
            </Statistic.Value>
            <Statistic.Label className={classes.totalLabel}>
              Books
            </Statistic.Label>
          </Statistic>
        </List.Item>
        <List.Item>
          <Statistic className={classes.totalItem}>
            <Statistic.Value className={classes.chaptersTotal}>
              {formatNumber(get(totals, 'chapters') || 0)}
            </Statistic.Value>
            <Statistic.Label className={classes.totalLabel}>
              Chapters
            </Statistic.Label>
          </Statistic>
        </List.Item>
        <List.Item>
          <Statistic className={classes.totalItem}>
            <Statistic.Value className={classes.pagesTotal}>
              {formatNumber(get(totals, 'pages') || 0)}
            </Statistic.Value>
            <Statistic.Label className={classes.totalLabel}>
              Pages
            </Statistic.Label>
          </Statistic>
        </List.Item>
        <List.Item>
          <Statistic className={classes.totalItem}>
            <Statistic.Value className={classes.minutesTotal}>
              {formatNumber(get(totals, 'minutes') || 0)}
            </Statistic.Value>
            <Statistic.Label className={classes.totalLabel}>
              Minutes
            </Statistic.Label>
          </Statistic>
        </List.Item>
        <List.Item>
          <Statistic className={classes.totalItem}>
            <Statistic.Value className={classes.entriesTotal}>
              {formatNumber(get(totals, 'yes') || 0)}
            </Statistic.Value>
            <Statistic.Label className={classes.totalLabel}>
              Days Read/Activities
            </Statistic.Label>
          </Statistic>
        </List.Item>
      </List>
    </div>
  );
};
export default themr<TotalsProps>('Totals', styles)(Totals);
