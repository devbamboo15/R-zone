import themr from 'src/helpers/themr';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import { getBooksReading } from 'src/store/actions/organizer/reader';
import { resetSearchGoalCodes } from 'src/store/actions/goal';
import { getMeChildDetails } from 'src/store/actions/setup';

import { withRouter } from 'react-router-dom';
import styles from '../../styles.scss';
import ReaderInput, { ReaderInputProps } from './view';

export default compose<ReaderInputProps, ReaderInputProps>(
  withRouter,
  themr<ReaderInputProps>('ReaderInput', styles),
  connect(
    () => ({}),
    {
      getBooksReading,
      resetSearchGoalCodes,
      getMeChildDetails,
    }
  )
)(ReaderInput);
