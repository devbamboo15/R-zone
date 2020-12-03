import themr from 'src/helpers/themr';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import { IReduxState } from 'src/store/reducers';
import { searchGoalCodes, resetSearchGoalCodes } from 'src/store/actions/goal';
import get from 'lodash/get';
import { withRouter } from 'react-router-dom';
import styles from './styles.scss';
import InputSearch, { InputSearchProps } from './view';

export default compose<InputSearchProps, InputSearchProps>(
  withRouter,
  themr<InputSearchProps>('InputSearch', styles),
  connect(
    (state: IReduxState) => ({
      searchProgram: get(state, 'goal.searchedGoals.program') || {},
      searchProgramGroups: get(state, 'goal.searchedGoals.groups') || [],
      serchProgramsLoading: get(state, 'goal.searchedGoals.loading'),
      serchProgramsStatus: get(state, 'goal.searchedGoals.status', ''),
    }),
    {
      searchGoalCodes,
      resetSearchGoalCodes,
    }
  )
)(InputSearch);
