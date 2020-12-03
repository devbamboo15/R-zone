import { connect } from 'react-redux';
import { IReduxState } from 'src/store/reducers';
import idx from 'idx';
import { getAllPrograms } from 'src/store/actions/organizer/program';
import { getShares, chooseProgram } from 'src/store/actions/share';
import themr from 'src/helpers/themr';

import Share, { ShareProps } from './Share';
import styles from './styles.scss';

export default connect(
  (state: IReduxState) => {
    return {
      organizationId: idx(
        state,
        x => x.auth.profile.data.relationships.organization.data.id
      ),
      programs: idx(state, x => x.organizer.program.programs.data) || [],
      share: idx(state, x => x.share),
      auth: idx(state, x => x.auth.profile.data),
    };
  },
  {
    getAllPrograms,
    getShares,
    chooseProgram,
  }
)(themr<ShareProps>('Share', styles)(Share));
