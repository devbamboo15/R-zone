import * as React from 'react';
import Title from 'src/components/Title';
import UserSvg from 'src/assets/icons/user.svg';
import {
  Grid,
  Button as SemButton,
  Modal,
  Form,
  Icon,
} from 'semantic-ui-react';
import Heading, { HeadingColor, HeadingType } from 'src/components/Heading';
import Input from 'src/components/FormFields/Input';
import InfoColumn from 'src/components/InfoColumn';
import Label from 'src/components/FormFields/Label';
import Button, { ButtonColor, ButtonType } from 'src/components/Button';
import ScrollArea from 'react-scrollbar';
import PlusButtonSvg from 'src/assets/icons/plus.svg';
import PlusWithoutCircleSvg from 'src/assets/icons/plusWithoutCircle.svg';
import NoteSvg from 'src/assets/icons/note.svg';
import idx from 'idx';
// import URL from 'src/helpers/urls';
import { IProgram } from 'src/store/types/organizer/program';
import { IOrganizerGroup, IReaderItem } from 'src/store/types/common';
import find from 'lodash/find';
import get from 'lodash/get';
import findIndex from 'lodash/findIndex';
import filter from 'lodash/filter';
import orderBy from 'lodash/orderBy';
import * as moment from 'moment';
import AddReaderNoteModal from 'src/components/Modal/AddReaderNoteModal';
import { IBookItem } from 'src/store/types';
import AddBooksModal from 'src/components/Modal/AddBooksModal';
import { confirmModal } from 'src/components/Modal/ConfirmationModal';
import ReviewBookModal from 'src/components/Modal/ReviewBookModal';
import SaveIcon from 'assets/icons/save.svg';
// import EditIcon from 'assets/icons/edit.svg';
import InfoIcon from 'src/assets/icons/info_icon.svg';
import { Formik } from 'formik';
import * as Yup from 'yup';
import Footer from 'src/components/Footer';
import cx from 'classnames';
import Spinner from 'src/components/Spinner';
import HelperIcon from 'src/components/Helper/Icon';
import UpdateReaderModal from 'src/components/Modal/UpdateReaderModal';
import BulkDeleteReaderModal from 'src/components/Modal/BulkDeleteReaderModal';
import { RouteComponentProps } from 'react-router-dom';
import Select from 'src/components/FormFields/Select';
import urls from 'src/helpers/urls';
import history from 'src/helpers/history';
import AddEntry from './AddEntry';
import ReaderFeeds from './Feeds';
import Metrics from './Metrics';
import { getOptionData } from '../Setup/utils';
import { Role } from '../Signup/Steps/ZoneType';

export type ReaderAccountProps = IComponentProps &
  RouteComponentProps & {
    readerData?: any;
    forgetPassword?: any;
    program: IProgram;
    group: IOrganizerGroup;
    getReaderNotes?: Function;
    match?: any;
    getReader: Function;
    getReaderDetail: Function;
    getBooksReading: Function;
    getBooksFinished: Function;
    reReadBook: Function;
    onFinishBook: Function;
    doForgetPassword: Function;
    getReaderMetrics: Function;
    addReaderNoteLoading: boolean;
    readerMetricsLoading: boolean;
    booksReading: IBookItem[];
    booksFinished: IBookItem[];
    onAddBook: (
      book: IBookItem,
      readerId: any,
      groupId: any,
      readOnce: boolean,
      cb?: Function
    ) => any;
    onRemoveBook: (
      book: IBookItem,
      readerId: any,
      groupId: any,
      cb?: Function
    ) => any;
    updateReader: Function;
    updateReadersLoading: boolean;
    createReadingEntrySuccess: boolean;
    readerLoading: boolean;
    userAccessProgram?: any;
    child: any;
    doUpdateAccount: Function;
    profile?: any;
    profileLoading: boolean;
    getMeChild: Function;
    getMeChildDetails: Function;
    childLoading: boolean;
    childDetails: any;
    childDetailsLoading: boolean;
    onReaderChange: Function;
    role: any;
    mePrograms: any[];
    meProgramsLoading: boolean;
    profileId?: any;
    lastEntryData: any;
  };

interface ReaderAccountState {
  noteModal: boolean;
  addEntryModal: boolean;
  addNoteModal: boolean;
  activeBookTab: string;
  addBookModalOpen: boolean;
  addedBooks: IBookItem[];
  finishedBook?: IBookItem;
  reviewBookModalOpen: boolean;
  entryNumber: string | number;
  entryInputModal: boolean;
  updatePasswordModal: boolean;
  selectedBookId: string;
  currentMetric: string;
  isOpenUpdateModal: boolean;
  isOpenDeleteModal: boolean;
  updatingReader: IReaderItem | null;
  selectedReader: any;
  selectedGroup: any;
  selectedProgram: any;
}

const selectOption = (
  availableIds: any[],
  lastEntryId: string | number | null
) => {
  if (lastEntryId && availableIds.includes(lastEntryId)) {
    return lastEntryId;
  }
  if (availableIds.length) {
    return availableIds[0];
  }
  return null;
};

class ReaderAccount extends React.Component<
  ReaderAccountProps,
  ReaderAccountState
> {
  constructor(props) {
    super(props);
    this.state = {
      noteModal: false,
      addEntryModal: false,
      addNoteModal: false,
      activeBookTab: 'reading',
      addBookModalOpen: false,
      addedBooks: props.booksReading,
      finishedBook: undefined,
      reviewBookModalOpen: false,
      entryNumber: 0,
      entryInputModal: false,
      updatePasswordModal: false,
      selectedBookId: '',
      currentMetric: '',
      isOpenUpdateModal: false,
      isOpenDeleteModal: false,
      updatingReader: null,
      selectedGroup: null,
      selectedProgram: null,
      selectedReader: null,
    };
  }

  toggleAddBookModal = () => {
    this.setState(state => ({ addBookModalOpen: !state.addBookModalOpen }));
  };

  toggleEntryInputModal = () => {
    this.setState(state => ({ entryInputModal: !state.entryInputModal }));
  };

  toggleUpdatePasswordModal = () => {
    this.setState(state => ({
      updatePasswordModal: !state.updatePasswordModal,
    }));
  };

  onUpdateAccount = (passwordValues: any, cb: Function) => {
    const { doUpdateAccount } = this.props;
    doUpdateAccount(
      {
        oldPassword: passwordValues.old_password,
        newPassword: passwordValues.password,
        confirmPassword: passwordValues.password_confirmation,
      },
      cb
    );
  };

  onSelect = (book: IBookItem, readOnce?: boolean) => {
    const { onAddBook, onRemoveBook, profileId } = this.props;
    const { addedBooks, selectedGroup, selectedReader } = this.state;
    const index = findIndex(
      addedBooks,
      (item: IBookItem) => item.id === book.id
    );
    this.setState({
      selectedBookId: book.id,
    });
    if (index !== -1) {
      confirmModal.open({
        message: 'Are you sure you want to remove book',
        okButtonText: 'Remove',
        cancelButtonText: 'Cancel',
        onOkClick: () => {
          onRemoveBook(book, selectedReader || profileId, selectedGroup, () => {
            const newAddedBooks = filter(
              addedBooks,
              (item: IBookItem) => item.id !== book.id
            );
            this.setState({
              addedBooks: newAddedBooks,
            });
          });
        },
      });
    } else {
      onAddBook(
        book,
        selectedReader || profileId,
        selectedGroup,
        readOnce,
        () => {
          this.setState({
            addedBooks: [...addedBooks, book],
          });
        }
      );
    }
  };

  setActiveTab = type => {
    this.setState(() => ({ activeBookTab: type }));
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

  togglenoteModal = () =>
    this.setState(state => ({ noteModal: !state.noteModal }));

  toggleEntryModal = () =>
    this.setState(state => ({ addEntryModal: !state.addEntryModal }));

  toggleUpdateModal = () => {
    const { isOpenUpdateModal } = this.state;
    this.setState({ isOpenUpdateModal: !isOpenUpdateModal });
  };

  toggleDeleteModal = () => {
    const { isOpenDeleteModal } = this.state;
    this.setState({ isOpenDeleteModal: !isOpenDeleteModal });
  };

  setUpdatingReader = (reader: IReaderItem) => {
    this.toggleUpdateModal();
    this.setState({ updatingReader: reader });
  };

  handleOpenAddNoteModal = () => {
    const { match } = this.props;
    const readerId = get(match, 'params.readerId');
    this.props.getReaderDetail(readerId);
    this.setState({
      noteModal: true,
    });
  };

  onConfirmFinishBook = book => {
    const { onFinishBook, profileId } = this.props;
    const { selectedReader, selectedGroup } = this.state;
    onFinishBook(book, selectedReader || profileId, selectedGroup, () => {
      this.setState({
        finishedBook: book,
      });
      this.toggleReviewBookModal();
    });
  };

  toggleReviewBookModal = () => {
    this.setState(state => ({
      reviewBookModalOpen: !state.reviewBookModalOpen,
    }));
  };

  setSelectedReader = (value, cb?: Function) => {
    this.setState(
      { selectedReader: value, selectedProgram: null, selectedGroup: null },
      () => {
        if (cb) cb();
      }
    );
  };

  setSelectedProgram = (value, cb?: Function) => {
    const { child, childDetails, lastEntryData } = this.props;
    let optionData = getOptionData({}, child || [], childDetails || []);

    const programOptions = optionData.programOptions.slice(
      0,
      optionData.programOptions.length - 1
    );

    optionData = getOptionData(
      {
        program:
          value || (programOptions.length > 0 ? programOptions[0].value : null),
      },
      child || [],
      childDetails || []
    );

    const groupOptions = optionData.groupOptions.slice(
      0,
      optionData.groupOptions.length - 1
    );
    const newGroup = selectOption(
      groupOptions.map(x => x.value),
      get(lastEntryData, 'group')
    );

    this.setState({ selectedProgram: value, selectedGroup: newGroup }, () => {
      if (cb) cb();
    });
  };

  setSelectedGroup = (value, cb?: Function) => {
    this.setState({ selectedGroup: value }, () => {
      if (cb) cb();
    });
  };

  setSelectedProgramAndGroup = (valueProgram, valueGroup, cb?: Function) => {
    this.setState(
      { selectedGroup: valueGroup, selectedProgram: valueProgram },
      () => {
        if (cb) cb();
      }
    );
  };

  setDefaultProgramAndGroup = () => {
    const { child, childDetails, lastEntryData } = this.props;
    let optionData = getOptionData({}, child || [], childDetails || []);

    const programOptions = optionData.programOptions.slice(
      0,
      optionData.programOptions.length - 1
    );

    const newProgram = selectOption(
      programOptions.map(x => x.value),
      get(lastEntryData, 'program')
    );

    optionData = getOptionData(
      {
        program:
          newProgram ||
          (programOptions.length > 0 ? programOptions[0].value : null),
      },
      child || [],
      childDetails || []
    );
    const groupOptions = optionData.groupOptions.slice(
      0,
      optionData.groupOptions.length - 1
    );

    this.setSelectedProgramAndGroup(
      newProgram,
      selectOption(groupOptions.map(x => x.value), get(lastEntryData, 'group'))
    );
  };

  componentDidUpdate = prevProps => {
    const {
      createReadingEntrySuccess,
      child,
      childDetails,
      role,
      mePrograms,
      lastEntryData,
      onReaderChange,
    } = this.props;
    if (
      createReadingEntrySuccess &&
      prevProps.createReadingEntrySuccess !== createReadingEntrySuccess
    ) {
      this.toggleEntryModal();
    }

    if (role && role.id === Role.PARENT) {
      const optionData = getOptionData({}, child || [], childDetails || []);

      if (!this.state.selectedReader && child.length > 0) {
        const readerOptions = optionData.readerOptions.slice(
          0,
          optionData.readerOptions.length - 1
        );
        const readerOption = selectOption(
          readerOptions.map(x => x.value),
          get(lastEntryData, 'reader')
        );
        this.setSelectedReader(readerOption);
        onReaderChange(readerOption);
      }

      if (
        !this.state.selectedProgram &&
        childDetails &&
        childDetails.length > 0
      ) {
        this.setDefaultProgramAndGroup();
      }
    } else {
      let optionData = getOptionData({}, [], mePrograms || []);
      if (!this.state.selectedProgram && mePrograms && mePrograms.length > 0) {
        const programOptions = optionData.programOptions.slice(
          0,
          optionData.programOptions.length - 1
        );
        optionData = getOptionData(
          {
            program: programOptions.length > 0 ? programOptions[0].value : null,
          },
          child || [],
          mePrograms || []
        );
        const groupOptions = optionData.groupOptions.slice(
          0,
          optionData.groupOptions.length - 1
        );
        this.setSelectedProgramAndGroup(
          selectOption(
            programOptions.map(x => x.value),
            get(lastEntryData, 'program')
          ),
          selectOption(
            groupOptions.map(x => x.value),
            get(lastEntryData, 'group')
          )
        );
      }
    }
  };

  render() {
    const {
      noteModal,
      addEntryModal,
      addNoteModal,
      activeBookTab,
      addedBooks,
      finishedBook,
      updatePasswordModal,
      currentMetric,
      isOpenDeleteModal,
      isOpenUpdateModal,
      updatingReader,
      selectedReader,
      selectedProgram,
      selectedGroup,
    } = this.state;
    const {
      classes,
      readerData,
      // program,
      group,
      booksReading,
      booksFinished,
      updateReader,
      profileLoading,
      readerLoading,
      readerMetricsLoading,
      // userAccessProgram,
      child,
      childLoading,
      childDetailsLoading,
      childDetails,
      onReaderChange,
      role,
      profileId,
      mePrograms,
    } = this.props;
    const isParent = role && role.id === Role.PARENT;
    let readerOptions;
    let programOptions;
    let groupOptions;
    if (isParent) {
      let optionData = getOptionData({}, child || [], childDetails || []);
      readerOptions = optionData.readerOptions.slice(
        0,
        optionData.readerOptions.length - 1
      );
      programOptions = optionData.programOptions.slice(
        0,
        optionData.programOptions.length - 1
      );
      optionData = getOptionData(
        {
          program:
            selectedProgram ||
            (programOptions.length > 0 ? programOptions[0].value : null),
        },
        child || [],
        childDetails || []
      );
      groupOptions = optionData.groupOptions.slice(
        0,
        optionData.groupOptions.length - 1
      );
    } else {
      let optionData = getOptionData({}, [], mePrograms || []);

      programOptions = optionData.programOptions.slice(
        0,
        optionData.programOptions.length - 1
      );
      optionData = getOptionData(
        {
          program:
            selectedProgram ||
            (programOptions.length > 0 ? programOptions[0].value : null),
        },
        [],
        mePrograms || []
      );
      groupOptions = optionData.groupOptions.slice(
        0,
        optionData.groupOptions.length - 1
      );
    }
    const groupId: string = selectedGroup || '-1';
    // const groupName = idx(group, x => x.attributes.name);
    const groupMetricId = get(group, 'attributes.active_metric_id', '');
    let displayBooks =
      activeBookTab === 'reading' ? booksReading : booksFinished;
    displayBooks = (displayBooks || []).filter(
      (book: IBookItem) => Number(book.group_id) === Number(groupId)
    );
    let noBooksMessage = '';
    if (activeBookTab === 'reading' && displayBooks.length <= 0) {
      noBooksMessage = 'Book Bank is currently empty';
    } else if (activeBookTab !== 'reading' && displayBooks.length <= 0) {
      noBooksMessage = 'Finish some books';
    }
    const reader: any = idx(readerData, x => x.data.attributes) || {};
    const readerName = `${get(reader, 'first_name') || ''} ${get(
      reader,
      'last_name'
    ) || ''}`;
    const selectedUserId = get(readerData, 'data.id') || '';
    const programId = selectedProgram;
    const goalId = get(group, 'attributes.active_goal_id') || '';
    const included = idx(readerData, x => x.included) || [];
    const type = find(included, { type: 'role' });
    const readerType = idx(type, x => x.attributes.title);
    const readerId = selectedReader || profileId;
    const notes = filter(included, { type: 'note' });
    const notesForAddNotesModal = notes.map(note => {
      return get(note, 'attributes');
    });
    const notesSorted =
      orderBy(notes, ['attributes.created_at'], ['desc']) || [];
    const displayNote = notesSorted.length ? notesSorted[0] : null;
    const displayNoteData = idx(displayNote, x => x.attributes) || {};
    const noteFirstName =
      get(displayNoteData, 'created_by_user.first_name') || '';
    const noteLastName =
      get(displayNoteData, 'created_by_user.last_name') || '';
    const noteName = `${noteFirstName} ${noteLastName}`;
    const noteCreatedAt = get(displayNoteData, 'created_at') || null;
    const noteText = get(displayNoteData, 'note_text') || '';
    const updatePasswordInitialValues = {
      old_password: '',
      password: '',
      password_confirmation: '',
    };
    // const accessGroupByProgram = get(
    //   userAccessProgram,
    //   `group_by_program[${programId}][${groupId}]`,
    //   {}
    // );
    const passwordValidations: any = {};
    passwordValidations.old_password = Yup.string()
      .required('Old password is required')
      .min(8, 'Your password must be at least 8 characters long');
    passwordValidations.password = Yup.string()
      .required('Password is required')
      .min(8, 'Your password must be at least 8 characters long');
    passwordValidations.password_confirmation = Yup.string()
      .oneOf([Yup.ref('password'), null])
      .required('Password confirm is required');

    return (
      <div>
        <Grid verticalAlign="middle">
          <Grid.Column width={3}>
            <Title icon={<UserSvg height={25} />}>
              {`${get(reader, 'first_name', '')} ${get(
                reader,
                'last_name',
                ''
              )}`}
            </Title>
          </Grid.Column>
          <Grid.Column width={12}>
            <Grid>
              {isParent && (
                <Grid.Column width={3}>
                  <Select
                    selectProps={{
                      className: classes.selectHeader,
                      options: readerOptions,
                      placeholder: 'Reader',
                      value: selectedReader,
                      onChange: (_, data) => {
                        const value = get(data, 'value', '');
                        this.setSelectedReader(value, () => {
                          onReaderChange(value, () => {
                            this.setDefaultProgramAndGroup();
                          });
                        });
                      },
                    }}
                  />
                </Grid.Column>
              )}
              <Grid.Column width={3}>
                <Select
                  selectProps={{
                    className: classes.selectHeader,
                    options: programOptions,
                    placeholder: 'Program',
                    value: selectedProgram,
                    onChange: (_, data) => {
                      const value = get(data, 'value', '');
                      this.setSelectedProgram(value);
                    },
                  }}
                />
              </Grid.Column>
              <Grid.Column width={3}>
                <Select
                  selectProps={{
                    className: classes.selectHeader,
                    options: groupOptions,
                    placeholder: 'Group',
                    value: selectedGroup,
                    onChange: (_, data) => {
                      const value = get(data, 'value', '');
                      this.setSelectedGroup(value);
                    },
                  }}
                />
              </Grid.Column>
            </Grid>
          </Grid.Column>
        </Grid>
        {(readerLoading ||
          readerMetricsLoading ||
          childLoading ||
          childDetailsLoading) && <Spinner />}
        <Formik
          enableReinitialize
          initialValues={{
            first_name: idx(reader, x => x.first_name),
            last_name: idx(reader, x => x.last_name),
            school: idx(reader, x => x.school),
            library_card_number: idx(reader, x => x.library_card_number),
            birthday: idx(reader, x => x.birthday),
            email: idx(reader, x => x.email),
          }}
          onSubmit={values => {
            updateReader(readerId, values, () => {}, true);
          }}
          validationSchema={Yup.object().shape({
            first_name: Yup.string().required('First name is required'),
            last_name: Yup.string().required('Last name is required'),
          })}>
          {formProps => {
            const { values } = formProps;
            return (
              <form
                onSubmit={formProps.handleSubmit}
                className={classes.readerDetailWrapper}>
                <Grid>
                  <Grid.Column width={10}>
                    <Grid>
                      <Grid.Column width={4} className={classes.profilePicture}>
                        <div className={classes.name}>
                          <Heading colorVariant={HeadingColor.WHITE}>
                            {(reader.first_name || '').charAt(0)}
                            {(reader.last_name || '').charAt(0)}
                          </Heading>
                        </div>
                      </Grid.Column>
                      <Grid.Column width={16} className={classes.mainContent}>
                        <Heading
                          headingProps={{ as: 'h3' }}
                          colorVariant={HeadingColor.SECONDARY}
                          type={HeadingType.BOLD_600}>
                          Reader Information
                        </Heading>
                        <Grid columns={4} className={classes.formReaderDetail}>
                          <InfoColumn
                            label="School"
                            value={values.school}
                            fallbackNoRender
                          />
                          <InfoColumn
                            label="Library Card Number"
                            value={values.library_card_number}
                            fallbackNoRender
                          />
                          <InfoColumn
                            label="Reader Type"
                            value={readerType}
                            fallbackNoRender
                          />
                          <InfoColumn
                            label="Birthdate"
                            value={values.birthday}
                            fallbackNoRender
                          />
                          <InfoColumn
                            label="Email Address"
                            value={values.email}
                            fallbackNoRender
                          />
                        </Grid>
                        <Grid
                          columns={3}
                          className={classes.formReaderDetail}
                          verticalAlign="middle">
                          <Grid.Column verticalAlign="bottom">
                            <Label
                              classes={{
                                labelStyle: classes.label,
                              }}>
                              Password
                              <HelperIcon
                                style={{
                                  marginLeft: '10px',
                                  position: 'relative',
                                  top: '0px',
                                  left: '-5px',
                                  background: 'transparent',
                                }}
                                helperText={`Click "Update Password" to create a new password for this user.`}
                                content={<InfoIcon width={15} height={15} />}
                              />
                            </Label>
                            <div className={classes.buttonGroups}>
                              <Button
                                buttonProps={{
                                  onClick: this.toggleUpdatePasswordModal,
                                  type: 'button',
                                }}
                                colorVariant={ButtonColor.PRIMARY}
                                buttonType={ButtonType.ROUND}>
                                Update Password
                              </Button>
                            </div>
                          </Grid.Column>
                        </Grid>
                      </Grid.Column>
                    </Grid>
                    <Grid>
                      {readerId && selectedGroup && selectedProgram && (
                        <ReaderFeeds
                          readerId={readerId}
                          programId={selectedProgram}
                          groupId={selectedGroup}
                        />
                      )}
                    </Grid>
                  </Grid.Column>

                  <Grid.Column width={6}>
                    {readerId && (
                      <Metrics
                        readerId={readerId}
                        groupId={groupId}
                        metric={currentMetric.length ? currentMetric : null}
                        onChange={metricVal => {
                          this.setState({
                            currentMetric: metricVal,
                          });
                        }}
                      />
                    )}
                    <div className={cx(classes.right_bar, classes.bookBankTab)}>
                      <Heading
                        headingProps={{
                          as: 'h3',
                          className: classes.bookBankTabHeading,
                        }}
                        type={HeadingType.BOLD_600}>
                        Book Bank
                      </Heading>
                      <SemButton.Group className={classes.tab_group}>
                        <SemButton
                          onClick={() => this.setActiveTab('reading')}
                          type="button"
                          className={
                            activeBookTab === 'reading'
                              ? classes.reader_tab_active
                              : classes.simple_tab
                          }>
                          Books I'm Reading
                        </SemButton>
                        <SemButton
                          onClick={() => this.setActiveTab('finished')}
                          type="button"
                          className={
                            activeBookTab === 'finished'
                              ? classes.reader_tab_active
                              : classes.simple_tab
                          }>
                          Books I've Read
                        </SemButton>
                      </SemButton.Group>

                      <div>
                        <ScrollArea
                          speed={0.8}
                          className="area"
                          contentClassName="content"
                          horizontal={false}
                          style={{ height: 'calc(100vh - 450px)' }}>
                          {displayBooks.map((book: IBookItem, index: any) => {
                            const bookImg =
                              idx(
                                book,
                                x => x.volumeInfo.imageLinks.thumbnail
                              ) || '';
                            const booktitle =
                              idx(book, x => x.volumeInfo.title) || '';
                            const bookAuthor =
                              idx(book, x => x.volumeInfo.authors) || [];
                            const readOnce = get(book, 'read_once');
                            const readCount = get(book, 'read_count') || 0;
                            return (
                              <div className={classes.book_item} key={index}>
                                <div>
                                  <img
                                    alt="img"
                                    src={bookImg}
                                    style={{ width: 100 }}
                                  />
                                </div>
                                <div className={classes.book_item_right}>
                                  <div className={classes.headingWrapper}>
                                    <Heading
                                      headingProps={{ as: 'h5' }}
                                      type={HeadingType.BOLD_500}>
                                      {booktitle}
                                      {!!readCount && !readOnce && (
                                        <HelperIcon
                                          content={readCount}
                                          className={classes.readCount}
                                          helperText="Read Count"
                                        />
                                      )}
                                    </Heading>
                                    <Heading
                                      headingProps={{ as: 'h5' }}
                                      colorVariant={HeadingColor.GRAY}
                                      type={HeadingType.BOLD_500}>
                                      by {bookAuthor[0]}
                                    </Heading>
                                  </div>
                                  {true && (
                                    <>
                                      {activeBookTab === 'reading' ? (
                                        <>
                                          <div
                                            style={{
                                              display: 'flex',
                                              marginBottom: '15px',
                                            }}>
                                            {!readOnce && (
                                              <Button
                                                colorVariant={ButtonColor.CYAN}
                                                buttonType={ButtonType.ROUND}
                                                buttonProps={{
                                                  type: 'button',
                                                  onClick: () => {
                                                    confirmModal.open({
                                                      message: `Do you want to read again book "${idx(
                                                        book,
                                                        x => x.volumeInfo.title
                                                      )}"`,
                                                      okButtonText: 'Re-Read',
                                                      cancelButtonText:
                                                        'Cancel',
                                                      onOkClick: () => {
                                                        this.props.reReadBook(
                                                          readerId,
                                                          book
                                                        );
                                                      },
                                                    });
                                                  },
                                                }}>
                                                READ AGAIN
                                              </Button>
                                            )}
                                            <Button
                                              colorVariant={ButtonColor.CYAN}
                                              buttonType={ButtonType.ROUND}
                                              buttonProps={{
                                                type: 'button',
                                                onClick: () => {
                                                  confirmModal.open({
                                                    message: `Are you done reading "${idx(
                                                      book,
                                                      x => x.volumeInfo.title
                                                    )}"`,
                                                    okButtonText: 'Finish',
                                                    cancelButtonText: 'Cancel',
                                                    onOkClick: () => {
                                                      this.onConfirmFinishBook(
                                                        book
                                                      );
                                                    },
                                                  });
                                                },
                                              }}>
                                              FINISH BOOK
                                            </Button>
                                          </div>
                                          <div
                                            className={classes.deleteBookIcon}>
                                            <Icon
                                              name="trash alternate"
                                              className={cx(classes.item)}
                                              onClick={() => {
                                                this.setState(
                                                  state => ({
                                                    addedBooks: [
                                                      ...state.addedBooks,
                                                      book,
                                                    ],
                                                  }),
                                                  () => {
                                                    this.onSelect(book);
                                                  }
                                                );
                                              }}
                                            />
                                          </div>
                                        </>
                                      ) : (
                                        <div
                                          style={{
                                            display: 'flex',
                                            marginBottom: '15px',
                                          }}>
                                          <Button
                                            colorVariant={ButtonColor.CYAN}
                                            buttonType={ButtonType.ROUND}
                                            buttonProps={{
                                              type: 'button',
                                              onClick: () => {
                                                this.setState({
                                                  finishedBook: book,
                                                });
                                                this.toggleReviewBookModal();
                                              },
                                            }}>
                                            REVIEW BOOK
                                          </Button>
                                          <Button
                                            colorVariant={ButtonColor.DANGER}
                                            buttonType={ButtonType.ROUND}
                                            buttonProps={{
                                              type: 'button',
                                              onClick: () => {
                                                this.setState(
                                                  state => ({
                                                    addedBooks: [
                                                      ...state.addedBooks,
                                                      book,
                                                    ],
                                                  }),
                                                  () => {
                                                    this.onSelect(book);
                                                  }
                                                );
                                              },
                                            }}>
                                            REMOVE BOOK
                                          </Button>
                                        </div>
                                      )}
                                    </>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                          {displayBooks.length <= 0 && (
                            <Heading
                              headingProps={{
                                as: 'h4',
                                className: classes.noBooksMessage,
                              }}
                              type={HeadingType.BOLD_600}>
                              {activeBookTab === 'reading' ? (
                                <span className={classes.bookbankEmpty}>
                                  {noBooksMessage}
                                </span>
                              ) : (
                                noBooksMessage
                              )}
                            </Heading>
                          )}
                        </ScrollArea>
                        {true && (
                          <div className={classes.addBookBtn}>
                            <Button
                              buttonProps={{
                                fluid: true,
                                onClick: this.toggleAddBookModal,
                                type: 'button',
                              }}
                              icon={<PlusWithoutCircleSvg height={15} />}
                              colorVariant={ButtonColor.PRIMARY}
                              buttonType={ButtonType.ROUND}>
                              Add Book
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  </Grid.Column>
                  <Footer position="fixed">
                    <div className="bottomBar">
                      <div className={classes.bottomButtons}>
                        <Button
                          buttonProps={{
                            onClick: () => {
                              if (role) {
                                history.replace(urls.SETUP({ role: role.id }));
                              }
                            },
                            type: 'button',
                          }}
                          colorVariant={ButtonColor.PRIMARY}
                          buttonType={ButtonType.ROUND}
                          icon={<PlusButtonSvg height={20} />}>
                          Add Entry
                        </Button>
                      </div>
                    </div>
                  </Footer>
                </Grid>
              </form>
            );
          }}
        </Formik>

        {/* Add entry modal */}
        <Modal
          open={addEntryModal}
          dimmer="inverted"
          closeIcon
          onClose={this.toggleEntryModal}
          size="mini"
          className={classes.entryModal}>
          <AddEntry
            successCallback={() => {
              this.props.getReaderDetail(readerId, groupId);
              this.props.getReaderMetrics(
                readerId,
                groupId,
                currentMetric || 'overall'
              );
            }}
            readerId={readerId}
            goalId={goalId}
            groupId={groupId}
            groupMetricId={groupMetricId}
          />
        </Modal>

        {/* Note modal */}
        <Modal
          closeIcon
          open={noteModal}
          dimmer="inverted"
          onClose={this.togglenoteModal}
          size="mini">
          <div className={classes.noteModalContainer}>
            <div
              className={classes.noteHeading}
              style={{ marginBottom: '1.5rem' }}>
              <Heading
                headingProps={{
                  as: 'h4',
                }}>
                Reader Notes
              </Heading>
              {/* <div
                style={{
                  marginRight: '2rem',
                  marginTop: '-0.5rem',
                }}>
                <DeleteSvg2 height={20} />
              </div> */}
            </div>
            <div className={classes.noteFields}>
              <div>
                <div>Username</div>
                <Heading
                  headingProps={{
                    as: 'h5',
                    className: classes.noteFieldsContent,
                  }}
                  colorVariant={HeadingColor.CYAN}
                  type={HeadingType.NORMAL}>
                  {noteName}
                </Heading>
              </div>
              <div>
                <div>Timestamp</div>
                <Heading
                  headingProps={{
                    as: 'h5',
                    className: classes.noteFieldsContent,
                  }}
                  colorVariant={HeadingColor.CYAN}
                  type={HeadingType.NORMAL}>
                  {noteCreatedAt && moment(noteCreatedAt).format('YYYY-MM-DD')}
                </Heading>
              </div>
            </div>
            <div className={classes.noteDescription}>
              <div>Note Text</div>
              <div className={classes.noteDescription}>
                <Heading
                  headingProps={{
                    as: 'h5',
                  }}
                  colorVariant={HeadingColor.CYAN}
                  type={HeadingType.NORMAL}>
                  {noteText}
                </Heading>
              </div>
            </div>
            <Button
              buttonProps={{ onClick: this.openNoteModal, type: 'button' }}
              icon={<NoteSvg height={20} />}
              colorVariant={ButtonColor.PRIMARY}
              buttonType={ButtonType.ROUND}>
              Add Note
            </Button>
          </div>
        </Modal>
        {/* Add book modal */}
        <AddBooksModal
          modelProps={{
            size: 'small',
            open: this.state.addBookModalOpen,
            onClose: this.toggleAddBookModal,
            closeIcon: true,
          }}
          onSelectBook={(selectBook: IBookItem, readOne: boolean) =>
            this.onSelect(selectBook, readOne)
          }
          programId={programId}
          groupId={groupId}
          selectedBooks={addedBooks}
          itemLoading={this.state.selectedBookId}
        />

        {/* Review book modal */}
        {finishedBook && (
          <ReviewBookModal
            modelProps={{
              size: 'small',
              open: this.state.reviewBookModalOpen,
              onClose: this.toggleReviewBookModal,
              closeIcon: true,
            }}
            onCancel={this.toggleReviewBookModal}
            book={finishedBook}
            readerId={readerId}
          />
        )}

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
          userId={selectedUserId}
          notes={notesForAddNotesModal}
          onListReadersRefresh={() => {
            this.props.getReaderDetail(readerId);
          }}
          readerName={readerName}
        />

        {/* Update password modal */}
        <Modal
          closeIcon
          open={updatePasswordModal}
          dimmer="inverted"
          onClose={this.toggleUpdatePasswordModal}
          size="mini">
          <div
            className={cx(
              classes.noteModalContainer,
              classes.updatePasswordModalContent
            )}>
            <div
              className={classes.noteHeading}
              style={{ marginBottom: '1.5rem' }}>
              <Heading
                headingProps={{
                  as: 'h4',
                }}>
                Update password
              </Heading>
            </div>
            <div className={classes.noteFields}>
              <Formik
                initialValues={updatePasswordInitialValues}
                validationSchema={Yup.object().shape({
                  ...passwordValidations,
                })}
                onSubmit={values => {
                  this.onUpdateAccount(values, this.toggleUpdatePasswordModal);
                }}>
                {({
                  values,
                  errors,
                  handleChange,
                  handleBlur,
                  handleSubmit,
                  touched,
                  dirty,
                  isValid,
                  /* and other goodies */
                }) => (
                  <Form onSubmit={handleSubmit} style={{ width: '100%' }}>
                    <div className={classes.fullWidth}>
                      <Input
                        inputProps={{
                          placeholder: 'Old Password',
                          onChange: handleChange,
                          onBlur: handleBlur,
                          value: values.old_password,
                          type: 'password',
                          name: 'old_password',
                        }}
                        label="Old Password"
                      />
                      <div className={classes.error}>
                        {touched.old_password &&
                          (errors.old_password as string)}
                      </div>
                    </div>
                    <div className={classes.fullWidth}>
                      <Input
                        inputProps={{
                          placeholder: 'Password',
                          onChange: handleChange,
                          onBlur: handleBlur,
                          value: values.password,
                          type: 'password',
                          name: 'password',
                        }}
                        label="New Password"
                      />
                      <div className={classes.error}>
                        {touched.password && (errors.password as string)}
                      </div>
                    </div>
                    <div className={classes.fullWidth}>
                      <Input
                        inputProps={{
                          placeholder: 'New Password',
                          onChange: handleChange,
                          onBlur: handleBlur,
                          value: values.password_confirmation,
                          type: 'password',
                          name: 'password_confirmation',
                        }}
                        label="Confirm New Password"
                      />
                      <div className={classes.error}>
                        {touched.password_confirmation &&
                          (errors.password_confirmation as string)}
                      </div>
                    </div>
                    <div className={cx(classes.fullWidth, 'bottomBar')}>
                      <Button
                        buttonProps={{
                          onClick: () => {},
                          type: 'submit',
                          disabled: !dirty || !isValid,
                          loading: profileLoading,
                        }}
                        icon={<SaveIcon height={15} />}
                        colorVariant={ButtonColor.PRIMARY_COLOR}
                        buttonType={ButtonType.ROUND}>
                        Save
                      </Button>
                    </div>
                  </Form>
                )}
              </Formik>
            </div>
          </div>
        </Modal>

        <BulkDeleteReaderModal
          modelProps={{
            closeIcon: true,
            open: isOpenDeleteModal,
            size: 'small',
            onClose: this.toggleDeleteModal,
          }}
          selectedReaders={updatingReader ? [updatingReader] : []}
          onListReadersRefresh={() => {
            // if (this.state.isOpenUpdateModal === true) {
            //   this.toggleUpdateModal();
            // }
            this.props.history.goBack();
          }}
          onCancel={this.toggleDeleteModal}
        />

        {updatingReader && (
          <UpdateReaderModal
            modelProps={{
              closeIcon: true,
              open: isOpenUpdateModal,
              onClose: () => {
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
              setTimeout(() => {
                this.toggleUpdateModal();
              }, 200);
            }}
            afterUpdateReader={() => {
              this.props.getReaderDetail(readerId, groupId);
            }}
            reader={updatingReader}
          />
        )}
      </div>
    );
  }
}

export default ReaderAccount;
