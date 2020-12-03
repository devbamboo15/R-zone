import { compose, withHandlers } from 'recompose';
import themr from 'src/helpers/themr';
import { IReduxState } from 'src/store/reducers';
import { connect } from 'react-redux';
import { get } from 'lodash';
import { previewInviteReader } from 'src/store/actions/organizer/invite';
import { IPreviewInviteReaderData } from 'src/api';
import PreviewEmailBookModal, {
  PreviewEmailModalProps,
  PreviewEmailModalOutProps,
} from './view';
import styles from './styles.scss';

export default compose<PreviewEmailModalProps, PreviewEmailModalOutProps>(
  themr<PreviewEmailModalProps>('PreviewEmailModal', styles),
  connect(
    (state: IReduxState) => {
      return {
        isLoading: get(state, 'organizer.invite.preview.loading', false),
        programs: get(state, 'organizer.program.programs.data') || [],
        orgName:
          get(state, 'auth.profile.data.attributes.organization.name') ||
          'Ventive',
      };
    },
    { previewInviteReader }
  ),
  withHandlers<any, any>({
    onSave: (props: any) => (data: IPreviewInviteReaderData) => {
      props.previewInviteReader({
        ...data,
      });
    },
  })
)(PreviewEmailBookModal);
