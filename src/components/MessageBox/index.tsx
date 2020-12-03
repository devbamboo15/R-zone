import themr from 'src/helpers/themr';
import MessageBox, { Props, MessageBoxVariant } from './view';
import styles from './styles.scss';

export default themr<Props>('MessageBox', styles)(MessageBox);

export { MessageBoxVariant };
