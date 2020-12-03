import * as React from 'react';
import { Route } from 'react-router-dom';
import cx from 'classnames';
import ReaderSvg from 'src/assets/icons/readers.svg';
import PlusButtonSvg from 'src/assets/icons/plus.svg';
import MedalSvg from 'src/assets/icons/medal.svg';
import { Accordion, Modal, Table as BaseTable } from 'semantic-ui-react';
import Button, { ButtonColor, ButtonType } from 'src/components/Button';
import Heading, { HeadingType, HeadingColor } from 'src/components/Heading';
import AlertModal from 'src/components/Modal/AlertModal';
import URL from 'src/helpers/urls';
import { formatNumber } from 'src/helpers/number';
import {
  IGroupReader,
  IOrganizerGroup,
  INoteData,
} from 'src/store/types/common';
import { IProgram } from 'src/store/types/organizer/program';
import idx from 'idx';
import get from 'lodash/get';
import Spinner from 'src/components/Spinner';
import AddReaderNoteModal from 'src/components/Modal/AddReaderNoteModal';
import AddReaderModal from 'src/components/Modal/AddReaderModal';
import GroupBookBankModal from 'src/components/Modal/GroupBookBankModal';
import Footer from 'src/components/Footer';
import debounce from 'lodash/debounce';
import AddBooksModal, {
  AddBooksType,
} from 'src/components/Modal/AddBooksModal';
import { IBookItem } from 'src/store/types';
import { confirmModal } from 'src/components/Modal/ConfirmationModal';
import findIndex from 'lodash/findIndex';
import filter from 'lodash/filter';
import Checkbox from 'src/components/FormFields/Checkbox';
import Placeholder from 'src/components/Placeholder';
import TopHeader from '../TopHeader';
import Awards from '../Awards';
import AwardsPreview from '../AwardsPreview';
import ReaderRow from './ReaderRow';
import LeaderBoard from '../LeaderBoard';
import AddEntry from '../AddEntry';

export type ReadersProps = IScreenProps & {
  readers: IGroupReader[];
  readersLoading: boolean;
  updateReadersLoading: boolean;
  deleteGroupReader: Function;
  updateReader: Function;
  getReader: Function;
  program: IProgram;
  group: IOrganizerGroup;
  deleteReaderData: { [id: string]: IReduxOperationRequest };
  readerLoading: boolean;
  readerNotes: INoteData[];
  getAllReaders: Function;
  createReadingEntrySuccess: boolean;
  manageReadersLoading: boolean;
  manageReaders: any;
  accessGroupByProgram: any;
  updateGroupData: { [id: string]: IReduxOperationRequest };
  onUpdateBook: Function;
  direction?: boolean;
  sortColumn?: string;
  setDirection?: Function;
  setSortColumn?: Function;
  onSortReaders?: Function;
  onListReadersRefresh?: Function;
};

interface IState {
  activeIndex: number;
  showAlert: boolean;
  addNoteModal: boolean;
  selectedUserId: string;
  selectedUserName: string;
  addEntryModal: boolean;
  addBulkEntryModal: boolean;
  isOpenAddModal: boolean;
  groupBookBankModalOpen: boolean;
  entryNumber: number | string;
  searchText: string;
  filteredReaders: IGroupReader[];
  addBookModalOpen: boolean;
  selectedBookId: string;
  books: any[];
  checkAll: boolean;
  readersCheck: any[];
  applyCheckAll: boolean;
}

class Readers extends React.Component<ReadersProps, IState> {
  constructor(props) {
    super(props);

    this.state = {
      activeIndex: null,
      showAlert: false,
      addNoteModal: false,
      selectedUserId: '',
      selectedUserName: '',
      addEntryModal: false,
      addBulkEntryModal: false,
      isOpenAddModal: false,
      groupBookBankModalOpen: false,
      entryNumber: 0,
      searchText: '',
      filteredReaders: props.readers,
      readersCheck: [],
      addBookModalOpen: false,
      selectedBookId: '',
      books: [],
      checkAll: false,
      applyCheckAll: false,
    };
  }

  toggleAddBookModal = () => {
    this.setState(state => ({ addBookModalOpen: !state.addBookModalOpen }));
  };

  toggleAddModal = () => {
    this.setState(state => ({ isOpenAddModal: !state.isOpenAddModal }));
  };

  toggleGroupBookBankModal = () => {
    const { group } = this.props;
    const { groupBookBankModalOpen } = this.state;
    const books = group.books.map(book => {
      return get(book, 'attributes.data') || book;
    });
    this.setState({
      books,
      groupBookBankModalOpen: !groupBookBankModalOpen,
    });
  };

  handleSearch = debounce((text: string) => {
    if (text) {
      const newReaders = this.props.readers.filter(reader => {
        const name = `${reader.attributes.first_name.toLocaleLowerCase()} ${reader.attributes.last_name.toLocaleLowerCase()}`;
        return name.includes(text.toLocaleLowerCase());
      });
      this.setState({
        filteredReaders: newReaders,
      });
    } else {
      this.setState({
        filteredReaders: this.props.readers,
      });
    }
  }, 500);

  openEntryModal = reader => {
    const userId = get(reader, 'id') || '';
    this.setState({
      addEntryModal: true,
      selectedUserId: userId,
    });
  };

  openBulkEntryModal = () => {
    const { readersCheck } = this.state;
    const readersChecked = readersCheck.filter(r => r.checked);
    if (readersChecked && readersChecked.length >= 2) {
      this.setState({
        addBulkEntryModal: true,
      });
    }
  };

  cloesEntryModal = () => {
    this.setState({
      addEntryModal: false,
    });
  };

  cloesBulkEntryModal = () => {
    this.setState({
      addBulkEntryModal: false,
    });
  };

  handleClick = (e, titleProps) => {
    const { index } = titleProps;
    const { activeIndex } = this.state;
    const newIndex = activeIndex === index ? -1 : index;

    this.setState({ activeIndex: newIndex });
  };

  toggleAlert = () => this.setState(state => ({ showAlert: !state.showAlert }));

  onDeleteReader = ({ groupId, readerId, goalId }) => {
    this.props.deleteGroupReader(readerId, goalId, groupId);
  };

  openNoteModal = reader => {
    const userId = get(reader, 'id') || '';
    const readerName = `${get(reader, 'attributes.first_name') || ''} ${get(
      reader,
      'attributes.last_name'
    ) || ''}`;
    if (userId) {
      this.props.getReader(userId);
      this.setState({
        selectedUserId: userId,
        selectedUserName: readerName,
        addNoteModal: true,
      });
    }
  };

  closeNoteModal = () => {
    this.setState({
      addNoteModal: false,
    });
  };

  componentDidUpdate = prevProps => {
    const { createReadingEntrySuccess, readersLoading } = this.props;
    if (
      createReadingEntrySuccess &&
      prevProps.createReadingEntrySuccess !== createReadingEntrySuccess
    ) {
      this.cloesEntryModal();
    }
    if (!readersLoading && prevProps.readersLoading !== readersLoading) {
      this.setState({
        filteredReaders: this.props.readers,
      });
    }
  };

  onSelect = (book: IBookItem) => {
    const { onUpdateBook, group } = this.props;
    const { books } = this.state;
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
          onUpdateBook(newAddedBooks, group, () => {
            this.setState({
              books: newAddedBooks,
            });
          });
        },
      });
    } else {
      const newAddedBooks = [...books, book];
      onUpdateBook(newAddedBooks, group, () => {
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
          this.props.onSortReaders();
        });
      });
    } else {
      setDirection(!direction, () => {
        this.props.onSortReaders();
      });
    }
  };

  renderTableHeader = () => {
    const {
      classes,
      sortColumn,
      direction,
      readers,
      accessGroupByProgram,
    } = this.props;
    const { checkAll, readersCheck } = this.state;
    const readersCheckedLength = readersCheck.filter(r => r.checked);
    return (
      <BaseTable
        sortable
        padded
        className={cx(classes.tableContainerMark, classes.sortTable)}>
        <BaseTable.Header>
          <BaseTable.Row className={classes.tableStyles.table_row}>
            <BaseTable.HeaderCell
              sorted={
                sortColumn !== 'first_name'
                  ? null
                  : direction
                  ? 'ascending'
                  : 'descending'
              }
              onClick={this.handleSort('first_name')}
              width={2}
              className={classes.tableStyles.table_header_row}>
              First Name
            </BaseTable.HeaderCell>
            <BaseTable.HeaderCell
              sorted={
                sortColumn !== 'last_name'
                  ? null
                  : direction
                  ? 'ascending'
                  : 'descending'
              }
              onClick={this.handleSort('last_name')}
              width={2}
              className={classes.tableStyles.table_header_row}>
              Last Name
            </BaseTable.HeaderCell>
            <BaseTable.HeaderCell
              width={2}
              sorted={
                sortColumn !== 'role'
                  ? null
                  : direction
                  ? 'ascending'
                  : 'descending'
              }
              onClick={this.handleSort('role')}
              className={classes.tableStyles.table_header_row}>
              Reader Type
            </BaseTable.HeaderCell>
            <BaseTable.HeaderCell
              width={2}
              sorted={
                sortColumn !== 'entry'
                  ? null
                  : direction
                  ? 'ascending'
                  : 'descending'
              }
              onClick={this.handleSort('entry')}
              className={classes.tableStyles.table_header_row}>
              Last Entry
            </BaseTable.HeaderCell>
            <BaseTable.HeaderCell
              width={accessGroupByProgram.write ? 4 : 6}
              className={classes.tableStyles.table_header_row}>
              Progress
            </BaseTable.HeaderCell>
            {accessGroupByProgram.write && (
              <BaseTable.HeaderCell
                width={2}
                sorted={null}
                className={classes.tableStyles.table_header_row}>
                <div className={classes.customColumn}>
                  <Checkbox
                    center
                    checkboxProps={{
                      checked: checkAll,
                      onChange: (_, data: any) => {
                        if (data.checked) {
                          this.setState({
                            checkAll: data.checked,
                            applyCheckAll: true,
                            readersCheck: readers.map(u => ({
                              id: u.id,
                              checked: true,
                            })),
                          });
                        } else {
                          this.setState({
                            checkAll: data.checked,
                            applyCheckAll: true,
                            readersCheck: [],
                          });
                        }
                      },
                    }}
                  />
                  {accessGroupByProgram.write &&
                  readersCheckedLength &&
                  readersCheckedLength.length >= 2 ? (
                    <Button
                      colorVariant={ButtonColor.PRIMARY}
                      buttonType={ButtonType.ROUND}
                      buttonProps={{
                        onClick: this.openBulkEntryModal,
                      }}>
                      <Heading
                        headingProps={{ as: 'h5' }}
                        colorVariant={HeadingColor.WHITE}
                        type={HeadingType.NORMAL}>
                        Bulk Entry
                      </Heading>
                    </Button>
                  ) : (
                    <span>Bulk entry</span>
                  )}
                </div>
              </BaseTable.HeaderCell>
            )}
            <BaseTable.HeaderCell
              width={2}
              className={cx(
                classes.tableStyles.table_header_row,
                classes.totalHeader
              )}>
              Total Readers:{' '}
              <span className={classes.readerText}>
                {formatNumber(readers.length)}
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
      readers,
      group,
      program,
      direction,
      sortColumn,
      deleteReaderData,
      readersLoading,
      updateReader,
      updateReadersLoading,
      readerLoading,
      readerNotes,
      updateGroupData,
      manageReadersLoading,
      manageReaders,
      onListReadersRefresh,
      accessGroupByProgram,
    } = this.props;
    const {
      showAlert,
      activeIndex,
      addNoteModal,
      addEntryModal,
      isOpenAddModal,
      selectedUserId,
      filteredReaders,
      books,
      checkAll,
      applyCheckAll,
      readersCheck,
      addBulkEntryModal,
    } = this.state;
    const readersCheckedLength = readersCheck.filter(r => r.checked);
    const readerIds = readersCheckedLength.map(r => r.id);
    const programName = idx(program, x => x.attributes.name);
    const readingLog = get(program, 'attributes.reading_log');
    const programId = idx(program, x => x.id);
    const groupName = idx(group, x => x.attributes.name);
    const groupId = idx(group, x => x.id);
    const goalId = get(group, 'attributes.active_goal_id') || '';
    const groupMetricId = get(group, 'attributes.active_metric_id', '');
    const totalBooks = idx(group, x => x.books.length) || 0;
    const breadcrumbs = [
      {
        url: URL.PROGRAMS(),
        name: 'All Programs',
      },
      {
        url: URL.GROUPS({ programId }),
        name: programName,
      },
      {
        url: '',
        name: groupName,
      },
      {
        url: '',
        name: 'Reader',
      },
    ];
    const manageReadersData = get(manageReaders, 'data', []);
    return (
      <div className={classes.readersPage}>
        <TopHeader
          programId={programId}
          groupId={groupId}
          titleProps={{
            icon: <ReaderSvg height={25} />,
            breadcrumbs,
          }}
          searchInputProps={{
            inputProps: {
              placeholder: 'Search Group',
              icon: 'search',
              onChange: (_, { value }) => {
                this.handleSearch(value);
              },
            },
          }}
          title="Readers"
        />
        <div className={classes.tableWrapper}>
          {this.renderTableHeader()}
          {readersLoading ? (
            <Spinner />
          ) : (
            <Accordion styled className={classes.accordianContainer} fluid>
              {readers.length <= 0 &&
              !readersLoading &&
              !manageReadersLoading ? (
                <Placeholder>
                  <h2>
                    Congratulations!
                    <br />
                    Your Reading Program is set up and ready for readers.
                  </h2>
                  <p>
                    Its easy to add readers to your program either one-by-one,
                    or, through a mass email invitation, Click on the button
                    below to get started.
                    <br />
                    Happy Reading!
                  </p>
                  {manageReadersData.length > 0 ? (
                    <div className={classes.placeholderButtons}>
                      {accessGroupByProgram.write && (
                        <Button
                          colorVariant={ButtonColor.PRIMARY}
                          icon={<PlusButtonSvg height={15} />}
                          buttonType={ButtonType.ROUND}
                          buttonProps={{
                            onClick: () => {
                              this.toggleAddModal();
                            },
                          }}>
                          <Heading
                            headingProps={{ as: 'h5' }}
                            colorVariant={HeadingColor.WHITE}
                            type={HeadingType.NORMAL}>
                            Add Reader
                          </Heading>
                        </Button>
                      )}
                      <Button
                        colorVariant={ButtonColor.PRIMARY}
                        icon={<PlusButtonSvg height={15} />}
                        buttonType={ButtonType.ROUND}
                        buttonProps={{
                          onClick: () => {
                            this.toggleAddModal();
                            history.push(URL.INVITE_READERS());
                          },
                        }}>
                        <Heading
                          headingProps={{ as: 'h5' }}
                          colorVariant={HeadingColor.WHITE}
                          type={HeadingType.NORMAL}>
                          Invite Reader
                        </Heading>
                      </Button>
                    </div>
                  ) : (
                    <Button
                      colorVariant={ButtonColor.PRIMARY}
                      icon={<PlusButtonSvg height={15} />}
                      buttonType={ButtonType.ROUND}
                      buttonProps={{
                        onClick: () => {
                          this.toggleAddModal();
                          history.push(URL.INVITE_READERS());
                        },
                      }}>
                      <Heading
                        headingProps={{ as: 'h5' }}
                        colorVariant={HeadingColor.WHITE}
                        type={HeadingType.NORMAL}>
                        Invite Reader
                      </Heading>
                    </Button>
                  )}
                </Placeholder>
              ) : (
                filteredReaders.map(reader => {
                  const completionProgress =
                    get(
                      reader,
                      'progress.attributes.intervalProgress.completed_interval_percentage'
                    ) || 0;
                  const readingLogProgress =
                    get(reader, 'progress.attributes.total') || {};
                  return (
                    <ReaderRow
                      key={reader.id}
                      reader={reader}
                      group={group}
                      programId={programId}
                      groupId={groupId}
                      onPlusIconClick={id => {
                        this.setState({ activeIndex: id });
                      }}
                      isActive={
                        activeIndex &&
                        activeIndex.toString() === reader.id.toString()
                      }
                      history={history}
                      onDeleteReader={this.onDeleteReader}
                      isDeleting={idx(
                        deleteReaderData,
                        x => x[reader.id].loading
                      )}
                      onUpdateReader={(id, values) => {
                        updateReader(id, values, null, true);
                      }}
                      onListReadersRefresh={onListReadersRefresh}
                      isUpdating={updateReadersLoading}
                      completionProgress={completionProgress}
                      onOpenNoteModal={this.openNoteModal}
                      readerLoading={readerLoading}
                      onOpenEntryModal={this.openEntryModal}
                      readingLogProgress={readingLogProgress}
                      readingLog={readingLog}
                      applyCheckAll={applyCheckAll}
                      checkAll={checkAll}
                      readersCheck={readersCheck}
                      accessGroupByProgram={accessGroupByProgram}
                      eachCheck={(readerId, checked) => {
                        const newReadersCheck = [...readersCheck];
                        const currentCheckboxIndex = findIndex(
                          newReadersCheck,
                          {
                            id: reader.id,
                          }
                        );
                        if (currentCheckboxIndex >= 0) {
                          newReadersCheck[
                            currentCheckboxIndex
                          ].checked = checked;
                          this.setState({
                            applyCheckAll: false,
                            readersCheck: newReadersCheck,
                            checkAll:
                              newReadersCheck.filter(r => r.checked).length ===
                              readers.length,
                          });
                        } else {
                          const checkboxObj = {
                            id: reader.id,
                            checked,
                          };
                          this.setState(state => ({
                            applyCheckAll: false,
                            readersCheck: [...state.readersCheck, checkboxObj],
                            checkAll:
                              [...state.readersCheck, checkboxObj].filter(
                                r => r.checked
                              ).length === readers.length,
                          }));
                        }
                      }}
                    />
                  );
                })
              )}
            </Accordion>
          )}
        </div>
        <Footer position="fixed">
          <div className="bottomBar">
            <div className={classes.buttonContainerGroup}>
              <div className={classes.bottomButtonWrapper}>
                <Button
                  buttonProps={{
                    onClick: () => {
                      this.toggleGroupBookBankModal();
                    },
                  }}
                  colorVariant={ButtonColor.SECONDARY}
                  buttonType={ButtonType.ROUND}
                  numberText={totalBooks}
                  classes={{ button: classes.bookbankButton }}>
                  <Heading
                    headingProps={{ as: 'h5' }}
                    colorVariant={HeadingColor.WHITE}
                    type={HeadingType.NORMAL}>
                    Group Book Bank
                  </Heading>
                </Button>
                {readingLog < 2 ? (
                  <Button
                    colorVariant={ButtonColor.YELLOW}
                    icon={<MedalSvg height={15} />}
                    buttonType={ButtonType.ROUND}
                    buttonProps={{
                      onClick: () => {
                        history.push(
                          URL.READERS_AWARDS({ programId, groupId })
                        );
                      },
                    }}>
                    <Heading
                      headingProps={{ as: 'h5' }}
                      colorVariant={HeadingColor.WHITE}
                      type={HeadingType.NORMAL}>
                      Awards
                    </Heading>
                  </Button>
                ) : (
                  <Button
                    colorVariant={ButtonColor.YELLOW}
                    icon={<MedalSvg height={15} />}
                    buttonType={ButtonType.ROUND}
                    buttonProps={{
                      onClick: () => {
                        history.push(
                          URL.READERS_LEADERBOARD({ programId, groupId })
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
              {accessGroupByProgram.write && (
                <Button
                  colorVariant={ButtonColor.PRIMARY}
                  icon={<PlusButtonSvg height={15} />}
                  buttonType={ButtonType.ROUND}
                  buttonProps={{
                    onClick: () => {
                      this.toggleAddModal();
                    },
                  }}>
                  <Heading
                    headingProps={{ as: 'h5' }}
                    colorVariant={HeadingColor.WHITE}
                    type={HeadingType.NORMAL}>
                    Add Reader
                  </Heading>
                </Button>
              )}
            </div>
          </div>
        </Footer>
        <AlertModal
          modelProps={{
            open: showAlert,
            centered: false,
            onClose: this.toggleAlert,
          }}
          onSave={this.toggleAlert}
          text="This will delete this Reader from this Group. They will lose all their entries for this Group. 
          Are you absolutely sure? WARNING: This cannot be undone. On Yes then remove Reader"
        />
        {/* Add note modal */}
        <AddReaderNoteModal
          modelProps={{
            closeIcon: true,
            open: addNoteModal,
            dimmer: 'inverted',
            onClose: this.closeNoteModal,
            size: 'small',
          }}
          onCancel={this.closeNoteModal}
          userId={this.state.selectedUserId}
          notes={readerNotes}
          loading={readerLoading}
          readerName={this.state.selectedUserName}
        />
        {/* Add entry modal */}
        <Modal
          closeIcon
          open={addEntryModal}
          dimmer="inverted"
          onClose={this.cloesEntryModal}
          className={classes.entryModal}
          size="mini">
          <AddEntry
            successCallback={() => {
              this.props.getAllReaders({
                programId,
                groupId,
                order: `${sortColumn}|${direction ? 'asc' : 'desc'}`,
              });
            }}
            readerId={selectedUserId}
            goalId={goalId}
            groupMetricId={groupMetricId}
            groupId={groupId}
          />
        </Modal>
        {/* Add Bulk Entry modal */}
        <Modal
          closeIcon
          open={addBulkEntryModal}
          dimmer="inverted"
          onClose={this.cloesBulkEntryModal}
          className={classes.entryModal}
          size="mini">
          <AddEntry
            successCallback={() => {
              this.props.getAllReaders({
                programId,
                groupId,
                order: `${sortColumn}|${direction ? 'asc' : 'desc'}`,
              });
              this.cloesBulkEntryModal();
            }}
            readerIds={readerIds}
            readerId=""
            programId={programId}
            groupId={groupId}
            goalId={goalId}
          />
        </Modal>
        {/* Add reader modal */}
        <AddReaderModal
          modelProps={{
            closeIcon: true,
            open: isOpenAddModal,
            size: 'small',
            onClose: this.toggleAddModal,
          }}
          onListReadersRefresh={() => {
            this.props.getAllReaders({
              programId,
              groupId,
              order: `${sortColumn}|${direction ? 'asc' : 'desc'}`,
            });
          }}
          onCancel={this.toggleAddModal}
          fromReadersPage
          groupIdFromReader={groupId}
        />
        {/* Group book bank modal */}
        <GroupBookBankModal
          modelProps={{
            size: 'small',
            open: this.state.groupBookBankModalOpen,
            onClose: this.toggleGroupBookBankModal,
            closeIcon: true,
          }}
          books={books}
          onAddBookClicked={this.toggleAddBookModal}
          accessGroupByProgram={accessGroupByProgram}
          onRemoveBook={(selectBook: IBookItem) => this.onSelect(selectBook)}
          loading={idx(updateGroupData, x => x[groupId].loading)}
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
          groupId={groupId}
          selectedBooks={books}
          loading={idx(updateGroupData, x => x[groupId].loading)}
          itemLoading={this.state.selectedBookId}
        />
        {/* AWARDS MODAL */}
        <Route path={URL.READERS_LEADERBOARD()} component={LeaderBoard} exact />
        <Route path={URL.READERS_AWARDS()} component={Awards} exact />
        {/* AWARDS PREVIEW MODAL */}
        <Route path={URL.AWARDS_PREVIEW()} component={AwardsPreview} exact />
      </div>
    );
  }
}

export default Readers;
