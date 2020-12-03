import * as React from 'react';
import Modal from 'src/components/Modal';
import Heading, { HeadingColor } from 'src/components/Heading';
import { ModalProps, Grid } from 'semantic-ui-react';
import { IBookItem } from 'src/store/types';
import SearchBookItem from 'src/components/SearchBookItem';
import get from 'lodash/get';
import idx from 'idx';

export type Props = IComponentProps & {
  modelProps?: ModalProps;
  onRemoveBook?: (book: IBookItem) => any;
  onAddBookClicked?: () => any;
  books?: IBookItem[];
  hideAddBook?: boolean;
  loading?: boolean;
  itemLoading?: string;
  accessGroupByProgram?: any;
};

class GroupBookBankModal extends React.Component<Props> {
  static defaultProps = {
    modelProps: {},
  };

  render() {
    const {
      modelProps,
      books,
      classes,
      onRemoveBook,
      loading,
      itemLoading,
      accessGroupByProgram = {},
    } = this.props;
    let booksData = [];
    if (books.length > 0) {
      booksData = books.map(book => {
        return get(book, 'attributes.data') || book;
      });
    }
    const hideAddBook = !get(accessGroupByProgram, 'write', '');
    return (
      <Modal
        modelProps={modelProps}
        header={
          <Heading headingProps={{ as: 'h3' }} colorVariant={HeadingColor.MAIN}>
            Books
          </Heading>
        }>
        {!hideAddBook && (
          <div
            className={classes.addBookButton}
            onClick={this.props.onAddBookClicked}>
            + Add Book
          </div>
        )}
        <Grid className={classes.books}>
          {booksData && booksData.length > 0 ? (
            booksData.map((book, index) => {
              return !hideAddBook ? (
                <SearchBookItem
                  key={index}
                  isSelected
                  book={book}
                  onSelectBook={onRemoveBook}
                  hideAddBook={hideAddBook}
                  loading={book && itemLoading === book.id && loading}
                />
              ) : (
                <Grid.Row className={classes.row} key={index}>
                  <Grid.Column width={2}>
                    <div className={classes.bookImageWrapper}>
                      <div
                        className={classes.bookImage}
                        style={{
                          backgroundImage: `url('${idx(
                            book,
                            x => x.volumeInfo.imageLinks.thumbnail
                          )}')`,
                        }}
                      />
                    </div>
                  </Grid.Column>
                  <Grid.Column width={14}>
                    <div className={classes.bookName}>
                      {book.volumeInfo.title}
                    </div>
                    {idx(book, x => x.volumeInfo.authors[0]) && (
                      <div className={classes.bookAuthor}>
                        By {idx(book, x => x.volumeInfo.authors[0])}
                      </div>
                    )}
                  </Grid.Column>
                </Grid.Row>
              );
            })
          ) : (
            <Grid.Row className={classes.row}>
              <Grid.Column>There is no book in book bank.</Grid.Column>
            </Grid.Row>
          )}
        </Grid>
      </Modal>
    );
  }
}

export default GroupBookBankModal;
