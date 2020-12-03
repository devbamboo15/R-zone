import { compose, withState, withHandlers, withPropsOnChange } from 'recompose';
import themr from 'src/helpers/themr';
import { IReduxState } from 'src/store/reducers';
import { connect } from 'react-redux';
import idx from 'idx';
import { searchReaders, addReaders } from 'src/store/actions/organizer/reader';
import { AddOrAssignReadersAction } from 'src/api/reader';
import AddReaderModal, {
  AddReaderModalProps,
  AddReaderModalOutProps,
} from './view';
import styles from './styles.scss';

export default compose<AddReaderModalProps, AddReaderModalOutProps>(
  themr<AddReaderModalProps>('AddReaderModal', styles),
  connect(
    (state: IReduxState) => {
      const programGroups = idx(state, x => x.organizer.group.programGroups);
      const readers =
        idx(state, x => x.organizer.reader.searchReaders.data) || [];
      const readersLoading = idx(
        state,
        x => x.organizer.reader.searchReaders.loading
      );
      const addReaderLoading = idx(
        state,
        x => x.organizer.reader.addReader.loading
      );
      return {
        programGroups,
        readers,
        readersLoading,
        addReaderLoading,
      };
    },
    { searchReaders, addReaders }
  ),
  withState('groups', 'setGroups', []),
  withState('readerId', 'setReaderId', ''),
  withState('groupId', 'setGroupId', ''),
  withState('programId', 'setProgramId', ''),
  withHandlers<any, any>({
    onChangeProgram: (props: any) => (val: any) => {
      const programId = idx(val, x => x.value);
      props.setProgramId(programId);
    },
    onConfirmAddReader: (props: any) => () => {
      const { groupId, readerId, fromReadersPage, groupIdFromReader } = props;
      let groupIdData = groupId;
      if (fromReadersPage) {
        groupIdData = groupIdFromReader;
      }
      props.addReaders(
        {
          action: AddOrAssignReadersAction.assign,
          reader_id: [readerId],
          group_id: groupIdData,
        },
        () => {
          props.onListReadersRefresh();
          props.setReaderId(null);
          props.setGroupId(null);
          props.onCancel();
        }
      );
    },
    onCancelAddReader: (props: any) => () => {
      props.setReaderId(null);
      props.setGroupId(null);
      props.onCancel();
    },
    onSearchReader: (props: any) => (searchText: string) =>
      props.searchReaders(searchText),
  }),
  withPropsOnChange(['programId'], (props: any) => {
    let groups: any = [];
    const { programGroups, programId } = props;
    if (programId) {
      groups = idx(programGroups, x => x[programId].data || []);
      props.setGroups(groups);
      props.setGroupId('');
    }
  })
)(AddReaderModal);
