import themr from 'src/helpers/themr';
import ProgressBar, { Props, ProgressColorVariant } from './view';
import styles from './styles.scss';

export default themr<Props>('ProgressBar', styles)(ProgressBar);
export { ProgressColorVariant };
