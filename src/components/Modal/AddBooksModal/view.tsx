import * as React from 'react';
import { findIndex, get } from 'lodash';
import Modal from 'src/components/Modal';
import Heading, { HeadingColor } from 'src/components/Heading';
import { ModalProps, Grid } from 'semantic-ui-react';
import Button, { ButtonColor } from 'src/components/Button';
import Input from 'src/components/FormFields/Input';
import { IBookItem } from 'src/store/types';
import SearchBookItem from 'src/components/SearchBookItem';
import Spinner from 'src/components/Spinner';
import Select from 'src/components/FormFields/Select';
import idx from 'idx';
import HelperIcon from 'src/components/Helper/Icon';
import toast from 'src/helpers/Toast';

export enum AddBooksType {
  reader = 'reader',
  normal = 'normal',
}
export type Props = IComponentProps & {
  modelProps: ModalProps;
  onSelectBook?: (book: IBookItem, readOnce?: boolean) => any;
  onSelectBookWithGroup?: (
    book: IBookItem,
    groupId: string | number,
    readOnce?: boolean
  ) => any;
  selectedBooks?: IBookItem[];
  programId?: string | number;
  groupId?: string | number;
  type?: AddBooksType;
  loading?: boolean;
  itemLoading?: string;
  fromBookBankButton?: boolean;
};

interface InternalProps {
  resetSearchBooks?: Function;
  doSearch?: Function;
  books?: IBookItem[];
  booksLoading?: boolean;
  addBookLoading?: boolean;
  deleteBookLoading?: boolean;
  searchText?: string;
  setSearchText?: Function;
  programGroups?: any[];
}
interface InternalState {
  group: any;
  groupSelectFocus: boolean;
}
class AddBooksModal extends React.Component<
  Props & InternalProps,
  InternalState
> {
  constructor(props) {
    super(props);
    this.state = {
      group: null,
      groupSelectFocus: false,
    };
  }

  static defaultProps = {
    modelProps: {},
    type: AddBooksType.normal,
  };

  componentDidMount() {
    this.props.resetSearchBooks();
  }

  componentWillReceiveProps(nextProps) {
    if (get(this.props, 'programId') !== get(nextProps, 'programId')) {
      this.setState({ group: null });
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props.modelProps.open !== prevProps.modelProps.open) {
      this.props.resetSearchBooks();
      this.props.setSearchText('');
    }
  }

  onSearch = () => {
    const { doSearch, searchText } = this.props;
    doSearch(searchText);
  };

  selectGroup = (group: any) => {
    this.setState({ group });
  };

  render() {
    const {
      type,
      modelProps,
      books,
      selectedBooks,
      onSelectBook,
      booksLoading,
      classes,
      programGroups,
      programId,
      groupId,
      onSelectBookWithGroup,
      itemLoading,
      loading,
      addBookLoading,
      deleteBookLoading,
      fromBookBankButton,
    } = this.props;
    const { group, groupSelectFocus } = this.state;
    const program = idx(programGroups, x => x[programId]) || {};
    const groupOptions = get(program, 'data') || [];
    const searchAction = () => {
      if (!groupId && !group && type === AddBooksType.reader) {
        this.setState({
          groupSelectFocus: true,
        });
        toast.error('You must to select 1 group first');
      } else {
        this.onSearch();
      }
    };

    return (
      <Modal
        modelProps={modelProps}
        header={
          <Heading headingProps={{ as: 'h3' }} colorVariant={HeadingColor.MAIN}>
            Book Search
            <HelperIcon
              style={{ marginLeft: '5px', position: 'relative', top: '-2px' }}
              helperText="Search for a book by entering the title, ISBN, EAN or Author above"
            />
          </Heading>
        }>
        <Grid>
          {type === AddBooksType.reader && programId && !groupId && (
            <Grid.Row>
              <Grid.Column>
                <Select
                  selectProps={{
                    value: group,
                    options: groupOptions.map((item: any) => ({
                      value: item.id,
                      text: item.attributes.name,
                    })),
                    name: 'group',
                    placeholder: 'Group',
                    onChange: (_, { value }) => this.selectGroup(value),
                    className:
                      groupSelectFocus &&
                      !groupId &&
                      !group &&
                      type === AddBooksType.reader
                        ? classes.errorField
                        : '',
                  }}
                />
              </Grid.Column>
            </Grid.Row>
          )}
          <Grid.Row>
            <Grid.Column width="13">
              <Input
                inputProps={{
                  placeholder: 'Enter ISBN or Book Title',
                  type: 'text',
                  value: this.props.searchText,
                  onChange: (_, { value }) => {
                    this.props.setSearchText(value);
                  },
                  onKeyUp: event => {
                    if (event.keyCode === 13) {
                      searchAction();
                    }
                  },
                }}
              />
            </Grid.Column>
            <Grid.Column width="3">
              <Button
                colorVariant={ButtonColor.MAIN}
                buttonProps={{
                  onClick: searchAction,
                }}>
                Search
              </Button>
            </Grid.Column>
          </Grid.Row>
        </Grid>
        {booksLoading && <Spinner />}
        <Grid className={classes.books}>
          {books &&
            books.map((book, index) => {
              const pos = findIndex(selectedBooks, { id: book.id });
              const isSelected = pos > -1;
              return (
                <SearchBookItem
                  key={index}
                  isSelected={isSelected}
                  book={book}
                  onSelectBook={(selectBook, readOnce) => {
                    if (type === AddBooksType.reader) {
                      onSelectBookWithGroup(selectBook, group, readOnce);
                    } else {
                      onSelectBook(selectBook, readOnce);
                    }
                  }}
                  loading={
                    book &&
                    itemLoading === book.id &&
                    (loading || addBookLoading || deleteBookLoading)
                  }
                  fromBookBankButton={fromBookBankButton}
                />
              );
            })}
        </Grid>
      </Modal>
    );
  }
}

export default AddBooksModal;
