import { compose, withState } from 'recompose';
import themr from 'src/helpers/themr';
import { withRouter } from 'react-router-dom';
import WizardSteps, { Props } from './view';
import styles from './styles.scss';

export default compose<Props, Props>(
  withRouter,
  themr<Props>('WizardSteps', styles),
  withState('activeStepIndex', 'setActiveStepIndex', 0)
)(WizardSteps);
