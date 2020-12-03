import { compose, withState, withHandlers } from 'recompose';
import themr from 'src/helpers/themr';
import { IReduxState } from 'src/store/reducers';
import { connect } from 'react-redux';
import idx from 'idx';
import { get } from 'lodash';
import {
  addReaderNote,
  deleteAllReaderNote,
  getReaderDetail,
} from 'src/store/actions/organizer/reader';
import { IAddReaderNoteData } from 'src/api';
import AddReaderNoteModal, {
  AddReaderNoteModalProps,
  AddReaderNoteModalOutProps,
} from './view';
import styles from './styles.scss';

export default compose<AddReaderNoteModalProps, AddReaderNoteModalOutProps>(
  themr<AddReaderNoteModalProps>('AddReaderNoteModal', styles),
  connect(
    (state: IReduxState) => {
      const addReaderNoteLoading = idx(
        state,
        x => x.organizer.reader.addReaderNote.loading
      );
      const deleteAllReaderNoteLoading = idx(
        state,
        x => x.organizer.reader.deleteAllReaderNote.loading
      );
      const notesFromAction = idx(
        state,
        x => x.organizer.reader.readerDetail.data
      );
      const readerDetailLoading = idx(
        state,
        x => x.organizer.reader.readerDetail.loading
      );
      return {
        addReaderNoteLoading,
        deleteAllReaderNoteLoading,
        notesFromAction,
        readerDetailLoading,
      };
    },
    { addReaderNote, deleteAllReaderNote, getReaderDetail }
  ),
  withState('noteText', 'setNoteText', ''),
  withHandlers<any, any>({
    onSave: (props: any) => () => {
      const { noteText } = props;
      const readerId = get(props, 'userId');
      props.addReaderNote(
        {
          note: noteText,
          user_id: readerId,
        } as IAddReaderNoteData,
        () => {
          props.setNoteText('');
          props.onListReadersRefresh();
        }
      );
    },
    onDeleteAllNotes: (props: any) => () => {
      const readerId = get(props, 'userId');
      props.deleteAllReaderNote(readerId as string | number, () => {
        props.onListReadersRefresh();
        props.setNoteText('');
      });
    },
  })
)(AddReaderNoteModal);
