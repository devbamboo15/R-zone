import { compose, withHandlers } from 'recompose';
import themr from 'src/helpers/themr';
import { IReduxState } from 'src/store/reducers';
import { map } from 'lodash';
import { connect } from 'react-redux';
import idx from 'idx';
import { deleteBulkReader } from 'src/store/actions/organizer/reader';
import BulkDeleteReaderModal, {
  BulkDeleteReaderModalProps,
  BulkDeleteReaderModalOutProps,
} from './view';
import styles from '../styles.scss';

export default compose<
  BulkDeleteReaderModalProps,
  BulkDeleteReaderModalOutProps
>(
  themr<BulkDeleteReaderModalProps>('BulkDeleteReaderModal', styles),
  connect(
    (state: IReduxState) => {
      const deleteBulkReaderLoading = idx(
        state,
        x => x.organizer.reader.deleteBulkReader.loading
      );
      return {
        deleteBulkReaderLoading,
      };
    },
    { deleteBulkReader }
  ),
  withHandlers<any, any>({
    onConfirmDeleteReader: (props: any) => () => {
      const { selectedReaders } = props;
      const readerIds = map(selectedReaders, 'user_id');

      props.deleteBulkReader(readerIds, () => {
        props.onListReadersRefresh();
        props.onCancel();
      });
    },
  })
)(BulkDeleteReaderModal);
