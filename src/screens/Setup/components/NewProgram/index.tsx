import themr from 'src/helpers/themr';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import get from 'lodash/get';
import { IReduxState } from 'src/store/reducers';
import { updateMeChildDetails, updateMeProgram } from 'src/store/actions/setup';
import { joinGoal } from 'src/store/actions/goal';
import { getBooksReading } from 'src/store/actions/organizer/reader';
import { withRouter } from 'react-router-dom';
import styles from '../../styles.scss';
import NewProgram, { NewProgramProps } from './view';

export default compose<NewProgramProps, NewProgramProps>(
  withRouter,
  themr<NewProgramProps>('NewProgram', styles),
  connect(
    (state: IReduxState) => ({
      joinGoalLoading: get(state, 'goal.joinGoal.loading', false),
    }),
    {
      updateMeChildDetails,
      joinGoal,
      getBooksReading,
      updateMeProgram,
    }
  )
)(NewProgram);
