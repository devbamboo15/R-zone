import themr from 'src/helpers/themr';
import styles from './styles.scss';
import ProgresBadgeDesign, {
  ProgresBadgeDesignProps,
} from './ProgresBadgeDesign';

export default themr<ProgresBadgeDesignProps>('Facebook', styles)(
  ProgresBadgeDesign
);
