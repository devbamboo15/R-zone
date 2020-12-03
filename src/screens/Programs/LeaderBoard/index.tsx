import themr from 'src/helpers/themr';
import { connect } from 'react-redux';
import { compose, lifecycle } from 'recompose';
import { IReduxState } from 'src/store/reducers';
import idx from 'idx';
import get from 'lodash/get';
import {
  getProgramLeaderboard,
  getGroupLeaderboard,
} from 'src/store/actions/organizer/awards';
import styles from './styles.scss';
import LeaderBoard, { Props } from './view';

export default compose<Props, Props>(
  themr<Props>('LeaderBoard', styles),
  connect(
    (state: IReduxState) => {
      const leaderboard =
        idx(state, x => x.organizer.awards.leaderboard.data) || [];
      const leaderboardLoading = idx(
        state,
        x => x.organizer.awards.leaderboard.loading
      );

      return {
        leaderboard,
        leaderboardLoading,
      };
    },
    {
      getProgramLeaderboard,
      getGroupLeaderboard,
    }
  ),
  lifecycle<any, any>({
    componentDidMount() {
      const { match } = this.props;
      const programId = get(match, 'params.programId');
      const groupId = get(match, 'params.groupId');
      if (groupId) {
        this.props.getGroupLeaderboard(programId, groupId);
      } else {
        this.props.getProgramLeaderboard(programId);
      }
    },
  })
)(LeaderBoard);
