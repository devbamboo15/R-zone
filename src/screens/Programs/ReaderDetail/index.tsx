import themr from 'src/helpers/themr';
import { connect } from 'react-redux';
import { compose, lifecycle, withHandlers } from 'recompose';
import { IReduxState } from 'src/store/reducers';
import get from 'lodash/get';
import find from 'lodash/find';
import {
  getReader,
  getReaderDetail,
  getReaderNotes,
  getBooksReading,
  getBooksFinished,
  addBook,
  deleteBook,
  finishBook,
  updateReader,
  reReadBook,
  getReaderMetrics,
  getAllReaders,
} from 'src/store/actions/organizer/reader';
import { getUserQuestions } from 'src/store/actions/organizer/questions';
import { doForgetPassword } from 'src/store/actions/auth';
import { createReadingEntry } from 'src/store/actions/group';
import idx from 'idx';
import { IBookItem } from 'src/store/types';
import Readers, { ReaderDetailProps } from './ReaderDetail';
import styles from '../styles.scss';

export default compose<ReaderDetailProps, ReaderDetailProps>(
  themr<ReaderDetailProps>('ReaderDeail', styles),
  connect(
    (state: IReduxState, ownProps: any) => {
      const { match } = ownProps;
      const readerData = idx(state, x => x.organizer.reader.readerDetail.data);
      const readerLoading = idx(
        state,
        x => x.organizer.reader.readerDetail.loading
      );
      const programId: string = get(match, 'params.programId');
      const groupId: string = get(match, 'params.groupId');
      const readerId: string = get(match, 'params.readerId');
      const programs = idx(state, x => x.organizer.program.programs.data) || [];
      const groups = idx(
        state,
        x => x.organizer.group.programGroups[programId].data
      );
      const addReaderNoteLoading = idx(
        state,
        x => x.organizer.reader.addReaderNote.loading
      );
      const booksReading = idx(
        state,
        x => x.organizer.reader.booksReading.data
      );
      const booksFinished = idx(
        state,
        x => x.organizer.reader.booksFinished.data
      );
      const updateReadersLoading = idx(
        state,
        x => x.organizer.reader.updateReader[readerId].loading
      );
      const readerMetricsLoading = idx(
        state,
        x => x.organizer.reader.readerMetrics.loading
      );
      const createReadingEntrySuccess = idx(
        state,
        x => x.group.createReadingEntry.success
      );
      const profileId = idx(state, x => x.auth.profile.data.id);
      const organizationId = idx(
        state,
        x => x.auth.profile.data.relationships.organization.data.id
      );
      const access = idx(state, x => x.organizer.users.usersAccess.data);
      const userAccessProgram = get(
        access,
        `access.${profileId}[0].attributes.access.${organizationId}`,
        {}
      );
      const userQuestions = idx(
        state,
        x => x.organizer.questions.userQuestions.data
      );
      const userQuestionsLoading = idx(
        state,
        x => x.organizer.questions.userQuestions.loading
      );
      const readers =
        idx(state, x => x.organizer.reader.readers[groupId].data) || [];
      return {
        createReadingEntrySuccess,
        readerData,
        readerLoading,
        addReaderNoteLoading,
        readerMetricsLoading,
        booksReading,
        booksFinished,
        group: find(groups, { id: groupId }) || {},
        program: find(programs, { id: programId }) || {},
        updateReadersLoading,
        forgetPassword: idx(state, x => x.auth.forget_password) || {},
        userAccessProgram,
        readers,
        userQuestions,
        userQuestionsLoading,
      };
    },
    {
      getReader,
      getReaderDetail,
      getReaderNotes,
      getBooksReading,
      getBooksFinished,
      addBook,
      finishBook,
      deleteBook,
      updateReader,
      createReadingEntry,
      reReadBook,
      doForgetPassword,
      getReaderMetrics,
      getAllReaders,
      getUserQuestions,
    }
  ),
  withHandlers<any, any>({
    onFinishBook: (props: any) => (book: IBookItem, cb?: Function) => {
      const bookId = book.id;
      const readerId = get(props, 'match.params.readerId');
      const groupId = get(props, 'match.params.groupId');
      props.finishBook(readerId, { id: bookId, group_id: groupId }, cb);
    },
    onRemoveBook: (props: any) => (book: IBookItem, cb?: Function) => {
      const bookId = book.id;
      const readerId = get(props, 'match.params.readerId');
      const groupId = get(props, 'match.params.groupId');
      props.deleteBook(
        readerId,
        bookId,
        {
          group_id: Number(groupId),
        },
        cb
      );
    },
    onAddBook: (props: any) => (
      book: IBookItem,
      readOnce: boolean,
      cb?: Function
    ) => {
      const bookId = book.id;
      const readerId = get(props, 'match.params.readerId');
      const groupId = get(props, 'match.params.groupId');
      const data = {
        book,
        id: bookId,
        group_id: groupId,
        read_once: readOnce,
      };
      props.addBook(readerId, data, cb);
    },
  }),
  lifecycle<any, any>({
    componentDidMount() {
      const { match } = this.props;
      const readerId: string = get(match, 'params.readerId');
      const groupId: string = get(match, 'params.groupId');
      this.props.getReader(readerId);
      this.props.getReaderDetail(readerId, groupId);
      this.props.getBooksReading(readerId);
      this.props.getBooksFinished(readerId);
      this.props.getAllReaders({
        programId: idx(match, x => x.params.programId),
        groupId,
        order: 'first_name|asc',
      });
      this.props.getUserQuestions(readerId);
    },
  })
)(Readers);
