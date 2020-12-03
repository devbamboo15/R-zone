import * as React from 'react';
import { Route } from 'react-router-dom';
import cx from 'classnames';
import ProgramSvg from 'src/assets/icons/programs.svg';
import PlusButtonSvg from 'src/assets/icons/plus.svg';
import { Accordion, Table as BaseTable } from 'semantic-ui-react';
import Button, { ButtonColor, ButtonType } from 'src/components/Button';
import Heading, { HeadingType, HeadingColor } from 'src/components/Heading';
import URL from 'src/helpers/urls';
import { formatNumber } from 'src/helpers/number';
import { IProgram } from 'src/store/types/organizer/program';
import Spinner from 'src/components/Spinner';
import idx from 'idx';
import debounce from 'lodash/debounce';
import { IUpdateProgramData } from 'src/api';
import find from 'lodash/find';
import get from 'lodash/get';
import Footer from 'src/components/Footer';
import OutReachEmailModal from 'src/components/Modal/OutReachEmailModal';
import Placeholder from 'src/components/Placeholder';
import NoOrganizationModal from 'src/components/Modal/NoOrganizationModal';
// import PreviewEmailModal from 'src/components/Modal/PreviewEmailModal';
import InfiniteScroll from 'react-infinite-scroller';
import WelcomeModal from 'src/components/Modal/WelcomeModal';
import CreateProgram from './CreateProgram';
import AdvanceProgramCreator from './AdvanceProgramCreator';
import TopHeader from './TopHeader';
import ProgramRow from './ProgramRow';
import Awards from './Awards';
import LeaderBoard from './LeaderBoard';

export type ProgramsProps = IScreenProps & {
  programs: IProgram[];
  programsLoading: boolean;
  deleteProgram: Function;
  updateProgram: Function;
  getAllPrograms: Function;
  deleteProgramData: { [id: string]: IReduxOperationRequest };
  updateProgramData: { [id: string]: IReduxOperationRequest };
  searchPrograms: Function;
  resetSearchPrograms: Function;
  getOrganizationProgress?: Function;
  programsWithIncluded?: any;
  searchText: string;
  setSearchText: Function;
  setFirstPayment: Function;
  searchProgramsText: string;
  direction?: boolean;
  sortColumn?: string;
  setDirection?: Function;
  setSortColumn?: Function;
  onSortPrograms?: Function;
  programCodeLoading: boolean;
  firstPayment: boolean;
  organizationId: any;
  userAccessProgram: any;
  programsMorePage: boolean;
  createProgramAdvanceSuccess: boolean;
  createProgramSuccess: boolean;
  totalPrograms?: number;
  programsReset: boolean;
};

interface ProgramState {
  activeIndex: string;
  isOpenOutReachEmailModal: boolean;
  isOpenPreviewEmailModal: boolean;
  isLoadMore: boolean;
  page: number;
  isAdvanceFirst: boolean;
}

class Programs extends React.Component<ProgramsProps, ProgramState> {
  state = {
    activeIndex: '',
    isOpenOutReachEmailModal: false,
    isOpenPreviewEmailModal: false,
    isLoadMore: false,
    page: 0,
    isAdvanceFirst: false,
  };

  isAdvanceEditorUrl = pathname => {
    return (pathname || '').includes('/organizer/programs/advanced/');
  };

  componentDidMount() {
    this.props.resetSearchPrograms();
    const pathname = get(this.props, 'history.location.pathname', '');
    if (this.isAdvanceEditorUrl(pathname)) {
      this.props.getAllPrograms();
      this.setState({
        isAdvanceFirst: true,
      });
    } else {
      this.initPrograms();
    }
  }

  componentDidUpdate(prevProps: ProgramsProps) {
    const { isAdvanceFirst } = this.state;
    const {
      createProgramAdvanceSuccess,
      createProgramSuccess,
      programsReset,
    } = this.props;
    const pathname = get(this.props, 'history.location.pathname', '');
    if (pathname === '/organizer/programs' && isAdvanceFirst) {
      this.initPrograms();
      this.setState({
        isAdvanceFirst: false,
      });
    }
    if (
      (createProgramAdvanceSuccess &&
        prevProps.createProgramAdvanceSuccess !==
          createProgramAdvanceSuccess) ||
      (createProgramSuccess &&
        prevProps.createProgramSuccess !== createProgramSuccess)
    ) {
      // this.initPrograms();
    }

    if (programsReset) this.initPrograms();
    else this.checkLoadMore();
  }

  initPrograms = () => {
    const { onSortPrograms } = this.props;
    this.setState({
      isLoadMore: false,
      page: 1,
    });
    onSortPrograms(0, false);
  };

  setIsOpenOutReachEmailModal = isOpenOutReachEmailModal => {
    this.setState({ isOpenOutReachEmailModal });
  };

  handleSearch = debounce((text: string) => {
    if (text) {
      this.props.searchPrograms(text);
    } else {
      this.props.resetSearchPrograms();
    }
  }, 500);

  onDeleteProgramClick = (id: string) => {
    this.props.deleteProgram(id);
  };

  onUpdateProgramClick = (
    id: string,
    data: IUpdateProgramData,
    cb?: Function
  ) => {
    this.props.updateProgram(id, data, cb);
  };

  handleSort = column => () => {
    const { direction, sortColumn, setDirection, setSortColumn } = this.props;
    if (sortColumn !== column) {
      setSortColumn(column, () => {
        setDirection(true, () => {
          this.initPrograms();
        });
      });
    } else {
      setDirection(!direction, () => {
        this.initPrograms();
      });
    }
  };

  checkLoadMore = () => {
    const { programsLoading } = this.props;
    const bodyElement = document.body;
    if (
      !programsLoading &&
      bodyElement.scrollHeight <= bodyElement.clientHeight
    ) {
      this.loadMoreItems();
    }
  };

  loadMoreItems = () => {
    const { page } = this.state;
    const { programsMorePage } = this.props;
    if (programsMorePage) {
      this.props.onSortPrograms(page, page !== 0);
      this.setState({
        isLoadMore: true,
        page: page + 1,
      });
    }
  };

  openPreviewEmailModal = () => {
    this.setState({
      isOpenPreviewEmailModal: true,
    });
  };

  closePreviewEmailModal = () => {
    this.setState({
      isOpenPreviewEmailModal: false,
    });
  };

  render() {
    const {
      classes,
      programs,
      programsLoading,
      deleteProgramData,
      updateProgramData,
      setSearchText,
      searchText,
      programsWithIncluded,
      getAllPrograms,
      searchProgramsText,
      sortColumn,
      direction,
      programCodeLoading,
      organizationId,
      firstPayment,
      setFirstPayment,
      userAccessProgram,
      programsMorePage,
      totalPrograms,
    } = this.props;
    const { activeIndex, isLoadMore } = this.state;

    return (
      <div className={classes.programsPage}>
        {/* No Organization Infomation Modal */}
        {firstPayment && (
          <WelcomeModal
            modelProps={{
              open: true,
              centered: false,
              dimmer: 'inverted',
            }}
            action="Create new Program"
            onClose={() => {
              setFirstPayment(false);
            }}
          />
        )}
        {!organizationId && !firstPayment && (
          <NoOrganizationModal
            modelProps={{
              open: true,
              centered: false,
              dimmer: 'inverted',
            }}
            action="Create new Program"
          />
        )}
        <TopHeader
          searchInputProps={{
            inputProps: {
              placeholder: 'Search Program',
              icon: 'search',
              value: searchText,
              onChange: (_, { value }) => {
                setSearchText(value);
                this.handleSearch(value);
              },
            },
          }}
          titleProps={{
            icon: <ProgramSvg height={25} />,
            classes: {
              titleContainer: classes.programTitle,
            },
          }}
          title="Programs"
        />

        <div className={classes.tableWrapper}>
          <BaseTable
            sortable
            padded
            className={cx(classes.tableContainerMark, classes.sortTable)}>
            <BaseTable.Header>
              <BaseTable.Row className={classes.tableStyles.table_row}>
                <BaseTable.HeaderCell
                  sorted={
                    sortColumn !== 'name'
                      ? null
                      : direction
                      ? 'ascending'
                      : 'descending'
                  }
                  onClick={this.handleSort('name')}
                  width={4}
                  className={classes.tableStyles.table_header_row}>
                  Program Name
                </BaseTable.HeaderCell>
                <BaseTable.HeaderCell
                  width={1}
                  sorted={
                    sortColumn !== 'total_readers'
                      ? null
                      : direction
                      ? 'ascending'
                      : 'descending'
                  }
                  onClick={this.handleSort('total_readers')}
                  className={classes.tableStyles.table_header_row}>
                  Readers
                </BaseTable.HeaderCell>
                <BaseTable.HeaderCell
                  width={2}
                  sorted={
                    sortColumn !== 'reading_log'
                      ? null
                      : direction
                      ? 'ascending'
                      : 'descending'
                  }
                  onClick={this.handleSort('reading_log')}
                  className={classes.tableStyles.table_header_row}>
                  Type
                </BaseTable.HeaderCell>
                <BaseTable.HeaderCell
                  width={6}
                  className={classes.tableStyles.table_header_row}>
                  Completion Progress
                </BaseTable.HeaderCell>
                <BaseTable.HeaderCell
                  width={null}
                  className={cx(
                    classes.tableStyles.table_header_row,
                    classes.totalHeader
                  )}>
                  Total Programs:{' '}
                  <span className={classes.readerText}>
                    {formatNumber(totalPrograms)}
                  </span>
                </BaseTable.HeaderCell>
              </BaseTable.Row>
            </BaseTable.Header>
          </BaseTable>
          {programsLoading && !isLoadMore ? (
            <Spinner />
          ) : (
            <Accordion styled className={classes.accordianContainer} fluid>
              {programs.length <= 0 &&
              !searchProgramsText &&
              !programsLoading ? (
                <Placeholder>
                  <h2>
                    Welcome! <br /> With your new account, you can create
                    amazing reading programs.
                  </h2>
                  <p>
                    The next steps will set up a reading program, reading groups
                    and reading goals. it will take less than five minutes
                  </p>
                  {userAccessProgram.owner && (
                    <Button
                      colorVariant={ButtonColor.PRIMARY}
                      icon={<PlusButtonSvg height={20} />}
                      buttonType={ButtonType.ROUND}
                      buttonProps={{
                        onClick: () => {
                          this.props.history.push(URL.CREATE_PROGRAM());
                        },
                      }}>
                      <Heading
                        headingProps={{ as: 'h5' }}
                        colorVariant={HeadingColor.WHITE}
                        type={HeadingType.BOLD_600}>
                        Add Program
                      </Heading>
                    </Button>
                  )}
                </Placeholder>
              ) : (
                <>
                  <InfiniteScroll
                    pageStart={0}
                    initialLoad={false}
                    loadMore={this.loadMoreItems}
                    useWindow
                    threshold={50}
                    hasMore={programsMorePage}>
                    {programs.map((program, index) => {
                      const included =
                        idx(programsWithIncluded, x => x.included) || [];
                      const progress = find(included, {
                        type: 'programProgress',
                        id: program.id,
                      });
                      const progressNumber: number =
                        get(
                          progress,
                          'attributes.intervalProgress.completed_interval_percentage'
                        ) || 0;
                      const readingLogProgress =
                        get(progress, 'attributes.total') || {};

                      return (
                        <ProgramRow
                          key={index}
                          program={program}
                          userAccessProgram={userAccessProgram}
                          history={this.props.history}
                          onPlusIconClick={id => {
                            this.setState({ activeIndex: id });
                          }}
                          isActive={activeIndex === program.id}
                          onDeleteProgram={this.onDeleteProgramClick}
                          isDeleting={idx(
                            deleteProgramData,
                            x => x[program.id].loading
                          )}
                          onUpdateProgram={this.onUpdateProgramClick}
                          isUpdating={idx(
                            updateProgramData,
                            x => x[program.id].loading
                          )}
                          completionProgress={progressNumber}
                          readingLogProgress={readingLogProgress}
                          getAllPrograms={getAllPrograms}
                        />
                      );
                    })}
                  </InfiniteScroll>
                  <>{programsLoading && isLoadMore && <Spinner />}</>
                </>
              )}
            </Accordion>
          )}
        </div>
        <Footer position="fixed">
          <div className="bottomBar">
            <div className={classes.buttonContainer}>
              {/* <Button
                buttonProps={{
                  disabled: false,
                  primary: false,
                  onClick: this.openPreviewEmailModal,
                }}
                colorVariant={ButtonColor.DANGER}
                icon={<InviteWhiteSvg height={20} />}
                buttonType={ButtonType.ROUND}>
                <Heading
                  headingProps={{ as: 'h5' }}
                  colorVariant={HeadingColor.WHITE}
                  type={HeadingType.BOLD_600}>
                  Preview Email
                </Heading>
              </Button> */}
              <Button
                colorVariant={ButtonColor.PRIMARY_COLOR}
                icon={<PlusButtonSvg height={20} />}
                buttonType={ButtonType.ROUND}
                buttonProps={{
                  onClick: () => this.setIsOpenOutReachEmailModal(true),
                }}>
                <Heading
                  headingProps={{ as: 'h5' }}
                  colorVariant={HeadingColor.WHITE}
                  type={HeadingType.BOLD_600}>
                  Email Users
                </Heading>
              </Button>
              {userAccessProgram.owner && (
                <Button
                  colorVariant={ButtonColor.PRIMARY}
                  icon={<PlusButtonSvg height={20} />}
                  buttonType={ButtonType.ROUND}
                  buttonProps={{
                    onClick: () => {
                      this.props.history.push(URL.CREATE_PROGRAM());
                    },
                    disabled: programCodeLoading,
                  }}>
                  <Heading
                    headingProps={{ as: 'h5' }}
                    colorVariant={HeadingColor.WHITE}
                    type={HeadingType.BOLD_600}>
                    Add Program
                  </Heading>
                </Button>
              )}
            </div>
          </div>
        </Footer>
        {/* CREATE PROGRAM MODAL */}
        <Route path={URL.CREATE_PROGRAM()} component={CreateProgram} exact />
        {/* CREATE PROGRAM ADVANCED */}
        <Route
          path={URL.CREATE_PROGRAM_ADVANCED()}
          component={AdvanceProgramCreator}
          exact
        />
        {/* UPDATE PROGRAM ADVANCED */}
        <Route
          path={URL.UPDATE_PROGRAM_ADVANCED()}
          component={AdvanceProgramCreator}
          exact
        />
        {/* AWARD */}
        <Route path={URL.PROGRAMS_AWARDS()} component={Awards} exact />
        {/* LEADERBOARD */}
        <Route
          path={URL.PROGRAMS_LEADERBOARD()}
          component={LeaderBoard}
          exact
        />
        {/* OutReachEmailModal */}
        <OutReachEmailModal
          modelProps={{
            open: this.state.isOpenOutReachEmailModal,
            size: 'small',
            onClose: () => this.setIsOpenOutReachEmailModal(false),
          }}
          onCancel={() => this.setIsOpenOutReachEmailModal(false)}
        />
        {/* <PreviewEmailModal
          modelProps={{
            open: this.state.isOpenPreviewEmailModal,
            size: 'small',
            onClose: this.closePreviewEmailModal,
          }}
          onCancel={this.closePreviewEmailModal}
        /> */}
      </div>
    );
  }
}

export default Programs;
