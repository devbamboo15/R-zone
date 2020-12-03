import themr from 'src/helpers/themr';
import { connect } from 'react-redux';
import { compose, withState } from 'recompose';
import { searchBooks, resetSearchBooks } from 'src/store/actions/bookbank';
import { IReduxState } from 'src/store/reducers';
import idx from 'idx';
import styles from './styles.scss';
import AddBooksModal, { Props, AddBooksType } from './view';

export { AddBooksType };
export default compose<Props, Props>(
  themr<Props>('AddBooksModal', styles),
  withState('searchText', 'setSearchText', ''),
  connect(
    (state: IReduxState) => {
      const programGroups = idx(state, x => x.organizer.group.programGroups);
      const addBookLoading = idx(
        state,
        x => x.organizer.reader.addBook.loading
      );
      const deleteBookLoading = idx(
        state,
        x => x.organizer.reader.deleteBook.loading
      );
      return {
        programGroups,
        books: idx(state, x => x.bookBank.searchedBooks.data),
        booksLoading: idx(state, x => x.bookBank.searchedBooks.loading),
        addBookLoading,
        deleteBookLoading,
      };
    },
    {
      doSearch: searchBooks,
      resetSearchBooks,
    }
  )
)(AddBooksModal);
