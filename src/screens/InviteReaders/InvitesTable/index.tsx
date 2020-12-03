import themr from 'src/helpers/themr';
import { connect } from 'react-redux';
import { get, filter, keys, includes, forEach } from 'lodash';
import { compose, withState, withHandlers, lifecycle } from 'recompose';
import { UserForm } from 'src/components/Forms/InviteUserForm';
import { IReduxState } from 'src/store/reducers';
import idx from 'idx';
import { getAllPrograms } from 'src/store/actions/organizer/program';
import { getUserRoles } from 'src/store/actions/role';
import { sendInviteReaders } from 'src/store/actions/organizer/invite';
import styles from './styles.scss';
import InvitesTable, {
  InvitesTableProps,
  ComponentProps,
} from './InvitesTable';

export default compose<InvitesTableProps, ComponentProps>(
  themr<InvitesTableProps>('InvitesTable', styles),
  withState('currentRowAction', 'setCurrentRowAction', null),
  withState('currentRowEdit', 'setCurrentRowEdit', null),
  withState('inviteProgramId', 'setInviteProgramId', null),
  withHandlers({
    onDelete: () => (id: number) => {
      return id;
    },
    onFormSubmit: () => (values: UserForm) => {
      return values;
    },
  }),
  connect(
    (state: IReduxState) => {
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
      const programGroups = {};
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
              }
            }

            return {
              label: val.attributes.name,
              value: val.id,
              data: val,
            };
          })
        ) || [];

      const listProgram = keys(programGroups);
      const programSelected = filter(programs, item =>
        includes(listProgram, get(item, `value`))
      );
      const roles =
        idx(state, x =>
          x.role.roles.data.map(val => ({
            label: val.attributes.title,
            value: val.id,
            data: val,
          }))
        ) || [];

      const profile = idx(state, x => x.auth.profile) || {};
      const loading =
        idx(state, x => x.organizer.invite.invites.loading) || false;
      const isInviteSaved =
        idx(state, x => x.organizer.invite.invites.isInviteSaved) || false;

      return {
        roles,
        programs: programSelected,
        profile,
        programGroups,
        loading,
        isInviteSaved,
      };
    },
    {
      getAllPrograms,
      getUserRoles,
      sendInviteReaders,
    }
  ),
  lifecycle<any, any>({
    componentWillMount() {
      this.props.onMessage(null); // clear alert message
    },
    componentDidMount() {
      this.props.getAllPrograms();
      this.props.getUserRoles();
    },
  })
)(InvitesTable);
