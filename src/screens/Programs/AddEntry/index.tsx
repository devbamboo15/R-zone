import themr from 'src/helpers/themr';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import { IReduxState } from 'src/store/reducers';
import idx from 'idx';
import get from 'lodash/get';
import { createReadingEntry, addBulkEntry } from 'src/store/actions/group';
import { getReaderEntires } from 'src/store/actions/organizer/reader';

import AddEntry, { Props } from './view';
import styles from '../styles.scss';

export default compose<Props, Props>(
  themr<Props>('AddEntry', styles),
  connect(
    (state: IReduxState) => {
      const createReadingEntryLoading = idx(
        state,
        x => x.group.createReadingEntry.loading
      );
      const bulkEntryLoading = idx(state, x => x.group.bulkEntry.loading);
      const readerEntries =
        idx(state, x => x.organizer.reader.entries.data) || [];
      const readerEntriesLoading = idx(
        state,
        x => x.organizer.reader.entries.loading
      );
      const entiresDays =
        readerEntries.map(entry => {
          return {
            id: entry.id,
            day: get(entry, 'attributes.date'),
            value: get(entry, 'attributes.value'),
          };
        }) || [];
      return {
        createReadingEntryLoading,
        bulkEntryLoading,
        readerEntries,
        readerEntriesLoading,
        entiresDays,
      };
    },
    {
      createReadingEntry,
      addBulkEntry,
      getReaderEntires,
    }
  )
)(AddEntry);
