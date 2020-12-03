import { compose, withHandlers, lifecycle } from 'recompose';
import themr from 'src/helpers/themr';
import { IReduxState } from 'src/store/reducers';
import { connect } from 'react-redux';
import { map, uniq, pick, get, filter } from 'lodash';
import idx from 'idx';
import { getReader, updateReader } from 'src/store/actions/organizer/reader';
import { getUserQuestions } from 'src/store/actions/organizer/questions';
import { IUpdateReaderData } from 'src/api';
import { UserRole } from 'src/store/types/organizer/reader';
import UpdateReaderModal, {
  UpdateReaderModalProps,
  UpdateReaderModalOutProps,
} from './view';
import styles from './styles.scss';

export default compose<UpdateReaderModalProps, UpdateReaderModalOutProps>(
  themr<UpdateReaderModalProps>('EditReaderModal', styles),
  connect(
    (state: IReduxState, props: UpdateReaderModalOutProps) => {
      const { programId, groupId } = props;
      const programGroups = idx(state, x => x.organizer.group.programGroups);
      const updateReaderLoading = idx(
        state,
        x => x.organizer.reader.updateReader[props.reader.user_id].loading
      );
      const organizationId = idx(
        state,
        x => x.auth.profile.data.relationships.organization.data.id
      );
      const readerData = get(
        state,
        'organizer.reader.reader.data.user_data',
        {}
      );
      const parentData = get(
        state,
        'organizer.reader.reader.data.parent_data',
        null
      );
      // have to change
      const trophies = get(state, 'organizer.reader.reader.data.trophies', []);

      const childData = get(
        state,
        'organizer.reader.reader.data.child_data',
        []
      );
      const parentProgram = get(
        state,
        'organizer.reader.reader.data.parent_program',
        []
      );
      const readerProgramGroup = get(
        state,
        'organizer.reader.reader.data.program_group',
        []
      );
      const notes = get(state, 'organizer.reader.reader.data.notes', []);

      const readerLoading = idx(state, x => x.organizer.reader.reader.loading);
      const profileId = idx(state, x => x.auth.profile.data.id);
      const access = idx(state, x => x.organizer.users.usersAccess.data);
      const userQuestions = idx(
        state,
        x => x.organizer.questions.userQuestions.data
      );
      const userQuestionsLoading = idx(
        state,
        x => x.organizer.questions.userQuestions.loading
      );
      const userAccessProgram = get(
        access,
        `access.${profileId}[0].attributes.access.${organizationId}`,
        {}
      );
      const profile = idx(state, x => x.auth.profile.data);
      const role =
        get(profile, 'attributes.organization_role') === 'owner'
          ? 'owner'
          : get(profile, 'relationships.roles.data[0].id');
      const accessGroupByProgram = get(
        userAccessProgram,
        `group_by_program[${programId}][${groupId}]`,
        {}
      );
      return {
        programGroups,
        updateReaderLoading,
        organizationId,
        readerData,
        parentData,
        trophies,
        notes,
        readerLoading,
        childData,
        parentProgram,
        readerProgramGroup,
        userAccessProgram,
        accessGroupByProgram,
        role,
        userQuestions,
        userQuestionsLoading,
      };
    },
    { updateReader, getReader, getUserQuestions }
  ),
  withHandlers<any, any>({
    onSaveReader: (props: any) => (values: any) => {
      const readerId = get(props, 'reader.user_id');
      const userRole = get(props, 'reader.role');
      const programGroup = idx(values, x => x.programGroup || []);
      const groups = uniq(map(programGroup, (item: any) => item.group));

      let data = {} as any;
      if (userRole === UserRole.Parent) {
        const childProgramGroup = map(
          values.childProgramGroup,
          (child: any) => {
            const childGroups = map(
              child.programGroupData,
              (childGroup: any) => childGroup.group
            );
            return {
              ...pick(child, ['first_name', 'last_name', 'email', 'id']),
              groups: childGroups,
            };
          }
        );
        const programs = uniq(map(values.programs, (item: any) => item.value));
        data = {
          ...pick(values, ['first_name', 'last_name', 'email']),
          programs,
          new_child_data: filter(
            childProgramGroup,
            (child: any) => !get(child, 'id')
          ),
          child_data: filter(childProgramGroup, (child: any) =>
            get(child, 'id')
          ),
        };
      } else {
        data = {
          ...pick(values, ['first_name', 'last_name', 'email']),
          parent_data: values.parentData,
          groups,
        };
      }
      const userQuestionsData = pick(values, [
        'birthday',
        'grade_level',
        'school',
        'library_card_number',
        'address1',
        'address2',
        'city',
        'state',
        'zip',
        'country',
        'phone',
      ]);
      const userQuestionsPayload = {
        answers: [
          {
            id: '1',
            type: 'object',
            answer: {
              phone: userQuestionsData.phone,
              address1: userQuestionsData.address1,
              address2: userQuestionsData.address2,
              city: userQuestionsData.city,
              state: userQuestionsData.state,
              zip: userQuestionsData.zip,
              country: userQuestionsData.country,
            },
          },
          { id: '2', type: 'date', answer: userQuestionsData.birthday },
          {
            id: '3',
            type: 'string',
            answer: userQuestionsData.library_card_number,
          },
          { id: '4', type: 'string', answer: userQuestionsData.school },
          { id: '5', type: 'string', answer: userQuestionsData.grade_level },
        ],
      };
      props.updateReader(
        readerId,
        { ...data, ...userQuestionsPayload } as IUpdateReaderData,
        () => {
          props.onListReadersRefresh();
          props.getUserQuestions(readerId);
          if (props.afterUpdateReader) {
            props.afterUpdateReader();
          }
        }
      );
    },
  }),
  lifecycle<any, any>({
    async componentDidMount() {
      const readerId = get(this.props, 'reader.user_id');
      await this.props.getReader(readerId);
      await this.props.getUserQuestions(readerId);
    },
    async componentWillReceiveProps(nextProps) {
      if (
        get(this.props, 'reader.user_id') !== get(nextProps, 'reader.user_id')
      ) {
        const readerId = get(nextProps, 'reader.user_id');
        await this.props.getReader(readerId);
        await this.props.getUserQuestions(readerId);
      }
    },
  })
)(UpdateReaderModal);
