import { connect } from 'react-redux';
import { IReduxState } from 'src/store/reducers';
import idx from 'idx';
import themr from 'src/helpers/themr';
import { getAllPrograms } from 'src/store/actions/organizer/program';
import { getShares, chooseProgram } from 'src/store/actions/share';
import styles from './styles.scss';
import Twitter, { TwitterProps } from './Twitter';

export default connect(
  (state: IReduxState) => {
    return {
      programs: idx(state, x => x.organizer.program.programs.data) || [],
      share: idx(state, x => x.share),
    };
  },
  {
    getAllPrograms,
    getShares,
    chooseProgram,
  }
)(themr<TwitterProps>('Twitter', styles)(Twitter));
