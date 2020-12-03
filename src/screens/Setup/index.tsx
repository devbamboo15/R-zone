import themr from 'src/helpers/themr';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import { IReduxState } from 'src/store/reducers';
import { doLogout } from 'src/store/actions/auth';
import {
  searchBooks,
  resetSearchBooks,
  finishUserBooks,
  addBooks,
} from 'src/store/actions/bookbank';
import {
  getMeChild,
  getMeProgram,
  setLastEntryData,
} from 'src/store/actions/setup';
import { getBooksReading } from 'src/store/actions/organizer/reader';
import { createReadingEntry } from 'src/store/actions/group';
import get from 'lodash/get';
import { withRouter } from 'react-router-dom';
import styles from './styles.scss';
import Setup, { SetupProps } from './view';
import { isNotEndGroup } from './utils';

export default compose<SetupProps, SetupProps>(
  withRouter,
  themr<SetupProps>('Setup', styles),
  connect(
    (state: IReduxState) => {
      const childDetailsData = get(state, 'setup.childDetails.data') || {};
      const childPrograms = get(childDetailsData, 'programs') || [];
      const childActiveGroups = [];
      childPrograms.map(p => {
        (p.groups || []).map(g => {
          if (isNotEndGroup(g)) {
            childActiveGroups.push(g);
          }
          return true;
        });
        return true;
      });
      return {
        meData: get(state, 'auth.profile.data.attributes') || {},
        currentUserId: get(state, 'auth.profile.data.id', ''),
        childData: get(state, 'setup.child.data') || [],
        childDataLoading: get(state, 'setup.child.loading'),
        childPrograms,
        childActiveGroupIds: childActiveGroups.map(g => g.id) || [],
        childDetailsDataLoading: get(state, 'setup.childDetails.loading'),
        programsLoading: get(state, 'setup.programs.loading'),
        mePrograms: get(state, 'setup.programs.data') || [],
        createReadingEntryLoading: get(
          state,
          'group.createReadingEntry.loading'
        ),
        booksReadingLoading: get(
          state,
          'organizer.reader.booksReading.loading',
          false
        ),
        booksReading: get(state, 'organizer.reader.booksReading.data') || [],
        books: get(state, 'bookBank.searchedBooks.data') || [],
        booksLoading: get(state, 'bookBank.searchedBooks.loading', false),
        searchProgramGroups: get(state, 'goal.searchedGoals.groups') || [],
        userAddBooksLoading: get(state, 'bookBank.userAddBooks.loading', false),
        userFinishBooksLoading: get(
          state,
          'bookBank.userFinishBooks.loading',
          false
        ),
      };
    },
    {
      doLogout,
      getMeChild,
      getMeProgram,
      createReadingEntry,
      getBooksReading,
      searchBooks,
      resetSearchBooks,
      finishUserBooks,
      addBooks,
      setLastEntryData,
    }
  )
)(Setup);
