import * as React from 'react';
import { Grid, Divider } from 'semantic-ui-react';
import { size, findIndex, map, filter, get, isEqual } from 'lodash';
import AddBooksModal, {
  AddBooksType,
} from 'src/components/Modal/AddBooksModal';
import ReviewBookModal from 'src/components/Modal/ReviewBookModal';
import Button, { ButtonColor, ButtonType } from 'src/components/Button';
import { IReaderItem } from 'src/store/types/common';
import Heading, { HeadingType, HeadingColor } from 'src/components/Heading';
import { IBookItem } from 'src/store/types';
import { confirmModal } from 'src/components/Modal/ConfirmationModal';
import BookBankItem, { BookBankItemType } from 'src/components/BookBankItem';
import idx from 'idx';
import Select from 'src/components/FormFields/Select';
import { IProgram } from 'src/store/types/organizer/program';
import { IDeleteBookData } from 'src/api';
import toast from 'src/helpers/Toast';

export enum BookBankType {
  Reading = 'reading',
  Finished = 'finish',
}
export type BookBankProps = IComponentProps & {
  booksReading: IBookItem[];
  booksFinished: IBookItem[];
  onFinishBook: (book: IBookItem, cb?: Function) => any;
  reReadBook: (
    readerId: string | number,
    book: IBookItem,
    cb?: Function
  ) => any;
  onRemoveBook: (book: IBookItem, data?: IDeleteBookData, cb?: Function) => any;
  onAddBook: (
    book: IBookItem,
    groupId: string | number,
    readOnce: boolean,
    cb?: Function
  ) => any;
  programs: IProgram[];
  isWriteAble?: boolean;
};
export type BookBankPropsOutProps = IComponentProps & {
  reader: IReaderItem;
  isWriteAble?: boolean;
};
export interface BookBankState {
  activeBookBank: BookBankType;
  addBookModalOpen: boolean;
  reviewBookModalOpen: boolean;
  bookReviewing: IBookItem | null;
  bookFinishing: IBookItem | null;
  bookDeleting: IBookItem | null;
  program: any;
  addedBooks: IBookItem[];
  programSelectFocus: boolean;
}
class BookBank extends React.Component<
  BookBankProps & BookBankPropsOutProps,
  BookBankState
> {
  constructor(props) {
    super(props);
    this.state = {
      activeBookBank: BookBankType.Reading,
      addBookModalOpen: false,
      reviewBookModalOpen: false,
      bookReviewing: null,
      bookFinishing: null,
      bookDeleting: null,
      program: null,
      addedBooks: props.booksReading,
      programSelectFocus: false,
    };
  }

  componentWillReceiveProps(nextProps) {
    if (
      isEqual(get(this.props, 'booksReading'), get(nextProps, 'booksReading'))
    ) {
      this.setState({
        addedBooks: get(nextProps, 'booksReading', []),
      });
    }
  }

  toggleAddBookModal = () => {
    this.setState(state => ({ addBookModalOpen: !state.addBookModalOpen }));
  };

  toggleReviewBookModal = () => {
    this.setState(state => ({
      reviewBookModalOpen: !state.reviewBookModalOpen,
    }));
  };

  onSetActiveBookBank = (activeBookBank: BookBankType) => {
    this.setState({ activeBookBank });
  };

  onConfirmFinishBook = () => {
    const { onFinishBook } = this.props;
    const { bookFinishing } = this.state;
    onFinishBook(bookFinishing, () => {
      this.setState({
        bookReviewing: bookFinishing,
      });
      this.toggleReviewBookModal();
    });
  };

  onConfirmRemoveBook = () => {
    const { onRemoveBook } = this.props;
    const { bookDeleting } = this.state;
    onRemoveBook(bookDeleting, {
      group_id: Number(get(bookDeleting, 'group_id', '')),
    });
  };

  onReviewBook = (book: IBookItem) => {
    this.setState({
      bookReviewing: book,
    });
    this.toggleReviewBookModal();
  };

  selectProgram = (program: any) => {
    this.setState({ program });
  };

  onSelectBookWithGroup = (
    book: IBookItem,
    groupId: string | number,
    readOnce?: boolean
  ) => {
    const { onAddBook, onRemoveBook } = this.props;
    const { addedBooks } = this.state;
    const index = findIndex(
      addedBooks,
      (item: IBookItem) => item.id === book.id
    );
    if (index !== -1) {
      confirmModal.open({
        message: 'Are you sure you want to remove book',
        okButtonText: 'Remove',
        cancelButtonText: 'Cancel',
        onOkClick: () => {
          onRemoveBook(book, { group_id: Number(groupId) }, () => {
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
      onAddBook(book, groupId, readOnce, () => {
        this.setState({
          addedBooks: [...addedBooks, book],
        });
      });
    }
  };

  render() {
    const {
      classes,
      booksReading,
      booksFinished,
      programs,
      reader,
      isWriteAble,
    } = this.props;
    const {
      activeBookBank,
      bookReviewing,
      program,
      addedBooks,
      programSelectFocus,
    } = this.state;
    const readerId = get(reader, 'user_id');
    const programOptions = filter(
      programs,
      (item: any) => get(item, 'relationships.groups.data.length') > 0
    ).map((item: any) => ({
      value: item.id,
      text: item.attributes.name,
    }));
    return (
      <div>
        <Grid>
          <Grid.Row>
            <Grid.Column width={6}>
              <Select
                selectProps={{
                  value: program,
                  options: programOptions,
                  name: 'program',
                  placeholder: 'Program',
                  onChange: (_, { value }) => this.selectProgram(value),
                  className:
                    programSelectFocus && !program ? classes.errorField : '',
                }}
              />
            </Grid.Column>
          </Grid.Row>
          <Grid.Row columns={2}>
            <Grid.Column width={8}>
              <div className={classes.bookBankButtons}>
                <Button
                  colorVariant={
                    activeBookBank === BookBankType.Reading
                      ? ButtonColor.SECONDARY
                      : ButtonColor.GRAY
                  }
                  buttonType={ButtonType.ROUND}
                  buttonProps={{
                    type: 'button',
                    onClick: () =>
                      this.onSetActiveBookBank(BookBankType.Reading),
                  }}>
                  Currently Reading
                </Button>
                {` `}
                <Button
                  colorVariant={
                    activeBookBank === BookBankType.Finished
                      ? ButtonColor.SECONDARY
                      : ButtonColor.GRAY
                  }
                  buttonType={ButtonType.ROUND}
                  buttonProps={{
                    type: 'button',
                    onClick: () =>
                      this.onSetActiveBookBank(BookBankType.Finished),
                  }}>
                  Books Finished
                </Button>
              </div>
            </Grid.Column>
            {isWriteAble && (
              <Grid.Column width={8} textAlign="right">
                <Button
                  colorVariant={ButtonColor.SECONDARY}
                  buttonType={ButtonType.ROUND}
                  buttonProps={{
                    type: 'button',
                    onClick: () => {
                      if (!program) {
                        this.setState({
                          programSelectFocus: true,
                        });
                        toast.error('You must to select 1 program first');
                      } else {
                        this.toggleAddBookModal();
                      }
                    },
                  }}>
                  + Add Book
                </Button>
              </Grid.Column>
            )}
          </Grid.Row>
        </Grid>

        <Divider />

        {/* reading books */}
        {activeBookBank === BookBankType.Reading && (
          <Grid className={classes.bookList}>
            {size(booksReading) !== 0 ? (
              map(booksReading, (bookItem: IBookItem, index: any) => (
                <BookBankItem
                  isWriteAble={isWriteAble}
                  book={bookItem}
                  onFinishBook={(finishBook: IBookItem) => {
                    this.setState({ bookFinishing: finishBook });
                    confirmModal.open({
                      message: `Are you done reading "${idx(
                        finishBook,
                        x => x.volumeInfo.title
                      )}"`,
                      okButtonText: 'Finish',
                      cancelButtonText: 'Cancel',
                      onOkClick: this.onConfirmFinishBook,
                    });
                  }}
                  onRemoveBook={(removeBook: IBookItem) => {
                    this.setState({ bookDeleting: removeBook });
                    confirmModal.open({
                      message: 'Are you sure you want to remove book',
                      okButtonText: 'Remove',
                      cancelButtonText: 'Cancel',
                      onOkClick: this.onConfirmRemoveBook,
                    });
                  }}
                  onReReadBook={(book: IBookItem) => {
                    confirmModal.open({
                      message: 'Do you want to read this book again',
                      okButtonText: 'Re-Read',
                      cancelButtonText: 'Cancel',
                      onOkClick: () => {
                        this.props.reReadBook(readerId, book);
                      },
                    });
                  }}
                  key={index}
                  type={BookBankItemType.Reading}
                />
              ))
            ) : (
              <div style={{ paddingBottom: '20px' }}>
                <Heading
                  headingProps={{ as: 'h3' }}
                  colorVariant={HeadingColor.SECONDARY}
                  type={HeadingType.BOLD_500}>
                  Book bank is empty.
                </Heading>
              </div>
            )}
          </Grid>
        )}

        {/* finished books */}
        {activeBookBank === BookBankType.Finished && (
          <Grid className={classes.bookList}>
            {size(booksFinished) !== 0 ? (
              map(booksFinished, (bookItem: IBookItem, index: any) => (
                <BookBankItem
                  book={bookItem}
                  onReviewBook={this.onReviewBook}
                  key={index}
                  type={BookBankItemType.Finished}
                  onRemoveBook={(removeBook: IBookItem) => {
                    this.setState({ bookDeleting: removeBook });
                    confirmModal.open({
                      message: 'Are you sure you want to remove book',
                      okButtonText: 'Remove',
                      cancelButtonText: 'Cancel',
                      onOkClick: this.onConfirmRemoveBook,
                    });
                  }}
                />
              ))
            ) : (
              <Heading
                headingProps={{ as: 'h3' }}
                colorVariant={HeadingColor.SECONDARY}
                type={HeadingType.BOLD_500}>
                Empty list
              </Heading>
            )}
          </Grid>
        )}
        <AddBooksModal
          modelProps={{
            size: 'small',
            open: this.state.addBookModalOpen,
            onClose: this.toggleAddBookModal,
            closeIcon: true,
          }}
          onSelectBookWithGroup={(
            selectBook: IBookItem,
            groupId: string | number,
            readOnce: boolean
          ) => this.onSelectBookWithGroup(selectBook, groupId, readOnce)}
          programId={program}
          type={AddBooksType.reader}
          selectedBooks={addedBooks}
        />
        {bookReviewing && (
          <ReviewBookModal
            modelProps={{
              size: 'small',
              open: this.state.reviewBookModalOpen,
              onClose: this.toggleReviewBookModal,
            }}
            onCancel={this.toggleReviewBookModal}
            book={bookReviewing}
          />
        )}
      </div>
    );
  }
}
export default BookBank;
