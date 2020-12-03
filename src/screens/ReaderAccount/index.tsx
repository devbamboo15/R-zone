import themr from 'src/helpers/themr';
import { connect } from 'react-redux';
import { compose, lifecycle, withHandlers } from 'recompose';
import { IReduxState } from 'src/store/reducers';
import get from 'lodash/get';
import head from 'lodash/head';
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
} from 'src/store/actions/organizer/reader';
import { doForgetPassword, doUpdateAccount } from 'src/store/actions/auth';
import { createReadingEntry } from 'src/store/actions/group';
import {
  getMeChild,
  getMeChildDetails,
  getMeProgram,
} from 'src/store/actions/setup';
import idx from 'idx';
import { IBookItem } from 'src/store/types';
import ReaderAccount, { ReaderAccountProps } from './view';
import styles from './styles.scss';
import { Role } from '../Signup/Steps/ZoneType';

export default compose<ReaderAccountProps, ReaderAccountProps>(
  themr<ReaderAccountProps>('ReaderAccount', styles),
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
      const profileLoading = idx(state, x => x.auth.profile.inProgress);
      const profile = idx(state, x => x.auth.profile.data.attributes) || {};
      const role = head(
        idx(state, x => x.auth.profile.data.relationships.roles.data) || []
      );
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
      const child = idx(state, x => x.setup.child.data);
      const childLoading = idx(state, x => x.setup.child.loading);
      const childDetails = idx(state, x => x.setup.childDetails.data.programs);
      const childDetailsLoading = idx(state, x => x.setup.childDetails.loading);
      const mePrograms = idx(state, x => x.setup.programs.data);
      const meProgramsLoading = idx(state, x => x.setup.programs.loading);
      const lastEntryData = idx(state, x => x.setup.lastEntryData);
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
        profileId,
        profileLoading,
        profile,
        child,
        childLoading,
        childDetails,
        childDetailsLoading,
        role,
        mePrograms,
        meProgramsLoading,
        lastEntryData,
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
      doUpdateAccount,
      getMeChild,
      getMeChildDetails,
      getMeProgram,
    }
  ),
  withHandlers<any, any>({
    onFinishBook: (props: any) => (
      book: IBookItem,
      readerId: any,
      groupId: any,
      cb?: Function
    ) => {
      const bookId = book.id;
      props.finishBook(readerId, { id: bookId, group_id: groupId }, cb);
    },
    onRemoveBook: (props: any) => (
      book: IBookItem,
      readerId: any,
      groupId: any,
      cb?: Function
    ) => {
      const bookId = book.id;
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
      readerId: any,
      groupId: any,
      readOnce: boolean,
      cb?: Function
    ) => {
      const bookId = book.id;
      const data = {
        book,
        id: bookId,
        group_id: groupId,
        read_once: readOnce,
      };
      props.addBook(readerId, data, cb);
    },
    onReaderChange: (props: any) => (
      readerId: string | number,
      cb?: Function
    ) => {
      if (props.role && props.role.id === Role.PARENT) {
        props.getReader(readerId);
        props.getMeChildDetails(readerId).then(() => {
          if (cb) cb();
        });
        props.getReaderDetail(readerId);
        props.getBooksReading(readerId);
        props.getBooksFinished(readerId);
      } else {
        props.getReader(readerId);
        props.getMeProgram();
        props.getReaderDetail(readerId);
        props.getBooksReading(readerId);
        props.getBooksFinished(readerId);
      }
    },
  }),
  lifecycle<any, any>({
    componentDidMount() {
      const { profileId, role } = this.props;
      if (profileId) {
        if (role && role.id === Role.PARENT) {
          // const readerId: string = get(match, 'params.readerId');
          // const groupId: string = get(match, 'params.groupId');
          this.props.getMeChild();
          this.props.getReader(profileId);
          // this.props.getReaderDetail(profileId);
          // this.props.getBooksReading(profileId);
          // this.props.getBooksFinished(profileId);
        } else {
          this.props.onReaderChange(profileId);
        }
      }
    },
  })
)(ReaderAccount);
