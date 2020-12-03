import themr from 'src/helpers/themr';
import Trophies, { TrophiesProps } from './view';
import styles from './styles.scss';

export default themr<TrophiesProps>('Trophies', styles)(Trophies);
