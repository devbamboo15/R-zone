import themr from 'src/helpers/themr';
import SearchBookItem, { Props } from './view';
import styles from './styles.scss';

export default themr<Props>('SearchBookItem', styles)(SearchBookItem);
