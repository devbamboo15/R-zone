import themr from 'src/helpers/themr';
import { connect } from 'react-redux';
import find from 'lodash/find';
import { compose, withState } from 'recompose';
import { createCombinedGroup } from 'src/store/actions/organizer/group';
import { IReduxState } from 'src/store/reducers';
import idx from 'idx';
import { Interval } from 'src/store/types';
import CreateGroup, { Props } from './view';
import styles from './styles.scss';

export default compose<Props, Props>(
  themr<Props>('create-group', styles),
  connect(
    (state: IReduxState, ownProps: Props) => {
      const createProgramGroups =
        idx(state, x => x.organizer.group.createProgramGroups) ||
        ({} as IReduxOperationRequest);
      const programId = idx(ownProps as any, x => x.match.params.programId);
      const programs = idx(state, x => x.organizer.program.programs.data) || [];
      const program = find(programs, { id: programId }) || {};
      return {
        createGroupInProgress: createProgramGroups.loading,
        createGroupSuccess: createProgramGroups.status === 'success',
        signupQuestions: idx(state, x => x.organizer.questions.questions.data),
        program,
      };
    },
    { createCombinedGroup }
  ),
  withState('readingGroup', 'setReadingGroup', ''),
  withState('groupMetric', 'setGroupMetric', ''),
  withState('groupQuestions', 'setGroupQuestions', []),
  withState('goalSettingsData', 'setGoalSettingsData', {
    amount: '',
    interval: Interval.daily,
  }),
  withState('goalDates', 'setGoalDates', { startDate: '', endDate: '' })
)(CreateGroup);
