import { connect } from 'react-redux';
import { IReduxState } from 'src/store/reducers';
import idx from 'idx';
import { getAllPrograms } from 'src/store/actions/organizer/program';
import themr from 'src/helpers/themr';

import ProgressBadges, { ProgressBadgesProps } from './ProgressBadges';
import styles from './styles.scss';

export default connect(
  (state: IReduxState) => {
    return {
      organizationId: idx(
        state,
        x => x.auth.profile.data.relationships.organization.data.id
      ),
      programs: idx(state, x => x.organizer.program.programs.data) || [],
      auth: idx(state, x => x.auth.profile.data),
      share: idx(state, x => x.share),
    };
  },
  {
    getAllPrograms,
  }
)(themr<ProgressBadgesProps>('ProgressBadges', styles)(ProgressBadges));
