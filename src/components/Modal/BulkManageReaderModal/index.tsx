import { compose, withState, withHandlers, withPropsOnChange } from 'recompose';
import themr from 'src/helpers/themr';
import { IReduxState } from 'src/store/reducers';
import { connect } from 'react-redux';
import idx from 'idx';
import { keys, find } from 'lodash';
import { assignReaders, addReaders } from 'src/store/actions/organizer/reader';
import { AddOrAssignReadersAction } from 'src/api/reader';
import styles from '../styles.scss';
import BulkManageReaderModal, {
  BulkManageReaderProps,
  BulkManageReaderOutProps,
} from './view';

export default compose<BulkManageReaderProps, BulkManageReaderOutProps>(
  themr<BulkManageReaderProps>('BulkManageReaderModal', styles),
  connect(
    (state: IReduxState) => {
      const programGroups = idx(state, x => x.organizer.group.programGroups);
      const addReadersLoading = idx(
        state,
        x => x.organizer.reader.addReader.loading
      );
      const moveReadersLoading = idx(
        state,
        x => x.organizer.reader.assignReader.loading
      );
      return {
        programGroups,
        addReadersLoading,
        moveReadersLoading,
      };
    },
    { assignReaders, addReaders }
  ),
  withState('group', 'setGroup', null),
  withState('program', 'setProgram', null),
  withState('groups', 'setGroups', []),
  withState('groupId', 'setGroupId', ''),
  withState('programId', 'setProgramId', ''),
  withHandlers<any, any>({
    onChangeProgram: (props: any) => (val: any) => {
      const programId = idx(val, x => x.value);
      props.setProgramId(programId);
    },
    onConfirmAddReaders: (props: any) => () => {
      const { groupId, selectedIds } = props;
      props.addReaders(
        {
          action: AddOrAssignReadersAction.assign,
          reader_id: keys(selectedIds),
          group_id: groupId,
        },
        () => {
          props.onListReadersRefresh();
          props.onCancel();
        }
      );
    },
    onConfirmMoveReaders: (props: any) => () => {
      const { groupId, selectedIds } = props;
      props.assignReaders(
        {
          action: AddOrAssignReadersAction.reassign,
          reader_id: keys(selectedIds),
          group_id: groupId,
        },
        () => {
          props.onListReadersRefresh();
          props.onCancel();
        }
      );
    },
  }),
  withPropsOnChange(['programId'], (props: any) => {
    let groups: any = [];
    const { programGroups, programId, programs } = props;
    if (programId) {
      groups = idx(programGroups, x => x[programId].data || []);
      props.setGroups(groups);
      props.setGroupId('');
      const program = find(programs, (item: any) => item.id === programId);
      props.setProgram(program);
    }
  }),
  withPropsOnChange(['groupId'], (props: any) => {
    const { groups, groupId } = props;
    if (groups) {
      const group = find(groups, (item: any) => item.id === groupId);
      props.setGroup(group);
    }
  })
)(BulkManageReaderModal);
