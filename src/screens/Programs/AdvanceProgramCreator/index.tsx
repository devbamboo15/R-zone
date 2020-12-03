import themr from 'src/helpers/themr';
import { connect } from 'react-redux';
import { compose, lifecycle, withHandlers } from 'recompose';
import get from 'lodash/get';
import { IReduxState } from 'src/store/reducers';
import {
  createAdvancedProgram,
  updateAdvancedProgram,
  getNewProgramCode,
  cloneProgram,
} from 'src/store/actions/organizer/program';
import idx from 'idx';
import { getAllProgramGroups } from 'src/store/actions/organizer/group';
import AdvancedProgramCreator, { Props } from './view';
import styles from './styles.scss';

export default compose<Props, Props>(
  themr<Props>('AdvancedProgramCreator', styles),
  connect(
    (state: IReduxState, props: Props) => {
      const programCreationInProgress = idx(
        state,
        x => x.organizer.program.createAdvancedProgram.isInProgress
      );
      const programCreationSuccess = idx(
        state,
        x => x.organizer.program.createAdvancedProgram.success
      );

      const programEditionInProgress = idx(
        state,
        x => x.organizer.program.updateAdvancedProgram.isInProgress
      );

      const programs = idx(state, x => x.organizer.program.programs);
      const { match } = props;
      let currentProgram = {};
      if (programs && programs.data && match.params.programId) {
        const currentProgramArr = programs.data.filter(
          program => program.id.toString() === match.params.programId.toString()
        );
        if (currentProgramArr[0]) {
          const currentProgramObject = currentProgramArr[0];
          currentProgram = currentProgramObject;
        }
      }

      const programGroup = idx(
        state,
        x => x.organizer.group.programGroups[match.params.programId].data
      );
      const programGroupLoading = idx(
        state,
        x => x.organizer.group.programGroups[match.params.programId].loading
      );
      const programCode = idx(state, x => x.organizer.program.programCode.data);
      const programCodeLoading = idx(
        state,
        x => x.organizer.program.programCode.loading
      );
      const cloneProgramLoading = idx(
        state,
        x => x.organizer.program.cloneProgram.loading
      );
      const signupQuestions = idx(
        state,
        x => x.organizer.questions.questions.data
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

      return {
        programCreationInProgress,
        programCreationSuccess,
        programEditionInProgress,
        currentProgram,
        programGroup,
        programGroupLoading,
        programCode,
        programCodeLoading,
        cloneProgramLoading,
        signupQuestions,
        userAccessProgram,
      };
    },
    {
      createAdvancedProgram,
      getAllProgramGroups,
      updateAdvancedProgram,
      getNewProgramCode,
      cloneProgram,
    }
  ),
  withHandlers({
    saveProgram: (props: any) => (values, programId, cb?: Function) => {
      const groups = [];
      const goals = [];
      const books = [];
      const rows = get(values, 'rows', []);
      for (let index = 0; index < rows.length; index++) {
        const row = rows[index];
        const booksObj = get(row, 'books', []).map(book => ({
          id: book.id,
          read_once: book.read_once,
        }));
        const group = get(row, 'attributes', {});
        const groupId = get(row, 'id', '');
        if (groupId) {
          group.id = groupId;
        } else if (programId) {
          group.id = '0';
        }
        groups.push(group);
        goals.push(get(row, 'goal.attributes', {}));
        books.push(booksObj.length > 0 ? booksObj : {});
      }
      const dataToSubmit = {
        program: {
          name: idx(values, x => x.name),
          reading_log: idx(values, x => x.readingLog),
          code: idx(values, x => x.code),
        },
        group: groups,
        goal: goals,
        book: books,
      };
      if (programId) {
        props.updateAdvancedProgram(programId, dataToSubmit, cb);
      } else {
        props.createAdvancedProgram(dataToSubmit as any, cb);
      }
    },
  }),
  lifecycle<any, any>({
    componentDidMount() {
      const { match } = this.props;
      const { params } = match;
      if (params.programId) {
        this.props.getAllProgramGroups(params.programId);
      }
    },
  })
)(AdvancedProgramCreator);
