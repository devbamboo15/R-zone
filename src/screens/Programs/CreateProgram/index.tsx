import themr from 'src/helpers/themr';
import { connect } from 'react-redux';
import { compose, withState, lifecycle } from 'recompose';
import {
  createProgram,
  getNewProgramCode,
} from 'src/store/actions/organizer/program';
import { IReduxState } from 'src/store/reducers';
import idx from 'idx';
import CreateProgram, { Props } from './view';
import styles from './styles.scss';
import {
  StepOneProgress,
  StepOneProgramTypeSelection,
} from '../CreateModalSteps/Step1';

export default compose<Props, Props>(
  themr<Props>('create-program', styles),
  connect(
    (state: IReduxState) => ({
      createProgramInProgress: idx(
        state,
        x => x.organizer.program.createProgram.isInProgress
      ),
      createProgramSuccess: idx(
        state,
        x => x.organizer.program.createProgram.success
      ),
      programCode: idx(state, x => x.organizer.program.programCode.data),
      programCodeLoading: idx(
        state,
        x => x.organizer.program.programCode.loading
      ),
      signupQuestions: idx(state, x => x.organizer.questions.questions.data),
    }),
    { createProgram, getNewProgramCode }
  ),
  withState('initialStepFlow', 'setInitialStepFlow', -1),
  withState('step1Data', 'setStep1Data', {
    code: '',
    programName: '',
    progress: StepOneProgress.PART1,
    selection: StepOneProgramTypeSelection.NONE,
    readingLogSelection: StepOneProgramTypeSelection.NONE,
  }),
  withState('contestType', 'setContestType', -1),
  withState('readingGroup', 'setReadingGroup', ''),
  withState('groupMetric', 'setGroupMetric', ''),
  withState('groupQuestions', 'setGroupQuestions', []),
  withState('goalSettingsData', 'setGoalSettingsData', {
    amount: '',
    interval: 'daily',
  }),
  withState('goalDates', 'setGoalDates', { startDate: null, endDate: null }),
  lifecycle<any, any>({
    componentDidMount() {},
  })
)(CreateProgram);
