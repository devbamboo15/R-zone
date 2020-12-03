import themr from 'src/helpers/themr';
import BookBankItem, { Props, BookBankItemType } from './view';
import styles from './styles.scss';

export { BookBankItemType };
export default themr<Props>('BookBankItem', styles)(BookBankItem);
