import { connect } from 'react-redux';
import themr from 'src/helpers/themr';
import { IReduxState } from 'src/store/reducers';
import idx from 'idx';
import { compose } from 'recompose';
import UpdateReaderForm, {
  UpdateReaderFormProps,
  UpdateReaderFormOutProps,
} from './UpdateReaderForm';
import styles from './styles.scss';

export default compose<UpdateReaderFormProps, UpdateReaderFormOutProps>(
  themr<UpdateReaderFormProps>('UpdateReaderForm', styles),
  connect(
    (state: IReduxState) => {
      const programGroups = idx(state, x => x.organizer.group.programGroups);
      const programs = idx(state, x => x.organizer.program.programs.data);
      return {
        programGroups,
        programs,
      };
    },
    {}
  )
)(UpdateReaderForm);
