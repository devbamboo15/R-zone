import themr from 'src/helpers/themr';
import SingleDatePicker, { SingleDatePickerProps } from './view';
import styles from './styles.scss';

export default themr<SingleDatePickerProps>('SingleDatePicker', styles)(
  SingleDatePicker
);
