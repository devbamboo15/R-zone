import themr from 'src/helpers/themr';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import get from 'lodash/get';
import { IReduxState } from 'src/store/reducers';
import { searchGoalCodes } from 'src/store/actions/goal';
import { withRouter } from 'react-router-dom';
import styles from '../../styles.scss';
import GroupInput, { GroupInputProps } from './view';

export default compose<GroupInputProps, GroupInputProps>(
  withRouter,
  themr<GroupInputProps>('GroupInput', styles),
  connect(
    (state: IReduxState) => ({
      serchProgramsLoading: get(state, 'goal.searchedGoals.loading'),
    }),
    {
      searchGoalCodes,
    }
  )
)(GroupInput);
