import { connect } from 'react-redux';
import { IReduxState } from 'src/store/reducers';
import idx from 'idx';
import themr from 'src/helpers/themr';
import { getShares, updateShare } from 'src/store/actions/share';
import CustomizeBadge, { CustomizeBadgeProps } from './CustomizeBadge';
import styles from './styles.scss';

export default connect(
  (state: IReduxState) => {
    return {
      programs: idx(state, x => x.organizer.program.programs.data) || [],
      share: idx(state, x => x.share),
    };
  },
  {
    getShares,
    updateShare,
  }
)(themr<CustomizeBadgeProps>('CustomizeBadge', styles)(CustomizeBadge));
