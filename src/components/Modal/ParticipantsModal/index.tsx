import { compose } from 'recompose';
import themr from 'src/helpers/themr';
import ParticipantsModal, {
  ParticipantsModalProps,
  ParticipantsModalOutProps,
} from './view';
import styles from './styles.scss';

export default compose<ParticipantsModalProps, ParticipantsModalOutProps>(
  themr<ParticipantsModalProps>('ParticipantsModal', styles)
)(ParticipantsModal);
