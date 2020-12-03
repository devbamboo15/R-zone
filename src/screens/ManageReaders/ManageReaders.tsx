import * as React from 'react';
import Title from 'src/components/Title';
import * as moment from 'moment';
import {
  get,
  debounce,
  first,
  filter,
  pickBy,
  size,
  map,
  includes,
  forEach,
} from 'lodash';
import ManageReaderSvg from 'assets/icons/manage_reader.svg';
import ReaderNoteSvg from 'assets/icons/reader_note.svg';
import EditSvg from 'assets/icons/edit.svg';
import PlusButtonSvg from 'assets/icons/plus.svg';
import Heading, { HeadingColor, HeadingType } from 'src/components/Heading';
import {
  Table as BaseTable,
  TableRow,
  TableCell,
  Grid,
  Icon,
  Label,
  Popup,
} from 'semantic-ui-react';
import Table from 'src/components/Table';
import Checkbox from 'src/components/FormFields/Checkbox';
import Input from 'src/components/FormFields/Input';
import Button, { ButtonType, ButtonColor } from 'src/components/Button';
import Spinner from 'src/components/Spinner';
import { IReaderItem, Pagination } from 'src/store/types/common';
import BulkManageReaderModal from 'src/components/Modal/BulkManageReaderModal';
import AddReaderModal from 'src/components/Modal/AddReaderModal';
import BulkDeleteReaderModal from 'src/components/Modal/BulkDeleteReaderModal';
import UpdateReaderModal from 'src/components/Modal/UpdateReaderModal';
import ReSelect from 'src/components/ReSelect';
import { IProgram } from 'src/store/types/organizer/program';
import { IOrganizerGroupItem } from 'src/store/types/organizer/group';
import InfiniteScroll from 'react-infinite-scroller';
import cx from 'classnames';
import keys from 'lodash/keys';
import AddReaderNoteModal from 'src/components/Modal/AddReaderNoteModal';
import NoOrganizationModal from 'src/components/Modal/NoOrganizationModal';
import Footer from 'src/components/Footer';

export enum SortEnum {
  'group' = 'group',
  'program' = 'program',
}

export type ManageReaderProps = IScreenProps & {
  searchListReaders: Function;
  onSortGroupsListReaders: Function;
  onSortProgramsListReaders: Function;
  setSearchText: Function;
  onLoadMore: Function;
  setSort: Function;
  sort?: SortEnum;
  sortIds: any[];
  setSortIds: Function;
  readers: Pagination & { data: IReaderItem[] };
  readersLoading: boolean;
  groups: IOrganizerGroupItem[];
  programs: IProgram[];
  page?: number;
  sortPrograms: any[];
  sortGroups: any[];
  setSortGroups: Function;
  setSortPrograms: Function;
  setDirection: Function;
  onListReadersRefresh: Function;
  getReaderDetail: Function;
  getListReaders: Function;
  setSortColumn: Function;
  direction: boolean;
  sortColumn: string;
  organizationId: any;
  setPage: Function;
  role: string;
  userAccessProgram: any;
};

interface ManageReaderState {
  isOpenBulkModal: boolean;
  isOpenUpdateModal: boolean;
  isOpenAddModal: boolean;
  isOpenDeleteModal: boolean;
  modelType: any;
  selectedItems: Record<string, any>;
  isSelectedAll: boolean;
  updatingReader: IReaderItem | null;
  addNoteModal: boolean;
  selectedReaderId: string;
  selectedReaderName: string;
  direction: boolean;
}

class ManageReaders extends React.Component<
  ManageReaderProps,
  ManageReaderState
> {
  state = {
    isOpenBulkModal: false,
    isOpenAddModal: false,
    isOpenDeleteModal: false,
    isOpenUpdateModal: false,
    modelType: null,
    selectedItems: {},
    isSelectedAll: false,
    updatingReader: null,
    addNoteModal: false,
    selectedReaderId: '',
    selectedReaderName: '',
    direction: false,
  };

  openNoteModal = () => {
    this.setState({
      addNoteModal: true,
    });
  };

  closeNoteModal = () => {
    this.setState({
      addNoteModal: false,
    });
  };

  componentDidUpdate(): void {
    this.checkLoadMore();
  }

  componentWillReceiveProps(nextProps: any) {
    if (nextProps.readers !== this.props.readers) {
      const { selectedItems } = this.state;
      const listCheckedItems = filter(selectedItems, (item: boolean) => item);
      if (get(nextProps.readers, 'data.length') !== listCheckedItems.length) {
        this.setState({ isSelectedAll: false });
      }
    }
  }

  setUpdatingReader = (reader: IReaderItem) => {
    this.toggleUpdateModal();
    this.setState({
      selectedItems: { [reader.user_id]: true },
      updatingReader: reader,
    });
  };

  toggleSelectedAll = ({ checked }: any) => {
    const { readers } = this.props;
    const { selectedItems } = this.state;
    get(readers, 'data', []).forEach((user: IReaderItem) => {
      selectedItems[user.user_id] = checked;
    });
    this.setState({
      selectedItems,
      isSelectedAll: checked,
    });
  };

  onChangeSelectedItem = (item: any, { checked }: any) => {
    const { selectedItems } = this.state;
    const { readers } = this.props;
    const newSelectedItems = {
      ...selectedItems,
      [item.user_id]: checked,
    };
    this.setState({ selectedItems: newSelectedItems });
    if (!checked) {
      this.setState({ isSelectedAll: false });
    }
    const listCheckedItems = filter(
      newSelectedItems,
      (status: boolean) => status
    );
    if (get(readers, 'data.length') === listCheckedItems.length) {
      this.setState({ isSelectedAll: true });
    }
  };

  toggleBulkModal = () => {
    this.setState(state => ({
      isOpenBulkModal: !state.isOpenBulkModal,
      modelType: state.isOpenBulkModal ? null : state.isOpenBulkModal,
    }));
  };

  toggleAddModal = () => {
    this.setState(state => ({ isOpenAddModal: !state.isOpenAddModal }));
  };

  toggleDeleteModal = () => {
    this.setState(state => ({ isOpenDeleteModal: !state.isOpenDeleteModal }));
  };

  toggleUpdateModal = () => {
    this.setState(state => ({
      isOpenUpdateModal: !state.isOpenUpdateModal,
      selectedItems: {},
    }));
  };

  selectGroups = (sortIds: any) => {
    this.props.setSortGroups(sortIds);
    this.props.onSortGroupsListReaders(sortIds);
  };

  selectPrograms = (sortIds: any) => {
    this.props.setSortPrograms(sortIds);
    this.props.onSortProgramsListReaders(sortIds);
  };

  handleSearch = debounce((text: string) => {
    this.props.setSearchText(text);
    this.props.searchListReaders(text);
  }, 500);

  checkLoadMore = () => {
    const { readers, readersLoading } = this.props;
    const hasMore = !!get(readers, 'next_page_url');
    const containerElement = document.getElementById(
      'manage_readers_container'
    );
    if (
      !readersLoading &&
      hasMore &&
      containerElement.scrollHeight <= containerElement.clientHeight
    ) {
      this.loadMoreItems();
    }
  };

  loadMoreItems = debounce(() => {
    this.props.onLoadMore();
  }, 20);

  renderOptionSortIds = (sort: SortEnum) => {
    const { sortPrograms } = this.props;
    const matchedGroupsId = [];
    sortPrograms.map(p => {
      (get(p, 'relationships.groups.data') || []).map(g => {
        matchedGroupsId.push(g.id);
        return true;
      });
      return true;
    });
    let options = [];
    switch (sort) {
      case 'group':
        options = get(this.props, 'groups', [])
          .filter(g => matchedGroupsId.indexOf(g.group_id) >= 0)
          .map((item: any) => ({
            value: item.group_id,
            label: item.group_name,
          }));
        break;
      case 'program':
        options = get(this.props, 'programs', []).map((item: any) => ({
          value: item.id,
          label: item.attributes.name,
          relationships: item.relationships,
        }));
        break;
      default:
        options = [];
        break;
    }

    return options;
  };

  handleOpenNoteModal = (reader: IReaderItem) => {
    const id = reader.user_id.toString();
    const name = `${reader.first_name} ${reader.last_name}`;
    const { getReaderDetail } = this.props;
    getReaderDetail(id);
    this.setState({
      selectedReaderId: id,
      selectedReaderName: name,
      addNoteModal: true,
    });
  };

  handleSort = column => () => {
    const { direction, sortColumn, setDirection, setSortColumn } = this.props;
    if (sortColumn !== column) {
      setSortColumn(column, () => {
        setDirection(true, () => {
          this.props.onSortProgramsListReaders([]);
        });
      });
    } else {
      setDirection(!direction, () => {
        this.props.onSortProgramsListReaders([]);
      });
    }
  };

  isWriteAble = group => {
    const { userAccessProgram, role } = this.props;
    let writeAble = false;
    forEach(group, itemGroup => {
      const itemRole = get(
        userAccessProgram,
        `group_by_program[${itemGroup.program_id}][${itemGroup.id}]`
      );
      if (itemRole && itemRole.write === true) {
        writeAble = true;
      }
    });
    return role === 'owner' || writeAble;
  };

  render() {
    const {
      classes,
      readers,
      readersLoading,
      sortPrograms,
      sortGroups,
      programs,
      onListReadersRefresh,
      direction,
      sortColumn,
      organizationId,
      setSortGroups,
      setPage,
    } = this.props;
    const {
      isOpenAddModal,
      isOpenDeleteModal,
      isOpenBulkModal,
      isOpenUpdateModal,
      modelType,
      selectedItems,
      isSelectedAll,
      updatingReader,
    } = this.state;
    const notesForAddNotesModal = [];
    const listCheckedItems = pickBy(selectedItems, (status: boolean) => status);
    const selectedItemIds = keys(listCheckedItems) || [];
    const isDisableDeleteButton = selectedItemIds.length === 0;
    const selectedReaders = filter(readers.data, item =>
      includes(selectedItemIds, item.user_id.toString())
    );
    const programId = get(updatingReader, 'program[0].id');
    const groupId = get(updatingReader, 'group[0].id');
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
            action="Manager Readers"
          />
        )}
        <div>
          <Title icon={<ManageReaderSvg />}>Manage Readers</Title>
        </div>
        <Grid columns={3}>
          <Grid.Column>
            <ReSelect
              selectProps={{
                value: sortPrograms,
                isMulti: true,
                options: this.renderOptionSortIds(SortEnum.program),
                placeholder: 'Program',
                onChange: (items: any[]) => {
                  if (items.length < sortPrograms.length) {
                    setSortGroups([]);
                  }
                  setTimeout(() => {
                    this.selectPrograms(items);
                  }, 0);
                },
              }}
            />
          </Grid.Column>
          <Grid.Column>
            <ReSelect
              selectProps={{
                value: sortGroups,
                options: this.renderOptionSortIds(SortEnum.group),
                isMulti: true,
                placeholder: 'Group',
                onChange: (items: any[]) => this.selectGroups(items),
                isDisabled: sortPrograms.length === 0,
              }}
            />
          </Grid.Column>
          <Grid.Column>
            <Input
              inputProps={{
                placeholder: 'Search',
                onChange: ({ target }) => this.handleSearch(target.value),
              }}
            />
          </Grid.Column>
        </Grid>
        <Grid className={classes.mainStyles.topbar}>
          <Grid.Column width={8} verticalAlign="middle">
            <Checkbox
              checkboxProps={{
                checked: isSelectedAll,
                onChange: (_, e) => this.toggleSelectedAll(e),
                customclass: classes.mainStyles.checkboxAll,
              }}>
              <>
                <Heading headingProps={{ as: 'h5' }} type={HeadingType.NORMAL}>
                  Select All |
                </Heading>
                <Heading
                  headingProps={{
                    as: 'h5',
                    onClick: () => {
                      if (size(listCheckedItems) > 0) {
                        this.toggleBulkModal();
                      }
                    },
                  }}
                  type={HeadingType.NORMAL}
                  colorVariant={HeadingColor.GRAY}>
                  <span
                    className={cx(
                      classes.mainStyles.bulkText,
                      selectedItemIds.length >= 2
                        ? classes.mainStyles.clickable
                        : ''
                    )}>
                    Bulk Manage Selected Readers
                  </span>
                </Heading>
              </>
            </Checkbox>
          </Grid.Column>
        </Grid>
        <BaseTable
          sortable
          padded
          className={cx(
            classes.mainStyles.tableContainerMark,
            classes.mainStyles.sortTable
          )}>
          <BaseTable.Header>
            <BaseTable.Row className={classes.tableStyles.table_row}>
              <BaseTable.HeaderCell
                width={1}
                className={classes.tableStyles.table_header_row}
              />
              <BaseTable.HeaderCell
                sorted={
                  sortColumn !== 'first_name'
                    ? null
                    : direction
                    ? 'ascending'
                    : 'descending'
                }
                onClick={this.handleSort('first_name')}
                width={3}
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
                width={3}
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
                Role
              </BaseTable.HeaderCell>
              <BaseTable.HeaderCell
                width={2}
                sorted={
                  sortColumn !== 'program'
                    ? null
                    : direction
                    ? 'ascending'
                    : 'descending'
                }
                onClick={this.handleSort('program')}
                className={classes.tableStyles.table_header_row}>
                Program
              </BaseTable.HeaderCell>
              <BaseTable.HeaderCell
                width={2}
                sorted={
                  sortColumn !== 'group'
                    ? null
                    : direction
                    ? 'ascending'
                    : 'descending'
                }
                onClick={this.handleSort('group')}
                className={classes.tableStyles.table_header_row}>
                Group
              </BaseTable.HeaderCell>
              <BaseTable.HeaderCell
                width={2}
                className={classes.tableStyles.table_header_row}>
                Status
              </BaseTable.HeaderCell>
              <BaseTable.HeaderCell
                width={2}
                sorted={
                  sortColumn !== 'joined_date'
                    ? null
                    : direction
                    ? 'ascending'
                    : 'descending'
                }
                onClick={this.handleSort('joined_date')}
                className={classes.tableStyles.table_header_row}>
                Joined
              </BaseTable.HeaderCell>
            </BaseTable.Row>
          </BaseTable.Header>
        </BaseTable>
        <div
          className={classes.mainStyles.tableContainer}
          id="manage_readers_container">
          <InfiniteScroll
            pageStart={0}
            initialLoad={false}
            loadMore={this.loadMoreItems}
            useWindow={false}
            threshold={50}
            hasMore={!!get(readers, 'next_page_url')}>
            <Table
              fields={[
                '',
                'Name',
                'Role',
                'Program',
                'Group',
                'Status',
                'Joined',
              ]}
              widths={[1, 6, 2, 2, 2, 2, 2]}
              tableProps={{ className: classes.mainStyles.tableContainer }}>
              {get(readers, 'data', []).map(
                (user: IReaderItem, index: number) => {
                  const { group = [], program = [] } = user;
                  const contentPopupPermission = 'View access only';
                  const isWriteAble = this.isWriteAble(group);
                  return (
                    <TableRow
                      className={classes.mainStyles.tableRow}
                      key={index}>
                      <TableCell width={1}>
                        <div className={classes.mainStyles.iconContainer}>
                          <Button
                            buttonType={ButtonType.TRANSPARENT}
                            buttonProps={{
                              className: classes.mainStyles.buttonEdit,
                              onClick: () =>
                                this.setUpdatingReader(user as IReaderItem),
                            }}
                            icon>
                            <EditSvg height={15} />
                          </Button>
                          <Popup
                            content={contentPopupPermission}
                            wide
                            position="top center"
                            size="small"
                            disabled={isWriteAble}
                            trigger={
                              <div className={classes.popupContainer}>
                                <Checkbox
                                  center
                                  checkboxProps={{
                                    disabled: !isWriteAble,
                                    checked:
                                      isWriteAble &&
                                      selectedItems[user.user_id],
                                    onChange: (_, e) =>
                                      this.onChangeSelectedItem(user, e),
                                  }}
                                />
                              </div>
                            }
                          />
                        </div>
                      </TableCell>
                      <TableCell width={3}>
                        <Heading
                          headingProps={{ as: 'h4' }}
                          type={HeadingType.NORMAL}>
                          {`${user.first_name}`}
                        </Heading>
                      </TableCell>
                      <TableCell width={3}>
                        <Heading
                          headingProps={{ as: 'h4' }}
                          type={HeadingType.NORMAL}>
                          {`${user.last_name}`}
                          <div
                            style={{ display: 'inline-block' }}
                            onClick={() => {
                              this.handleOpenNoteModal(user as IReaderItem);
                            }}>
                            {user.notes_count > 0 && (
                              <>
                                <ReaderNoteSvg height={19} />
                                <span>({user.notes_count})</span>
                              </>
                            )}
                          </div>
                        </Heading>
                      </TableCell>
                      <TableCell width={2}>
                        <Heading
                          headingProps={{ as: 'h5' }}
                          type={HeadingType.NORMAL}
                          colorVariant={HeadingColor.GRAY}>
                          {user.role}
                        </Heading>
                      </TableCell>
                      <TableCell width={2}>
                        <Heading
                          headingProps={{ as: 'h5' }}
                          type={HeadingType.NORMAL}
                          colorVariant={HeadingColor.GRAY}>
                          {size(program) > 1 ? (
                            <Popup
                              content={map(
                                program,
                                (item: any) => item.name
                              ).join(', ')}
                              trigger={
                                <Label
                                  className={classes.mainStyles.labelCount}>
                                  {size(program)}
                                </Label>
                              }
                            />
                          ) : (
                            get(first(program), 'name')
                          )}
                        </Heading>
                      </TableCell>
                      <TableCell width={2}>
                        <Heading
                          headingProps={{ as: 'h5' }}
                          type={HeadingType.NORMAL}
                          colorVariant={HeadingColor.GRAY}>
                          {size(group) > 1 ? (
                            <Popup
                              content={map(
                                group,
                                (item: any) => item.name
                              ).join(', ')}
                              trigger={
                                <Label
                                  className={classes.mainStyles.labelCount}>
                                  {group.length}
                                </Label>
                              }
                            />
                          ) : (
                            get(first(group), 'name')
                          )}
                        </Heading>
                      </TableCell>
                      <TableCell width={2}>
                        <Heading
                          headingProps={{ as: 'h5' }}
                          type={HeadingType.NORMAL}
                          colorVariant={HeadingColor.GRAY}>
                          {get(user, 'status', '') || 'Pending'}
                        </Heading>
                      </TableCell>
                      <TableCell width={2}>
                        <Heading
                          headingProps={{ as: 'h5' }}
                          type={HeadingType.NORMAL}
                          colorVariant={HeadingColor.GRAY}>
                          {get(user, 'status', '') === 'Active'
                            ? moment(user.joined_date, 'MM/DD/YYYY').format(
                                'MM/DD/YYYY'
                              )
                            : '--/--/--'}
                        </Heading>
                      </TableCell>
                    </TableRow>
                  );
                }
              )}
            </Table>
          </InfiniteScroll>
          {readersLoading ? (
            <div className={classes.mainStyles.loadingContainer}>
              <Spinner />
            </div>
          ) : null}
        </div>
        <Footer position="fixed">
          <div className="bottomBar">
            <div style={{ marginTop: '0.5rem' }}>
              <Button
                icon={<Icon name="trash alternate outline" />}
                colorVariant={ButtonColor.DANGER}
                buttonType={ButtonType.ROUND}
                buttonProps={{
                  disabled: isDisableDeleteButton,
                  onClick: this.toggleDeleteModal,
                }}>
                Delete Reader
              </Button>
            </div>
            <div style={{ marginTop: '0.5rem' }}>
              <Button
                icon={<PlusButtonSvg height={16} />}
                colorVariant={ButtonColor.PRIMARY}
                buttonType={ButtonType.ROUND}
                buttonProps={{
                  onClick: this.toggleAddModal,
                }}>
                Move Reader
              </Button>
            </div>
          </div>
        </Footer>
        <BulkManageReaderModal
          modelProps={{
            closeIcon: true,
            open: isOpenBulkModal,
            size: 'small',
            onClose: this.toggleBulkModal,
          }}
          onListReadersRefresh={onListReadersRefresh}
          onCancel={this.toggleBulkModal}
          programs={programs}
          selectedIds={listCheckedItems}
          type={modelType}
          onAddReaders={() => this.setState(() => ({ modelType: 'add' }))}
          onMoveReaders={() => this.setState(() => ({ modelType: 'move' }))}
        />
        <BulkDeleteReaderModal
          modelProps={{
            closeIcon: true,
            open: isOpenDeleteModal,
            size: 'small',
            onClose: this.toggleDeleteModal,
          }}
          selectedReaders={selectedReaders}
          onListReadersRefresh={() => {
            this.toggleSelectedAll({ checked: false });
            setPage(1);
            onListReadersRefresh();
            if (this.state.isOpenUpdateModal === true) {
              this.toggleUpdateModal();
            }
          }}
          onCancel={this.toggleDeleteModal}
        />
        <AddReaderModal
          modelProps={{
            closeIcon: true,
            open: isOpenAddModal,
            size: 'small',
            onClose: this.toggleAddModal,
          }}
          onListReadersRefresh={() => {
            setPage(1);
            onListReadersRefresh();
          }}
          onCancel={this.toggleAddModal}
          programs={programs}
        />
        {/* Add note modal */}
        <AddReaderNoteModal
          modelProps={{
            closeIcon: true,
            open: this.state.addNoteModal,
            dimmer: 'inverted',
            onClose: this.closeNoteModal,
            size: 'small',
          }}
          onCancel={this.closeNoteModal}
          userId={this.state.selectedReaderId}
          readerName={this.state.selectedReaderName}
          notes={notesForAddNotesModal}
          onListReadersRefresh={() => {
            this.props.getReaderDetail(this.state.selectedReaderId);
            this.props.getListReaders();
          }}
          autoLoadNote
        />
        {updatingReader && (
          <UpdateReaderModal
            modelProps={{
              closeIcon: true,
              open: isOpenUpdateModal,
              onClose: () => {
                this.toggleSelectedAll({ checked: false });
                setTimeout(() => {
                  this.toggleUpdateModal();
                }, 200);
              },
            }}
            programId={programId}
            groupId={groupId}
            onListReadersRefresh={() => {
              // we will update redux store instead of refreshing list readers
            }}
            onDeleteReader={this.toggleDeleteModal}
            onCancel={() => {
              this.toggleSelectedAll({ checked: false });
              setTimeout(() => {
                this.toggleUpdateModal();
              }, 200);
            }}
            reader={updatingReader}
          />
        )}
      </div>
    );
  }
}

export default ManageReaders;
