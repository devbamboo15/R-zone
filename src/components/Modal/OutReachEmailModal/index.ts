import { compose, withHandlers, lifecycle } from 'recompose';
import themr from 'src/helpers/themr';
import { IReduxState } from 'src/store/reducers';
import { connect } from 'react-redux';
import { get, filter } from 'lodash';
import { getAllProgramGroups } from 'src/store/actions/organizer/group';
import {
  sendEmailToParticipants,
  getAllProgramsWithoutPagination,
} from 'src/store/actions/organizer/program';
import { getAllReadersWithoutPagination } from 'src/store/actions/organizer/reader';
import { ISendEmailToParticipantsData } from 'src/api';
import OutReachEmailModal, {
  OutReachEmailModalProps,
  OutReachEmailModalOutProps,
} from './view';
import styles from './styles.scss';

export default compose<OutReachEmailModalProps, OutReachEmailModalOutProps>(
  themr<OutReachEmailModalProps>('OutReachEmailModal', styles),
  connect(
    (state: IReduxState) => {
      const allReaders = filter(
        get(state, 'organizer.reader.allReadersWithoutPagination.data'),
        user => user.email
      );
      const allPrograms = filter(
        get(state, 'organizer.program.allPrograms.data')
      );
      const programs = get(state, 'organizer.program.programs.data') || [];
      const programGroups = get(state, 'organizer.group.programGroups') || [];
      return {
        isLoading:
          get(
            state,
            'organizer.reader.allReadersWithoutPagination.loading',
            false
          ) ||
          get(state, 'organizer.program.sendEmailParticipant.loading', false),
        allReaders,
        allPrograms,
        programs,
        programGroups,
        orgName:
          get(state, 'auth.profile.data.attributes.organization.name') ||
          'Ventive',
      };
    },
    {
      getAllProgramGroups,
      sendEmailToParticipants,
      getAllReadersWithoutPagination,
      getAllProgramsWithoutPagination,
    }
  ),
  withHandlers<any, any>({
    onSave: (props: any) => (data: ISendEmailToParticipantsData) => {
      props.sendEmailToParticipants(data);
    },
    onSelectProgram: (props: any) => (programId: any) => {
      props.getAllProgramGroups(programId);
    },
  }),
  lifecycle<any, any>({
    componentDidMount() {
      this.props.getAllReadersWithoutPagination();
      this.props.getAllProgramsWithoutPagination();
    },
  })
)(OutReachEmailModal);
