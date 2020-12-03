import themr from 'src/helpers/themr';
import { connect } from 'react-redux';
import find from 'lodash/find';
import get from 'lodash/get';
import { compose, lifecycle, withState, withHandlers } from 'recompose';
import { IReduxState } from 'src/store/reducers';
import tableStyles from 'src/components/Table/styles.scss';
import {
  getAllProgramGroups,
  deleteGroupInProgram,
  updateCombinedGroup,
  searchGroups,
  resetSearchGroups,
} from 'src/store/actions/organizer/group';
import { getAuthorizedUser } from 'src/store/actions/organizer/users';
import { updateAdvancedProgram } from 'src/store/actions/organizer/program';
import { addBook, deleteBook } from 'src/store/actions/organizer/reader';
import idx from 'idx';
import { IBookItem } from 'src/store/types';
import Groups, { GroupsProps } from './Groups';
import styles from '../styles.scss';

// height of row is 60 and border is 1
const rowHeight = 61;
// 333 is other element height, 190 is dropdown height
const otherHeight = 333 + 190;

export default compose<GroupsProps, GroupsProps>(
  themr<GroupsProps>('Groups', { ...styles, tableStyles }),
  withState('searchText', 'setSearchText', ''),
  withState('direction', 'setDirection', true),
  withState('sortColumn', 'setSortColumn', 'name'),
  connect(
    (state: IReduxState, ownProps: any) => {
      const programId = get(ownProps, 'match.params.programId');
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
      const program = find(programs, { id: programId }) || {};

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

      const groupsLoading =
        idx(state, x => x.organizer.group.searchGroups[programId].loading) ||
        idx(state, x => x.organizer.group.programGroups[programId].loading);
      const createProgramGroups =
        idx(state, x => x.organizer.group.createProgramGroups) ||
        ({} as IReduxOperationRequest);
      const tableHeight = groups.length * rowHeight + 100;
      const curerntTableHeight = window.innerHeight - otherHeight;
      const lackHeight = tableHeight - curerntTableHeight;
      const numberUpwardFloat = lackHeight / rowHeight;
      const numberUpwardInt = parseInt(numberUpwardFloat.toString(), 10);
      const numberUpward =
        numberUpwardInt < numberUpwardFloat
          ? numberUpwardInt + 1
          : numberUpwardInt;

      return {
        createProgramGroupsLoading: createProgramGroups.loading,
        profileId,
        searchGroupsState,
        userAccessProgram,
        groups,
        groupsLoading,
        deleteGroupData: idx(state, x => x.organizer.group.deleteGroup),
        updateGroupData: idx(state, x => x.organizer.group.updateGroup),
        groupsMorePage: idx(
          state,
          x => x.organizer.group.programGroups[programId].morePage
        ),
        program,
        numberUpward: numberUpward > 3 ? 3 : numberUpward,
        totalGroups:
          idx(state, x => x.organizer.group.programGroups[programId].total) ||
          0,
      };
    },
    {
      getAllProgramGroups,
      deleteGroupInProgram,
      updateCombinedGroup,
      getAuthorizedUser,
      searchGroups,
      resetSearchGroups,
      addBook,
      deleteBook,
      updateAdvancedProgram,
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
          value: get(group, 'goal.attributes.value'),
          metric_id: get(group, 'goal.attributes.metric_id'),
          interval_id: get(group, 'goal.attributes.interval_id') || null,
        },
      };
      props.updateCombinedGroup(programId, groupId, dataToSubmit, cb);
    },
  }),
  withHandlers({
    onSortGroups: (props: any) => (
      page?: number,
      loadMore?: boolean,
      cb?: any
    ) => {
      const order = props.direction ? 'asc' : 'desc';
      const programId = idx(props, x => x.match.params.programId);
      const filter = {
        order: `${props.sortColumn}|${order}`,
        page: page || 0,
      };
      props.getAllProgramGroups(programId, filter, loadMore, cb);
    },
  }),
  lifecycle<any, any>({
    componentDidMount() {
      const programId = idx(this.props, x => x.match.params.programId);
      const { profileId } = this.props;

      this.props.getAuthorizedUser(profileId);
      this.props.resetSearchGroups(programId);
    },
  })
)(Groups);
