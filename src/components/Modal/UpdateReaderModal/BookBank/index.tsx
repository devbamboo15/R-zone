import { compose, withHandlers, lifecycle } from 'recompose';
import themr from 'src/helpers/themr';
import { IReduxState } from 'src/store/reducers';
import { connect } from 'react-redux';
import { get } from 'lodash';
import idx from 'idx';
import {
  getBooksReading,
  getBooksFinished,
  addBook,
  deleteBook,
  finishBook,
  reReadBook,
} from 'src/store/actions/organizer/reader';
import { IDeleteBookData } from 'src/api';
import { IBookItem } from 'src/store/types';
import BookBank, { BookBankProps, BookBankPropsOutProps } from './view';
import styles from './styles.scss';

export default compose<BookBankProps, BookBankPropsOutProps>(
  themr<BookBankProps>('BookBank', styles),
  connect(
    (state: IReduxState) => {
      const addBookLoading = get(
        state,
        'organizer.reader.addBook.loading',
        false
      );
      const booksReading = get(state, 'organizer.reader.booksReading.data', []);
      const booksFinished = get(
        state,
        'organizer.reader.booksFinished.data',
        []
      );
      const programs = idx(state, x => x.organizer.program.programs.data);
      return {
        programs,
        addBookLoading,
        booksReading,
        booksFinished,
      };
    },
    {
      getBooksReading,
      getBooksFinished,
      addBook,
      deleteBook,
      finishBook,
      reReadBook,
    }
  ),
  withHandlers<any, any>({
    onFinishBook: (props: any) => (book: IBookItem, cb?: Function) => {
      const readerId = get(props, 'reader.user_id');
      props.finishBook(readerId, book, cb);
    },
    onRemoveBook: (props: any) => (
      book: IBookItem,
      data?: IDeleteBookData,
      cb?: Function
    ) => {
      const bookId = book.id;
      const readerId = get(props, 'reader.user_id');
      props.deleteBook(readerId, bookId, data, cb);
    },
    onAddBook: (props: any) => (
      book: IBookItem,
      groupId: string | number,
      readOnce?: boolean,
      cb?: Function
    ) => {
      const bookId = book.id;
      const readerId = get(props, 'reader.user_id');
      const data = {
        book,
        id: bookId,
        group_id: groupId,
        read_once: !!readOnce,
      };
      props.addBook(readerId, data, cb);
    },
  }),
  lifecycle<any, any>({
    async componentDidMount() {
      const readerId = get(this.props, 'reader.user_id');
      await this.props.getBooksReading(readerId);
      this.props.getBooksFinished(readerId);
    },
    async componentWillReceiveProps(nextProps) {
      if (
        get(this.props, 'reader.user_id') !== get(nextProps, 'reader.user_id')
      ) {
        const readerId = get(nextProps, 'reader.user_id');
        await this.props.getBooksReading(readerId);
        this.props.getBooksFinished(readerId);
      }
    },
  })
)(BookBank);
