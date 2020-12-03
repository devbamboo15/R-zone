import themr from 'src/helpers/themr';
import DateRangePicker, { DateRangePickerProps } from './view';
import styles from './styles.scss';

export default themr<DateRangePickerProps>('DateRangePicker', styles)(
  DateRangePicker
);
