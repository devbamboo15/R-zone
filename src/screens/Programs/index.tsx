import themr from 'src/helpers/themr';
import { connect } from 'react-redux';
import { compose, lifecycle, withState, withHandlers } from 'recompose';
import {
  getAllPrograms,
  deleteProgram,
  updateProgram,
  searchPrograms,
  resetSearchPrograms,
  getNewProgramCode,
} from 'src/store/actions/organizer/program';
import { getSignUpQuestions } from 'src/store/actions/organizer/questions';
import { IProgramFilterType } from 'src/api/program';
import { getAuthorizedUser } from 'src/store/actions/organizer/users';
import { setFirstPayment } from 'src/store/actions/plans';
import tableStyles from 'src/components/Table/styles.scss';
import { IReduxState } from 'src/store/reducers';
import idx from 'idx';
import get from 'lodash/get';
import { getOrganizationProgress } from 'src/store/actions/organizer/organizations';
import styles from './styles.scss';
import Programs, { ProgramsProps } from './Programs';

export default compose<ProgramsProps, ProgramsProps>(
  themr<ProgramsProps>('Programs', { ...styles, tableStyles }),
  withState('searchText', 'setSearchText', ''),
  withState('direction', 'setDirection', true),
  withState('sortColumn', 'setSortColumn', 'name'),
  connect(
    (state: IReduxState) => {
      let programs = [];
      let programsWithIncluded = {};
      const searchProgramsText = idx(
        state,
        x => x.organizer.program.searchPrograms.text
      );
      if (
        searchProgramsText &&
        idx(state, x => x.organizer.program.searchPrograms.data)
      ) {
        programs =
          idx(state, x => x.organizer.program.searchPrograms.data) || [];
        programsWithIncluded =
          idx(
            state,
            x => x.organizer.program.searchPrograms.dataWithIncluded
          ) || {};
      } else {
        programs = idx(state, x => x.organizer.program.programs.data) || [];
        programsWithIncluded =
          idx(state, x => x.organizer.program.programs.dataWithIncluded) || {};
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

      const programsLoading =
        idx(state, x => x.organizer.program.searchPrograms.loading) ||
        idx(state, x => x.organizer.program.programs.loading);
      const programsReset = idx(state, x => x.organizer.program.programs.reset);

      return {
        createProgramAdvanceSuccess: idx(
          state,
          x => x.organizer.program.createAdvancedProgram.success
        ),
        createProgramSuccess: idx(
          state,
          x => x.organizer.program.createProgram.success
        ),
        profileId,
        searchProgramsText,
        userAccessProgram,
        programs,
        programsWithIncluded,
        programsLoading,
        programsReset,
        programsMorePage: idx(
          state,
          x => x.organizer.program.programs.morePage
        ),
        deleteProgramData: idx(state, x => x.organizer.program.deleteProgram),
        updateProgramData: idx(state, x => x.organizer.program.updateProgram),
        programCodeLoading: idx(
          state,
          x => x.organizer.program.programCode.loading
        ),
        organizationId: idx(
          state,
          x => x.auth.profile.data.relationships.organization.data.id
        ),
        firstPayment: idx(state, x => x.plans.firstPayment),
        totalPrograms: idx(state, x => x.organizer.program.programs.total),
      };
    },
    {
      getAllPrograms,
      deleteProgram,
      updateProgram,
      searchPrograms,
      getAuthorizedUser,
      resetSearchPrograms,
      getOrganizationProgress,
      getNewProgramCode,
      setFirstPayment,
      getSignUpQuestions,
    }
  ),
  withHandlers({
    onSortPrograms: (props: any) => (
      page?: number,
      loadMore?: boolean,
      cb?: any
    ) => {
      const order = props.direction ? 'asc' : 'desc';
      const filter: IProgramFilterType = {
        order: `${props.sortColumn}|${order}`,
        page: page || 0,
      };
      props.getAllPrograms(
        {
          ...filter,
          include: 'groups,programProgress',
        },
        loadMore,
        cb
      );
    },
  }),
  lifecycle<any, any>({
    componentDidMount() {
      const { profileId } = this.props;
      this.props.getAuthorizedUser(profileId);
      this.props.getNewProgramCode();
      this.props.getSignUpQuestions();
    },
  })
)(Programs);
