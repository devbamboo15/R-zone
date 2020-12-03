import { connect } from 'react-redux';
import { compose } from 'recompose';
import themr from 'src/helpers/themr';
import idx from 'idx';
import { IReduxState } from 'src/store/reducers';
import { doUpdateAccount, getUserSocialDetail } from 'src/store/actions/auth';
import { withRouter } from 'react-router-dom';
import SocialMedia, { SocialMediaProps } from './SocialMedia';
import styles from './styles.scss';

export default compose(
  withRouter,
  themr<SocialMediaProps>('SocialMedia', styles),
  connect(
    (state: IReduxState) => ({
      profile: idx(state, x => x.auth.profile.data.attributes) || {},
      isSaving: idx(state, x => x.auth.profile.inProgress) || false,
      userSocial: idx(state, x => x.auth.user_social.data) || {},
    }),
    {
      doUpdateAccount,
      getUserSocialDetail,
    }
  )
)(SocialMedia);
