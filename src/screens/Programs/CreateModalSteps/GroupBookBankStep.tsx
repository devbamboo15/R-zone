import * as React from 'react';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import { Grid, Icon } from 'semantic-ui-react';
import themr from 'src/helpers/themr';
import Button, { ButtonColor, ButtonType } from 'src/components/Button';
import MessageBox from 'src/components/MessageBox';
import Input from 'src/components/FormFields/Input';
import { searchBooks } from 'src/store/actions/bookbank';
import { IReduxState } from 'src/store/reducers';
import idx from 'idx';
import { IBookItem } from 'src/store/types';
import Spinner from 'src/components/Spinner';
import SearchBookItem from 'src/components/SearchBookItem';
import cn from 'classnames';
import styles from './styles.scss';

type GroupBookBankStepProps = IComponentProps & {
  jumpToNextStep?: Function; // coming from WizardStep component
  jumpToPreviousStep?: Function; // coming from WizardStep component
  onNext?: Function;
  inProgress?: boolean;
};

interface InternalProps {
  books: IBookItem[];
  booksLoading: boolean;
  doSearch: typeof searchBooks;
}

type Props = GroupBookBankStepProps & InternalProps;

class GroupBookBankStep extends React.Component<Props> {
  state = {
    bookName: '',
    searched: false,
    selectedBooks: [],
  };

  onNextPress = () => {
    const { jumpToNextStep, onNext } = this.props;
    const { selectedBooks } = this.state;
    if (onNext) {
      onNext(selectedBooks);
    }
    jumpToNextStep();
  };

  onBackPress = () => {
    const { jumpToPreviousStep } = this.props;
    jumpToPreviousStep();
  };

  onSearch = () => {
    const { bookName } = this.state;
    const { doSearch } = this.props;
    doSearch(bookName);
  };

  selectBook = book => {
    const { selectedBooks } = this.state;
    const pos = selectedBooks.findIndex(x => x.id === book.id);
    if (pos <= -1) {
      const newSelectedBooks = [...selectedBooks];
      newSelectedBooks.push({
        id: book.id,
        read_once: book.read_once,
      });
      this.setState({
        selectedBooks: newSelectedBooks,
      });
    } else {
      selectedBooks.splice(pos, 1);
      this.setState({
        selectedBooks,
      });
    }
  };

  renderBooks() {
    const { booksLoading, books, classes } = this.props;
    const { searched, selectedBooks } = this.state;
    return (
      <div className={classes.booksResult}>
        {booksLoading && (
          <div className={classes.booksLoading}>
            <Spinner />
          </div>
        )}
        {searched && (
          <Grid
            className={cn(
              classes.booksList,
              booksLoading ? classes.bookListLoading : ''
            )}>
            {books &&
              books.map((book, index) => {
                const { id } = book;
                const pos = selectedBooks.findIndex(x => x.id === id);
                const isSelected = pos > -1;
                return (
                  <SearchBookItem
                    key={index}
                    isSelected={isSelected}
                    book={book}
                    onSelectBook={selectedBook => {
                      this.selectBook(selectedBook);
                    }}
                  />
                );
              })}
          </Grid>
        )}
      </div>
    );
  }

  renderSection() {
    const { classes, books } = this.props;
    const { bookName, searched } = this.state;
    return (
      <>
        <Grid doubling className={classes.metrics}>
          <Grid.Row verticalAlign="bottom">
            <Grid.Column width={8}>
              <Input
                label="Search"
                inputProps={{
                  placeholder: 'Enter ISBN or Book Title',
                  type: 'text',
                  value: bookName,
                  onChange: (_, { value }) => {
                    this.setState({ bookName: value });
                  },
                  onKeyUp: event => {
                    if (event.keyCode === 13) {
                      this.onSearch();
                      this.setState({ searched: true });
                    }
                  },
                }}
              />
            </Grid.Column>
            <Grid.Column width={3}>
              <div
                className={classes.goalSettingsMetric}
                onClick={() => {
                  this.onSearch();
                  this.setState({ searched: true });
                }}>
                <span>Search</span>
                <Icon name="file alternate outline" size="small" />
              </div>
            </Grid.Column>
          </Grid.Row>
        </Grid>
        {this.renderBooks()}
        {(!searched || books.length <= 0) && (
          <MessageBox
            description={
              <div>
                <p>
                  You can place books into the Book Bank for all your readers as
                  suggested or required reading. Readers will see these books in
                  their individual Book Bank when then join this Reading Group.
                </p>
                <p>
                  Use this search function to find and add books to the Group
                  Book Bank. Click save when done.
                </p>
                <p>
                  You can edit the Group Book Bank anytime. See a full tutorial
                  on this function the{' '}
                  <span className={classes.blueText}>Knowledge Base</span>.
                </p>
              </div>
            }
          />
        )}
      </>
    );
  }

  renderButtons() {
    const { classes, inProgress } = this.props;
    return (
      <>
        <Grid className={classes.buttonWrapper}>
          <Grid.Row columns="equal">
            <Grid.Column>
              <Button
                colorVariant={ButtonColor.MAIN}
                buttonType={ButtonType.ROUND}
                icon={<Icon name="arrow left" />}
                classes={{ button: classes.cancelButton }}
                buttonProps={{
                  onClick: this.onBackPress,
                }}>
                {'Back'}
              </Button>
            </Grid.Column>
            <Grid.Column>
              <Button
                colorVariant={ButtonColor.PRIMARY}
                buttonType={ButtonType.ROUND}
                icon={<Icon name="save outline" />}
                buttonProps={{
                  onClick: this.onNextPress,
                  loading: inProgress,
                }}>
                Finish
              </Button>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </>
    );
  }

  render() {
    const { classes } = this.props;
    return (
      <div className={classes.step}>
        {this.renderSection()}
        {this.renderButtons()}
      </div>
    );
  }
}

export default compose<GroupBookBankStepProps, GroupBookBankStepProps>(
  themr<GroupBookBankStepProps>('GroupBookBankStep', styles),
  connect(
    (state: IReduxState) => ({
      books: idx(state, x => x.bookBank.searchedBooks.data),
      booksLoading: idx(state, x => x.bookBank.searchedBooks.loading),
    }),
    {
      doSearch: searchBooks,
    }
  )
)(GroupBookBankStep);
