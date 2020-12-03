import { connect } from 'react-redux';
import { compose, lifecycle } from 'recompose';
import { IReduxState } from 'src/store/reducers';
import { get, filter, keys, includes, forEach } from 'lodash';
import idx from 'idx';
import themr from 'src/helpers/themr';
import { getAllFeeds, getOverviews } from 'src/store/actions/reports';
import { getOrganizationProgress } from 'src/store/actions/organizer/organizations';
import { getAllOrganizerGroups } from 'src/store/actions/organizer/group';
import { getAuthorizedUser } from 'src/store/actions/organizer/users';
import {
  getListReaders,
  getAllReadersWithoutPagination,
} from 'src/store/actions/organizer/reader';
import { getAllPrograms } from 'src/store/actions/organizer/program';
import { getMultipleUserQuestions } from 'src/store/actions';
import styles from './styles.scss';
import Reports, { ReportsProps } from './Reports';

export default compose(
  themr<ReportsProps>('Reports', styles),
  connect(
    (state: IReduxState) => {
      const organizationProgress =
        idx(state, x => x.organizer.organizations.organizationProgress.data) ||
        {};
      const metricsLoading = idx(
        state,
        x => x.organizer.organizations.organizationProgress.loading
      );
      const organizationId = idx(
        state,
        x => x.auth.profile.data.relationships.organization.data.id
      );
      const overviews = get(state, 'reports.overviews.data') || {};
      const overviewsLoading = get(state, 'reports.overviews.loading');
      const profileId = idx(state, x => x.auth.profile.data.id);
      const access = idx(state, x => x.organizer.users.usersAccess.data);
      const userAccessProgram = get(
        access,
        `access.${profileId}[0].attributes.access.${organizationId}`,
        {}
      );
      const programGroups = {};
      const groupSelected = [];
      const programs =
        idx(state, x =>
          x.organizer.program.programs.data.map(val => {
            const groups =
              idx(state, y =>
                y.organizer.group.programGroups[val.id].data.map(group => ({
                  label: group.attributes.name,
                  value: group.id,
                  data: group,
                }))
              ) || [];

            const listGroups = get(
              userAccessProgram,
              `group_by_program[${val.id}]`
            );
            const filterGroup = [];
            forEach(listGroups, (item, groupId) => {
              if (get(item, 'write') === true) {
                filterGroup.push(groupId);
              }
            });

            if (filterGroup.length > 0) {
              const selectedGroup = filter(groups, item =>
                includes(filterGroup, get(item, `value`))
              );
              if (selectedGroup.length > 0) {
                programGroups[val.id] = selectedGroup;
                forEach(selectedGroup, item => {
                  groupSelected.push({
                    group_id: item.value,
                    group_name: item.label,
                  });
                });
              }
            }

            return {
              label: val.attributes.name,
              id: val.id,
              data: val,
            };
          })
        ) || [];

      const listProgram = keys(programGroups);
      const programSelected = filter(programs, item =>
        includes(listProgram, get(item, `id`))
      );

      return {
        profileId,
        organizationId,
        feeds: idx(state, x => x.reports.feeds.data) || {},
        feedsLoading: idx(state, x => x.reports.feeds.loading),
        overviews,
        overviewsLoading,
        organizationProgress,
        metricsLoading,
        // programs: idx(state, x => x.organizer.program.programs.data) || [],
        // groups: idx(state, x => x.organizer.group.allGroups.data) || [],
        programs: programSelected,
        groups: groupSelected,
        readers: idx(state, x => x.organizer.reader.allReaders.data.data) || [],
        allReaders:
          idx(
            state,
            x => x.organizer.reader.allReadersWithoutPagination.data
          ) || [],
      };
    },
    {
      getAuthorizedUser,
      getAllFeeds,
      getOrganizationProgress,
      getAllPrograms,
      getAllOrganizerGroups,
      getListReaders,
      getOverviews,
      getAllReadersWithoutPagination,
      getMultipleUserQuestions,
    }
  ),
  lifecycle<any, any>({
    componentDidMount() {
      const { profileId } = this.props;
      this.props.getAuthorizedUser(profileId);
    },
  })
)(Reports);
