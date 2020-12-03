import themr from 'src/helpers/themr';
import get from 'lodash/get';
import find from 'lodash/find';
import { connect } from 'react-redux';
import { compose, lifecycle, withHandlers, withState } from 'recompose';
import {
  getAllReaders,
  deleteGroupReader,
  updateReader,
  getReader,
} from 'src/store/actions/organizer/reader';
import tableStyles from 'src/components/Table/styles.scss';
import { getAuthorizedUser } from 'src/store/actions/organizer/users';
import { updateCombinedGroup } from 'src/store/actions/organizer/group';
import idx from 'idx';
import { IReduxState } from 'src/store/reducers';
import { createReadingEntry } from 'src/store/actions/group';
import { IBookItem } from 'src/store/types';
import styles from '../styles.scss';
import Readers, { ReadersProps } from './Readers';

export default compose<ReadersProps, ReadersProps>(
  themr<ReadersProps>('Readers', { ...styles, tableStyles }),
  withState('direction', 'setDirection', true),
  withState('sortColumn', 'setSortColumn', 'first_name'),
  connect(
    (state: IReduxState, ownProps: any) => {
      const { match } = ownProps;
      const programId: string = get(match, 'params.programId');
      const groupId: string = get(match, 'params.groupId');
      const readers =
        idx(state, x => x.organizer.reader.readers[groupId].data) || [];

      let groups: any = [];
      const searchGroupsData: any =
        idx(state, x => x.organizer.group.searchGroups[programId].data) || [];
      const searchGroupsState: string =
        idx(state, x => x.organizer.group.searchGroups[programId].status) || '';
      if (searchGroupsState === 'success' || searchGroupsState === 'error') {
        groups = searchGroupsData;
      } else {
        groups =
          idx(state, x => x.organizer.group.programGroups[programId].data) ||
          [];
      }

      const searchProgramsText = idx(
        state,
        x => x.organizer.program.searchPrograms.text
      );
      let programs = [];
      if (
        searchProgramsText &&
        idx(state, x => x.organizer.program.searchPrograms.data)
      ) {
        programs =
          idx(state, x => x.organizer.program.searchPrograms.data) || [];
      } else {
        programs = idx(state, x => x.organizer.program.programs.data) || [];
      }

      const manageReaders = idx(state, x => x.organizer.reader.allReaders.data);
      const manageReadersLoading = idx(
        state,
        x => x.organizer.reader.allReaders.loading
      );
      const profileId = idx(state, x => x.auth.profile.data.id);
      const organizationId = idx(
        state,
        x => x.auth.profile.data.relationships.organization.data.id
      );
      const access = idx(state, x => x.organizer.users.usersAccess.data);
      const userAccessProgram = get(
        access,
        `access.${profileId}[0].attributes.access.${organizationId}`,
        {}
      );
      const accessGroupByProgram = get(
        userAccessProgram,
        `group_by_program[${programId}][${groupId}]`,
        {}
      );
      return {
        updateGroupData: idx(state, x => x.organizer.group.updateGroup),
        readers,
        readersLoading: idx(
          state,
          x => x.organizer.reader.readers[groupId].loading
        ),
        readerLoading: idx(state, x => x.organizer.reader.reader.loading),
        readerNotes: idx(state, x => x.organizer.reader.reader.data.notes),
        updateReadersLoading: idx(
          state,
          x => x.organizer.reader.updateReader[groupId].loading
        ),
        createReadingEntryLoading: idx(
          state,
          x => x.group.createReadingEntry.loading
        ),
        createReadingEntrySuccess: idx(
          state,
          x => x.group.createReadingEntry.success
        ),
        group: find(groups, { id: groupId }) || {},
        program: find(programs, { id: programId }) || {},
        deleteReaderData: idx(state, x => x.organizer.reader.deleteReader),
        manageReadersLoading,
        manageReaders,
        accessGroupByProgram,
        profileId,
        programId,
        groupId,
      };
    },
    {
      getAuthorizedUser,
      getAllReaders,
      deleteGroupReader,
      updateReader,
      getReader,
      createReadingEntry,
      updateCombinedGroup,
    }
  ),
  withHandlers<any, any>({
    onUpdateBook: (props: any) => (
      books: IBookItem[],
      group: any,
      cb?: Function
    ) => {
      const { match } = props;
      const programId = get(match, 'params.programId');
      // const booksArr = books.map(book => ({ id: book.id }));
      const groupId = get(group, 'id');
      const dataToSubmit = {
        book: books,
        group: {
          name: get(group, 'attributes.name'),
        },
        goal: {
          start_date: get(group, 'goal.attributes.start_date'),
          end_date: get(group, 'goal.attributes.end_date'),
          value: get(group, 'goal.attributes.reading_log'),
          metric_id: get(group, 'goal.attributes.metric_id'),
          interval_id: get(group, 'goal.attributes.interval_id') || null,
        },
      };
      props.updateCombinedGroup(programId, groupId, dataToSubmit, cb);
    },
  }),
  withHandlers({
    onSortReaders: (props: any) => () => {
      const order = props.direction ? 'asc' : 'desc';
      const programId = idx(props.match, x => x.params.programId);
      const groupId = idx(props.match, x => x.params.groupId);
      props.getAllReaders({
        programId,
        groupId,
        order: `${props.sortColumn}|${order}`,
      });
    },
  }),
  withHandlers({
    onListReadersRefresh: (props: any) => () => {
      if (!props.readersLoading) {
        const { match } = props;
        props.getAllReaders({
          programId: idx(match, x => x.params.programId),
          groupId: idx(match, x => x.params.groupId),
          order: 'first_name|asc',
        });
      }
    },
  }),
  lifecycle<any, any>({
    componentDidMount() {
      const { match, profileId } = this.props;

      this.props.getAuthorizedUser(profileId);
      this.props.getAllReaders({
        programId: idx(match, x => x.params.programId),
        groupId: idx(match, x => x.params.groupId),
        order: 'first_name|asc',
      });
    },
  })
)(Readers);
