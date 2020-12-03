import themr from 'src/helpers/themr';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import { IReduxState } from 'src/store/reducers';
import idx from 'idx';
import { getReaderMetrics } from 'src/store/actions/organizer/reader';
import Metrics, { Props } from './view';
import styles from '../../styles.scss';

export default compose<Props, Props>(
  themr<Props>('Metrics', styles),
  connect(
    (state: IReduxState) => {
      return {
        readerMetrics:
          idx(state, x => x.organizer.reader.readerMetrics.data) || {},
      };
    },
    {
      getReaderMetrics,
    }
  )
)(Metrics);
