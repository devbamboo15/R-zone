import * as React from 'react';
import cx from 'classnames';
import Select from 'src/components/FormFields/Select';
import { Statistic } from 'semantic-ui-react';
import Heading, { HeadingType } from 'src/components/Heading';
import { formatNumber } from 'src/helpers/number';

export type Props = IComponentProps & {
  readerId: string;
  groupId: string;
  getReaderMetrics?: Function;
  readerMetrics?: any;
  onChange?: Function;
};

const options = [
  {
    text: 'Last 7 days',
    value: '7',
  },
  {
    text: 'Last 30 days',
    value: '30',
  },
  {
    text: 'All Time',
    value: 'all',
  },
];

class Metrics extends React.Component<Props> {
  componentDidMount = () => {
    const { getReaderMetrics, readerId, groupId } = this.props;
    getReaderMetrics(readerId, groupId, 'overall');
  };

  handleFilterProgress = value => {
    const { readerId, groupId, getReaderMetrics, onChange } = this.props;
    const metricVal =
      value && value.toString() !== 'all' ? `last_${value}_days` : 'overall';
    onChange(metricVal);
    getReaderMetrics(readerId, groupId, metricVal);
  };

  render() {
    const { classes, readerMetrics } = this.props;
    const stats = [
      {
        name: 'Books',
        value: readerMetrics.books,
        style: 'books',
      },
      {
        name: 'Chapters',
        value: readerMetrics.chapters,
        style: 'chapters',
      },
      {
        name: 'Minutes',
        value: readerMetrics.minutes,
        style: 'minutes',
      },
      {
        name: 'Pages',
        value: readerMetrics.pages,
        style: 'books',
      },
      {
        name: '"Yes" Entries',
        value: readerMetrics.yes,
        style: 'entries',
      },
    ];
    return (
      <div className={cx(classes.stats, classes.metrics)}>
        <div className={classes.mainStats}>
          {stats.map(stat => {
            if (typeof stat.value === 'undefined') {
              return null;
            }

            return (
              <div key={stat.name} className={classes.metricItem}>
                <Statistic size="tiny">
                  <Statistic.Value className={classes[stat.style]}>
                    {formatNumber(stat.value)}
                  </Statistic.Value>
                  <Heading
                    headingProps={{ as: 'h5', textAlign: 'center' }}
                    type={HeadingType.NORMAL}>
                    {stat.name}
                  </Heading>
                </Statistic>
              </div>
            );
          })}
          <Select
            selectProps={{
              options,
              name: 'organization_type',
              className: classes.select,
              defaultValue: 'all',
              onChange: (_, { value }) => {
                this.handleFilterProgress(value);
              },
            }}
          />
        </div>
      </div>
    );
  }
}

export default Metrics;
