import { connect } from 'react-redux';
import { IReduxState } from 'src/store/reducers';
import idx from 'idx';
import themr from 'src/helpers/themr';
import { getAllOrganizerGroups } from 'src/store/actions/organizer/group';
import {
  getUserLeaderboard,
  resetUserLeaderboard,
} from 'src/store/actions/share';
import styles from './styles.scss';
import HtmlBadges, { HtmlBadgesProps } from './HtmlBadges';

export default connect(
  (state: IReduxState) => {
    return {
      programs: idx(state, x => x.organizer.program.programs.data) || [],
      programsLoading: idx(state, x => x.organizer.program.programs.loading),
      groups: idx(state, x => x.organizer.group.allGroups.data) || [],
      groupsLoading: idx(state, x => x.organizer.group.allGroups.loading),
      auth: idx(state, x => x.auth.profile.data),
      share: idx(state, x => x.share),
      userLeaderboard: idx(state, x => x.share.userLeaderboard.data) || [],
      userLeaderboardLoading: idx(state, x => x.share.userLeaderboard.loading),
      badgesAccount: idx(
        state,
        x => x.auth.profile.data.attributes.organization.badges
      ),
      organizationName:
        idx(state, x => x.auth.profile.data.attributes.organization.name) || '',
      organizationId:
        idx(
          state,
          x => x.auth.profile.data.relationships.organization.data.id
        ) || '',
    };
  },
  {
    getAllOrganizerGroups,
    getUserLeaderboard,
    resetUserLeaderboard,
  }
)(themr<HtmlBadgesProps>('HtmlBadges', styles)(HtmlBadges));
