import * as React from 'react';
import { Route } from 'react-router-dom';
import cx from 'classnames';
import GroupSvg from 'src/assets/icons/groups.svg';
import PlusButtonSvg from 'src/assets/icons/plus.svg';
import MedalSvg from 'src/assets/icons/medal.svg';
import EditorSvg from 'src/assets/icons/editor.svg';
import { Accordion, Table as BaseTable } from 'semantic-ui-react';
import Button, { ButtonColor, ButtonType } from 'src/components/Button';
import Heading, { HeadingType, HeadingColor } from 'src/components/Heading';
import URL from 'src/helpers/urls';
import { formatNumber } from 'src/helpers/number';
import debounce from 'lodash/debounce';
import { IProgram } from 'src/store/types/organizer/program';
import Spinner from 'src/components/Spinner';
import idx from 'idx';
import { CombinedGroupData } from 'src/api';
import { IOrganizerGroup } from 'src/store/types/common';
import get from 'lodash/get';
import GroupBookBankModal from 'src/components/Modal/GroupBookBankModal';
import Footer from 'src/components/Footer';
import AddBooksModal, {
  AddBooksType,
} from 'src/components/Modal/AddBooksModal';
import InfiniteScroll from 'react-infinite-scroller';
import { IBookItem } from 'src/store/types';
import findIndex from 'lodash/findIndex';
import filter from 'lodash/filter';
import { confirmModal } from 'src/components/Modal/ConfirmationModal';
import Placeholder from 'src/components/Placeholder';
import LeaderBoard from '../LeaderBoard';
import TopHeader from '../TopHeader';
import CreateGroup from '../CreateGroup';
import GroupRow from './GroupRow';
import AdvanceProgramCreator from '../AdvanceProgramCreator';
import Awards from '../Awards';

export type GroupsProps = IScreenProps & {
  groups: IOrganizerGroup[];
  groupsLoading: boolean;
  deleteGroupData: { [id: string]: IReduxOperationRequest };
  deleteGroupInProgram: Function;
  program: IProgram;
  updateCombinedGroup: Function;
  updateGroupData: { [id: string]: IReduxOperationRequest };
  searchText: string;
  setSearchText: Function;
  getAllProgramGroups: Function;
  searchGroups: Function;
  resetSearchGroups: Function;
  onUpdateBook: Function;
  searchGroupsState: string;
  direction?: boolean;
  sortColumn?: string;
  setDirection?: Function;
  setSortColumn?: Function;
  onSortGroups?: Function;
  userAccessProgram: any;
  groupsMorePage: boolean;
  createProgramGroupsLoading: boolean;
  numberUpward?: number;
  totalGroups?: number;
};

interface GroupState {
  activeIndex: string;
  groupBookBankModalOpen: boolean;
  books: any[];
  addBookModalOpen: boolean;
  groupId: string;
  selectedGroup: any;
  selectedBookId: string;
  page: number;
  isLoadMore: boolean;
  isAdvanceFirst: boolean;
}
class Groups extends React.Component<GroupsProps, GroupState> {
  state = {
    activeIndex: '',
    groupBookBankModalOpen: false,
    books: [],
    addBookModalOpen: false,
    groupId: '',
    selectedGroup: {},
    selectedBookId: '',
    page: 0,
    isLoadMore: false,
    isAdvanceFirst: false,
  };

  isAdvanceEditorUrl = pathname => {
    return (pathname || '').includes('/groups/advanced');
  };

  componentDidMount() {
    const pathname = get(this.props, 'history.location.pathname', '');
    if (this.isAdvanceEditorUrl(pathname)) {
      this.setState({
        isAdvanceFirst: true,
      });
    } else {
      this.initGroups();
    }
  }

  componentDidUpdate(prevProps: GroupsProps) {
    const { createProgramGroupsLoading } = this.props;
    const { isAdvanceFirst } = this.state;
    if (
      !createProgramGroupsLoading &&
      prevProps.createProgramGroupsLoading !== createProgramGroupsLoading
    ) {
      this.initGroups();
    }
    const pathname = get(this.props, 'history.location.pathname', '');
    if (!this.isAdvanceEditorUrl(pathname) && isAdvanceFirst) {
      this.initGroups();
      this.setState({
        isAdvanceFirst: false,
      });
    }

    this.checkLoadMore();
  }

  checkLoadMore = () => {
    const { groupsLoading } = this.props;
    const bodyElement = document.body;
    if (
      !groupsLoading &&
      bodyElement.scrollHeight <= bodyElement.clientHeight
    ) {
      this.loadMoreItems();
    }
  };

  initGroups = () => {
    const { onSortGroups } = this.props;
    this.setState({
      isLoadMore: false,
      page: 1,
    });
    onSortGroups(0, false);
  };

  toggleAddBookModal = () => {
    this.setState(state => ({ addBookModalOpen: !state.addBookModalOpen }));
  };

  handleSearch = debounce((text: string) => {
    const programId = idx(this.props as any, x => x.match.params.programId);
    if (text) {
      this.props.searchGroups(programId, text);
    } else {
      this.props.resetSearchGroups(programId);
    }
  }, 500);

  handleClick = (e, titleProps) => {
    const { index } = titleProps;
    const { activeIndex } = this.state;
    const newIndex = activeIndex === index ? -1 : index;

    this.setState({ activeIndex: newIndex });
  };

  onDeleteGroup = (programId: string, groupId: string) => {
    this.props.deleteGroupInProgram(programId, groupId);
  };

  onUpdateGroup = (
    programId: string,
    groupId: string,
    data: CombinedGroupData
  ) => {
    this.props.updateCombinedGroup(programId, groupId, data);
  };

  closeGroupBookBankModal = () => {
    this.setState({
      groupBookBankModalOpen: false,
    });
  };

  openGroupBookBankModal = (bookCount: number, group: any) => {
    const groupBooks = group.books || [];
    const books = groupBooks.map(book => {
      return get(book, 'attributes.data') || book;
    });
    const groupId = get(group, 'id');
    this.setState({
      books,
      groupId,
      selectedGroup: group,
      groupBookBankModalOpen: true,
    });
  };

  onSelect = (book: IBookItem) => {
    const { onUpdateBook } = this.props;
    const { books, selectedGroup } = this.state;
    const index = findIndex(books, (item: IBookItem) => item.id === book.id);
    this.setState({ selectedBookId: book.id });
    if (index !== -1) {
      confirmModal.open({
        message: 'Are you sure you want to remove book',
        okButtonText: 'Remove',
        cancelButtonText: 'Cancel',
        onOkClick: () => {
          const newAddedBooks = filter(
            books,
            (item: IBookItem) => item.id !== book.id
          );
          onUpdateBook(newAddedBooks, selectedGroup, () => {
            this.setState({
              books: newAddedBooks,
            });
          });
        },
      });
    } else {
      const newAddedBooks = [...books, book];
      onUpdateBook(newAddedBooks, selectedGroup, () => {
        this.setState({
          books: newAddedBooks,
        });
      });
    }
  };

  handleSort = column => () => {
    const { direction, sortColumn, setDirection, setSortColumn } = this.props;
    if (sortColumn !== column) {
      setSortColumn(column, () => {
        setDirection(true, () => {
          this.initGroups();
        });
      });
    } else {
      setDirection(!direction, () => {
        this.initGroups();
      });
    }
  };

  loadMoreItems = () => {
    const { page } = this.state;
    const { groupsMorePage } = this.props;
    if (groupsMorePage) {
      this.props.onSortGroups(page, true);
      this.setState({
        isLoadMore: true,
        page: page + 1,
      });
    }
  };

  renderTableHeader = () => {
    const { classes, sortColumn, direction, totalGroups } = this.props;
    return (
      <BaseTable
        sortable
        padded
        className={cx(
          classes.tableContainerMark,
          classes.sortTable,
          classes.groupTableHeader
        )}>
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
              Group Name
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
              width={1}
              sorted={
                sortColumn !== 'active_metric_id'
                  ? null
                  : direction
                  ? 'ascending'
                  : 'descending'
              }
              onClick={this.handleSort('active_metric_id')}
              className={classes.tableStyles.table_header_row}>
              Metric
            </BaseTable.HeaderCell>
            <BaseTable.HeaderCell
              width={2}
              sorted={
                sortColumn !== 'status'
                  ? null
                  : direction
                  ? 'ascending'
                  : 'descending'
              }
              onClick={this.handleSort('status')}
              className={classes.tableStyles.table_header_row}>
              Status
            </BaseTable.HeaderCell>
            <BaseTable.HeaderCell
              width={6}
              className={classes.tableStyles.table_header_row}>
              Completion Progress
            </BaseTable.HeaderCell>
            <BaseTable.HeaderCell
              width={2}
              className={cx(
                classes.tableStyles.table_header_row,
                classes.totalHeader
              )}>
              Total Groups:{' '}
              <span className={classes.readerText}>
                {formatNumber(totalGroups)}
              </span>
            </BaseTable.HeaderCell>
          </BaseTable.Row>
        </BaseTable.Header>
      </BaseTable>
    );
  };

  render() {
    const {
      classes,
      history,
      groups,
      groupsLoading,
      deleteGroupData,
      program,
      updateGroupData,
      setSearchText,
      searchText,
      searchGroupsState,
      userAccessProgram,
      groupsMorePage,
      numberUpward,
    } = this.props;
    const groupsLength = groups.length;
    const { activeIndex, books, groupId, isLoadMore } = this.state;
    const programId = program.id;
    const readingLog: number = get(program, 'attributes.reading_log') || 0;
    const breadcrumbs = [
      {
        url: URL.PROGRAMS(),
        name: 'All Programs',
      },
      {
        url: '',
        name: idx(program, x => x.attributes.name),
      },
      {
        url: '',
        name: 'Groups',
      },
    ];
    const accessProgram = get(userAccessProgram, `program[${programId}]`, {});
    const accessGroupByProgram = get(
      userAccessProgram,
      `group_by_program[${programId}][${groupId}]`,
      {}
    );
    return (
      <div
        className={cx(
          classes.groupsPage,
          !readingLog && classes.goalBasedProgram
        )}>
        <TopHeader
          programId={programId}
          programCode={program.attributes.code}
          titleProps={{
            icon: <GroupSvg height={25} />,
            breadcrumbs,
          }}
          searchInputProps={{
            inputProps: {
              placeholder: 'Search Group',
              icon: 'search',
              value: searchText,
              onChange: (_, { value }) => {
                setSearchText(value);
                this.handleSearch(value);
              },
            },
          }}
          title="Groups"
        />
        <div className={classes.tableWrapper}>
          {this.renderTableHeader()}
          {groupsLoading && !isLoadMore ? (
            <Spinner />
          ) : (
            <Accordion
              styled
              className={cx(classes.accordianContainer, classes.groupTable)}
              fluid>
              {groups.length <= 0 && !searchGroupsState && !groupsLoading ? (
                <Placeholder customClass={classes.groupPlaceholder}>
                  <h2>This Reading Program needs Reading Groups!</h2>
                  <p>
                    In just a few minutes, you can create reading groups and
                    goals.
                  </p>
                  <Button
                    colorVariant={ButtonColor.PRIMARY}
                    icon={<PlusButtonSvg height={20} />}
                    buttonType={ButtonType.ROUND}
                    buttonProps={{
                      onClick: () => {
                        history.push(URL.CREATE_GROUP({ programId }));
                      },
                    }}>
                    <Heading
                      headingProps={{ as: 'h5' }}
                      colorVariant={HeadingColor.WHITE}
                      type={HeadingType.NORMAL}>
                      Add Group
                    </Heading>
                  </Button>
                </Placeholder>
              ) : (
                <>
                  <InfiniteScroll
                    pageStart={0}
                    initialLoad={false}
                    loadMore={this.loadMoreItems}
                    useWindow
                    threshold={50}
                    hasMore={groupsMorePage}>
                    {groups.map((group: IOrganizerGroup, index: number) => {
                      const completionProgress =
                        get(
                          group,
                          'progress.attributes.intervalProgress.completed_interval_percentage'
                        ) || 0;
                      const readingLogProgress =
                        get(group, 'progress.attributes.total') || {};
                      return (
                        <GroupRow
                          key={group.id}
                          group={group}
                          userAccessProgram={userAccessProgram}
                          onPlusIconClick={id => {
                            this.setState({ activeIndex: id });
                          }}
                          isActive={activeIndex === group.id}
                          history={history}
                          onDeleteGroup={this.onDeleteGroup}
                          isDeleting={idx(
                            deleteGroupData,
                            x => x[group.id].loading
                          )}
                          onUpdateGroup={this.onUpdateGroup}
                          isUpdating={idx(
                            updateGroupData,
                            x => x[group.id].loading
                          )}
                          completionProgress={completionProgress}
                          onOpenGroupBankModal={this.openGroupBookBankModal}
                          readingLog={readingLog}
                          readingLogProgress={readingLogProgress}
                          dropdownUpward={
                            numberUpward > 0 &&
                            index >= groupsLength - numberUpward
                          }
                        />
                      );
                    })}
                  </InfiniteScroll>
                  <>{groupsLoading && isLoadMore && <Spinner />}</>
                </>
              )}
            </Accordion>
          )}
        </div>
        <Footer position="fixed">
          <div className="bottomBar">
            <div className={classes.buttonContainerGroup}>
              <div className={classes.bottomButtonWrapper}>
                {accessProgram.write && (
                  <Button
                    colorVariant={ButtonColor.SECONDARY}
                    icon={<EditorSvg height={20} />}
                    buttonType={ButtonType.ROUND}
                    buttonProps={{
                      onClick: () => {
                        history.push(
                          URL.GROUPS_ADVANCED({
                            programId,
                          })
                        );
                      },
                    }}>
                    <Heading
                      headingProps={{ as: 'h5' }}
                      colorVariant={HeadingColor.WHITE}
                      type={HeadingType.NORMAL}>
                      Advanced Editor
                    </Heading>
                  </Button>
                )}
                {readingLog >= 2 && (
                  <Button
                    colorVariant={ButtonColor.YELLOW}
                    icon={<MedalSvg height={20} />}
                    buttonType={ButtonType.ROUND}
                    buttonProps={{
                      onClick: () => {
                        history.push(
                          URL.GROUPS_LEADERBOARD({
                            programId,
                          })
                        );
                      },
                    }}>
                    <Heading
                      headingProps={{ as: 'h5' }}
                      colorVariant={HeadingColor.WHITE}
                      type={HeadingType.NORMAL}>
                      Leaderboard
                    </Heading>
                  </Button>
                )}
              </div>
              {accessProgram.write && (
                <Button
                  colorVariant={ButtonColor.PRIMARY}
                  icon={<PlusButtonSvg height={20} />}
                  buttonType={ButtonType.ROUND}
                  buttonProps={{
                    onClick: () => {
                      history.push(URL.CREATE_GROUP({ programId }));
                    },
                  }}>
                  <Heading
                    headingProps={{ as: 'h5' }}
                    colorVariant={HeadingColor.WHITE}
                    type={HeadingType.NORMAL}>
                    Add Group
                  </Heading>
                </Button>
              )}
            </div>
          </div>
        </Footer>
        <GroupBookBankModal
          modelProps={{
            size: 'small',
            open: this.state.groupBookBankModalOpen,
            onClose: this.closeGroupBookBankModal,
            closeIcon: true,
          }}
          books={books}
          accessGroupByProgram={accessGroupByProgram}
          onAddBookClicked={this.toggleAddBookModal}
          onRemoveBook={(selectBook: IBookItem) => this.onSelect(selectBook)}
          loading={idx(updateGroupData, x => x[this.state.groupId].loading)}
          itemLoading={this.state.selectedBookId}
        />
        {/* Add book modal */}
        <AddBooksModal
          modelProps={{
            size: 'small',
            open: this.state.addBookModalOpen,
            onClose: this.toggleAddBookModal,
            closeIcon: true,
          }}
          onSelectBookWithGroup={(selectBook: IBookItem) =>
            this.onSelect(selectBook)
          }
          fromBookBankButton
          type={AddBooksType.reader}
          programId={programId}
          groupId={this.state.groupId}
          selectedBooks={books}
          loading={idx(updateGroupData, x => x[this.state.groupId].loading)}
          itemLoading={this.state.selectedBookId}
        />
        {/* LEADERBOARD MODAL */}
        <Route path={URL.GROUPS_LEADERBOARD()} component={LeaderBoard} exact />
        {/* Create Group MODAL */}
        <Route path={URL.CREATE_GROUP()} component={CreateGroup} exact />
        {/* Group advances */}
        <Route
          path={URL.GROUPS_ADVANCED()}
          component={AdvanceProgramCreator}
          exact
        />
        {/* Group leaderboard */}
        {/* <Route path={URL.GROUPS_LEADERBOARD()} component={Awards} exact /> */}
        {/* Group award */}
        <Route path={URL.GROUPS_AWARDS()} component={Awards} exact />
      </div>
    );
  }
}

export default Groups;
