import themr from 'src/helpers/themr';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import { doRegister } from 'src/store/actions/auth';
import { IReduxState } from 'src/store/reducers';
import idx from 'idx';
import { withRouter } from 'react-router-dom';
import styles from '../styles.scss';
import OneLastThing, { OneLastThingProps } from './OneLastThing';

export default compose<OneLastThingProps, OneLastThingProps>(
  withRouter,
  themr<OneLastThingProps>('OneLastThing', styles),
  connect(
    (state: IReduxState) => ({
      registerInProgress: idx(state, x => x.auth.register.inProgress),
    }),
    {
      doRegister,
    }
  )
)(OneLastThing);
