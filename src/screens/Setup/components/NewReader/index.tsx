import themr from 'src/helpers/themr';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import get from 'lodash/get';
import { IReduxState } from 'src/store/reducers';
import {
  addMeChild,
  addMeChildData,
  updateMeChildDetails,
} from 'src/store/actions/setup';
import { joinGoal } from 'src/store/actions/goal';
import { getBooksReading } from 'src/store/actions/organizer/reader';

import { withRouter } from 'react-router-dom';
import styles from '../../styles.scss';
import NewReader, { NewReaderProps } from './view';

export default compose<NewReaderProps, NewReaderProps>(
  withRouter,
  themr<NewReaderProps>('NewReader', styles),
  connect(
    (state: IReduxState) => ({
      addMeChildLoading: get(state, 'setup.addMeChild.loading'),
      joinGoalLoading: get(state, 'goal.joinGoal.loading', false),
    }),
    {
      addMeChild,
      addMeChildData,
      updateMeChildDetails,
      joinGoal,
      getBooksReading,
    }
  )
)(NewReader);
