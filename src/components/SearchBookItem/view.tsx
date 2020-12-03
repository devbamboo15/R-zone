import * as React from 'react';
import { Grid } from 'semantic-ui-react';
import idx from 'idx';
import { IBookItem } from 'src/store/types';
import Button, { ButtonType, ButtonColor } from 'src/components/Button';

export type Props = IComponentProps & {
  book: IBookItem;
  isSelected: boolean;
  onSelectBook: (book: IBookItem, readOnce?: boolean) => any;
  hideAddBook?: boolean;
  fromBookBankButton?: boolean;
  loading?: boolean;
};

interface IStates {
  addBookId: string;
}

class SearchBookItem extends React.Component<Props, IStates> {
  constructor(props) {
    super(props);
    this.state = {
      addBookId: '',
    };
  }

  render() {
    const {
      classes,
      book,
      isSelected,
      onSelectBook,
      hideAddBook,
      fromBookBankButton,
      loading,
    } = this.props;
    const { addBookId } = this.state;

    return (
      <Grid.Row className={classes.row}>
        <Grid.Column width={3}>
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
        <Grid.Column width={13}>
          <div className={classes.bookName}>{book.volumeInfo.title}</div>
          {idx(book, x => x.volumeInfo.authors[0]) && (
            <div className={classes.bookAuthor}>
              By {idx(book, x => x.volumeInfo.authors[0])}
            </div>
          )}
          {!hideAddBook &&
            (isSelected ? (
              <Button
                buttonType={ButtonType.ROUND}
                colorVariant={ButtonColor.DANGER}
                buttonProps={{
                  onClick: () => {
                    onSelectBook(book);
                  },
                  loading,
                }}>
                {'Remove Book'}
              </Button>
            ) : fromBookBankButton ? (
              <>
                {!addBookId ? (
                  <Button
                    buttonType={ButtonType.ROUND}
                    colorVariant={ButtonColor.MAIN}
                    buttonProps={{
                      onClick: () => {
                        this.setState({
                          addBookId: book.id,
                        });
                      },
                      loading,
                    }}>
                    {'Add Book'}
                  </Button>
                ) : (
                  <div style={{ display: 'flex' }}>
                    <Button
                      buttonType={ButtonType.ROUND}
                      colorVariant={ButtonColor.MAIN}
                      buttonProps={{
                        onClick: () => {
                          book.read_once = true;
                          onSelectBook(book, true);
                        },
                        loading,
                      }}>
                      {'Read Once'}
                    </Button>
                    <Button
                      buttonType={ButtonType.ROUND}
                      colorVariant={ButtonColor.MAIN}
                      buttonProps={{
                        onClick: () => {
                          book.read_once = false;
                          onSelectBook(book, false);
                        },
                        loading,
                      }}>
                      {'Re-Read'}
                    </Button>
                  </div>
                )}
              </>
            ) : (
              // <Button
              //   buttonType={ButtonType.ROUND}
              //   colorVariant={ButtonColor.MAIN}
              //   buttonProps={{
              //     onClick: () => {
              //       onSelectBook(book, true);
              //     },
              //     loading,
              //   }}>
              //   {'Add Book'}
              // </Button>
              <>
                {!addBookId ? (
                  <Button
                    buttonType={ButtonType.ROUND}
                    colorVariant={ButtonColor.MAIN}
                    buttonProps={{
                      onClick: () => {
                        this.setState({
                          addBookId: book.id,
                        });
                      },
                      loading,
                    }}>
                    {'Add Book'}
                  </Button>
                ) : (
                  <div style={{ display: 'flex' }}>
                    <Button
                      buttonType={ButtonType.ROUND}
                      colorVariant={ButtonColor.MAIN}
                      buttonProps={{
                        onClick: () => {
                          book.read_once = true;
                          onSelectBook(book, true);
                        },
                        loading,
                      }}>
                      {'Read Once'}
                    </Button>
                    <Button
                      buttonType={ButtonType.ROUND}
                      colorVariant={ButtonColor.MAIN}
                      buttonProps={{
                        onClick: () => {
                          book.read_once = false;
                          onSelectBook(book, false);
                        },
                        loading,
                      }}>
                      {'Re-Read'}
                    </Button>
                  </div>
                )}
              </>
            ))}
        </Grid.Column>
      </Grid.Row>
    );
  }
}

export default SearchBookItem;
