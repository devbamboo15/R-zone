import themr from 'src/helpers/themr';
import { connect } from 'react-redux';
import { compose, lifecycle, withHandlers, withState } from 'recompose';
import idx from 'idx';
import { get, map } from 'lodash';
import { getAllPrograms } from 'src/store/actions/organizer/program';
import { getAllOrganizerGroups } from 'src/store/actions/organizer/group';
import { IReduxState } from 'src/store/reducers';
import {
  getListReaders,
  getReaderDetail,
} from 'src/store/actions/organizer/reader';
import { getAuthorizedUser } from 'src/store/actions/organizer/users';
import { IFilterParam } from 'src/store/types/organizer/reader';
import tableStyles from 'src/components/Table/styles.scss';
import styles from './styles.scss';
import ManageReaders, { ManageReaderProps } from './ManageReaders';

export default compose<ManageReaderProps, ManageReaderProps>(
  themr<ManageReaderProps>('ManageReaders', {
    mainStyles: styles,
    tableStyles,
  }),
  connect(
    (state: IReduxState) => {
      const readers = idx(state, x => x.organizer.reader.allReaders.data);
      const readersLoading = idx(
        state,
        x => x.organizer.reader.allReaders.loading
      );
      const programs = idx(state, x => x.organizer.program.programs.data);
      const groups = idx(state, x => x.organizer.group.allGroups.data);
      const profile = idx(state, x => x.auth.profile.data);
      const role =
        get(profile, 'attributes.organization_role') === 'owner'
          ? 'owner'
          : get(profile, 'relationships.roles.data[0].id');

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
      return {
        readers,
        profileId,
        readersLoading,
        programs,
        groups,
        role,
        userAccessProgram,
        organizationId: idx(
          state,
          x => x.auth.profile.data.relationships.organization.data.id
        ),
      };
    },
    {
      getAuthorizedUser,
      getListReaders,
      getAllPrograms,
      getAllOrganizerGroups,
      getReaderDetail,
    }
  ),
  withState('page', 'setPage', 1),
  withState('searchText', 'setSearchText', ''),
  withState('sortPrograms', 'setSortPrograms', []),
  withState('sortGroups', 'setSortGroups', []),
  withState('direction', 'setDirection', true),
  withState('sortColumn', 'setSortColumn', 'name'),
  withHandlers({
    searchListReaders: (props: any) => (text: string, cb?: any) => {
      const { sortPrograms, sortGroups, sortColumn, direction } = props;
      const programsId = map(sortPrograms, (item: any) => item.value);
      const groupsId = map(sortGroups, (item: any) => item.value);
      const param = {
        page: 1,
        search: text,
        programs: programsId,
        groups: groupsId,
        sort_by: direction ? 'asc' : 'desc',
        sort_type: sortColumn,
      };
      props.getListReaders(param as IFilterParam, cb);
    },
    onSortGroupsListReaders: (props: any) => (sortGroups: any[], cb?: any) => {
      const { sortPrograms, searchText, sortColumn, direction } = props;
      const programsId = map(sortPrograms, (item: any) => item.value);
      const groupsId = map(sortGroups, (item: any) => item.value);
      const param = {
        page: 1,
        search: searchText,
        programs: programsId,
        groups: groupsId,
        sort_by: direction ? 'asc' : 'desc',
        sort_type: sortColumn,
      };
      props.getListReaders(param as IFilterParam, cb);
    },
    onSortProgramsListReaders: (props: any) => (
      sortPrograms: any[],
      cb?: any
    ) => {
      const { sortGroups, searchText, sortColumn, direction } = props;
      const programsId = map(sortPrograms, (item: any) => item.value);
      const groupsId = map(sortGroups, (item: any) => item.value);
      const param = {
        page: 1,
        search: searchText,
        programs: programsId,
        groups: groupsId,
        sort_by: direction ? 'asc' : 'desc',
        sort_type: sortColumn,
      };
      props.getListReaders(param as IFilterParam, cb);
    },
    onLoadMore: (props: any) => (cb?: any) => {
      if (!props.readersLoading) {
        const {
          searchText,
          sortPrograms,
          sortGroups,
          page,
          sortColumn,
          direction,
        } = props;
        const programsId = map(sortPrograms, (item: any) => item.value);
        const groupsId = map(sortGroups, (item: any) => item.value);
        const param = {
          page: Number(page) + 1,
          search: searchText,
          isMore: true,
          programs: programsId,
          groups: groupsId,
          sort_by: direction ? 'asc' : 'desc',
          sort_type: sortColumn,
        };
        props.getListReaders(param as IFilterParam, cb);
      }
    },
    onListReadersRefresh: (props: any) => (cb?: any) => {
      if (!props.readersLoading) {
        const {
          searchText,
          sortPrograms,
          sortGroups,
          page,
          sortColumn,
          direction,
        } = props;
        const programsId = map(sortPrograms, (item: any) => item.value);
        const groupsId = map(sortGroups, (item: any) => item.value);
        const param = {
          page: Number(page),
          search: searchText,
          programs: programsId,
          groups: groupsId,
          sort_by: direction ? 'asc' : 'desc',
          sort_type: sortColumn,
        };
        props.getListReaders(param as IFilterParam, cb);
      }
    },
  }),
  lifecycle<any, any>({
    componentDidMount() {
      const { sortColumn, direction, profileId } = this.props;
      const param = {
        sort_by: direction ? 'asc' : 'desc',
        sort_type: sortColumn,
      };
      this.props.getListReaders(param as IFilterParam);
      this.props.getAuthorizedUser(profileId);
      this.props.getAllPrograms();
      this.props.getAllOrganizerGroups();
    },
    componentWillReceiveProps(nextProps) {
      if (get(nextProps, 'readers.current_page') !== this.props.page) {
        this.props.setPage(get(nextProps, 'readers.current_page'));
      }
    },
  })
)(ManageReaders);
