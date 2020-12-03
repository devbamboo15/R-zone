import { connect } from 'react-redux';
import { IReduxState } from 'src/store/reducers';
import idx from 'idx';
import themr from 'src/helpers/themr';
import { getAllPrograms } from 'src/store/actions/organizer/program';
import { getShares } from 'src/store/actions/share';
import styles from './styles.scss';
import HtmlBadges, { HtmlBadgesProps } from './HtmlBadges';

export default connect(
  (state: IReduxState) => {
    return {
      programs: idx(state, x => x.organizer.program.programs.data) || [],
      share: idx(state, x => x.share),
      auth: idx(state, x => x.auth.profile.data),
    };
  },
  {
    getAllPrograms,
    getShares,
  }
)(themr<HtmlBadgesProps>('HtmlBadges', styles)(HtmlBadges));
