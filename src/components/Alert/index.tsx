import themr from 'src/helpers/themr';
import Alert, { AlertProps, AlertType, AlertPosition } from './Alert';
import styles from './styles.scss';

export { AlertType, AlertPosition };
export default themr<AlertProps>('Alert', styles)(Alert);
