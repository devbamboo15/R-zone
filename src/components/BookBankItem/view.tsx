import * as React from 'react';
import { Grid, Image } from 'semantic-ui-react';
import idx from 'idx';
import { IBookItem } from 'src/store/types';
import Button, { ButtonType, ButtonColor } from 'src/components/Button';
import get from 'lodash/get';
import HelperIcon from 'src/components/Helper/Icon';

export enum BookBankItemType {
  Reading = 'reading',
  Finished = 'finished',
}
export type Props = IComponentProps & {
  book: IBookItem;
  type?: BookBankItemType;
  isWriteAble?: boolean;
  onFinishBook?: (book: IBookItem) => any;
  onRemoveBook?: (book: IBookItem) => any;
  onReviewBook?: (book: IBookItem) => any;
  onReReadBook?: (book: IBookItem) => any;
};

class BookBankItem extends React.Component<Props> {
  static defaultProps = {
    type: BookBankItemType.Reading,
  };

  render() {
    const {
      classes,
      book,
      isWriteAble,
      onFinishBook,
      onRemoveBook,
      onReviewBook,
      onReReadBook,
      type,
    } = this.props;
    const readOnce = get(book, 'read_once') || false;
    const readCount = get(book, 'read_count') || 0;
    return (
      <Grid.Row className={classes.row}>
        <Grid.Column width={2}>
          <div className={classes.bookImageWrapper}>
            <Image
              size="small"
              src={idx(book, x => x.volumeInfo.imageLinks.thumbnail)}
            />
          </div>
        </Grid.Column>
        <Grid.Column width={14}>
          <div className={classes.bookName}>
            {idx(book, x => x.volumeInfo.title)}
            {!!readCount && !readOnce && (
              <HelperIcon
                content={readCount}
                className={classes.readCount}
                helperText="Read Count"
              />
            )}
          </div>
          {idx(book, x => x.volumeInfo.authors[0]) && (
            <div className={classes.bookAuthor}>
              {idx(book, x => x.volumeInfo.authors[0])}
            </div>
          )}
          {isWriteAble && (
            <div className={classes.buttons}>
              {type === BookBankItemType.Reading ? (
                <>
                  {!readOnce && (
                    <Button
                      buttonType={ButtonType.ROUND}
                      colorVariant={ButtonColor.SECONDARY}
                      buttonProps={{
                        onClick: () => {
                          onReReadBook(book);
                        },
                      }}>
                      Read again
                    </Button>
                  )}
                  <Button
                    buttonType={ButtonType.ROUND}
                    colorVariant={ButtonColor.SECONDARY}
                    buttonProps={{
                      onClick: () => {
                        onFinishBook(book);
                      },
                    }}>
                    Finish book
                  </Button>
                  <Button
                    buttonType={ButtonType.ROUND}
                    colorVariant={ButtonColor.DANGER}
                    buttonProps={{
                      onClick: () => {
                        onRemoveBook(book);
                      },
                    }}>
                    Remove book
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    buttonType={ButtonType.ROUND}
                    colorVariant={ButtonColor.SECONDARY}
                    buttonProps={{
                      onClick: () => {
                        onReviewBook(book);
                      },
                    }}>
                    Review this book
                  </Button>
                  <Button
                    buttonType={ButtonType.ROUND}
                    colorVariant={ButtonColor.DANGER}
                    buttonProps={{
                      onClick: () => {
                        onRemoveBook(book);
                      },
                    }}>
                    Remove book
                  </Button>
                </>
              )}
            </div>
          )}
        </Grid.Column>
      </Grid.Row>
    );
  }
}

export default BookBankItem;
