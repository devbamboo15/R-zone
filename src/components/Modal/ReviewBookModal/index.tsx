import {
  compose,
  withState,
  withHandlers,
  lifecycle,
  withPropsOnChange,
} from 'recompose';
import themr from 'src/helpers/themr';
import { IReduxState } from 'src/store/reducers';
import { connect } from 'react-redux';
import idx from 'idx';
import { get } from 'lodash';
import { reviewBook, getBook } from 'src/store/actions/organizer/reader';
import { IReviewBookData } from 'src/api';
import ReviewBookModal, {
  ReviewBookModalProps,
  ReviewBookModalOutProps,
} from './view';
import styles from './styles.scss';

export default compose<ReviewBookModalProps, ReviewBookModalOutProps>(
  themr<ReviewBookModalProps>('ReviewBookModal', styles),
  connect(
    (state: IReduxState) => {
      const reviewBookLoading = idx(
        state,
        x => x.organizer.reader.reviewBook.loading
      );
      const reader = get(state, 'organizer.reader.reader.data.user_data', {});
      const bookData = idx(state, x => x.organizer.reader.book.data);
      const getBookLoading = idx(state, x => x.organizer.reader.book.loading);
      return {
        reviewBookLoading,
        getBookLoading,
        bookData,
        reader,
      };
    },
    {
      reviewBook,
      getBook,
    }
  ),
  withState('reviewText', 'setReviewText', ({ bookData }) =>
    get(bookData, 'included.0.attributes.review', '')
  ),
  withState('rating', 'setRating', ({ bookData }) =>
    get(bookData, 'included.0.attributes.rating', 0)
  ),
  withPropsOnChange(['bookData'], (props: any) => {
    const { bookData, setReviewText, setRating } = props;
    setReviewText(get(bookData, 'included.0.attributes.review', ''));
    setRating(get(bookData, 'included.0.attributes.rating', 0));
  }),
  withHandlers<any, any>({
    onSave: (props: any) => () => {
      const { book, rating, reviewText, reader, readerId } = props;
      const bookId = book.id;
      const readerIdData = reader.id || readerId;
      props.reviewBook(
        readerIdData,
        bookId,
        {
          review: reviewText,
          rating,
        } as IReviewBookData,
        () => {
          props.onCancel();
        }
      );
    },
  }),
  lifecycle<any, any>({
    async componentDidMount() {
      const { reader, readerId } = this.props;
      const readerIdData = reader.id || readerId;
      const bookId = get(this.props, 'book.id', null);
      if (bookId) {
        await this.props.getBook(readerIdData, bookId);
      }
    },
    async componentWillReceiveProps(nextProps) {
      if (
        get(this.props, 'book.id', null) !== get(nextProps, 'book.id', null)
      ) {
        const { reader, readerId } = this.props;
        const readerIdData = reader.id || readerId;
        const bookId = get(nextProps, 'book.id', null);
        await this.props.getBook(readerIdData, bookId);
      }
    },
  })
)(ReviewBookModal);
