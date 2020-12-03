import themr from 'src/helpers/themr';
import ProgramCode, { Props, Size } from './view';
import styles from './styles.scss';

export default themr<Props>('ProgramCode', styles)(ProgramCode);
export { Size };
