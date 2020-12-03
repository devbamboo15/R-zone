import * as React from 'react';
import Modal from 'src/components/Modal';
import MedalSvg from 'src/assets/icons/medal2.svg';
import Title from 'src/components/Title';
import Input from 'src/components/FormFields/Input';
import Select from 'src/components/FormFields/Select';
import DateRangePicker from 'src/components/DateRangePicker';
import { Grid } from 'semantic-ui-react';
import Spinner from 'src/components/Spinner';
import debounce from 'lodash/debounce';
import get from 'lodash/get';
import * as moment from 'moment';

export type Props = IScreenProps & {
  leaderboard: any[];
  leaderboardLoading: boolean;
  getProgramLeaderboard: Function;
  getGroupLeaderboard: Function;
};

interface IStates {
  datetime: any;
  searchTxt: string;
}
interface IFilter {
  q?: string;
  interval?: string;
  start_date?: string;
  end_date?: string;
}

class LeaderBoard extends React.Component<Props, IStates> {
  state = {
    searchTxt: '',
    datetime: {
      interval: 'all',
      range: {
        startDate: moment(),
        endDate: moment(),
      },
    },
  };

  handleSearch = debounce(() => {
    this.handleFilter();
  }, 500);

  handleFilter = () => {
    const { match } = this.props;
    const programId = get(match, 'params.programId');
    const groupId = get(match, 'params.groupId');
    const { datetime, searchTxt } = this.state;
    const interval = get(datetime, 'interval');
    const rangeStartDate = get(datetime, 'range.startDate');
    const rangeEndDate = get(datetime, 'range.endDate');
    const filter: IFilter = {};
    if (searchTxt) {
      filter.q = searchTxt;
    }
    if (interval !== 'none') {
      filter.interval =
        interval === 'all' ? 'overall' : `last_${interval}_days`;
    } else {
      filter.start_date = moment(rangeStartDate).format('YYYY-MM-DD');
      filter.end_date = moment(rangeEndDate).format('YYYY-MM-DD');
    }
    if (groupId) {
      this.props.getGroupLeaderboard(programId, groupId, filter);
    } else {
      this.props.getProgramLeaderboard(programId, filter);
    }
  };

  render() {
    const { classes, history, leaderboard, leaderboardLoading } = this.props;
    const { datetime } = this.state;
    const interval = get(datetime, 'interval');
    const rangeStartDate = get(datetime, 'range.startDate');
    const rangeEndDate = get(datetime, 'range.endDate');
    return (
      <Modal
        modelProps={{
          open: true,
          closeIcon: true,
          size: 'large',
          onClose: () => {
            history.goBack();
          },
        }}>
        <Title icon={<MedalSvg height={25} />}>Leaderboard</Title>
        <Grid className={classes.filterArea}>
          <Grid.Column width={3}>
            <Select
              label="Show"
              selectProps={{
                defaultValue: interval,
                options: [
                  {
                    text: 'Custom Date',
                    value: 'none',
                  },
                  {
                    text: 'Last Week',
                    value: '7',
                  },
                  {
                    text: 'Last Month',
                    value: '30',
                  },
                  {
                    text: 'All Time',
                    value: 'all',
                  },
                ],
                onChange: (_, { value }) => {
                  const oldDatetime = this.state.datetime;
                  this.setState(
                    {
                      datetime: {
                        ...oldDatetime,
                        interval: value,
                      },
                    },
                    () => {
                      this.handleFilter();
                    }
                  );
                },
              }}
            />
          </Grid.Column>
          <Grid.Column width={5}>
            <DateRangePicker
              startDate={rangeStartDate}
              endDate={rangeEndDate}
              onDatesChange={({ startDate, endDate }) => {
                const oldDatetime = this.state.datetime;
                this.setState(
                  {
                    datetime: {
                      ...oldDatetime,
                      range: {
                        startDate,
                        endDate: endDate || startDate,
                      },
                    },
                  },
                  () => {
                    this.handleFilter();
                  }
                );
              }}
              label="Select Period"
            />
          </Grid.Column>
          <Grid.Column floated="right" width={3}>
            <div className={classes.searchField}>
              <Input
                label="Search"
                inputProps={{
                  icon: 'search',
                  placeholder: 'Search',
                  onChange: (_, { value }) => {
                    this.setState(
                      {
                        searchTxt: value,
                      },
                      () => {
                        this.handleSearch();
                      }
                    );
                  },
                }}
              />
            </div>
          </Grid.Column>
        </Grid>
        {leaderboardLoading ? (
          <Spinner />
        ) : (
          <div className={classes.readerWrapper}>
            <div className={classes.leaderboardContainer}>
              {leaderboard.map((item, index) => {
                const name = get(item, 'name');
                return (
                  <div key={index} className={classes.leaderboardItem}>
                    <div className={classes.reader}>
                      <div className={classes.readerIndex}>
                        {`00${index + 1}`.slice(-2)}
                      </div>
                      <div className={classes.readerName}>{name}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </Modal>
    );
  }
}

export default LeaderBoard;
