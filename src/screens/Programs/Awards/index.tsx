import themr from 'src/helpers/themr';
import { connect } from 'react-redux';
import { compose, lifecycle } from 'recompose';
import { IReduxState } from 'src/store/reducers';
import idx from 'idx';
import get from 'lodash/get';
import {
  getProgramAwards,
  updateAwards,
  getAwardsPreview,
  restoreDefaultAwards,
  getGroupAwards,
  updateAwardsAvatar,
  deleteAwardsAvatar,
} from 'src/store/actions/organizer/awards';

import AwardsModal, { Props } from './view';
import styles from './styles.scss';

export default compose<Props, Props>(
  themr<Props>('AwardsModal', styles),
  connect(
    (state: IReduxState, props: any) => {
      const awardsState = idx(state, x => x.organizer.awards.programAwards);
      const updateAwardsState = idx(
        state,
        x => x.organizer.awards.updateAwards
      );
      const awardsPreviewState = idx(
        state,
        x => x.organizer.awards.awardsPreview
      );
      const { match } = props;
      const programId = get(match, 'params.programId');
      const groups =
        idx(state, x => x.organizer.group.programGroups[programId].data) || [];
      const deleteAwardAvatarLoading = get(
        state,
        'organizer.awards.deleteAwardsAvatar.loading'
      );
      const updateAwardAvatarLoading = get(
        state,
        'organizer.awards.updateAwardsAvatar.loading'
      );
      const updateAwardAvatarSuccess = get(
        state,
        'organizer.awards.updateAwardsAvatar.status'
      );
      const restoreDefaultAwardLoading = get(
        state,
        'organizer.awards.restoreDefaultAwards.loading'
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
        groups,
        awardsState,
        updateAwardsState,
        awardsPreviewState,
        deleteAwardAvatarLoading,
        updateAwardAvatarLoading,
        updateAwardAvatarSuccess,
        restoreDefaultAwardLoading,
        userAccessProgram,
      };
    },
    {
      getProgramAwards,
      updateAwards,
      getAwardsPreview,
      restoreDefaultAwards,
      getGroupAwards,
      updateAwardsAvatar,
      deleteAwardsAvatar,
    }
  ),
  lifecycle<any, any>({
    componentDidMount() {
      const { match, groups } = this.props;
      const { programId, groupId } = match.params;
      if (groupId) {
        this.props.getGroupAwards(programId, [groupId]);
      } else if (programId) {
        const firstGroup = groups[0] || {};
        const firstGroupId = get(firstGroup, 'id', '');
        if (firstGroupId) {
          this.props.getGroupAwards(programId, [firstGroupId]);
        } else {
          this.props.getProgramAwards(programId);
        }
      }
    },
  })
)(AwardsModal);
