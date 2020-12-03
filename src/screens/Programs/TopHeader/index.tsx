import themr from 'src/helpers/themr';
import { connect } from 'react-redux';
import { compose, lifecycle } from 'recompose';
import { getOrganizationProgress } from 'src/store/actions/organizer/organizations';
import { IReduxState } from 'src/store/reducers';
import idx from 'idx';
import styles from '../styles.scss';
import TopHeader, { TopHeaderProps } from './TopHeader';

export default compose<TopHeaderProps, TopHeaderProps>(
  themr<TopHeaderProps>('TopHeader', styles),
  connect(
    (state: IReduxState) => {
      const organizationProgress =
        idx(state, x => x.organizer.organizations.organizationProgress.data) ||
        {};
      const loading = idx(
        state,
        x => x.organizer.organizations.organizationProgress.loading
      );

      return {
        organizationProgress,
        loading,
      };
    },
    {
      getOrganizationProgress,
    }
  ),
  lifecycle<any, any>({
    componentDidMount() {
      const { programId, groupId } = this.props;
      const filterDataRequest = {
        interval: 'overall',
      };
      this.props.getOrganizationProgress(programId, groupId, filterDataRequest);
    },
  })
)(TopHeader);
