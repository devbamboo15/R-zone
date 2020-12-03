import themr from 'src/helpers/themr';
import { compose, withState, lifecycle } from 'recompose';
import { connect } from 'react-redux';
import { IReduxState } from 'src/store/reducers';
import idx from 'idx';
import { getInviteReaders } from 'src/store/actions/organizer/invite';
import ManualInvite, {
  ManualInviteProps,
  ComponentProps,
  InviteType,
} from './ManualInvite';
import styles from './styles.scss';

export default compose<ManualInviteProps, ComponentProps>(
  themr<ManualInviteProps>('ManualInvite', styles),
  withState('isShowMode', 'setIsShowMode', InviteType.INVITES),
  connect(
    (state: IReduxState) => {
      const profile = idx(state, x => x.auth.profile) || {};
      const invitedUsers =
        idx(state, x => x.organizer.invite.invited.data) || [];
      const loading =
        idx(state, x => x.organizer.invite.invited.loading) || false;
      return {
        profile,
        invitedUsers,
        loading,
      };
    },
    {
      getInviteReaders,
    }
  ),
  lifecycle<any, any>({
    componentDidMount() {
      // this.props.getInviteReaders({
      //   user_id: this.props.profile.data.id,
      //   page: 1,
      //   programs: [],
      //   groups: [],
      //   roles: [],
      // });
    },
  })
)(ManualInvite);
