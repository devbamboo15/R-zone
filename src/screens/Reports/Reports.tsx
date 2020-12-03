import * as React from 'react';
import { get, debounce } from 'lodash';
import { RouteComponentProps } from 'react-router-dom';
import ReportsSvg from 'src/assets/icons/reports.svg';
import { Grid } from 'semantic-ui-react';
// import Spinner from 'src/components/Spinner';
import { IOrganizetionProgress } from 'src/store/types/organizer/organizations';
import { IProgram } from 'src/store/types/organizer/program';
import { IOrganizerGroupItem } from 'src/store/types/organizer/group';
import { IReaderItem } from 'src/store/types/common';

import * as moment from 'moment';
import { exportReport } from 'src/api';
import idx from 'idx';
import Toast from 'src/helpers/Toast';
import NoOrganizationModal from 'src/components/Modal/NoOrganizationModal';
import TopHeader from './TopHeader';
import Filter from './Filter';
import ActivityFeed from './ActivityFeed';
import Overview from './Overview';
import Totals from './Totals';
import Exports from './Exports';

interface IFilterOverviewsAndFeedsDataRequest {
  programs?: string;
  groups?: string;
  readers?: string;
  start_date?: string;
  end_date?: string;
  interval?: string;
  program_no_entry?: number;
  program_no_user?: number;
  group_no_entry?: number;
  group_no_user?: number;
  is_goal_completed?: number;
  reader_no_entry?: number;
  reader_no_user?: number;
  program_type?: number;
  group_metric_type?: string;
  page?: number;
  isMore?: boolean;
  is_user_address_shown?: number;
  is_user_library_card_number_shown?: number;
  is_user_birthday_shown?: number;
  is_user_school_shown?: number;
  is_user_grade_level_shown?: number;
}

export type ReportsProps = IComponentProps &
  RouteComponentProps & {
    getAllFeeds: Function;
    getOverviews: Function;
    getOrganizationProgress: Function;
    getAllPrograms: Function;
    getAllOrganizerGroups: Function;
    getListReaders: Function;
    feeds: any;
    overviews: any;
    organizationProgress: IOrganizetionProgress;
    filterTime: number;
    programs?: IProgram[];
    groups: IOrganizerGroupItem[];
    readers: IReaderItem[];
    getAllReadersWithoutPagination: Function;
    allReaders: any[];
    metricsLoading: boolean;
    overviewsLoading: boolean;
    feedsLoading: boolean;
    organizationId: string;
    getMultipleUserQuestions: Function;
  };

interface ReportsState {
  displays: {
    activity: boolean;
    overview: boolean;
    totals: boolean;
  };
  isShowMoreFilter: boolean;
  filterData: any;
  metricsFilterTime: string | number;
  feedPage: number;
  overviewPage: number;
  exportingReport: undefined | string | null;
}

class Reports extends React.Component<ReportsProps, ReportsState> {
  state = {
    displays: {
      activity: true,
      overview: true,
      totals: true,
    },
    isShowMoreFilter: false,
    filterData: {},
    metricsFilterTime: '7',
    feedPage: 1,
    overviewPage: 1,
    exportingReport: null,
  };

  componentDidMount() {
    const {
      getAllFeeds,
      getOrganizationProgress,
      getAllPrograms,
      getAllOrganizerGroups,
      getOverviews,
      getAllReadersWithoutPagination,
    } = this.props;
    getAllFeeds();
    getOverviews();
    getOrganizationProgress(null, null);
    getAllPrograms();
    getAllOrganizerGroups();
    getAllReadersWithoutPagination();
  }

  handleToggleDisplay = (field: string, status: boolean) => {
    this.setState(prevState => ({
      displays: {
        ...prevState.displays,
        [field]: status,
      },
    }));
  };

  toggleFilters = () => {
    this.setState(prevState => ({
      isShowMoreFilter: !prevState.isShowMoreFilter,
    }));
  };

  calculatorColumnWidth = (column: string) => {
    let width;
    const { displays } = this.state;

    switch (column) {
      case 'activity':
        if (
          get(displays, 'activity') &&
          get(displays, 'overview') &&
          get(displays, 'totals')
        ) {
          width = 6;
        } else if (!get(displays, 'overview') && get(displays, 'totals')) {
          width = 12;
        } else if (
          get(displays, 'activity') &&
          get(displays, 'overview') &&
          !get(displays, 'totals')
        ) {
          width = 8;
        } else {
          width = 16;
        }
        break;
      case 'overview':
        if (
          get(displays, 'activity') &&
          get(displays, 'overview') &&
          get(displays, 'totals')
        ) {
          width = 6;
        } else if (!get(displays, 'activity') && get(displays, 'totals')) {
          width = 12;
        } else if (
          get(displays, 'activity') &&
          get(displays, 'overview') &&
          !get(displays, 'totals')
        ) {
          width = 8;
        } else {
          width = 16;
        }
        break;
      default:
        if (!get(displays, 'activity') && !get(displays, 'overview')) {
          width = 16;
        } else {
          width = 4;
        }
        break;
    }
    return width;
  };

  handleChangeFilter = filterData => {
    this.setState({ filterData });
  };

  getFilterRequestData = (page?: number, isMore?: boolean) => {
    const { filterData } = this.state;
    const parentOption = get(filterData, 'parentOption');
    const programsFilter = get(filterData, 'programsFilter');
    const programCondition = get(filterData, 'programCondition');
    const programSort = get(filterData, 'programSort');
    const programSortType = get(programSort, 'type');

    const groupCondition = get(filterData, 'groupCondition');
    const groupSort = get(filterData, 'groupSort') || [];
    const groupSortMetric = get(groupSort, 'metric');

    const readerCondition = get(filterData, 'readerCondition');

    const dateFilter = get(filterData, 'dateFilter');
    const programs = get(programsFilter, 'program') || [];
    const groups = get(programsFilter, 'group') || [];
    const readers = get(programsFilter, 'reader') || [];
    const customDate = get(dateFilter, 'customDate') || {};
    const customDateValue = get(customDate, 'value') || 'none';
    const dateRange = get(dateFilter, 'range') || {};
    const startDate = get(dateRange, 'startDate')
      ? moment(get(dateRange, 'startDate')).format('YYYY-MM-DD')
      : moment().format('YYYY-MM-DD');
    const endDate = get(dateRange, 'endDate')
      ? moment(get(dateRange, 'endDate')).format('YYYY-MM-DD')
      : moment().format('YYYY-MM-DD');
    let filterOverviewsAndFeedsDataRequest: IFilterOverviewsAndFeedsDataRequest = {
      programs,
      groups,
      readers,
      page: page || 1,
      isMore: isMore || false,
    };
    switch (parentOption) {
      case 'program': {
        filterOverviewsAndFeedsDataRequest = {
          ...filterOverviewsAndFeedsDataRequest,
          program_no_entry: programCondition === 'no_entries' ? 1 : 0,
          program_no_user: programCondition === 'no_users' ? 1 : 0,
        };
        if (
          programSortType !== 4 &&
          programSortType !== '4' &&
          programSortType !== ''
        ) {
          filterOverviewsAndFeedsDataRequest = {
            ...filterOverviewsAndFeedsDataRequest,
            program_type: programSortType,
          };
        }
        break;
      }
      case 'group': {
        filterOverviewsAndFeedsDataRequest = {
          ...filterOverviewsAndFeedsDataRequest,
          group_no_entry: groupCondition === 'no_entries' ? 1 : 0,
          group_no_user: groupCondition === 'no_users' ? 1 : 0,
        };
        if (groupSortMetric !== 'none' && groupSortMetric !== '') {
          filterOverviewsAndFeedsDataRequest = {
            ...filterOverviewsAndFeedsDataRequest,
            group_metric_type: groupSortMetric,
          };
        }
        break;
      }
      case 'reader': {
        filterOverviewsAndFeedsDataRequest = {
          ...filterOverviewsAndFeedsDataRequest,
          reader_no_entry: readerCondition === 'no_entries' ? 1 : 0,
          reader_no_user: readerCondition === 'no_users' ? 1 : 0,
          is_goal_completed: readerCondition === 'complete_goal' ? 1 : 0,
        };
        break;
      }
      case 'date': {
        if (customDateValue === 'none') {
          filterOverviewsAndFeedsDataRequest = {
            ...filterOverviewsAndFeedsDataRequest,
            start_date: startDate,
            end_date: endDate,
          };
        } else {
          filterOverviewsAndFeedsDataRequest = {
            ...filterOverviewsAndFeedsDataRequest,
            interval:
              customDateValue === 'all'
                ? `overall`
                : `last_${customDateValue}_days`,
          };
        }
        break;
      }
      default:
    }
    filterOverviewsAndFeedsDataRequest = {
      ...filterOverviewsAndFeedsDataRequest,
      is_user_address_shown: 1,
      is_user_birthday_shown: 1,
      is_user_library_card_number_shown: 1,
      is_user_grade_level_shown: 1,
      is_user_school_shown: 1,
      // is_user_address_shown:
      //   get(filterData, 'questionFilter.address', false) &&
      //   get(filterData, 'questionFilterShow.address', false)
      //     ? 1
      //     : 0,
      // is_user_birthday_shown:
      //   get(filterData, 'questionFilter.birthday', false) &&
      //   get(filterData, 'questionFilterShow.birthday', false)
      //     ? 1
      //     : 0,
      // is_user_library_card_number_shown:
      //   get(filterData, 'questionFilter.library_card_number', false) &&
      //   get(filterData, 'questionFilterShow.library_card_number', false)
      //     ? 1
      //     : 0,
      // is_user_grade_level_shown:
      //   get(filterData, 'questionFilter.grade_level', false) &&
      //   get(filterData, 'questionFilterShow.grade_level', false)
      //     ? 1
      //     : 0,
      // is_user_school_shown:
      //   get(filterData, 'questionFilter.school', false) &&
      //   get(filterData, 'questionFilterShow.school', false)
      //     ? 1
      //     : 0,
    };
    return filterOverviewsAndFeedsDataRequest;
  };

  handleFilterData = (loadType?: string, page?: number, isMore?: boolean) => {
    const { getOverviews, getAllFeeds, getOrganizationProgress } = this.props;
    const filterOverviewsAndFeedsDataRequest = this.getFilterRequestData(
      page,
      isMore
    );
    this.setState({
      feedPage: page || 1,
    });
    if (loadType) {
      if (loadType === 'feed') {
        getAllFeeds(filterOverviewsAndFeedsDataRequest);
      } else if (loadType === 'overview') {
        getOverviews(filterOverviewsAndFeedsDataRequest);
      }
    } else {
      getOverviews(filterOverviewsAndFeedsDataRequest);
      getAllFeeds(filterOverviewsAndFeedsDataRequest);
      getOrganizationProgress(null, null, filterOverviewsAndFeedsDataRequest);
    }
  };

  handleLoadMoreFeed = debounce(() => {
    const { feedPage } = this.state;
    const newFeedPage = feedPage + 1;
    this.handleFilterData('feed', newFeedPage, true);
  }, 20);

  handleLoadMoreOverview = debounce(() => {
    const { overviewPage } = this.state;
    const newOverviewPage = overviewPage + 1;
    this.handleFilterData('overview', newOverviewPage, true);
  }, 20);

  downloadFile = (url: string) => {
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('target', '_blank');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  onExportReport = async (exportType: 'overview' | 'activity' | 'all') => {
    try {
      this.setState({ exportingReport: exportType });
      Toast.info('We are processing your request, it may take a while...');
      const filterData = this.getFilterRequestData();
      delete filterData.page;
      delete filterData.isMore;
      const data = await exportReport(
        this.props.organizationId,
        exportType,
        filterData
      );
      this.setState({ exportingReport: null });
      if (idx(data, x => x.data.file)) {
        this.downloadFile(idx(data, x => x.data.file));
      } else {
        Toast.dismiss();
        Toast.error('File is empty');
      }
    } catch (error) {
      this.setState({ exportingReport: null });
    }
  };

  render() {
    const {
      classes,
      feeds,
      organizationProgress,
      programs,
      groups,
      overviews,
      allReaders,
      metricsLoading,
      overviewsLoading,
      feedsLoading,
      organizationId,
      getMultipleUserQuestions,
    } = this.props;
    const { displays, isShowMoreFilter } = this.state;
    return (
      <div>
        {/* No Organization Infomation Modal */}
        {!organizationId && (
          <NoOrganizationModal
            modelProps={{
              open: true,
              centered: false,
              dimmer: 'inverted',
            }}
            action="View Report"
          />
        )}
        <TopHeader
          handleToggleDisplay={this.handleToggleDisplay}
          titleProps={{
            icon: <ReportsSvg height={25} />,
          }}
          title="Reports"
          values={displays}
        />
        <Filter
          isShowMoreFilter={isShowMoreFilter}
          toggleFilters={this.toggleFilters}
          programs={programs}
          groups={groups}
          readers={allReaders}
          onChangeFilter={this.handleChangeFilter}
          onSubmitFilter={this.handleFilterData}
          buttonLoading={metricsLoading || overviewsLoading || feedsLoading}
          getUserQuestions={getMultipleUserQuestions}
        />
        <Grid className={classes.content}>
          {/* {(metricsLoading || overviewsLoading || feedsLoading) && <Spinner />} */}
          <Grid.Row>
            {displays.activity && (
              <Grid.Column width={this.calculatorColumnWidth('activity')}>
                <ActivityFeed
                  timeLines={feeds}
                  onLoadMoreFeed={this.handleLoadMoreFeed}
                  feedsLoading={feedsLoading}
                />
              </Grid.Column>
            )}
            {displays.overview && (
              <Grid.Column width={this.calculatorColumnWidth('overview')}>
                <Overview
                  overviews={overviews}
                  onLoadMoreOverview={this.handleLoadMoreOverview}
                  overviewsLoading={overviewsLoading}
                />
              </Grid.Column>
            )}
            {displays.totals && (
              <Grid.Column width={this.calculatorColumnWidth('totals')}>
                <Totals totals={organizationProgress} />
              </Grid.Column>
            )}
          </Grid.Row>
        </Grid>
        <Exports
          displays={displays}
          onExportReport={this.onExportReport}
          exportingReport={this.state.exportingReport}
        />
      </div>
    );
  }
}

export default Reports;
